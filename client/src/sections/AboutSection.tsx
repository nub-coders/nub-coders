import { principles } from "@/data/principles";

export default function AboutSection() {
  return (
    <section id="about">
      <div className="section-head reveal"><span className="section-num">01</span><div className="section-line" /><h2 className="section-title">About</h2></div>
      <div className="about-grid">
        <div className="reveal">
          <p className="about-text">
            I&apos;m a <strong>full-stack developer</strong> with a strong backend and systems focus, currently studying Mechanical Engineering while running <strong>Nub Coder</strong> — my software venture building tools, infrastructure, and products that actually matter.
            <br /><br />
            I enjoy turning rough ideas into <strong>production-ready systems</strong>, especially when the challenge involves reliability, clean architecture, and developer experience. Self-hosted infra is my playground.
            <br /><br />
            When I&apos;m not shipping code, I&apos;m sharing what I learn on YouTube and open-sourcing things that might help other developers move faster.
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
