import { contactLinks } from "@/data/contactLinks";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yearRange = `2023–${currentYear}`;

  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div className="footer-brand">
          <a href="#main" className="footer-logo" aria-label="Back to top">nub-coders</a>
          <p className="footer-blurb">Full-stack developer building infrastructure, automation, and SaaS workflows — shipped clean, built to last.</p>
        </div>

        <nav className="footer-col" aria-label="Connect">
          <h3 className="footer-col-title">Connect</h3>
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="footer-link"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">© {yearRange} Ankit Kumar · nubcoders.com</span>
      </div>
    </footer>
  );
}
