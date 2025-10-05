.PHONY: help install dev build start docker-up docker-down docker-build db-reset db-seed test

help:
	@echo "Taslim - Quran & Duas Web App"
	@echo ""
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make docker-build - Build Docker image"
	@echo "  make db-reset     - Reset database and reseed"
	@echo "  make db-seed      - Seed database"
	@echo "  make test         - Run tests"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-build:
	docker compose build

db-reset:
	npm run db:reset

db-seed:
	npm run db:seed

test:
	npm test

test-e2e:
	npm run test:e2e
