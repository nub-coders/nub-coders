export type Principle = { num: string; title: string; body: string };

export type Project = {
  idx: string;
  name: string;
  desc: string;
  tags: string[];
  liveUrl: string;
  codeUrl?: string;
};

export type FocusCard = { icon: string; title: string; body: string };

export type TechLink = { label: string; href: string };

export type TechCategory = { title: string; pills: string[] };

export type ContactLink = { label: string; value: string; href: string };
