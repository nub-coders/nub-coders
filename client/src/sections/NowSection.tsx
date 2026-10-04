import { focusCards } from "@/data/focusCards";

const symbols = [
  "M5 8h22v18H5ZM5 13h22M9 10h1m3 0h1m-4 7 4 3-4 3m8 0h5",
  "M16 4 27 8v9c0 6-11 12-11 12S5 23 5 17V8ZM11 16l4 4 7-8",
  "M10 4h12M12 4v9L5 26c-1 2 0 3 2 3h18c2 0 3-1 2-3l-7-13V4M9 21h14",
];

export default function NowSection() {
  return (
    <section id="now" className="notes-section section-shell" aria-labelledby="now-title">
      <div className="notes-heading">
        <div>
          <h2 className="eyebrow" id="now-title">Now</h2>
          <p className="section-title">Always a work <br />in progress.</p>
        </div>
        <p className="section-intro">Better tools. Stronger systems. These are the ideas we&apos;re spending time on.</p>
      </div>
      <div className="notes-grid">
        {focusCards.map((card, index) => (
          <article key={card.title} className="notes-card">
            <div className="notes-card-top">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
                <path d={symbols[index]} />
              </svg>
              <span>On our desk</span>
            </div>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
