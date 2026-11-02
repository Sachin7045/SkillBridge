process.env.NODE_ENV = 'test';

import assert from 'node:assert';
import { generateQuestions, evaluateAnswer } from './services/aiService.js';

console.log('=== Running Software Engineering Fields AI Interview Verification ===\n');

async function runTests() {
  const sampleResume = {
    name: "Alex Dev",
    title: "Lead Full Stack & Systems Engineer",
    summary: "Senior engineer with expertise in React, Node.js, PostgreSQL, Kubernetes, Kafka, and AI engineering.",
    experience: [
      {
        role: "Senior Staff Engineer",
        company: "Stripe",
        bullets: [
          "Architected high-throughput payment settlement engine processing $12B annually with 99.999% availability.",
          "Migrated monolithic checkout to event-driven microservices using Kafka, Redis caching, and PostgreSQL."
        ]
      }
    ],
    skills: {
      languages: ["JavaScript", "TypeScript", "Python", "Go"],
      frameworks: ["React", "Next.js", "Node.js", "FastAPI"],
      databases: ["PostgreSQL", "Redis", "MongoDB", "pgvector"],
      cloudAndDevops: ["AWS", "Kubernetes", "Docker", "Terraform"]
    },
    projects: [
      {
        name: "Enterprise RAG & Data Engine",
        tech: ["React", "FastAPI", "Milvus", "Kafka"]
      }
    ]
  };

  // 1. Verify "all" category generates comprehensive software engineering coverage
  console.log('--- 1. Testing Comprehensive Software Catalog (Category: all) ---');
  const allQuestions = await generateQuestions(sampleResume, 'all');
  assert(Array.isArray(allQuestions), 'Returns an array of questions');
  assert(allQuestions.length === 24, `Expected 24 comprehensive questions, got ${allQuestions.length}`);
  console.log(`✓ PASS: Generated ${allQuestions.length} software engineering interview questions across all disciplines.`);

  // 2. Verify all 12 software fields filter cleanly
  console.log('\n--- 2. Testing Software Engineering Category Filtering ---');
  const categoriesToTest = [
    { cat: 'Frontend', minExpected: 2, keyword: 'React' },
    { cat: 'Backend', minExpected: 2, keyword: 'Microservices' },
    { cat: 'Database', minExpected: 2, keyword: 'PostgreSQL' },
    { cat: 'System Design', minExpected: 2, keyword: 'Architecture' },
    { cat: 'DevOps', minExpected: 2, keyword: 'Kubernetes' },
    { cat: 'Data Engineering', minExpected: 2, keyword: 'Kafka' },
    { cat: 'AI & Machine Learning', minExpected: 2, keyword: 'RAG' },
    { cat: 'Cybersecurity', minExpected: 2, keyword: 'OWASP' },
    { cat: 'Mobile', minExpected: 2, keyword: 'Mobile' },
    { cat: 'Testing & SRE', minExpected: 2, keyword: 'Testing' },
    { cat: 'Behavioral', minExpected: 2, keyword: 'Conflict' },
    { cat: 'Resume Deep-Dive', minExpected: 2, keyword: 'Stripe' },
  ];

  for (const { cat, minExpected } of categoriesToTest) {
    const questions = await generateQuestions(sampleResume, cat);
    assert(questions.length >= minExpected, `Category "${cat}" should return at least ${minExpected} questions (got ${questions.length})`);
    console.log(`✓ PASS: Category "${cat}" returns ${questions.length} questions`);
  }

  // 3. Verify AI evaluation across diverse software fields
  console.log('\n--- 3. Testing Technical Answer Evaluation Across Disciplines ---');

  // Test AI / ML answer
  const aiAnswer = "We constructed an enterprise RAG system chunking technical PDFs with 500 tokens and 10% overlap. We created dense vector embeddings stored in pgvector using HNSW indexing for rapid cosine similarity search. We combined this with BM25 keyword search in a hybrid retrieval model using Reciprocal Rank Fusion and reranked using a Cross-Encoder. We served inference via vLLM with PagedAttention and FP16 quantization, which eliminated hallucinations and achieved 45ms TTFT.";
  const aiEval = await evaluateAnswer(
    "Design an enterprise-grade Retrieval-Augmented Generation (RAG) system...",
    aiAnswer,
    { category: 'AI & Machine Learning' }
  );
  assert(aiEval.isValid === true, 'AI/ML answer is valid');
  assert(aiEval.score >= 8.0, `AI/ML answer receives high score >= 8.0 (got ${aiEval.score})`);
  console.log(`✓ PASS: AI & Machine Learning answer evaluated with score: ${aiEval.score}/10 (${aiEval.verdict})`);

  // Test Cybersecurity answer
  const secAnswer = "To prevent OWASP Top 10 vulnerabilities, we eliminate SQL injection via parameterized queries and prepared statements. For XSS, we enforce Content Security Policy nonces and context-aware sanitization. For authentication, access tokens are short-lived while refresh tokens are stored in HttpOnly, Secure, SameSite=Strict cookies to protect against token theft via XSS. In mobile and SPA clients, we mandate OAuth 2.0 PKCE with SHA-256 verifiers.";
  const secEval = await evaluateAnswer(
    "Walk me through the most critical vulnerabilities in the OWASP Top 10...",
    secAnswer,
    { category: 'Cybersecurity' }
  );
  assert(secEval.isValid === true, 'Cybersecurity answer is valid');
  assert(secEval.score >= 8.0, `Cybersecurity answer receives high score >= 8.0 (got ${secEval.score})`);
  console.log(`✓ PASS: Cybersecurity answer evaluated with score: ${secEval.score}/10 (${secEval.verdict})`);

  // Test DevOps & Cloud answer
  const devopsAnswer = "We deploy microservices to Kubernetes clusters using Canary deployments managed by Istio service mesh, shifting 10% to 100% traffic gradually. We configure custom Prometheus metrics for Horizontal Pod Autoscaling (HPA) and set liveness and readiness probes to prevent routing requests to unhealthy containers. We manage infrastructure as code via Terraform with remote state locking in DynamoDB.";
  const devopsEval = await evaluateAnswer(
    "Walk me through architecting a production Kubernetes cluster for microservices...",
    devopsAnswer,
    { category: 'DevOps & Cloud' }
  );
  assert(devopsEval.isValid === true, 'DevOps answer is valid');
  assert(devopsEval.score >= 8.0, `DevOps answer receives high score >= 8.0 (got ${devopsEval.score})`);
  console.log(`✓ PASS: DevOps & Cloud answer evaluated with score: ${devopsEval.score}/10 (${devopsEval.verdict})`);

  // Test Mobile Engineering answer
  const mobileAnswer = "We architected an offline-first mobile app using React Native and WatermelonDB SQLite storage. User writes commit instantly to the local reactive database for optimistic UI responsiveness, then append to a persistent background queue with exponential backoff sync. We use React Native TurboModules and JSI for zero-overhead native bridge calls, virtualize large lists with FlashList cell recycling, and profile memory leaks via Android Studio.";
  const mobileEval = await evaluateAnswer(
    "How do you design an offline-first mobile application...",
    mobileAnswer,
    { category: 'Mobile Engineering' }
  );
  assert(mobileEval.isValid === true, 'Mobile answer is valid');
  assert(mobileEval.score >= 8.0, `Mobile answer receives high score >= 8.0 (got ${mobileEval.score})`);
  console.log(`✓ PASS: Mobile Engineering answer evaluated with score: ${mobileEval.score}/10 (${mobileEval.verdict})`);

  console.log('\n=== ALL SOFTWARE ENGINEERING FIELD CHECKS PASSED SUCCESSFULLY! ===\n');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});

