import { contactLinks } from "@/data/contactLinks";
import { BRAND_LOGO_URL } from "@/lib/brand";
import "./contact.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yearRange = `2023–${currentYear}`;

  return (
    <footer className="footer-section">
      <div className="section-shell">
        <div className="footer-top">
          <div className="footer-about">
            <p className="footer-kicker">Independent software engineering</p>
            <p className="footer-statement">Good software. <br />Built with care.</p>
            <p className="footer-description">
              Self-hosted infrastructure, developer platforms, and the tools that connect them.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Explore">
            <h3 className="footer-nav-title">Explore</h3>
            <a className="footer-link" href="#about">About</a>
            <a className="footer-link" href="#tech">Stack</a>
            <a className="footer-link" href="#work">Work</a>
            <a className="footer-link" href="#contact">Contact</a>
          </nav>

          <nav className="footer-nav" aria-label="Connect">
            <h3 className="footer-nav-title">Elsewhere</h3>
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="footer-link"
              >
                {link.label}<span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-wordmark">
          <img className="footer-brand-logo" src={BRAND_LOGO_URL} alt="" width="48" height="48" />
          <span>Nub Coders</span>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {yearRange} Nub Coders · nubcoders.com</span>
        </div>
      </div>
    </footer>
  );
}
