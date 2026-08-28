import React, { useRef, useState } from 'react';
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

const SWIPE_THRESHOLD_PX = 40;
const NEXT_KEYS = ['ArrowRight', 'ArrowDown'];
const PREV_KEYS = ['ArrowLeft', 'ArrowUp'];

export const LanguageWidget: React.FC<LanguageWidgetProps> = ({ data }) => {
  const [index, setIndex] = useState(0);

  const slides = [
    { key: 'langs', label: 'Top languages', node: <LangSlide languages={data.topLanguages} /> },
    { key: 'engagement', label: 'Stars and commits', node: <StatSlide items={[{ label: '⭐ Stars', value: data.totalStars }, { label: '🔥 Commits', value: data.totalCommits }]} /> },
    { key: 'contrib', label: 'Pull requests and issues', node: <StatSlide items={[{ label: '✅ PRs Merged', value: data.prsMerged }, { label: '🐞 Open Issues', value: data.issuesOpen }]} /> },
  ];
  const last = slides.length - 1;

  const clamp = (n: number) => Math.max(0, Math.min(last, n));
  const touchX = useRef<number | null>(null);

  // The wheel is deliberately NOT handled. An earlier version called
  // preventDefault() on wheel to advance one slide per gesture, which stopped the
  // page dead for ~1.5s whenever the pointer happened to cross this card. The
  // dots, arrow keys, and horizontal swipe cover every input modality without
  // taking scrolling away from the user.

  // Horizontal swipe, not vertical: a vertical gesture is how you scroll a page
  // on touch, so claiming it here would be the mobile equivalent of the wheel
  // trap. Paired with `touch-action: pan-y` so the browser keeps vertical pans.
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) setIndex((prev) => clamp(prev + (dx < 0 ? 1 : -1)));
    touchX.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = NEXT_KEYS.includes(e.key) ? 1 : PREV_KEYS.includes(e.key) ? -1 : 0;
    if (step === 0) return;

    const target = clamp(index + step);
    // At either end the key isn't ours: let it through so ArrowDown scrolls the
    // page as usual instead of dead-ending on the last slide.
    if (target === index) return;

    e.preventDefault();
    setIndex(target);
  };

  return (
    <div className="lang-widget">
      <div className="lang-cards">
        <div
          className="lang-card-container"
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
              role="group"
              aria-roledescription="slide"
              aria-label={`${slide.label} (${i + 1} of ${slides.length})`}
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
              aria-label={slide.label}
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
