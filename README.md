# Olelo Honua — Hawaii Business Cost Reduction

A production-ready, conversion-focused full-stack web application for **Olelo Honua** (`olelohonua.com`), helping Hawaii-based businesses cut unnecessary operating costs by automating repetitive work, fixing inefficient workflows, and engineering custom software.

Built with a Silicon Valley engineering standard and deep Hawaii operational understanding.

---

## 1. Tech Stack Overview

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend API**: Node.js & Express (`server.ts`) with Vite integration
- **Email Delivery**: [Resend](https://resend.com) transactional email API with safe local development fallback
- **Validation & Security**: Zod schema validation, sliding-window IP rate limiting, and honeypot bot trap
- **Deployment**: Render Web Service via `render.yaml` Blueprint

---

## 2. Local Development Setup

### Prerequisites
- Node.js 20+ installed
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/olelo-honua.git
cd olelo-honua

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Running Locally
```bash
# Starts Express server on port 3000 with Vite middleware in development
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Configuring Resend for Live Email Delivery

Inquiries submitted through the website are delivered directly to **`rob@olelohonua.com`** with the prospect's details and interactive calculator results.

### Step 1: Create a Resend Account
1. Visit [https://resend.com](https://resend.com) and create an account.
2. In the Resend Dashboard, go to **API Keys** &rarr; **Create API Key** (Permissions: *Full Access* or *Sending Access*).
3. Copy your key (starts with `re_...`).

### Step 2: Configure Environment Variables
In your `.env` file (or Render dashboard):
```env
RESEND_API_KEY="re_123456789_your_key_here"
CONTACT_EMAIL="rob@olelohonua.com"
EMAIL_FROM="Olelo Honua <inquiries@olelohonua.com>"
```

> **Testing without a domain initially:**
> If you have not verified `olelohonua.com` in Resend yet, you can test with Resend's free testing sender:
> `EMAIL_FROM="Olelo Honua <onboarding@resend.dev>"`
> Once your domain DNS is verified, update `EMAIL_FROM` to use your custom domain (e.g., `inquiries@olelohonua.com`).

---

## 4. Deploying to Render (Non-Negotiable Specs)

This repository includes a native `render.yaml` blueprint for automatic 1-click deployment on Render.

### Option A: Automatic Blueprint Deployment (Recommended)
1. Push this codebase to your GitHub repository.
2. Log in to [Render](https://dashboard.render.com).
3. Click **New +** &rarr; **Blueprint**.
4. Connect your GitHub repository. Render will automatically detect `render.yaml` and set up the Web Service.
5. In the Environment Variables prompt on Render, enter:
   - `RESEND_API_KEY`: Your Resend API key (`re_...`)
   - `CONTACT_EMAIL`: `rob@olelohonua.com`
   - `EMAIL_FROM`: `Olelo Honua <inquiries@olelohonua.com>` (or `onboarding@resend.dev`)
   - `SITE_URL`: `https://olelohonua.com`
6. Click **Apply**. Render will run:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`

### Option B: Manual Web Service Setup
1. In Render, select **New +** &rarr; **Web Service**.
2. Connect your repo and set:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free or Starter
3. Add the environment variables listed in `.env.example`.

---

## 5. Connecting Custom Domain `olelohonua.com`

1. In Render, navigate to your Web Service &rarr; **Settings** &rarr; **Custom Domains**.
2. Click **Add Custom Domain** and enter:
   - `olelohonua.com`
   - `www.olelohonua.com`
3. Configure the following DNS records at your domain registrar (GoDaddy, Cloudflare, Namecheap, Google Domains/Squarespace):
   - **Apex domain (`olelohonua.com`)**:
     - Type: `A`
     - Host: `@`
     - Value: Render's provided IP address (shown in Render dashboard)
     - *(Alternatively, if using Cloudflare/Namecheap: `ALIAS` or `ANAME` to your Render service URL).*
   - **Subdomain (`www.olelohonua.com`)**:
     - Type: `CNAME`
     - Host: `www`
     - Value: Your Render hostname (e.g., `olelo-honua.onrender.com`).
4. Render will automatically issue and renew a free Let's Encrypt SSL/TLS certificate for HTTPS.

---

## 6. How to Test and Verify Email Delivery

### Testing via the Website UI
1. Navigate to the **Savings Calculator** section on `https://olelohonua.com`.
2. Adjust the sliders to match a business scenario (e.g. 4 employees, $35/hr, 15 hrs/week).
3. Click **"Get My Free Cost Analysis"**. The page will scroll to the inquiry form with your calculated estimate attached.
4. Fill in the required fields:
   - Full Name: `Test Hawaii Owner`
   - Business Name: `Aloha Logistics Co`
   - Email: `your-email@domain.com`
   - Island: `Oahu`
   - Industry: `Wholesale, Logistics & Distribution`
   - Time Wasters: `Testing automated intake pipeline and invoice processing`
5. Click **"Let's Find Your Savings"**.
6. Check the recipient inbox (`rob@olelohonua.com`):
   - Subject line: `New Hawaii Cost Reduction Inquiry: Aloha Logistics Co (Oahu)`
   - Verified that the prospect's contact info, problem description, and estimated savings are properly formatted.
   - Reply directly to the email to confirm the `Reply-To` header points to the prospect's email.

### Testing API Health
```bash
curl https://olelohonua.com/api/health
```
Response:
```json
{
  "status": "healthy",
  "environment": "production",
  "resendConfigured": true,
  "contactEmail": "rob@olelohonua.com"
}
```

---

## 7. Architecture & Conversion Design Principles

- **Zero-Pill Discipline**: Unboxed metadata, strong typographic hierarchy, and clean separators (`·`).
- **Real Hawaii Economic Context**: Highlights loaded payroll costs ($30–$45/hr), inter-island freight, and high utility rates rather than generic startup cliches.
- **Dynamic Savings Model**:
  - `Annual Labor Cost = Employees × Hourly Rate × Hours/Wk × Weeks/Yr`
  - `Annual Savings = Annual Labor Cost × Automation %`
  - `Payback Period = Implementation Cost / Monthly Savings`
- **Spam Defense**: Honeypot trap (`hp_company_field`) catches automated scrapers without annoying CAPTCHAs for busy business owners.

---

## 8. License & Support

Maintained by **Olelo Honua**.
Inquiries: **rob@olelohonua.com**
Website: **[olelohonua.com](https://olelohonua.com)**
