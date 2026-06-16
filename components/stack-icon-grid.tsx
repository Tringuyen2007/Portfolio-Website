import {
  Brain,
  Trophy,
  BarChart2,
  Eye,
  Database,
  Sparkles,
  Layers,
  Building2,
  TrendingUp,
  Cpu,
  FileText,
  Wind,
  Code2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const DEVICON_MAP: Record<string, string> = {
  python: "python",
  react: "react",
  "next.js": "nextjs",
  typescript: "typescript",
  javascript: "javascript",
  css: "css3",
  flask: "flask",
};

const LUCIDE_MAP: Record<string, LucideIcon> = {
  ai: Brain,
  hackathon: Trophy,
  "data science": BarChart2,
  "computer vision": Eye,
  rag: Database,
  "google gemini": Sparkles,
  "full-stack": Layers,
  "structural analysis": Building2,
  xgboost: TrendingUp,
  openvino: Cpu,
  mdx: FileText,
  "tailwind css": Wind,
};

function StackIcon({ label }: { label: string }) {
  const key = label.toLowerCase();
  const deviconSlug = DEVICON_MAP[key];

  if (deviconSlug) {
    return (
      <img
        alt={label}
        className="size-10"
        height={40}
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconSlug}/${deviconSlug}-original.svg`}
        width={40}
      />
    );
  }

  const LucideIcon = LUCIDE_MAP[key];
  if (LucideIcon) {
    return <LucideIcon className="size-10 text-text-secondary" />;
  }

  return <Code2 className="size-10 text-text-muted" />;
}

export function StackIconGrid({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-6 rounded-xl border border-border bg-bg-elevated px-6 py-8">
      {stack.map((item) => (
        <div key={item} className="flex flex-col items-center gap-2">
          <StackIcon label={item} />
          <span className="text-xs text-text-muted">{item}</span>
        </div>
      ))}
    </div>
  );
}
