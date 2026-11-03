export const siteConfig = {
  name: "Tri Nguyen",
  title: "Tri Nguyen | A Living Portfolio",
  description:
    "The living portfolio of Tri Nguyen, a UT San Antonio computer science student building AI, computer vision, and full-stack projects. Explore a growing tree of projects, hackathons, and achievements.",
  resumePath: "/Tri_technical_resume.pdf",
  role: "Computer Science student at UT San Antonio",
  focus: "AI, data science, and product-minded engineering",
  school: "University of Texas at San Antonio",
  githubUrl: "https://github.com/Tringuyen2007",
  githubHandle: "@Tringuyen2007",
  linkedinUrl: "https://www.linkedin.com/in/tri-nguyen2/",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  skills: [
    "Python",
    "Flask",
    "Computer Vision",
    "TypeScript",
    "Next.js",
    "Data Science",
  ],
  navItems: [
    { label: "Home", href: "/" },
    { label: "Experience", href: "/experience" },
    { label: "Projects & Events", href: "/projects" },
    { label: "Contact & Resume", href: "/contact" },
  ],
} as const;

export function getBaseUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!siteUrl) {
    return "http://localhost:3000";
  }

  return siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
}

export function absoluteUrl(path = "/") {
  return new URL(path, getBaseUrl()).toString();
}

export const buildTimestamp = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
}).format(new Date());
