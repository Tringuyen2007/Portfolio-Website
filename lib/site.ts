export const siteConfig = {
  name: "Tri Nguyen",
  title: "Tri Nguyen | AI, Data Science, and Product-Minded Engineering",
  description:
    "A calm, modern portfolio for Tri Nguyen, a UT San Antonio computer science student focused on AI, data science, and thoughtful software.",
  role: "Computer Science student at UT San Antonio",
  focus: "AI, data science, and product-minded engineering",
  school: "University of Texas at San Antonio",
  githubUrl: "https://github.com/Tringuyen2007",
  githubHandle: "@Tringuyen2007",
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
    { label: "Overview", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
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
