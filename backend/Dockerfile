# ── Stage 1: dependencies ─────────────────────────────────────────────────────
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Non-root user for least-privilege execution
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src/

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
