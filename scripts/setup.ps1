# Agent Labs OS Development Setup Script (PowerShell)
# This script sets up the development environment for Agent Labs OS

Write-Host "🚀 Setting up Agent Labs OS development environment..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$nodeVersionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeVersionNumber -lt 18) {
    Write-Host "❌ Node.js version 18+ is required. Current version: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install workspace dependencies
Write-Host "📦 Installing workspace dependencies..." -ForegroundColor Yellow
npm run setup:packages
npm run setup:apps

# Create environment files
Write-Host "🔧 Creating environment files..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
    } else {
        Write-Host "⚠️ .env.example not found, creating basic .env file" -ForegroundColor Yellow
        @"
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agentlabs
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=dev-jwt-secret-change-in-production
NEXTAUTH_SECRET=dev-nextauth-secret-change-in-production

# Blockchain
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your-private-key
CROSSMINT_API_KEY=your-crossmint-key

# AI Services
MISTRAL_API_KEY=your-mistral-key
ELEVENLABS_API_KEY=your-elevenlabs-key
OPENAI_API_KEY=your-openai-key

# Coral Protocol
CORAL_API_URL=https://api.coralprotocol.org
CORAL_API_KEY=your-coral-key

# External Services
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
"@ | Out-File -FilePath ".env" -Encoding UTF8
    }
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
npm run docker:up

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Run database migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
# npm run migrate

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
npm run test

Write-Host "✅ Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 You can now start developing:" -ForegroundColor Cyan
Write-Host "   npm run dev          # Start all services" -ForegroundColor White
Write-Host "   npm run dev:studio   # Start Agent Studio" -ForegroundColor White
Write-Host "   npm run dev:gateway  # Start Gateway API" -ForegroundColor White
Write-Host "   npm run dev:registry # Start Agent Registry" -ForegroundColor White
Write-Host "   npm run dev:dashboard # Start Dashboard" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md for quick start" -ForegroundColor White
Write-Host "   - docs/development-strategy.md for development guidelines" -ForegroundColor White
Write-Host "   - docs/architecture.md for system architecture" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Services:" -ForegroundColor Cyan
Write-Host "   - Studio UI: http://localhost:3000" -ForegroundColor White
Write-Host "   - Gateway API: http://localhost:3001" -ForegroundColor White
Write-Host "   - Registry: http://localhost:3002" -ForegroundColor White
Write-Host "   - Dashboard: http://localhost:3003" -ForegroundColor White
Write-Host "   - PostgreSQL: localhost:5432" -ForegroundColor White
Write-Host "   - Redis: localhost:6379" -ForegroundColor White
