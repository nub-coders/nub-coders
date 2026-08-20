export type ClientConfig = {
  turnstileSiteKey: string;
};

/**
 * Config handed to the browser at request time (not baked in at build time), so
 * a single `.env` drives both the server and the client and keys can change
 * without a rebuild. Only ever put public values here.
 *
 * `process.env` is read per call, not at module scope: esbuild's code splitting
 * can hoist this module's evaluation above `import "dotenv/config"` in
 * server/index.ts, which would otherwise capture an empty value.
 */
export function clientConfigScript(nonce?: string): string {
  const config: ClientConfig = {
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || "",
  };
  const json = JSON.stringify(config).replace(/</g, "\\u003c");
  const nonceAttr = nonce ? ` nonce="${nonce}"` : "";
  return `<script${nonceAttr}>window.__APP_CONFIG__ = ${json};</script>`;
}
