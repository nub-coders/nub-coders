import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export type TurnstileRenderOptions = {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
};

export type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string | undefined;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Shared across every mount so the third-party script is only requested once.
let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Allow a later mount to retry (e.g. after a transient network failure).
      scriptPromise = null;
      script.remove();
      reject(new Error("Failed to load Turnstile"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export type TurnstileHandle = {
  /** Discards the current token and re-arms the challenge. */
  reset: () => void;
};

type Props = {
  siteKey: string;
  /** Receives a fresh token, or `null` whenever the current one stops being valid. */
  onToken: (token: string | null) => void;
  onError?: () => void;
  action?: string;
};

/**
 * Cloudflare Turnstile widget, rendered explicitly so React owns its lifecycle.
 *
 * Tokens are single-use and expire after a few minutes, so the parent must treat
 * `onToken(null)` as "not verified" and call `reset()` after every submit attempt.
 */
const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile(
  { siteKey, onToken, onError, action },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Callbacks live in a ref so parent re-renders never re-create the widget.
  const callbacksRef = useRef({ onToken, onError });

  useEffect(() => {
    callbacksRef.current = { onToken, onError };
  }, [onToken, onError]);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        if (!widgetIdRef.current || !window.turnstile) return;
        window.turnstile.reset(widgetIdRef.current);
        callbacksRef.current.onToken(null);
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current =
          window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action,
            theme: "dark",
            callback: (token) => callbacksRef.current.onToken(token),
            "error-callback": () => {
              callbacksRef.current.onToken(null);
              callbacksRef.current.onError?.();
            },
            "expired-callback": () => callbacksRef.current.onToken(null),
            "timeout-callback": () => callbacksRef.current.onToken(null),
          }) ?? null;
      })
      .catch(() => {
        if (!cancelled) callbacksRef.current.onError?.();
      });

    return () => {
      cancelled = true;
      const widgetId = widgetIdRef.current;
      widgetIdRef.current = null;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, action]);

  return <div className="turnstile-widget" ref={containerRef} />;
});

export default Turnstile;
