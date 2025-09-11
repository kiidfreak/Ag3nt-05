export interface MockAgent {
  id: string;
  name: string;
  description?: string;
  type: 'basic' | 'coral' | 'solana' | 'custom' | 'collector' | 'synthesizer' | 'scorer' | 'auditor' | 'orchestrator';
  category: 'collector' | 'synthesizer' | 'scorer' | 'auditor' | 'orchestrator' | 'basic';
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  version: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
  _count: {
    sessions: number;
  };
  ports?: {
    input: Array<{
      id: string;
      type: 'input';
      dataType: string;
      label: string;
      required?: boolean;
    }>;
    output: Array<{
      id: string;
      type: 'output';
      dataType: string;
      label: string;
    }>;
  };
  industry?: string[];
  capabilities?: string[];
}

export interface MockSession {
  id: string;
  name?: string;
  status: 'active' | 'completed' | 'error' | 'paused';
  config?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  endedAt?: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
  agent: {
    id: string;
    name: string;
    type: string;
  };
  _count: {
    messages: number;
    events: number;
  };
}

export interface MockMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface MockFlow {
  id: string;
  name: string;
  description?: string;
  config: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
  nodes: MockFlowNode[];
}

export interface MockFlowNode {
  id: string;
  type: 'agent' | 'condition' | 'action' | 'input' | 'output';
  config: Record<string, any>;
  position: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
  flowId: string;
  agentId?: string;
}

// Mock data
export const mockAgents: MockAgent[] = [
  {
    id: 'agent-1',
    name: 'Basic Chat Agent',
    description: 'A simple conversational agent for basic interactions',
    type: 'basic',
    category: 'basic',
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: 'You are a helpful assistant.',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 5,
    },
  },
  {
    id: 'agent-2',
    name: 'Coral Protocol Agent',
    description: 'An agent specialized in Coral Protocol interactions',
    type: 'coral',
    category: 'basic',
    config: {
      coralApiKey: 'demo-key',
      network: 'devnet',
      features: ['nft-minting', 'token-transfers'],
    },
    status: 'active',
    version: '1.2.0',
    createdAt: '2025-01-08T09:30:00Z',
    updatedAt: '2025-01-08T11:15:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 12,
    },
  },
  {
    id: 'agent-3',
    name: 'Solana DeFi Agent',
    description: 'An agent for Solana DeFi operations',
    type: 'solana',
    category: 'basic',
    config: {
      rpcUrl: 'https://api.devnet.solana.com',
      walletAddress: 'demo-wallet-address',
      programs: ['serum', 'raydium'],
    },
    status: 'inactive',
    version: '0.9.0',
    createdAt: '2025-01-08T08:45:00Z',
    updatedAt: '2025-01-08T08:45:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 3,
    },
  },
  {
    id: 'agent-4',
    name: 'Compliance Agent',
    description: 'Automated compliance checking and reporting',
    type: 'custom',
    category: 'basic',
    config: {
      rules: ['kyc', 'aml', 'sanctions'],
      reporting: true,
      alerts: true,
    },
    status: 'active',
    version: '2.1.0',
    createdAt: '2025-01-08T07:20:00Z',
    updatedAt: '2025-01-08T12:30:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 8,
    },
  },
];

export const mockSessions: MockSession[] = [
  {
    id: 'session-1',
    name: 'Chat Session 1',
    status: 'active',
    config: {
      temperature: 0.7,
      maxMessages: 50,
    },
    metadata: {
      source: 'studio',
      tags: ['demo', 'chat'],
    },
    createdAt: '2025-01-08T14:00:00Z',
    updatedAt: '2025-01-08T14:15:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    agent: {
      id: 'agent-1',
      name: 'Basic Chat Agent',
      type: 'basic',
    },
    _count: {
      messages: 12,
      events: 3,
    },
  },
  {
    id: 'session-2',
    name: 'Coral NFT Session',
    status: 'completed',
    config: {
      network: 'devnet',
      autoApprove: false,
    },
    metadata: {
      source: 'studio',
      tags: ['nft', 'coral'],
    },
    createdAt: '2025-01-08T13:30:00Z',
    updatedAt: '2025-01-08T14:00:00Z',
    endedAt: '2025-01-08T14:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    agent: {
      id: 'agent-2',
      name: 'Coral Protocol Agent',
      type: 'coral',
    },
    _count: {
      messages: 8,
      events: 5,
    },
  },
  {
    id: 'session-3',
    name: 'Compliance Check',
    status: 'active',
    config: {
      strictMode: true,
      autoReport: false,
    },
    metadata: {
      source: 'studio',
      tags: ['compliance', 'kyc'],
    },
    createdAt: '2025-01-08T14:10:00Z',
    updatedAt: '2025-01-08T14:10:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    agent: {
      id: 'agent-4',
      name: 'Compliance Agent',
      type: 'custom',
    },
    _count: {
      messages: 3,
      events: 1,
    },
  },
];

export const mockFlows: MockFlow[] = [
  {
    id: 'flow-1',
    name: 'NFT Creation Flow',
    description: 'A complete flow for creating and minting NFTs',
    config: {
      version: '1.0.0',
      triggers: ['user_input'],
      steps: [
        {
          id: 'step-1',
          type: 'input',
          name: 'Get NFT Details',
        },
        {
          id: 'step-2',
          type: 'agent',
          name: 'Process Request',
          agentId: 'agent-2',
        },
        {
          id: 'step-3',
          type: 'action',
          name: 'Mint NFT',
        },
      ],
    },
    status: 'published',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        config: {
          name: 'NFT Details Input',
          fields: ['name', 'description', 'image'],
        },
        position: { x: 100, y: 100 },
        createdAt: '2025-01-08T10:00:00Z',
        updatedAt: '2025-01-08T10:00:00Z',
        flowId: 'flow-1',
      },
      {
        id: 'node-2',
        type: 'agent',
        config: {
          name: 'Coral Agent',
          settings: {
            temperature: 0.7,
          },
        },
        position: { x: 300, y: 100 },
        createdAt: '2025-01-08T10:00:00Z',
        updatedAt: '2025-01-08T10:00:00Z',
        flowId: 'flow-1',
        agentId: 'agent-2',
      },
      {
        id: 'node-3',
        type: 'action',
        config: {
          name: 'Mint NFT',
          action: 'mint_nft',
          parameters: {
            network: 'devnet',
          },
        },
        position: { x: 500, y: 100 },
        createdAt: '2025-01-08T10:00:00Z',
        updatedAt: '2025-01-08T10:00:00Z',
        flowId: 'flow-1',
      },
    ],
  },
  {
    id: 'flow-2',
    name: 'Compliance Lab Flow',
    description: 'Automated compliance checking workflow',
    config: {
      version: '1.1.0',
      triggers: ['transaction'],
      steps: [
        {
          id: 'step-1',
          type: 'input',
          name: 'Transaction Data',
        },
        {
          id: 'step-2',
          type: 'agent',
          name: 'Compliance Check',
          agentId: 'agent-4',
        },
        {
          id: 'step-3',
          type: 'condition',
          name: 'Approval Gate',
        },
      ],
    },
    status: 'draft',
    createdAt: '2025-01-08T11:00:00Z',
    updatedAt: '2025-01-08T11:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    nodes: [
      {
        id: 'node-4',
        type: 'input',
        config: {
          name: 'Transaction Input',
          fields: ['amount', 'recipient', 'purpose'],
        },
        position: { x: 100, y: 200 },
        createdAt: '2025-01-08T11:00:00Z',
        updatedAt: '2025-01-08T11:00:00Z',
        flowId: 'flow-2',
      },
      {
        id: 'node-5',
        type: 'agent',
        config: {
          name: 'Compliance Agent',
          settings: {
            strictMode: true,
          },
        },
        position: { x: 300, y: 200 },
        createdAt: '2025-01-08T11:00:00Z',
        updatedAt: '2025-01-08T11:00:00Z',
        flowId: 'flow-2',
        agentId: 'agent-4',
      },
      {
        id: 'node-6',
        type: 'condition',
        config: {
          name: 'Approval Gate',
          condition: 'compliance_passed',
        },
        position: { x: 500, y: 200 },
        createdAt: '2025-01-08T11:00:00Z',
        updatedAt: '2025-01-08T11:00:00Z',
        flowId: 'flow-2',
      },
    ],
  },
  {
    id: 'flow-3',
    name: 'Healthcare Diagnosis Flow',
    description: 'Complete patient intake to treatment recommendation flow',
    config: {
      version: '1.0.0',
      triggers: ['patient_input'],
      steps: [
        {
          id: 'step-1',
          type: 'collector',
          name: 'Intake Collector',
        },
        {
          id: 'step-2',
          type: 'synthesizer',
          name: 'Symptom Synthesizer',
        },
        {
          id: 'step-3',
          type: 'scorer',
          name: 'Risk Scorer',
        },
        {
          id: 'step-4',
          type: 'auditor',
          name: 'Fairness Auditor',
        },
        {
          id: 'step-5',
          type: 'orchestrator',
          name: 'Treatment Orchestrator',
        },
      ],
    },
    status: 'published',
    createdAt: '2025-01-08T11:00:00Z',
    updatedAt: '2025-01-08T11:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    nodes: [
      {
        id: 'node-h1',
        type: 'collector',
        config: {
          name: 'Patient Intake',
          dataSource: 'FHIR/HL7',
        },
        position: { x: 100, y: 100 },
        createdAt: '2025-01-08T11:00:00Z',
        updatedAt: '2025-01-08T11:00:00Z',
        flowId: 'flow-3',
      },
      {
        id: 'node-h2',
        type: 'synthesizer',
        config: {
          name: 'Symptom Analysis',
          model: 'Mistral-7B',
        },
        position: { x: 300, y: 100 },
        createdAt: '2025-01-08T11:00:00Z',
        updatedAt: '2025-01-08T11:00:00Z',
        flowId: 'flow-3',
      },
      {
        id: 'node-h3',
        type: 'scorer',
        config: {
          name: 'Risk Assessment',
          algorithm: 'ML-based',
        },
        position: { x: 500, y: 100 },
        createdAt: '2025-01-08T11:00:00Z',
        updatedAt: '2025-01-08T11:00:00Z',
        flowId: 'flow-3',
      },
      {
        id: 'node-h4',
        type: 'auditor',
        config: {
          name: 'Bias Check',
          metrics: ['demographics', 'geography'],
        },
        position: { x: 700, y: 100 },
        createdAt: '2025-01-08T11:00:00Z',
        updatedAt: '2025-01-08T11:00:00Z',
        flowId: 'flow-3',
      },
      {
        id: 'node-h5',
        type: 'orchestrator',
        config: {
          name: 'Treatment Plan',
          decisionEngine: 'Rule-based',
        },
        position: { x: 900, y: 100 },
        createdAt: '2025-01-08T11:00:00Z',
        updatedAt: '2025-01-08T11:00:00Z',
        flowId: 'flow-3',
      },
    ],
  },
  {
    id: 'flow-4',
    name: 'Financial Risk Assessment',
    description: 'Open Banking data analysis and risk scoring flow',
    config: {
      version: '1.0.0',
      triggers: ['banking_data'],
      steps: [
        {
          id: 'step-1',
          type: 'collector',
          name: 'Data Harvester',
        },
        {
          id: 'step-2',
          type: 'synthesizer',
          name: 'Risk Synthesizer',
        },
        {
          id: 'step-3',
          type: 'auditor',
          name: 'Fairness Auditor',
        },
        {
          id: 'step-4',
          type: 'orchestrator',
          name: 'Decision Orchestrator',
        },
      ],
    },
    status: 'published',
    createdAt: '2025-01-08T12:00:00Z',
    updatedAt: '2025-01-08T12:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    nodes: [
      {
        id: 'node-f1',
        type: 'collector',
        config: {
          name: 'Banking Data',
          dataSource: 'Open Banking API',
        },
        position: { x: 100, y: 100 },
        createdAt: '2025-01-08T12:00:00Z',
        updatedAt: '2025-01-08T12:00:00Z',
        flowId: 'flow-4',
      },
      {
        id: 'node-f2',
        type: 'synthesizer',
        config: {
          name: 'Risk Analysis',
          model: 'OpenAI GPT-4',
        },
        position: { x: 300, y: 100 },
        createdAt: '2025-01-08T12:00:00Z',
        updatedAt: '2025-01-08T12:00:00Z',
        flowId: 'flow-4',
      },
      {
        id: 'node-f3',
        type: 'auditor',
        config: {
          name: 'Compliance Check',
          standards: ['GDPR', 'PCI-DSS'],
        },
        position: { x: 500, y: 100 },
        createdAt: '2025-01-08T12:00:00Z',
        updatedAt: '2025-01-08T12:00:00Z',
        flowId: 'flow-4',
      },
      {
        id: 'node-f4',
        type: 'orchestrator',
        config: {
          name: 'Credit Decision',
          rules: 'Regulatory',
        },
        position: { x: 700, y: 100 },
        createdAt: '2025-01-08T12:00:00Z',
        updatedAt: '2025-01-08T12:00:00Z',
        flowId: 'flow-4',
      },
    ],
  },
  {
    id: 'flow-5',
    name: 'Insurance Claims Processing',
    description: 'Automated insurance claim assessment and settlement',
    config: {
      version: '1.0.0',
      triggers: ['claim_submission'],
      steps: [
        {
          id: 'step-1',
          type: 'scorer',
          name: 'Peril Scorer',
        },
        {
          id: 'step-2',
          type: 'synthesizer',
          name: 'Memory Synthesizer',
        },
        {
          id: 'step-3',
          type: 'orchestrator',
          name: 'Decision Orchestrator',
        },
        {
          id: 'step-4',
          type: 'auditor',
          name: 'Fairness Auditor',
        },
      ],
    },
    status: 'draft',
    createdAt: '2025-01-08T13:00:00Z',
    updatedAt: '2025-01-08T13:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    nodes: [
      {
        id: 'node-i1',
        type: 'scorer',
        config: {
          name: 'Risk Assessment',
          dataSource: 'Climate/Weather APIs',
        },
        position: { x: 100, y: 100 },
        createdAt: '2025-01-08T13:00:00Z',
        updatedAt: '2025-01-08T13:00:00Z',
        flowId: 'flow-5',
      },
      {
        id: 'node-i2',
        type: 'synthesizer',
        config: {
          name: 'Claim History',
          model: 'Mistral-7B',
        },
        position: { x: 300, y: 100 },
        createdAt: '2025-01-08T13:00:00Z',
        updatedAt: '2025-01-08T13:00:00Z',
        flowId: 'flow-5',
      },
      {
        id: 'node-i3',
        type: 'orchestrator',
        config: {
          name: 'Settlement Decision',
          paymentSystem: 'Solana + Crossmint',
        },
        position: { x: 500, y: 100 },
        createdAt: '2025-01-08T13:00:00Z',
        updatedAt: '2025-01-08T13:00:00Z',
        flowId: 'flow-5',
      },
      {
        id: 'node-i4',
        type: 'auditor',
        config: {
          name: 'Bias Detection',
          metrics: ['geography', 'income'],
        },
        position: { x: 700, y: 100 },
        createdAt: '2025-01-08T13:00:00Z',
        updatedAt: '2025-01-08T13:00:00Z',
        flowId: 'flow-5',
      },
    ],
  },
];

// Mock API service
export class MockApiService {
  private agents: MockAgent[] = [...mockAgents];
  private sessions: MockSession[] = [...mockSessions];
  private flows: MockFlow[] = [...mockFlows];

  // Agent methods
  async getAgents(): Promise<{ success: boolean; data: MockAgent[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: this.agents });
      }, 500);
    });
  }

  async getAgent(id: string): Promise<{ success: boolean; data: MockAgent }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const agent = this.agents.find(a => a.id === id);
        if (agent) {
          resolve({ success: true, data: agent });
        } else {
          reject(new Error('Agent not found'));
        }
      }, 300);
    });
  }

  async createAgent(agent: Partial<MockAgent>): Promise<{ success: boolean; data: MockAgent }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAgent: MockAgent = {
          id: `agent-${Date.now()}`,
          name: agent.name || 'New Agent',
          description: agent.description,
          type: agent.type || 'basic',
          category: agent.category || 'basic',
          config: agent.config || {},
          status: 'active',
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: 'user-1',
            name: 'Admin User',
            email: 'admin@agentlabs.io',
          },
          _count: {
            sessions: 0,
          },
        };
        this.agents.unshift(newAgent);
        resolve({ success: true, data: newAgent });
      }, 800);
    });
  }

  async updateAgent(id: string, updates: Partial<MockAgent>): Promise<{ success: boolean; data: MockAgent }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.agents.findIndex(a => a.id === id);
        if (index !== -1) {
          this.agents[index] = { ...this.agents[index], ...updates, updatedAt: new Date().toISOString() };
          resolve({ success: true, data: this.agents[index] });
        } else {
          reject(new Error('Agent not found'));
        }
      }, 600);
    });
  }

  async deleteAgent(id: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.agents.findIndex(a => a.id === id);
        if (index !== -1) {
          this.agents.splice(index, 1);
          resolve({ success: true, message: 'Agent deleted successfully' });
        } else {
          reject(new Error('Agent not found'));
        }
      }, 400);
    });
  }

  // Session methods
  async getSessions(): Promise<{ success: boolean; data: MockSession[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: this.sessions });
      }, 500);
    });
  }

  async getSession(id: string): Promise<{ success: boolean; data: MockSession }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const session = this.sessions.find(s => s.id === id);
        if (session) {
          resolve({ success: true, data: session });
        } else {
          reject(new Error('Session not found'));
        }
      }, 300);
    });
  }

  async createSession(session: Partial<MockSession>): Promise<{ success: boolean; data: MockSession }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const agent = this.agents.find(a => a.id === (typeof session.agent === 'string' ? session.agent : session.agent?.id));

        
        const newSession: MockSession = {
          id: `session-${Date.now()}`,
          name: session.name || `Session with ${agent?.name || 'Unknown Agent'}`,
          status: 'active',
          config: session.config || {},
          metadata: session.metadata || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: 'user-1',
            name: 'Admin User',
            email: 'admin@agentlabs.io',
          },
          agent: {
            id: (typeof session.agent === 'string' ? session.agent : session.agent?.id) || 'agent-1',
            name: agent?.name || 'Unknown Agent',
            type: agent?.type || 'basic',
          },
          _count: {
            messages: 0,
            events: 0,
          },
        };
        this.sessions.unshift(newSession);
        resolve({ success: true, data: newSession });
      }, 800);
    });
  }

  async updateSession(id: string, updates: Partial<MockSession>): Promise<{ success: boolean; data: MockSession }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.sessions.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sessions[index] = { ...this.sessions[index], ...updates, updatedAt: new Date().toISOString() };
          resolve({ success: true, data: this.sessions[index] });
        } else {
          reject(new Error('Session not found'));
        }
      }, 600);
    });
  }

  async deleteSession(id: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.sessions.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sessions.splice(index, 1);
          resolve({ success: true, message: 'Session deleted successfully' });
        } else {
          reject(new Error('Session not found'));
        }
      }, 400);
    });
  }

  // Flow methods
  async getFlows(): Promise<{ success: boolean; data: MockFlow[] }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: this.flows });
      }, 500);
    });
  }

  async getFlow(id: string): Promise<{ success: boolean; data: MockFlow }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const flow = this.flows.find(f => f.id === id);
        if (flow) {
          resolve({ success: true, data: flow });
        } else {
          reject(new Error('Flow not found'));
        }
      }, 300);
    });
  }

  async createFlow(flow: Partial<MockFlow>): Promise<{ success: boolean; data: MockFlow }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFlow: MockFlow = {
          id: `flow-${Date.now()}`,
          name: flow.name || 'New Flow',
          description: flow.description,
          config: flow.config || { version: '1.0.0', triggers: [], steps: [] },
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: 'user-1',
            name: 'Admin User',
            email: 'admin@agentlabs.io',
          },
          nodes: [],
        };
        this.flows.unshift(newFlow);
        resolve({ success: true, data: newFlow });
      }, 800);
    });
  }

  async updateFlow(id: string, updates: Partial<MockFlow>): Promise<{ success: boolean; data: MockFlow }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.flows.findIndex(f => f.id === id);
        if (index !== -1) {
          this.flows[index] = { ...this.flows[index], ...updates, updatedAt: new Date().toISOString() };
          resolve({ success: true, data: this.flows[index] });
        } else {
          reject(new Error('Flow not found'));
        }
      }, 600);
    });
  }

  async deleteFlow(id: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.flows.findIndex(f => f.id === id);
        if (index !== -1) {
          this.flows.splice(index, 1);
          resolve({ success: true, message: 'Flow deleted successfully' });
        } else {
          reject(new Error('Flow not found'));
        }
      }, 400);
    });
  }

  // Status method
  async getStatus(): Promise<{ message: string; version: string; timestamp: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'Agent Labs OS Gateway API (Mock)',
          version: '0.1.0',
          timestamp: new Date().toISOString(),
        });
      }, 100);
    });
  }
}

export const mockApiService = new MockApiService();
