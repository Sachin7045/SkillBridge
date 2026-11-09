import assert from 'assert';
import { chatCareerAdvisor } from './services/aiService.js';

console.log('=== Running SkillBridge AI Career Chatbot Tests ===\n');

let passedCount = 0;
function pass(msg) {
  passedCount++;
  console.log(`✓ PASS: ${msg}`);
}

async function runTests() {
  const resumeContext = {
    name: 'Sachin Yadav',
    targetRole: 'Senior Full Stack Engineer',
    skills: {
      languages: ['TypeScript', 'JavaScript', 'Python'],
      frameworks: ['React', 'Node.js', 'Express', 'Next.js'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis'],
      cloudAndDevops: ['Docker', 'AWS', 'CI/CD']
    },
    atsScore: 88
  };

  // Test 1: ATS optimization query
  const res1 = await chatCareerAdvisor([
    { role: 'user', content: 'How do I optimize my resume for ATS filters?' }
  ], resumeContext);
  assert(res1 && res1.reply, 'Should return reply for ATS optimization');
  assert(res1.reply.includes('ATS') || res1.reply.includes('Resume'), 'Reply should mention ATS or Resume');
  assert(Array.isArray(res1.suggestions) && res1.suggestions.length > 0, 'Should include follow-up suggestions');
  pass('Returns actionable ATS advice with follow-up suggestions');

  // Test 2: Technical Interview query
  const res2 = await chatCareerAdvisor([
    { role: 'user', content: 'What questions will they ask for React and Node.js?' }
  ], resumeContext);
  assert(res2 && res2.reply, 'Should return reply for technical interview');
  assert(res2.reply.includes('Technical') || res2.reply.includes('React') || res2.reply.includes('Interview'), 'Reply should address technical questions');
  pass('Returns technical interview prep roadmap');

  // Test 3: Salary negotiation query
  const res3 = await chatCareerAdvisor([
    { role: 'user', content: 'How do I negotiate salary between ₹25 LPA and ₹35 LPA?' }
  ], resumeContext);
  assert(res3 && res3.reply, 'Should return reply for salary negotiation');
  assert(res3.reply.includes('Compensation') || res3.reply.includes('Negotiation') || res3.reply.includes('Salary') || res3.reply.includes('LPA'), 'Reply should address salary negotiation');
  pass('Returns compensation negotiation strategy');

  // Test 4: Skill gap query
  const res4 = await chatCareerAdvisor([
    { role: 'user', content: 'What are my biggest skill gaps and how should I close them?' }
  ], resumeContext);
  assert(res4 && res4.reply, 'Should return reply for skill gaps');
  assert(res4.reply.includes('Skill Gap') || res4.reply.includes('Roadmap'), 'Reply should address skill gap');
  pass('Returns structured skill gap strategy');

  // Test 5: Route logic test
  async function testChatRouteHandler(body) {
    let statusCode = 200;
    let jsonResult = null;
    const req = { body };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResult = data;
        return this;
      }
    };

    const { messages, resumeContext, apiKey } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return { status: statusCode, data: jsonResult };
    }

    try {
      const chatResponse = await chatCareerAdvisor(messages, resumeContext || {}, apiKey);
      res.json({
        success: true,
        reply: chatResponse.reply || 'Here is my career advisory guidance.',
        suggestions: chatResponse.suggestions || []
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to process career chat message', details: err.message });
    }
    return { status: statusCode, data: jsonResult };
  }

  // 5a: Route rejects empty messages array
  const emptyRes = await testChatRouteHandler({ messages: [] });
  assert.strictEqual(emptyRes.status, 400, 'Should reject empty messages array with status 400');
  assert.strictEqual(emptyRes.data.error, 'Messages array is required');
  pass('Route rejects empty messages with status 400');

  // 5b: Route accepts valid messages and returns 200 with reply
  const validRes = await testChatRouteHandler({
    messages: [{ role: 'user', content: 'Give me career guidance for Full Stack' }],
    resumeContext
  });
  assert.strictEqual(validRes.status, 200, 'Should return status 200');
  assert.strictEqual(validRes.data.success, true, 'Should return success: true');
  assert(validRes.data.reply && validRes.data.reply.length > 20, 'Should return non-empty reply string');
  assert(Array.isArray(validRes.data.suggestions), 'Should return suggestions array');
  pass('Route returns 200 OK with formatted reply and suggestions');

  console.log(`\n=== AI Career Chatbot Tests: ${passedCount}/6 Passed ===`);
  console.log('ALL CAREER CHATBOT CHECKS PASSED!\n');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});