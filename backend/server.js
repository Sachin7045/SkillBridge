import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { SAMPLE_RESUMES } from './data/sampleResumes.js';
import { ROLE_TAXONOMY, POWER_ACTION_VERBS, WEAK_PASSIVE_VERBS } from './data/roleKeywords.js';
import { parseResumeFile, extractResumeStructure } from './services/resumeParser.js';
import { analyzeResume } from './services/atsAnalyzer.js';
import { generateQuestions, evaluateAnswer, generateRoadmap, optimizeBullet, generateCoverLetter } from './services/aiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Multer memory storage for uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Health check
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
app.post('/api/resume/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, mimetype, originalname } = req.file;
    const parsedResume = await parseResumeFile(buffer, mimetype, originalname);
    
    // Automatically attach an initial analysis
    const analysis = analyzeResume(parsedResume, parsedResume.targetRole || "Full Stack Developer");

    res.json({
      success: true,
      filename: originalname,
      resume: parsedResume,
      analysis
    });
  } catch (err) {
    console.error('Error parsing resume file:', err);
    res.status(500).json({ error: 'Failed to parse resume file', details: err.message });
  }
});

// Manual text or JSON resume parse
app.post('/api/resume/parse-text', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content required' });
    }
    const parsed = extractResumeStructure(text);
    const analysis = analyzeResume(parsed, parsed.targetRole || "Full Stack Developer");
    res.json({ success: true, resume: parsed, analysis });
  } catch (err) {
    console.error('Error parsing resume text:', err);
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
    console.error('Error analyzing resume:', err);
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
    console.error('Error generating questions:', err);
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
    console.error('Error evaluating answer:', err);
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
    console.error('Error generating roadmap:', err);
    res.status(500).json({ error: 'Failed to generate roadmap', details: err.message });
  }
});

// AI Bullet Optimizer: STAR rewrite
app.post('/api/bullet/optimize', async (req, res) => {
  try {
    const { bullet, contextTech, apiKey } = req.body;
    if (!bullet || bullet.trim().length === 0) {
      return res.status(400).json({ error: 'Bullet text is required' });
    }

    const result = await optimizeBullet(bullet, contextTech, apiKey);
    res.json({ success: true, result });
  } catch (err) {
    console.error('Error optimizing bullet:', err);
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
    console.error('Error generating cover letter:', err);
    res.status(500).json({ error: 'Failed to generate cover letter', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SkillBridge Backend running on http://localhost:${PORT}`);
});
import resumeRoutes from "./routes/resumeRoutes.js";
app.use("/api/resume", resumeRoutes);