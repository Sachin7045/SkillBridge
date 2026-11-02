import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { USER_SAVED_RESUMES } from './auth.js';

const router = express.Router();

export const USER_SAVED_APPLICATIONS = new Map(); // Map<userId, Array<JobApplication>>

// --------------------------------------------------------------------------
// RESUMES ENDPOINTS
// --------------------------------------------------------------------------

// GET /api/user-data/resumes - Get authenticated user's own saved resumes only
router.get('/resumes', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const list = USER_SAVED_RESUMES.get(userId) || [];
  return res.json({ success: true, resumes: list });
});

// POST /api/user-data/resumes - Save a resume version isolated to authenticated user
router.post('/resumes', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { resume } = req.body;

  if (!resume) {
    return res.status(400).json({ error: 'Resume payload required.' });
  }

  const existingList = USER_SAVED_RESUMES.get(userId) || [];
  const resumeId = resume.id || `resume_${Date.now()}`;
  
  const savedEntry = {
    ...resume,
    id: resumeId,
    ownerId: userId, // Server-enforced ownership; never trust client-supplied owner
    updatedAt: new Date().toISOString()
  };

  const updatedList = [savedEntry, ...existingList.filter(r => r.id !== resumeId)];
  USER_SAVED_RESUMES.set(userId, updatedList);

  return res.status(201).json({
    success: true,
    message: 'Resume saved to your secure profile.',
    resume: savedEntry
  });
});

// DELETE /api/user-data/resumes/:id - Delete authenticated user's own resume
router.delete('/resumes/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const resumeId = req.params.id;

  const existingList = USER_SAVED_RESUMES.get(userId) || [];
  const filtered = existingList.filter(r => r.id !== resumeId);

  USER_SAVED_RESUMES.set(userId, filtered);
  return res.json({ success: true, message: 'Resume deleted.' });
});

// --------------------------------------------------------------------------
// JOB APPLICATIONS ENDPOINTS
// --------------------------------------------------------------------------

// GET /api/user-data/applications - Get authenticated user's tracked job applications
router.get('/applications', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const list = USER_SAVED_APPLICATIONS.get(userId) || [];
  return res.json({ success: true, applications: list });
});

// POST /api/user-data/applications - Add or sync job applications
router.post('/applications', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { application, applications } = req.body;

  // Support both bulk sync or single application save
  if (Array.isArray(applications)) {
    const sanitized = applications.map(app => ({
      ...app,
      ownerId: userId,
      updatedAt: new Date().toISOString()
    }));
    USER_SAVED_APPLICATIONS.set(userId, sanitized);
    return res.json({ success: true, applications: sanitized });
  }

  if (!application || !application.company || !application.title) {
    return res.status(400).json({ error: 'Company and Job Title are required.' });
  }

  const existingList = USER_SAVED_APPLICATIONS.get(userId) || [];
  const appId = application.id || `app_${Date.now()}`;

  const newEntry = {
    ...application,
    id: appId,
    ownerId: userId,
    updatedAt: new Date().toISOString()
  };

  const updatedList = [newEntry, ...existingList.filter(a => a.id !== appId)];
  USER_SAVED_APPLICATIONS.set(userId, updatedList);

  return res.status(201).json({
    success: true,
    message: 'Job application saved.',
    application: newEntry
  });
});

// DELETE /api/user-data/applications/:id - Delete tracked job application
router.delete('/applications/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const appId = req.params.id;

  const existingList = USER_SAVED_APPLICATIONS.get(userId) || [];
  const filtered = existingList.filter(a => a.id !== appId);

  USER_SAVED_APPLICATIONS.set(userId, filtered);
  return res.json({ success: true, message: 'Application removed from tracker.' });
});

export default router;
