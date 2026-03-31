#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 Stopping all VeraGenesi services...${NC}\n"

# Kill Expo dev server
echo -e "${YELLOW}Stopping Expo dev server...${NC}"
pkill -f "expo start" 2>/dev/null && echo -e "${GREEN}✓ Expo stopped${NC}" || echo "  (not running)"

# Kill Node processes on metro/expo ports
echo -e "${YELLOW}Stopping dev servers...${NC}"
pkill -f "node.*metro" 2>/dev/null && echo -e "${GREEN}✓ Metro stopped${NC}" || echo "  (not running)"
pkill -f "node.*expo" 2>/dev/null && echo -e "${GREEN}✓ Node expo stopped${NC}" || echo "  (not running)"

# Stop Docker containers
echo -e "\n${YELLOW}Stopping Docker services...${NC}"
if command -v docker-compose &> /dev/null; then
  cd "$(dirname "$0")" || exit
  docker-compose down 2>/dev/null && \
    echo -e "${GREEN}✓ Docker services stopped${NC}" || \
    echo "  (docker-compose not running or not found)"
else
  echo "  (docker-compose not found)"
fi

echo -e "\n${GREEN}✓ All services stopped${NC}"
echo -e "\n${YELLOW}Useful commands:${NC}"
echo -e "  ${GREEN}docker-compose down${NC}        - Stop all Docker services"
echo -e "  ${GREEN}docker-compose ps${NC}          - Check Docker status"
echo -e "  ${GREEN}lsof -i :3000${NC}              - Check if port 3000 is in use"
echo -e "  ${GREEN}lsof -i :8081${NC}              - Check if port 8081 is in use"
echo -e "  ${GREEN}pkill -f 'npm start'${NC}       - Kill any npm start process"
