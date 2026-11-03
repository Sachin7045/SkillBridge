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

### 2. 📊 Deep ATS & Job Description Analyzer & Live Job Matcher
- **ATS Compatibility Score (0-100)**: Multi-factor scoring assessing quantifiable metrics, power verbs, section structure, and role relevance.
- **LinkedIn & Naukri.com Live Job Linking**:
  - Direct 1-click deep links to search live job postings on **LinkedIn Jobs** and **Naukri.com** matching target roles, skills, and locations (Bengaluru, Delhi NCR, Pune, Hyderabad, Remote, etc.).
  - **Featured Curated Openings**: Browse real-world tech openings from top employers (Razorpay, Swiggy, CRED, PhonePe, Zomato, TCS, Infosys) directly in Job Matcher.
  - **1-Click "Match With Resume"**: Load any LinkedIn or Naukri job description directly into the calibration engine to calculate match percentage, detected keywords, and missing competencies.
- **Keyword Cloud Audit**: Instant identification of matched keywords vs. critical missing competencies.
- **Strengths & High-Impact Recommendations**: Actionable guidance to maximize interview call rates.

### 3. ⭐ AI Resume Highlights & Diagnostic Panel
- **AI Executive Career Summary**: Auto-synthesized career narrative with core domains, senior competencies, and stand-out metrics.
- **Interactive Keyword Highlighter**: Real-time keyword tagging system that highlights matching competencies and technologies directly across the visual resume canvas.
- **Strength & Achievement Badges**: Dynamic recognition badges awarded for key resume strengths (e.g., *ATS Elite, Quantified Impact, Builder Mindset, Polyglot Stack*).
- **Missing Sections Diagnostic Audit**: Instant completeness health check for vital sections (Certifications, Summary, Quantified Metrics, Links) with fix recommendations.
- **Top Metrics & Accomplishments Carousel**: Quick-glance high-impact metrics extracted from work experience and projects.

### 4. 🎙️ AI Mock Interviewer (Resume-Anchored Q&A & Dynamic Evaluation)
- **Deeply Anchored Questions**: AI questions tailored directly to your actual projects, claimed metrics, and stated technologies across Technical Deep-Dive, Behavioral (STAR), and Distributed Architecture.
- **Strict Separation of 3 Concepts**:
  - **Answer Validity**: Categorizes answers as `Valid Technical Response`, `Invalid Response`, or `Insufficient Response`.
  - **Answer Quality Score**: Dynamically calculated from actual answer quality across 5 weighted criteria (never labeled "Accuracy").
  - **Evaluation Confidence**: Transparent confidence percentage and level (e.g. `98% (High Confidence)`).
- **Gibberish & Non-Attempt Rejection (No Fabricated Scores)**:
  - Meaningless keystrokes (`"asdfghjkl"`, repeating consonants) are flagged as `Invalid Response` with score `N/A` (never an arbitrary 4/10). Explains why the response cannot be evaluated alongside expected concepts.
  - Explicit non-attempts (`"I don't know"`) receive structured guidance and an `Insufficient Response` rating.
- **5-Criterion Dynamic Scoring Rubric**:
  - **Relevance (25%)**: Alignment with question topics and constraints.
  - **Technical Accuracy (30%)**: Factual correctness against real-world engineering standards.
  - **Clarity & Communication (15%)**: Coherent flow, transitions, and structure.
  - **Technical Depth (20%)**: Inner mechanics, trade-offs, edge cases, and quantifiable metrics.
  - **Structure (10%)**: STAR framework (Situation $\rightarrow$ Task $\rightarrow$ Action $\rightarrow$ Result) for behavioral questions; Premise $\rightarrow$ Mechanism $\rightarrow$ Trade-offs for technical questions.
- **Stale Score Prevention & Audio Dictation**:
  - Live indicator warns when an answer has been modified since previous evaluation.
  - Web Speech API microphone dictation and sample voice transcription simulation.
  - Staff-level **Model Answer** provided for every question.

### 5. 🌉 Skill Bridge Learning Roadmap
- **Personalized Career Gap Closer**: Step-by-step 3-phase milestone roadmap bridging current skills to your dream job.
- **Interactive Checklists**: Mark skills complete with celebration confetti.
- **Portfolio Flagship Projects**: Hands-on project ideas engineered to stand out on GitHub and resumes.
- **Curated Guides & Documentation**: Best free and interactive learning resources.

### 6. ✨ AI STAR Bullet Point Optimizer
- **Instant Accomplishment Rewriter**: Transforms weak, passive statements into executive-ready achievements.
- **Multi-Perspective Styles**: Generates variations focused on **Quantified Metrics & Scale**, **Technical Depth & Resilience**, and **Business Leadership**.
- **Action Verb Bank**: 1-click power verbs for rapid resume tuning.
- **Full STAR Breakdown**: Situation, Task, Action, and Result structured breakdowns for every optimized variation.

### 7. 💼 End-to-End Job Applications Pipeline Tracker
- **Kanban & List Pipeline Views**: Track applications across 6 stages: `Applied`, `Screening`, `Technical Interview`, `Final Round`, `Offer Received`, and `Archived / Rejected`.
- **Cross-Platform Origin Badging**: Filter and label jobs sourced from **LinkedIn**, **Naukri.com**, **Direct Careers**, and referrals.
- **Interconnected Career Acceleration**:
  - **1-Click Mock Q&A**: Instantly launch AI Mock Interview pre-calibrated to that company and target role.
  - **1-Click Tailored Cover Letter**: Generate custom cover letters pre-populated with company name, role, and job requirements.
- **CSV Data Export**: 1-click download of your entire application pipeline report for offline records.
- **Persistent Cloud & Local Sync**: Multi-device synchronization isolated to your user account.

### 8. ✉️ AI Tailored Cover Letter Generator
- Auto-generates role-specific, high-impact cover letters incorporating the candidate's top engineering achievements, technical stack, and target company value propositions.
- 1-click copy to clipboard and text file download.

---

## 🌐 Live Production Deployment
- **Production URL**: [https://skillbridge-beige-seven.vercel.app](https://skillbridge-beige-seven.vercel.app)
- **Deployment Status**: Ready on Vercel Production
- **GitHub Repository**: [https://github.com/Sachin7045/SkillBridge.git](https://github.com/Sachin7045/SkillBridge.git)

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

## 🔐 Candidate Authentication (Email + Password + OTP)
SkillBridge provides secure authentication using **Email & Password with 6-Digit OTP (One-Time Password) Verification**:
- **Step 1:** Enter registered or new **Email** and **Password** (min. 6 characters).
- **Step 2:** Enter the 6-digit verification **OTP code** to issue a signed stateless JWT token and enter the workspace.
- Pre-seeded candidate accounts for testing:

| Role | Email | Password |
|---|---|---|
| **Full Stack Engineer** | `candidate@skillbridge.io` | `candidatePass123` |
| **Demo Candidate** | `demo@skillbridge.io` | `demo123456` |

- Access the login page anytime by clicking **"Sign In"** in the sidebar or top navbar.

---

## 🧪 Automated Testing & Verification

Run the comprehensive test suites (144 automated test cases, 100% pass rate):

```powershell
# 1. Email + Password + OTP Authentication Tests (15 test cases)
node backend/test-auth-otp.js

# 2. AI Mock Interview Dynamic Evaluation & Accuracy Tests (71 test cases)
node backend/test-interview-eval.js

# 3. ATS Analyzer & Unit Scoring Tests (13 test cases)
node backend/test-ats.js

# 4. Job Applications Pipeline & Cloud Sync Tests (19 test cases)
node backend/test-job-applications.js

# 5. Core 5 Modules Integration Verification (5 test cases)
node backend/test-core-modules.js

# 6. Multilingual AI Interview Voice & Dialect Tests (5 test cases)
node backend/test-multilingual-interview.js

# 7. Software Engineering Domains & Fields Tests (16 test cases)
node backend/test-software-fields-interview.js
```


