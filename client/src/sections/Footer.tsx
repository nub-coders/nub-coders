export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <a href="#" className="footer-logo">nub-coders</a>
      <span className="footer-copy">© {year} Ankit Kumar · nubcoders.com</span>
    </footer>
  );
}
