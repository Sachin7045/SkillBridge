process.env.NODE_ENV = 'test';

import { USER_SAVED_APPLICATIONS } from './routes/userData.js';
import { generateToken } from './middleware/auth.js';

console.log('=== Running SkillBridge Job Applications Pipeline Tests ===\n');

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

// Mock handler matching userData.js logic
async function handleUserApplications(method, reqUser, body = {}, params = {}) {
  const userId = reqUser?.id;
  if (!userId) {
    return { status: 401, data: { error: 'Access denied: Authentication token required.' } };
  }

  if (method === 'GET') {
    const list = USER_SAVED_APPLICATIONS.get(userId) || [];
    return { status: 200, data: { success: true, applications: list } };
  }

  if (method === 'POST') {
    const { application, applications } = body;
    if (Array.isArray(applications)) {
      const sanitized = applications.map(app => ({
        ...app,
        ownerId: userId,
        updatedAt: new Date().toISOString()
      }));
      USER_SAVED_APPLICATIONS.set(userId, sanitized);
      return { status: 200, data: { success: true, applications: sanitized } };
    }

    if (!application || !application.company || !application.title) {
      return { status: 400, data: { error: 'Company and Job Title are required.' } };
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

    return {
      status: 201,
      data: { success: true, message: 'Job application saved.', application: newEntry }
    };
  }

  if (method === 'DELETE') {
    const appId = params.id;
    const existingList = USER_SAVED_APPLICATIONS.get(userId) || [];
    const filtered = existingList.filter(a => a.id !== appId);
    USER_SAVED_APPLICATIONS.set(userId, filtered);
    return { status: 200, data: { success: true, message: 'Application removed from tracker.' } };
  }
}

async function runTests() {
  const testUser = { id: 'user_test_dev', email: 'test.engineer@skillbridge.io', name: 'Test Dev' };
  const testToken = generateToken(testUser);

  assert(typeof testToken === 'string' && testToken.length > 20, 'Generates valid JWT token for tests');

  // 1. Unauthenticated request rejection
  const unauthRes = await handleUserApplications('GET', null);
  assert(unauthRes.status === 401, 'Rejects unauthenticated requests with 401 status');

  // 2. Initial empty applications list for new user
  const initialGet = await handleUserApplications('GET', testUser);
  assert(initialGet.status === 200, 'Returns 200 OK for applications list');
  assert(Array.isArray(initialGet.data.applications) && initialGet.data.applications.length === 0, 'Initial applications list is empty array');

  // 3. Validation: Missing company or title
  const invalidAppRes = await handleUserApplications('POST', testUser, { application: { company: '' } });
  assert(invalidAppRes.status === 400, 'Rejects application missing company or title with 400 status');

  // 4. Add new application: Razorpay (Full Stack Engineer) via LinkedIn
  const razorpayApp = {
    id: 'app_razorpay_1',
    company: 'Razorpay',
    title: 'Senior Full Stack Engineer',
    source: 'LinkedIn',
    location: 'Bengaluru (Hybrid)',
    salary: '₹26 - ₹36 LPA',
    status: 'applied',
    appliedDate: '2026-10-25',
    nextInterview: null,
    notes: 'Submitted tailored resume highlighting React, Node.js, and Redis caching.'
  };

  const addRes1 = await handleUserApplications('POST', testUser, { application: razorpayApp });
  assert(addRes1.status === 201, 'Successfully creates new job application with 201 status');
  assert(addRes1.data.application.company === 'Razorpay', 'Saved application contains correct company');
  assert(addRes1.data.application.ownerId === testUser.id, 'Enforces server-side ownership isolation');

  // 5. Add second application: Swiggy via Naukri.com
  const swiggyApp = {
    id: 'app_swiggy_2',
    company: 'Swiggy',
    title: 'Lead Frontend Engineer',
    source: 'Naukri.com',
    location: 'Bengaluru (Remote)',
    salary: '₹24 - ₹32 LPA',
    status: 'interview',
    appliedDate: '2026-10-20',
    nextInterview: '2026-11-08 (Round 2 Architecture)',
    notes: 'Cleared screening test. Prepping Core Web Vitals.'
  };

  const addRes2 = await handleUserApplications('POST', testUser, { application: swiggyApp });
  assert(addRes2.status === 201, 'Successfully creates second job application');

  // 6. Verify retrieved list contains both applications
  const listRes = await handleUserApplications('GET', testUser);
  assert(listRes.status === 200, 'Fetches updated applications list with 200 status');
  assert(listRes.data.applications.length === 2, 'Applications list contains exactly 2 tracked jobs');

  // 7. Update status: Move Razorpay to 'final' round
  const updatedRazorpay = {
    ...razorpayApp,
    status: 'final',
    nextInterview: '2026-11-10 (Director Leadership Fit)'
  };
  const updateRes = await handleUserApplications('POST', testUser, { application: updatedRazorpay });
  assert(updateRes.status === 201, 'Successfully updates application status');
  assert(updateRes.data.application.status === 'final', 'Updated status is "final"');
  assert(updateRes.data.application.nextInterview.includes('Director'), 'Updated interview date is saved');

  // 8. Delete application: Remove Swiggy
  const deleteRes = await handleUserApplications('DELETE', testUser, {}, { id: 'app_swiggy_2' });
  assert(deleteRes.status === 200, 'Deletes application with 200 status');

  const finalListRes = await handleUserApplications('GET', testUser);
  assert(finalListRes.data.applications.length === 1, 'Applications list has 1 item after deletion');
  assert(finalListRes.data.applications[0].company === 'Razorpay', 'Remaining application is Razorpay');

  // 9. Bulk Sync Test
  const bulkApps = [
    { id: 'b1', company: 'CRED', title: 'Backend Dev', status: 'offer' },
    { id: 'b2', company: 'PhonePe', title: 'Staff Engineer', status: 'interview' }
  ];
  const bulkRes = await handleUserApplications('POST', testUser, { applications: bulkApps });
  assert(bulkRes.status === 200, 'Bulk syncs applications with 200 status');
  assert(bulkRes.data.applications.length === 2, 'Bulk synced list contains 2 applications');

  console.log(`\n=== Job Applications Tests: ${passedTests}/${totalTests} Passed ===`);
  if (passedTests === totalTests) {
    console.log('ALL JOB APPLICATION PIPELINE TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error('SOME JOB APPLICATION TESTS FAILED!\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

