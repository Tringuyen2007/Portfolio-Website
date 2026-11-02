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
