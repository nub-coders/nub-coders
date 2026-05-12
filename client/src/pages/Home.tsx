import { useEffect, useState } from "react";
import "./portfolio.css";
import { useGitHubStats } from "@/hooks/useGitHubStats";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Principle = { num: string; title: string; body: string };
type Project = {
  idx: string;
  name: string;
  desc: string;
  tags: string[];
  liveUrl: string;
  codeUrl?: string;
};
type FocusCard = { icon: string; title: string; body: string };

const initialFormState: ContactFormState = { name: "", email: "", subject: "", message: "" };

const principles: Principle[] = [
  { num: "01", title: "Clarity over cleverness", body: "Readable, predictable code always beats a clever hack." },
  { num: "02", title: "Ship fast, then harden", body: "Get it out, collect feedback, iterate with discipline." },
  { num: "03", title: "Build for maintenance", body: "Future you is a different person. Be kind to them." },
  { num: "04", title: "Communicate early", body: "Document decisions, flag blockers, keep ownership clear." },
];

const techCategories = [
  { title: "Frontend", pills: ["TypeScript", "React", "Next.js", "Tailwind", "HTML5", "JavaScript"] },
  { title: "Backend", pills: ["Node.js", "Express", "Python", "Django", "REST APIs"] },
  { title: "Database", pills: ["PostgreSQL", "MongoDB", "Redis", "Drizzle ORM"] },
  { title: "DevOps", pills: ["Docker", "AWS", "GitHub Actions", "Nginx", "Shell", "Linux"] },
];

const projects: Project[] = [
  { idx: "001", name: "Deplio", desc: "Application deployment platform with GitHub integration, live updates, cyberpunk terminal UI, and real-time container management to help ship apps faster.", tags: ["TypeScript", "Docker", "Node.js", "React"], liveUrl: "https://app.nubcoder.com" },
  { idx: "002", name: "NubMail", desc: "Self-hosted email management system with API-based sending, domain tooling, IMAP/SMTP/POP3 support, and automated SSL via DNS-01 wildcard certs.", tags: ["Docker", "Nginx", "Cloudflare", "SMTP", "Self-hosted"], liveUrl: "https://mails.nubcoder.com" },
  { idx: "003", name: "Nub Music Bot", desc: "Open-source Telegram music bot built with Pyrogram and pytgcalls. Plays audio in group voice chats with queue management and streaming support.", tags: ["Python", "Pyrogram", "pytgcalls", "Telegram", "Open Source"], liveUrl: "https://t.me/nub_coder_s", codeUrl: "https://github.com/nub-coders/nub-music-bot" },
  { idx: "004", name: "YT-DLP API", desc: "High-performance media extraction API with token-based auth, rate limiting, and production-grade nginx-proxy and SSL automation for containerized deployments.", tags: ["Python", "yt-dlp", "Docker", "Nginx", "REST API"], liveUrl: "https://api.nubcoder.com" },
];

const focusCards: FocusCard[] = [
  { icon: "⚙️", title: "Developer Tooling", body: "Building internal tools and CLI utilities that eliminate repetitive work and speed up the development loop." },
  { icon: "🛡️", title: "Reliability Patterns", body: "Designing better fault-tolerance, observability, and recovery patterns for production containerized systems." },
  { icon: "🧪", title: "Testing Discipline", body: "Improving test coverage and CI discipline in fast-moving projects without slowing down the shipping cadence." },
];

const contactLinks = [
  { label: "Email", value: "dev@nubcoder.com", href: "mailto:dev@nubcoder.com" },
  { label: "GitHub", value: "github.com/nub-coders", href: "https://github.com/nub-coders" },
  { label: "Telegram", value: "@nub_coder_s", href: "https://t.me/nub_coder_s" },
  { label: "YouTube", value: "@nub-coder", href: "https://youtube.com/@nub-coder" },
];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 496 512" aria-hidden="true" focusable="false">
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
    </svg>
  );
}

function GitHubStatsSection() {
  const { data, isLoading, isError } = useGitHubStats();

  const getLanguageHref = (language: string) =>
    `https://github.com/search?q=${encodeURIComponent(`language:${language}`)}&type=repositories`;

  return (
    <>
      <div className="stats-grid reveal">
        <div className="stats-card">
          {isLoading ? (
            <div className="skeleton h-24" />
          ) : data ? (
            <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="gh-profile-link">
              <img src={data.avatarUrl} alt={`${data.username} avatar`} className="gh-avatar" />
              <div className="gh-profile-meta">
                <div className="gh-name">{data.name ?? data.username}</div>
                <div className="gh-username">@{data.username}</div>
              </div>
            </a>
          ) : (
            <div className="gh-error">Failed to load GitHub stats.</div>
          )}
        </div>

        <div className="stats-card">
          {isLoading ? (
            <div className="skeleton h-24" />
          ) : data ? (
            <div className="top-langs">
              {data.topLanguages.slice(0, 6).map((l) => (
                <a
                  key={l.name}
                  href={getLanguageHref(l.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lang-item lang-link"
                  aria-label={`Open GitHub search for ${l.name}`}
                >
                  <span className="lang-name">{l.name}</span>
                  <span className="lang-pct">{l.percentage}%</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="gh-error">Failed to load languages.</div>
          )}
        </div>
      </div>

      <div className="stats-row reveal">
        <div className="stat-box"><span className="stat-box-num">{data ? data.totalStars : "—"}</span><span className="stat-box-label">⭐ Stars</span></div>
        <div className="stat-box"><span className="stat-box-num">{data ? data.totalCommits : "—"}</span><span className="stat-box-label">🔥 Commits</span></div>
        <div className="stat-box"><span className="stat-box-num">{data ? data.prsMerged : "—"}</span><span className="stat-box-label">✅ PRs Merged</span></div>
        <div className="stat-box"><span className="stat-box-num">{data ? data.issuesOpen : "—"}</span><span className="stat-box-label">🐞 Open Issues</span></div>
      </div>
    </>
  );
}

export default function Home() {
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add("portfolio-skin");

    const nav = document.getElementById("nav");
    const handleScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 40);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            window.setTimeout(() => entry.target.classList.add("visible"), index * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll<HTMLElement>(".reveal").forEach((element) => observer.observe(element));
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.body.classList.remove("portfolio-skin");
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setShowSuccess(false);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const result = await response.json().catch(() => ({} as { success?: boolean; error?: string }));

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Request failed");
      }

      setFormData(initialFormState);
      setShowSuccess(true);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Failed to send message.";
      setSubmitError(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <nav id="nav">
        <a href="#" className="nav-logo">nub-coders</a>
        <ul className="nav-links">
          <li><a href="#about">about</a></li>
          <li><a href="#tech">stack</a></li>
          <li><a href="#work">work</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
      </nav>

      <div className="hero">
        <div className="hero-tag">Full Stack Developer · nubcoder.com</div>
        <h1 className="hero-name">Ankit<br /><em>Kumar</em></h1>
        <div className="hero-bottom">
          <p className="hero-desc">
            I build products that solve real problems and stay maintainable as they grow. Full-stack systems across infrastructure, automation, APIs, and SaaS workflows — shipped clean, built to last.
          </p>
          <div className="hero-stats">
            <div className="stat-item"><span className="stat-num">4+</span><span className="stat-label">Years exp</span></div>
            <div className="stat-item"><span className="stat-num">10+</span><span className="stat-label">Projects</span></div>
            <div className="stat-item"><span className="stat-num">∞</span><span className="stat-label">Docker containers</span></div>
          </div>
        </div>
        <div className="scroll-indicator"><div className="scroll-line" /></div>
      </div>

      <div className="divider" />

      <section id="about">
        <div className="section-head reveal"><span className="section-num">01</span><div className="section-line" /><h2 className="section-title">About</h2></div>
        <div className="about-grid">
          <div className="reveal">
            <p className="about-text">
              I&apos;m a <strong>full-stack developer</strong> with a strong backend and systems focus, currently studying Mechanical Engineering while running <strong>Nub Coder</strong> — my software venture building tools, infrastructure, and products that actually matter.
              <br /><br />
              I enjoy turning rough ideas into <strong>production-ready systems</strong>, especially when the challenge involves reliability, clean architecture, and developer experience. Self-hosted infra is my playground.
              <br /><br />
              When I&apos;m not shipping code, I&apos;m sharing what I learn on YouTube and open-sourcing things that might help other developers move faster.
            </p>
          </div>
          <div className="principles reveal">
            {principles.map((principle) => (
              <div key={principle.num} className="principle">
                <span className="principle-num">{principle.num}</span>
                <p className="principle-text"><strong>{principle.title}</strong> — {principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section id="tech">
        <div className="section-head reveal"><span className="section-num">02</span><div className="section-line" /><h2 className="section-title">Stack</h2></div>
        <div className="tech-categories reveal">
          {techCategories.map((category) => (
            <div key={category.title} className="tech-category">
              <h3>{category.title}</h3>
              <div className="tech-pills">{category.pills.map((pill) => <span key={pill} className="pill">{pill}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section id="work">
        <div className="section-head reveal"><span className="section-num">03</span><div className="section-line" /><h2 className="section-title">Selected Work</h2></div>
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.idx} className="project-item reveal">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-live-link"
                aria-label={`Open ${project.name} live app`}
              />
              <span className="project-idx">{project.idx}</span>
              <div className="project-content">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tags">{project.tags.map((tag) => <span key={tag} className="project-tag">{tag}</span>)}</div>
              </div>
              <div className="project-actions">
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-code-link"
                    aria-label={`Open ${project.name} source code`}
                    title="Source code"
                  >
                    <GitHubIcon />
                  </a>
                )}
                <span className="project-arrow">↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section>
        <div className="section-head reveal"><span className="section-num">04</span><div className="section-line" /><h2 className="section-title">Now</h2></div>
        <div className="focus-grid">
          {focusCards.map((card) => (
            <div key={card.title} className="focus-card reveal">
              <div className="focus-icon">{card.icon}</div>
              <h3 className="focus-title">{card.title}</h3>
              <p className="focus-body">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section id="stats">
        <div className="section-head reveal"><span className="section-num">05</span><div className="section-line" /><h2 className="section-title">GitHub Stats</h2></div>
        <GitHubStatsSection />
      </section>

      <div className="divider" />

      <section id="contact">
        <div className="section-head reveal"><span className="section-num">06</span><div className="section-line" /><h2 className="section-title">Contact</h2></div>
        <div className="contact-new">
          <div className="reveal">
            <h2 className="contact-headline">Let&apos;s build<br />something<br /><em>real.</em></h2>
            <p className="contact-sub" style={{ marginBottom: "2rem" }}>Open to freelance projects, collaborations, and interesting problems. Fill the form or reach out directly — I reply fast.</p>
            <div className="links-list">
              {contactLinks.map((link) => (
                <a key={link.label} href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"} className="contact-link">
                  <div className="contact-link-left"><span className="contact-link-label">{link.label}</span><span className="contact-link-value">{link.value}</span></div>
                  <span className="contact-link-arrow">↗</span>
                </a>
              ))}
            </div>
          </div>
          <div className="reveal">
            <form id="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group"><label className="form-label" htmlFor="cf-name">Name</label><input className="form-input" type="text" id="cf-name" name="name" placeholder="Your name" required autoComplete="name" value={formData.name} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label" htmlFor="cf-email">Email</label><input className="form-input" type="email" id="cf-email" name="email" placeholder="you@example.com" required autoComplete="email" value={formData.email} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label" htmlFor="cf-subject">Subject</label><input className="form-input" type="text" id="cf-subject" name="subject" placeholder="Project idea, collab, anything..." value={formData.subject} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label" htmlFor="cf-msg">Message</label><textarea className="form-textarea" id="cf-msg" name="message" placeholder="Tell me what you're working on..." required value={formData.message} onChange={handleChange} /></div>
              <button type="submit" className={`form-btn ${isSubmitting ? "sending" : ""}`} id="cf-btn" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send Message →"}</button>
              <div className="form-success" id="cf-success" style={{ display: showSuccess ? "block" : "none" }}>✓ Message sent — I&apos;ll get back to you soon.</div>
              {submitError && <div className="form-error" role="alert">{submitError}</div>}
            </form>
          </div>
        </div>
      </section>

      <footer>
        <a href="#" className="footer-logo">nub-coders</a>
        <span className="footer-copy">© 2025 Ankit Kumar · nubcoder.com</span>
      </footer>
    </>
  );
}