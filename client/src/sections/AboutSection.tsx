import { principles } from "@/data/principles";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title">
      <div className="section-head reveal"><h2 className="section-title" id="about-title">About</h2></div>
      <div className="about-grid">
        <div className="reveal">
          <p className="about-text">
            <strong>Nub Coders</strong> is an independent software organization and engineering collective focused on building reliable cloud infrastructure, developer tools, and open-source platforms that power real workloads.
            <br /><br />
            Founded by <strong>Ankit Kumar</strong>, our mission is turning rough ideas into <strong>production-ready systems</strong> — from containerized microservices and automated TLS deployments to messaging clients, media engines, and SaaS backends. Self-hosted infrastructure and clean architecture are at our core.
            <br /><br />
            We actively contribute to the open-source ecosystem, sharing our discoveries and engineering practices on YouTube and GitHub to help developers ship better software faster.
          </p>
        </div>
        <div className="principles reveal">
          {principles.map((principle) => (
            <div key={principle.num} className="principle">
              <span className="principle-num">{principle.num}</span>
              <p className="principle-text"><strong>{principle.title}</strong> — {principle.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
