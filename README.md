# ARTHA: AI-Powered Financial Sentinel 🛡️

**Empowering the Indian Middle Class with Intelligent Wealth Protection & Strategic Planning.**

[![GitHub stars](https://img.shields.io/github/stars/VinayakSaindane/Artha?style=for-the-badge)](https://github.com/VinayakSaindane/Artha/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌟 The Vision

In a world of predatory lending, complex financial agreements, and hidden debt traps, **ARTHA** acts as a digital sentinel. While most apps just "track" your money, ARTHA **protects** it. Built specifically for the salaried middle class in India, ARTHA uses advanced AI to predict spending spikes, analyze legal risks in agreements, and build personalized roadmaps to financial freedom.

---

## ⚡ Key Features

### 1. **The Shield™ (AI Agreement Analysis)** 📜
Don't sign what you don't understand. Upload any financial agreement (PDF/Text), and our AI detects:
- **Predatory Interest Rates**: Hidden in complex legal jargon.
- **Risk Scoring**: Instant risk assessment of the contract.
- **Suggested Fixes**: Actionable advice on what clauses to challenge.

### 2. **Festival Shield™ (Preventative Saving)** 🎇
Indian households spend **2.4x more** during festivals, often sliding into debt.
- **Predictive Spikes**: AI analyzes upcoming cultural events (Diwali, Wedding Season) against your income.
- **Micro-Savings Plan**: Automatically calculates a daily "Shield Target" to avoid high-interest credit card debt.

### 3. **Debt Pulse™ (Trap Detection)** 💓
A real-time "vital sign" monitor for your financial health.
- **Debt-Trap Forecasting**: Predicts exactly how many days until your EMI ratio hits a critical 50% "Danger Zone."
- **Interactive Prescription**: AI-curated action steps to bulletproof your future.

### 4. **AI Wealth Advisor** 🧠
Professional-grade strategy without the high fees.
- **Personalized Roadmap**: Dynamic projections based on risk appetite and life stages.
- **Asset Allocation**: Modern-weighted advice (Equity/Debt/Gold) tailored to Indian market trends.

### 5. **Loan Predictor & Score** 📈
Protect your CIBIL score by checking eligibility *before* you apply.
- **Approval Odds**: Instant probability check for various loan types.
- **Improvement Tips**: Tailored advice on how to fix weak points in your profile.

---

## 🎨 Premium Aesthetics

ARTHA features a **state-of-the-art Glassmorphic UI** designed for clarity and engagement.
- **Dark Mode Native**: Reduces eye strain during late-night financial planning.
- **Dynamic Charts**: Interactive data visualizations using Recharts.
- **Fluid Animations**: Smooth transitions for a premium software feel.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Recharts, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB.
- **AI Core**: Google Gemini API (Pro/Flash) for structured financial reasoning.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VinayakSaindane/Artha.git
   cd Artha
   ```

2. **Frontend Setup**
   ```bash
   # From root
   npm install
   npm run dev
   ```

3. **Backend Setup** 
   *(Switch to `artha-backend` branch for the server code)*
   ```bash
   git checkout artha-backend
   npm install
   # Create a .env with: MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
   node src/index.js
   ```

4. **Deploy to Vercel** 🚀
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```
   
   Or use the Vercel Dashboard:
   - Go to [vercel.com](https://vercel.com)
   - Import the `VinayakSaindane/Artha` repository
   - Add environment variables
   - Deploy!
   
   📖 **For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🤝 Contribution

We are building the future of financial defense. PRs are welcome! 

**Created for the Code-Icon Hackathon.** 🚀
