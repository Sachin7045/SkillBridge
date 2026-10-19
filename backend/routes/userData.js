import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { USER_SAVED_RESUMES } from './auth.js';

const router = express.Router();

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

export default router;
