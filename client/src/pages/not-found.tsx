import { Link } from "wouter";
import { BRAND_LOGO_URL } from "@/lib/brand";
import "@/sections/contact.css";

export default function NotFound() {
  return (
    <main className="notfound-page" id="main" aria-labelledby="notfound-title">
      <div className="section-shell notfound-shell">
        <header className="notfound-header">
          <Link href="/" className="notfound-brand" aria-label="Nub Coders home">
            <img className="notfound-brand-mark" src={BRAND_LOGO_URL} alt="" width="34" height="34" />
            Nub Coders
          </Link>
          <span className="notfound-header-note">Independent software engineering</span>
        </header>

        <div className="notfound-content">
          <div className="notfound-copy">
            <p className="notfound-eyebrow">A small detour</p>
            <h1 className="notfound-title" id="notfound-title">Page <br />not found.</h1>
            <p className="notfound-description">
              The page you&apos;re looking for doesn&apos;t exist or has moved.
              There&apos;s plenty to explore back home.
            </p>
            <Link href="/" className="notfound-home">
              <span aria-hidden="true">←</span> Back home
            </Link>
          </div>

          <div className="notfound-route" aria-hidden="true">
            <div className="notfound-route-label"><span>Route / unknown</span><span>↗</span></div>
            <span className="notfound-code">404<span>.</span></span>
            <svg className="notfound-route-drawing" viewBox="0 0 400 170" fill="none">
              <path d="M32 30h267c28 0 45 17 45 42s-17 42-45 42H87" stroke="currentColor" strokeWidth="2" />
              <path d="m108 96-22 18 22 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <circle cx="32" cy="30" r="8" fill="var(--accent, #bc4424)" />
              <path d="m26 107 19-16 19 16v32H26v-32Z" fill="var(--paper, #f7f7f2)" stroke="currentColor" strokeWidth="2" />
              <path d="M39 139v-17h12v17" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p className="notfound-route-caption">Every good route starts somewhere.</p>
          </div>
        </div>

        <footer className="notfound-footer">
          <span>© {new Date().getFullYear()} Nub Coders</span>
          <a href="mailto:dev@nubcoders.com">Need a hand? <span>Get in touch ↗</span></a>
        </footer>
      </div>
    </main>
  );
}
