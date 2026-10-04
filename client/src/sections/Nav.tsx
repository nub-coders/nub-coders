import { useEffect, useRef, useState } from "react";
import { BRAND_LOGO_URL } from "@/lib/brand";
import "./landing.css";

const NAV_LINKS = [
  { id: "about", label: "about" },
  { id: "tech", label: "stack" },
  { id: "work", label: "work" },
  { id: "contact", label: "contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Keep this breakpoint in sync with landing.css. A hidden mobile panel
    // must never leave the desktop page inert or its scroll locked.
    const onResize = () => {
      if (window.innerWidth < 800) return;
      if (wasOpen.current) returnFocusRef.current = brandRef.current;
      setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpen.current) {
        (returnFocusRef.current ?? toggleRef.current)?.focus({ preventScroll: true });
      }
      wasOpen.current = false;
      returnFocusRef.current = null;
      return;
    }

    const behind = [
      document.getElementById("main"),
      document.querySelector("footer"),
      document.querySelector(".skip-link"),
    ].filter((el): el is HTMLElement => Boolean(el));
    const alreadyInert = new Set(behind.filter((el) => el.hasAttribute("inert")));
    const previousOverflow = document.body.style.overflow;
    const alreadyLocked = document.body.classList.contains("menu-open");

    wasOpen.current = true;
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
    behind.forEach((el) => el.setAttribute("inert", ""));
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const controls = headerRef.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      const outsideHeader = !headerRef.current?.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === first || outsideHeader)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || outsideHeader)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (!alreadyLocked) document.body.classList.remove("menu-open");
      document.body.style.overflow = previousOverflow;
      behind.forEach((el) => {
        if (!alreadyInert.has(el)) el.removeAttribute("inert");
      });
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header ref={headerRef} className="header-root">
      <div className="section-shell header-inner">
        <a
          ref={brandRef}
          href="#main"
          className="header-brand"
          aria-label="nub-coders, back to top"
          onClick={closeMenu}
        >
          <img className="header-mark" src={BRAND_LOGO_URL} alt="" width="36" height="36" />
          <span>Nub Coders<span className="header-brand-period">.</span></span>
        </a>

        <nav
          ref={menuRef}
          id="nav"
          className={`header-navigation${menuOpen ? " header-navigation-open" : ""}`}
          aria-label="Main navigation"
        >
          <ul id="nav-menu" className="header-links">
            {NAV_LINKS.map((link) => (
              <li key={link.id} className="header-link-item">
                <a
                  href={`#${link.id}`}
                  className={link.id === "contact" ? "header-contact" : "header-section-link"}
                  onClick={closeMenu}
                  aria-current={active === link.id ? "location" : undefined}
                >
                  {link.label}
                  {link.id === "contact" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 12.5L12 4M4 4H12V12" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </a>
              </li>
            ))}
          </ul>
          <p className="header-menu-note">Thoughtful engineering.<br />From the ground up.</p>
        </nav>

        <button
          type="button"
          ref={toggleRef}
          className={`header-toggle${menuOpen ? " header-toggle-open" : ""}`}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header-toggle-line" />
          <span className="header-toggle-line" />
        </button>
      </div>
    </header>
  );
}
