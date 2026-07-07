import { techCategories, getTechLink } from "@/data/techStack";

export default function TechStackSection() {
  return (
    <section id="tech">
      <div className="section-head reveal"><span className="section-num">02</span><div className="section-line" /><h2 className="section-title">Stack</h2></div>
      <div className="tech-categories reveal">
        {techCategories.map((category) => (
          <div key={category.title} className="tech-category">
            <h3>{category.title}</h3>
            <div className="tech-pills">
              {category.pills.map((pill) => {
                const techLink = getTechLink(pill);

                if (!techLink) {
                  return <span key={pill} className="pill">{pill}</span>;
                }

                return (
                  <a
                    key={pill}
                    className="pill pill-link"
                    href={techLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open the official website for ${techLink.label}`}
                  >
                    {pill}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
