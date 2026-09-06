import { principles } from "@/data/principles";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title">
      <div className="section-head reveal">
        <h2 className="section-title" id="about-title">About</h2>
      </div>
      <div className="about-grid">
        <div className="reveal">
          <p className="about-text">
            <strong>Nub Coders</strong> is an independent software organization focused on building reliable cloud infrastructure, developer platforms, and open-source tools that power real workloads.
            <br /><br />
            Founded by <strong>Ankit Kumar</strong>, our focus is turning complex ideas into maintainable, production-ready systems — from containerized microservices and automated DNS-01 wildcard TLS to self-hosted email infrastructure and media engines.
            <br /><br />
            We actively contribute to the open-source ecosystem, sharing our discoveries and engineering practices on YouTube and GitHub.
          </p>
        </div>

        <div className="principles reveal">
          {principles.map((principle) => (
            <div key={principle.num} className="principle">
              <span className="principle-num">{principle.num}</span>
              <p className="principle-text">
                <strong>{principle.title}</strong> — {principle.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
