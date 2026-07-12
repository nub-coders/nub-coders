import { useEffect, useState } from "react";
import "../pages/splash.css";

/* PyTgCalls-style splash intro: tech badges fly in from orbit positions and
   converge on a glowing call-UI center (video / mic / leave), then the whole
   overlay fades out — mirroring https://pytgcalls.github.io. Plays once per
   tab session; skipped entirely under prefers-reduced-motion. */

type Orbit = { label: string; color: string; x: string; y: string; xm: string; ym: string };

// Positions mirror the site's pentagon layout (desktop x/y, mobile xm/ym halved).
const ORBIT: Orbit[] = [
  { label: "TS", color: "#3178c6", x: "0%", y: "-300%", xm: "0%", ym: "-150%" },
  { label: "Rx", color: "#61dafb", x: "285%", y: "-93%", xm: "143%", ym: "-47%" },
  { label: "Py", color: "#ffd43b", x: "176%", y: "243%", xm: "88%", ym: "122%" },
  { label: "Go", color: "#2ec594", x: "-176%", y: "243%", xm: "-88%", ym: "122%" },
  { label: "Dk", color: "#2496ed", x: "-285%", y: "-93%", xm: "-143%", ym: "-47%" },
];

export default function Splash() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const seen =
    typeof window !== "undefined" && sessionStorage.getItem("splashSeen") === "1";

  const [show, setShow] = useState(!reduced && !seen);

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("splashSeen", "1");
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="splash" onClick={() => setShow(false)} aria-hidden="true">
      {ORBIT.map((o) => (
        <div
          key={o.label}
          className="animated-icon"
          style={
            {
              "--pos-x": o.x,
              "--pos-y": o.y,
              "--pos-xm": o.xm,
              "--pos-ym": o.ym,
              color: o.color,
            } as React.CSSProperties
          }
        >
          {o.label}
        </div>
      ))}

      <div className="text">
        <div className="audio-shader">
          <div className="shader" data-id="video">
            <svg viewBox="0 0 24 24" width="42" height="42" fill="currentColor">
              <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z" />
            </svg>
          </div>
          <div className="shader" data-id="microphone">
            <svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
              <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V22h2v-3.08A7 7 0 0 0 19 12h-2Z" />
            </svg>
          </div>
          <div className="shader" data-id="quit">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
              <path d="M12 9c-2 0-3.9.3-5.6 1L4 12.6a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.3.1l2.2-1.6a1 1 0 0 0 .4-.8v-1.8c1.2-.3 2.6-.3 4 0v1.8a1 1 0 0 0 .4.8l2.2 1.6a1 1 0 0 0 1.3-.1l2-2a1 1 0 0 0 0-1.4l-2.4-2.6C15.9 9.3 14 9 12 9Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
