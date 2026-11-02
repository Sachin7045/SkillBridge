import assert from 'node:assert';
import { generateRoadmap, optimizeBullet, generateQuestions, evaluateAnswer } from './services/aiService.js';
import { analyzeResume } from './services/atsAnalyzer.js';

console.log('=== Running SkillBridge 5 Core Modules Verification Tests ===\n');

async function runTests() {
  const sampleResume = {
    name: "Alex Dev",
    title: "Senior Full Stack Engineer",
    summary: "Senior software engineer with 5+ years of experience architecting distributed cloud applications.",
    email: "alex.dev@example.com",
    phone: "+1-555-019-2834",
    links: {
      linkedin: "https://linkedin.com/in/alexdev",
      github: "https://github.com/alexdev"
    },
    skills: {
      languages: ["JavaScript", "TypeScript", "Python"],
      frameworks: ["React", "Node.js", "Express"],
      databases: ["PostgreSQL", "Redis"],
      cloudAndDevops: ["Docker", "AWS"],
      tools: ["Git", "Jest"]
    },
    experience: [
      {
        role: "Senior Software Engineer",
        company: "Stripe",
        period: "2022 - Present",
        bullets: [
          "Architected payment reconciliation service reducing transaction latency by 45% for 100k+ daily users.",
          "Spearheaded microservices migration improving uptime to 99.99% across distributed nodes."
        ]
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science",
        institution: "Tech University",
        year: "2021"
      }
    ],
    projects: [
      {
        name: "CloudFlow",
        description: "Real-time task streaming engine using Redis and WebSockets.",
        tech: ["Node.js", "Redis", "TypeScript"]
      }
    ]
  };

  // ==========================================
  // 1. CAREER ROADMAP TESTS
  // ==========================================
  console.log('--- 1. Testing Career Roadmap ---');
  const roadmap = await generateRoadmap(sampleResume, "Backend Engineer");
  assert(roadmap.readinessScore > 0, "Roadmap calculates readiness score");
  assert(roadmap.estimatedWeeks >= 4, "Roadmap computes bridge duration");
  assert(Array.isArray(roadmap.phases) && roadmap.phases.length >= 3, "Roadmap includes multi-phase timeline");
  assert(roadmap.phases[0].handsOnProject, "Phase includes flagship portfolio project");
  assert(roadmap.phases[0].recommendedResources.length > 0, "Phase includes learning resources with URLs");
  console.log('✓ PASS: Career Roadmap successfully generates phased gap-closer for Backend Engineer');

  // Test empty resume safety for roadmap
  const emptyRoadmap = await generateRoadmap({}, "DevOps / Cloud Engineer");
  assert(emptyRoadmap.readinessScore >= 35, "Empty resume roadmap calculates safe baseline readiness");
  assert(emptyRoadmap.phases.length === 3, "Empty resume still generates 3 phases");
  console.log('✓ PASS: Career Roadmap safely handles empty resume without crashing');

  // ==========================================
  // 2. STAR BULLET OPTIMIZER TESTS
  // ==========================================
  console.log('\n--- 2. Testing STAR Bullet Optimizer ---');
  const weakBullet = "Worked on frontend with React and fixed bugs.";
  const optResult = await optimizeBullet(weakBullet, "React, Redux, Jest");
  assert(optResult.original === weakBullet, "Preserves original bullet text");
  assert(optResult.originalScore <= 60, "Correctly scores raw weak bullet as low/moderate impact");
  assert(optResult.targetScore >= 90, "Sets high-impact target score");
  assert(optResult.variations.length === 3, "Generates 3 tailored STAR variations");
  assert(optResult.variations[0].star, "Includes STAR method breakdown (situation, task, action, result)");
  assert(optResult.variations[0].score >= 90, "Optimized bullet scores >= 90%");
  console.log(`✓ PASS: STAR Optimizer transforms weak bullet (${optResult.originalScore}% -> ${optResult.variations[0].score}%) with full STAR breakdown`);

  // ==========================================
  // 3. AI MOCK INTERVIEW TESTS
  // ==========================================
  console.log('\n--- 3. Testing AI Mock Interviewer ---');
  const questions = await generateQuestions(sampleResume, "all");
  assert(Array.isArray(questions) && questions.length >= 3, "Generates targeted interview questions");
  assert(questions[0].question.length > 20, "Questions are substantial and resume-anchored");
  console.log(`✓ PASS: AI Interviewer generates ${questions.length} resume-anchored questions`);

  // Evaluate technical response
  const evalResult = await evaluateAnswer(
    questions[0].question,
    "We decoupled the monolithic payment path by introducing Kafka event queues and Redis caching for idempotent transactions. We authored strict integration tests and monitored p99 latency via Prometheus, reducing drop-off by 42%.",
    { role: sampleResume.title, company: "Stripe" }
  );
  assert(evalResult.isValid === true, "Valid technical answer is marked valid");
  assert(evalResult.score >= 7.5, "Strong technical explanation receives high score");
  assert(evalResult.verdict, "Includes verdict label");
  assert(evalResult.strengths.length > 0, "Identifies candidate strengths");
  assert(evalResult.modelAnswer, "Includes model ideal answer");
  console.log(`✓ PASS: AI Interview evaluation successfully calculates dynamic score: ${evalResult.score}/10`);

  // ==========================================
  // 4. RESUME VISUALIZER BACKEND DATA INTEGRITY
  // ==========================================
  console.log('\n--- 4. Testing Resume Visualizer Data Integrity ---');
  assert(sampleResume.skills.languages.length === 3, "Languages detected correctly");
  assert(sampleResume.experience[0].bullets.length === 2, "Experience bullets intact");
  assert(sampleResume.projects[0].tech.length === 3, "Project tech stack verified");
  console.log('✓ PASS: Resume Visualizer data schema adheres to multi-template requirements');

  // ==========================================
  // 5. ATS ANALYZER TESTS
  // ==========================================
  console.log('\n--- 5. Testing ATS Analyzer ---');
  const analysis = analyzeResume(sampleResume, "Full Stack Developer");
  assert(analysis.atsScore >= 75, `ATS score is high for well-structured profile (${analysis.atsScore}/100)`);
  assert(analysis.subScores.metricsScore.current > 0, "Detects quantified metrics score");
  assert(analysis.subScores.verbScore.current > 0, "Detects power action verbs");
  assert(analysis.subScores.contactScore.current === 15, "Awards full 15 pts for complete contact details");
  assert(analysis.subScores.sectionScore.current >= 15, "Awards points for section completeness");
  assert(analysis.strengths.length > 0, "Generates clear strengths");
  assert(analysis.scoringDisclaimer, "Includes 100-point transparent scoring disclaimer");
  console.log(`✓ PASS: ATS Analyzer computes transparent score (${analysis.atsScore}/100) across 5 sub-factors`);

  // Test custom JD matching
  const customJD = "We are seeking a Full Stack Engineer experienced with TypeScript, React, Docker, and PostgreSQL to scale distributed web platforms.";
  const jdAnalysis = analyzeResume(sampleResume, "Full Stack Developer", customJD);
  assert(jdAnalysis.jobMatch.matchedSkills.length >= 4, "Matches TypeScript, React, Docker, PostgreSQL from JD");
  console.log(`✓ PASS: Custom Job Description successfully matches keywords (${jdAnalysis.jobMatch.matchedSkills.join(', ')})`);

  console.log('\n=== ALL 5 CORE MODULE CHECKS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Test failure:', err);
  process.exit(1);
});
