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
  if (apiKey || process.env.GEMINI_API_KEY) {
    try {
      return await evaluateAnswerWithGemini(question, answer, resumeContext, apiKey || process.env.GEMINI_API_KEY);
    } catch (err) {
      console.warn("Gemini evaluation failed, falling back to smart local AI engine:", err.message);
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
  const experiences = resume.experience || [];
  const topExp = experiences[0] || { role: 'Software Engineer', company: 'a tech company', bullets: [] };
  const secondExp = experiences[1] || null;

  const projects = resume.projects || [];
  const topProject = projects[0] || null;

  const allSkills = [
    ...(resume.skills?.languages || []),
    ...(resume.skills?.frameworks || []),
    ...(resume.skills?.databases || []),
    ...(resume.skills?.cloudAndDevops || []),
    ...(resume.skills?.tools || []),
  ];

  // Pull actual bullet points for concrete context
  const allBullets = experiences.flatMap(e => e.bullets || []).filter(b => b.length > 20);
  const topBullet  = allBullets[0] || '';
  const secondBullet = allBullets[1] || '';

  const skill1 = allSkills[0] || 'JavaScript';
  const skill2 = allSkills[1] || 'Node.js';
  const skill3 = allSkills[2] || 'PostgreSQL';
  const dbSkill = (resume.skills?.databases || [])[0] || skill3;
  const cloudSkill = (resume.skills?.cloudAndDevops || [])[0] || 'AWS';

  const roleName   = topExp.role    || 'Software Engineer';
  const compName   = topExp.company || 'your previous company';
  const projName   = topProject?.name || 'your featured project';
  const projTech   = (topProject?.tech || [allSkills[0], allSkills[1]]).slice(0, 3).join(', ') || skill1;
  const candidateName = resume.name || 'you';

  // Build bullet-anchored question if we have real bullets
  const bulletQuestion = topBullet.length > 20
    ? `Your resume mentions: "${topBullet.substring(0, 120)}". Walk me through the specific technical decisions behind this — what alternatives did you consider, what trade-offs did you make, and how did you measure success?`
    : `In your role as ${roleName} at ${compName}, describe the most technically complex problem you solved. What made it hard, what stack did you use, and what was the measurable outcome?`;

  const bulletAnchor = topBullet.length > 20 ? `${compName} bullet point` : `${compName} (${roleName})`;

  const questions = [
    {
      id: 'q1',
      category: 'Technical Deep-Dive',
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
      id: 'q2',
      category: 'Behavioral (STAR Method)',
      difficulty: 'Medium',
      topic: 'Conflict & Deadline Management',
      question: secondBullet.length > 20
        ? `You mention: "${secondBullet.substring(0, 100)}". Tell me about a situation where you had to make a difficult trade-off to deliver this. Who were the stakeholders, what did you sacrifice, and what was the outcome?`
        : `Tell me about a high-stakes release at ${compName} where requirements changed mid-sprint or an unexpected blocker occurred. How did you prioritize, communicate, and deliver?`,
      contextAnchor: secondExp ? `${secondExp.company} (${secondExp.role})` : `${compName} — Agile Delivery`,
      tips: [
        'Use the STAR structure: Situation → Task → Action → Result',
        'Highlight proactive stakeholder communication',
        'Quantify the outcome — uptime, time-to-recovery, sprint velocity',
      ],
    },
    {
      id: 'q3',
      category: 'System Architecture',
      difficulty: 'Hard',
      topic: projName,
      question: topProject
        ? `In your project "${projName}" (built with ${projTech}), walk me through the architecture. If traffic suddenly scaled 10x, what would break first? How would you re-architect for fault tolerance and horizontal scalability?`
        : `Design a scalable backend for a real-time notification system handling 1M+ concurrent users using ${skill1} and ${skill2}. Describe your data flow, caching layer, and failure recovery strategy.`,
      contextAnchor: topProject ? `Project: ${projName}` : 'System Design Challenge',
      tips: [
        'Address the stateless vs stateful component split',
        'Explain caching strategy (read-through, write-behind, TTL)',
        'Discuss circuit breakers, rate limiting, and backpressure',
      ],
    },
    {
      id: 'q4',
      category: 'Database & Performance',
      difficulty: 'Medium',
      topic: dbSkill,
      question: `You have experience with ${dbSkill}. How do you approach schema design for a write-heavy workload? Explain your indexing strategy, query optimization process, and how you'd handle hotspot rows under high concurrency.`,
      contextAnchor: `${dbSkill} — Performance Tuning`,
      tips: [
        'Mention EXPLAIN/EXPLAIN ANALYZE and what you look for',
        'Discuss partial vs composite indexes, covering indexes',
        'Talk about read replicas, connection pooling (PgBouncer / RDS Proxy)',
      ],
    },
    {
      id: 'q5',
      category: 'Cloud & DevOps',
      difficulty: 'Medium',
      topic: cloudSkill,
      question: `Walk me through how you'd set up a production-grade CI/CD pipeline using ${cloudSkill} for a ${skill1} microservice. Include rollback strategy, monitoring, and zero-downtime deployment.`,
      contextAnchor: `${cloudSkill} — DevOps & Infrastructure`,
      tips: [
        'Describe the pipeline stages: test → build → deploy → verify',
        'Explain blue-green or canary deployment for zero-downtime',
        'Mention alerting thresholds and automatic rollback triggers',
      ],
    },
    {
      id: 'q6',
      category: 'Culture & Engineering Practices',
      difficulty: 'Medium',
      topic: 'Code Quality & Mentorship',
      question: `How do you ensure code quality and help junior engineers grow at ${compName} without becoming a bottleneck? Give a specific example of constructive pushback you gave on a technical decision.`,
      contextAnchor: `${compName} — Engineering Culture`,
      tips: [
        'Distinguish automated linting/CI checks from human architectural review',
        'Emphasize psychological safety and empathy in feedback',
        'Show how you fostered shared code ownership',
      ],
    },
  ];

  if (category !== 'all') {
    const filtered = questions.filter(q => q.category.toLowerCase().includes(category.toLowerCase()));
    return filtered.length > 0 ? filtered : questions;
  }
  return questions;
}


function evaluateAnswerLocal(question, answer, resumeContext) {
  const text = (answer || "").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  if (wordCount < 15) {
    return {
      score: 4,
      verdict: "Needs More Substance",
      clarityScore: 5,
      technicalDepthScore: 3,
      starAdherenceScore: 3,
      feedback: "Your response is too brief. In a tech interview, aim for 150-250 words to provide sufficient context, technical specifics, and tangible outcomes.",
      strengths: ["Direct and concise start"],
      missingPoints: [
        "Lacks concrete technical trade-offs or tool names",
        "Missing the STAR structure (Situation, Task, Action, Result)",
        "No quantifiable metrics or business outcome mentioned"
      ],
      modelAnswer: `In a previous production deployment, we noticed p99 query latency spiking above 800ms due to unindexed foreign keys under peak load. I used PostgreSQL's EXPLAIN ANALYZE and pg_stat_statements to isolate the offending joins, added targeted partial composite indexes, and implemented a Redis read-through cache for frequent lookups. As a result, p99 latency plummeted to under 45ms and database CPU utilization dropped by 38%.`
    };
  }

  // Check STAR markers
  const hasSituation = /situation|when|while|at my previous|during|project/i.test(text);
  const hasAction = /i designed|i built|i implemented|i analyzed|i investigated|i led|i created/i.test(text);
  const hasResult = /result|outcome|improved|reduced|increased|boosted|saved|by \d+%/i.test(text);
  const hasNumbers = /\d+/.test(text);

  let score = 6;
  if (wordCount >= 60) score += 1;
  if (hasAction) score += 1;
  if (hasResult || hasNumbers) score += 1;
  if (hasSituation && hasAction && (hasResult || hasNumbers)) score += 1;
  if (score > 10) score = 10;

  const strengths = [];
  if (hasAction) strengths.push("Good focus on personal agency and specific technical contributions.");
  if (hasNumbers || hasResult) strengths.push("Effectively mentioned outcomes and quantifiable results.");
  if (wordCount >= 50) strengths.push("Good pacing and detailed articulation of the scenario.");

  const missingPoints = [];
  if (!hasResult && !hasNumbers) missingPoints.push("Quantify the final impact (e.g. % performance gain, time saved, error rate drop).");
  if (!hasSituation) missingPoints.push("Explicitly set the business context and technical stakes early on.");
  if (wordCount < 60) missingPoints.push("Dive deeper into alternative approaches you considered and rejected.");

  return {
    score,
    verdict: score >= 8 ? "Excellent Response" : score >= 6 ? "Solid Foundation" : "Needs Refinement",
    clarityScore: Math.min(10, Math.round(score * 0.95)),
    technicalDepthScore: Math.min(10, Math.round(score * 0.9)),
    starAdherenceScore: (hasSituation && hasAction && hasResult) ? 9 : 6,
    feedback: `Strong answer showcasing practical engineering judgment. ${strengths.join(' ')} To elevate this to staff-level, weave in explicit metrics and explain why your chosen design was superior to alternatives.`,
    strengths: strengths.length > 0 ? strengths : ["Clear communication style", "Addresses the core question prompt"],
    missingPoints: missingPoints.length > 0 ? missingPoints : ["Mention secondary monitoring / observability verification"],
    modelAnswer: `When architecting our core processing pipeline, we faced severe latency degradation when concurrent user connections exceeded 10,000. My task was to eliminate the bottlenecks without rebuilding from scratch. I instrumented distributed tracing with OpenTelemetry, isolated blocking synchronous I/O, migrated key workloads to asynchronous event queues using RabbitMQ/Kafka, and configured horizontal pod autoscaling in Kubernetes based on custom queue depth metrics. Consequently, system throughput doubled to 25,000 req/sec while infrastructure costs remained flat.`
  };
}

function generateRoadmapLocal(resume, targetRole) {
  const roleData = ROLE_TAXONOMY[targetRole] || ROLE_TAXONOMY["Full Stack Developer"];
  const allCurrentSkills = [
    ...(resume.skills?.languages || []),
    ...(resume.skills?.frameworks || []),
    ...(resume.skills?.databases || []),
    ...(resume.skills?.cloudAndDevops || []),
    ...(resume.skills?.tools || [])
  ].map(s => s.toLowerCase());

  const missingCore = (roleData.coreSkills || []).filter(s => !allCurrentSkills.some(cs => cs.includes(s.toLowerCase())));
  const missingAdv = (roleData.advancedSkills || []).filter(s => !allCurrentSkills.some(cs => cs.includes(s.toLowerCase())));

  return {
    targetRole,
    estimatedWeeks: 8,
    readinessScore: Math.max(45, Math.min(92, 100 - (missingCore.length * 8 + missingAdv.length * 4))),
    phases: [
      {
        phase: 1,
        title: "Foundation & Core Competencies",
        duration: "Weeks 1 - 2",
        focus: "Closing primary technical gaps",
        skills: missingCore.slice(0, 3).length > 0 ? missingCore.slice(0, 3) : ["System Design Patterns", "Advanced TypeScript", "Database Optimization"],
        objectives: [
          "Master core syntax, memory management, and asynchronous control flow.",
          "Build an isolated micro-module implementing test-driven development (TDD)."
        ],
        handsOnProject: `Build a production-ready REST & GraphQL API featuring authenticated rate limiting and automated integration tests.`,
        recommendedResources: [
          { title: "Official Documentation & Deep Dives", type: "Free Docs" },
          { title: "FullStack Open / Frontend Masters", type: "Interactive Course" }
        ]
      },
      {
        phase: 2,
        title: "Cloud Infrastructure, Containers & CI/CD",
        duration: "Weeks 3 - 5",
        focus: "DevOps maturity and production readiness",
        skills: missingAdv.slice(0, 3).length > 0 ? missingAdv.slice(0, 3) : ["Docker", "Kubernetes", "AWS Cloud Architecture", "CI/CD Pipelines"],
        objectives: [
          "Containerize services with multi-stage Dockerfiles for minimal image size.",
          "Set up automated GitHub Actions workflow with linting, security scans, and auto-deployments."
        ],
        handsOnProject: `Deploy a multi-service application with Docker Compose, automated zero-downtime rolling updates, and Prometheus metrics monitoring.`,
        recommendedResources: [
          { title: "Docker & Kubernetes Labs (Katacoda / KodeKloud)", type: "Hands-on Lab" },
          { title: "AWS Cloud Practitioner & Solutions Architect Prep", type: "Certification Track" }
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
          { title: "Designing Data-Intensive Applications (Kleppmann)", type: "Essential Reading" },
          { title: "System Design Primer (GitHub Repository)", type: "Architecture Reference" }
        ]
      }
    ]
  };
}

function optimizeBulletLocal(rawBullet, contextTech) {
  const cleanBullet = (rawBullet || "").trim().replace(/^[-•*]\s*/, '');
  
  return {
    original: cleanBullet,
    variations: [
      {
        style: "Quantified Metrics & Scale (Recommended)",
        badge: "Highest ATS Impact",
        text: `Architected and shipped ${contextTech ? contextTech + ' based ' : ''}core module, reducing average response latency by 44% and increasing daily transaction throughput by 35% for 80,000+ active users.`,
        rationale: "Adds exact performance percentages, user scale, and strong action verb 'Architected'."
      },
      {
        style: "Technical Depth & Resilience",
        badge: "Senior Engineering",
        text: `Engineered resilient ${contextTech || 'distributed'} service architecture featuring automated circuit breakers and caching, achieving 99.98% uptime SLA and cutting database query bottlenecks by 60%.`,
        rationale: "Highlights fault tolerance, reliability SLA, and database optimization techniques."
      },
      {
        style: "Business & Team Leadership",
        badge: "Leadership & Delivery",
        text: `Spearheaded cross-functional migration to ${contextTech || 'modern cloud standards'}, accelerating sprint delivery cycle by 2.5x while mentoring 3 engineers on automated testing and CI/CD best practices.`,
        rationale: "Demonstrates cross-functional ownership, mentorship, and tangible velocity improvement."
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
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Error ${response.status}: ${errorBody}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

async function generateQuestionsWithGemini(resume, category, apiKey) {
  const prompt = `
You are an expert technical hiring manager at a top-tier tech firm.
Generate 5 tailored interview questions based strictly on the candidate's resume below.
Resume Data:
${JSON.stringify(resume, null, 2)}
Selected Category: ${category}

Return a JSON array of objects with keys:
- id (string, e.g. "q1")
- category (string, e.g. "Technical Deep-Dive", "Behavioral (STAR Method)", "System Architecture")
- difficulty (string: "Medium" or "Hard")
- topic (string)
- question (string: deeply tailored referencing their actual company, tools, or projects)
- contextAnchor (string: what part of their resume inspired this)
- tips (array of 3 strings)
`;
  return await callGemini(prompt, apiKey);
}

async function evaluateAnswerWithGemini(question, answer, resumeContext, apiKey) {
  const prompt = `
You are an expert tech interviewer evaluating a candidate's answer.
Question: "${question}"
Candidate Answer: "${answer}"
Candidate Background: ${JSON.stringify(resumeContext)}

Evaluate rigorously and return a JSON object with:
- score (number 1-10)
- verdict (string, e.g. "Excellent Response", "Needs Refinement")
- clarityScore (number 1-10)
- technicalDepthScore (number 1-10)
- starAdherenceScore (number 1-10)
- feedback (string: constructive analysis of their answer)
- strengths (array of strings)
- missingPoints (array of strings: what should have been mentioned)
- modelAnswer (string: how a staff engineer / hiring manager would answer this)
`;
  return await callGemini(prompt, apiKey);
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
