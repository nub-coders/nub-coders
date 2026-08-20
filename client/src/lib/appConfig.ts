export type AppConfig = {
  turnstileSiteKey: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: Partial<AppConfig> | null;
  }
}

/**
 * Public config injected into the HTML by the server at request time.
 * Falls back to a build-time Vite var so `vite dev`/tests work standalone.
 */
export const appConfig: AppConfig = {
  turnstileSiteKey:
    (typeof window !== "undefined" ? window.__APP_CONFIG__?.turnstileSiteKey : "") ||
    (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ||
    "",
};
