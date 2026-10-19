import { analyzeResume } from './services/atsAnalyzer.js';
import { SAMPLE_RESUMES } from './data/sampleResumes.js';

console.log('=== Running Comprehensive SkillBridge Unit & ATS Tests ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
  }
}

// 1. Empty / Sparse input test
const emptyResume = { name: "Blank Candidate" };
const emptyAnalysis = analyzeResume(emptyResume, "Full Stack Developer");
assert(emptyAnalysis.atsScore >= 0 && emptyAnalysis.atsScore <= 30, 'Empty resume returns low score');
assert(emptyAnalysis.ratingTier === 'Needs Calibration', 'Empty resume returns Needs Calibration rating');
assert(emptyAnalysis.subScores.metricsScore.current === 0, 'Empty resume has 0 metrics score');

// 2. Strong match test (Sachin Yadav verified sample)
const sachin = SAMPLE_RESUMES.find(r => r.id === 'sachin-yadav');
assert(Boolean(sachin), 'Sample Sachin Yadav resume found');

const sachinAnalysis = analyzeResume(sachin, 'Full Stack Developer');
assert(sachinAnalysis.atsScore >= 70, 'Sachin Yadav profile achieves strong ATS score (>= 70)');
assert(sachinAnalysis.jobMatch.matchedSkills.length >= 5, 'Sachin matches multiple full-stack skills');
assert(sachinAnalysis.metricsSummary.quantifiedRatio > 0, 'Quantified bullets correctly detected');

// 3. Weak match test (Switching role to Data Scientist without data science skills)
const mismatchAnalysis = analyzeResume(sachin, 'Data Scientist / AI Engineer');
assert(mismatchAnalysis.jobMatch.missingSkills.length > 0, 'Detects missing skills when role does not align');

// 4. Custom Job Description test
const customJD = "We are seeking a Senior Cloud Architect with expertise in AWS, Kubernetes, Terraform, Docker, and CI/CD pipelines.";
const jdAnalysis = analyzeResume(sachin, 'DevOps / Cloud Engineer', customJD);
assert(Boolean(jdAnalysis.extractedJDRequirements), 'Custom JD requirements extracted');
assert(jdAnalysis.jobMatch.totalKeywordsChecked > 0, 'Custom JD keywords evaluated');

// 5. Action Verb Leadership verification
assert(sachinAnalysis.metricsSummary.powerVerbsCount > 0, 'Power verbs detected in experience bullets');

// 6. Subscore integrity (Formula must sum to totalAtsScore, capped at 100)
const { contactScore, sectionScore, metricsScore, verbScore, skillCoverageScore } = sachinAnalysis.subScores;
const subscoreSum = contactScore.current + sectionScore.current + metricsScore.current + verbScore.current + skillCoverageScore.current;
assert(sachinAnalysis.atsScore === Math.min(100, subscoreSum), 'ATS score accurately matches sum of transparent subscores');

// 7. Verify Scoring disclaimer is present and truthful
assert(Boolean(sachinAnalysis.scoringDisclaimer), 'Transparent scoring disclaimer is present');

console.log(`\n=== Test Results: ${passedTests}/${totalTests} Passed ===`);
if (passedTests === totalTests) {
  console.log('ALL ATS SUITE CHECKS PASSED!\n');
} else {
  process.exit(1);
}
