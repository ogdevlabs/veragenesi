#!/usr/bin/env bash
# launch.sh — start everything for local development
#   - Postgres (Docker)
#   - Backend API (Node/nodemon)
#   - Expo (web + iOS simulator + Android emulator)
#
# Usage:
#   ./launch.sh           # web + iOS + Android
#   ./launch.sh --web     # web only
#   ./launch.sh --ios     # iOS simulator only
#   ./launch.sh --android # Android emulator only

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${BLUE}[launch]${NC} $*"; }
ok()   { echo -e "${GREEN}[launch]${NC} $*"; }
warn() { echo -e "${YELLOW}[launch]${NC} $*"; }
err()  { echo -e "${RED}[launch]${NC} $*"; }

# ── Cleanup on exit ──────────────────────────────────────────────────────────
BACKEND_PID=""
cleanup() {
  echo ""
  log "Shutting down..."
  if [[ -n "$BACKEND_PID" ]]; then
    # Kill the entire process subtree: bash subshell → npm → nodemon → node
    pkill -P "$BACKEND_PID" 2>/dev/null || true
    kill "$BACKEND_PID" 2>/dev/null || true
    ok "Backend stopped"
  fi
  ok "Done. Postgres is still running — use 'docker compose stop postgres' to stop it."
}
trap cleanup EXIT INT TERM

# ── 1. Determine Expo platform flags ────────────────────────────────────────
PLATFORMS="${1:-}"
if [[ -z "$PLATFORMS" ]]; then
  EXPO_FLAGS="--web" #"--web --ios --android"
else
  EXPO_FLAGS="$*"
fi

# ── 2. Check Docker is running ───────────────────────────────────────────────
if ! docker info > /dev/null 2>&1; then
  err "Docker is not running. Start Docker Desktop and try again."
  exit 1
fi

# ── 3. Start Postgres ────────────────────────────────────────────────────────
log "Starting Postgres..."
docker compose -f "$ROOT/docker-compose.yml" up -d postgres

log "Waiting for Postgres to be ready..."
for i in $(seq 1 30); do
  if docker exec vera_genesi_db pg_isready -U postgres > /dev/null 2>&1; then
    ok "Postgres is ready"
    break
  fi
  if [[ $i -eq 30 ]]; then
    err "Postgres failed to become healthy after 60s"
    exit 1
  fi
  sleep 2
done

# ── 4. Install dependencies (if needed) ─────────────────────────────────────
if [[ ! -d "$ROOT/backend/node_modules" ]]; then
  log "Installing backend dependencies..."
  (cd "$ROOT/backend" && npm install)
fi

if [[ ! -d "$ROOT/frontend/node_modules" ]]; then
  log "Installing frontend dependencies..."
  (cd "$ROOT/frontend" && npm install)
fi

# ── 5. Guard against stale processes on ports ───────────────────────────────
if lsof -i :3000 -sTCP:LISTEN > /dev/null 2>&1; then
  err "Port 3000 is already in use. Run './stop-all.sh' first."
  exit 1
fi
if lsof -i :8081 -sTCP:LISTEN > /dev/null 2>&1; then
  err "Port 8081 is already in use. Run './stop-all.sh' first."
  exit 1
fi

# ── 6. Start backend in background ──────────────────────────────────────────
log "Starting backend API on :3000 ..."

# Source .env if present so nodemon picks up DB credentials
ENV_FILE="$ROOT/backend/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  warn "No backend/.env found — creating from defaults"
  cat > "$ENV_FILE" <<'ENVEOF'
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vera_genesi_dev
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=local-dev-secret-change-me
ENVEOF
  ok "Created backend/.env (update JWT_SECRET before shipping)"
fi

(cd "$ROOT/backend" && npm run dev) &
BACKEND_PID=$!
ok "Backend PID=$BACKEND_PID"

# Wait for backend to be actually ready
log "Waiting for backend to be ready on :3000 ..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
    ok "Backend is ready"
    break
  fi
  if [[ $i -eq 30 ]]; then
    err "Backend failed to start after 60s — check logs above"
    exit 1
  fi
  sleep 2
done

# ── 7. Start Expo (all platforms in one Metro process) ───────────────────────
log "Starting Expo with flags: $EXPO_FLAGS"
echo ""
echo -e "  ${GREEN}Web${NC}     → http://localhost:8081"
echo -e "  ${GREEN}iOS${NC}     → opens in Simulator (press ${YELLOW}i${NC} in Expo prompt)"
echo -e "  ${GREEN}Android${NC} → opens in Emulator  (press ${YELLOW}a${NC} in Expo prompt)"
echo -e "  ${GREEN}API${NC}     → http://localhost:3000"
echo ""

cd "$ROOT/frontend"
# shellcheck disable=SC2086
npx expo start $EXPO_FLAGS
