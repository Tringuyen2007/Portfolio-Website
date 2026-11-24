export type ExperienceKind = "professional" | "leadership" | "academic";

export type ExperienceEntry = {
  id: string;
  organization: string;
  role: string;
  kind: ExperienceKind;
  start: string;
  end: string | "Present";
  location: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
  links?: { label: string; href: string }[];
  images?: { src: string; alt: string }[];
};

/**
 * Experience entries power the Experience page and the homepage preview.
 * Newest first. Only verified information belongs here.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "mlh-coach",
    organization: "Major League Hacking",
    role: "Major League Hacking Coach",
    kind: "leadership",
    start: "November 2026",
    end: "Present",
    location: "Arlington, TX",
    summary:
      "On-the-ground coach for the official student hackathon league: mentoring builders, running MLH's sponsor challenges, and helping first-time hackers ship at HackUTA.",
    responsibilities: [
      "Mentored 100+ hackers at HackUTA, helping teams scope ideas, debug across their stacks, and ship working demos before the submission deadline.",
      "Ran the MLH table and sponsor challenge tracks (Solana, Tiger Data, DEV), guiding teams on prize requirements and integrations.",
      "Led hands-on workshops and mini-events that gave beginners a low-pressure way into building.",
      "Supported judging and prize submissions, making sure teams met MLH challenge criteria and submitted on time.",
      "Onboarded first-time hackers through team formation, tooling setup, and their first project pitch.",
    ],
    technologies: [],
    achievements: ["Mentored 100+ hackers at HackUTA."],
    images: [
      { src: "/images/projects/mlh-coach/1.jpg", alt: "Tri and two fellow coaches at the Major League Hacking table at HackUTA" },
      { src: "/images/projects/mlh-coach/2.jpg", alt: "The MLH coaching crew in laurel crowns and MLH shirts" },
      { src: "/images/projects/mlh-coach/3.jpg", alt: "The coaching team at dinner during HackUTA weekend" },
    ],
  },
  {
    id: "better-future-institute",
    organization: "Better Future Institute",
    role: "Software Engineer Intern",
    kind: "professional",
    start: "September 2026",
    end: "Present",
    location: "San Antonio, TX",
    summary:
      "Front-end redevelopment and back-end refactoring on the BUFFI system, plus the data pipelines and client-driven features around it.",
    responsibilities: [
      "Redeveloped the front-end and refactored back-end code for the BUFFI system in a fast-paced environment, improving code quality and maintainability for company-facing clients.",
      "Built data pipelines to gather and process client data, and implemented new features based on client requirements to support evolving business needs.",
    ],
    technologies: [],
  },
  {
    id: "vorpex",
    organization: "Vorpex",
    role: "Software Developer",
    kind: "professional",
    start: "May 2026",
    end: "August 2026",
    location: "San Antonio, TX",
    summary:
      "Built and shipped Vorpex's marketing site end to end, from the static Next.js build to the booking, email, and analytics integrations behind it.",
    responsibilities: [
      "Built and deployed a high-performance marketing website using Next.js 14 App Router and Tailwind CSS.",
      "Integrated Cal.com booking, Resend transactional email, and Plausible Analytics into a static Next.js site.",
      "Implemented custom API routes with rate limiting and honeypot spam protection.",
    ],
    technologies: ["Next.js", "Tailwind CSS", "Cal.com", "Resend", "Plausible Analytics"],
  },
  {
    id: "cooledtured",
    organization: "CooledTured LLC",
    role: "Software Engineer Intern",
    kind: "professional",
    start: "April 2026",
    end: "August 2026",
    location: "Bensenville, IL",
    summary:
      "Full-stack and infrastructure work on a tournament platform: authentication, cloud deployment, and the data pipelines underneath it.",
    responsibilities: [
      "Built authentication systems, cloud deployment infrastructure, and data management pipelines using AWS, Kubernetes, and Docker.",
      "Developed full-stack features for player registration, tournament organization, match reporting, and store management.",
    ],
    technologies: ["AWS", "Kubernetes", "Docker", "Next.js", "TypeScript", "Flask"],
  },
  {
    id: "acm-utsa",
    organization: "Association for Computing Machinery at UTSA",
    role: "Secretary",
    kind: "leadership",
    start: "October 2025",
    end: "Present",
    location: "San Antonio, TX",
    summary:
      "Keeping one of UTSA's largest student organizations running: logistics, planning, and coordination for events serving thousands of students.",
    responsibilities: [
      "Coordinated event logistics including room bookings, inventory management, and organizational planning for ACM events.",
      "Collaborated closely with the President and Vice President to ensure smooth operations and execution of ACM initiatives.",
    ],
    technologies: [],
    achievements: ["Supported initiatives and events serving 2000+ student members."],
  },
];

export const skillGroups = [
  { label: "Languages", skills: ["Python", "TypeScript", "JavaScript", "Swift"] },
  { label: "AI / ML", skills: ["Computer Vision", "OpenVINO", "XGBoost", "RAG", "Multi-Agent AI"] },
  { label: "Full-Stack", skills: ["Next.js", "React", "FastAPI", "Flask", "PostgreSQL", "Drizzle ORM"] },
  { label: "Cloud & Infra", skills: ["AWS", "Kubernetes", "Docker", "Vultr"] },
  { label: "Web Tools", skills: ["Tailwind CSS", "Cal.com", "Resend", "Plausible Analytics"] },
];
