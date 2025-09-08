// Agent Types
export interface Agent {
  id: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  pricing: Pricing;
  status: 'active' | 'inactive' | 'deprecated';
  createdAt: string;
  updatedAt: string;
}

export interface Pricing {
  model: 'per-request' | 'per-minute' | 'per-hour' | 'per-day';
  cost: number;
  currency: string;
}

// Session Types
export interface Session {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  agents: string[];
  flow: FlowNode[];
  startedAt: string;
  completedAt?: string;
  duration?: number;
  metadata: Record<string, any>;
}

export interface FlowNode {
  id: string;
  type: 'agent' | 'condition' | 'delay' | 'approval';
  agentId?: string;
  position: { x: number; y: number };
  connections: string[];
  config: Record<string, any>;
}

// Message Types
export interface Message {
  id: string;
  sessionId: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'error' | 'approval';
  payload: any;
  timestamp: string;
  metadata: Record<string, any>;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'user';
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Event Types
export interface Event {
  id: string;
  type: string;
  sessionId?: string;
  agentId?: string;
  userId?: string;
  data: any;
  timestamp: string;
}

// Configuration Types
export interface Config {
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  solana: {
    rpcUrl: string;
    privateKey: string;
  };
  coral: {
    apiUrl: string;
    apiKey: string;
  };
  elevenlabs: {
    apiKey: string;
  };
  mistral: {
    apiKey: string;
  };
}
