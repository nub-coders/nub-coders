import { techCategories, getTechLink } from "@/data/techStack";
import "./work.css";

const categoryNotes: Record<string, string> = {
  Frontend: "Interfaces & experiences",
  Backend: "Services & application logic",
  Database: "Storage & caching",
  DevOps: "Infrastructure & delivery",
};

export default function TechStackSection() {
  return (
    <section id="tech" className="expertise-section" aria-labelledby="tech-title">
      <div className="section-shell expertise-layout">
        <header className="expertise-heading">
          <p className="eyebrow">Engineering expertise</p>
          <h2 className="section-title" id="tech-title">Stack</h2>
          <p className="section-intro expertise-intro">
            The right tools for the work in front of us. From the first interface to the infrastructure behind it.
          </p>
          <div className="expertise-footnote">
            <span className="expertise-braces" aria-hidden="true">&#123;&nbsp;&#125;</span>
            <span>Built to work.<br />Designed to last.</span>
          </div>
        </header>

        <ol className="expertise-categories">
          {techCategories.map((category, index) => (
            <li key={category.title} className="expertise-category">
              <div className="expertise-category-heading">
                <span className="expertise-number" aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{category.title}</h3>
                  <p>{categoryNotes[category.title]}</p>
                </div>
              </div>
              <ul className="expertise-tech-list" aria-label={`${category.title} technologies`}>
                {category.pills.map((technology) => {
                  const techLink = getTechLink(technology);

                  return (
                    <li key={technology}>
                      {techLink ? (
                        <a
                          href={techLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open the official website for ${techLink.label}`}
                        >
                          <span>{technology}</span>
                          <span className="expertise-link-arrow" aria-hidden="true">↗</span>
                        </a>
                      ) : <span className="expertise-tech-name">{technology}</span>}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
