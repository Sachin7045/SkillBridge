process.env.NODE_ENV = 'test';

import { evaluateAnswer } from './services/aiService.js';

console.log('=== Running Comprehensive SkillBridge AI Interview Evaluation Tests ===\n');

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

async function runTests() {
  const sampleQuestion = "Explain how React handles the virtual DOM and reconciliation. What are the performance advantages and trade-offs?";
  const behavioralQuestion = "Tell me about a high-stakes release where unexpected blockers occurred. How did you prioritize, communicate, and deliver?";

  // -------------------------------------------------------------------------
  // TEST GROUP 1: Random characters / Gibberish (No fabricated scores!)
  // -------------------------------------------------------------------------
  const gibberishAnswer1 = "asdfghjkl";
  const evalGibberish1 = await evaluateAnswer(sampleQuestion, gibberishAnswer1);
  
  // Concept 1: Answer Validity
  assert(evalGibberish1.isValid === false, 'Random characters "asdfghjkl" has isValid: false');
  assert(evalGibberish1.validity?.status === 'INVALID', 'Answer Validity status is strictly "INVALID"');
  assert(evalGibberish1.validity?.isEvaluatable === false, 'Answer Validity isEvaluatable is false');
  assert(typeof evalGibberish1.validity?.reason === 'string' && evalGibberish1.validity.reason.length > 10, 'Validity contains explanation why answer cannot be evaluated');

  // Concept 2: Answer Quality Score (Never fabricated as a positive score or default 4/10!)
  assert(evalGibberish1.score === null, 'Random characters returns score: null (No fabricated scores)', `Score: ${evalGibberish1.score}`);
  assert(evalGibberish1.isScoreApplicable === false, 'isScoreApplicable is false for gibberish');
  assert(evalGibberish1.qualityScore?.overall === null, 'Quality score overall is null');
  assert(evalGibberish1.relevanceScore === null && evalGibberish1.technicalAccuracyScore === null, 'Subscores are null for un-evaluable gibberish');
  assert(evalGibberish1.verdict === 'Invalid Response', 'Verdict is strictly "Invalid Response"');
  assert(evalGibberish1.feedback.toLowerCase().includes('cannot be evaluated') || evalGibberish1.feedback.toLowerCase().includes('intelligible'), 'Feedback explains why evaluation is not possible');

  // Concept 3: Evaluation Confidence
  assert(evalGibberish1.evaluationConfidence?.level === 'High', 'Evaluation Confidence level is High for gibberish detection');
  assert(evalGibberish1.evaluationConfidence?.percentage >= 95, 'Evaluation Confidence percentage is >= 95%');

  // Multi-word gibberish test
  const gibberishAnswer2 = "ajksdhf kjahsd fkjhasdf qwertyuiop zxcvbnm";
  const evalGibberish2 = await evaluateAnswer(sampleQuestion, gibberishAnswer2);
  assert(evalGibberish2.score === null, 'Multi-word gibberish returns score: null');
  assert(evalGibberish2.verdict === 'Invalid Response', 'Multi-word gibberish has "Invalid Response" verdict');
  assert(evalGibberish2.validity?.status === 'INVALID', 'Multi-word gibberish validity is INVALID');

  // -------------------------------------------------------------------------
  // TEST GROUP 2: Non-attempt / Refusal ("I don't know") -> Insufficient Response
  // -------------------------------------------------------------------------
  const nonAttemptAnswer = "I don't know";
  const evalNonAttempt = await evaluateAnswer(sampleQuestion, nonAttemptAnswer);
  
  // Concept 1: Validity
  assert(evalNonAttempt.validity?.status === 'INSUFFICIENT', 'Non-attempt validity status is "INSUFFICIENT"');
  assert(evalNonAttempt.verdict === 'Insufficient Response', 'Non-attempt has "Insufficient Response" verdict');
  
  // Concept 2: Score
  assert(evalNonAttempt.score === 1.0, '"I don\'t know" receives score 1.0/10', `Score: ${evalNonAttempt.score}`);
  assert(evalNonAttempt.technicalAccuracyScore === 0.0, 'Technical accuracy for non-attempt is 0.0');
  
  // Concept 3: Confidence & Feedback
  assert(evalNonAttempt.evaluationConfidence?.percentage >= 90, 'Confidence for explicit non-attempt is >= 90%');
  assert(evalNonAttempt.feedback.toLowerCase().includes('do not know') || evalNonAttempt.feedback.toLowerCase().includes('declining'), 'Feedback guides on interview approach');

  // -------------------------------------------------------------------------
  // TEST GROUP 3: One-word irrelevant answer -> Very low score & Off-Topic
  // -------------------------------------------------------------------------
  const irrelevantAnswer = "Banana";
  const evalIrrelevant = await evaluateAnswer(sampleQuestion, irrelevantAnswer);
  assert(evalIrrelevant.score <= 1.0, 'One-word irrelevant answer receives score <= 1.0', `Score: ${evalIrrelevant.score}`);
  assert(evalIrrelevant.relevanceScore <= 1.0, 'One-word irrelevant answer has relevance <= 1.0', `Relevance: ${evalIrrelevant.relevanceScore}`);
  assert(evalIrrelevant.technicalAccuracyScore === 0.0, 'One-word irrelevant answer has 0.0 technical accuracy');
  assert(evalIrrelevant.verdict.toLowerCase().includes('off-topic') || evalIrrelevant.verdict.toLowerCase().includes('insufficient'), 'Verdict indicates off-topic or insufficient');

  const offTopicAnswer = "I really enjoy eating pepperoni pizza while watching football on the weekend.";
  const evalOffTopic = await evaluateAnswer(sampleQuestion, offTopicAnswer);
  assert(evalOffTopic.score <= 1.5, 'Irrelevant sentence about pizza receives score <= 1.5', `Score: ${evalOffTopic.score}`);
  assert(evalOffTopic.relevanceScore <= 1.0, 'Irrelevant sentence has near-zero relevance score', `Relevance: ${evalOffTopic.relevanceScore}`);
  assert(evalOffTopic.verdict === 'Off-Topic Response', 'Irrelevant sentence verdict is "Off-Topic Response"');

  // -------------------------------------------------------------------------
  // TEST GROUP 4: Partially correct answer -> Low or moderate score
  // -------------------------------------------------------------------------
  const partiallyCorrectAnswer = "React is a JavaScript library used to build user interfaces. It uses components.";
  const evalPartial = await evaluateAnswer(sampleQuestion, partiallyCorrectAnswer);
  assert(evalPartial.score >= 3.5 && evalPartial.score <= 6.0, 'Basic definition receives low/moderate score (3.5-6.0)', `Score: ${evalPartial.score}`);
  assert(evalPartial.relevanceScore >= 5.0, 'Partially correct answer has moderate relevance', `Relevance: ${evalPartial.relevanceScore}`);
  assert(evalPartial.technicalDepthScore <= 5.0, 'Partially correct answer has low depth due to missing reconciliation details', `Depth: ${evalPartial.technicalDepthScore}`);
  assert(evalPartial.validity?.status === 'VALID', 'Partially correct answer validity is VALID');

  // -------------------------------------------------------------------------
  // TEST GROUP 5: Relevant but incomplete answer -> Moderate score
  // -------------------------------------------------------------------------
  const relevantIncompleteAnswer = "React uses a virtual copy of the DOM in memory to track changes. When state changes, it compares the new virtual DOM with the previous one and updates only the changed parts of the real DOM instead of reloading the entire page.";
  const evalIncomplete = await evaluateAnswer(sampleQuestion, relevantIncompleteAnswer);
  assert(evalIncomplete.score >= 6.0 && evalIncomplete.score <= 8.2, 'Relevant incomplete answer receives moderate score (6.0-8.2)', `Score: ${evalIncomplete.score}`);
  assert(evalIncomplete.relevanceScore >= 7.0, 'Relevant incomplete answer has high relevance', `Relevance: ${evalIncomplete.relevanceScore}`);
  assert(evalIncomplete.technicalAccuracyScore >= 6.5, 'Relevant incomplete answer has solid technical accuracy', `Accuracy: ${evalIncomplete.technicalAccuracyScore}`);

  // -------------------------------------------------------------------------
  // TEST GROUP 6: Correct technical answer -> High score
  // -------------------------------------------------------------------------
  const correctTechnicalAnswer = "React maintains a Virtual DOM in memory, which is a lightweight representation of the real DOM. When state or props update, React creates a new virtual DOM tree and performs reconciliation using its diffing algorithm. It batches updates and applies minimal real DOM operations to prevent expensive browser layout recalculations and repaints.";
  const evalCorrect = await evaluateAnswer(sampleQuestion, correctTechnicalAnswer);
  assert(evalCorrect.score >= 8.0 && evalCorrect.score < 9.2, 'Correct technical answer receives high score (8.0-9.2)', `Score: ${evalCorrect.score}`);
  assert(evalCorrect.technicalAccuracyScore >= 8.0, 'Correct technical answer has high technical accuracy', `Accuracy: ${evalCorrect.technicalAccuracyScore}`);
  assert(evalCorrect.verdict === 'Strong Technical Response', 'Correct technical answer gets "Strong Technical Response" verdict');
  assert(evalCorrect.validity?.status === 'VALID', 'Correct answer validity is VALID');
  assert(evalCorrect.evaluationConfidence?.percentage >= 90, 'Confidence is >= 90%');

  // -------------------------------------------------------------------------
  // TEST GROUP 7: Excellent detailed answer -> Excellent staff-level score
  // -------------------------------------------------------------------------
  const excellentAnswer = "React uses a Virtual DOM—an in-memory lightweight representation of the browser DOM tree. When a component's state or props change, React runs its reconciliation diffing algorithm in O(n) heuristic time by comparing element types and unique keys. Rather than performing immediate costly mutations on the real browser DOM, React batches updates and applies the calculated diffs during the commit phase. This dramatically reduces browser reflows and repaints, improving frame rates and user responsiveness. Trade-offs include memory overhead from maintaining two in-memory virtual trees and CPU cycles for diffing on high-frequency state updates.";
  const evalExcellent = await evaluateAnswer(sampleQuestion, excellentAnswer);
  assert(evalExcellent.score >= 9.0, 'Excellent detailed answer receives score >= 9.0', `Score: ${evalExcellent.score}`);
  assert(evalExcellent.relevanceScore >= 9.0, 'Excellent answer has top relevance', `Relevance: ${evalExcellent.relevanceScore}`);
  assert(evalExcellent.technicalAccuracyScore >= 9.0, 'Excellent answer has top accuracy', `Accuracy: ${evalExcellent.technicalAccuracyScore}`);
  assert(evalExcellent.technicalDepthScore >= 8.5, 'Excellent answer has top depth', `Depth: ${evalExcellent.technicalDepthScore}`);
  assert(evalExcellent.verdict === 'Exceptional Staff-Level Response', 'Excellent answer receives "Exceptional Staff-Level Response" verdict');

  // -------------------------------------------------------------------------
  // TEST GROUP 8: Behavioral STAR Answer evaluation
  // -------------------------------------------------------------------------
  const starAnswer = "Situation: At my previous company, during a high-stakes sprint 48 hours before our production release, our payment gateway introduced a breaking change to their webhook authentication. Task: I was responsible for fixing the webhook verification and preventing any delay to our launch. Action: I immediately coordinated an emergency sync with our backend and product teams. I implemented cryptographic HMAC-SHA256 signature verification, added distributed idempotency keys in Redis to prevent duplicate transactions, and wrote automated integration tests simulating webhook replays. Result: We deployed the patch 6 hours ahead of the deadline, achieved 100% test pass rate, and successfully processed over 30,000 transactions with zero downtime.";
  const evalStar = await evaluateAnswer(behavioralQuestion, starAnswer, { category: 'Behavioral' });
  assert(evalStar.score >= 9.0, 'Behavioral STAR answer receives score >= 9.0', `Score: ${evalStar.score}`);
  assert(evalStar.structureType === 'STAR Structure', 'Structure type is properly labeled "STAR Structure"');
  assert(evalStar.structureScore >= 9.0, 'Full STAR coverage receives high structure score', `Structure: ${evalStar.structureScore}`);

  // -------------------------------------------------------------------------
  // TEST GROUP 9: Mathematical formula verification (5 Weighted Criteria)
  // Overall = 25% Relevance + 30% Tech Accuracy + 15% Clarity + 20% Depth + 10% Structure
  // -------------------------------------------------------------------------
  const rel = evalCorrect.relevanceScore;
  const acc = evalCorrect.technicalAccuracyScore;
  const cla = evalCorrect.clarityScore;
  const dep = evalCorrect.technicalDepthScore;
  const str = evalCorrect.structureScore;
  const expectedWeighted = Number(((rel * 0.25) + (acc * 0.30) + (cla * 0.15) + (dep * 0.20) + (str * 0.10)).toFixed(1));
  assert(Math.abs(evalCorrect.score - expectedWeighted) <= 0.1, 'Overall score matches 25%+30%+15%+20%+10% weighted formula precisely', `Actual: ${evalCorrect.score}, Expected: ${expectedWeighted}`);

  // -------------------------------------------------------------------------
  // TEST GROUP 10: Strict Separation of Concepts in Evaluation Output
  // -------------------------------------------------------------------------
  // Check that the returned object contains the 3 clearly separated concepts
  assert(evalCorrect.validity && typeof evalCorrect.validity.status === 'string', 'Concept 1: Contains validity object with status');
  assert(evalCorrect.qualityScore && typeof evalCorrect.qualityScore.overall === 'number', 'Concept 2: Contains qualityScore object with overall numeric rating');
  assert(evalCorrect.evaluationConfidence && typeof evalCorrect.evaluationConfidence.percentage === 'number', 'Concept 3: Contains evaluationConfidence object with percentage');
  assert(evalCorrect.technicalAccuracyScore !== undefined, 'Subscore "technicalAccuracyScore" measures factual correctness');

  // Check scorecard detailed fields
  assert(Array.isArray(evalCorrect.strengths) && evalCorrect.strengths.length > 0, 'Scorecard contains strengths array');
  assert(Array.isArray(evalCorrect.weaknesses), 'Scorecard contains weaknesses array');
  assert(Array.isArray(evalCorrect.missingConcepts) && evalCorrect.missingConcepts.length > 0, 'Scorecard contains missingConcepts array');
  assert(Array.isArray(evalCorrect.suggestions) && evalCorrect.suggestions.length > 0, 'Scorecard contains suggestions array');
  assert(typeof evalCorrect.modelAnswer === 'string' && evalCorrect.modelAnswer.length > 50, 'Scorecard contains detailed ideal model answer');

  // -------------------------------------------------------------------------
  // TEST GROUP 11: Dynamic Scores - Never return hardcoded default 4/10
  // -------------------------------------------------------------------------
  const distinctScores = new Set([
    evalGibberish1.score, // null
    evalNonAttempt.score, // 1.0
    evalIrrelevant.score, // ~0.3
    evalPartial.score,    // ~5.5
    evalIncomplete.score, // ~7.9
    evalCorrect.score,    // ~8.4
    evalExcellent.score   // ~9.4
  ]);
  assert(distinctScores.size >= 6, 'Dynamic evaluation generates distinctive scores across varied answer qualities', `Unique scores: ${Array.from(distinctScores).join(', ')}`);
  assert(!distinctScores.has(4.0) && evalGibberish1.score !== 4.0, 'Never assigns hardcoded 4/10 to answers');

  // -------------------------------------------------------------------------
  // TEST GROUP 12: Route Handler Validation Tests (Mock Req/Res)
  // -------------------------------------------------------------------------
  async function testRouteHandler(body) {
    const req = { body };
    let statusCode = 200;
    let jsonResult = null;
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

    // Route logic matches server.js POST /api/interview/evaluate-answer
    const { question, answer, resumeContext, apiKey } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      res.status(400).json({ error: 'Interview question is required.' });
      return { status: statusCode, data: jsonResult };
    }
    if (!answer || typeof answer !== 'string' || !answer.trim()) {
      res.status(400).json({ error: 'Answer cannot be empty. Please provide a response.' });
      return { status: statusCode, data: jsonResult };
    }
    try {
      const evaluation = await evaluateAnswer(question.trim(), answer.trim(), resumeContext || {}, apiKey);
      res.json({ success: true, evaluation });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to evaluate answer' });
    }
    return { status: statusCode, data: jsonResult };
  }

  // 12a: Test Empty Answer rejection (400 Bad Request)
  const emptyResult = await testRouteHandler({ question: sampleQuestion, answer: '   ' });
  assert(emptyResult.status === 400, 'Route handler rejects empty answer with status 400');
  assert(emptyResult.data.error.includes('empty'), 'Route handler returns clear error for empty answer', emptyResult.data.error);

  // 12b: Test Missing Question rejection (400 Bad Request)
  const missingQResult = await testRouteHandler({ question: '', answer: 'Some answer' });
  assert(missingQResult.status === 400, 'Route handler rejects missing question with status 400');

  // 12c: Test Gibberish evaluation via route handler (200 OK, score: null, verdict: 'Invalid Response')
  const gibberishResult = await testRouteHandler({ question: sampleQuestion, answer: 'asdfghjkl' });
  assert(gibberishResult.status === 200, 'Route handler accepts gibberish and returns 200 evaluation');
  assert(gibberishResult.data.evaluation.score === null, 'Route handler returns score: null for gibberish (no fake score)', `Score: ${gibberishResult.data.evaluation.score}`);
  assert(gibberishResult.data.evaluation.verdict === 'Invalid Response', 'Route handler returns "Invalid Response" verdict for gibberish');
  assert(gibberishResult.data.evaluation.validity.status === 'INVALID', 'Route handler returns validity status INVALID');

  // 12d: Test Valid technical evaluation via route handler (200 OK)
  const validResult = await testRouteHandler({ question: sampleQuestion, answer: correctTechnicalAnswer });
  assert(validResult.status === 200, 'Route handler accepts valid technical answer and returns 200');
  assert(validResult.data.evaluation.score >= 8.0, 'Route handler returns high score for valid technical answer', `Score: ${validResult.data.evaluation.score}`);
  assert(Boolean(validResult.data.evaluation.modelAnswer), 'Route handler includes ideal model answer');

  // 12e: Test Malformed input error handling (Route error handling)
  const errorResult = await testRouteHandler({ question: 12345, answer: null });
  assert(errorResult.status === 400, 'Route handler rejects invalid data types with 400');

  console.log(`\n=== Evaluation Test Results: ${passedTests}/${totalTests} Passed ===`);
  if (passedTests === totalTests) {
    console.log('ALL AI INTERVIEW EVALUATION CHECKS PASSED!\n');
    process.exit(0);
  } else {
    console.error('SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
