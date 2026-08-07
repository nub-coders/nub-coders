import React, { useRef, useState, useEffect } from 'react';
import type { GitHubStats } from '@/hooks/useGitHubStats';
import './LanguageWidget.css';

interface LanguageWidgetProps {
  data: GitHubStats;
}

interface StatItem {
  label: string;
  value: number;
}

const LangSlide = ({ languages }: { languages: GitHubStats['topLanguages'] }) => (
  <ul className="lang-list">
    {languages.slice(0, 6).map((lang) => (
      <li key={lang.name} className="lang-row">
        <div className="lang-row-head">
          <span className="lang-row-name">{lang.name}</span>
          <span className="lang-row-pct">{lang.percentage}%</span>
        </div>
        <div className="lang-bar">
          <div className="lang-bar-fill" style={{ width: `${lang.percentage}%` }} />
        </div>
      </li>
    ))}
  </ul>
);

const StatSlide = ({ items }: { items: StatItem[] }) => (
  <div className="stat-slide">
    {items.map((s) => (
      <div key={s.label} className="stat-slide-item">
        <span className="stat-slide-num">{s.value}</span>
        <span className="stat-slide-label">{s.label}</span>
      </div>
    ))}
  </div>
);

export const LanguageWidget: React.FC<LanguageWidgetProps> = ({ data }) => {
  const [index, setIndex] = useState(0);

  const slides = [
    { key: 'langs', node: <LangSlide languages={data.topLanguages} /> },
    { key: 'engagement', node: <StatSlide items={[{ label: '⭐ Stars', value: data.totalStars }, { label: '🔥 Commits', value: data.totalCommits }]} /> },
    { key: 'contrib', node: <StatSlide items={[{ label: '✅ PRs Merged', value: data.prsMerged }, { label: '🐞 Open Issues', value: data.issuesOpen }]} /> },
  ];
  const last = slides.length - 1;

  const clamp = (n: number) => Math.max(0, Math.min(last, n));
  const touchY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const lockedRef = useRef(false);

  // keep the ref in sync so the stable wheel listener reads the live index
  useEffect(() => { indexRef.current = index; }, [index]);

  // Trap the wheel: advance one slide per gesture, then lock for the transition
  // so momentum bursts don't fly through every slide. Release at the ends so the
  // page can scroll. Native non-passive listener — React onWheel can't preventDefault.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0;
      const i = indexRef.current;
      if (down ? i >= last : i <= 0) return; // release to the page at the ends

      e.preventDefault();
      if (lockedRef.current || Math.abs(e.deltaY) < 4) return; // swallow momentum
      lockedRef.current = true;
      setIndex(clamp(i + (down ? 1 : -1)));
      window.setTimeout(() => { lockedRef.current = false; }, 520);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [last]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(dy) > 40) setIndex((prev) => clamp(prev + (dy < 0 ? 1 : -1)));
    touchY.current = null;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((p) => clamp(p + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((p) => clamp(p - 1)); }
  };

  return (
    <div className="lang-widget">
      <div className="lang-cards">
        <div
          className="lang-card-container"
          ref={containerRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="GitHub stats"
          tabIndex={0}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onKeyDown={onKeyDown}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.key}
              className="lang-card"
              aria-hidden={i !== index}
              style={{
                transform: `translateY(${(i - index) * 100}%)`,
                opacity: i === index ? 1 : 0.25,
                pointerEvents: i === index ? 'auto' : 'none',
              }}
            >
              {slide.node}
            </div>
          ))}
        </div>

        <div className="lang-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              onClick={() => setIndex(i)}
              className="lang-dot"
              aria-label={`View slide ${i + 1}`}
              aria-current={i === index}
              style={{
                height: i === index ? '42px' : '10px',
                backgroundColor: i === index ? 'var(--text)' : 'var(--text-muted)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
