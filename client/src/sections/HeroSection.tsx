import { useState } from "react";

export default function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText("curl -sL https://nubcoders.com/status");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hero">
      <div className="hero-glow" aria-hidden="true" />
      
      <div className="hero-telemetry" aria-hidden="true">
        <span className="hero-telemetry-dot" />
        <span className="hero-telemetry-text">SYSTEM STATUS: OPERATIONAL · 100% SELF-HOSTED</span>
      </div>

      <div className="hero-tag">Engineering Studio · Cloud Platforms &amp; Developer Systems</div>
      
      <h1 className="hero-name">
        Nub<br />
        <em>Coders</em>
      </h1>
      
      <p className="hero-desc">
        We build and run production systems that solve real problems and stay maintainable as they grow. Self-hosted infrastructure, developer platforms, automation APIs, and high-performance tools — engineered with precision.
      </p>

      <div className="hero-actions">
        <a href="#work" className="btn-primary">
          Explore Work →
        </a>
        <a href="#contact" className="btn-secondary">
          Contact Studio
        </a>
        <button
          type="button"
          className="hero-command-chip"
          onClick={handleCopy}
          aria-label="Copy terminal status command"
          title="Click to copy terminal command"
        >
          <code>$</code> {copied ? "Copied to clipboard! ✓" : "curl -sL nubcoders.com/status"}
        </button>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
      </div>
    </div>
  );
}
