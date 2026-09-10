export const SAMPLE_RESUMES = [
  {
    id: "alex-chen",
    name: "Alex Chen",
    title: "Senior Full Stack Software Engineer",
    email: "alex.chen@example.com",
    phone: "+1 (555) 382-9012",
    location: "San Francisco, CA",
    links: {
      linkedin: "https://linkedin.com/in/alexchen-dev",
      github: "https://github.com/alexchen",
      portfolio: "https://alexchen.dev"
    },
    summary: "High-impact Full Stack Engineer with 5+ years of experience architecting distributed cloud applications and high-throughput web platforms using React, Node.js, and AWS. Proven track record of improving system latency by 45% and mentoring junior developers.",
    targetRole: "Full Stack Developer",
    skills: {
      languages: ["JavaScript (ES6+)", "TypeScript", "Python", "SQL", "HTML5/CSS3"],
      frameworks: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "Redux Toolkit"],
      databases: ["PostgreSQL", "MongoDB", "Redis"],
      cloudAndDevops: ["AWS (S3, EC2, Lambda)", "Docker", "Kubernetes", "CI/CD (GitHub Actions)", "Terraform"],
      tools: ["Git", "Jest", "Postman", "Webpack", "Vite", "Datadog"],
      softSkills: ["Agile/Scrum", "Team Leadership", "System Architecture", "Cross-Functional Collaboration", "Mentorship"]
    },
    experience: [
      {
        role: "Senior Full Stack Engineer",
        company: "CloudScale Technologies",
        location: "San Francisco, CA",
        period: "2022 - Present",
        bullets: [
          "Architected and deployed microservices infrastructure using Node.js, TypeScript, and AWS ECS, scaling to serve 1.2M daily active users with 99.98% uptime.",
          "Engineered a real-time analytics dashboard with React, Redux, and WebSockets, reducing page load latency by 42% and boosting user session duration by 28%.",
          "Implemented Redis caching layer across critical API endpoints, decreasing p99 database query response times from 340ms to 48ms.",
          "Spearheaded automated CI/CD pipeline migration to GitHub Actions, trimming deployment build times from 35 minutes down to 8 minutes.",
          "Mentored a pod of 4 junior and mid-level software engineers through weekly architectural reviews and structured pair-programming sessions."
        ]
      },
      {
        role: "Full Stack Developer",
        company: "Apex Digital Solutions",
        location: "San Jose, CA",
        period: "2020 - 2022",
        bullets: [
          "Developed customer-facing e-commerce checkout platform using React, Node.js, and PostgreSQL, processing over $4.5M in quarterly sales transactions.",
          "Integrated Stripe payment processing and OAuth 2.0 multi-factor authentication, reducing transaction cart abandonment by 19%.",
          "Refactored legacy monolith into RESTful services, increasing unit test coverage from 44% to 88% using Jest and Supertest.",
          "Collaborated with UX designers and product managers in two-week agile sprints to ship 14 core user-facing features ahead of deadline."
        ]
      },
      {
        role: "Junior Web Developer",
        company: "ByteWave Studios",
        location: "Oakland, CA",
        period: "2019 - 2020",
        bullets: [
          "Constructed responsive web interfaces utilizing HTML5, CSS3, and JavaScript across 12 client projects.",
          "Resolved over 120 cross-browser compatibility bugs, achieving full WCAG 2.1 AA accessibility compliance.",
          "Assisted in backend REST API maintenance and database migration scripts in Node.js and MongoDB."
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California, Berkeley",
        location: "Berkeley, CA",
        year: "2019",
        gpa: "3.8/4.0",
        honors: "Dean's Honor List, Magna Cum Laude"
      }
    ],
    projects: [
      {
        name: "DevPulse - Developer Productivity Telemetry",
        tech: ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL"],
        link: "https://github.com/alexchen/devpulse",
        description: "Open-source developer activity telemetry tool tracking PR turnaround times and code review health across engineering organizations with 800+ GitHub stars."
      },
      {
        name: "FastCache - Distributed Key-Value Store",
        tech: ["Go", "Distributed Algorithms", "Raft Consensus"],
        link: "https://github.com/alexchen/fastcache",
        description: "Built a high-performance in-memory key-value cache implementing Raft consensus for fault-tolerant state replication handling 50k req/sec."
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect – Associate (2023)",
      "CKAD: Certified Kubernetes Application Developer (2024)"
    ]
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    title: "Cloud & DevOps Infrastructure Engineer",
    email: "priya.sharma@example.com",
    phone: "+1 (555) 492-7104",
    location: "Austin, TX",
    links: {
      linkedin: "https://linkedin.com/in/priyasharma-devops",
      github: "https://github.com/psharma-cloud",
      portfolio: "https://priyasharma.cloud"
    },
    summary: "Reliability-focused DevOps Engineer with 4+ years specializing in Kubernetes orchestration, Terraform Infrastructure as Code (IaC), and resilient AWS/GCP cloud platforms. Successfully reduced cloud infrastructure expenditures by $180k/year through automated resource right-sizing.",
    targetRole: "DevOps / Cloud Engineer",
    skills: {
      languages: ["Python", "Bash", "Go", "YAML", "HCL (Terraform)"],
      frameworks: ["Terraform", "Ansible", "Helm", "ArgoCD", "Docker"],
      databases: ["PostgreSQL", "Redis", "DynamoDB"],
      cloudAndDevops: ["AWS (EKS, VPC, IAM, S3)", "GCP", "Kubernetes", "Linux (RHEL, Ubuntu)", "CI/CD (GitLab CI, GitHub Actions)"],
      tools: ["Prometheus", "Grafana", "Datadog", "Vault", "SonarQube", "PagerDuty"],
      softSkills: ["Site Reliability Engineering (SRE)", "Incident Response", "Root Cause Analysis", "Disaster Recovery", "Cross-team enablement"]
    },
    experience: [
      {
        role: "DevOps Engineer",
        company: "Vanguard Cloud Platforms",
        location: "Austin, TX",
        period: "2021 - Present",
        bullets: [
          "Orchestrated multi-region Kubernetes (EKS) clusters hosting 60+ microservices, maintaining 99.99% system availability SLA.",
          "Standardized Infrastructure as Code (IaC) using Terraform modules, decreasing environment provisioning cycle from 3 days to 18 minutes.",
          "Audited AWS cloud usage and implemented spot instances with auto-scaling policies, slashing monthly infrastructure bills by 32% ($180,000 annually).",
          "Engineered GitOps delivery workflow using ArgoCD and Helm charts, executing over 250 zero-downtime production deployments per month.",
          "Designed comprehensive observability stack using Prometheus, Grafana, and OpenTelemetry, resolving MTTR for production outages by 48%."
        ]
      },
      {
        role: "Cloud Systems Administrator",
        company: "Nexis Networks",
        location: "Dallas, TX",
        period: "2019 - 2021",
        bullets: [
          "Managed hybrid enterprise cloud infrastructure with 400+ virtual machines across AWS and on-premise Linux environments.",
          "Automated configuration management and security patching using Ansible playbooks, ensuring 100% compliance with SOC-2 standards.",
          "Established automated backup and disaster recovery mechanisms, successfully passing all quarterly failover simulations with zero data loss."
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Information Systems",
        institution: "University of Texas at Austin",
        location: "Austin, TX",
        year: "2019",
        gpa: "3.7/4.0",
        honors: "Engineering Merit Scholar"
      }
    ],
    projects: [
      {
        name: "KubeGuard - Policy Enforcement Controller",
        tech: ["Kubernetes", "Go", "OPA Gatekeeper", "Helm"],
        link: "https://github.com/psharma-cloud/kubeguard",
        description: "Custom Kubernetes admission controller validating container security context and CPU/memory limits prior to pod scheduling."
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect – Professional",
      "Certified Kubernetes Administrator (CKA)"
    ]
  },
  {
    id: "jordan-lee",
    name: "Jordan Lee",
    title: "Junior Frontend Developer",
    email: "jordan.lee@example.com",
    phone: "+1 (555) 721-3940",
    location: "Seattle, WA",
    links: {
      linkedin: "https://linkedin.com/in/jordanlee-dev",
      github: "https://github.com/jordanlee"
    },
    summary: "Creative and enthusiastic Frontend Developer skilled in modern JavaScript (ES6+), React, Tailwind CSS, and REST API integration. Eager to contribute to high-performance customer-centric web applications and expand full-stack capabilities.",
    targetRole: "Frontend Engineer",
    skills: {
      languages: ["JavaScript", "HTML5", "CSS3", "TypeScript (Basic)"],
      frameworks: ["React", "Tailwind CSS", "Bootstrap", "Next.js (Learning)"],
      databases: ["MongoDB (Basic)", "Supabase"],
      cloudAndDevops: ["Vercel", "Netlify", "Git", "GitHub Actions (Basic)"],
      tools: ["Vite", "Figma", "Postman", "Chrome DevTools", "npm"],
      softSkills: ["Fast Learner", "Empathy", "Team Player", "Creative Problem Solving"]
    },
    experience: [
      {
        role: "Junior Frontend Web Developer",
        company: "PixelCraft Agency",
        location: "Seattle, WA",
        period: "2023 - Present",
        bullets: [
          "Developed user interface components using React, Tailwind CSS, and Figma mockups for 6 client web applications.",
          "Implemented client-side routing, responsive navigations, and dynamic interactive forms with Formik and Yup validation.",
          "Integrated third-party REST APIs and Stripe checkout flows, optimizing client landing page conversion rates by 12%.",
          "Conducted code linting, bug fixes, and accessibility checks, bringing Google Lighthouse performance scores to 95+."
        ]
      },
      {
        role: "Web Design & Development Intern",
        company: "Cascade Creative Studios",
        location: "Seattle, WA",
        period: "2022 - 2023",
        bullets: [
          "Built static and CMS-driven landing pages using HTML, CSS, JavaScript, and WordPress.",
          "Assisted in mobile-responsive redesigns and optimized media assets, reducing image payload sizes by 40%."
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Arts in Interactive Media & Computing",
        institution: "University of Washington",
        location: "Seattle, WA",
        year: "2022",
        gpa: "3.6/4.0"
      }
    ],
    projects: [
      {
        name: "ShopSphere - Headless E-commerce UI",
        tech: ["React", "Tailwind CSS", "FakeStoreAPI", "Vite"],
        link: "https://github.com/jordanlee/shopsphere",
        description: "Full-featured shopping cart interface with instant product filtering, cart persistence, and theme toggle."
      }
    ],
    certifications: [
      "Meta Front-End Developer Professional Certificate (Coursera)"
    ]
  }
];
