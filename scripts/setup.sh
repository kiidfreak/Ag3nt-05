#!/bin/bash

# Agent Labs OS Development Setup Script
# This script sets up the development environment for Agent Labs OS

set -e

echo "🚀 Setting up Agent Labs OS development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker is installed"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker Compose is installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install workspace dependencies
echo "📦 Installing workspace dependencies..."
npm run setup:packages
npm run setup:apps

# Create environment files
echo "🔧 Creating environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "✅ .env file already exists"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
npm run docker:up

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
# npm run migrate

# Run tests
echo "🧪 Running tests..."
npm run test

echo "✅ Development environment setup complete!"
echo ""
echo "🎉 You can now start developing:"
echo "   npm run dev          # Start all services"
echo "   npm run dev:studio   # Start Agent Studio"
echo "   npm run dev:gateway  # Start Gateway API"
echo "   npm run dev:registry # Start Agent Registry"
echo "   npm run dev:dashboard # Start Dashboard"
echo ""
echo "📚 Documentation:"
echo "   - README.md for quick start"
echo "   - docs/development-strategy.md for development guidelines"
echo "   - docs/architecture.md for system architecture"
echo ""
echo "🔗 Services:"
echo "   - Studio UI: http://localhost:3000"
echo "   - Gateway API: http://localhost:3001"
echo "   - Registry: http://localhost:3002"
echo "   - Dashboard: http://localhost:3003"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
