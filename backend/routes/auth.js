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

// OTP store for email + password + OTP 2FA flow
// Map<normalizedEmail, { otp: string, expiresAt: number, passwordHash?: string, isNewUser?: boolean, name?: string }>
export const OTP_STORE = new Map();

// Generate a secure 6-digit numeric OTP code
function generate6DigitOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Input validation helpers
function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

// Convert email address into clean, human-readable full name
export function formatNameFromEmail(email, providedName = '') {
  if (providedName && typeof providedName === 'string' && providedName.trim().length > 1) {
    return providedName.trim();
  }
  const username = String(email || '').split('@')[0] || '';
  // Clean special characters and numbers: e.g. "sachin.yadav" -> "Sachin Yadav"
  const cleanParts = username
    .replace(/[0-9]+/g, ' ')
    .replace(/[._\-+]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (cleanParts.length > 0 && cleanParts.join(' ').length >= 3) {
    return cleanParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  const rawClean = username.replace(/[._\-+]/g, ' ').trim();
  if (rawClean.length > 0) {
    return rawClean.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  return 'Candidate';
}

// --------------------------------------------------------------------------
// POST /api/auth/send-otp
// Step 1: Validate email & password, generate 6-digit OTP code
// --------------------------------------------------------------------------
router.post('/send-otp', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Both email and password are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters in length.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = USER_DATABASE.get(normalizedEmail);

    let passwordHash = null;
    let isNewUser = false;

    if (existingUser) {
      // Validate password for existing account
      const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password. Please verify your credentials.' });
      }
      passwordHash = existingUser.passwordHash;
    } else {
      // Prepare new user registration via OTP
      isNewUser = true;
      const saltRounds = 10;
      passwordHash = await bcrypt.hash(password, saltRounds);
    }

    // Generate 6-digit OTP code (valid for 10 minutes)
    const otp = generate6DigitOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const chosenName = formatNameFromEmail(normalizedEmail, name || existingUser?.name);

    OTP_STORE.set(normalizedEmail, {
      otp,
      expiresAt,
      passwordHash,
      isNewUser,
      name: chosenName
    });

    console.log(`[AUTH OTP] Security OTP for ${normalizedEmail}: ${otp}`);

    return res.json({
      success: true,
      message: `OTP sent successfully to ${normalizedEmail}.`,
      email: normalizedEmail,
      otp, // Provided for instant demo/testing preview without needing third-party SMTP setup
      expiresInSeconds: 600
    });
  } catch (err) {
    console.error('Send OTP error:', err.message);
    return res.status(500).json({ error: 'Failed to generate verification OTP.' });
  }
});

// --------------------------------------------------------------------------
// POST /api/auth/verify-otp
// Step 2: Verify 6-digit OTP and issue JWT session token
// --------------------------------------------------------------------------
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and 6-digit OTP code are required.' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const record = OTP_STORE.get(normalizedEmail);

    if (!record) {
      return res.status(400).json({ error: 'No active OTP request found for this email. Please request a new code.' });
    }

    if (Date.now() > record.expiresAt) {
      OTP_STORE.delete(normalizedEmail);
      return res.status(400).json({ error: 'OTP has expired. Please request a fresh code.' });
    }

    const cleanInputOtp = String(otp).trim();
    if (cleanInputOtp !== record.otp) {
      return res.status(400).json({ error: 'Invalid OTP code. Please enter the correct 6-digit code.' });
    }

    // OTP Verified successfully!
    OTP_STORE.delete(normalizedEmail);

    let user = USER_DATABASE.get(normalizedEmail);
    const chosenName = (name && String(name).trim().length > 0)
      ? String(name).trim()
      : (record.name && !/^[a-z0-9_.-]+$/i.test(record.name))
      ? record.name
      : formatNameFromEmail(normalizedEmail, record.name);

    if (!user) {
      user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        email: normalizedEmail,
        name: chosenName,
        passwordHash: record.passwordHash,
        createdAt: new Date().toISOString()
      };
      USER_DATABASE.set(normalizedEmail, user);
    } else if (name && String(name).trim().length > 0) {
      user.name = String(name).trim();
      USER_DATABASE.set(normalizedEmail, user);
    }

    // Issue signed JWT token
    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Verify OTP error:', err.message);
    return res.status(500).json({ error: 'Failed to verify OTP.' });
  }
});

// --------------------------------------------------------------------------
// POST /api/auth/register (Standard Register Endpoint)
// --------------------------------------------------------------------------
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

// --------------------------------------------------------------------------
// POST /api/auth/login (Standard Login Endpoint)
// --------------------------------------------------------------------------
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

// --------------------------------------------------------------------------
// GET /api/auth/me (Protected route)
// --------------------------------------------------------------------------
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// --------------------------------------------------------------------------
// PUT /api/auth/profile (Update candidate display name)
// --------------------------------------------------------------------------
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name } = req.body;
    if (!name || String(name).trim().length === 0) {
      return res.status(400).json({ error: 'Name cannot be empty.' });
    }
    const cleanName = String(name).trim();
    const normalizedEmail = req.user.email.toLowerCase().trim();
    const user = USER_DATABASE.get(normalizedEmail);
    if (user) {
      user.name = cleanName;
      USER_DATABASE.set(normalizedEmail, user);
    }
    const updatedUser = { id: req.user.id, email: req.user.email, name: cleanName };
    const newToken = generateToken(updatedUser);
    return res.json({
      success: true,
      message: 'Profile name updated successfully.',
      user: updatedUser,
      token: newToken
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    return res.status(500).json({ error: 'Failed to update profile name.' });
  }
});

export default router;
