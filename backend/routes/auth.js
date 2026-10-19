import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Memory store for user profiles and resumes (production can wire to MongoDB if MONGODB_URI is provided)
export const USER_DATABASE = new Map([
  ['candidate@skillbridge.io', {
    id: 'user_sachin_yadav',
    email: 'candidate@skillbridge.io',
    name: 'Sachin Yadav',
    passwordHash: '$2b$10$Yr9/PRjAxoIGVLUbIpCXLOcZ.G8goBx08mYrsJTTIO0vNxn1Ya8Cq',
    createdAt: new Date().toISOString()
  }],
  ['demo@skillbridge.io', {
    id: 'user_demo_candidate',
    email: 'demo@skillbridge.io',
    name: 'Demo Candidate',
    passwordHash: '$2b$10$eBaBRukxOjB9.WZzu.um..bOitSRoeqlaMr8CFYD0C.Zietu2ueYa',
    createdAt: new Date().toISOString()
  }]
]);
export const USER_SAVED_RESUMES = new Map(); // Map<userId, Array<Resume>>

// Input validation helpers
function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters in length.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (USER_DATABASE.has(normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    // Salt and hash password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      name: name ? String(name).trim() : 'SkillBridge User',
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString()
    };

    USER_DATABASE.set(normalizedEmail, newUser);

    // Issue JWT token without returning passwordHash
    const token = generateToken({ id: newUser.id, email: newUser.email, name: newUser.name });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    return res.status(500).json({ error: 'Internal registration error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = USER_DATABASE.get(normalizedEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // If user provided a name during login, update their profile name dynamically
    if (name && String(name).trim().length > 0) {
      user.name = String(name).trim();
      USER_DATABASE.set(normalizedEmail, user);
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Internal authentication error.' });
  }
});

// GET /api/auth/me (Protected route)
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
