import { ROLE_TAXONOMY, POWER_ACTION_VERBS, WEAK_PASSIVE_VERBS } from '../data/roleKeywords.js';

export function analyzeResume(resume, targetRole = "Full Stack Developer", customJobDescription = "") {
  // Collect all text from resume
  const allBullets = (resume.experience || []).flatMap(exp => exp.bullets || []);
  const allSkills = [
    ...(resume.skills?.languages || []),
    ...(resume.skills?.frameworks || []),
    ...(resume.skills?.databases || []),
    ...(resume.skills?.cloudAndDevops || []),
    ...(resume.skills?.tools || []),
    ...(resume.skills?.softSkills || [])
  ];
  
  const resumeText = [
    resume.name || '',
    resume.title || '',
    resume.summary || '',
    ...allSkills,
    ...allBullets,
    (resume.education || []).map(e => `${e.degree || ''} ${e.institution || ''}`).join(' '),
    (resume.projects || []).map(p => `${p.name || ''} ${p.description || ''} ${(p.tech || []).join(' ')}`).join(' ')
  ].join(' ').toLowerCase();

  // 1. Contact & Completeness Score (max 15)
  let contactScore = 0;
  const contactFlags = [];
  if (resume.email && resume.email.includes('@')) {
    contactScore += 4;
  } else {
    contactFlags.push("Missing or invalid professional email address");
  }
  
  if (resume.phone && resume.phone.length > 7) {
    contactScore += 3;
  } else {
    contactFlags.push("Missing phone number");
  }

  if (resume.links?.linkedin) {
    contactScore += 4;
  } else {
    contactFlags.push("No LinkedIn profile link detected");
  }

  if (resume.links?.github || resume.links?.portfolio) {
    contactScore += 4;
  } else {
    contactFlags.push("No GitHub or portfolio URL provided");
  }

  // 2. Sections Completeness (max 20)
  let sectionScore = 0;
  const sectionAudits = [];
  if (resume.summary && resume.summary.length > 50) {
    sectionScore += 4;
    sectionAudits.push({ section: "Professional Summary", status: "pass", note: "Concise summary present" });
  } else {
    sectionAudits.push({ section: "Professional Summary", status: "warn", note: "Summary is brief or missing" });
  }

  if (resume.experience && resume.experience.length >= 2) {
    sectionScore += 6;
    sectionAudits.push({ section: "Work Experience", status: "pass", note: `${resume.experience.length} positions documented` });
  } else if (resume.experience && resume.experience.length === 1) {
    sectionScore += 4;
    sectionAudits.push({ section: "Work Experience", status: "pass", note: "1 position documented" });
  } else {
    sectionAudits.push({ section: "Work Experience", status: "fail", note: "No work experience entries found" });
  }

  if (allSkills.length >= 8) {
    sectionScore += 5;
    sectionAudits.push({ section: "Skills Inventory", status: "pass", note: `${allSkills.length} categorized skills found` });
  } else {
    sectionScore += 2;
    sectionAudits.push({ section: "Skills Inventory", status: "warn", note: "Fewer than 8 skills listed" });
  }

  if (resume.education && resume.education.length > 0) {
    sectionScore += 3;
    sectionAudits.push({ section: "Education", status: "pass", note: "Academic background documented" });
  } else {
    sectionAudits.push({ section: "Education", status: "warn", note: "No education listed" });
  }

  if (resume.projects && resume.projects.length > 0) {
    sectionScore += 2;
    sectionAudits.push({ section: "Projects", status: "pass", note: `${resume.projects.length} featured project(s)` });
  }

  // 3. Quantifiable Impact & Metrics Score (max 25)
  // Look for numbers, percentages, dollar signs, metric units (ms, req/sec, %, $, etc.)
  const metricRegex = /(\d+[\d,.]*\s*(?:%|\$|k|m|b|x|ms|s|hours|days|users|clients|transactions|dollars|engineers|services)?|\$\d+)/i;
  let quantifiedBulletsCount = 0;
  const analyzedBullets = allBullets.map(bullet => {
    const hasMetric = metricRegex.test(bullet) && /\d/.test(bullet);
    if (hasMetric) quantifiedBulletsCount++;
    
    // Check first word for power verb
    const words = bullet.trim().split(/\s+/);
    const firstWord = words[0] || "";
    const isPowerVerb = POWER_ACTION_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase());
    const isWeakVerb = WEAK_PASSIVE_VERBS.some(v => bullet.toLowerCase().startsWith(v.toLowerCase()));

    return {
      text: bullet,
      hasMetric,
      isPowerVerb,
      isWeakVerb,
      firstWord
    };
  });

  const bulletRatio = allBullets.length > 0 ? (quantifiedBulletsCount / allBullets.length) : 0;
  let metricsScore = Math.round(bulletRatio * 25);
  if (metricsScore > 25) metricsScore = 25;

  // 4. Power Action Verbs Score (max 15)
  const powerVerbCount = analyzedBullets.filter(b => b.isPowerVerb).length;
  const weakVerbCount = analyzedBullets.filter(b => b.isWeakVerb).length;
  const verbRatio = allBullets.length > 0 ? (powerVerbCount / allBullets.length) : 0;
  let verbScore = Math.round(verbRatio * 15);
  if (weakVerbCount > 0) verbScore = Math.max(0, verbScore - (weakVerbCount * 2));
  if (verbScore > 15) verbScore = 15;

  // 5. Target Role Matching & Skill Coverage (max 25)
  const targetRoleData = ROLE_TAXONOMY[targetRole] || ROLE_TAXONOMY["Full Stack Developer"];
  const targetRequiredSkills = [
    ...(targetRoleData.coreSkills || []),
    ...(targetRoleData.advancedSkills || [])
  ];

  // If custom JD provided, extract JD keywords
  let matchedSkills = [];
  let missingSkills = [];
  let jdKeywords = [];

  if (customJobDescription && customJobDescription.trim().length > 30) {
    const jdLower = customJobDescription.toLowerCase();
    const commonTechs = [
      ...targetRequiredSkills,
      "AWS", "GCP", "Azure", "Docker", "Kubernetes", "CI/CD", "Linux", "Git",
      "REST", "GraphQL", "Redis", "Kafka", "PostgreSQL", "MongoDB", "SQL",
      "React", "TypeScript", "JavaScript", "Python", "Java", "Go", "Next.js",
      "Microservices", "Terraform", "Jest", "Agile", "Tailwind"
    ];
    const uniqueTechs = [...new Set(commonTechs)];
    jdKeywords = uniqueTechs.filter(k => jdLower.includes(k.toLowerCase()));

    matchedSkills = jdKeywords.filter(k => resumeText.includes(k.toLowerCase()));
    missingSkills = jdKeywords.filter(k => !resumeText.includes(k.toLowerCase()));
  } else {
    // Role taxonomy based
    matchedSkills = targetRequiredSkills.filter(skill => resumeText.includes(skill.toLowerCase()));
    missingSkills = targetRequiredSkills.filter(skill => !resumeText.includes(skill.toLowerCase()));
    jdKeywords = targetRequiredSkills;
  }

  const matchRatio = jdKeywords.length > 0 ? (matchedSkills.length / jdKeywords.length) : 0.5;
  const skillCoverageScore = Math.round(matchRatio * 25);

  // Total ATS Score (0 - 100)
  const totalAtsScore = Math.min(100, contactScore + sectionScore + metricsScore + verbScore + skillCoverageScore);

  let ratingTier = "Needs Improvement";
  let badgeColor = "text-amber-500 bg-amber-50 border-amber-200";
  if (totalAtsScore >= 88) {
    ratingTier = "Elite ATS Ready";
    badgeColor = "text-emerald-500 bg-emerald-50 border-emerald-200";
  } else if (totalAtsScore >= 75) {
    ratingTier = "Strong Candidate";
    badgeColor = "text-blue-500 bg-blue-50 border-blue-200";
  } else if (totalAtsScore >= 60) {
    ratingTier = "Competitive";
    badgeColor = "text-indigo-500 bg-indigo-50 border-indigo-200";
  }

  // Strengths & Weaknesses
  const strengths = [];
  const improvements = [];

  if (bulletRatio >= 0.6) {
    strengths.push(`${Math.round(bulletRatio * 100)}% of your bullet points feature quantified metrics (%, $, scale, or time savings). Excellent impact demonstration!`);
  } else {
    improvements.push(`Only ${Math.round(bulletRatio * 100)}% of bullet points contain quantifiable numbers. Add metrics, percentage gains, team size, or throughput to prove tangible business impact.`);
  }

  if (powerVerbCount >= 3) {
    strengths.push(`Strong active leadership verbs detected (${powerVerbCount} bullets begin with power verbs like Architected, Engineered, Spearheaded).`);
  } else {
    improvements.push("Replace passive phrasing (e.g. 'worked on', 'helped with') with assertive power verbs like 'Architected', 'Engineered', 'Streamlined'.");
  }

  if (resume.links?.linkedin && (resume.links?.github || resume.links?.portfolio)) {
    strengths.push("Great online professional presence with active LinkedIn and repository/portfolio links.");
  } else {
    improvements.push("Ensure your LinkedIn profile and public GitHub or project portfolio URL are prominently displayed.");
  }

  if (missingSkills.length > 0) {
    improvements.push(`Target role highlights missing competencies: ${missingSkills.slice(0, 4).join(', ')}. Bridge these gaps to pass ATS filters.`);
  }

  return {
    atsScore: totalAtsScore,
    ratingTier,
    badgeColor,
    subScores: {
      contactScore: { current: contactScore, max: 15, percentage: Math.round((contactScore / 15) * 100) },
      sectionScore: { current: sectionScore, max: 20, percentage: Math.round((sectionScore / 20) * 100) },
      metricsScore: { current: metricsScore, max: 25, percentage: Math.round((metricsScore / 25) * 100) },
      verbScore: { current: verbScore, max: 15, percentage: Math.round((verbScore / 15) * 100) },
      skillCoverageScore: { current: skillCoverageScore, max: 25, percentage: Math.round((skillCoverageScore / 25) * 100) }
    },
    metricsSummary: {
      totalBullets: allBullets.length,
      quantifiedBullets: quantifiedBulletsCount,
      quantifiedRatio: Math.round(bulletRatio * 100),
      powerVerbsCount: powerVerbCount,
      weakVerbsCount: weakVerbCount
    },
    jobMatch: {
      targetRole,
      matchRate: Math.round(matchRatio * 100),
      matchedSkills,
      missingSkills,
      totalKeywordsChecked: jdKeywords.length
    },
    sectionAudits,
    contactFlags,
    strengths,
    improvements,
    analyzedBullets
  };
}
