# ── Stage 1: build Expo web bundle ───────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app

# Accept the API URL at build time so it is baked into the static bundle
ARG EXPO_PUBLIC_API_URL=http://localhost:3000
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Export a production-ready static web build to /app/dist
RUN npx expo export --platform web --output-dir dist

# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA routing: unknown paths fall back to index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1
