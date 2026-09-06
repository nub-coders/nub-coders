import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { id: "about", label: "about" },
  { id: "tech", label: "stack" },
  { id: "work", label: "work" },
  { id: "contact", label: "contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Toggle the `scrolled` background once the page moves past the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav link for the section currently in view.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

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

  // While the fullscreen overlay is open: lock body scroll, take the page behind
  // it out of the tab order, and close on Escape.
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    const behind = [
      document.getElementById("main"),
      document.querySelector("footer"),
    ].filter((el): el is HTMLElement => Boolean(el));

    if (menuOpen) {
      behind.forEach((el) => el.setAttribute("inert", ""));
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = menuOpen;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("menu-open");
      behind.forEach((el) => el.removeAttribute("inert"));
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav id="nav" className={scrolled ? "scrolled" : ""}>
      <div className="nav-left">
        <a href="#main" className="nav-logo" aria-label="nub-coders, back to top" onClick={closeMenu}>
          <span className="nav-logo-symbol" aria-hidden="true" />
          nub-coders
        </a>
        <div className="nav-status" aria-hidden="true">
          <span className="nav-status-dot" />
          <span>Operational</span>
        </div>
      </div>

      <button
        type="button"
        ref={toggleRef}
        className={`nav-toggle ${menuOpen ? "open" : ""}`}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="nav-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
      </button>

      <ul id="nav-menu" className={`nav-links ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              onClick={closeMenu}
              aria-current={active === link.id ? "location" : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
