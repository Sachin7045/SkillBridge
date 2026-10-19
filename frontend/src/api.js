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
  if (!res.ok) throw new Error('Failed to evaluate answer');
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

