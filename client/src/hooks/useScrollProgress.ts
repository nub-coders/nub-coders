import { useEffect } from "react";

/**
 * Drives the top scroll-progress bar by writing `transform: scaleX(ratio)`
 * directly to the `.scroll-progress` element on scroll, throttled with
 * requestAnimationFrame. No React state → no per-scroll re-renders.
 */
export const useScrollProgress = () => {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    if (!bar) return;

    let ticking = false;

    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const ratio = max > 0 ? Math.min(el.scrollTop / max, 1) : 0;
      bar.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
};
