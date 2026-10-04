import type { CSSProperties } from "react";
import { projects } from "@/data/projects";
import { getTechLink } from "@/data/techStack";
import type { ProjectSignature } from "@/data/types";
import {
  DiagramLayers,
  DiagramPartNode,
  diagramConnection,
  useInteractiveDiagram,
  type DiagramPart,
} from "@/components/InteractiveDiagram";
import "./work.css";

const productDetails: Record<ProjectSignature, { category: string; preview: string }> = {
  terminal: { category: "Application deployment", preview: "Repository → containers" },
  mail: { category: "Self-hosted email", preview: "Your domain, your email" },
  audio: { category: "Music & automation", preview: "Queue → group voice chat" },
  download: { category: "Developer tools", preview: "Request → media" },
};

const deploymentParts = [
  { id: "repo", label: "Repository", description: "A source repository is the starting point for a deployment.", bounds: { x: 16, y: 105, width: 102, height: 92 } },
  { id: "halvo", label: "Halvo platform", description: "Halvo turns a repository into a repeatable application deployment.", bounds: { x: 160, y: 38, width: 203, height: 224 } },
  { id: "web", label: "Web container", description: "A web container receives the deployed application.", bounds: { x: 405, y: 53, width: 99, height: 60 } },
  { id: "api", label: "API container", description: "An API container runs alongside the web layer.", bounds: { x: 405, y: 121, width: 99, height: 60 } },
  { id: "worker", label: "Worker container", description: "A worker container handles background jobs.", bounds: { x: 405, y: 189, width: 99, height: 60 } },
] as const satisfies readonly DiagramPart[];
const mailParts = [
  { id: "domain", label: "Your domain", description: "A domain is the address your mail system serves.", bounds: { x: 16, y: 110, width: 129, height: 96 } },
  { id: "send-api", label: "Send API", description: "An API can submit messages to the mail platform.", bounds: { x: 208, y: 18, width: 106, height: 41 } },
  { id: "nubmail", label: "NubMail", description: "NubMail is the central self-hosted email system.", bounds: { x: 188, y: 80, width: 153, height: 171 } },
  { id: "smtp", label: "SMTP", description: "SMTP provides message transport.", bounds: { x: 392, y: 49, width: 112, height: 62 } },
  { id: "imap", label: "IMAP", description: "IMAP provides mailbox synchronization.", bounds: { x: 392, y: 127, width: 112, height: 62 } },
  { id: "pop3", label: "POP3", description: "POP3 provides mailbox download access.", bounds: { x: 392, y: 205, width: 112, height: 62 } },
] as const satisfies readonly DiagramPart[];
const musicParts = [
  { id: "queue", label: "Audio queue", description: "A queue organizes tracks before playback.", bounds: { x: 23, y: 51, width: 235, height: 210 } },
  { id: "voice-chat", label: "Group voice chat", description: "Queued audio is delivered to a Telegram group voice chat.", bounds: { x: 299, y: 20, width: 188, height: 262 } },
] as const satisfies readonly DiagramPart[];
const apiParts = [
  { id: "request", label: "API request", description: "A token-authenticated request carries a media URL.", bounds: { x: 18, y: 46, width: 248, height: 215 } },
  { id: "output", label: "Media output", description: "The extracted media is returned to the caller.", bounds: { x: 358, y: 75, width: 144, height: 156 } },
] as const satisfies readonly DiagramPart[];

function PacketRoute({ d, delay = "0s" }: { d: string; delay?: string }) {
  return (
    <g aria-hidden="true" pointerEvents="none">
      <path className="work-svg-route" d={d} opacity="0.55" />
      <path className="diagram-packet" d={d} pathLength="100" fill="none" stroke="var(--product-accent)" strokeWidth="2" style={{ "--diagram-delay": delay } as CSSProperties} />
    </g>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeploymentConcept() {
  const diagram = useInteractiveDiagram(deploymentParts, { width: 520, height: 300, title: "Halvo playground" });
  const containers = [{ id: "web", y: 55 }, { id: "api", y: 123 }, { id: "worker", y: 191 }];
  return (
    <div className="interactive-work-diagram">
      <svg {...diagram.svgProps} className="work-illustration diagram-svg" viewBox="0 0 520 300" fill="none" role="group" aria-label="Halvo playground">
        <title>Halvo playground</title>
        <desc id="halvo-playground-description">An illustrative repository-to-container deployment flow, not live deployment data.</desc>
        <PacketRoute d={diagramConnection(diagram.point("repo", 116, 151), diagram.point("halvo", 162, 151))} delay="-0.8s" />
        {containers.map(({ id, y }, index) => (
          <PacketRoute key={id} d={diagramConnection(diagram.point("halvo", 354, 151), diagram.point(id, 407, y + 28))} delay={`${-index * 1.1}s`} />
        ))}
        <DiagramLayers diagram={diagram}>
        <DiagramPartNode key="repo" diagram={diagram} id="repo">
          <rect className="work-svg-paper work-svg-outline" x="18" y="107" width="98" height="88" rx="14" />
          <g className="work-svg-icon"><path d="M59 126v22m16-22v8c0 9-16 6-16 15" /><circle cx="59" cy="125" r="4" /><circle cx="75" cy="125" r="4" /><circle cx="59" cy="153" r="4" /></g>
          <text className="work-svg-label" x="67" y="180" textAnchor="middle">GitHub</text>
        </DiagramPartNode>
        <DiagramPartNode key="halvo" diagram={diagram} id="halvo">
          <rect className="work-svg-shade" x="169" y="48" width="192" height="212" rx="16" />
          <rect className="work-svg-paper work-svg-outline" x="162" y="40" width="192" height="212" rx="16" />
          <text className="work-svg-brand" x="181" y="71">halvo</text>
          <path className="work-svg-icon" d="m318 56 8 8-8 8m-11-16-8 8 8 8" /><path className="work-svg-rule" d="M162 88h192" />
          <rect className="work-svg-soft" x="181" y="109" width="153" height="41" rx="7" /><text className="work-svg-code" x="194" y="135">$ deploy</text>
          <line className="diagram-deploy-scan" x1="194" y1="117" x2="194" y2="143" stroke="var(--product-accent)" strokeWidth="2" opacity="0.35" aria-hidden="true" pointerEvents="none" />
          <rect className="work-svg-paper work-svg-outline" x="181" y="170" width="65" height="59" rx="8" /><rect className="work-svg-paper work-svg-outline" x="269" y="170" width="65" height="59" rx="8" />
          <path className="work-svg-route" d="M246 199h23m-7-5 7 5-7 5" aria-hidden="true" pointerEvents="none" /><text className="work-svg-small" x="213" y="204" textAnchor="middle">build</text><text className="work-svg-small" x="301" y="204" textAnchor="middle">ship</text>
          <g stroke="var(--product-accent)" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" pointerEvents="none">
            <path className="diagram-stage" d="M200 218h26" />
            <path className="diagram-stage" d="M288 218h26" style={{ "--diagram-delay": "-3.2s" } as CSSProperties} />
          </g>
        </DiagramPartNode>
        {containers.map(({ id, y }) => (
          <DiagramPartNode key={id} diagram={diagram} id={id}>
            <rect className="work-svg-paper work-svg-outline" x="407" y={y} width="95" height="56" rx="10" />
            <path className="work-svg-icon" d={`m421 ${y + 23} 8-5 8 5v10l-8 5-8-5Zm0 0 8 5 8-5m-8 5v10`} /><text className="work-svg-small" x="444" y={y + 32}>{id}</text>
            <circle className="work-svg-solid diagram-stage" cx="489" cy={y + 12} r="2.5" style={{ "--diagram-delay": "-1.6s" } as CSSProperties} aria-hidden="true" pointerEvents="none" />
          </DiagramPartNode>
        ))}
        </DiagramLayers>
      </svg>
    </div>
  );
}

function MailConcept() {
  const diagram = useInteractiveDiagram(mailParts, { width: 520, height: 300, title: "NubMail playground" });
  const protocols = [{ id: "smtp", y: 51, label: "SMTP" }, { id: "imap", y: 129, label: "IMAP" }, { id: "pop3", y: 207, label: "POP3" }];
  return (
    <div className="interactive-work-diagram">
      <svg {...diagram.svgProps} className="work-illustration diagram-svg" viewBox="0 0 520 300" fill="none" role="group" aria-label="NubMail playground">
        <title>NubMail playground</title>
        <desc id="nubmail-playground-description">An illustrative self-hosted email system linking a domain and send API to SMTP, IMAP, and POP3, not live mail data.</desc>
        <PacketRoute d={diagramConnection(diagram.point("domain", 143, 158), diagram.point("nubmail", 190, 158))} delay="-0.8s" />
        <PacketRoute d={diagramConnection(diagram.point("send-api", 261, 57), diagram.point("nubmail", 261, 82))} delay="-1.9s" />
        {protocols.map(({ id, y }, index) => (
          <PacketRoute key={id} d={diagramConnection(diagram.point("nubmail", 332, 158), diagram.point(id, 394, y + 29))} delay={`${-index * 1.05}s`} />
        ))}
        <DiagramLayers diagram={diagram}>
        <DiagramPartNode key="domain" diagram={diagram} id="domain">
          <rect className="work-svg-paper work-svg-outline" x="18" y="112" width="125" height="92" rx="14" />
          <g className="work-svg-icon"><circle cx="80" cy="143" r="14" /><path d="M66 143h28m-14-14c-10 9-10 19 0 28m0-28c10 9 10 19 0 28" /></g>
          <text className="work-svg-label" x="80" y="184" textAnchor="middle">Your domain</text>
        </DiagramPartNode>
        <DiagramPartNode key="send-api" diagram={diagram} id="send-api">
          <rect className="work-svg-paper work-svg-outline" x="210" y="20" width="102" height="37" rx="8" /><text className="work-svg-small" x="261" y="44" textAnchor="middle">Send API</text>
        </DiagramPartNode>
        <DiagramPartNode key="nubmail" diagram={diagram} id="nubmail">
          <rect className="work-svg-shade" x="197" y="89" width="142" height="160" rx="17" /><rect className="work-svg-solid" x="190" y="82" width="142" height="160" rx="17" />
          <g className="work-svg-inverse-icon"><rect x="214" y="110" width="94" height="63" rx="7" /><path d="m218 116 43 31 43-31m-86 50 27-24m59 24-27-24" /></g>
          <g className="diagram-mail-letter" aria-hidden="true" pointerEvents="none">
            <rect className="work-svg-paper" x="247" y="158" width="28" height="20" rx="2" />
            <path className="work-svg-icon" d="M252 164h18m-18 5h12" />
          </g>
          <text className="work-svg-inverse-brand" x="261" y="213" textAnchor="middle">NubMail</text>
        </DiagramPartNode>
        {protocols.map(({ id, y, label }) => (
          <DiagramPartNode key={id} diagram={diagram} id={id}>
            <rect className="work-svg-paper work-svg-outline" x="394" y={y} width="108" height="58" rx="10" /><path className="work-svg-icon" d={`M410 ${y + 19}h18v17h-18Zm0 2 9 7 9-7`} /><text className="work-svg-small" x="440" y={y + 34}>{label}</text>
          </DiagramPartNode>
        ))}
        </DiagramLayers>
      </svg>
    </div>
  );
}

function MusicConcept() {
  const bars = [18, 30, 46, 31, 60, 88, 50, 34, 66, 43, 24, 36, 14];
  const diagram = useInteractiveDiagram(musicParts, { width: 520, height: 300, title: "Nub Music Bot playground" });

  return (
    <div className="interactive-work-diagram">
      <svg {...diagram.svgProps} className="work-illustration diagram-svg" viewBox="0 0 520 300" fill="none" role="group" aria-label="Nub Music Bot playground">
        <title>Nub Music Bot playground</title>
        <desc id="nub-music-bot-playground-description">An illustrative audio queue feeding a Telegram group voice chat, not live playback data.</desc>
        <PacketRoute d={diagramConnection(diagram.point("queue", 249, 151), diagram.point("voice-chat", 320, 151))} />
        <DiagramLayers diagram={diagram}>
        <DiagramPartNode key="queue" diagram={diagram} id="queue">
          <rect className="work-svg-shade" x="32" y="61" width="224" height="198" rx="16" /><rect className="work-svg-paper work-svg-outline" x="25" y="53" width="224" height="198" rx="16" />
          <text className="work-svg-brand" x="47" y="88">Queue</text><path className="work-svg-icon" d="M207 73h19m-19 6h19m-19 6h12" /><path className="work-svg-rule" d="M25 104h224" />
          <rect className="work-svg-soft" x="43" y="119" width="188" height="45" rx="7" /><path className="work-svg-icon" d="M62 146v-16l11-3v16m-11-13 11-3" /><ellipse className="work-svg-solid" cx="59" cy="146" rx="4" ry="3" /><ellipse className="work-svg-solid" cx="70" cy="143" rx="4" ry="3" />
          <text className="work-svg-label" x="87" y="147">Audio source</text><circle className="work-svg-outline work-svg-paper" cx="63" cy="187" r="7" /><circle className="work-svg-outline work-svg-paper" cx="63" cy="222" r="7" /><path className="work-svg-placeholder" d="M87 182h96m-96 10h65m-65 25h113m-113 10h78" />
        </DiagramPartNode>
        <DiagramPartNode key="voice-chat" diagram={diagram} id="voice-chat">
          <circle className="work-svg-shade" cx="393" cy="151" r="91" />
          <circle className="diagram-record" cx="393" cy="151" r="82" style={{ stroke: "var(--product-route)", strokeDasharray: "26 10 4 10" }} aria-hidden="true" pointerEvents="none" />
          <circle className="work-svg-paper work-svg-outline" cx="393" cy="151" r="73" /><path className="work-svg-rule" d="M320 151h146" aria-hidden="true" pointerEvents="none" />
          <g aria-hidden="true" pointerEvents="none">
            {bars.map((height, index) => <rect className="work-svg-solid" key={index} x={331 + index * 10} y={151 - height / 2} width="5" height={height} rx="2.5" />)}
          </g>
          <line className="diagram-playhead" x1="331" y1="114" x2="331" y2="188" style={{ stroke: "var(--product-route)" }} aria-hidden="true" pointerEvents="none" />
          <text className="work-svg-small work-svg-spaced" x="393" y="39" textAnchor="middle">TELEGRAM</text><text className="work-svg-label" x="393" y="273" textAnchor="middle">Group voice chat</text>
        </DiagramPartNode>
        </DiagramLayers>
      </svg>
    </div>
  );
}

function ApiConcept() {
  const diagram = useInteractiveDiagram(apiParts, { width: 520, height: 300, title: "Ytube API playground" });
  return (
    <div className="interactive-work-diagram">
      <svg {...diagram.svgProps} className="work-illustration diagram-svg" viewBox="0 0 520 300" fill="none" role="group" aria-label="Ytube API playground">
        <title>Ytube API playground</title>
        <desc id="ytube-api-playground-description">An illustrative authenticated request producing a media output, not live API data.</desc>
        <PacketRoute d={diagramConnection(diagram.point("request", 257, 150), diagram.point("output", 360, 150))} />
        <text className="work-svg-small" x="309" y="129" textAnchor="middle" aria-hidden="true" pointerEvents="none">extract</text>
        <DiagramLayers diagram={diagram}>
        <DiagramPartNode key="request" diagram={diagram} id="request">
          <rect className="work-svg-shade" x="27" y="56" width="237" height="203" rx="16" /><rect className="work-svg-paper work-svg-outline" x="20" y="48" width="237" height="203" rx="16" />
          <text className="work-svg-brand" x="42" y="83">API request</text><path className="work-svg-icon" d="m217 67 8 8-8 8m-12-16-8 8 8 8" /><path className="work-svg-rule" d="M20 102h237" /><text className="work-svg-code" x="40" y="135">&#123;</text>
          <rect className="work-svg-soft" x="54" y="145" width="169" height="31" rx="6" /><circle className="work-svg-icon" cx="70" cy="160" r="4" /><path className="work-svg-icon" d="M74 160h10m-4 0v4m4-4v3" /><text className="work-svg-code" x="97" y="166">token</text><text className="work-svg-code" x="59" y="203">media URL</text><text className="work-svg-code" x="40" y="231">&#125;</text>
          <line className="diagram-api-scan" x1="54" y1="140" x2="223" y2="140" stroke="var(--product-accent)" strokeWidth="2" opacity="0.35" aria-hidden="true" pointerEvents="none" />
        </DiagramPartNode>
        <DiagramPartNode key="output" diagram={diagram} id="output">
          <rect className="work-svg-shade" x="367" y="85" width="133" height="144" rx="15" /><rect className="work-svg-paper work-svg-outline" x="360" y="77" width="133" height="144" rx="15" />
          <path className="work-svg-soft work-svg-outline" d="M407 101h29l14 14v55h-43z" /><path className="work-svg-icon" d="M436 101v15h14m-35 24h6l8-7v26l-8-7h-6zm20 1c4 4 4 10 0 14" /><text className="work-svg-label" x="426" y="201" textAnchor="middle">Media output</text>
        </DiagramPartNode>
        </DiagramLayers>
      </svg>
    </div>
  );
}

function ProductConcept({ kind }: { kind: ProjectSignature }) {
  switch (kind) {
    case "terminal":
      return <DeploymentConcept />;
    case "mail":
      return <MailConcept />;
    case "audio":
      return <MusicConcept />;
    case "download":
      return <ApiConcept />;
  }
}

export default function ProjectsSection() {
  return (
    <section id="work" className="work-section section-shell" aria-labelledby="work-title">
      <header className="work-heading">
        <div>
          <p className="eyebrow">Built by Nub Coders</p>
          <h2 className="section-title" id="work-title">Selected Work</h2>
        </div>
        <p className="section-intro work-intro">
          Useful software, built from the ground up. A selection of the tools we make, ship, and keep improving.
        </p>
      </header>

      <div className="work-grid">
        {projects.map((project) => {
          const details = project.signature ? productDetails[project.signature] : undefined;

          return (
            <article className="work-card" key={project.idx}>
              {project.signature && details && (
                <figure className={`work-preview work-preview-${project.signature}`}>
                  <figcaption className="work-preview-caption">
                    <span>{details.preview}</span>
                    <span className="work-concept-label">Concept</span>
                  </figcaption>
                  <ProductConcept kind={project.signature} />
                </figure>
              )}

              <div className="work-card-content">
                <p className="work-category">
                  <span>{details?.category ?? "Software"}</span>
                  <span className="work-index" aria-hidden="true">/{project.idx}</span>
                </p>
                <h3 className="work-project-title">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    {project.name}
                  </a>
                </h3>
                <p className="work-description">{project.desc}</p>

                <ul className="work-tags" aria-label={`${project.name} technologies`}>
                  {project.tags.map((tag) => {
                    const techLink = getTechLink(tag);

                    return (
                      <li key={tag}>
                        {techLink ? (
                          <a
                            href={techLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open the official website for ${techLink.label}`}
                          >
                            {tag}
                          </a>
                        ) : <span>{tag}</span>}
                      </li>
                    );
                  })}
                </ul>

                <div className="work-actions">
                  <a
                    className="work-live-link"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name} live app`}
                  >
                    Open live app <ArrowIcon />
                  </a>
                  {project.codeUrl && (
                    <a
                      className="work-source-link"
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name} source code`}
                    >
                      Source code <ArrowIcon />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
