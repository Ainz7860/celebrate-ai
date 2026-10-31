# CelebrateAI ✨
### Prompt Wars Challenge 5 — Intelligent Celebration & Event Planning Assistant

CelebrateAI is a full-stack, GenAI-powered event planning application designed to turn complex celebrations (weddings, milestone birthdays, and community festivals) into flawless, stress-free realities.

---

## 🌟 Key Features

1. **Deterministic Budgeting Engine**
   - AI generates category proportions and rationales, but **all financial arithmetic is computed strictly in deterministic TypeScript**.
   - Mandatory **5% emergency contingency reserve** baked into every plan.
   - Real-time variance tracking (Allocated vs. Estimated vs. Actual Spend) with automated over-budget and over-spend alerts.

2. **Backward-Scheduled Timeline Milestones**
   - Milestones are calculated chronologically backwards from your celebration date.
   - Live overdue detection, priority badges (`critical`, `high`, `medium`, `low`), and interactive completion checkboxes.

3. **Vendor Procurement & Vetting Guides**
   - Sourcing pipeline across key categories (Venue, Catering, Photography, Decor, Entertainment, etc.).
   - Pre-generated **interview questions to ask**, inspection criteria, and quote comparison tools.

4. **Guest RSVP & Dietary Safety Tracker**
   - Headcount tracker with seat counts, invitation delivery flags, and prominent **dietary allergy tags** (vegan, nut allergy, gluten-free, Jain requirements).

5. **Adaptive Replanning with Conflict Detection**
   - When plans encounter unexpected changes (e.g. rain forecast, 15% budget cut, +30% guest increase, date shifted), CelebrateAI recalculates dependencies.
   - **Guaranteed Commitment Preservation**: Protects already-booked vendors, completed milestones, and logged payments from being overwritten.
   - Selective change approval: Users review AI trade-offs and approve or reject adjustments change-by-change.

6. **Instant One-Click Demo Mode & Multi-LLM Support**
   - Supports **Google Gemini** (`gemini-2.0-flash`) and **Groq** (`llama-3.3-70b-versatile`).
   - If no API key is provided, the application runs seamlessly in **deterministic Demo Mode** with complete mock scenarios.

7. **Privacy-First & Export Anywhere**
   - Entire application state persists directly in your browser's `localStorage` (`celebrate_ai_v1`).
   - Export your plan as structured **JSON**, an executive **Markdown summary**, or trigger the **print-ready view**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your **Gemini** or **Groq** API key:
```env
# Google Gemini (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# OR Groq (https://console.groq.com/)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```
*(If omitted, CelebrateAI runs smoothly in instant Demo Mode!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
npx vitest run
```

---

## ⚡ Free 1-Click Deployment to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAinz7860%2Fcelebrate-ai&env=GEMINI_API_KEY,GEMINI_MODEL,GROQ_API_KEY,GROQ_MODEL&project-name=celebrate-ai&repository-name=celebrate-ai)

### Option 1: Web Interface (Recommended — 100% Free)
1. Click the **Deploy with Vercel** button above or open [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select **`Ainz7860/celebrate-ai`**.
3. In **Environment Variables**, optionally paste your `GEMINI_API_KEY` (or `GROQ_API_KEY`).
4. Click **Deploy**. Vercel will build and provision your free `.vercel.app` URL in under 60 seconds!

### Option 2: Vercel CLI
```bash
npx vercel login
npx vercel --prod
```

### Option 3: Other 100% Free Hosting Platforms
- **Netlify**: Run `npx netlify deploy --prod --build` or import `Ainz7860/celebrate-ai` at [app.netlify.com](https://app.netlify.com).
- **Render**: Create a free Web Service connected to `https://github.com/Ainz7860/celebrate-ai` with `npm run build` and `npm start`.

