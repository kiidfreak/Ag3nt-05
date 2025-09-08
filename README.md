# Agent Labs OS

> **The Canva for Agents** — A modular lab OS that makes multi-agent systems discoverable, composable, and deployable across real-world domains (trust, finance, compliance, human-in-the-loop).

## 🎯 Executive Summary

Agent Labs OS is a modular platform for building, publishing, renting, and operating reusable agents. The platform ships as:

- **Registry + Marketplace** for agents (discover, rent, stake reputation)
- **Studio** for visual orchestration and debugging (drag-drop agent flows)
- **Runtime / Gateway** that runs sessions, enforces policy, and mediates payments (Solana/Crossmint)
- **Domain Labs** (Trust Lab, Finance Lab, Compliance Lab, Ops Lab) — each a vertical with curated agents and demo apps

**Core Thesis**: Deliver a small, working vertical in the hackathon (e.g., Compliance Lab with Consent Agent + Trust Agent) while presenting the platform vision as extensible to other domains.

## 🏗️ Architecture Overview

```
[Developer / Creator] 
     ↓ publishes
[Agent Registry (Agent Labs)] <--> [Coral Protocol] <--> [External Agents / Vendors]
     ↓                                   ↑
[Studio UI (orchestration)]              |
     ↓                                   |
[Session Runtime / Gateway (Auth, Policy, Payments)] 
     ↓                                   |
[On-chain Settlement (Solana / Crossmint)]+-->[Reputation Ledger / Time-locks]
     ↓
[Dashboard (Human-in-loop approvals, logs, analytics)]
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Solana CLI
- Coral Protocol setup

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/agent-labs-os.git
cd agent-labs-os

# Install dependencies
npm run setup

# Start development environment
npm run docker:up
npm run dev
```

### Development Commands
```bash
# Start all services
npm run dev

# Start individual services
npm run dev:gateway    # Backend API
npm run dev:studio     # Agent Studio UI
npm run dev:registry   # Agent Registry
npm run dev:dashboard  # Monitoring Dashboard

# Build for production
npm run build

# Run tests
npm run test
npm run test:e2e

# Code quality
npm run lint
npm run format
npm run type-check
```

## 📁 Project Structure

```
agent-labs-os/
├── 📁 apps/                          # Main applications
│   ├── 📁 studio/                    # Agent Studio UI (React)
│   ├── 📁 dashboard/                 # Monitoring Dashboard (React)
│   ├── 📁 registry/                  # Agent Registry (Next.js)
│   └── 📁 gateway/                   # Session Runtime/Gateway (Node.js)
├── 📁 packages/                      # Shared packages
│   ├── 📁 ui/                        # Shared UI components
│   ├── 📁 types/                     # TypeScript type definitions
│   ├── 📁 utils/                     # Utility functions
│   ├── 📁 coral-client/              # Coral Protocol integration
│   ├── 📁 solana-client/             # Solana blockchain client
│   └── 📁 agent-sdk/                 # Agent development SDK
├── 📁 agents/                        # Agent implementations
│   ├── 📁 consent-agent/             # Consent management agent
│   ├── 📁 trust-agent/               # Trust and reputation agent
│   ├── 📁 payment-agent/             # Payment processing agent
│   └── 📁 templates/                 # Agent templates
├── 📁 infrastructure/                # Infrastructure as code
│   ├── 📁 docker/                    # Docker configurations
│   ├── 📁 k8s/                       # Kubernetes manifests
│   ├── 📁 terraform/                 # Infrastructure provisioning
│   └── 📁 monitoring/                # Monitoring and logging
├── 📁 docs/                          # Documentation
│   ├── 📁 api/                       # API documentation
│   ├── 📁 guides/                    # Development guides
│   └── 📁 architecture/              # Architecture documentation
├── 📁 scripts/                       # Build and deployment scripts
├── 📁 tests/                         # Test suites
└── 📁 tools/                         # Development tools
```

## 🛠️ Tech Stack

- **Orchestration**: Coral Protocol (MCP) for agent threads
- **LLM & Reasoning**: Mistral family
- **Voice**: ElevenLabs for TTS/voice consent flows
- **Payments & Assets**: Solana + Crossmint (SPL micro-credits, mintable reputation NFTs)
- **Frontend**: React + Tailwind (Agent Studio UI)
- **Backend**: Node/TypeScript server for Gateway + Coral client
- **Infrastructure**: Vercel/Netlify for demo frontend; Heroku/Render or small k8s for runtime

## 📋 Roadmap

### Phase 0 — Pre-hack (days 0–3)
- [x] Scaffold GitHub repo + README
- [x] Deploy minimal Coral client demo
- [x] Create one demo agent (Consent Agent) + README + minimal UI
- [x] Prepare pitch deck, 2-min demo script, and 1-page architecture diagram

### Phase 1 — Hackathon MVP (days 4–7) 🎯
**Deliverable**: Compliance Lab: Consent Agent + Trust Agent + simple dashboard

- [ ] Integrations: Coral for orchestration, Mistral for reasoning, ElevenLabs for voice consent, Crossmint / Solana for micro-payments
- [ ] UX: Web UI with "Approve / Reject" voice button + agent activity log
- [ ] Repo: public GitHub, live demo (Vercel/Netlify), slides + 2-min video

### Phase 2 — Mini-Platform (month 1–3)
- [ ] Agent Registry (publish & discover), billing primitives (SPL micro-credits)
- [ ] Developer templates & Spaces-like demo environment for rapid prototyping

### Phase 3 — Vertical expansion (month 3–9)
- [ ] Launch Finance Lab (rentable micro-agent marketplace), Trust Lab (reputation + staking), Ops Lab (human validators)
- [ ] Add analytics, support for model fine-tuning hooks (Mistral API or similar)

### Phase 4 — Production readiness (month 9–18)
- [ ] Harden security, add enterprise features (RBAC, audit trails), scale the registry
- [ ] Partnerships (Crossmint, ElevenLabs, infra)

## 🎬 Demo Script (2 minutes)

1. **Open Studio UI (15s)**: Drag "Consent Agent" and "Payment Agent" into flow
2. **Run session (30s)**: Simulate transaction where Agent A requests data access; Consent Agent triggers voice consent via ElevenLabs and displays "Approve / Reject" button
3. **Settlement (20s)**: On approve, Gateway mints micro-credit transfer via Crossmint/Solana and records reputation update
4. **Show audit log & time-lock (15s)**: Reveal on-chain anchor or log showing action and time-locked release
5. **Wrap (10s)**: "Agent Labs OS — modular, reusable, and ready to scale across trust, finance, and compliance"

## 📊 Success Metrics (Hackathon)

- [ ] Working demo (Consent Agent + Trust Agent) — 100% required
- [ ] Public GitHub with clear README + deploy link
- [ ] Live demo: < 2 min, reproducible by judges
- [ ] 3 automated end-to-end tests (consent flow, payment flow, reputation update)
- [ ] UX: clear human-in-loop approval within 10s

## 🐳 Docker Development

```bash
# Start all services with Docker
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Rebuild containers
npm run docker:build
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Run tests for specific workspace
npm run test --workspace=apps/studio
```

## 📚 Documentation

- [Development Strategy](docs/development-strategy.md)
- [Architecture Documentation](docs/architecture.md)
- [Tech Stack](docs/tech-stack.md)
- [Roadmap](docs/roadmap.md)
- [Demo Script](docs/demo-script.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Architecture Documentation](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Coral Protocol](https://docs.coralprotocol.org)
- [Demo Application](https://agent-labs-demo.vercel.app)

## 📞 Contact

- **Project Lead**: [Your Name]
- **Email**: [your.email@example.com]
- **Discord**: [Your Discord Handle]
- **Twitter**: [@YourTwitterHandle]