export type Principle = { num: string; title: string; body: string };

export type ProjectSignature = "terminal" | "mail" | "audio" | "download";

export type Project = {
  idx: string;
  name: string;
  desc: string;
  tags: string[];
  liveUrl: string;
  codeUrl?: string;
  /** Decorative per-card motif rendered in the title row + card entrance. */
  signature?: ProjectSignature;
};

export type FocusCard = { icon: string; title: string; body: string };

export type TechLink = { label: string; href: string };

export type TechCategory = { title: string; pills: string[] };

export type ContactLink = { label: string; value: string; href: string };
