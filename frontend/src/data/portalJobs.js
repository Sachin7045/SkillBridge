/**
 * Portal Deep Links & Curated Job Listings for LinkedIn & Naukri.com
 * SkillBridge Job Matcher Integration
 */

export function getLinkedInSearchUrl(keywords = 'Full Stack Developer', location = 'India') {
  const params = new URLSearchParams({
    keywords: keywords.trim(),
    location: location.trim()
  });
  return `https://www.linkedin.com/jobs/search/?${params.toString()}`;
}

export function getNaukriSearchUrl(keywords = 'Full Stack Developer', location = 'India') {
  const cleanKeywords = keywords.trim();
  const cleanLoc = location.trim();
  const slug = cleanKeywords.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'software-engineer';
  
  if (cleanLoc && cleanLoc.toLowerCase() !== 'india' && cleanLoc.toLowerCase() !== 'all') {
    const locSlug = cleanLoc.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `https://www.naukri.com/${slug}-jobs-in-${locSlug}?k=${encodeURIComponent(cleanKeywords)}&l=${encodeURIComponent(cleanLoc)}`;
  }
  return `https://www.naukri.com/${slug}-jobs?k=${encodeURIComponent(cleanKeywords)}`;
}

export const SAMPLE_LINKEDIN_JD = `Role: Senior Full Stack Engineer (FinTech Core)
Company: Razorpay / Tier-1 Tech Partner
Location: Bengaluru, India (Hybrid) | Experience: 3-6 Years

About the Role:
We are seeking an experienced Full Stack Engineer to build high-scale, resilient payment checkout and ledger systems processing millions of transactions daily. You will partner with product and infrastructure teams to design scalable distributed microservices and lightning-fast frontend user interfaces.

Key Technical Requirements:
- 3+ years hands-on experience with modern JavaScript / TypeScript, React.js, and Node.js.
- Strong proficiency in relational databases (PostgreSQL or MySQL) and query optimization (indexing, connection pooling, EXPLAIN ANALYZE).
- Hands-on experience with caching and messaging systems (Redis, Apache Kafka, RabbitMQ).
- Solid grasp of containerization and orchestration using Docker and Kubernetes (K8s).
- Proven track record with Cloud Services (AWS - S3, EC2, Lambda, CloudWatch).
- Strong command of RESTful APIs, GraphQL, and automated testing (Jest, Cypress).
- Experience designing resilient systems with circuit breakers, rate limiting, and zero-downtime CI/CD pipelines.`;

export const SAMPLE_NAUKRI_JD = `Job Title: Lead Full Stack Developer - React, Node.js & Cloud
Hiring Partner: Top Enterprise IT / Cloud Solutions (via Naukri.com)
Location: Pune / Bengaluru / Hyderabad (Hybrid / Remote options)
Experience: 3-8 years | CTC: ₹18,00,000 - ₹34,00,000 P.A.

Job Description & Core Responsibilities:
- Design, develop, and maintain high-volume, low-latency microservices using Node.js and Express/Fastify.
- Architect dynamic, mobile-responsive single page web applications using React.js, Next.js, Redux Toolkit, and Tailwind CSS.
- Manage database schemas, migrations, and performance tuning across PostgreSQL and MongoDB.
- Build and maintain continuous integration & deployment (CI/CD) pipelines using GitHub Actions or GitLab CI.
- Deploy and monitor microservices on AWS/GCP cloud environments with Docker containers.
- Write clean, modular, and testable code adhering to Agile methodologies and SOLID principles.

Key Skills Required (Recruiter Keywords):
React.js, Node.js, TypeScript, PostgreSQL, MongoDB, Docker, Kubernetes, AWS, Redis, REST API, Microservices, CI/CD, Git, Jest.`;

export const CURATED_PORTAL_JOBS = [
  // Full Stack Roles
  {
    id: 'li-fs-1',
    portal: 'LinkedIn',
    portalBadge: 'LinkedIn Jobs',
    portalColor: '#0A66C2',
    title: 'Senior Full Stack Engineer',
    company: 'Razorpay',
    companyLogo: '💳',
    location: 'Bengaluru, India (Hybrid)',
    city: 'Bengaluru',
    targetRole: 'Full Stack Developer',
    experience: '3-6 Yrs',
    salary: '₹22 - ₹38 LPA',
    posted: '1 day ago',
    applicants: '48 applicants',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Kafka'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Razorpay+Senior+Full+Stack+Engineer&location=Bengaluru',
    description: `Razorpay is hiring a Senior Full Stack Engineer in Bengaluru.
Requirements:
- Strong experience with React.js, Node.js, and TypeScript.
- Deep understanding of PostgreSQL, query tuning, and schema design.
- Hands-on experience with Redis caching, Kafka event streaming, and Docker.
- Cloud architecture on AWS (EC2, S3, RDS).
- Familiarity with CI/CD automation and writing unit & integration tests.`
  },
  {
    id: 'nk-fs-2',
    portal: 'Naukri',
    portalBadge: 'Naukri.com',
    portalColor: '#0078DB',
    title: 'Lead Full Stack Developer (MERN / Cloud)',
    company: 'Tata Consultancy Services (TCS Digital)',
    companyLogo: '🌐',
    location: 'Pune / Mumbai (Hybrid)',
    city: 'Pune',
    targetRole: 'Full Stack Developer',
    experience: '4-7 Yrs',
    salary: '₹18 - ₹28 LPA',
    posted: 'Just now',
    applicants: '32 applicants',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'REST', 'Express'],
    applyUrl: 'https://www.naukri.com/full-stack-developer-jobs?k=Full+Stack+Developer+React+Node.js&l=Pune',
    description: `TCS Digital is hiring a Lead Full Stack Developer for enterprise digital transformation projects.
Key Skills:
- React.js, Redux, Node.js, Express, and JavaScript/TypeScript.
- Database expertise in MongoDB and PostgreSQL.
- Cloud deployment on AWS and containerization with Docker.
- RESTful microservices architecture and automated testing.`
  },
  {
    id: 'li-fs-3',
    portal: 'LinkedIn',
    portalBadge: 'LinkedIn Jobs',
    portalColor: '#0A66C2',
    title: 'Full Stack Developer (Next.js & Serverless)',
    company: 'CRED',
    companyLogo: '💎',
    location: 'Bengaluru, India (Onsite)',
    city: 'Bengaluru',
    targetRole: 'Full Stack Developer',
    experience: '2-5 Yrs',
    salary: '₹25 - ₹42 LPA',
    posted: '2 days ago',
    applicants: '95 applicants',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Microservices'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=CRED+Full+Stack+Developer&location=Bengaluru',
    description: `CRED is looking for high-ownership Full Stack Developers to craft ultra-fast, visually stunning fintech experiences.
Requirements:
- Mastery of Next.js, React, and TypeScript.
- Strong server-side engineering in Node.js or Go.
- High-concurrency database design using PostgreSQL and Redis.
- Passion for 60fps UI performance, accessibility, and microservices.`
  },

  // Frontend Roles
  {
    id: 'li-fe-1',
    portal: 'LinkedIn',
    portalBadge: 'LinkedIn Jobs',
    portalColor: '#0A66C2',
    title: 'Frontend Engineer (React / Next.js)',
    company: 'Swiggy',
    companyLogo: '🍔',
    location: 'Bengaluru, India (Hybrid)',
    city: 'Bengaluru',
    targetRole: 'Frontend Engineer',
    experience: '2-5 Yrs',
    salary: '₹20 - ₹35 LPA',
    posted: '3 days ago',
    applicants: '64 applicants',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Jest', 'HTML5', 'CSS3'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Swiggy+Frontend+Engineer&location=Bengaluru',
    description: `Swiggy is seeking a Frontend Engineer to build consumer-facing food & grocery ordering platforms.
Requirements:
- Advanced proficiency in React.js, Next.js, and TypeScript.
- State management with Redux Toolkit or Zustand.
- Responsive styling using Tailwind CSS, HTML5, and modern CSS3.
- Web performance optimization (Core Web Vitals, SSR, bundling with Vite/Webpack).`
  },
  {
    id: 'nk-fe-2',
    portal: 'Naukri',
    portalBadge: 'Naukri.com',
    portalColor: '#0078DB',
    title: 'Senior Frontend Developer (UI/UX Engineering)',
    company: 'Infosys Limited',
    companyLogo: '🔷',
    location: 'Hyderabad / Chennai (Remote Option)',
    city: 'Hyderabad',
    targetRole: 'Frontend Engineer',
    experience: '3-6 Yrs',
    salary: '₹14 - ₹24 LPA',
    posted: '1 day ago',
    applicants: '52 applicants',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'REST', 'Git', 'Jest'],
    applyUrl: 'https://www.naukri.com/frontend-engineer-jobs?k=Frontend+Developer+React&l=Hyderabad',
    description: `Infosys is hiring Senior Frontend Engineers to develop modern client portals.
Key Requirements:
- Strong command of React, JavaScript ES6+, HTML5, and CSS3.
- Experience with REST API integration and asynchronous flows.
- Unit testing with Jest and version control with Git.
- Cross-browser compatibility and responsive UI implementation.`
  },

  // Backend Roles
  {
    id: 'li-be-1',
    portal: 'LinkedIn',
    portalBadge: 'LinkedIn Jobs',
    portalColor: '#0A66C2',
    title: 'Backend Systems Engineer (High Scale)',
    company: 'PhonePe',
    companyLogo: '📱',
    location: 'Bengaluru, India (Hybrid)',
    city: 'Bengaluru',
    targetRole: 'Backend Engineer',
    experience: '3-6 Yrs',
    salary: '₹24 - ₹40 LPA',
    posted: '1 day ago',
    applicants: '72 applicants',
    requiredSkills: ['Node.js', 'Java', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Microservices', 'REST'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=PhonePe+Backend+Engineer&location=Bengaluru',
    description: `PhonePe is hiring Backend Engineers to build distributed payment switches handling 100M+ transactions daily.
Requirements:
- Deep expertise in Node.js or Java backend architectures.
- High-throughput transaction handling with PostgreSQL and Redis.
- Event-driven microservices with Kafka.
- Containerized workloads using Docker and Kubernetes.`
  },
  {
    id: 'nk-be-2',
    portal: 'Naukri',
    portalBadge: 'Naukri.com',
    portalColor: '#0078DB',
    title: 'Lead Backend Developer (Node.js & Microservices)',
    company: 'Wipro Digital',
    companyLogo: '🏢',
    location: 'Noida / Delhi NCR (Hybrid)',
    city: 'Delhi NCR',
    targetRole: 'Backend Engineer',
    experience: '4-8 Yrs',
    salary: '₹18 - ₹30 LPA',
    posted: '2 days ago',
    applicants: '41 applicants',
    requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'REST', 'CI/CD'],
    applyUrl: 'https://www.naukri.com/backend-engineer-jobs?k=Backend+Developer+Node.js&l=Delhi+NCR',
    description: `Wipro Digital is seeking a Lead Backend Developer in Delhi NCR / Noida.
Responsibilities:
- Build robust microservices with Node.js, Express, and TypeScript.
- Implement database architectures in PostgreSQL and MongoDB.
- Containerize services with Docker and deploy to AWS.
- Implement secure JWT/OAuth authentication and API gateways.`
  },

  // DevOps & Cloud
  {
    id: 'li-do-1',
    portal: 'LinkedIn',
    portalBadge: 'LinkedIn Jobs',
    portalColor: '#0A66C2',
    title: 'DevOps & Site Reliability Engineer',
    company: 'Zomato',
    companyLogo: '🚀',
    location: 'Gurugram, India (Hybrid)',
    city: 'Delhi NCR',
    targetRole: 'DevOps & Cloud Engineer',
    experience: '3-6 Yrs',
    salary: '₹22 - ₹36 LPA',
    posted: 'Just now',
    applicants: '38 applicants',
    requiredSkills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Git', 'Prometheus'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Zomato+DevOps+Engineer&location=Gurugram',
    description: `Zomato is hiring a DevOps & SRE Engineer to manage massive cloud infrastructure for hyper-scale food delivery.
Key Requirements:
- Production Kubernetes (EKS/GKE) and Docker container management.
- Infrastructure as Code (IaC) with Terraform.
- CI/CD automation with GitHub Actions and Jenkins.
- Cloud monitoring with Prometheus, Grafana, and CloudWatch.`
  },
  {
    id: 'nk-do-2',
    portal: 'Naukri',
    portalBadge: 'Naukri.com',
    portalColor: '#0078DB',
    title: 'Cloud Infrastructure Specialist (AWS / Azure)',
    company: 'HCL Technologies',
    companyLogo: '☁️',
    location: 'Bengaluru / Remote',
    city: 'Bengaluru',
    targetRole: 'DevOps & Cloud Engineer',
    experience: '3-7 Yrs',
    salary: '₹16 - ₹26 LPA',
    posted: '2 days ago',
    applicants: '60 applicants',
    requiredSkills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform'],
    applyUrl: 'https://www.naukri.com/devops-cloud-engineer-jobs?k=DevOps+AWS+Kubernetes&l=Bengaluru',
    description: `HCL is hiring Cloud Infrastructure Specialists for enterprise cloud migrations.
Skills Required:
- AWS and Azure cloud administration.
- Docker containers and Kubernetes cluster deployments.
- Linux system administration, shell scripting, and network security.
- CI/CD pipeline automation and Git workflows.`
  },

  // Data Science & ML
  {
    id: 'li-ds-1',
    portal: 'LinkedIn',
    portalBadge: 'LinkedIn Jobs',
    portalColor: '#0A66C2',
    title: 'Data Scientist / Machine Learning Engineer',
    company: 'Flipkart',
    companyLogo: '🛍️',
    location: 'Bengaluru, India (Hybrid)',
    city: 'Bengaluru',
    targetRole: 'Data Scientist & ML',
    experience: '2-5 Yrs',
    salary: '₹24 - ₹42 LPA',
    posted: '3 days ago',
    applicants: '88 applicants',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'PyTorch', 'TensorFlow', 'Pandas', 'Docker'],
    applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=Flipkart+Data+Scientist&location=Bengaluru',
    description: `Flipkart is looking for ML Engineers to build personalized recommendation engines and search ranking algorithms.
Requirements:
- Python programming with Pandas, NumPy, and Scikit-learn.
- Deep Learning frameworks (PyTorch or TensorFlow).
- SQL and data warehousing for large datasets.
- Production model deployment with Docker and REST/FastAPI endpoints.`
  },
  {
    id: 'nk-ds-2',
    portal: 'Naukri',
    portalBadge: 'Naukri.com',
    portalColor: '#0078DB',
    title: 'Senior AI / Data Analyst & Modeler',
    company: 'Accenture India',
    companyLogo: '📊',
    location: 'Gurugram / Bengaluru',
    city: 'Delhi NCR',
    targetRole: 'Data Scientist & ML',
    experience: '3-7 Yrs',
    salary: '₹15 - ₹28 LPA',
    posted: '1 day ago',
    applicants: '49 applicants',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'FastAPI', 'Git'],
    applyUrl: 'https://www.naukri.com/data-scientist-jobs?k=Data+Scientist+Python+Machine+Learning&l=Gurugram',
    description: `Accenture is seeking Data Scientists for predictive analytics solutions.
Skills:
- Strong Python and SQL competencies.
- Statistical modeling, regression, classification, and clustering.
- Data visualization and model operationalization.`
  }
];

