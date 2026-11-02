import assert from 'node:assert';
import { evaluateAnswer } from './services/aiService.js';

console.log('=== Running Multilingual AI Interview Evaluation Tests ===\n');

async function testMultilingual() {
  const question = "Can you explain how React handles reconciliation and what role the virtual DOM plays?";

  // 1. Hindi Technical Response
  console.log('--- 1. Testing Hindi Technical Answer ---');
  const hindiAnswer = "रिएक्ट में रिकॉन्सिलेशन एक डिफिंग एल्गोरिदम है जिसमें वर्चुअल डॉम रियल डॉम के साथ तुलना करता है। जब कंपोनेंट की स्टेट बदलती है, तो रिएक्ट नया वर्चुअल डॉम ट्री बनाता है और केवल बदले हुए नोड्स को रियल डॉम में कमिट करता है, जिससे ब्राउज़र की परफॉर्मेंस तेज़ रहती है।";
  const hindiEval = await evaluateAnswer(question, hindiAnswer, { category: 'Technical' });
  assert(hindiEval.isValid === true, "Hindi technical answer is marked VALID");
  assert(hindiEval.score >= 7.0, `Hindi answer receives high score (${hindiEval.score}/10)`);
  assert(hindiEval.verdict !== 'Invalid Response', "Hindi answer does not receive Invalid Response verdict");
  console.log(`✓ PASS: Hindi response evaluated successfully with score ${hindiEval.score}/10 and verdict "${hindiEval.verdict}"`);

  // 2. Hinglish Technical Response
  console.log('\n--- 2. Testing Hinglish Technical Answer ---');
  const hinglishAnswer = "React me reconciliation ek diffing process hai jisme Virtual DOM real DOM ke sath compare hota hai. State change hone par React fiber tree recalculate karta hai aur batch updates commit karta hai jisse DOM manipulation minimum hoti hai aur performance improve hoti hai.";
  const hinglishEval = await evaluateAnswer(question, hinglishAnswer, { category: 'Technical' });
  assert(hinglishEval.isValid === true, "Hinglish technical answer is marked VALID");
  assert(hinglishEval.score >= 7.0, `Hinglish answer receives high score (${hinglishEval.score}/10)`);
  console.log(`✓ PASS: Hinglish response evaluated successfully with score ${hinglishEval.score}/10`);

  // 3. Spanish Technical Response
  console.log('\n--- 3. Testing Spanish Technical Answer ---');
  const spanishAnswer = "La reconciliación en React es el algoritmo mediante el cual compara el Virtual DOM con el DOM real utilizando un proceso de diffing eficiente. Cuando el estado cambia, genera un nuevo árbol y aplica únicamente las mutaciones necesarias en lote para optimizar el rendimiento.";
  const spanishEval = await evaluateAnswer(question, spanishAnswer, { category: 'Technical' });
  assert(spanishEval.isValid === true, "Spanish technical answer is marked VALID");
  assert(spanishEval.score >= 7.0, `Spanish answer receives high score (${spanishEval.score}/10)`);
  console.log(`✓ PASS: Spanish response evaluated successfully with score ${spanishEval.score}/10`);

  // 4. Hindi Non-Attempt ("मुझे नहीं पता")
  console.log('\n--- 4. Testing Multilingual Non-Attempt Detection ---');
  const hindiNonAttempt = "मुझे नहीं पता";
  const hindiNonAttemptEval = await evaluateAnswer(question, hindiNonAttempt, { category: 'Technical' });
  assert(hindiNonAttemptEval.validity.status === 'INSUFFICIENT', "Hindi 'मुझे नहीं पता' recognized as INSUFFICIENT non-attempt");
  assert(hindiNonAttemptEval.score <= 1.5, "Hindi non-attempt receives low score");
  console.log(`✓ PASS: Hindi non-attempt correctly flagged as ${hindiNonAttemptEval.validity.status}`);

  // 5. Hinglish Non-Attempt ("mujhe nahi pata")
  const hinglishNonAttempt = "mujhe nahi pata";
  const hinglishNonAttemptEval = await evaluateAnswer(question, hinglishNonAttempt, { category: 'Technical' });
  assert(hinglishNonAttemptEval.validity.status === 'INSUFFICIENT', "Hinglish 'mujhe nahi pata' recognized as INSUFFICIENT non-attempt");
  console.log(`✓ PASS: Hinglish non-attempt correctly flagged as ${hinglishNonAttemptEval.validity.status}`);

  console.log('\n=== ALL MULTILINGUAL INTERVIEW CHECKS PASSED! ===');
}

testMultilingual().catch(err => {
  console.error('Multilingual test failure:', err);
  process.exit(1);
});

