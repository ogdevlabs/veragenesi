.PHONY: help setup start stop stop-all restart logs clean db-shell dev test launch launch-web launch-ios launch-android

help:
	@echo "VeraGenesi Development Commands"
	@echo ""
	@echo "  make launch         - Start everything: Postgres + backend + web + iOS + Android"
	@echo "  make launch-web     - Start everything, Expo web only"
	@echo "  make launch-ios     - Start everything, iOS simulator only"
	@echo "  make launch-android - Start everything, Android emulator only"
	@echo ""
	@echo "  make setup      - One-time setup (Docker + dependencies)"
	@echo "  make start      - Start Docker services"
	@echo "  make stop       - Stop Docker services"
	@echo "  make stop-all   - Stop everything (backend, frontend, Docker)"
	@echo "  make restart    - Restart Docker services"
	@echo "  make logs       - View Docker logs"
	@echo "  make clean      - Remove all data and containers"
	@echo "  make db-shell   - Connect to PostgreSQL CLI"
	@echo "  make dev        - Run backend dev server"
	@echo "  make test       - Run tests"

setup:
	@echo "🚀 Running setup..."
	@chmod +x setup-local.sh launch.sh
	@./setup-local.sh

launch:
	@chmod +x launch.sh
	@./launch.sh

launch-web:
	@chmod +x launch.sh
	@./launch.sh --web

launch-ios:
	@chmod +x launch.sh
	@./launch.sh --ios

launch-android:
	@chmod +x launch.sh
	@./launch.sh --android

start:
	@echo "🐳 Starting Docker services..."
	@docker-compose up -d
	@echo "⏳ Waiting for PostgreSQL..."
	@sleep 5
	@echo "✓ Services started"

stop:
	@echo "🛑 Stopping Docker services..."
	@docker-compose down

stop-all:
	@echo "🛑 Stopping all services..."
	@./stop-all.sh

restart: stop start
	@echo "✓ Services restarted"

dev:
	@cd backend && npm run dev

logs:
	@docker-compose logs -f

clean:
	@echo "🗑️  Removing all data..."
	@docker-compose down -v
	@rm -rf backend/node_modules
	@echo "✓ Cleaned"

db-shell:
	@docker exec -it vera_genesi_db psql -U postgres -d vera_genesi_dev

test:
	@cd backend && npm test

ps:
	@docker-compose ps
