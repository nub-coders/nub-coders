export default function HeroSection() {
  return (
    <div className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-tag">Full Stack Developer · nubcoders.com</div>
      <h1 className="hero-name">Ankit<br /><em>Kumar</em></h1>
      <div className="hero-bottom">
        <p className="hero-desc">
          I build products that solve real problems and stay maintainable as they grow. Full-stack systems across infrastructure, automation, APIs, and SaaS workflows — shipped clean, built to last.
        </p>
        <div className="hero-stats">
          <div className="stat-item"><span className="stat-num">4+</span><span className="stat-label">Years exp</span></div>
          <div className="stat-item"><span className="stat-num">10+</span><span className="stat-label">Projects</span></div>
          <div className="stat-item"><span className="stat-num">4</span><span className="stat-label">Live products</span></div>
        </div>
      </div>
      <div className="scroll-indicator"><div className="scroll-line" /></div>
    </div>
  );
}
