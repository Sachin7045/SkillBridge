import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Routes and Middleware
import authRoutes from './routes/auth.js';
import userDataRoutes from './routes/userData.js';
import { optionalAuth } from './middleware/auth.js';

// Services and Data
import { SAMPLE_RESUMES } from './data/sampleResumes.js';
import { ROLE_TAXONOMY, POWER_ACTION_VERBS, WEAK_PASSIVE_VERBS } from './data/roleKeywords.js';
import { parseResumeFile, extractResumeStructure } from './services/resumeParser.js';
import { analyzeResume } from './services/atsAnalyzer.js';
import { 
  generateQuestions, 
  evaluateAnswer, 
  generateRoadmap, 
  optimizeBullet, 
  generateCoverLetter 
} from './services/aiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// 1. Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Strict CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin, localhost, configured CORS_ORIGIN, or vercel preview domains
    if (!origin || origin.startsWith('http://localhost') || origin.endsWith('.vercel.app') || origin === CORS_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting (Prevents brute force & DoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Strict limit on login/register endpoints
  message: { error: 'Too many authentication attempts. Please try again later.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// 4. Request Body Size Limits
app.use(express.json({ limit: '5mb' }));

// 5. Secure File Upload Validation (Multer with fileFilter & size limits)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileNameLower = file.originalname.toLowerCase();
    const hasValidExt = allowedExtensions.some(ext => fileNameLower.endsWith(ext));

    if (allowedMimes.includes(file.mimetype) || hasValidExt) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX documents are accepted.'));
    }
  }
});

// 6. Mount Modular Sub-Routers
app.use('/api/auth', authRoutes);
app.use('/api/user-data', userDataRoutes);

// Root route — friendly landing for anyone hitting localhost:5000 directly
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SkillBridge API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #0a0e1a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { background: linear-gradient(135deg, #111827, #1e1b4b); border: 1px solid rgba(99,102,241,0.3); border-radius: 16px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 0 60px rgba(99,102,241,0.1); }
        h1 { font-size: 28px; background: linear-gradient(135deg, #818cf8, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
        .badge { display: inline-block; background: #065f46; color: #6ee7b7; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 999px; margin-bottom: 20px; }
        p { color: #94a3b8; line-height: 1.6; margin-bottom: 16px; font-size: 14px; }
        a { color: #818cf8; text-decoration: none; font-weight: 600; }
        a:hover { text-decoration: underline; }
        .endpoints { text-align: left; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 16px; margin-top: 20px; font-size: 13px; font-family: 'Cascadia Code', monospace; }
        .endpoints div { padding: 4px 0; color: #6ee7b7; }
        .endpoints span { color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🌉 SkillBridge API</h1>
        <div class="badge">● Server Online</div>
        <p>This is the <strong>backend API server</strong>. The user interface runs separately.</p>
        <p>👉 Open <a href="http://localhost:5173">http://localhost:5173</a> for the app.</p>
        <div class="endpoints">
          <div>GET <span>/api/health</span></div>
          <div>GET <span>/api/samples</span></div>
          <div>POST <span>/api/auth/register</span></div>
          <div>POST <span>/api/auth/login</span></div>
          <div>POST <span>/api/analyze</span></div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SkillBridge API',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Get sample resumes
app.get('/api/samples', (req, res) => {
  res.json(SAMPLE_RESUMES);
});

app.get('/api/samples/:id', (req, res) => {
  const resume = SAMPLE_RESUMES.find(r => r.id === req.params.id);
  if (!resume) {
    return res.status(404).json({ error: 'Sample resume not found' });
  }
  res.json(resume);
});

// Get role taxonomy and list of available target roles
app.get('/api/roles', (req, res) => {
  res.json({
    roles: Object.keys(ROLE_TAXONOMY),
    taxonomy: ROLE_TAXONOMY,
    powerVerbs: POWER_ACTION_VERBS,
    weakVerbs: WEAK_PASSIVE_VERBS
  });
});

// Resume file upload & parse endpoint
app.post('/api/resume/upload', optionalAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, mimetype, originalname } = req.file;

    // Prevent path traversal on original filename
    const sanitizedFilename = originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const parsedResume = await parseResumeFile(buffer, mimetype, sanitizedFilename);
    
    // Automatically attach an initial analysis
    const analysis = analyzeResume(parsedResume, parsedResume.targetRole || "Full Stack Developer");

    res.json({
      success: true,
      filename: sanitizedFilename,
      resume: parsedResume,
      analysis
    });
  } catch (err) {
    next(err);
  }
});

// Manual text or JSON resume parse
app.post('/api/resume/parse-text', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || String(text).trim().length === 0) {
      return res.status(400).json({ error: 'Text content required' });
    }
    const parsed = extractResumeStructure(String(text));
    const analysis = analyzeResume(parsed, parsed.targetRole || "Full Stack Developer");
    res.json({ success: true, resume: parsed, analysis });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse resume text', details: err.message });
  }
});

// Deep ATS Analysis & Job Description Match
app.post('/api/resume/analyze', (req, res) => {
  try {
    const { resume, targetRole, jobDescription } = req.body;
    if (!resume) {
      return res.status(400).json({ error: 'Resume data required' });
    }

    const analysis = analyzeResume(resume, targetRole, jobDescription);
    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze resume', details: err.message });
  }
});

// AI Mock Interview: Generate personalized questions
app.post('/api/interview/generate-questions', async (req, res) => {
  try {
    const { resume, category, apiKey } = req.body;
    if (!resume) {
      return res.status(400).json({ error: 'Resume data required' });
    }

    const questions = await generateQuestions(resume, category || 'all', apiKey);
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate questions', details: err.message });
  }
});

// AI Mock Interview: Evaluate Candidate Answer
app.post('/api/interview/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, resumeContext, apiKey } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const evaluation = await evaluateAnswer(question, answer, resumeContext, apiKey);
    res.json({ success: true, evaluation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate answer', details: err.message });
  }
});

// Skill Bridge: Generate Learning Roadmap
app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { resume, targetRole, apiKey } = req.body;
    if (!resume) {
      return res.status(400).json({ error: 'Resume data required' });
    }

    const roadmap = await generateRoadmap(resume, targetRole || 'Full Stack Developer', apiKey);
    res.json({ success: true, roadmap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate roadmap', details: err.message });
  }
});

// AI Bullet Optimizer: STAR rewrite
app.post('/api/bullet/optimize', async (req, res) => {
  try {
    const { bullet, contextTech, apiKey } = req.body;
    if (!bullet || String(bullet).trim().length === 0) {
      return res.status(400).json({ error: 'Bullet text is required' });
    }

    const result = await optimizeBullet(bullet, contextTech, apiKey);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to optimize bullet', details: err.message });
  }
});

// AI Cover Letter Generator
app.post('/api/cover-letter/generate', async (req, res) => {
  try {
    const { resume, companyName, targetRole, jobDescription, apiKey } = req.body;
    if (!resume) {
      return res.status(400).json({ error: 'Resume data required' });
    }

    const coverLetter = await generateCoverLetter(resume, companyName, targetRole, jobDescription, apiKey);
    res.json({ success: true, coverLetter });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate cover letter', details: err.message });
  }
});

// Centralized Secure Error Handler (Never leaks sensitive stack traces to client)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Uploaded file exceeds the maximum 8MB limit.' });
    }
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  const isDev = process.env.NODE_ENV !== 'production';
  return res.status(500).json({
    error: err.message || 'An internal server error occurred.',
    ...(isDev ? { stack: err.stack } : {})
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SkillBridge Backend running on http://localhost:${PORT}`);
  });
}

export default app;
