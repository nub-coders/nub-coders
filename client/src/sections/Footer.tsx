export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <a href="#main" className="footer-logo" aria-label="Back to top">nub-coders</a>
      <span className="footer-copy">© {year} Ankit Kumar · nubcoders.com</span>
    </footer>
  );
}
