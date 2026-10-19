# 🌉 SkillBridge - AI Resume Visualizer, Analyzer & Career Accelerator

SkillBridge is an attractive, modern, full-stack career platform designed to help software engineers and technical professionals bridge the gap between their current resume and high-tier industry expectations.

---

## 🌟 Core Features

### 1. 📄 Resume Visualizer
- **Multi-Template Rendering**: Seamlessly toggle between **Modern Tech**, **Executive Clean**, and **Visual Grid** layouts.
- **Competency Radar Chart**: Interactive radar visualization mapping proficiency across Languages, Frameworks, Databases, Cloud/DevOps, Tools, and Soft Skills.
- **Experience Timeline**: Chronological career roadmap with automatic keyword & metric highlights.
- **Live In-Place Editor**: Edit resume fields directly with real-time reactive updates.
- **Print & PDF Export**: Professional clean print styling.

### 2. 📊 Deep ATS & Job Description Analyzer
- **ATS Compatibility Score (0-100)**: Multi-factor scoring assessing quantifiable metrics, power verbs, section structure, and role relevance.
- **Target Role & Custom JD Matcher**: Test your resume against pre-built roles (Full Stack, Backend, DevOps, Data Science) or paste any custom job description.
- **Keyword Cloud Audit**: Instant identification of matched keywords vs. critical missing competencies.
- **Strengths & High-Impact Recommendations**: Actionable guidance to maximize interview call rates.

### 3. 🎙️ AI Mock Interviewer (Resume-Anchored Q&A)
- **Deeply Anchored Questions**: AI questions tailored directly to your actual projects, claimed metrics, and stated technologies.
- **Diverse Question Categories**: Technical Deep-Dive, Behavioral (STAR method), and Distributed System Architecture.
- **Interactive Speech Transcription Simulation**: Test responses via voice dictation or text.
- **Automated AI Assessment**: Instant 1-10 scoring on Clarity, Technical Depth, and STAR adherence, plus a staff-level **Model Answer**.

### 4. 🌉 Skill Bridge Learning Roadmap
- **Personalized Career Gap Closer**: Step-by-step 3-phase milestone roadmap bridging current skills to your dream job.
- **Interactive Checklists**: Mark skills complete with celebration confetti.
- **Portfolio Flagship Projects**: Hands-on project ideas engineered to stand out on GitHub and resumes.
- **Curated Guides & Documentation**: Best free and interactive learning resources.

### 5. ✨ AI STAR Bullet Point Optimizer
- **Instant Accomplishment Rewriter**: Transforms weak, passive statements into executive-ready achievements.
- **Multi-Perspective Styles**: Generates variations focused on **Quantified Metrics & Scale**, **Technical Depth & Resilience**, and **Business Leadership**.
- **Action Verb Bank**: 1-click power verbs for rapid resume tuning.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Start the Backend API Server
```powershell
cd backend
npm install        # first time only
node server.js
```
The backend API starts on `http://localhost:5000`.  
> **Note:** `localhost:5000` is the API server — open the *frontend* URL below to use the app.

### 2. Start the Frontend Development Server
```powershell
cd frontend
npm install        # first time only
npm run dev
```
Open `http://localhost:5173` in your browser.

### Quick Start (both at once)
```powershell
# From the project root
start.bat
```

---

## 🤖 Dual-Mode AI Engine
- **Built-in Smart Local AI (Default)**: Ready out of the box with zero configuration or API keys needed.
- **Live Google Gemini 1.5 Flash**: Click the "AI Mode" button in the top right to optionally provide your Google Gemini API Key for live generative intelligence.

---

## 🔐 Candidate Authentication & Demo Accounts
SkillBridge provides stateless JWT authentication with bcrypt password encryption. You can create a new account or instantly sign in with pre-seeded demo accounts:

| Role | Email | Password |
|---|---|---|
| **Full Stack Engineer** | `candidate@skillbridge.io` | `candidatePass123` |
| **Demo Candidate** | `demo@skillbridge.io` | `demo123456` |

- Access the login page anytime by clicking **"Sign In / Register"** in the sidebar or top navbar.
- Includes 1-click instant login buttons on the login page for rapid testing.

