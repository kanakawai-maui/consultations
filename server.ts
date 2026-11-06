import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { z } from 'zod';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// In-memory rate limiting store: IP -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

// In-memory buffer for recorded inquiries (survives when Resend key is not yet configured)
interface RecordedInquiry {
  id: string;
  receivedAt: string;
  businessName: string;
  fullName: string;
  email: string;
  phone?: string;
  island: string;
  industry: string;
  employeeCount?: string;
  timeWasters: string;
  desiredImprovements?: string;
  budgetRange?: string;
  calculatorSummary?: Record<string, any>;
  deliveredLive: boolean;
}

const recentInquiries: RecordedInquiry[] = [];

// Zod validation schema
const inquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  businessName: z.string().trim().min(2, 'Business name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().optional(),
  island: z.string().trim().min(2, 'Please select your island'),
  industry: z.string().trim().min(2, 'Please select your industry or business type'),
  employeeCount: z.string().trim().optional(),
  timeWasters: z.string().trim().min(5, 'Please provide details on what takes up too much time'),
  desiredImprovements: z.string().trim().optional(),
  budgetRange: z.string().trim().optional(),
  calculatorSummary: z.object({
    employees: z.number().optional(),
    hourlyCost: z.number().optional(),
    hoursPerWeek: z.number().optional(),
    automationPct: z.number().optional(),
    weeksPerYear: z.number().optional(),
    implementationCost: z.number().optional(),
    annualRepetitiveCost: z.number().optional(),
    annualSavings: z.number().optional(),
    monthlySavings: z.number().optional(),
    firstYearNetSavings: z.number().optional(),
    paybackPeriodText: z.string().optional(),
    roiPercentText: z.string().optional(),
  }).optional(),
  hp_company_field: z.string().optional(), // Honeypot field for bot detection
});

// Sanitization helper
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: IS_PROD ? 'production' : 'development',
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    contactEmail: process.env.CONTACT_EMAIL || 'rob@olelohonua.com',
  });
});

// Status / Debug inquiries count endpoint (safe, no private PII revealed)
app.get('/api/inquiries/status', (req, res) => {
  res.json({
    totalCount: recentInquiries.length,
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    recentSummary: recentInquiries.slice(-5).map(i => ({
      id: i.id,
      receivedAt: i.receivedAt,
      businessName: i.businessName,
      island: i.island,
      deliveredLive: i.deliveredLive,
    })),
  });
});

// Primary Inquiry API endpoint
app.post('/api/inquire', async (req, res) => {
  try {
    // 1. IP rate limiting
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a few minutes before submitting again or email rob@olelohonua.com directly.',
      });
    }

    // 2. Validate input
    const parseResult = inquirySchema.safeParse(req.body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues?.[0]?.message || 'Invalid form data';
      return res.status(400).json({
        success: false,
        error: firstError,
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const data = parseResult.data;

    // 3. Honeypot spam check (if bot filled in the hidden field)
    if (data.hp_company_field && data.hp_company_field.trim().length > 0) {
      console.warn(`[SPAM DETECTED] Honeypot triggered by IP: ${clientIp}`);
      // Return 200 so spambots don't try alternate attack vectors
      return res.json({
        success: true,
        message: "Got it. Your inquiry has been sent. We'll review what you shared and get back to you.",
      });
    }

    const inquiryId = `oh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const destinationEmail = process.env.CONTACT_EMAIL || 'rob@olelohonua.com';
    const emailFrom = process.env.EMAIL_FROM || 'Olelo Honua <onboarding@resend.dev>';
    const resendApiKey = process.env.RESEND_API_KEY;

    let deliveredLive = false;

    // 4. Build Clean, High-Readability Notification Email
    const calc = data.calculatorSummary;
    const calcSection = calc?.annualSavings
      ? `
        <div style="background-color: #172554; border: 1px solid #1e40af; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="color: #60a5fa; margin-top: 0; margin-bottom: 12px; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em;">Prospect Calculator Estimate</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Employees in Repetitive Work:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${calc.employees ?? 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Avg Hourly Cost (with burden):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">$${calc.hourlyCost ?? 'N/A'}/hr</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Weekly Hours Wasted:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${calc.hoursPerWeek ?? 'N/A'} hrs/wk</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Realistic Automation Target:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${calc.automationPct ?? 'N/A'}%</td>
            </tr>
            <tr style="border-top: 1px solid #1e3a8a;">
              <td style="padding: 8px 0; color: #38bdf8; font-weight: 600;">Est. Annual Savings:</td>
              <td style="padding: 8px 0; text-align: right; color: #38bdf8; font-weight: 700; font-size: 16px;">$${(calc.annualSavings || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Est. Monthly Savings:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">$${(calc.monthlySavings || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Est. Payback Period:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold;">${calc.paybackPeriodText ?? 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Est. 1st Year ROI:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #4ade80;">${calc.roiPercentText ?? 'N/A'}</td>
            </tr>
          </table>
        </div>
      `
      : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Olelo Honua Cost Reduction Inquiry</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; padding: 24px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <div style="border-bottom: 1px solid #1f2937; padding-bottom: 16px; margin-bottom: 20px;">
            <p style="color: #38bdf8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 6px 0;">Olelo Honua — Hawaii Operations</p>
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0;">New Consultation Request</h1>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; width: 140px;">Business:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 600; font-size: 16px;">${sanitizeHtml(data.businessName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Contact Name:</td>
              <td style="padding: 8px 0; color: #ffffff;">${sanitizeHtml(data.fullName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${sanitizeHtml(data.email)}" style="color: #38bdf8; text-decoration: none;">${sanitizeHtml(data.email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Phone:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.phone ? sanitizeHtml(data.phone) : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Location / Island:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${sanitizeHtml(data.island)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Industry:</td>
              <td style="padding: 8px 0; color: #ffffff;">${sanitizeHtml(data.industry)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Team Size:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.employeeCount ? sanitizeHtml(data.employeeCount) : 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;">Est. Budget / Investment:</td>
              <td style="padding: 8px 0; color: #ffffff;">${data.budgetRange ? sanitizeHtml(data.budgetRange) : 'Not specified'}</td>
            </tr>
          </table>

          <div style="background-color: #0b0f17; border: 1px solid #1f2937; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">What takes up too much time:</p>
            <p style="color: #f8fafc; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${sanitizeHtml(data.timeWasters)}</p>
          </div>

          ${
            data.desiredImprovements
              ? `
              <div style="background-color: #0b0f17; border: 1px solid #1f2937; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">What they would most like to improve:</p>
                <p style="color: #f8fafc; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${sanitizeHtml(data.desiredImprovements)}</p>
              </div>
            `
              : ''
          }

          ${calcSection}

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; font-size: 12px; color: #64748b; text-align: center;">
            Sent from Olelo Honua Inquiry Engine &middot; Reply directly to this email to contact ${sanitizeHtml(data.fullName)} (${sanitizeHtml(data.email)})
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
New Olelo Honua Cost Reduction Consultation Request:

Business: ${data.businessName}
Contact Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Island: ${data.island}
Industry: ${data.industry}
Team Size: ${data.employeeCount || 'N/A'}
Investment Range: ${data.budgetRange || 'N/A'}

What takes up too much time:
${data.timeWasters}

Desired Improvements:
${data.desiredImprovements || 'N/A'}

${
  calc?.annualSavings
    ? `Calculator Estimates:
- Employees in repetitive work: ${calc.employees}
- Hourly cost: $${calc.hourlyCost}
- Hours wasted: ${calc.hoursPerWeek} hrs/wk
- Automation target: ${calc.automationPct}%
- Est. Annual Savings: $${calc.annualSavings.toLocaleString()}
- Est. Monthly Savings: $${calc.monthlySavings?.toLocaleString()}
- Est. Payback: ${calc.paybackPeriodText}
- Est. ROI: ${calc.roiPercentText}`
    : ''
}
    `.trim();

    // 5. Send via Resend or Fallback with graceful reporting
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const emailResult = await resend.emails.send({
        from: emailFrom,
        to: destinationEmail,
        replyTo: data.email,
        subject: `New Hawaii Cost Reduction Inquiry: ${data.businessName} (${data.island})`,
        html: htmlContent,
        text: textContent,
      });

      if (emailResult.error) {
        console.error('[RESEND ERROR]', emailResult.error);
        return res.status(500).json({
          success: false,
          error: 'We encountered an error delivering your message to our inbox. Please try again or email rob@olelohonua.com directly.',
        });
      }

      deliveredLive = true;
      console.log(`[EMAIL SENT] Live inquiry delivered via Resend for ${data.businessName} -> ${destinationEmail}`);
    } else {
      console.log(
        `[INQUIRY RECORDED - RESEND_API_KEY NOT SET]\n` +
        `Business: ${data.businessName} | Name: ${data.fullName} | Island: ${data.island} | Email: ${data.email}\n` +
        `To deliver live emails to ${destinationEmail}, add RESEND_API_KEY to your environment variables.`
      );
    }

    // Record submission in memory buffer
    recentInquiries.push({
      id: inquiryId,
      receivedAt: new Date().toISOString(),
      businessName: data.businessName,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      island: data.island,
      industry: data.industry,
      employeeCount: data.employeeCount,
      timeWasters: data.timeWasters,
      desiredImprovements: data.desiredImprovements,
      budgetRange: data.budgetRange,
      calculatorSummary: data.calculatorSummary,
      deliveredLive,
    });

    return res.status(200).json({
      success: true,
      message: "Got it. Your inquiry has been sent. We'll review what you shared and get back to you.",
      deliveredLive,
      submissionId: inquiryId,
    });
  } catch (error: any) {
    console.error('[INQUIRY HANDLER EXCEPTION]', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while processing your inquiry. Please email rob@olelohonua.com directly.',
    });
  }
});

// Configure Vite middleware in development, or static files in production
async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OLELO HONUA] Server running on port ${PORT} (${IS_PROD ? 'production' : 'development'})`);
  });
}

startServer();
