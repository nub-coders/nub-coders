import type { Project } from "./types";

export const projects: Project[] = [
  {
    idx: "001",
    name: "Halvo",
    desc: "Application deployment platform with GitHub integration, live updates, cyberpunk terminal UI, and real-time container management to help ship apps faster.",
    tags: ["TypeScript", "Docker", "Node.js", "React"],
    liveUrl: "https://halvo.nubcoders.com",
    signature: "terminal",
  },
  {
    idx: "002",
    name: "NubMail",
    desc: "Self-hosted email management system with API-based sending, domain tooling, IMAP/SMTP/POP3 support, and automated SSL via DNS-01 wildcard certs.",
    tags: ["Docker", "Nginx", "Cloudflare", "SMTP", "Self-hosted"],
    liveUrl: "https://mails.nubcoders.com",
    signature: "mail",
  },
  {
    idx: "003",
    name: "Nub Music Bot",
    desc: "Open-source Telegram music bot built with Pyrogram and pytgcalls. Plays audio in group voice chats with queue management and streaming support.",
    tags: ["Python", "Pyrogram", "pytgcalls", "Telegram", "Open Source"],
    liveUrl: "https://t.me/nub_coder_s",
    codeUrl: "https://github.com/nub-coders/nub-music-bot",
    signature: "audio",
  },
  {
    idx: "004",
    name: "YT-DLP API",
    desc: "High-performance media extraction API with token-based auth, rate limiting, and production-grade nginx-proxy and SSL automation for containerized deployments.",
    tags: ["Python", "yt-dlp", "Docker", "Nginx", "REST API"],
    liveUrl: "https://api.nubcoders.com",
    signature: "download",
  },
];
