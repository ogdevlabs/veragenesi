#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if docker-compose is running
check_docker() {
  if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ docker-compose not found${NC}"
    echo -e "${YELLOW}Please install Docker Desktop and try again${NC}"
    exit 1
  fi

  # Check if postgres container is running
  if ! docker ps --filter "name=vera_genesi_db" --filter "status=running" | grep -q vera_genesi_db; then
    echo -e "${BLUE}🐳 Starting PostgreSQL container...${NC}"
    
    cd "$(dirname "$0")/.." || exit 1
    docker-compose up -d
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}✗ Failed to start docker-compose${NC}"
      echo -e "${YELLOW}Make sure Docker Desktop is running${NC}"
      exit 1
    fi

    echo -e "${BLUE}⏳ Waiting for PostgreSQL...${NC}"
    
    # Wait for postgres to be healthy
    for i in {1..30}; do
      if docker exec vera_genesi_db pg_isready -U postgres > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
        break
      fi
      if [ $i -eq 30 ]; then
        echo -e "${RED}✗ PostgreSQL failed to start${NC}"
        exit 1
      fi
      sleep 1
    done
  else
    echo -e "${GREEN}✓ PostgreSQL already running${NC}"
  fi
}

check_docker
