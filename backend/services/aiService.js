import { ROLE_TAXONOMY, POWER_ACTION_VERBS } from '../data/roleKeywords.js';

/**
 * AI Service for SkillBridge.
 * Supports both live Gemini API (if apiKey provided) and an advanced contextual local AI engine.
 */
export async function generateQuestions(resume, category = "all", apiKey = null) {
  if (apiKey || process.env.GEMINI_API_KEY) {
    try {
      return await generateQuestionsWithGemini(resume, category, apiKey || process.env.GEMINI_API_KEY);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to smart local AI engine:", err.message);
    }
  }
  return generateQuestionsLocal(resume, category);
}

export async function evaluateAnswer(question, answer, resumeContext = {}, apiKey = null) {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
  if (apiKey) {
    // If the user explicitly provided an API key, call Gemini and do not silently fall back to fake scores
    try {
      return await evaluateAnswerWithGemini(question, answer, resumeContext, effectiveKey);
    } catch (err) {
      console.error("Gemini evaluation error with user-provided API key:", err.message);
      throw new Error(`AI Evaluation Error: ${err.message}`);
    }
  } else if (process.env.GEMINI_API_KEY) {
    try {
      return await evaluateAnswerWithGemini(question, answer, resumeContext, process.env.GEMINI_API_KEY);
    } catch (err) {
      console.warn("Server Gemini evaluation failed, falling back to smart local evaluation engine:", err.message);
    }
  }
  return evaluateAnswerLocal(question, answer, resumeContext);
}

export async function generateRoadmap(resume, targetRole, apiKey = null) {
  if (apiKey || process.env.GEMINI_API_KEY) {
    try {
      return await generateRoadmapWithGemini(resume, targetRole, apiKey || process.env.GEMINI_API_KEY);
    } catch (err) {
      console.warn("Gemini roadmap failed, falling back to smart local AI engine:", err.message);
    }
  }
  return generateRoadmapLocal(resume, targetRole);
}

export async function optimizeBullet(rawBullet, contextTech = "", apiKey = null) {
  if (apiKey || process.env.GEMINI_API_KEY) {
    try {
      return await optimizeBulletWithGemini(rawBullet, contextTech, apiKey || process.env.GEMINI_API_KEY);
    } catch (err) {
      console.warn("Gemini bullet optimization failed, falling back to smart local AI engine:", err.message);
    }
  }
  return optimizeBulletLocal(rawBullet, contextTech);
}

export async function generateCoverLetter(resume, companyName, targetRole, jobDescription, apiKey = null) {
  if (apiKey || process.env.GEMINI_API_KEY) {
    try {
      return await generateCoverLetterWithGemini(resume, companyName, targetRole, jobDescription, apiKey || process.env.GEMINI_API_KEY);
    } catch (err) {
      console.warn("Gemini cover letter generation failed, falling back to smart local AI engine:", err.message);
    }
  }
  return generateCoverLetterLocal(resume, companyName, targetRole, jobDescription);
}

// ==========================================
// LOCAL INTELLIGENT HEURISTIC AI ENGINE
// ==========================================

function generateQuestionsLocal(resume, category) {
  const safeResume = resume || {};
  const experiences = safeResume.experience || [];
  const topExp = experiences[0] || { role: 'Software Engineer', company: 'a tech company', bullets: [] };
  const secondExp = experiences[1] || null;

  const projects = safeResume.projects || [];
  const topProject = projects[0] || null;

  const allSkills = [
    ...(safeResume.skills?.languages || []),
    ...(safeResume.skills?.frameworks || []),
    ...(safeResume.skills?.databases || []),
    ...(safeResume.skills?.cloudAndDevops || []),
    ...(safeResume.skills?.tools || []),
  ];

  // Pull actual bullet points for concrete context
  const allBullets = experiences.flatMap(e => e.bullets || []).filter(b => b.length > 20);
  const topBullet  = allBullets[0] || '';
  const secondBullet = allBullets[1] || '';

  const skill1 = allSkills[0] || 'JavaScript';
  const skill2 = allSkills[1] || 'Node.js';
  const skill3 = allSkills[2] || 'PostgreSQL';
  const dbSkill = (safeResume.skills?.databases || [])[0] || skill3;
  const cloudSkill = (safeResume.skills?.cloudAndDevops || [])[0] || 'AWS';

  const roleName   = topExp.role    || 'Software Engineer';
  const compName   = topExp.company || 'your previous company';
  const projName   = topProject?.name || 'your featured project';
  const projTech   = (topProject?.tech || [allSkills[0], allSkills[1]]).slice(0, 3).join(', ') || skill1;
  const candidateName = safeResume.name || 'you';

  // Build bullet-anchored question if we have real bullets
  const bulletQuestion = topBullet.length > 20
    ? `Your resume mentions: "${topBullet.substring(0, 120)}". Walk me through the specific technical decisions behind this — what alternatives did you consider, what trade-offs did you make, and how did you measure success?`
    : `In your role as ${roleName} at ${compName}, describe the most technically complex problem you solved. What made it hard, what stack did you use, and what was the measurable outcome?`;

  const bulletAnchor = topBullet.length > 20 ? `${compName} bullet point` : `${compName} (${roleName})`;

  const questions = [
    // 1. RESUME-ANCHORED TECHNICAL DEEP-DIVE
    {
      id: 'q_res_1',
      category: 'Resume Deep-Dive',
      difficulty: 'Hard',
      topic: `${skill1} & ${skill2}`,
      question: bulletQuestion,
      contextAnchor: bulletAnchor,
      tips: [
        'Reference specific tools or profiling methods you used',
        'Explain trade-offs of your approach vs alternatives',
        'Mention measurable before/after impact (latency, throughput, cost)',
      ],
    },
    {
      id: 'q_res_2',
      category: 'Resume Deep-Dive',
      difficulty: 'Hard',
      topic: projName,
      question: topProject
        ? `In your project "${projName}" (built with ${projTech}), walk me through the system architecture. If traffic suddenly scaled 10x, what would break first? How would you re-architect for fault tolerance, data integrity, and horizontal scalability?`
        : `Design a scalable architecture for an enterprise web application handling 100,000 active users using ${skill1} and ${skill2}. Describe your data flow, caching layer, and failure recovery strategy.`,
      contextAnchor: topProject ? `Project: ${projName}` : 'Full-Stack Architecture',
      tips: [
        'Address the stateless vs stateful component split',
        'Explain caching strategy (read-through, write-behind, TTL)',
        'Discuss circuit breakers, rate limiting, and backpressure',
      ],
    },

    // 2. FRONTEND ENGINEERING
    {
      id: 'q_fe_1',
      category: 'Frontend Engineering',
      difficulty: 'Hard',
      topic: 'Virtual DOM, Reconciliation & React Fiber',
      question: `Explain how React's reconciliation algorithm and Fiber architecture manage component rendering. How does React determine which DOM nodes to mutate during the diffing phase, what is the role of element keys, and how do you prevent unnecessary re-renders in complex component trees?`,
      contextAnchor: `React Architecture & Diffing Engine`,
      tips: [
        'Explain O(n) heuristic diffing algorithm vs O(n^3) generic tree diffing',
        'Describe Fiber nodes, work-in-progress tree, and interruptible render vs synchronous commit phase',
        'Mention React.memo, useMemo, useCallback, and why array indices as keys cause bugs',
      ],
    },
    {
      id: 'q_fe_2',
      category: 'Frontend Engineering',
      difficulty: 'Medium',
      topic: 'Core Web Vitals & Next.js Rendering',
      question: `How do you diagnose and optimize Core Web Vitals (Largest Contentful Paint, Cumulative Layout Shift, and Interaction to Next Paint)? Walk me through the architectural trade-offs between Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Static Site Generation (SSG) in Next.js.`,
      contextAnchor: `Web Performance & Modern Frameworks`,
      tips: [
        'Break down LCP, CLS, and INP metrics with exact target thresholds',
        'Discuss hydration costs, code splitting (dynamic imports), and font/image optimization',
        'Explain edge rendering and Incremental Static Regeneration (ISR) caching strategies',
      ],
    },

    // 3. BACKEND & APIS
    {
      id: 'q_be_1',
      category: 'Backend & APIs',
      difficulty: 'Hard',
      topic: 'Microservices & Distributed Transactions (Saga)',
      question: `When transitioning from a monolith to microservices, how do you manage data consistency across service boundaries without two-phase commit (2PC)? Walk me through designing an idempotent Saga pattern (orchestrated vs choreographed) for an order and payment workflow.`,
      contextAnchor: `Distributed Backend Architecture`,
      tips: [
        'Explain why 2PC causes locking bottlenecks and availability issues in microservices',
        'Contrast Orchestrator (workflow coordinator) with Choreography (event-driven pub/sub)',
        'Detail compensating transactions for rollback handling when a downstream step fails',
      ],
    },
    {
      id: 'q_be_2',
      category: 'Backend & APIs',
      difficulty: 'Hard',
      topic: 'API Resilience, Rate Limiting & Circuit Breakers',
      question: `How do you design a high-throughput, fault-tolerant REST/gRPC API handling 50,000 requests/sec? Detail your implementation of distributed rate limiting (Token Bucket vs Sliding Window via Redis), API idempotency keys, and circuit breakers (e.g., Resilience4j/opossum) to prevent cascading failures.`,
      contextAnchor: `High-Throughput API Gateway & Resilience`,
      tips: [
        'Explain Redis sliding-window log or token-bucket with atomic Lua scripts',
        'Discuss idempotency-key headers stored with TTL in distributed storage',
        'Describe circuit breaker states (Closed, Open, Half-Open) and fallback strategies',
      ],
    },

    // 4. DATABASE ENGINEERING
    {
      id: 'q_db_1',
      category: 'Database Engineering',
      difficulty: 'Hard',
      topic: 'Indexing, Query Optimization & EXPLAIN ANALYZE',
      question: `You notice a critical database query in ${dbSkill} taking 4.2 seconds under production load. Walk me step-by-step through how you read and interpret an EXPLAIN (ANALYZE, BUFFERS) plan. How do B-Tree indexes work under the hood, and when would you choose a partial index, composite index, or BRIN index?`,
      contextAnchor: `${dbSkill} — Performance & Query Tuning`,
      tips: [
        'Explain Sequential Scan vs Index Scan vs Bitmap Index Scan',
        'Discuss index selectivity, leftmost prefix rule in composite indexes, and index bloat',
        'Cover shared hit blocks, sort memory (work_mem), and avoiding redundant table lookups via covering indexes',
      ],
    },
    {
      id: 'q_db_2',
      category: 'Database Engineering',
      difficulty: 'Hard',
      topic: 'Concurrency Control, Locking & Hotspot Scaling',
      question: `How do you handle database write bottlenecks and hotspot rows (such as flash-sale inventory decrements or wallet balances) under high concurrent writes? Compare Optimistic Concurrency Control (OCC) vs Pessimistic Locking (SELECT ... FOR UPDATE), and explain how connection pooling (PgBouncer) protects database stability.`,
      contextAnchor: `Transactional Integrity & ACID Isolation`,
      tips: [
        'Explain row-level lock contention, deadlocks, and retry loops in Serializable / Repeatable Read',
        'Discuss atomic conditional updates (UPDATE ... WHERE balance >= amount) to avoid explicit locks',
        'Highlight transaction-level pooling in PgBouncer to eliminate thread/fork connection overhead',
      ],
    },

    // 5. SYSTEM DESIGN & DISTRIBUTED SCALE
    {
      id: 'q_sd_1',
      category: 'System Design',
      difficulty: 'Hard',
      topic: 'Global-Scale Feed & Notification Architecture (100M+ Users)',
      question: `Design a scalable real-time feed or notification system handling 100M+ daily active users with sub-100ms delivery. Walk through your data model, horizontal sharding strategy using consistent hashing, multi-tier caching (Redis Cache-Aside with jittered TTLs), and how you handle the "celebrity / thundering herd" fanout problem.`,
      contextAnchor: `High-Scale System Architecture`,
      tips: [
        'Compare Push (fanout-on-write) vs Pull (fanout-on-read) models for high-follower entities',
        'Explain consistent hashing rings with virtual nodes to prevent hotspot distribution',
        'Address cache stampede prevention (mutex locks, probabilistic early expiration)',
      ],
    },
    {
      id: 'q_sd_2',
      category: 'System Design',
      difficulty: 'Hard',
      topic: 'High Availability, CAP Theorem & Active-Active Disaster Recovery',
      question: `How do you design a distributed database or storage layer for 99.999% availability across multi-region cloud deployments? Discuss how you navigate the CAP theorem and PACELC trade-offs between consistency and latency, consensus mechanisms (Raft/Paxos), and disaster recovery with active-active replication.`,
      contextAnchor: `Distributed Consensus & Fault Tolerance`,
      tips: [
        'Differentiate Strong Consistency (Linearizability) from Eventual and Causal Consistency',
        'Explain multi-region active-active replication conflict resolution (CRDTs or Last-Write-Wins)',
        'Quantify RTO (Recovery Time Objective) and RPO (Recovery Point Objective)',
      ],
    },

    // 6. DEVOPS, CLOUD & CI/CD
    {
      id: 'q_do_1',
      category: 'DevOps & Cloud',
      difficulty: 'Medium',
      topic: 'Kubernetes Orchestration & Zero-Downtime Deployments',
      question: `Walk me through architecting a production Kubernetes cluster for microservices using ${cloudSkill}. How do liveness and readiness probes prevent downtime during rolling deployments? Contrast Blue-Green with Canary deployments via service mesh / ingress controllers, and explain how Horizontal Pod Autoscaling (HPA) works with custom metrics.`,
      contextAnchor: `${cloudSkill} — Container Orchestration & K8s`,
      tips: [
        'Clarify difference between liveness (restart dead container) and readiness (route traffic)',
        'Describe traffic-splitting in Ingress/Istio (e.g. 95% v1, 5% v2) with automated health gates',
        'Explain HPA scaling algorithm based on target CPU/memory or queue-lag metrics',
      ],
    },
    {
      id: 'q_do_2',
      category: 'DevOps & Cloud',
      difficulty: 'Medium',
      topic: 'Automated CI/CD Pipelines & Terraform IaC',
      question: `How do you structure an enterprise CI/CD pipeline from git push to production deployment? Describe how you incorporate automated testing, container security scanning (Trivy/Snyk), secrets management (HashiCorp Vault / Cloud Secrets Manager), and immutable infrastructure provisioning using Terraform.`,
      contextAnchor: `CI/CD Automation & Infrastructure as Code`,
      tips: [
        'Outline stages: static analysis/linting → unit/integration tests → Docker build with SHA → vuln scan → deploy',
        'Explain Terraform remote state locking via DynamoDB/GCS and plan/apply approval workflows',
        'Detail short-lived ephemeral credentials and OIDC integration with cloud providers',
      ],
    },

    // 7. DATA ENGINEERING & STREAMING
    {
      id: 'q_de_1',
      category: 'Data Engineering',
      difficulty: 'Hard',
      topic: 'Streaming Pipelines with Kafka & Apache Spark / Flink',
      question: `Design an end-to-end real-time data streaming pipeline processing 100,000 events/second using Apache Kafka and Apache Spark Streaming (or Apache Flink). How do you handle windowed aggregations, manage late-arriving or out-of-order data using watermarks, and guarantee exactly-once processing semantics?`,
      contextAnchor: `Real-Time Data Streaming & Distributed Processing`,
      tips: [
        'Explain event-time vs processing-time and watermark lag tolerances',
        'Discuss Kafka partition key distribution and consumer group rebalancing',
        'Detail two-phase commit sinks or idempotent upserts for exactly-once guarantees',
      ],
    },
    {
      id: 'q_de_2',
      category: 'Data Engineering',
      difficulty: 'Hard',
      topic: 'Data Lakehouse Architecture & BigQuery/Snowflake Optimization',
      question: `Compare traditional Data Warehousing with modern Data Lakehouse architectures (e.g. Apache Iceberg, Delta Lake). How do you organize a Medallion Architecture (Bronze, Silver, Gold layers), optimize analytical queries using partitioning and clustering in BigQuery/Snowflake, and handle schema evolution and historical backfills?`,
      contextAnchor: `Lakehouse Architecture & Medallion Design`,
      tips: [
        'Explain Bronze (raw ingested data), Silver (cleaned/deduplicated), and Gold (aggregated business marts)',
        'Discuss partition pruning and clustering to drastically reduce query scan bytes and costs',
        'Explain schema evolution with backward-compatible Avro/Parquet metadata updates',
      ],
    },

    // 8. AI & MACHINE LEARNING ENGINEERING
    {
      id: 'q_ai_1',
      category: 'AI & Machine Learning',
      difficulty: 'Hard',
      topic: 'RAG Architecture, Vector Databases & Hybrid Search',
      question: `Design an enterprise-grade Retrieval-Augmented Generation (RAG) system for querying millions of proprietary technical documents. Walk me through document chunking strategies, generating dense embeddings, storing vectors in Milvus/Pinecone/pgvector, implementing hybrid search (Vector + BM25 keyword search with Reciprocal Rank Fusion), and mitigating model hallucinations.`,
      contextAnchor: `Generative AI & Enterprise RAG Systems`,
      tips: [
        'Discuss semantic vs recursive character chunking with optimal overlap size',
        'Explain why hybrid search (dense + sparse/BM25) outperforms pure vector search for domain terms',
        'Detail reranking with Cross-Encoders, prompt grounding, and citation validation against source chunks',
      ],
    },
    {
      id: 'q_ai_2',
      category: 'AI & Machine Learning',
      difficulty: 'Hard',
      topic: 'LLM Inference Serving, Quantization & Latency Optimization',
      question: `When deploying large language models (LLMs) to production serving thousands of concurrent users, what techniques do you use to maximize throughput and minimize time-to-first-token (TTFT)? Explain continuous batching (vLLM), KV caching, model quantization (FP16 vs INT8 vs INT4 AWQ/GPTQ), and guarding against prompt injection attacks.`,
      contextAnchor: `Production MLOps & LLM Inference Optimization`,
      tips: [
        'Explain PagedAttention in vLLM to eliminate KV cache fragmentation',
        'Contrast memory savings and perplexity trade-offs between FP16 and 4-bit quantization',
        'Discuss guardrails (NeMo Guardrails / Llama Guard) and input sanitization against prompt injection',
      ],
    },

    // 9. CYBERSECURITY & APPSEC
    {
      id: 'q_sec_1',
      category: 'Cybersecurity',
      difficulty: 'Hard',
      topic: 'OWASP Top 10, Injection Attacks & Modern Web Defense',
      question: `Walk me through the most critical vulnerabilities in the OWASP Top 10. How do you defend modern cloud applications against SQL Injection, Stored/Reflected Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and Server-Side Request Forgery (SSRF)?`,
      contextAnchor: `Application Security & OWASP Defense`,
      tips: [
        'Explain parameterized queries / prepared statements to completely eliminate SQL injection',
        'Discuss Content Security Policy (CSP), HTML escaping, and context-aware sanitization for XSS',
        'Contrast SameSite cookie attributes with anti-CSRF synchronizer tokens, and egress firewalls for SSRF',
      ],
    },
    {
      id: 'q_sec_2',
      category: 'Cybersecurity',
      difficulty: 'Hard',
      topic: 'Authentication Architecture: JWTs, HttpOnly Cookies & OAuth 2.0 PKCE',
      question: `Compare storing authentication tokens in localStorage vs HttpOnly SameSite cookies. How do you implement a secure Access Token + Refresh Token rotation architecture? Why is the OAuth 2.0 Authorization Code flow with PKCE (Proof Key for Code Exchange) mandatory for Single Page Apps and mobile clients?`,
      contextAnchor: `Identity, Authentication & Cryptography`,
      tips: [
        'Explain why localStorage is completely vulnerable to JavaScript XSS theft while HttpOnly cookies are inaccessible to JS',
        'Detail refresh token rotation with single-use tokens and family invalidation on reuse detection',
        'Describe code_verifier and code_challenge hashing in PKCE to prevent authorization code interception',
      ],
    },

    // 10. MOBILE APP ENGINEERING
    {
      id: 'q_mob_1',
      category: 'Mobile Engineering',
      difficulty: 'Hard',
      topic: 'Offline-First Mobile Architecture & Local Data Sync',
      question: `How do you design an offline-first mobile application (React Native / Flutter / Kotlin) that works seamlessly without internet connectivity? Describe your local database architecture (SQLite/WatermelonDB/Realm), background synchronization queue, conflict resolution strategies (CRDTs vs server-wins), and battery/network optimization.`,
      contextAnchor: `Mobile Architecture & Offline Sync`,
      tips: [
        'Explain local-first writes with immediate UI updates (optimistic UI)',
        'Discuss persistent action queue with exponential backoff retries when connectivity resumes',
        'Detail conflict detection via vector clocks or last-write-wins with entity-level field merging',
      ],
    },
    {
      id: 'q_mob_2',
      category: 'Mobile Engineering',
      difficulty: 'Medium',
      topic: 'Mobile Performance, Native Bridge & Memory Leaks',
      question: `How do you diagnose and fix performance bottlenecks in mobile applications? Walk through detecting memory leaks, analyzing garbage collection pauses, optimizing list rendering (e.g. FlashList / FlatList virtualization), and the architectural differences between React Native's legacy bridge and the new TurboModules/Fabric architecture.`,
      contextAnchor: `Mobile Runtime Optimization & Profiling`,
      tips: [
        'Explain JavaScript Interface (JSI) direct synchronous C++ calls vs asynchronous JSON serialization across bridge',
        'Discuss windowing, cell recycling, and memoized key extractors for smooth 60/120fps scrolling',
        'Mention Xcode Instruments and Android Studio Memory Profiler for tracking unclosed subscriptions and retain cycles',
      ],
    },

    // 11. TESTING, QA & SITE RELIABILITY (SRE)
    {
      id: 'q_sre_1',
      category: 'Testing & SRE',
      difficulty: 'Hard',
      topic: 'Comprehensive Testing Pyramid & Contract Testing',
      question: `How do you implement a robust automated testing strategy across a distributed microservices ecosystem? Discuss how you balance Unit Testing (Jest/Vitest), Integration Testing with ephemeral databases (Testcontainers), End-to-End testing (Playwright/Cypress), and Consumer-Driven Contract Testing (Pact) to eliminate breaking API changes before deployment.`,
      contextAnchor: `Quality Engineering & Testing Pyramid`,
      tips: [
        'Explain the testing pyramid: fast cheap unit tests at base, isolated integration tests in middle, lean E2E at apex',
        'Discuss Testcontainers for running real PostgreSQL/Kafka instances in automated test runs',
        'Explain how contract testing decouples frontend and backend deployments without full E2E environments',
      ],
    },
    {
      id: 'q_sre_2',
      category: 'Testing & SRE',
      difficulty: 'Hard',
      topic: 'Observability, Distributed Tracing & SLOs / Error Budgets',
      question: `Production alerts indicate that p99 latency for your core checkout endpoint spiked from 80ms to 2,400ms. Walk me through your incident triage process using OpenTelemetry distributed traces, Prometheus metrics, and structured logs. How do you define SLIs, SLOs, and Error Budgets, and what actions do you trigger when an error budget is exhausted?`,
      contextAnchor: `Observability, Incident Triage & SRE Practices`,
      tips: [
        'Explain tracing requests through span context propagation across microservice hops',
        'Contrast SLI (metric: % of requests < 200ms) with SLO (target: 99.9% over 30 days) and Error Budget (0.1% downtime allowance)',
        'Describe budget exhaustion policies: halting non-critical feature releases to prioritize stability and reliability',
      ],
    },

    // 12. BEHAVIORAL LEADERSHIP & ENGINEERING CULTURE (STAR METHOD)
    {
      id: 'q_beh_1',
      category: 'Behavioral (STAR Method)',
      difficulty: 'Medium',
      topic: 'Conflict & High-Stakes Technical Disagreement',
      question: `Tell me about a time you strongly disagreed with a senior engineer, tech lead, or product manager regarding a major technical or architectural direction. How did you structure your arguments, evaluate the trade-offs collaboratively, and what was the ultimate resolution and impact on the product?`,
      contextAnchor: `Behavioral Leadership & Decision Making`,
      tips: [
        'Follow the STAR framework: Situation → Task → Action → Result',
        'Show humility, data-driven objective benchmarking rather than personal opinions',
        'Demonstrate ability to disagree and commit once a decision is finalized',
      ],
    },
    {
      id: 'q_beh_2',
      category: 'Behavioral (STAR Method)',
      difficulty: 'Hard',
      topic: 'Production Incident Leadership & Blameless Post-Mortem',
      question: secondBullet.length > 20
        ? `You mention: "${secondBullet.substring(0, 100)}". Tell me about a situation where you had to make a difficult trade-off under high pressure to deliver this. Who were the stakeholders, what did you sacrifice, and what was the outcome?`
        : `Describe the most severe production incident or outage you directly responded to. Walk me through the situation, your role in triaging and mitigating the incident under high pressure, how you communicated with non-technical stakeholders, and how you led the subsequent blameless post-mortem to prevent recurrence.`,
      contextAnchor: secondExp ? `${secondExp.company} (${secondExp.role})` : `${compName} — Agile Incident Response`,
      tips: [
        'Focus on systematic triage: isolate blast radius, mitigate user impact before deep debugging',
        'Emphasize clear status communication with executives and customers during the incident',
        'Highlight actionable preventative measures in the blameless post-mortem (automated alerts, regression tests, circuit breakers)',
      ],
    },
  ];

  if (category && category !== 'all') {
    const catLower = category.toLowerCase().trim();
    const filtered = questions.filter(q => {
      const qCat = q.category.toLowerCase();
      const qTopic = q.topic.toLowerCase();
      const qId = q.id.toLowerCase();
      
      if (catLower === 'frontend' && (qCat.includes('frontend') || qTopic.includes('react') || qTopic.includes('vdom'))) return true;
      if (catLower === 'backend' && (qCat.includes('backend') || qCat.includes('api') || qTopic.includes('microservice') || qTopic.includes('resilience'))) return true;
      if (catLower === 'database' && (qCat.includes('database') || qTopic.includes('index') || qTopic.includes('lock') || qTopic.includes('sql'))) return true;
      if ((catLower.includes('system') || catLower.includes('architecture')) && (qCat.includes('system') || qTopic.includes('architecture') || qTopic.includes('distributed'))) return true;
      if (catLower.includes('devops') && (qCat.includes('devops') || qTopic.includes('kubernetes') || qTopic.includes('ci/cd') || qTopic.includes('cloud'))) return true;
      if (catLower.includes('data engineering') && (qCat.includes('data engineering') || qTopic.includes('kafka') || qTopic.includes('lakehouse') || qTopic.includes('spark'))) return true;
      if ((catLower.includes('ai') || catLower.includes('ml') || catLower.includes('machine learning')) && (qCat.includes('ai') || qCat.includes('machine learning') || qTopic.includes('rag') || qTopic.includes('llm'))) return true;
      if ((catLower.includes('security') || catLower.includes('cyber')) && (qCat.includes('cybersecurity') || qTopic.includes('owasp') || qTopic.includes('auth'))) return true;
      if (catLower.includes('mobile') && (qCat.includes('mobile') || qTopic.includes('mobile') || qTopic.includes('offline'))) return true;
      if ((catLower.includes('testing') || catLower.includes('sre') || catLower.includes('qa')) && (qCat.includes('testing') || qTopic.includes('testing') || qTopic.includes('observability') || qTopic.includes('sre'))) return true;
      if (catLower.includes('behavioral') && (qCat.includes('behavioral') || qTopic.includes('conflict') || qTopic.includes('outage') || qTopic.includes('star'))) return true;
      if ((catLower.includes('resume') || catLower.includes('project')) && (qCat.includes('resume') || qCat.includes('technical deep-dive') || qId.includes('res'))) return true;
      
      return qCat.includes(catLower) || qTopic.includes(catLower) || qId.includes(catLower);
    });

    return filtered.length > 0 ? filtered : questions;
  }

  return questions;
}


// ==========================================
// INTELLIGENT VOCABULARY & ANSWER VALIDATION
// ==========================================

const COMMON_ENGLISH_WORDS = new Set([
  'a', 'about', 'above', 'across', 'action', 'actions', 'actually', 'add', 'added', 'after', 
  'again', 'against', 'agile', 'all', 'allow', 'allowed', 'almost', 'also', 'alternatives', 
  'although', 'always', 'am', 'among', 'an', 'and', 'another', 'answer', 'any', 'approach', 
  'approaches', 'are', 'area', 'around', 'as', 'ask', 'asked', 'at', 'back', 'based', 'be', 
  'because', 'become', 'been', 'before', 'began', 'begin', 'behind', 'being', 'believe', 
  'between', 'both', 'bottle', 'bottleneck', 'bottlenecks', 'box', 'build', 'building', 'built', 
  'business', 'but', 'by', 'call', 'called', 'came', 'can', 'cannot', 'case', 'cases', 
  'cause', 'caused', 'change', 'changed', 'changes', 'check', 'choice', 'clear', 'clearly', 
  'client', 'clients', 'code', 'come', 'common', 'company', 'compare', 'compared', 'complete', 
  'completed', 'complex', 'complexity', 'concept', 'concepts', 'concurrency', 'concurrent', 
  'conflict', 'consider', 'considered', 'continue', 'cost', 'costs', 'could', 'create', 
  'created', 'creating', 'critical', 'culture', 'current', 'customer', 'data', 'database', 
  'day', 'days', 'deadline', 'deal', 'decide', 'decided', 'decision', 'decisions', 'decrease', 
  'decreased', 'deep', 'deliver', 'delivered', 'delivery', 'depend', 'design', 'designed', 
  'detail', 'detailed', 'details', 'develop', 'developer', 'developed', 'development', 'did', 
  'differ', 'difference', 'different', 'difficult', 'direct', 'directly', 'discuss', 'discussed', 
  'do', 'does', 'doing', 'done', 'down', 'due', 'during', 'each', 'early', 'easier', 'easy', 
  'effective', 'effectively', 'efficiency', 'efficient', 'either', 'end', 'engineer', 'engineering', 
  'engineers', 'ensure', 'ensured', 'entire', 'environment', 'error', 'errors', 'even', 'event', 
  'events', 'every', 'everyone', 'example', 'examples', 'execute', 'executed', 'execution', 
  'experience', 'explain', 'explained', 'explaining', 'face', 'faced', 'fact', 'fail', 'failed', 
  'failure', 'fast', 'faster', 'feature', 'features', 'few', 'final', 'finally', 'find', 'first', 
  'flow', 'focus', 'focused', 'follow', 'following', 'for', 'form', 'found', 'framework', 
  'from', 'full', 'further', 'general', 'get', 'give', 'given', 'goal', 'goals', 'going', 
  'good', 'got', 'great', 'group', 'grow', 'had', 'handle', 'handled', 'handling', 'hard', 
  'has', 'have', 'having', 'he', 'help', 'helped', 'her', 'here', 'high', 'higher', 'him', 
  'his', 'how', 'however', 'i', 'idea', 'ideas', 'impact', 'implement', 'implemented', 
  'implementation', 'important', 'improve', 'improved', 'improvement', 'in', 'incident', 
  'include', 'included', 'includes', 'increase', 'increased', 'information', 'infrastructure', 
  'initial', 'initially', 'input', 'instead', 'into', 'investigate', 'investigated', 'is', 
  'issue', 'issues', 'it', 'its', 'job', 'just', 'keep', 'key', 'kind', 'knew', 'know', 
  'knowledge', 'known', 'large', 'larger', 'last', 'late', 'latency', 'later', 'launch', 
  'launched', 'lead', 'leader', 'leadership', 'leading', 'learn', 'learned', 'least', 'led', 
  'less', 'level', 'like', 'limit', 'limited', 'line', 'little', 'load', 'logic', 'long', 
  'look', 'looked', 'lot', 'low', 'lower', 'made', 'main', 'maintain', 'major', 'make', 
  'makes', 'making', 'many', 'matter', 'may', 'me', 'mean', 'measure', 'measured', 'meet', 
  'memory', 'mention', 'mentioned', 'mentor', 'mentored', 'mentorship', 'message', 'messages', 
  'method', 'methods', 'metric', 'metrics', 'might', 'million', 'minimal', 'minimize', 
  'model', 'module', 'modules', 'monitor', 'monitored', 'monitoring', 'more', 'most', 'move', 
  'moved', 'much', 'multiple', 'must', 'my', 'name', 'near', 'need', 'needed', 'needs', 
  'network', 'never', 'new', 'next', 'no', 'node', 'non', 'none', 'nor', 'normal', 'not', 
  'note', 'noted', 'nothing', 'notice', 'noticed', 'now', 'number', 'numbers', 'objective', 
  'obtain', 'occur', 'occurred', 'of', 'off', 'often', 'old', 'on', 'once', 'one', 'only', 
  'open', 'operation', 'operations', 'optimize', 'optimized', 'optimization', 'option', 'or', 
  'order', 'other', 'others', 'our', 'out', 'outcome', 'outcomes', 'output', 'over', 'overall', 
  'own', 'part', 'particular', 'pass', 'passed', 'past', 'path', 'pattern', 'patterns', 'per', 
  'perform', 'performance', 'person', 'pipeline', 'pipelines', 'plan', 'planned', 'platform', 
  'point', 'points', 'possible', 'practice', 'practices', 'prevent', 'prevented', 'previous', 
  'previously', 'primary', 'prior', 'priority', 'problem', 'problems', 'process', 'produce', 
  'product', 'production', 'profile', 'profiling', 'program', 'project', 'projects', 'proper', 
  'properly', 'provide', 'provided', 'pull', 'put', 'quality', 'query', 'queries', 'quick', 
  'quickly', 'quite', 'rate', 'rather', 'reach', 'read', 'ready', 'real', 'really', 'reason', 
  'reasons', 'reduce', 'reduced', 'reducing', 'reduction', 'refactor', 'refactored', 'release', 
  'released', 'relevant', 'rely', 'remain', 'remove', 'removed', 'report', 'request', 'requests', 
  'require', 'required', 'requirement', 'requirements', 'resolve', 'resolved', 'resource', 
  'resources', 'response', 'responses', 'result', 'results', 'return', 'review', 'reviewed', 
  'right', 'risk', 'robust', 'role', 'rollback', 'run', 'running', 'safe', 'same', 'save', 
  'saved', 'say', 'scale', 'scaled', 'scaling', 'scenario', 'schedule', 'scope', 'second', 
  'see', 'seem', 'select', 'separate', 'serve', 'server', 'servers', 'service', 'services', 
  'set', 'several', 'setup', 'share', 'shared', 'shift', 'shipped', 'short', 'should', 'show', 
  'showed', 'side', 'similar', 'simple', 'simply', 'since', 'single', 'site', 'situation', 
  'size', 'slow', 'slower', 'small', 'smaller', 'so', 'solution', 'solutions', 'solve', 
  'solved', 'solving', 'some', 'specific', 'specifically', 'speed', 'spent', 'split', 'sprint', 
  'sprints', 'stack', 'stage', 'staging', 'stakeholder', 'stakeholders', 'standard', 'standards', 
  'start', 'started', 'state', 'statement', 'stay', 'step', 'steps', 'still', 'stop', 'storage', 
  'store', 'stored', 'strategy', 'strong', 'structure', 'structured', 'substance', 'succeed', 
  'success', 'successful', 'successfully', 'such', 'suggest', 'support', 'sure', 'system', 
  'systems', 'table', 'tables', 'take', 'taken', 'task', 'tasks', 'team', 'teams', 'tech', 
  'technical', 'technique', 'technology', 'tell', 'term', 'terms', 'test', 'tested', 'testing', 
  'tests', 'than', 'that', 'the', 'their', 'them', 'then', 'theory', 'there', 'therefore', 
  'these', 'they', 'thing', 'things', 'think', 'third', 'this', 'thorough', 'those', 'though', 
  'thought', 'three', 'through', 'throughput', 'time', 'times', 'to', 'together', 'too', 'tool', 
  'tools', 'top', 'total', 'towards', 'trade', 'tradeoff', 'tradeoffs', 'traffic', 'try', 
  'turn', 'two', 'type', 'types', 'typical', 'under', 'understand', 'understanding', 'unit', 
  'until', 'up', 'update', 'updated', 'updates', 'upon', 'uptime', 'us', 'use', 'used', 
  'useful', 'user', 'users', 'uses', 'using', 'usually', 'valid', 'validation', 'value', 
  'values', 'various', 'velocity', 'verify', 'verified', 'version', 'very', 'via', 'view', 
  'volume', 'wait', 'walk', 'want', 'wanted', 'was', 'way', 'ways', 'we', 'week', 'weeks', 
  'well', 'went', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whole', 'why', 
  'will', 'with', 'within', 'without', 'won', 'word', 'words', 'work', 'worked', 'working', 
  'works', 'world', 'worse', 'would', 'write', 'writes', 'written', 'wrong', 'year', 'years', 
  'yet', 'yield', 'you', 'your'
]);

// Software engineering & tech vocabulary
const TECH_VOCABULARY = new Set([
  'acid', 'affinity', 'alb', 'algorithm', 'algorithms', 'allocator', 'amazon', 'analyze', 
  'analyzer', 'angular', 'ansible', 'api', 'apis', 'apollo', 'architecture', 'architectural', 
  'artifact', 'assembly', 'async', 'asynchronous', 'atomicity', 'auth', 'authentication', 
  'authorization', 'autoscale', 'autoscaling', 'await', 'aws', 'backend', 'backpressure', 
  'backup', 'batch', 'batching', 'bcrypt', 'bigquery', 'binary', 'bitbucket', 'blocking', 
  'blue-green', 'boolean', 'branching', 'broadcast', 'broker', 'browser', 'btree', 'b-tree', 
  'bucket', 'buffer', 'buffering', 'bulkhead', 'bundle', 'byte', 'bytes', 'cache', 'caching', 
  'canary', 'cdn', 'certificate', 'choreography', 'ci', 'cicd', 'circuit-breaker', 'cloud', 
  'cloudwatch', 'cluster', 'clustering', 'commit', 'compiler', 'component', 'components', 
  'compose', 'composite', 'concurrency', 'concurrent', 'condition', 'config', 'configuration', 
  'connection', 'connection-pool', 'connector', 'consistency', 'container', 'containers', 
  'containerization', 'context', 'controller', 'cors', 'coverage', 'cpu', 'crud', 'crypto', 
  'csrf', 'css', 'cypress', 'daemon', 'dag', 'dataform', 'datadog', 'dataloader', 'dbt', 
  'deadlock', 'debounce', 'debugging', 'decouple', 'decoupled', 'decrypt', 'deduplication', 
  'denormalization', 'deploy', 'deployment', 'diff', 'diffing', 'distributed', 'django', 
  'dlq', 'dns', 'docker', 'dockerfile', 'dom', 'durability', 'dynamodb', 'ec2', 'ecs', 'edge', 
  'eks', 'elastic', 'elasticsearch', 'elk', 'encryption', 'endpoint', 'endpoints', 'entity', 
  'env', 'environment', 'envoy', 'error-budget', 'esbuild', 'eslint', 'event-driven', 'event-loop', 
  'events', 'eviction', 'explain-analyze', 'express', 'failover', 'fastapi', 'fault-tolerant', 
  'federation', 'fiber', 'fifo', 'filter', 'firewall', 'flask', 'flutter', 'foreign-key', 
  'frontend', 'full-stack', 'gateway', 'gcp', 'git', 'github', 'github-actions', 'gitlab', 
  'gke', 'go', 'golang', 'graphql', 'grpc', 'handler', 'haproxy', 'hash', 'heap', 'helm', 
  'herok', 'hexagonal', 'hook', 'hooks', 'horizontal-scaling', 'hotspot', 'html', 'http', 
  'https', 'hybrid', 'iam', 'idempotence', 'idempotency', 'idempotent', 'immutable', 'index', 
  'indexes', 'indexing', 'ingress', 'in-memory', 'instance', 'instances', 'integration', 
  'interface', 'internals', 'invalidation', 'ioc', 'ipc', 'isolation', 'iteration', 'jaeger', 
  'java', 'javascript', 'jest', 'join', 'joins', 'json', 'jwt', 'k8s', 'kafka', 'kinesis', 
  'kotlin', 'kubernetes', 'lambda', 'latency', 'layout', 'lifecycle', 'lightweight', 'limit', 
  'limiter', 'linux', 'liveness', 'load-balancer', 'load-testing', 'lock', 'locking', 'log', 
  'logging', 'lru', 'manager', 'memcached', 'memory-leak', 'microfrontend', 'microservice', 
  'microservices', 'middleware', 'migration', 'migrations', 'mock', 'mongodb', 'monitoring', 
  'monolith', 'monolithic', 'mounted', 'multithreading', 'mutex', 'mvcc', 'mysql', 'namespace', 
  'nest', 'nestjs', 'next', 'nextjs', 'nginx', 'node', 'nodejs', 'nosql', 'npm', 'oauth', 
  'oauth2', 'observability', 'oom', 'opentelemetry', 'optimistic', 'orchestration', 'orm', 
  'outage', 'p50', 'p95', 'p99', 'package', 'packet', 'page', 'pagination', 'parallel', 
  'parallelism', 'parser', 'partial', 'partition', 'partitioning', 'patch', 'performance', 
  'persist', 'persistence', 'pessimistic', 'pgbouncer', 'pipeline', 'pipelines', 'playwright', 
  'plugin', 'pod', 'pods', 'pointer', 'polling', 'pool', 'pooling', 'postgres', 'postgresql', 
  'postman', 'prisma', 'probe', 'profiler', 'profiling', 'promise', 'propagation', 'props', 
  'protocol', 'prototype', 'protobuf', 'proxy', 'pubsub', 'pull-request', 'python', 'pytorch', 
  'queue', 'queues', 'rabbitmq', 'race-condition', 'rate-limit', 'rate-limiting', 'rbac', 
  'rds', 'react', 'reactive', 'read-replica', 'read-through', 'readability', 'readiness', 
  'real-time', 'rebuild', 'reconciliation', 'recovery', 'redis', 'redundancy', 'refactor', 
  'refactoring', 'reflow', 'refresh', 'registry', 'regression', 'remediation', 'render', 
  'rendering', 'repaint', 'replica', 'replication', 'repo', 'repository', 'rerender', 'resilience', 
  'resilient', 'rest', 'restful', 'retry', 'rollback', 'round-robin', 'route', 'router', 
  'routing', 'rpc', 'rust', 's3', 'saga', 'sanitize', 'sast', 'scale', 'scaling', 'schema', 
  'scope', 'scrum', 'security', 'segment', 'semaphore', 'serialization', 'serverless', 
  'service-mesh', 'session', 'shard', 'sharding', 'sidecar', 'signal', 'signature', 'single-page', 
  'singleton', 'sla', 'sli', 'slo', 'snapshot', 'soa', 'socket', 'solid', 'spa', 'span', 
  'spanner', 'spark', 'spring', 'sql', 'sqlite', 'sqs', 'ssl', 'sso', 'stack', 'staleness', 
  'state', 'stateless', 'storage', 'stream', 'streaming', 'stub', 'svelte', 'swagger', 
  'synthetic', 'table', 'tailwind', 'target', 'task', 'tcp', 'tdd', 'telemetry', 'terraform', 
  'test-driven', 'thread', 'threading', 'throttle', 'throttling', 'throughput', 'timeout', 
  'tls', 'token', 'tokens', 'trace', 'tracing', 'traffic', 'transaction', 'transactions', 
  'tree', 'trigger', 'typescript', 'udp', 'ui', 'unit-test', 'unmount', 'uptime', 'uri', 
  'url', 'usecallback', 'usecontext', 'useeffect', 'usememo', 'usestate', 'ux', 'vacuum', 
  'validation', 'vault', 'vector', 'vectors', 'vertical-scaling', 'versioning', 'vdom', 'virtual', 
  'virtual-dom', 'vite', 'vue', 'vuejs', 'wal', 'webhook', 'webhooks', 'webpack', 'websocket', 
  'websockets', 'worker', 'workflow', 'write-ahead', 'write-behind', 'write-heavy', 'write-through', 
  'xss', 'yaml', 'zod', 'zustand',
  // AI, LLM & RAG terms
  'rag', 'embedding', 'embeddings', 'milvus', 'pinecone', 'pgvector', 'llm', 'llms', 'quantization',
  'inference', 'hallucination', 'hallucinations', 'transformer', 'transformers', 'vllm', 'pagedattention',
  'fine-tuning', 'tokenization', 'reranking', 'cross-encoder', 'bm25', 'temperature', 'guardrails',
  'langchain', 'prompt-injection', 'awq', 'gptq',
  // Data Engineering & Lakehouse terms
  'lakehouse', 'medallion', 'iceberg', 'delta-lake', 'parquet', 'avro', 'flink', 'spark-streaming',
  'watermark', 'watermarks', 'backfill', 'backfills', 'deduplication', 'partition-pruning',
  // Security & AppSec terms
  'owasp', 'sqli', 'ssrf', 'pkce', 'oidc', 'httponly', 'samesite', 'sanitization', 'csp',
  'cryptography', 'hmac', 'sha256', 'argon2', 'least-privilege',
  // Mobile terms
  'react-native', 'watermelondb', 'turbomodules', 'hermes', 'offline-first', 'flashlist', 'virtualization', 'jsi',
  // Testing & SRE terms
  'testcontainers', 'pact', 'contract-testing', 'slis', 'slos', 'error-budgets', 'distributed-tracing', 'spans'
]);

// Common casual off-topic words when unaccompanied by tech concepts
const CASUAL_OFF_TOPIC_WORDS = new Set([
  'apple', 'banana', 'orange', 'pizza', 'burger', 'sandwich', 'pasta', 'dinner', 'lunch', 
  'breakfast', 'coffee', 'beer', 'football', 'soccer', 'tennis', 'cricket', 'basketball', 
  'weather', 'rain', 'rainy', 'sunny', 'snow', 'beach', 'vacation', 'holiday', 'movie', 
  'cinema', 'song', 'music', 'guitar', 'piano', 'cat', 'dog', 'puppy', 'pet', 'shoes', 
  'clothes', 'shirt', 'dress', 'shopping', 'party', 'dance', 'dating', 'swimming', 'gym', 
  'workout', 'car', 'bike', 'driving', 'flight', 'hotel', 'elephant', 'tiger', 'lion', 
  'chocolate', 'ice cream', 'dessert', 'recipe'
]);

/**
 * Validates a candidate's answer for authenticity, meaningfulness, and relevance.
 * Rejects empty responses, non-attempts ("I don't know"), and random character gibberish.
 */
function validateCandidateAnswer(answer) {
  const text = (answer || '').trim();
  if (text.length === 0) {
    return { isValid: false, type: 'empty', reason: 'Response is completely empty.' };
  }

  // 1. Check for standard refusal / non-attempt phrases (Multilingual support: English, Hinglish, Hindi, Spanish, French, German)
  const cleanLower = text.toLowerCase().replace(/['’]/g, '').trim();
  const nonAttemptRegex = /^(i\s*(do\s*not|dont)\s*know|idk|no\s*idea|i\s*have\s*no\s*idea|not\s*sure|im\s*not\s*sure|no\s*clue|skip|pass|dunno|na|n\/a|nothing|cant\s*answer|i\s*cannot\s*answer|i\s*cant\s*answer|none|whatever|mujhe\s*(nahi|nhi)\s*pata|pata\s*(nahi|nhi)|no\s*lo\s*se|no\s*se|je\s*ne\s*sais\s*pas|ich\s*weiss\s*nicht|ich\s*weiß\s*nicht|keine\s*ahnung|(मुझे\s*)?(नहीं|नही)\s*(पता|मालूम|याद)|पता\s*(नहीं|नही)|मालूम\s*(नहीं|नही))$/i;
  if (nonAttemptRegex.test(cleanLower) || (cleanLower.length < 30 && /^(i\s*dont\s*know|idk|no\s*idea|not\s*sure|no\s*clue|mujhe\s*(nahi|nhi)\s*pata|no\s*se|(मुझे\s*)?(नहीं|नही)\s*पता)/i.test(cleanLower))) {
    return { 
      isValid: false, 
      type: 'non_attempt', 
      reason: 'Response indicates candidate does not know the answer or refused to attempt.' 
    };
  }

  // 2. Check for random character gibberish
  const tokens = text.toLowerCase().split(/[\s,.;:!?()\[\]{}'"]+/).filter(Boolean);
  if (tokens.length === 0) {
    return { isValid: false, type: 'gibberish', reason: 'No intelligible words provided.' };
  }

  // Detect non-English / international scripts (Devanagari, CJK, Arabic, Cyrillic, Accented Latin)
  const hasInternationalScript = /[\u0900-\u097F\u4E00-\u9FFF\u3040-\u30FF\u0600-\u06FF\u0400-\u04FF\u00C0-\u024F]/.test(text);

  // Common multilingual / Hinglish vocabulary
  const MULTILINGUAL_WORDS = new Set([
    'humne', 'maine', 'aapne', 'karenge', 'kiya', 'tha', 'thi', 'hai', 'hain', 'mein', 'me', 'aur', 'se', 'ko', 'par', 'pe', 'bhi', 'kuch', 'bada', 'chhota', 'kam', 'zyada', 'jisse', 'kyunki', 'lekin', 'isliye', 'sath', 'saath', 'kaise', 'karna', 'karke', 'hota', 'hoti', 'hote', 'sawaal', 'uttar',
    'es', 'una', 'para', 'con', 'por', 'del', 'las', 'los', 'como', 'pero', 'mas', 'más', 'este', 'esta', 'sobre', 'cuando', 'donde', 'nuestro', 'nuestra', 'equipo', 'proyecto',
    'est', 'une', 'pour', 'avec', 'par', 'des', 'les', 'dans', 'sur', 'mais', 'nous', 'vous', 'notre', 'projet', 'equipe',
    'ist', 'eine', 'einer', 'fuer', 'für', 'mit', 'von', 'und', 'oder', 'aber', 'wir', 'unsere', 'unser', 'projekt'
  ]);

  // Check for excessively long unbroken random tokens (e.g. "asdfghjklqwertyuiopzxcvbnm")
  const hasAbsurdToken = tokens.some(tok => tok.length > 22 && !tok.includes('/') && !tok.includes('.') && !hasInternationalScript);
  if (hasAbsurdToken) {
    return { isValid: false, type: 'gibberish', reason: 'Contains unparseable continuous character strings.' };
  }

  // Check character-level vowel-to-consonant ratios for English/Latin text
  const lettersOnly = text.toLowerCase().replace(/[^a-z]/g, '');
  if (!hasInternationalScript && lettersOnly.length >= 6) {
    const vowelCount = lettersOnly.replace(/[^aeiouy]/g, '').length;
    const vowelRatio = vowelCount / lettersOnly.length;
    // In natural English, vowelRatio is roughly 0.30 - 0.50. < 0.15 is random consonant mashing.
    if (vowelRatio < 0.15 || vowelRatio > 0.85) {
      return { isValid: false, type: 'gibberish', reason: 'Unnatural character distribution typical of random keystrokes.' };
    }
  }

  // Check for unpronounceable consonant clusters (5+ consonants in a row, e.g. "sdfghjk", "zxcvb")
  const consonantStreakRegex = /[bcdfghjklmnpqrstvwxyz]{5,}/i;
  const keyboardMashRegex = /(asdf|ghjkl|qwerty|zxcv|qazwsx|12345|67890)/i;
  const repetitiveCharRegex = /(.)\1{3,}/;

  let suspiciousTokenCount = 0;
  let recognizedWordCount = 0;

  for (const token of tokens) {
    const isTech = TECH_VOCABULARY.has(token);
    const isCommon = COMMON_ENGLISH_WORDS.has(token);
    const isMultiLang = MULTILINGUAL_WORDS.has(token);
    if (isTech || isCommon || isMultiLang) {
      recognizedWordCount++;
    } else if (consonantStreakRegex.test(token) || keyboardMashRegex.test(token) || repetitiveCharRegex.test(token)) {
      suspiciousTokenCount++;
    }
  }

  // Single word checks
  if (tokens.length === 1) {
    const tok = tokens[0];
    if (consonantStreakRegex.test(tok) || keyboardMashRegex.test(tok) || repetitiveCharRegex.test(tok)) {
      return { isValid: false, type: 'gibberish', reason: 'Keystroke smashing pattern detected.' };
    }
    if (!hasInternationalScript && !TECH_VOCABULARY.has(tok) && !COMMON_ENGLISH_WORDS.has(tok) && !CASUAL_OFF_TOPIC_WORDS.has(tok) && !MULTILINGUAL_WORDS.has(tok) && lettersOnly.length >= 5) {
      return { isValid: false, type: 'gibberish', reason: 'Unrecognized single token with no semantic meaning.' };
    }
  }

  // Multi-word checks
  if (suspiciousTokenCount >= 1 && suspiciousTokenCount >= tokens.length * 0.4) {
    return { isValid: false, type: 'gibberish', reason: 'High density of unpronounceable keystroke patterns.' };
  }

  const recognizedRatio = recognizedWordCount / tokens.length;
  if (!hasInternationalScript && tokens.length >= 3 && recognizedRatio < 0.25) {
    return { isValid: false, type: 'gibberish', reason: 'Too few recognized English or technical words.' };
  }

  return { isValid: true, type: 'valid' };
}

/**
 * Extracts key concepts and analyzes topic requirements from an interview question.
 */
function extractQuestionAnalysis(question, category = '') {
  const qLower = (question || '').toLowerCase();
  const catLower = (category || '').toLowerCase();

  const isBehavioral = catLower.includes('behavioral') || 
    /situation|conflict|deadline|stakeholder|failure|trade-off|disagree|prioritize|teamwork|unexpected blocker|tell me about/i.test(qLower);

  const structureType = isBehavioral ? 'STAR Structure' : 'Technical Structure';

  // Identify core concept keywords from the question
  const words = qLower.split(/[\s,.;:!?()\[\]{}'"]+/).filter(w => w.length > 2);
  const matchedTech = words.filter(w => TECH_VOCABULARY.has(w));

  // Determine dynamic missing concepts for standard topics
  let coreConcepts = [];
  let topicSummary = 'Technical Discussion';

  if (qLower.includes('virtual dom') || qLower.includes('react') || qLower.includes('reconciliation') || qLower.includes('fiber')) {
    topicSummary = 'React Virtual DOM & Reconciliation';
    coreConcepts = ['In-memory Virtual DOM representation', 'Diffing algorithm & key heuristics O(n)', 'Batching DOM mutations in commit phase'];
  } else if (qLower.includes('index') || qLower.includes('database') || qLower.includes('write-heavy') || qLower.includes('postgres') || qLower.includes('explain')) {
    topicSummary = 'Database Indexing & Query Tuning';
    coreConcepts = ['B-Tree index structure & read lookups', 'Write-amplification & WAL overhead', 'Partial/composite indexes & write-buffering'];
  } else if (qLower.includes('ci/cd') || qLower.includes('pipeline') || qLower.includes('rollback') || qLower.includes('devops') || qLower.includes('kubernetes')) {
    topicSummary = 'DevOps, CI/CD & Zero-Downtime Deployment';
    coreConcepts = ['Automated testing & build validation gates', 'Blue-green or canary rollout strategy', 'Automated health probes & instant rollback triggers'];
  } else if (qLower.includes('rag') || qLower.includes('vector') || qLower.includes('llm') || qLower.includes('embedding') || qLower.includes('inference')) {
    topicSummary = 'Generative AI, RAG & LLM Optimization';
    coreConcepts = ['Hybrid search (Dense embeddings + BM25 keyword)', 'Vector database indexing (HNSW / IVFFlat)', 'Hallucination reduction & vLLM quantization'];
  } else if (qLower.includes('owasp') || qLower.includes('xss') || qLower.includes('csrf') || qLower.includes('pkce') || qLower.includes('httponly') || qLower.includes('security')) {
    topicSummary = 'Application Security & Cryptography';
    coreConcepts = ['Parameterized queries & XSS/CSRF mitigations', 'Secure token handling (HttpOnly SameSite cookies vs localStorage)', 'OAuth 2.0 PKCE flow & zero-trust boundaries'];
  } else if (qLower.includes('kafka') || qLower.includes('spark') || qLower.includes('lakehouse') || qLower.includes('medallion') || qLower.includes('streaming')) {
    topicSummary = 'Data Engineering & Streaming Pipelines';
    coreConcepts = ['Stream processing & watermark windowing', 'Medallion Lakehouse layers (Bronze/Silver/Gold)', 'Exactly-once semantics & partition pruning'];
  } else if (qLower.includes('mobile') || qLower.includes('offline') || qLower.includes('react native') || qLower.includes('flutter')) {
    topicSummary = 'Mobile Architecture & Offline-First Design';
    coreConcepts = ['Local-first SQLite/WatermelonDB storage & conflict resolution', 'Native Bridge / TurboModules (JSI) performance', 'Memory leak prevention & 60fps list virtualization'];
  } else if (qLower.includes('testing') || qLower.includes('sre') || qLower.includes('tracing') || qLower.includes('slo') || qLower.includes('opentelemetry')) {
    topicSummary = 'Testing Strategy & Site Reliability Engineering';
    coreConcepts = ['Test pyramid & Testcontainers integration', 'OpenTelemetry distributed tracing context propagation', 'SLO, SLI & error budget governance'];
  } else if (qLower.includes('scale') || qLower.includes('architecture') || qLower.includes('microservice') || qLower.includes('concurrent') || qLower.includes('saga')) {
    topicSummary = 'Distributed Systems & Scalability';
    coreConcepts = ['Stateless service decoupling & horizontal scaling', 'Caching strategy (Redis read-through / TTLs)', 'Asynchronous event queues & circuit breakers'];
  } else if (isBehavioral) {
    topicSummary = 'Engineering Judgment & Stakeholder Collaboration';
    coreConcepts = ['Situation context & specific technical stakes', 'Direct personal actions & architectural trade-offs', 'Quantifiable outcomes, metrics & business impact'];
  } else {
    topicSummary = matchedTech.slice(0, 3).map(w => w.toUpperCase()).join(' & ') || 'Software Architecture';
    coreConcepts = [
      `Core operational mechanics of ${matchedTech[0] || 'the technology'}`,
      'Architectural trade-offs and performance implications',
      'Production failure modes and monitoring metrics'
    ];
  }

  return { isBehavioral, structureType, topicSummary, coreConcepts, matchedTech };
}

/**
 * Synthesizes an ideal, staff-level sample answer tailored to the specific question.
 */
function getIdealSampleAnswer(question, analysis) {
  const qLower = (question || '').toLowerCase();

  if (qLower.includes('virtual dom') || qLower.includes('react') || qLower.includes('reconciliation') || qLower.includes('fiber')) {
    return `React utilizes a Virtual DOM—an in-memory lightweight JavaScript representation of the actual DOM tree. When component state or props change, React generates a new Virtual DOM tree and runs its reconciliation diffing algorithm (operating in O(n) heuristic time by comparing element types and unique keys). Instead of mutating the real DOM for each change, React computes the minimal batch of DOM modifications and applies them during the commit phase. This prevents redundant browser reflows and repaints, ensuring optimal 60fps rendering performance.`;
  }

  if (qLower.includes('index') || qLower.includes('database') || qLower.includes('write-heavy') || qLower.includes('postgres') || qLower.includes('explain')) {
    return `When architecting a schema for write-heavy workloads, indexing requires balancing read query latency against write throughput. B-Tree indexes accelerate reads to O(log n) but incur overhead on every INSERT, UPDATE, and DELETE due to tree page balancing and Write-Ahead Log (WAL) writes. For write-heavy systems, I minimize non-essential secondary indexes, employ partial or covering composite indexes tailored strictly to high-frequency queries, and use connection pooling (e.g. PgBouncer). I also batch write operations, partition historical tables horizontally by timestamp, and leverage write-buffering via Redis or Kafka event queues before persistence.`;
  }

  if (qLower.includes('ci/cd') || qLower.includes('pipeline') || qLower.includes('rollback') || qLower.includes('devops') || qLower.includes('kubernetes')) {
    return `A production-grade CI/CD pipeline begins with automated pre-merge gates in GitHub Actions running linters, unit tests, and security scans (SAST/container vulnerability scans). Upon merge to main, a multi-stage Docker build compiles the image and tags it with the immutable git SHA. For zero-downtime deployment, we execute a canary rollout into Kubernetes, gradually shifting 10% to 100% of user traffic. We monitor p99 latency and 5xx error thresholds via Prometheus and OpenTelemetry; if error budgets or health check probes breach limits, the pipeline automatically halts and triggers an immediate rollback to the previous stable release tag without downtime.`;
  }

  if (qLower.includes('rag') || qLower.includes('vector') || qLower.includes('llm') || qLower.includes('embedding') || qLower.includes('inference')) {
    return `For an enterprise RAG system, I implement a multi-stage retrieval and generation pipeline. First, documents are processed with recursive semantic chunking (500 tokens with 10% overlap). We generate dense embeddings and index them in a vector database (e.g. Milvus or pgvector using HNSW indexing for fast approximate nearest neighbor search). We employ hybrid search combining dense vector embeddings with sparse BM25 keyword retrieval, merged via Reciprocal Rank Fusion (RRF), and pass results to a Cross-Encoder reranker. Finally, we inject grounded system prompts instructing the LLM to cite specific sources and reject hallucinations, serving requests via vLLM with PagedAttention and FP16/INT4 quantization for low TTFT.`;
  }

  if (qLower.includes('owasp') || qLower.includes('xss') || qLower.includes('csrf') || qLower.includes('pkce') || qLower.includes('httponly') || qLower.includes('security')) {
    return `In securing cloud applications, I implement defense-in-depth across multiple architectural layers. For OWASP Top 10 threats, SQL injection is eliminated using parameterized queries and ORM abstractions with zero string concatenation. For XSS, we enforce strict context-aware output encoding alongside a robust Content Security Policy (CSP). For authentication, access tokens are kept short-lived (15 minutes) and refresh tokens are stored exclusively in HttpOnly, Secure, SameSite=Strict cookies to prevent token exfiltration via client-side JavaScript. In Single Page Apps and mobile clients, we mandate OAuth 2.0 Authorization Code flow with PKCE using SHA-256 code challenges.`;
  }

  if (qLower.includes('kafka') || qLower.includes('spark') || qLower.includes('lakehouse') || qLower.includes('medallion') || qLower.includes('streaming')) {
    return `To handle high-throughput event processing (100k events/sec), we construct a streaming pipeline using Apache Kafka partitioned on business keys for parallel consumer group scalability. Downstream, Apache Spark Streaming processes micro-batches using event-time windows and watermarks to accommodate late-arriving records. Exactly-once semantics are guaranteed using Kafka transactional producers combined with idempotent upserts. In our analytical Lakehouse, we adopt the Medallion architecture: raw streaming logs land in the Bronze layer; cleaned, deduplicated, and schema-validated tables are maintained in Silver; and business-ready dimensional marts are materialized in Gold with partitioning and clustering for sub-second analytical scans.`;
  }

  if (qLower.includes('mobile') || qLower.includes('offline') || qLower.includes('react native') || qLower.includes('flutter')) {
    return `When designing an offline-first mobile application, I architect a local-first reactive data layer using an embedded SQLite engine (such as WatermelonDB in React Native). User actions mutate the local database immediately for instant optimistic UI responses while enqueuing mutations in a persistent background sync queue. When connectivity is restored, the sync worker transmits batches with exponential backoff and idempotency tokens. Conflicts are resolved at the field level using CRDT principles. To preserve 60/120fps UI smoothness, we adopt React Native's modern New Architecture with JavaScript Interface (JSI) TurboModules for zero-serialization native calls and virtualize lists using FlashList with cell recycling.`;
  }

  if (qLower.includes('testing') || qLower.includes('sre') || qLower.includes('tracing') || qLower.includes('slo') || qLower.includes('opentelemetry')) {
    return `My testing and reliability strategy adheres to a disciplined testing pyramid and comprehensive observability. At the foundation, unit tests validate domain logic in milliseconds. In the middle layer, integration tests run against real ephemeral dependencies (PostgreSQL, Kafka) spun up via Testcontainers, and Pact consumer-driven contract tests prevent breaking API schemas. For production reliability, we define Service Level Indicators (SLIs) measuring p99 latency (<200ms) and success rates (>99.9%), establishing a 30-day rolling Error Budget. When an incident spikes latency, we triage using OpenTelemetry distributed traces to pinpoint bottlenecks, and CI/CD policies freeze feature releases if error budgets are exhausted.`;
  }

  if (qLower.includes('scale') || qLower.includes('architecture') || qLower.includes('concurrent') || qLower.includes('microservice') || qLower.includes('saga')) {
    return `To scale to 10x traffic, I decouple the application into stateless microservices behind an Application Load Balancer. Stateful data is partitioned across primary-replica database clusters with read replicas offloading read traffic. I implement distributed caching with Redis using a cache-aside pattern with jittered TTLs to prevent cache stampedes. High-volume ingestion or background jobs are offloaded to Kafka or RabbitMQ event streams with consumer autoscaling. Finally, circuit breakers (e.g. Resilience4j) and token-bucket rate limiters safeguard downstream dependencies against cascading failures under load spikes.`;
  }

  if (analysis.isBehavioral) {
    return `Situation: Two days before a major production payment release, a critical third-party payment gateway introduced a breaking change to their webhook signature verification, causing automated integration tests to fail.
Task: As lead engineer, I had to update our verification pipeline, validate security against replay attacks, and prevent any launch delays.
Action: I aligned product and backend engineers on an emergency sprint, implemented cryptographic HMAC-SHA256 signature verification, added distributed idempotency locks in Redis to prevent double billing, and load-tested webhook replays in staging.
Result: We deployed the patch 4 hours ahead of schedule with 100% test pass rate, delivering zero merchant downtime and processing over 45,000 transactions smoothly on launch day.`;
  }

  return `When solving this challenge, I first establish the operational boundaries and core technical constraints. I isolate the primary mechanism by leveraging proven industry patterns, minimizing unnecessary state mutations and decoupling heavy I/O operations asynchronously. Furthermore, I implement comprehensive observability with distributed tracing (OpenTelemetry) and structured logging to monitor p99 latency and error rates. Finally, I design for resilience with automated retries, circuit breakers, and comprehensive integration testing to verify edge cases under load.`;
}

// ==========================================
// DYNAMIC LOCAL AI EVALUATION ENGINE
// ==========================================

/**
 * Intelligent, dynamic local evaluation engine.
 * Evaluates the answer strictly against the 5 weighted criteria:
 * 1. Relevance to Question (25%)
 * 2. Technical Accuracy (30%)
 * 3. Clarity & Communication (15%)
 * 4. Technical Depth (20%)
 * 5. STAR Method / Structure (10%)
 */
function evaluateAnswerLocal(question, answer, resumeContext = {}) {
  const text = (answer || '').trim();
  const validation = validateCandidateAnswer(text);
  const analysis = extractQuestionAnalysis(question, resumeContext.category || '');
  const modelAnswer = getIdealSampleAnswer(question, analysis);

  // 1. Handle Invalid Keystroke / Gibberish answers
  if (!validation.isValid && validation.type === 'gibberish') {
    return {
      score: null, // Never fabricate a score for un-evaluable answers
      verdict: 'Invalid Response',
      isValid: false,
      isScoreApplicable: false,
      validity: {
        status: 'INVALID',
        label: 'Invalid Response',
        isEvaluatable: false,
        reason: validation.reason || 'Response consists of unpronounceable keystrokes or meaningless characters and lacks intelligible words or technical concepts.'
      },
      evaluationConfidence: {
        score: 0.98,
        percentage: 98,
        level: 'High',
        reason: 'High confidence invalidity detection: response consists of unpronounceable keystrokes or meaningless characters with no intelligible words.'
      },
      qualityScore: {
        overall: null,
        isApplicable: false,
        relevanceScore: null,
        technicalAccuracyScore: null,
        clarityScore: null,
        technicalDepthScore: null,
        structureScore: null
      },
      structureType: analysis.structureType,
      relevanceScore: null,
      technicalAccuracyScore: null,
      clarityScore: null,
      technicalDepthScore: null,
      structureScore: null,
      feedback: 'This response cannot be evaluated because it does not contain intelligible sentences or relevant technical concepts. Please provide a meaningful response addressing the question.',
      strengths: [],
      weaknesses: [
        'Response consists of random or meaningless characters with no coherent words',
        'No technical concepts, engineering reasoning, or structured communication provided'
      ],
      missingConcepts: analysis.coreConcepts,
      suggestions: [
        'Read the question prompt carefully and identify the core technical requirements',
        'Formulate complete, structured sentences explaining your technical approach'
      ],
      modelAnswer
    };
  }

  // 2. Handle Non-Attempt / "I don't know" answers
  if (!validation.isValid && validation.type === 'non_attempt') {
    return {
      score: 1.0,
      verdict: 'Insufficient Response',
      isValid: false,
      isScoreApplicable: true,
      validity: {
        status: 'INSUFFICIENT',
        label: 'Insufficient Response',
        isEvaluatable: false,
        reason: 'Candidate explicitly indicated lack of knowledge or declined to attempt the question.'
      },
      evaluationConfidence: {
        score: 0.95,
        percentage: 95,
        level: 'High',
        reason: 'Candidate explicitly stated lack of knowledge or passed on the question.'
      },
      qualityScore: {
        overall: 1.0,
        isApplicable: true,
        relevanceScore: 1.0,
        technicalAccuracyScore: 0.0,
        clarityScore: 2.0,
        technicalDepthScore: 0.0,
        structureScore: 0.0
      },
      structureType: analysis.structureType,
      relevanceScore: 1.0,
      technicalAccuracyScore: 0.0,
      clarityScore: 2.0,
      technicalDepthScore: 0.0,
      structureScore: 0.0,
      feedback: 'Your response indicates that you do not know the answer. In an interview setting, rather than declining to answer, explain foundational concepts related to the topic or walk through how you would investigate and solve it.',
      strengths: ['Honest and direct communication'],
      weaknesses: [
        'No technical explanation, solution, or substance provided',
        'Missed opportunity to showcase problem-solving or diagnostic methodologies'
      ],
      missingConcepts: analysis.coreConcepts,
      suggestions: [
        'Even if uncertain about deep implementation details, discuss high-level principles',
        'Demonstrate curiosity and explain how you would research or test the solution'
      ],
      modelAnswer
    };
  }

  // 3. Process Valid Answers with Rigorous Dynamic Scoring
  const tokens = text.toLowerCase().split(/[\s,.;:!?()\[\]{}'"]+/).filter(Boolean);
  const wordCount = tokens.length;

  // Extract candidate technical words (including multilingual & phonetic technical terms)
  const MULTILINGUAL_TECH = new Set([
    'रिएक्ट', 'वर्चुअल', 'डॉम', 'डिफिंग', 'रिकॉन्सिलेशन', 'कंपोनेंट', 'स्टेट', 'डेटाबेस', 'इंडेक्स', 'क्वेरी', 'कैशिंग', 'रेडिस', 'काफ्का', 'लेटेंसी', 'आर्किटेक्चर', 'एल्गोरिदम', 'पाइपलाइन', 'परफॉर्मेंस', 'नोड', 'सर्वर', 'क्लाउड', 'एपीआई', 'डॉकर',
    'reconciliacion', 'reconciliación', 'rendimiento', 'algoritmo', 'arbol', 'árbol', 'mutaciones', 'almacenamiento', 'rendement'
  ]);

  const candidateTechWords = tokens.filter(tok => TECH_VOCABULARY.has(tok) || MULTILINGUAL_TECH.has(tok));
  const hasTechTerms = candidateTechWords.length > 0;

  // Check for off-topic content (e.g. talking about pizza/sports when asked a tech question)
  const casualOffTopicCount = tokens.filter(tok => CASUAL_OFF_TOPIC_WORDS.has(tok)).length;
  const isOffTopic = (casualOffTopicCount >= 1 && candidateTechWords.length === 0 && wordCount <= 12) ||
                     (casualOffTopicCount >= 3 && candidateTechWords.length < 2);

  // ----------------------------------------------------
  // Criterion 1: Relevance to Question (25% Weight)
  // ----------------------------------------------------
  let relevanceScore = 0;
  if (isOffTopic) {
    relevanceScore = 0.5;
  } else {
    // Check keyword alignment with the question
    const qTokens = (question || '').toLowerCase().split(/[\s,.;:!?()\[\]{}'"]+/).filter(w => w.length > 2);
    const matchedWithQuestion = tokens.filter(tok => qTokens.includes(tok));
    const questionKeywordRatio = qTokens.length > 0 ? matchedWithQuestion.length / Math.min(qTokens.length, 8) : 0;

    // Check specific question anchors (Multilingual: English, Hindi, Hinglish, Spanish, etc.)
    const qLower = (question || '').toLowerCase();
    let topicDirectlyAddressed = false;

    if (qLower.includes('react') && (
      text.toLowerCase().includes('react') || text.toLowerCase().includes('virtual dom') || 
      text.toLowerCase().includes('dom') || text.toLowerCase().includes('component') ||
      text.includes('रिएक्ट') || text.includes('वर्चुअल') || text.includes('डॉम') || text.includes('reconciliation') || text.includes('diffing')
    )) {
      topicDirectlyAddressed = true;
    } else if (qLower.includes('index') && (
      text.toLowerCase().includes('index') || text.toLowerCase().includes('database') || 
      text.toLowerCase().includes('query') || text.toLowerCase().includes('b-tree') || text.toLowerCase().includes('read') || 
      text.includes('इंडेक्स') || text.includes('डेटाबेस') || text.includes('क्वेरी')
    )) {
      topicDirectlyAddressed = true;
    } else if ((qLower.includes('ci/cd') || qLower.includes('kubernetes') || qLower.includes('devops') || qLower.includes('pipeline')) && (
      text.toLowerCase().includes('pipeline') || text.toLowerCase().includes('ci/cd') || 
      text.toLowerCase().includes('deploy') || text.toLowerCase().includes('test') || 
      text.toLowerCase().includes('kubernetes') || text.toLowerCase().includes('k8s') || text.toLowerCase().includes('canary') ||
      text.includes('पाइपलाइन')
    )) {
      topicDirectlyAddressed = true;
    } else if (qLower.includes('scale') && (
      text.toLowerCase().includes('scale') || text.toLowerCase().includes('traffic') || 
      text.toLowerCase().includes('cache') || text.toLowerCase().includes('cluster') || text.includes('कैशिंग') || text.includes('रेडिस')
    )) {
      topicDirectlyAddressed = true;
    } else if ((qLower.includes('rag') || qLower.includes('vector') || qLower.includes('llm') || qLower.includes('inference')) && (
      text.toLowerCase().includes('rag') || text.toLowerCase().includes('vector') || text.toLowerCase().includes('embedding') || 
      text.toLowerCase().includes('pgvector') || text.toLowerCase().includes('search') || text.toLowerCase().includes('llm') || text.toLowerCase().includes('hallucination')
    )) {
      topicDirectlyAddressed = true;
    } else if ((qLower.includes('owasp') || qLower.includes('security') || qLower.includes('pkce') || qLower.includes('jwt')) && (
      text.toLowerCase().includes('injection') || text.toLowerCase().includes('xss') || text.toLowerCase().includes('csrf') || 
      text.toLowerCase().includes('cookie') || text.toLowerCase().includes('token') || text.toLowerCase().includes('pkce') || text.toLowerCase().includes('oauth')
    )) {
      topicDirectlyAddressed = true;
    } else if ((qLower.includes('kafka') || qLower.includes('spark') || qLower.includes('lakehouse') || qLower.includes('streaming')) && (
      text.toLowerCase().includes('kafka') || text.toLowerCase().includes('spark') || text.toLowerCase().includes('stream') || 
      text.toLowerCase().includes('lakehouse') || text.toLowerCase().includes('watermark') || text.toLowerCase().includes('partition')
    )) {
      topicDirectlyAddressed = true;
    } else if ((qLower.includes('mobile') || qLower.includes('offline')) && (
      text.toLowerCase().includes('mobile') || text.toLowerCase().includes('sqlite') || text.toLowerCase().includes('offline') || 
      text.toLowerCase().includes('watermelondb') || text.toLowerCase().includes('sync') || text.toLowerCase().includes('react native')
    )) {
      topicDirectlyAddressed = true;
    } else if ((qLower.includes('testing') || qLower.includes('sre') || qLower.includes('slo') || qLower.includes('tracing')) && (
      text.toLowerCase().includes('test') || text.toLowerCase().includes('tracing') || text.toLowerCase().includes('slo') || 
      text.toLowerCase().includes('opentelemetry') || text.toLowerCase().includes('pyramid') || text.toLowerCase().includes('pact')
    )) {
      topicDirectlyAddressed = true;
    } else if (analysis.isBehavioral && (/situation|task|action|result|when|project|team|stakeholder|release|परिणाम|निर्णय|प्रोजेक्ट|टीम/i.test(text))) {
      topicDirectlyAddressed = true;
    }

    if (topicDirectlyAddressed) {
      relevanceScore = 7.0 + Math.min(3.0, Math.max(questionKeywordRatio * 3.5, candidateTechWords.length * 0.5));
    } else if (hasTechTerms) {
      relevanceScore = 4.0 + Math.min(2.5, candidateTechWords.length * 0.4);
    } else {
      relevanceScore = Math.min(3.0, wordCount * 0.2);
    }
  }
  relevanceScore = Math.max(0, Math.min(10, Number(relevanceScore.toFixed(1))));

  // ----------------------------------------------------
  // Criterion 2: Technical Accuracy (30% Weight)
  // ----------------------------------------------------
  let technicalAccuracyScore = 0;
  if (isOffTopic) {
    technicalAccuracyScore = 0.0;
  } else {
    let accuracyBase = 4.0;
    // Reward verified tech terms used in context
    const uniqueTechCount = new Set(candidateTechWords).size;
    accuracyBase += Math.min(4.5, uniqueTechCount * 0.7);

    // Reward technical reasoning markers
    if (/because|in order to|as a result|which prevents|which reduces|mitigate|optimizing|trade-off|jisse|isliye|parinaam|para|pour/i.test(text)) {
      accuracyBase += 1.0;
    }

    // Specific domain accuracy checks (including multilingual terminology)
    if (/virtual dom|diffing|reconciliation|minimal dom|batch|वर्चुअल|डिफिंग|रिकॉन्सिलेशन|डॉम|reconciliación/i.test(text)) accuracyBase += 1.0;
    if (/b-tree|wal|write-ahead|table scan|composite index|explain analyze|इंडेक्स|डेटाबेस/i.test(text)) accuracyBase += 1.0;
    if (/blue-green|canary|health check|rollback|linter|unit test|पाइपलाइन/i.test(text)) accuracyBase += 1.0;
    if (/redis|kafka|load balancer|read replica|partition|circuit breaker|रेडिस|काफ्का|कैशिंग/i.test(text)) accuracyBase += 1.0;
    if (/rag|vector|embedding|quantization|vllm|hnsw|bm25|pagedattention/i.test(text)) accuracyBase += 1.0;
    if (/owasp|sqli|csrf|xss|pkce|httponly|samesite|oauth/i.test(text)) accuracyBase += 1.0;
    if (/spark|lakehouse|medallion|watermark|iceberg|flink/i.test(text)) accuracyBase += 1.0;
    if (/offline-first|watermelondb|sqlite|turbomodules|jsi|flashlist/i.test(text)) accuracyBase += 1.0;
    if (/opentelemetry|slo|sli|error budget|testcontainers|pact/i.test(text)) accuracyBase += 1.0;

    technicalAccuracyScore = Math.min(10, accuracyBase);
  }
  technicalAccuracyScore = Math.max(0, Math.min(10, Number(technicalAccuracyScore.toFixed(1))));

  // ----------------------------------------------------
  // Criterion 3: Clarity & Communication (15% Weight)
  // ----------------------------------------------------
  let clarityScore = 0;
  if (isOffTopic && wordCount === 1) {
    clarityScore = 1.5;
  } else {
    let clarityBase = 5.0;
    // Sentence structure and punctuation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length >= 2) clarityBase += 2.0;
    if (sentences.length >= 4) clarityBase += 1.0;

    // Transitions and logical flow
    if (/first|second|furthermore|additionally|specifically|for example|in conclusion|finally|rather than|instead of|however|moreover|consequently|thereby/i.test(text)) {
      clarityBase += 2.0;
    }

    // Penalize extreme word count mismatch (too short for an interview explanation)
    if (wordCount < 10) clarityBase -= 2.0;
    else if (wordCount < 25) clarityBase -= 1.0;

    clarityScore = Math.min(10, clarityBase);
  }
  clarityScore = Math.max(0, Math.min(10, Number(clarityScore.toFixed(1))));

  // ----------------------------------------------------
  // Criterion 4: Technical Depth (20% Weight)
  // ----------------------------------------------------
  let technicalDepthScore = 0;
  if (isOffTopic) {
    technicalDepthScore = 0.0;
  } else {
    let depthBase = 2.5;

    // Depth requires specifics: algorithms, tools, metrics, failure modes
    const uniqueTechCount = new Set(candidateTechWords).size;
    depthBase += Math.min(3.5, uniqueTechCount * 0.6);

    const hasMetricsOrMechanics = /\d+ms|\d+%|\d+k|\d+m|p99|p95|sla|throughput|rps|latency|o\([a-z0-9]+\)|heuristic|frame rate|60fps|reflow|repaint|commit phase/i.test(text);
    const hasTradeoffs = /trade-off|tradeoff|versus|vs|overhead|drawback|alternative|bottleneck|concurrency|race condition|limitation/i.test(text);

    if (hasMetricsOrMechanics) depthBase += 2.0;
    if (hasTradeoffs) depthBase += 2.0;

    // Without deep metrics or trade-offs, depth is capped to reflect incomplete coverage
    if (!hasMetricsOrMechanics && !hasTradeoffs) {
      depthBase = Math.min(depthBase, 5.5);
    }

    // Penalize overly brief definitions
    if (wordCount < 20) depthBase = Math.min(depthBase, 3.5);
    else if (wordCount < 35 && !hasTradeoffs) depthBase = Math.min(depthBase, 5.5);

    technicalDepthScore = Math.min(10, depthBase);
  }
  technicalDepthScore = Math.max(0, Math.min(10, Number(technicalDepthScore.toFixed(1))));

  // ----------------------------------------------------
  // Criterion 5: Structure Score (10% Weight)
  // STAR for Behavioral, Technical Explanation for Technical
  // ----------------------------------------------------
  let structureScore = 0;
  if (isOffTopic) {
    structureScore = 0.5;
  } else if (analysis.isBehavioral) {
    // STAR Evaluation
    const hasSituation = /situation|when|while|at my previous|during|in my role|project/i.test(text);
    const hasTask = /task|responsibility|needed to|goal was|challenge was|objective|responsible for/i.test(text);
    const hasAction = /i designed|i built|i implemented|i analyzed|i led|i created|i resolved|i initiated|i coordinated|i aligned/i.test(text);
    const hasResult = /result|outcome|improved|reduced|increased|boosted|saved|by \d+%|delivered|achieved|deployed/i.test(text);

    let starCount = 0;
    if (hasSituation) starCount++;
    if (hasTask) starCount++;
    if (hasAction) starCount++;
    if (hasResult) starCount++;

    if (starCount === 4) {
      structureScore = 10.0;
      relevanceScore = Math.max(relevanceScore, 9.5);
      technicalAccuracyScore = Math.max(technicalAccuracyScore, 9.5);
      technicalDepthScore = Math.max(technicalDepthScore, 9.0);
    } else if (starCount === 3) {
      structureScore = 8.0;
    } else if (starCount === 2) {
      structureScore = 5.5;
    } else if (starCount === 1) {
      structureScore = 4.0;
    } else {
      structureScore = 2.5;
    }
  } else {
    // Technical Explanation Structure (Definition -> Mechanism -> Trade-offs/Impact)
    const hasDefinition = /is a|refers to|designed for|stands for|represents|uses a|maintains a/i.test(text);
    const hasMechanism = /how it works|under the hood|algorithm|process|diffing|executes|batches|evaluates|traverses|reconciliation|heuristic/i.test(text);
    const hasTradeoffs = /trade-off|tradeoff|overhead|advantage|disadvantage|performance|latency|scale|impact|result|reduces|improving|costly|drawback|limitation/i.test(text);

    let techStructCount = 0;
    if (hasDefinition) techStructCount++;
    if (hasMechanism) techStructCount++;
    if (hasTradeoffs) techStructCount++;

    if (techStructCount === 3) structureScore = 9.5;
    else if (techStructCount === 2) structureScore = 7.0;
    else if (techStructCount === 1) structureScore = 5.0;
    else structureScore = 3.0;
  }
  structureScore = Math.max(0, Math.min(10, Number(structureScore.toFixed(1))));

  // ----------------------------------------------------
  // Dynamic Weighted Overall Score Calculation
  // Overall = 25% Relevance + 30% Accuracy + 15% Clarity + 20% Depth + 10% Structure
  // ----------------------------------------------------
  let rawScore = (relevanceScore * 0.25) + 
                 (technicalAccuracyScore * 0.30) + 
                 (clarityScore * 0.15) + 
                 (technicalDepthScore * 0.20) + 
                 (structureScore * 0.10);

  // Critical rule: If the answer is irrelevant/off-topic, the overall score CANNOT pass
  if (relevanceScore <= 2.0) {
    rawScore = Math.min(rawScore, Number((relevanceScore * 0.6).toFixed(1)));
  }

  const finalScore = Math.max(0, Math.min(10, Number(rawScore.toFixed(1))));

  // Determine Verdict
  let verdict = 'Needs Significant Improvement';
  if (finalScore >= 9.0) verdict = 'Exceptional Staff-Level Response';
  else if (finalScore >= 7.5) verdict = 'Strong Technical Response';
  else if (finalScore >= 6.0) verdict = 'Competent Answer';
  else if (finalScore >= 4.5) verdict = 'Partially Accurate';
  else if (finalScore >= 2.0) verdict = 'Needs Refinement';
  else if (isOffTopic) verdict = 'Off-Topic Response';
  else verdict = 'Insufficient Response';

  // Dynamic Feedback Generation
  let feedback = '';
  if (isOffTopic) {
    feedback = `Your answer does not address the question asked about ${analysis.topicSummary}. In a technical interview, ensure your response directly targets the interviewer's specific topic.`;
  } else if (finalScore >= 9.0) {
    feedback = `Outstanding technical response. Your explanation demonstrates deep architectural mastery of ${analysis.topicSummary}, covering internal mechanisms, operational trade-offs, and measurable outcomes with great clarity.`;
  } else if (finalScore >= 7.5) {
    feedback = `Strong technical answer. You clearly articulated the core concepts of ${analysis.topicSummary} and demonstrated practical engineering judgment. To reach staff-level, delve even deeper into edge-case failure modes or quantifiable profiling metrics.`;
  } else if (finalScore >= 5.5) {
    feedback = `Solid foundational knowledge, but your answer needs more technical depth. You touched on the main ideas of ${analysis.topicSummary}, but expanding on underlying mechanics and concrete trade-offs will make your response much more compelling.`;
  } else if (finalScore >= 3.5) {
    feedback = `Partially correct start, but the response lacks sufficient technical explanation. You introduced basic points, but did not explain how ${analysis.topicSummary} operates under high concurrency or real-world production conditions.`;
  } else {
    feedback = `Your answer is overly brief or disconnected from the core technical aspects of ${analysis.topicSummary}. Review the key concepts and structure your response with specific mechanisms and architectural trade-offs.`;
  }

  // Dynamic Strengths
  const strengths = [];
  if (relevanceScore >= 7.0) strengths.push(`Directly targets the core question on ${analysis.topicSummary}.`);
  if (technicalAccuracyScore >= 7.0) strengths.push('Demonstrates accurate command of relevant technical terminology and principles.');
  if (clarityScore >= 7.0) strengths.push('Communicated with clean phrasing, coherent sentence flow, and logical transitions.');
  if (technicalDepthScore >= 7.0) strengths.push('Includes advanced architectural details, trade-offs, or concrete performance metrics.');
  if (structureScore >= 7.5) {
    strengths.push(analysis.isBehavioral ? 'Effectively followed the STAR framework with clear personal actions and outcomes.' : 'Well-structured explanation covering definition, mechanisms, and practical considerations.');
  }
  if (strengths.length === 0) {
    strengths.push('Provided a concise opening statement.');
  }

  // Dynamic Weaknesses
  const weaknesses = [];
  if (relevanceScore < 6.0) weaknesses.push(`Did not sufficiently engage with the specific prompt requirements for ${analysis.topicSummary}.`);
  if (technicalAccuracyScore < 6.0) weaknesses.push('Lacks precise technical terminology or contains vague generalities.');
  if (technicalDepthScore < 6.0) weaknesses.push('Superficial coverage—omitted internal implementation mechanics, edge cases, and trade-offs.');
  if (structureScore < 6.0) {
    weaknesses.push(analysis.isBehavioral ? 'Missing clear STAR components (such as personal ownership in Action or measurable metrics in Result).' : 'Lacks a structured breakdown transitioning from concept definition to internal mechanics.');
  }
  if (wordCount < 30 && finalScore < 8.0) weaknesses.push('Response is too brief to convey senior-level engineering experience.');

  // Detailed Suggestions
  const suggestions = [];
  if (technicalDepthScore < 7.0) {
    suggestions.push(`Explain the inner mechanics of ${analysis.topicSummary} (e.g. data structures, algorithms, or protocols used).`);
  }
  if (structureScore < 7.5) {
    suggestions.push(analysis.isBehavioral ? 'Explicitly organize your answer: Situation → Task → Action → Measurable Result.' : 'Structure technical explanations: High-level purpose → Mechanism under the hood → Trade-offs & performance impact.');
  }
  suggestions.push('Weave in tangible production metrics (e.g. p99 latency reduction, error rates, throughput gains, or resource savings).');

  // ----------------------------------------------------
  // Evaluation Confidence Calculation
  // ----------------------------------------------------
  let confidenceScore = 0.85;
  if (wordCount >= 45 && candidateTechWords.length >= 3) confidenceScore = 0.96;
  else if (wordCount >= 25 && candidateTechWords.length >= 2) confidenceScore = 0.91;
  else if (wordCount < 12) confidenceScore = 0.72;

  const confidenceLevel = confidenceScore >= 0.90 ? 'High' : confidenceScore >= 0.80 ? 'Medium' : 'Low';

  return {
    score: finalScore,
    verdict,
    isValid: true,
    isScoreApplicable: true,
    validity: {
      status: 'VALID',
      label: 'Valid Technical Response',
      isEvaluatable: true,
      reason: 'Response provides understandable language and directly addresses the technical domain.'
    },
    qualityScore: {
      overall: finalScore,
      isApplicable: true,
      relevanceScore,
      technicalAccuracyScore,
      clarityScore,
      technicalDepthScore,
      structureScore
    },
    evaluationConfidence: {
      score: confidenceScore,
      percentage: Math.round(confidenceScore * 100),
      level: confidenceLevel,
      reason: confidenceLevel === 'High'
        ? 'High confidence: substantial concept density, technical terminology alignment, and clear structure.'
        : confidenceLevel === 'Medium'
        ? 'Moderate confidence: answer is relevant but concise.'
        : 'Low confidence: response is brief with limited technical terminology.'
    },
    structureType: analysis.structureType,
    relevanceScore,
    technicalAccuracyScore,
    clarityScore,
    technicalDepthScore,
    structureScore,
    feedback,
    strengths,
    weaknesses,
    missingConcepts: analysis.coreConcepts,
    suggestions,
    modelAnswer
  };
}

function generateRoadmapLocal(resume, targetRole) {
  const safeResume = resume || {};
  const roleData = ROLE_TAXONOMY[targetRole] || ROLE_TAXONOMY["Full Stack Developer"] || {
    coreSkills: ["JavaScript", "TypeScript", "React", "Node.js", "SQL"],
    advancedSkills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Redis", "System Design"]
  };
  const allCurrentSkills = [
    ...(safeResume.skills?.languages || []),
    ...(safeResume.skills?.frameworks || []),
    ...(safeResume.skills?.databases || []),
    ...(safeResume.skills?.cloudAndDevops || []),
    ...(safeResume.skills?.tools || [])
  ].map(s => String(s).toLowerCase());

  const missingCore = (roleData.coreSkills || []).filter(s => !allCurrentSkills.some(cs => cs.includes(s.toLowerCase())));
  const missingAdv = (roleData.advancedSkills || []).filter(s => !allCurrentSkills.some(cs => cs.includes(s.toLowerCase())));

  const totalCore = roleData.coreSkills?.length || 5;
  const totalAdv = roleData.advancedSkills?.length || 5;
  const matchedCoreCount = totalCore - missingCore.length;
  const matchedAdvCount = totalAdv - missingAdv.length;
  const readiness = Math.max(35, Math.min(96, Math.round(((matchedCoreCount * 1.5 + matchedAdvCount) / (totalCore * 1.5 + totalAdv)) * 100)));

  return {
    targetRole,
    estimatedWeeks: Math.max(4, Math.min(16, (missingCore.length * 2) + Math.ceil(missingAdv.length * 1.5))),
    readinessScore: readiness,
    phases: [
      {
        phase: 1,
        title: "Foundation & Core Competencies",
        duration: "Weeks 1 - 2",
        focus: "Closing primary technical gaps",
        skills: missingCore.slice(0, 4).length > 0 ? missingCore.slice(0, 4) : ["System Design Patterns", "Advanced TypeScript", "Database Optimization", "TDD Testing"],
        objectives: [
          "Master core syntax, memory management, and asynchronous control flow.",
          "Build an isolated micro-module implementing test-driven development (TDD)."
        ],
        handsOnProject: `Build a production-ready REST & GraphQL API featuring authenticated rate limiting and automated integration tests.`,
        recommendedResources: [
          { title: "Official Documentation & Deep Dives", type: "Free Docs", url: "https://developer.mozilla.org" },
          { title: "FullStack Open / Architecture Reference", type: "Interactive Course", url: "https://roadmap.sh" }
        ]
      },
      {
        phase: 2,
        title: "Cloud Infrastructure, Containers & CI/CD",
        duration: "Weeks 3 - 5",
        focus: "DevOps maturity and production readiness",
        skills: missingAdv.slice(0, 4).length > 0 ? missingAdv.slice(0, 4) : ["Docker", "Kubernetes", "AWS Cloud Architecture", "CI/CD Pipelines"],
        objectives: [
          "Containerize services with multi-stage Dockerfiles for minimal image size.",
          "Set up automated GitHub Actions workflow with linting, security scans, and auto-deployments."
        ],
        handsOnProject: `Deploy a multi-service application with Docker Compose, automated zero-downtime rolling updates, and Prometheus metrics monitoring.`,
        recommendedResources: [
          { title: "Docker & Kubernetes Labs (Katacoda / KodeKloud)", type: "Hands-on Lab", url: "https://docs.docker.com" },
          { title: "AWS Cloud Practitioner & Solutions Architect Prep", type: "Certification Track", url: "https://aws.amazon.com/training/" }
        ]
      },
      {
        phase: 3,
        title: "Distributed Architecture & Scale",
        duration: "Weeks 6 - 8",
        focus: "Enterprise scalability and portfolio flagship",
        skills: ["Distributed Caching (Redis)", "Message Queues (Kafka/RabbitMQ)", "System Design at Scale", "Observability (OpenTelemetry)"],
        objectives: [
          "Architect resilient high-throughput event-driven microservices.",
          "Author detailed technical RFCs and architecture decision records (ADRs)."
        ],
        handsOnProject: `Publish a flagship open-source project showcasing real-time streaming, Redis pub/sub, distributed caching, and benchmarked load tests.`,
        recommendedResources: [
          { title: "Designing Data-Intensive Applications (Kleppmann)", type: "Essential Reading", url: "https://dataintensive.net" },
          { title: "System Design Primer (GitHub Repository)", type: "Architecture Reference", url: "https://github.com/donnemartin/system-design-primer" }
        ]
      }
    ]
  };
}

function optimizeBulletLocal(rawBullet, contextTech) {
  const cleanBullet = (rawBullet || "").trim().replace(/^[-•*]\s*/, '');
  
  // Calculate baseline score for raw bullet
  let baseScore = 20;
  const hasNumbers = /\d+%?|\$\d+/.test(cleanBullet);
  const words = cleanBullet.split(/\s+/).filter(Boolean);
  if (hasNumbers) baseScore += 25;
  if (words.length >= 10 && words.length <= 28) baseScore += 20;
  
  const lowerBullet = cleanBullet.toLowerCase();
  const startsWithPassive = /^(worked|helped|responsible|handled|assisted|participated|did|made)\b/.test(lowerBullet);
  if (!startsWithPassive && words.length > 0) baseScore += 20;
  
  // Detect domain context
  let detectedDomain = "backend and core platform";
  if (/react|vue|angular|frontend|ui|ux|component|css|tailwind/i.test(cleanBullet)) {
    detectedDomain = "frontend client application";
  } else if (/docker|kubernetes|aws|cloud|ci\/cd|pipeline|deploy/i.test(cleanBullet)) {
    detectedDomain = "cloud infrastructure & automated deployment pipeline";
  } else if (/database|sql|postgres|mongo|query|schema/i.test(cleanBullet)) {
    detectedDomain = "high-throughput data persistence layer";
  }

  const techStack = contextTech ? contextTech.trim() : (cleanBullet.match(/\b(React|Node\.?js|TypeScript|Python|Docker|AWS|PostgreSQL|Redis|GraphQL|Tailwind)\b/gi) || []).join(', ') || 'modern engineering stack';

  return {
    original: cleanBullet,
    originalScore: Math.min(65, Math.max(15, baseScore)),
    targetScore: 94,
    variations: [
      {
        style: "Quantified Metrics & Scale (Highest ATS Impact)",
        badge: "96% ATS Match",
        score: 96,
        text: `Architected and shipped ${techStack} based ${detectedDomain}, reducing average response latency by 44% and scaling daily transaction throughput by 35% for 80,000+ active users.`,
        rationale: "Replaces passive phrasing with power verb 'Architected', introduces exact percentage improvements (44% latency reduction), and anchors on production scale (80k+ users).",
        star: {
          situation: `High latency and unoptimized throughput on ${detectedDomain}`,
          task: `Overhaul architecture to sustain growing user demand and strict SLAs`,
          action: `Architected and deployed optimized modules using ${techStack}`,
          result: `Reduced latency by 44% and scaled transaction throughput by 35% across 80k+ users`
        }
      },
      {
        style: "Technical Depth & Resilience",
        badge: "Senior Level",
        score: 94,
        text: `Engineered fault-tolerant ${detectedDomain} with automated circuit breakers and caching via ${techStack}, achieving 99.98% uptime SLA and mitigating database query bottlenecks by 60%.`,
        rationale: "Highlights architectural resilience, SLA compliance (99.98%), and deep mitigation of system bottlenecks.",
        star: {
          situation: `Cascading system failures and unindexed database bottlenecks during peak loads`,
          task: `Build resilient safeguards and enterprise-grade uptime redundancy`,
          action: `Engineered automated circuit breaking and distributed caching with ${techStack}`,
          result: `Achieved 99.98% uptime SLA and eliminated 60% of database bottlenecks`
        }
      },
      {
        style: "Business Velocity & Team Leadership",
        badge: "Delivery & Velocity",
        score: 92,
        text: `Spearheaded migration to ${techStack} for ${detectedDomain}, accelerating sprint feature velocity by 2.5x while mentoring 3 engineers on automated integration testing and CI/CD best practices.`,
        rationale: "Emphasizes cross-functional execution, developer velocity multiplier (2.5x), and technical mentorship.",
        star: {
          situation: `Legacy release bottlenecks slowing feature iterations and team deployments`,
          task: `Modernize development lifecycle and raise team engineering standards`,
          action: `Spearheaded migration to ${techStack} and mentored 3 peers on automated testing`,
          result: `Accelerated sprint delivery by 2.5x with zero post-launch regression defects`
        }
      }
    ]
  };
}

// ==========================================
// GEMINI LIVE API INTEGRATION
// ==========================================

async function callGemini(prompt, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Error ${response.status}: ${errorBody}`);
  }

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini API returned empty candidate response.');
  }

  // Sanitize potential markdown code block wrappers
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  return JSON.parse(cleaned);
}

async function generateQuestionsWithGemini(resume, category, apiKey) {
  const prompt = `
You are an expert technical hiring manager at a top-tier tech firm.
Generate 5 tailored interview questions based strictly on the candidate's resume below and chosen software engineering discipline.
Resume Data:
${JSON.stringify(resume, null, 2)}
Selected Software Field / Category: ${category}

Supported fields include: Frontend Engineering, Backend & APIs, Database Engineering, System Design, DevOps & Cloud, Data Engineering, AI & Machine Learning, Cybersecurity & AppSec, Mobile App Engineering, Testing/QA & SRE, Behavioral Leadership (STAR Method), and Resume Deep-Dive.

Return a JSON array of objects with keys:
- id (string, e.g. "q1")
- category (string, e.g. "Frontend Engineering", "System Design", "AI & Machine Learning")
- difficulty (string: "Medium" or "Hard")
- topic (string)
- question (string: deeply tailored technical interview question referencing their tools, projects, or architectural choices)
- contextAnchor (string: what part of their background or domain inspired this)
- tips (array of 3 strings)
`;
  return await callGemini(prompt, apiKey);
}

async function evaluateAnswerWithGemini(question, answer, resumeContext, apiKey) {
  // Pre-validate for obvious random keystroke gibberish or empty answer
  const validation = validateCandidateAnswer(answer);
  if (!validation.isValid && validation.type === 'gibberish') {
    return evaluateAnswerLocal(question, answer, resumeContext);
  }

  const isBehavioral = (resumeContext?.category && /behavioral|conflict|culture|leadership/i.test(resumeContext.category)) ||
    /situation|conflict|deadline|stakeholder|failure|trade-off|disagree|prioritize|teamwork|tell me about/i.test(question || '');

  const structureType = isBehavioral ? 'STAR Structure' : 'Technical Structure';

  const prompt = `
You are a Principal Engineering Interviewer evaluating a candidate's interview response.
Question: "${question}"
Candidate Answer: "${answer}"
Candidate Context: ${JSON.stringify(resumeContext || {})}
Question Category Type: ${isBehavioral ? 'Behavioral (STAR)' : 'Technical'}

CRITICAL SCORING RULES:
1. INVALID / GIBBERISH / MEANINGLESS TEXT (e.g. "asdfghjkl", random keystrokes, repeating nonsense):
   - You MUST set isValid: false
   - ALL scores (score, relevanceScore, technicalAccuracyScore, clarityScore, technicalDepthScore, structureScore) MUST be 0.0.
   - verdict: "Invalid Answer"
   - feedback: "Your response does not contain a meaningful answer."
2. NON-ATTEMPT (e.g. "I don't know", "idk", "no idea", "pass"):
   - isValid: false
   - overall score: 1.0, relevanceScore: 1.0, technicalAccuracyScore: 0.0, clarityScore: 2.0, technicalDepthScore: 0.0, structureScore: 0.0
   - verdict: "Insufficient Answer"
   - feedback: "Your answer indicates you do not know the answer. In an interview, try to explain related fundamentals or problem-solving approaches rather than leaving it blank."
3. IRRELEVANT / OFF-TOPIC ANSWER (e.g. talking about pizza, weather, or an unrelated topic):
   - relevanceScore: 0.0 to 1.0
   - technicalAccuracyScore: 0.0
   - score: 0.5 to 1.5 maximum.
   - verdict: "Off-Topic Response"
4. VALID ANSWERS:
   Evaluate rigorously across these 5 specific criteria on a 0.0 to 10.0 scale:
   - relevanceScore (Weight 25%): How directly and accurately the response addresses what was asked.
   - technicalAccuracyScore (Weight 30%): Factual correctness, precision of technical terms, and soundness of reasoning.
   - clarityScore (Weight 15%): Communication coherence, sentence flow, transitions, and professional conciseness.
   - technicalDepthScore (Weight 20%): Advanced mechanics, trade-offs, edge cases, failure modes, or quantifiable metrics.
   - structureScore (Weight 10%):
     * For Behavioral: STAR framework adherence (Situation, Task, Action, Result).
     * For Technical: Logical technical explanation structure (Premise/Definition -> Mechanism -> Trade-offs/Impact).
5. OVERALL SCORE CALCULATION:
   Calculate strictly using the weighted formula:
   score = (relevanceScore * 0.25) + (technicalAccuracyScore * 0.30) + (clarityScore * 0.15) + (technicalDepthScore * 0.20) + (structureScore * 0.10)
   Round to 1 decimal place. Never return a fixed default score like 4/10.

Return STRICT JSON with these exact keys:
{
  "score": number (0.0 to 10.0),
  "verdict": string ("Invalid Answer" | "Insufficient Answer" | "Off-Topic Response" | "Needs Significant Improvement" | "Partially Accurate" | "Competent Answer" | "Strong Technical Response" | "Exceptional Staff-Level Response"),
  "isValid": boolean,
  "structureType": "${structureType}",
  "relevanceScore": number (0.0 to 10.0),
  "technicalAccuracyScore": number (0.0 to 10.0),
  "clarityScore": number (0.0 to 10.0),
  "technicalDepthScore": number (0.0 to 10.0),
  "structureScore": number (0.0 to 10.0),
  "feedback": string (specific personalized feedback based on the actual question and answer),
  "strengths": array of 2-3 specific strings,
  "weaknesses": array of 2-3 specific strings,
  "missingConcepts": array of 2-3 technical concepts that should have been covered,
  "suggestions": array of 2-3 actionable improvement tips,
  "modelAnswer": string (an ideal staff-level model answer for this exact question)
}
`;

  const parsed = await callGemini(prompt, apiKey);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI returned malformed evaluation data. Evaluation was not completed.');
  }

  const isInvalid = parsed.isValid === false || /invalid/i.test(parsed.verdict || '');
  const isInsufficient = /insufficient/i.test(parsed.verdict || '');

  if (isInvalid) {
    return {
      score: null,
      verdict: 'Invalid Response',
      isValid: false,
      isScoreApplicable: false,
      validity: {
        status: 'INVALID',
        label: 'Invalid Response',
        isEvaluatable: false,
        reason: parsed.feedback || 'The submitted response contains random, meaningless, or unparseable text and cannot be evaluated.'
      },
      evaluationConfidence: {
        score: 0.98,
        percentage: 98,
        level: 'High',
        reason: 'High confidence invalidity detection: response lacks natural language or technical concepts.'
      },
      qualityScore: {
        overall: null,
        isApplicable: false,
        relevanceScore: null,
        technicalAccuracyScore: null,
        clarityScore: null,
        technicalDepthScore: null,
        structureScore: null
      },
      structureType: parsed.structureType || structureType,
      relevanceScore: null,
      technicalAccuracyScore: null,
      clarityScore: null,
      technicalDepthScore: null,
      structureScore: null,
      feedback: parsed.feedback || 'This response cannot be evaluated because it does not contain intelligible sentences or relevant technical concepts.',
      strengths: [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Response lacks intelligible technical substance'],
      missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : ['Formulate complete sentences addressing the question'],
      modelAnswer: parsed.modelAnswer || ''
    };
  }

  // Validate and mathematically enforce consistency of the weighted formula
  const rel = Number(parsed.relevanceScore) || 0;
  const acc = Number(parsed.technicalAccuracyScore) || 0;
  const cla = Number(parsed.clarityScore) || 0;
  const dep = Number(parsed.technicalDepthScore) || 0;
  const str = Number(parsed.structureScore) || 0;

  let computedScore = (rel * 0.25) + (acc * 0.30) + (cla * 0.15) + (dep * 0.20) + (str * 0.10);
  if (rel <= 2.0) {
    computedScore = Math.min(computedScore, rel * 0.6);
  }
  const finalScore = isInsufficient ? 1.0 : Math.max(0, Math.min(10, Number(computedScore.toFixed(1))));

  const confidenceScore = Number(parsed.evaluationConfidence?.score) || (finalScore >= 8.5 ? 0.96 : finalScore >= 5.0 ? 0.90 : 0.82);
  const confidenceLevel = confidenceScore >= 0.90 ? 'High' : confidenceScore >= 0.80 ? 'Medium' : 'Low';

  return {
    score: finalScore,
    verdict: parsed.verdict || (finalScore >= 8 ? 'Strong Technical Response' : finalScore >= 5 ? 'Competent Answer' : 'Needs Refinement'),
    isValid: !isInvalid,
    isScoreApplicable: true,
    validity: {
      status: isInsufficient ? 'INSUFFICIENT' : 'VALID',
      label: isInsufficient ? 'Insufficient Response' : 'Valid Technical Response',
      isEvaluatable: !isInsufficient,
      reason: isInsufficient 
        ? 'Candidate indicated lack of knowledge or declined to attempt the question.' 
        : 'Response provides understandable language and directly addresses the technical domain.'
    },
    qualityScore: {
      overall: finalScore,
      isApplicable: true,
      relevanceScore: Math.max(0, Math.min(10, Number(rel.toFixed(1)))),
      technicalAccuracyScore: Math.max(0, Math.min(10, Number(acc.toFixed(1)))),
      clarityScore: Math.max(0, Math.min(10, Number(cla.toFixed(1)))),
      technicalDepthScore: Math.max(0, Math.min(10, Number(dep.toFixed(1)))),
      structureScore: Math.max(0, Math.min(10, Number(str.toFixed(1))))
    },
    evaluationConfidence: {
      score: confidenceScore,
      percentage: Math.round(confidenceScore * 100),
      level: confidenceLevel,
      reason: confidenceLevel === 'High'
        ? 'High AI evaluation confidence based on comprehensive concept alignment.'
        : 'Moderate AI evaluation confidence based on provided answer length.'
    },
    structureType: parsed.structureType || structureType,
    relevanceScore: Math.max(0, Math.min(10, Number(rel.toFixed(1)))),
    technicalAccuracyScore: Math.max(0, Math.min(10, Number(acc.toFixed(1)))),
    clarityScore: Math.max(0, Math.min(10, Number(cla.toFixed(1)))),
    technicalDepthScore: Math.max(0, Math.min(10, Number(dep.toFixed(1)))),
    structureScore: Math.max(0, Math.min(10, Number(str.toFixed(1)))),
    feedback: parsed.feedback || 'Answer evaluated successfully.',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    missingConcepts: Array.isArray(parsed.missingConcepts) ? parsed.missingConcepts : (Array.isArray(parsed.missingPoints) ? parsed.missingPoints : []),
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    modelAnswer: parsed.modelAnswer || ''
  };
}

async function generateRoadmapWithGemini(resume, targetRole, apiKey) {
  const prompt = `
You are a career mentor. Create a personalized learning roadmap to bridge skill gaps for the target role: "${targetRole}".
Candidate Resume:
${JSON.stringify(resume, null, 2)}

Return a JSON object with:
- targetRole (string)
- estimatedWeeks (number)
- readinessScore (number 1-100)
- phases (array of 3 objects with phase, title, duration, focus, skills [array of strings], objectives [array of strings], handsOnProject [string], recommendedResources [array of objects {title, type}])
`;
  return await callGemini(prompt, apiKey);
}

async function optimizeBulletWithGemini(rawBullet, contextTech, apiKey) {
  const prompt = `
Transform the weak resume bullet point into 3 high-impact STAR formatted bullet points.
Weak bullet: "${rawBullet}"
Context/Tech: "${contextTech}"

Return a JSON object with:
- original (string)
- variations (array of 3 objects with style, badge, text, rationale)
`;
  return await callGemini(prompt, apiKey);
}

function generateCoverLetterLocal(resume, companyName, targetRole, jobDescription) {
  const comp = companyName || "the engineering team";
  const role = targetRole || resume.targetRole || "Software Engineer";
  const exp = resume.experience?.[0] || { role: "Software Engineer", company: "previous company", bullets: [] };
  const topBullet = exp.bullets?.[0] || "engineered scalable cloud platforms and reduced latencies";
  const topTech = [
    ...(resume.skills?.languages || []),
    ...(resume.skills?.frameworks || [])
  ].slice(0, 4).join(', ');

  const letter = `Dear Hiring Manager at ${comp},

I am writing to express my strong enthusiasm for the ${role} position at ${comp}. With a robust background in engineering scalable full-stack applications and high-throughput architectures using ${topTech || 'modern software technologies'}, I am excited by the opportunity to deliver measurable value to your product and engineering initiatives.

In my recent role as ${exp.role} at ${exp.company}, I ${topBullet.toLowerCase().replace(/^[a-z]/, c => c.toLowerCase())}. Furthermore, I take deep ownership of architectural decisions, proactive test-driven development, and cross-functional delivery to ensure zero-downtime releases and rapid feature iteration.

${jobDescription ? `Reviewing your role requirements, my hands-on background in distributed systems and continuous delivery directly aligns with your technical goals. ` : ''}What excites me most about ${comp} is your commitment to technical innovation and delivering high-quality user experiences. I welcome the opportunity to discuss how my technical acumen, architectural problem-solving, and passion for engineering excellence will contribute to your engineering milestones.

Thank you for your time and consideration.

Warm regards,
${resume.name || 'Candidate'}
${resume.email || ''} ${resume.phone ? '| ' + resume.phone : ''}
${resume.links?.linkedin || ''}`;

  return {
    targetRole: role,
    company: comp,
    letter,
    keyHighlights: [
      `Anchored on ${exp.role} tenure at ${exp.company}`,
      `Featured accomplishment: ${topBullet.slice(0, 80)}...`,
      `Highlighted technical competencies: ${topTech}`
    ],
    tone: "Confident, Technical & Impact-Driven"
  };
}

async function generateCoverLetterWithGemini(resume, companyName, targetRole, jobDescription, apiKey) {
  const prompt = `
You are an executive career advisor. Write a tailored, impactful, professional cover letter for this candidate applying to ${companyName || 'Target Company'} for the role of ${targetRole || 'Software Engineer'}.
Candidate Resume:
${JSON.stringify(resume, null, 2)}
Target Job Description:
${jobDescription || 'Standard requirements for ' + targetRole}

Return a JSON object with:
- targetRole (string)
- company (string)
- letter (string: complete polished cover letter)
- keyHighlights (array of 3 strings: bullet points of what was emphasized)
- tone (string: e.g. "Confident, Technical & Impact-Driven")
`;
  return await callGemini(prompt, apiKey);
}
