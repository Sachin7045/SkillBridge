const API_BASE = '/api';

export async function fetchSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch samples');
  return res.json();
}

export async function fetchRoles() {
  const res = await fetch(`${API_BASE}/roles`);
  if (!res.ok) throw new Error('Failed to fetch roles');
  return res.json();
}

export async function uploadResumeFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to parse resume file');
  }
  return res.json();
}

export async function parseResumeText(text) {
  const res = await fetch(`${API_BASE}/resume/parse-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to parse text');
  return res.json();
}

export async function analyzeResumeApi(resume, targetRole, jobDescription) {
  const res = await fetch(`${API_BASE}/resume/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, targetRole, jobDescription })
  });
  if (!res.ok) throw new Error('Failed to analyze resume');
  return res.json();
}

export async function generateQuestionsApi(resume, category, apiKey) {
  const res = await fetch(`${API_BASE}/interview/generate-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, category, apiKey })
  });
  if (!res.ok) throw new Error('Failed to generate interview questions');
  return res.json();
}

export async function evaluateAnswerApi(question, answer, resumeContext, apiKey) {
  const res = await fetch(`${API_BASE}/interview/evaluate-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer, resumeContext, apiKey })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to evaluate answer');
  }
  return res.json();
}

export async function generateRoadmapApi(resume, targetRole, apiKey) {
  const res = await fetch(`${API_BASE}/roadmap/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, targetRole, apiKey })
  });
  if (!res.ok) throw new Error('Failed to generate roadmap');
  return res.json();
}

export async function optimizeBulletApi(bullet, contextTech, apiKey) {
  const res = await fetch(`${API_BASE}/bullet/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bullet, contextTech, apiKey })
  });
  if (!res.ok) throw new Error('Failed to optimize bullet');
  return res.json();
}

export async function generateCoverLetterApi(resume, companyName, targetRole, jobDescription, apiKey) {
  const res = await fetch(`${API_BASE}/cover-letter/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, companyName, targetRole, jobDescription, apiKey })
  });
  if (!res.ok) throw new Error('Failed to generate cover letter');
  return res.json();
}

// Authentication API
export async function sendOtpApi(email, password) {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');
  return data;
}

export async function verifyOtpApi(email, otp, password = '') {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Invalid OTP code.');
  return data;
}

export async function registerUser(email, password, name) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function loginUser(email, password, name = '') {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function fetchCurrentUser(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Session expired');
  return res.json();
}

// User Saved Resumes Persistence API
export async function saveResumeToCloud(resume, token) {
  const res = await fetch(`${API_BASE}/user-data/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ resume })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save resume to cloud');
  return data;
}

// User Job Applications Persistence API
export async function fetchUserApplications(token) {
  const res = await fetch(`${API_BASE}/user-data/applications`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.applications || [];
}

export async function saveApplicationToCloud(application, token) {
  const res = await fetch(`${API_BASE}/user-data/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ application })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save application.');
  return data;
}

export async function deleteApplicationFromCloud(id, token) {
  const res = await fetch(`${API_BASE}/user-data/applications/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function fetchUserResumes(token) {
  const res = await fetch(`${API_BASE}/user-data/resumes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch saved resumes');
  return data;
}

export async function deleteUserResume(resumeId, token) {
  const res = await fetch(`${API_BASE}/user-data/resumes/${resumeId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete resume');
  return data;
}

