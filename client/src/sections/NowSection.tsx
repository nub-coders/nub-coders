import { focusCards } from "@/data/focusCards";

export default function NowSection() {
  return (
    <section id="now">
      <div className="section-head reveal"><span className="section-num">04</span><div className="section-line" /><h2 className="section-title">Now</h2></div>
      <div className="focus-grid">
        {focusCards.map((card) => (
          <div key={card.title} className="focus-card reveal">
            <div className="focus-icon" aria-hidden="true">{card.icon}</div>
            <h3 className="focus-title">{card.title}</h3>
            <p className="focus-body">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
