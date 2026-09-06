import { focusCards } from "@/data/focusCards";

const FOCUS_BADGES: Record<string, string> = {
  "Developer Tooling": "ACTIVE BUILD",
  "Reliability Patterns": "ARCHITECTURE",
  "Testing Discipline": "CI DISCIPLINE",
};

export default function NowSection() {
  return (
    <section id="now" aria-labelledby="now-title">
      <div className="section-head reveal">
        <h2 className="section-title" id="now-title">Now</h2>
      </div>
      <div className="focus-grid">
        {focusCards.map((card) => (
          <div key={card.title} className="focus-card reveal">
            <div className="focus-header">
              {card.icon && (
                <div className="focus-icon-wrap" aria-hidden="true">
                  <span>{card.icon}</span>
                </div>
              )}
              <span className="focus-badge">{FOCUS_BADGES[card.title] ?? "ACTIVE"}</span>
            </div>
            <h3 className="focus-title">{card.title}</h3>
            <p className="focus-body">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
