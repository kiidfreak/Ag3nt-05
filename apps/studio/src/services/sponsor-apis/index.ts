/**
 * Internet of Agents Hackathon @Solana Skyline - Sponsor APIs
 * Real API integrations with actual hackathon sponsors and partners
 */

// Actual Hackathon Sponsors & Their APIs
export const SPONSOR_APIS = {
  // Main Sponsor - Coral Protocol
  CORAL_PROTOCOL: {
    name: 'Coral Protocol',
    apis: ['Coral Server MCP', 'Coral Registry', 'Coral Studio', 'Agent Orchestration'],
    website: 'https://coralprotocol.ai',
    hackathonPresence: 'Main sponsor - Zero-trust API for Internet of Agents',
    description: 'Decentralized framework for secure, interoperable AI agent collaboration'
  },
  
  // AI/ML API
  AI_ML_API: {
    name: 'AI/ML API',
    apis: ['Text Models', 'Image Models', 'Vision Models', '100+ AI Models'],
    website: 'https://aimlapi.com',
    hackathonPresence: '500 coupons with $20 credits each (Promo: NYSOL)',
    description: 'Single API for all AI needs - text, image, and vision tasks'
  },
  
  // Crossmint
  CROSSMINT: {
    name: 'Crossmint',
    apis: ['Wallet API', 'Payment API', 'Tokenization', 'Web3 Infrastructure'],
    website: 'https://crossmint.com',
    hackathonPresence: 'Free staging access + Best Use of Crossmint prize',
    description: 'Full-stack blockchain infrastructure across 40+ blockchains'
  },
  
  // ElevenLabs
  ELEVENLABS: {
    name: 'ElevenLabs',
    apis: ['Voice Synthesis', 'Voice Cloning', 'Multilingual Speech', 'Real-time Voice'],
    website: 'https://elevenlabs.io',
    hackathonPresence: '200 coupons for 3 months Creator Plan free',
    description: 'Leading voice AI platform for lifelike, expressive speech synthesis'
  },
  
  // Mistral AI
  MISTRAL_AI: {
    name: 'Mistral AI',
    apis: ['Mistral Small', 'Mistral Medium', 'Mistral Large', 'Codestral'],
    website: 'https://mistral.ai',
    hackathonPresence: 'Free tier access + Best Use of Mistral AI prize',
    description: 'Advanced open and proprietary language models with strong reasoning'
  },
  
  // Lovable.dev
  LOVABLE_DEV: {
    name: 'Lovable.dev',
    apis: ['Vibe Coding', 'UI Generation', 'Backend Integration', 'Agent Mode'],
    website: 'https://lovable.dev',
    hackathonPresence: 'Free access for all participants',
    description: 'Vibe coding platform for building web & software from natural language'
  },
  
  // Nebius AI
  NEBIUS_AI: {
    name: 'Nebius AI',
    apis: ['AI Studio', 'Cloud Inference', 'Model Deployment', 'GPU Computing'],
    website: 'https://nebius.ai',
    hackathonPresence: '$25 credits for first 400 participants (Promo: LABLABAI)',
    description: 'Next-generation cloud platform for demanding AI workloads'
  },
  
  // Solana (Host)
  SOLANA: {
    name: 'Solana',
    apis: ['RPC API', 'Web3.js', 'Anchor', 'Metaplex', 'Payments'],
    website: 'https://solana.com',
    hackathonPresence: 'Host platform - Solana Skyline NYC venue',
    description: 'Fast, secure, and censorship-resistant blockchain for global adoption'
  }
};

// Hackathon-Specific API Integration Examples
export const API_INTEGRATIONS = {
  // Coral Protocol - Main Framework
  coral: {
    providers: ['Coral Server MCP', 'Coral Registry', 'Coral Studio'],
    useCase: 'Zero-trust agent orchestration and multi-agent collaboration'
  },
  
  // AI & ML Models
  ai_models: {
    providers: ['AI/ML API (100+ models)', 'Mistral AI (Small/Medium/Large)', 'Nebius AI Studio'],
    useCase: 'Intelligent agent reasoning and multimodal AI capabilities'
  },
  
  // Voice & Speech
  voice: {
    providers: ['ElevenLabs Voice Synthesis', 'AI/ML API Speech Models'],
    useCase: 'Lifelike voice agents with multilingual support'
  },
  
  // Web3 & Blockchain
  web3: {
    providers: ['Crossmint Wallet/Payment API', 'Solana RPC', 'Solana Payments'],
    useCase: 'Decentralized agent payments and Web3 integration'
  },
  
  // Development & UI
  development: {
    providers: ['Lovable.dev Vibe Coding', 'Coral Studio Visual Orchestration'],
    useCase: 'Rapid prototyping and visual agent workflow building'
  },
  
  // Cloud & Infrastructure
  cloud: {
    providers: ['Nebius AI Studio', 'Solana RPC', 'Coral Protocol Infrastructure'],
    useCase: 'Scalable agent deployment and cloud computing'
  }
};

// Hackathon Prize Categories
export const PRIZE_CATEGORIES = {
  CORAL_AGENT_BUILDER: {
    name: 'Coral Protocol Agent Builder Track',
    prizes: [
      { place: '1st', cash: '$5,000', coral: '$5,000 Coral vested' },
      { place: '2nd', cash: '$3,000', coral: '$3,000 Coral vested' },
      { place: '3rd', cash: '$2,000', coral: '$2,000 Coral vested' }
    ]
  },
  CORAL_APP_BUILDER: {
    name: 'Coral Protocol App Builder Track',
    prizes: [
      { place: '1st', cash: '$5,000', coral: '$5,000 Coral vested' },
      { place: '2nd', cash: '$3,000', coral: '$3,000 Coral vested' },
      { place: '3rd', cash: '$2,000', coral: '$2,000 Coral vested' }
    ]
  },
  SPONSOR_PRIZES: {
    CROSSMINT: { name: 'Best Use of Crossmint', prize: '$2,000 API credits' },
    MISTRAL: { name: 'Best Use of Mistral AI', prize: '$1,500 API credits' },
    ELEVENLABS: { name: 'Best Use of ElevenLabs', prize: '6 months Scale Plan' },
    NEBIUS: { name: 'Best Use of Nebius AI', prize: '$500 API credits' }
  }
};
