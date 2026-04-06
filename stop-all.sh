#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 Stopping all VeraGenesi services...${NC}\n"

# Kill Expo dev server and Metro bundler
echo -e "${YELLOW}Stopping Expo / Metro...${NC}"
pkill -f "expo start" 2>/dev/null && echo -e "${GREEN}✓ Expo stopped${NC}" || echo "  (not running)"
pkill -f "node.*metro" 2>/dev/null && echo -e "${GREEN}✓ Metro stopped${NC}" || echo "  (not running)"
pkill -f "node.*expo" 2>/dev/null && echo -e "${GREEN}✓ Node expo stopped${NC}" || echo "  (not running)"

# Kill backend (nodemon + node)
echo -e "${YELLOW}Stopping backend API...${NC}"
pkill -f "nodemon src/index.js" 2>/dev/null && echo -e "${GREEN}✓ Nodemon stopped${NC}" || echo "  (not running)"
pkill -f "node src/index.js" 2>/dev/null && echo -e "${GREEN}✓ Node API stopped${NC}" || echo "  (not running)"

# Release ports if still held
for port in 3000 8081; do
  pid=$(lsof -ti :$port -sTCP:LISTEN 2>/dev/null) && \
    kill $pid 2>/dev/null && \
    echo -e "${GREEN}✓ Released port $port${NC}" || true
done

# Stop Docker containers (postgres)
echo -e "\n${YELLOW}Stopping Docker services...${NC}"
cd "$(dirname "$0")" || exit
if docker compose ps --quiet 2>/dev/null | grep -q .; then
  docker compose stop postgres 2>/dev/null && \
    echo -e "${GREEN}✓ Postgres stopped${NC}" || \
    echo "  (error stopping postgres)"
else
  echo "  (no running compose services)"
fi

echo -e "\n${GREEN}✓ All services stopped${NC}"
echo -e "\n${YELLOW}Useful commands:${NC}"
echo -e "  ${GREEN}docker compose down${NC}        - Remove containers entirely"
echo -e "  ${GREEN}docker compose ps${NC}          - Check Docker status"
echo -e "  ${GREEN}lsof -i :3000${NC}              - Check if port 3000 is in use"
echo -e "  ${GREEN}lsof -i :8081${NC}              - Check if port 8081 is in use"
