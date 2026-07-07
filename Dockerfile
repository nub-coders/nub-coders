# ── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install all deps (incl. dev) against the committed lockfile for a reproducible build
COPY package*.json ./
RUN npm ci

# Build the client (dist/public) and bundle the server (dist/index.js)
COPY . .
RUN npm run build

# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S portfolio -u 1001 -G nodejs

# Production dependencies only
COPY --chown=portfolio:nodejs package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Built artifacts from the builder stage
COPY --chown=portfolio:nodejs --from=builder /app/dist ./dist

USER portfolio

EXPOSE 8080

# Liveness probe against the dedicated /healthz endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget -q -O- http://127.0.0.1:8080/healthz || exit 1

CMD ["node", "dist/index.js"]
