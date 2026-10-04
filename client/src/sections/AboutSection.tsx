import { principles } from "@/data/principles";

function PrincipleSymbol({ index }: { index: number }) {
  const shapes = [
    <path key="clarity" d="M6 8h20M6 16h14M6 24h20" />,
    <path key="iterate" d="M25 12a10 10 0 1 0 0 9M25 5v7h-7" />,
    <path key="maintenance" d="m16 4 11 7-11 7-11-7ZM5 17l11 7 11-7M5 23l11 7 11-7" />,
    <path key="communicate" d="M5 6h22v16H15l-7 6v-6H5ZM10 12h12M10 17h8" />,
  ];
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      {shapes[index]}
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="studio-section" aria-labelledby="about-title">
      <div className="section-shell">
        <div className="studio-heading">
          <div>
            <h2 className="eyebrow" id="about-title">About</h2>
            <p className="section-title studio-title">Independent roots. <br />Whole-stack thinking.</p>
          </div>
          <div className="studio-story">
            <p>
              We&apos;re <strong>Nub Coders</strong>, an independent software organization
              founded by <strong>Ankit Kumar</strong>. We turn complex problems into
              clear, reliable systems — and stay close to every layer we build.
            </p>
            <p>
              From the interface to the infrastructure: containerized applications,
              self-hosted email, automated TLS, and tools that make a developer&apos;s
              day a little easier. Real software, with ownership built in.
            </p>
            <a className="text-link" href="https://github.com/nub-coders" target="_blank" rel="noopener noreferrer">
              Meet us through our code <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="studio-principles">
          {principles.map((principle, index) => (
            <article className="studio-principle" key={principle.num}>
              <div className="studio-principle-symbol">
                <PrincipleSymbol index={index} />
                <span aria-hidden="true">{principle.num}</span>
              </div>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
