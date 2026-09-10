import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function parseResumeFile(buffer, mimetype, filename) {
  let text = '';
  if (mimetype === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
    const data = await pdf(buffer);
    text = data.text;
  } else {
    text = buffer.toString('utf-8');
  }
  return extractResumeStructure(text);
}

// ─── regex constants ─────────────────────────────────────────────────────────
const EMAIL_RE    = /([a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/;
const PHONE_RE    = /(\+?[\d][\d\s\-()+.]{6,}\d)/;
const LINKEDIN_RE = /((?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-]+)/i;
const GITHUB_RE   = /((?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_\-]+)/i;
const DATE_RANGE_RE = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?\d{4}\s*[-\u2013\u2014]\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?\d{4}|(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?\d{4}\s*[-\u2013\u2014]\s*(?:present|current|now|ongoing)/i;
const YEAR_RE = /\b(19|20)\d{2}\b/;

// ─── section header detection ─────────────────────────────────────────────────
const SECTION_MAP = {
  summary:        /^(summary|professional\s*summary|profile|about\s*me|objective|career\s*objective|overview|professional\s*profile)\s*:?\s*$/i,
  experience:     /^(experience|work\s*experience|employment|professional\s*experience|work\s*history|career\s*history|internship|internships|employment\s*history)\s*:?\s*$/i,
  education:      /^(education|academic|academics|qualification|educational\s*background|academic\s*background)\s*:?\s*$/i,
  skills:         /^(skills|technical\s*skills|core\s*competencies|competencies|technologies|tools\s*(?:&|and)\s*technologies|key\s*skills|skill\s*set|tech\s*stack|expertise|technical\s*expertise)\s*:?\s*$/i,
  projects:       /^(projects?|personal\s*projects?|academic\s*projects?|key\s*projects?|notable\s*projects?|selected\s*projects?)\s*:?\s*$/i,
  certifications: /^(certifications?|certificates?|awards?|achievements?|licenses?|honours?|honors?)\s*:?\s*$/i,
};

function getSectionType(line) {
  const t = line.trim();
  if (t.length > 65) return null;
  for (const [k, re] of Object.entries(SECTION_MAP)) {
    if (re.test(t)) return k;
  }
  return null;
}

function isBullet(line) {
  return /^[\u2022\u2023\u25E6\u2043\u2219\u00b7\u25AA\u2014\-\*]\s+/.test(line) || /^\d+\.\s+/.test(line);
}

function cleanBullet(line) {
  return line
    .replace(/^[\u2022\u2023\u25E6\u2043\u2219\u00b7\u25AA\u2014\-\*]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
}

// ─── skills dictionary ────────────────────────────────────────────────────────
const KNOWN_SKILLS = [
  'JavaScript','TypeScript','Python','Java','C++','C#','C','Go','Rust','PHP','Ruby','Swift','Kotlin','Scala','R','MATLAB','Dart','Bash','Shell','Perl','Elixir','Haskell',
  'React','Next.js','Vue','Angular','Svelte','HTML5','CSS3','Tailwind CSS','Tailwind','Bootstrap','Material UI','Sass','LESS','Redux','Zustand','Vite','Webpack','Babel','jQuery',
  'Node.js','Express','Django','Flask','FastAPI','Spring Boot','Spring','Laravel','Ruby on Rails','Rails','ASP.NET','NestJS','Fastify','Gin','Fiber','Hono',
  'PostgreSQL','MySQL','MongoDB','Redis','SQLite','DynamoDB','Elasticsearch','Cassandra','CouchDB','MariaDB','Oracle','Firestore','Supabase','PlanetScale',
  'AWS','GCP','Azure','Docker','Kubernetes','K8s','CI/CD','Terraform','Linux','Ansible','Helm','Jenkins','GitHub Actions','GitLab CI','CircleCI','ArgoCD','Prometheus','Grafana','Nginx','Apache',
  'Git','GitHub','GitLab','Jest','Mocha','Chai','Cypress','Playwright','Postman','Figma','Jira','Kafka','RabbitMQ','gRPC','WebSockets','OAuth','JWT','GraphQL','REST','OpenAPI','Swagger','Microservices',
  'Machine Learning','Deep Learning','TensorFlow','PyTorch','Pandas','NumPy','scikit-learn','OpenCV','LangChain',
];

const SKILL_CATS = {
  languages:     ['JavaScript','TypeScript','Python','Java','C++','C#','C','Go','Rust','PHP','Ruby','Swift','Kotlin','Scala','R','MATLAB','Dart','Bash','Shell','Perl','Elixir','Haskell'],
  frameworks:    ['React','Next.js','Vue','Angular','Svelte','Node.js','Express','Django','Flask','FastAPI','Spring Boot','Spring','Laravel','Ruby on Rails','Rails','ASP.NET','NestJS','Fastify','Gin','Fiber','Redux','Zustand','Tailwind CSS','Tailwind','Bootstrap','Material UI','Sass','jQuery'],
  databases:     ['PostgreSQL','MySQL','MongoDB','Redis','SQLite','DynamoDB','Elasticsearch','Cassandra','CouchDB','MariaDB','Oracle','Firestore','Supabase','PlanetScale'],
  cloudAndDevops:['AWS','GCP','Azure','Docker','Kubernetes','K8s','CI/CD','Terraform','Linux','Ansible','Helm','Jenkins','GitHub Actions','GitLab CI','CircleCI','ArgoCD','Prometheus','Grafana','Nginx','Apache'],
  tools:         ['Git','GitHub','GitLab','Jest','Mocha','Chai','Cypress','Playwright','Postman','Figma','Jira','Kafka','RabbitMQ','gRPC','WebSockets','OAuth','JWT','GraphQL','REST','OpenAPI','Swagger','Microservices','Machine Learning','Deep Learning','TensorFlow','PyTorch','Pandas','NumPy','scikit-learn'],
};

function detectSkills(text) {
  const found = [];
  for (const skill of KNOWN_SKILLS) {
    const esc = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`(?<![a-zA-Z])${esc}(?![a-zA-Z])`, 'i').test(text)) found.push(skill);
  }

  const cat = {
    languages: [], frameworks: [], databases: [],
    cloudAndDevops: [], tools: [],
    softSkills: ['Problem Solving', 'Communication', 'Teamwork', 'Agile/Scrum'],
  };

  for (const s of found) {
    let placed = false;
    for (const [k, list] of Object.entries(SKILL_CATS)) {
      if (list.some(x => x.toLowerCase() === s.toLowerCase())) {
        cat[k].push(s);
        placed = true;
        break;
      }
    }
    if (!placed) cat.tools.push(s);
  }
  return { found, cat };
}

// ─── section segmenter ────────────────────────────────────────────────────────
function segmentSections(lines) {
  const sections = { header: [] };
  let cur = 'header';
  for (const line of lines) {
    const t = getSectionType(line);
    if (t) {
      cur = t;
      if (!sections[cur]) sections[cur] = [];
    } else {
      if (!sections[cur]) sections[cur] = [];
      sections[cur].push(line);
    }
  }
  return sections;
}

// ─── experience parser ────────────────────────────────────────────────────────
function parseExperience(lines) {
  if (!lines || lines.length === 0) return [];

  const blocks = [];
  let cur = null;

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;

    const hasDate = DATE_RANGE_RE.test(t);

    if (hasDate && t.length < 150) {
      // Save previous block
      if (cur) blocks.push(cur);

      const datePart = t.match(DATE_RANGE_RE)?.[0] || '';
      const rest = t.replace(DATE_RANGE_RE, '').replace(/[|,\s\-\u2013\u2014]+$/, '').replace(/^[|,\s\-\u2013\u2014]+/, '').trim();

      let role = '', company = '', location = '';

      if (rest.includes('|')) {
        const parts = rest.split('|').map(p => p.trim()).filter(Boolean);
        role = parts[0] || '';
        company = parts[1] || '';
        location = parts[2] || '';
      } else if (/\bat\b/i.test(rest)) {
        const m = rest.match(/^(.+?)\s+at\s+(.+)$/i);
        role = m ? m[1].trim() : rest;
        company = m ? m[2].trim() : '';
      } else if (rest.length > 0) {
        role = rest;
        // Look ahead for company on next line
        const nextLine = lines[i + 1]?.trim() || '';
        if (nextLine && !isBullet(nextLine) && !DATE_RANGE_RE.test(nextLine) && !getSectionType(nextLine) && nextLine.length < 100) {
          company = nextLine;
          i++;
        }
      } else {
        // Date-only line — look back for role, ahead for company
        if (cur && cur.bullets.length === 0 && cur.role && !cur.company) {
          // cur already has the role from the previous non-bullet line
          cur.period = datePart;
          continue;
        }
        // Look back at previous line for role
        const prevLine = i > 0 ? lines[i - 1].trim() : '';
        if (prevLine && !isBullet(prevLine) && !getSectionType(prevLine)) {
          role = prevLine;
          // Remove prevLine from last block's bullets if accidentally added
          if (cur && cur.bullets.length > 0 && cur.bullets[cur.bullets.length - 1] === prevLine) {
            cur.bullets.pop();
          }
        }
        const nextLine = lines[i + 1]?.trim() || '';
        if (nextLine && !isBullet(nextLine) && !DATE_RANGE_RE.test(nextLine) && !getSectionType(nextLine) && nextLine.length < 100) {
          company = nextLine;
          i++;
        }
      }

      cur = {
        role: role || 'Software Engineer',
        company: company || '',
        location: location || '',
        period: datePart,
        bullets: [],
      };
    } else if (cur && isBullet(t)) {
      cur.bullets.push(cleanBullet(t));
    } else if (cur) {
      // Non-bullet line inside a job block
      if (!cur.company && cur.bullets.length === 0 && t.length < 100) {
        cur.company = t;
      } else if (!cur.location && cur.bullets.length === 0 && t.length < 80) {
        cur.location = t;
      } else if (t.length > 20) {
        cur.bullets.push(t);
      }
    } else if (!cur && !isBullet(t) && !getSectionType(t) && !DATE_RANGE_RE.test(t)) {
      // Before any date line — could be the first job's role
      cur = { role: t, company: '', location: '', period: '', bullets: [] };
    }
  }

  if (cur) blocks.push(cur);

  // Fallback: bullet-only
  if (blocks.length === 0) {
    const bullets = lines
      .filter(l => isBullet(l.trim()))
      .map(l => cleanBullet(l.trim()))
      .filter(b => b.length > 10);
    if (bullets.length > 0) {
      return [{ role: 'Engineer', company: '', location: '', period: '', bullets: bullets.slice(0, 12) }];
    }
  }

  return blocks;
}

// ─── education parser ─────────────────────────────────────────────────────────
function parseEducation(lines) {
  if (!lines || lines.length === 0) return [];
  const blocks = [];
  let cur = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const yearM  = t.match(YEAR_RE);
    const hasDate = DATE_RANGE_RE.test(t) || (yearM !== null);

    if (hasDate && t.length < 200) {
      if (cur) blocks.push(cur);
      const cleaned = t
        .replace(DATE_RANGE_RE, '')
        .replace(YEAR_RE, '')
        .replace(/[,\-\u2013\u2014|]+$/, '')
        .trim();
      const parts = cleaned.split(/[|\-\u2013\u2014,]+/).map(p => p.trim()).filter(Boolean);
      cur = {
        degree:      parts[0] || '',
        institution: parts[1] || '',
        year:        yearM ? yearM[0] : (t.match(DATE_RANGE_RE)?.[0] || ''),
        gpa:         t.match(/(?:gpa|cgpa|grade)[:\s]*([0-9.]+)/i)?.[1] || '',
      };
    } else if (!cur && t.length > 2) {
      cur = { degree: t, institution: '', year: '', gpa: '' };
    } else if (cur && !cur.institution && t.length > 2 && !isBullet(t)) {
      cur.institution = t;
    } else if (cur && !cur.year && yearM) {
      cur.year = yearM[0];
    }
  }

  if (cur) blocks.push(cur);
  return blocks;
}

// ─── projects parser ──────────────────────────────────────────────────────────
function parseProjects(lines, foundSkills) {
  if (!lines || lines.length === 0) return [];
  const blocks = [];
  let cur = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const isHeader = !isBullet(t) && !DATE_RANGE_RE.test(t) && t.length < 100 && /^[A-Z0-9]/.test(t);

    if (isHeader && (!cur || cur.description || cur.bullets.length > 0)) {
      if (cur) blocks.push(cur);
      cur = { name: t, tech: [], description: '', bullets: [] };
    } else if (cur && isBullet(t)) {
      cur.bullets.push(cleanBullet(t));
    } else if (cur && !cur.description && t.length > 10) {
      cur.description = t;
    }
  }
  if (cur) blocks.push(cur);

  for (const p of blocks) {
    const txt = [p.name, p.description, ...(p.bullets || [])].join(' ');
    p.tech = foundSkills.filter(s => {
      const esc = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(?<![a-zA-Z])${esc}(?![a-zA-Z])`, 'i').test(txt);
    });
    if (!p.description && p.bullets.length > 0) p.description = p.bullets[0];
  }
  return blocks;
}

// ─── labeled skills section parser ───────────────────────────────────────────
function parseSkillsSection(lines, cat, foundSkills) {
  const labelRe = /^([A-Za-z &\/]+)\s*:\s*(.+)$/;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const labeled = t.match(labelRe);
    if (labeled) {
      const label = labeled[1].toLowerCase();
      const values = labeled[2].split(/[,|•\/]+/).map(v => v.trim()).filter(v => v.length > 0 && v.length < 50);
      for (const val of values) {
        if (!foundSkills.includes(val)) foundSkills.push(val);
        if (/lang|program/i.test(label)) { if (!cat.languages.includes(val)) cat.languages.push(val); }
        else if (/framework|library|frontend|backend|web/i.test(label)) { if (!cat.frameworks.includes(val)) cat.frameworks.push(val); }
        else if (/database|db|data\s*store/i.test(label)) { if (!cat.databases.includes(val)) cat.databases.push(val); }
        else if (/cloud|devops|infra|platform|deploy/i.test(label)) { if (!cat.cloudAndDevops.includes(val)) cat.cloudAndDevops.push(val); }
        else { if (!cat.tools.includes(val)) cat.tools.push(val); }
      }
    } else {
      const cleaned = t.replace(/^[\u2022\u2023\u25E6\u2043\u2219\u00b7\-\*]\s*/, '');
      const tokens = cleaned.split(/[,|•\/]+/).map(v => v.trim()).filter(v => v.length > 1 && v.length < 45 && /^[A-Za-z]/.test(v));
      for (const tok of tokens) {
        if (!foundSkills.includes(tok)) {
          foundSkills.push(tok);
          let placed = false;
          for (const [k, list] of Object.entries(SKILL_CATS)) {
            if (list.some(x => x.toLowerCase() === tok.toLowerCase())) {
              if (!cat[k].includes(tok)) cat[k].push(tok);
              placed = true;
              break;
            }
          }
          if (!placed && !cat.tools.includes(tok)) cat.tools.push(tok);
        }
      }
    }
  }
}

// ─── main extractor ───────────────────────────────────────────────────────────
export function extractResumeStructure(rawText) {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Contact
  const emailMatch    = rawText.match(EMAIL_RE);
  const phoneMatch    = rawText.match(PHONE_RE);
  const linkedinMatch = rawText.match(LINKEDIN_RE);
  const githubMatch   = rawText.match(GITHUB_RE);

  // Name & Title from top non-contact lines
  const topLines = lines.slice(0, 10).filter(l =>
    !EMAIL_RE.test(l) &&
    !PHONE_RE.test(l) &&
    !LINKEDIN_RE.test(l) &&
    !GITHUB_RE.test(l) &&
    !/^https?:\/\//i.test(l) &&
    l.length > 1 &&
    !getSectionType(l)
  );
  const name  = topLines[0] ? topLines[0].replace(/[|@•,]/g, '').trim() : 'Candidate';
  const title = topLines[1] && topLines[1].length < 100 ? topLines[1] : 'Software Professional';

  // Section segmentation
  const sections = segmentSections(lines);

  // Summary
  const summaryLines = sections.summary || [];
  const summary = summaryLines.join(' ').trim() ||
    lines.slice(0, 20).filter(l =>
      !EMAIL_RE.test(l) && !PHONE_RE.test(l) && l.length > 40 && !getSectionType(l)
    ).slice(0, 3).join(' ').substring(0, 600);

  // Skills — detect from full text, then refine with skills section
  const { found: foundSkills, cat: categorized } = detectSkills(rawText);
  if (sections.skills && sections.skills.length > 0) {
    parseSkillsSection(sections.skills, categorized, foundSkills);
  }

  // Experience
  let experience = parseExperience(sections.experience || []);
  if (experience.length === 0) {
    // Try scanning entire document
    experience = parseExperience(lines);
  }
  if (experience.length === 0) {
    const allBullets = lines.filter(l => isBullet(l)).map(l => cleanBullet(l)).filter(b => b.length > 10);
    if (allBullets.length > 0) {
      experience = [{ role: title || 'Engineer', company: '', location: '', period: '', bullets: allBullets.slice(0, 12) }];
    }
  }

  // Education
  const education = parseEducation(sections.education || []);

  // Projects
  const projects = parseProjects(sections.projects || [], foundSkills);

  // Certifications
  const certLines = sections.certifications || [];
  const certifications = certLines
    .filter(l => l.trim().length > 3 && !isBullet(l))
    .map(l => l.trim())
    .slice(0, 8);

  return {
    rawText,
    name:     name || 'Candidate',
    title:    title || 'Software Professional',
    email:    emailMatch   ? emailMatch[0]   : '',
    phone:    phoneMatch   ? phoneMatch[0]   : '',
    location: '',
    links: {
      linkedin:  linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : '',
      github:    githubMatch   ? (githubMatch[0].startsWith('http')   ? githubMatch[0]   : `https://${githubMatch[0]}`)   : '',
      portfolio: '',
    },
    summary:    summary.substring(0, 600),
    targetRole: 'Full Stack Developer',
    skills:     categorized,
    experience,
    education,
    projects,
    certifications,
  };
}
