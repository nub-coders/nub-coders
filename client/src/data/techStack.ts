import type { TechCategory, TechLink } from "./types";

export const techCategories: TechCategory[] = [
  { title: "Frontend", pills: ["TypeScript", "React", "Tailwind", "HTML5", "JavaScript"] },
  { title: "Backend", pills: ["Node.js", "Express", "Python", "REST APIs"] },
  { title: "Database", pills: ["PostgreSQL", "Redis"] },
  { title: "DevOps", pills: ["Docker", "GitHub Actions", "Nginx", "Shell", "Linux"] },
];

export const techLinks: Record<string, TechLink> = {
  TypeScript: { label: "TypeScript", href: "https://www.typescriptlang.org/" },
  React: { label: "React", href: "https://react.dev/" },
  Tailwind: { label: "Tailwind CSS", href: "https://tailwindcss.com/" },
  HTML5: { label: "HTML", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  JavaScript: { label: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  "Node.js": { label: "Node.js", href: "https://nodejs.org/" },
  Express: { label: "Express", href: "https://expressjs.com/" },
  Python: { label: "Python", href: "https://www.python.org/" },
  "REST APIs": { label: "REST", href: "https://developer.mozilla.org/en-US/docs/Glossary/REST" },
  PostgreSQL: { label: "PostgreSQL", href: "https://www.postgresql.org/" },
  Redis: { label: "Redis", href: "https://redis.io/" },
  Docker: { label: "Docker", href: "https://www.docker.com/" },
  "GitHub Actions": { label: "GitHub Actions", href: "https://github.com/features/actions" },
  Nginx: { label: "NGINX", href: "https://nginx.org/" },
  Shell: { label: "Bash", href: "https://www.gnu.org/software/bash/" },
  Linux: { label: "Linux", href: "https://www.kernel.org/" },
  Cloudflare: { label: "Cloudflare", href: "https://www.cloudflare.com/" },
  SMTP: { label: "SMTP", href: "https://www.rfc-editor.org/rfc/rfc5321" },
  Pyrogram: { label: "Pyrogram", href: "https://docs.pyrogram.org/" },
  pytgcalls: { label: "pytgcalls", href: "https://pytgcalls.io/" },
  Telegram: { label: "Telegram", href: "https://telegram.org/" },
  "Open Source": { label: "Open Source", href: "https://opensource.org/" },
  "yt-dlp": { label: "yt-dlp", href: "https://github.com/yt-dlp/yt-dlp" },
  "REST API": { label: "REST", href: "https://developer.mozilla.org/en-US/docs/Glossary/REST" },
  "Self-hosted": { label: "Self-hosted", href: "https://selfhosted.org/" },
};

export const getTechLink = (label: string): TechLink | null => techLinks[label] ?? null;
