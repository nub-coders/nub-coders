export default function HeroSection() {
  return (
    <div className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-tag">Software Organization · Cloud Platforms &amp; Developer Systems</div>
      <h1 className="hero-name">
        Nub<br />
        <em>Coders</em>
      </h1>
      <p className="hero-desc">
        We build and operate self-hosted infrastructure, developer platforms, automation APIs, and high-performance open-source systems — engineered cleanly from the ground up.
      </p>
      <div className="hero-actions">
        <a href="#work" className="hero-link">Selected work ↓</a>
        <a href="#contact" className="hero-link">Get in touch →</a>
      </div>
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
      </div>
    </div>
  );
}
