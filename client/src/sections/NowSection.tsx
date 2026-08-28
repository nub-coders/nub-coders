import { focusCards } from "@/data/focusCards";

export default function NowSection() {
  return (
    <section id="now" aria-labelledby="now-title">
      <div className="section-head reveal"><h2 className="section-title" id="now-title">Now</h2></div>
      <div className="focus-grid">
        {focusCards.map((card) => (
          <div key={card.title} className="focus-card reveal">
            <h3 className="focus-title">{card.title}</h3>
            <p className="focus-body">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
