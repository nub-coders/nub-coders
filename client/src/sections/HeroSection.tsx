import type { CSSProperties } from "react";
import {
  DiagramLayers,
  DiagramPartNode,
  diagramConnection,
  useInteractiveDiagram,
  type DiagramPart,
} from "@/components/InteractiveDiagram";
import "./landing.css";

const architectureParts = [
  {
    id: "infrastructure",
    label: "Infrastructure plate",
    description: "The broad foundation represents self-hosted compute, storage, and networking.",
    bounds: { x: 62, y: 187, width: 436, height: 264 },
  },
  {
    id: "platform",
    label: "Platform plate",
    description: "A shared developer platform connects the foundation to the applications above it.",
    bounds: { x: 93, y: 122, width: 374, height: 233 },
  },
  {
    id: "application-tray",
    label: "Application tray",
    description: "This layer brings the application core and independent modules into one system.",
    bounds: { x: 151, y: 86, width: 258, height: 164 },
  },
  {
    id: "application-core",
    label: "Application core",
    description: "The orange core represents the main application, built from distinct, purposeful layers.",
    bounds: { x: 224, y: 30, width: 112, height: 149 },
  },
  {
    id: "service-module",
    label: "Service module",
    description: "A small, independent service can evolve alongside the main application.",
    bounds: { x: 192, y: 133, width: 54, height: 59 },
  },
  {
    id: "data-module",
    label: "Data module",
    description: "A separate module represents a focused data capability connected to the application.",
    bounds: { x: 325, y: 133, width: 54, height: 59 },
  },
] as const satisfies readonly DiagramPart[];

function SystemIllustration() {
  const diagram = useInteractiveDiagram(architectureParts, {
    width: 560,
    height: 456,
    title: "Architecture playground",
  });

  return (
    <figure className="landing-system">
      <div className="landing-system-heading">
        <span>A system, in good order</span>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
          <path d="M8.5 1V16M1 8.5H16M3.2 3.2L13.8 13.8M3.2 13.8L13.8 3.2" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </div>

      <svg
        {...diagram.svgProps}
        className="landing-system-drawing diagram-svg"
        viewBox="0 0 560 456"
        fill="none"
        role="group"
        aria-label="Architecture playground"
      >
        <title id="landing-system-title">Architecture playground</title>
        <desc id="architecture-playground-description">
          A conceptual architectural model of modular applications resting on a developer
          platform and a broad infrastructure foundation.
          All motion is illustrative, not live system data.
        </desc>
        <defs>
          <pattern id="landing-drawing-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M12 14H16M14 12V16" stroke="#cfd5c9" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect x="20" y="10" width="520" height="424" fill="url(#landing-drawing-grid)" opacity="0.7" aria-hidden="true" pointerEvents="none" />

        <g stroke="#bac5b2" strokeWidth="1" strokeDasharray="3 5" aria-hidden="true" pointerEvents="none">
          <path d="M280 22V440M64 314L280 190L496 314M95 232V332M465 232V332M153 161V345M407 161V345" />
        </g>

        <g className="diagram-connections" stroke="#8b9684" strokeWidth="1.5" aria-hidden="true" pointerEvents="none">
          <path className="diagram-packet" pathLength="100" d={diagramConnection(diagram.point("infrastructure", 101, 313), diagram.point("platform", 124, 231))} />
          <path className="diagram-packet" pathLength="100" d={diagramConnection(diagram.point("platform", 151, 231), diagram.point("application-tray", 174, 161))} style={{ "--diagram-delay": "-1.6s" } as CSSProperties} />
        </g>

        <g stroke="#8b9684" strokeWidth="1.1" aria-hidden="true" pointerEvents="none">
          <path d="M334 64L388 33H433M95 239L59 260V287M400 379L429 396H468" />
          <circle cx="334" cy="64" r="3" fill="#fafbf6" />
          <circle cx="95" cy="239" r="3" fill="#fafbf6" />
          <circle cx="400" cy="379" r="3" fill="#fafbf6" />
        </g>
        <g fill="#fafbf6" stroke="#b9c2b1" strokeWidth="1" aria-hidden="true" pointerEvents="none">
          <circle cx="447" cy="33" r="14" />
          <circle cx="59" cy="302" r="14" />
          <circle cx="483" cy="396" r="14" />
        </g>
        <g fill="#52614e" fontFamily="ui-monospace, monospace" fontSize="11" textAnchor="middle" aria-hidden="true" pointerEvents="none">
          <text x="447" y="37">01</text>
          <text x="59" y="306">02</text>
          <text x="483" y="400">03</text>
        </g>

        <DiagramLayers diagram={diagram}>
        <DiagramPartNode key="infrastructure" diagram={diagram} id="infrastructure">
          <g stroke="#52614e" strokeWidth="1.15" strokeLinejoin="round">
            <path d="M64 313L280 437V449L64 325V313Z" fill="#dce5d3" />
            <path d="M280 437L496 313V325L280 449V437Z" fill="#c7d2bd" />
            <path d="M64 313L280 189L496 313L280 437L64 313Z" fill="#e9eee3" />
          </g>
          <g stroke="#a8b89b" strokeWidth="1.15" strokeLinejoin="round">
            <path d="M101 313L280 416L459 313M133 313L280 397L427 313M165 313L280 379L395 313" />
            <path d="M101 313L157 281M459 313L403 281M199 369L211 349M361 369L349 349" />
            <circle cx="101" cy="313" r="3" fill="#e9eee3" />
            <circle cx="459" cy="313" r="3" fill="#e9eee3" />
          </g>
          <g stroke="#708267" strokeWidth="1.7" aria-hidden="true" pointerEvents="none">
            <path className="diagram-circuit" pathLength="100" d="M101 313L280 416L459 313" />
            <path className="diagram-circuit" pathLength="100" d="M165 313L280 379L395 313" style={{ "--diagram-delay": "-2.5s" } as CSSProperties} />
          </g>
          <path d="M269 431L280 437L291 431" stroke="#52614e" strokeWidth="2" />
        </DiagramPartNode>

        <DiagramPartNode key="platform" diagram={diagram} id="platform">
          <g stroke="#52614e" strokeWidth="1.15" strokeLinejoin="round">
            <path d="M95 231L280 338V353L95 246V231Z" fill="#f0f0e8" />
            <path d="M280 338L465 231V246L280 353V338Z" fill="#dce1d3" />
            <path d="M95 231L280 124L465 231L280 338L95 231Z" fill="#fafaf5" />
          </g>
          <g stroke="#c9cdbf" strokeWidth="1.1">
            <path d="M124 231L280 321L436 231M151 231L280 305L409 231" />
            <path d="M201 276L201 258L226 244M359 276V258L334 244" />
          </g>
          <path className="diagram-circuit" pathLength="100" d="M124 231L280 321L436 231" stroke="#8b9684" strokeWidth="1.7" style={{ "--diagram-delay": "-1.6s" } as CSSProperties} aria-hidden="true" pointerEvents="none" />
          <g fill="#52614e">
            <path d="M127 254L136 259V263L127 258V254ZM144 264L153 269V273L144 268V264ZM161 274L170 279V283L161 278V274Z" />
          </g>
          <path d="M347 299L381 279V294L347 314V299Z" fill="#bc4424" stroke="#843b26" strokeLinejoin="round" />
        </DiagramPartNode>

        <DiagramPartNode key="application-tray" diagram={diagram} id="application-tray">
          <g stroke="#52614e" strokeWidth="1.15" strokeLinejoin="round">
            <path d="M153 161L280 234V248L153 175V161Z" fill="#e9ede2" />
            <path d="M280 234L407 161V175L280 248V234Z" fill="#d5ddcc" />
            <path d="M153 161L280 88L407 161L280 234L153 161Z" fill="#ffffff" />
          </g>
          <path d="M174 161L280 222L386 161M280 182V222" stroke="#d5dbce" strokeWidth="1.1" />
          <path className="diagram-circuit" pathLength="100" d="M174 161L280 222L386 161" stroke="#8b9684" strokeWidth="1.7" style={{ "--diagram-delay": "-3.2s" } as CSSProperties} aria-hidden="true" pointerEvents="none" />
        </DiagramPartNode>

        {/* An orange core and two independent modules form the application layer. */}
        <DiagramPartNode key="application-core" diagram={diagram} id="application-core">
          <g stroke="#8d4029" strokeWidth="1.15" strokeLinejoin="round">
            <path d="M226 63L280 94V177L226 146V63Z" fill="#d8754e" />
            <path d="M280 94L334 63V146L280 177V94Z" fill="#bc4424" />
            <path d="M226 63L280 32L334 63L280 94L226 63Z" fill="#edaa82" />
            <path d="M226 91L280 122L334 91M226 119L280 150L334 119" />
            <path d="M253 48L307 79M253 79L307 48" stroke="#c87955" />
          </g>
          <g strokeWidth="2" strokeLinecap="round" aria-hidden="true" pointerEvents="none">
            <path d="M293 103L319 88M293 131L319 116M293 159L319 144" stroke="#cf7959" />
            <path className="diagram-stage" d="M293 103L319 88" stroke="#f4c5a7" />
            <path className="diagram-stage" d="M293 131L319 116" stroke="#f4c5a7" style={{ "--diagram-delay": "-3.2s" } as CSSProperties} />
            <path className="diagram-stage" d="M293 159L319 144" stroke="#f4c5a7" style={{ "--diagram-delay": "-1.6s" } as CSSProperties} />
          </g>
        </DiagramPartNode>
        <DiagramPartNode key="service-module" diagram={diagram} id="service-module">
          <g stroke="#52614e" strokeWidth="1.15" strokeLinejoin="round">
            <path d="M194 149L219 163V190L194 176V149Z" fill="#f7f7f2" />
            <path d="M219 163L244 149V176L219 190V163Z" fill="#d6ddcd" />
            <path d="M194 149L219 135L244 149L219 163L194 149Z" fill="#ffffff" />
          </g>
          <path d="M211 149L219 144L227 149L219 154L211 149Z" fill="#bc4424" />
        </DiagramPartNode>
        <DiagramPartNode key="data-module" diagram={diagram} id="data-module">
          <g stroke="#52614e" strokeWidth="1.15" strokeLinejoin="round">
            <path d="M327 149L352 163V190L327 176V149Z" fill="#73856c" />
            <path d="M352 163L377 149V176L352 190V163Z" fill="#43583f" />
            <path d="M327 149L352 135L377 149L352 163L327 149Z" fill="#aebf9f" />
          </g>
          <path d="M345 149L352 145L359 149L352 153L345 149Z" fill="#e9eee3" />
        </DiagramPartNode>
        </DiagramLayers>
      </svg>

      <figcaption className="landing-system-caption">
        <ol className="landing-system-key">
          <li><span>01</span> Applications</li>
          <li><span>02</span> Platforms</li>
          <li><span>03</span> Infrastructure</li>
        </ol>
        <p>Illustrative architecture <span aria-hidden="true">↗</span></p>
      </figcaption>
    </figure>
  );
}

export default function HeroSection() {
  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="section-shell">
        <div className="landing-hero-grid">
          <div className="landing-copy">
            <p className="eyebrow landing-eyebrow">
              <span className="landing-eyebrow-mark" aria-hidden="true" />
              Software engineering, thoughtfully done
            </p>
            <h1 id="landing-title" className="landing-title">
              <span className="landing-title-line">Built with care.</span>{" "}
              <span className="landing-title-line">Made to <span className="landing-title-accent">scale.</span></span>
            </h1>
            <p className="landing-description">
              Self-hosted infrastructure, developer tools, and open-source systems.
              Thoughtfully engineered from the ground up, by Nub Coders.
            </p>
            <div className="landing-actions">
              <a href="#work" className="button button-primary landing-primary">
                Explore our work
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 9H15M10 4L15 9L10 14" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>
              <a href="#contact" className="button button-secondary landing-secondary">
                Let’s talk
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
                  <path d="M4 13L13 4M4 4H13V13" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>
            </div>
            <p className="landing-copy-note">Complex problems. Clear, considered solutions.</p>
          </div>
          <SystemIllustration />
        </div>

        <div className="landing-values">
          <p className="landing-values-intro">The principles behind the code</p>
          <div className="landing-value">
            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M5 9L14 4L23 9L14 14L5 9ZM5 14L14 19L23 14M5 19L14 24L23 19" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            <div><strong>Own your foundation.</strong><span>Self-hosted infrastructure</span></div>
          </div>
          <div className="landing-value">
            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M10 5H5V23H10M18 5H23V23H18M11 14H17M14 11V17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
            </svg>
            <div><strong>Make the complex simple.</strong><span>Developer-first tools</span></div>
          </div>
          <div className="landing-value">
            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M14 4V12M14 16V24M4 14H12M16 14H24M7 7L12 12M16 16L21 21M7 21L12 16M16 12L21 7" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <div><strong>Build it. Share it.</strong><span>Open-source thinking</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
