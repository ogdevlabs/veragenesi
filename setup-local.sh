#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Starting Docker services...${NC}"

# Start Docker Compose in the root directory
cd "$(dirname "$0")"
docker-compose up -d

if [ $? -ne 0 ]; then
  echo -e "${RED}✗ Failed to start Docker services${NC}"
  echo -e "${YELLOW}Make sure Docker Desktop is running${NC}"
  exit 1
fi

echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"

# Wait for PostgreSQL to be ready
for i in {1..30}; do
  if docker exec vera_genesi_db pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL is ready!${NC}"
    break
  fi
  if [ $i -eq 30 ]; then
    echo -e "${RED}✗ PostgreSQL failed to start${NC}"
    echo "Check logs: docker-compose logs postgres"
    exit 1
  fi
  echo "  Attempt $i/30..."
  sleep 2
done

echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install

if [ $? -ne 0 ]; then
  echo -e "${RED}✗ npm install failed${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${GREEN}cd backend && npm run dev${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  ${GREEN}docker-compose logs -f${NC}     - View database logs"
echo -e "  ${GREEN}docker-compose ps${NC}          - Check service status"
echo -e "  ${GREEN}docker-compose down${NC}        - Stop all services"
echo -e "  ${GREEN}make db-shell${NC}              - Connect to database"

