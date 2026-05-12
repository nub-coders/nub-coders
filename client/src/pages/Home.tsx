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
type Project = { idx: string; name: string; desc: string; tags: string[] };
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
  { idx: "001", name: "Docker PaaS", desc: "Container deployment and monitoring platform built as a Telegram Mini App. GitHub integration, live updates, cyberpunk terminal UI, and real-time container management.", tags: ["TypeScript", "Docker", "Telegram Mini App", "Node.js", "React"] },
  { idx: "002", name: "NubMail", desc: "Self-hosted email management system with API-based sending, domain tooling, IMAP/SMTP/POP3 support, and automated SSL via DNS-01 wildcard certs.", tags: ["Docker", "Nginx", "Cloudflare", "SMTP", "Self-hosted"] },
  { idx: "003", name: "Nub Music Bot", desc: "Open-source Telegram music bot built with Pyrogram and pytgcalls. Plays audio in group voice chats with queue management and streaming support.", tags: ["Python", "Pyrogram", "pytgcalls", "Telegram", "Open Source"] },
  { idx: "004", name: "YT-DLP API", desc: "High-performance media extraction API with token-based auth, rate limiting, and production-grade nginx-proxy and SSL automation for containerized deployments.", tags: ["Python", "yt-dlp", "Docker", "Nginx", "REST API"] },
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

function GitHubStatsSection() {
  const { data, isLoading, isError } = useGitHubStats();

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
                <div key={l.name} className="lang-item">
                  <span className="lang-name">{l.name}</span>
                  <span className="lang-pct">{l.percentage}%</span>
                </div>
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

    try {
      const response = await fetch("https://formspree.io/f/mkoyyqrg", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!response.ok) throw new Error("Request failed");

      setFormData(initialFormState);
      setShowSuccess(true);
    } catch {
      const fallbackSubject = encodeURIComponent(subject || "Portfolio contact");
      const fallbackBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:dev@nubcoder.com?subject=${fallbackSubject}&body=${fallbackBody}`;
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
            <div className="stat-item"><span className="stat-num">35+</span><span className="stat-label">Projects</span></div>
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
              <span className="project-idx">{project.idx}</span>
              <div className="project-content">
                <h3 className="project-name">{project.name}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tags">{project.tags.map((tag) => <span key={tag} className="project-tag">{tag}</span>)}</div>
              </div>
              <span className="project-arrow">↗</span>
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