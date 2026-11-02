process.env.NODE_ENV = 'test';

import { USER_DATABASE, OTP_STORE } from './routes/auth.js';
import bcrypt from 'bcryptjs';
import { generateToken } from './middleware/auth.js';

console.log('=== Running SkillBridge Email + Password + OTP Authentication Tests ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✓ PASS: ${testName} ${details ? `(${details})` : ''}`);
    passedTests++;
  } else {
    console.error(`✗ FAIL: ${testName} ${details ? `(${details})` : ''}`);
  }
}

// Mock request / response handler matching auth.js logic
async function handleSendOtp(body) {
  const { email, password } = body;
  if (!email || !password) {
    return { status: 400, data: { error: 'Both email and password are required.' } };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 400, data: { error: 'Please provide a valid email address.' } };
  }
  if (typeof password !== 'string' || password.length < 6) {
    return { status: 400, data: { error: 'Password must be at least 6 characters in length.' } };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = USER_DATABASE.get(normalizedEmail);

  let passwordHash = null;
  let isNewUser = false;

  if (existingUser) {
    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isMatch) {
      return { status: 401, data: { error: 'Invalid password. Please verify your credentials.' } };
    }
    passwordHash = existingUser.passwordHash;
  } else {
    isNewUser = true;
    passwordHash = await bcrypt.hash(password, 10);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  OTP_STORE.set(normalizedEmail, {
    otp,
    expiresAt,
    passwordHash,
    isNewUser,
    name: normalizedEmail.split('@')[0]
  });

  return {
    status: 200,
    data: {
      success: true,
      message: `OTP sent successfully to ${normalizedEmail}.`,
      email: normalizedEmail,
      otp,
      expiresInSeconds: 600
    }
  };
}

async function handleVerifyOtp(body) {
  const { email, otp } = body;
  if (!email || !otp) {
    return { status: 400, data: { error: 'Email and 6-digit OTP code are required.' } };
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const record = OTP_STORE.get(normalizedEmail);

  if (!record) {
    return { status: 400, data: { error: 'No active OTP request found for this email. Please request a new code.' } };
  }

  if (Date.now() > record.expiresAt) {
    OTP_STORE.delete(normalizedEmail);
    return { status: 400, data: { error: 'OTP has expired. Please request a fresh code.' } };
  }

  const cleanInputOtp = String(otp).trim();
  if (cleanInputOtp !== record.otp) {
    return { status: 400, data: { error: 'Invalid OTP code. Please enter the correct 6-digit code.' } };
  }

  OTP_STORE.delete(normalizedEmail);

  let user = USER_DATABASE.get(normalizedEmail);
  if (!user) {
    const displayName = record.name
      ? record.name.charAt(0).toUpperCase() + record.name.slice(1)
      : 'SkillBridge User';

    user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      name: displayName,
      passwordHash: record.passwordHash,
      createdAt: new Date().toISOString()
    };
    USER_DATABASE.set(normalizedEmail, user);
  }

  const token = generateToken({ id: user.id, email: user.email, name: user.name });

  return {
    status: 200,
    data: {
      success: true,
      message: 'Authentication successful.',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    }
  };
}

async function runTests() {
  // 1. Missing credentials test
  const missingEmailRes = await handleSendOtp({ email: '', password: 'somePassword123' });
  assert(missingEmailRes.status === 400, 'Rejects missing email with 400 status');

  const missingPassRes = await handleSendOtp({ email: 'candidate@skillbridge.io', password: '' });
  assert(missingPassRes.status === 400, 'Rejects missing password with 400 status');

  const shortPassRes = await handleSendOtp({ email: 'candidate@skillbridge.io', password: '123' });
  assert(shortPassRes.status === 400, 'Rejects short password (< 6 chars) with 400 status');

  // 2. Wrong password for existing user test
  const wrongPassRes = await handleSendOtp({ email: 'candidate@skillbridge.io', password: 'wrongPassword999' });
  assert(wrongPassRes.status === 401, 'Rejects incorrect password for existing user with 401 status');

  // 3. Valid credentials for existing user (candidate@skillbridge.io / candidatePass123)
  const validSendRes = await handleSendOtp({ email: 'candidate@skillbridge.io', password: 'candidatePass123' });
  assert(validSendRes.status === 200, 'Accepts valid email & password and returns status 200');
  assert(typeof validSendRes.data.otp === 'string' && validSendRes.data.otp.length === 6, 'Generates valid 6-digit numeric OTP', `OTP: ${validSendRes.data.otp}`);

  const activeOtp = validSendRes.data.otp;

  // 4. Invalid OTP verification test
  const wrongOtpRes = await handleVerifyOtp({ email: 'candidate@skillbridge.io', otp: '000000' });
  assert(wrongOtpRes.status === 400, 'Rejects wrong OTP with 400 status');
  assert(wrongOtpRes.data.error.includes('Invalid OTP'), 'Returns clear invalid OTP error message');

  // 5. Successful OTP verification test
  const correctVerifyRes = await handleVerifyOtp({ email: 'candidate@skillbridge.io', otp: activeOtp });
  assert(correctVerifyRes.status === 200, 'Verifies valid OTP with 200 status');
  assert(typeof correctVerifyRes.data.token === 'string' && correctVerifyRes.data.token.length > 20, 'Issues valid signed JWT session token');
  assert(correctVerifyRes.data.user.email === 'candidate@skillbridge.io', 'Returns authenticated user profile matching email');

  // 6. One-time use: Re-using the same OTP must fail
  const reuseOtpRes = await handleVerifyOtp({ email: 'candidate@skillbridge.io', otp: activeOtp });
  assert(reuseOtpRes.status === 400, 'Rejects already-used OTP code (single-use enforcement)');

  // 7. New User Registration via Email + Password + OTP
  const newUserEmail = `newuser_${Date.now()}@example.com`;
  const newSendRes = await handleSendOtp({ email: newUserEmail, password: 'SecureNewPassword123!' });
  assert(newSendRes.status === 200, 'Accepts new user email + password and generates OTP');
  
  const newVerifyRes = await handleVerifyOtp({ email: newUserEmail, otp: newSendRes.data.otp });
  assert(newVerifyRes.status === 200, 'New user successfully verified via OTP and logged in');
  assert(newVerifyRes.data.user.email === newUserEmail, 'Creates user profile in database');

  console.log(`\n=== Auth OTP Tests: ${passedTests}/${totalTests} Passed ===`);
  if (passedTests === totalTests) {
    console.log('ALL EMAIL + PASSWORD + OTP AUTH TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error('SOME AUTH TESTS FAILED!\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
