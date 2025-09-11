import { mockApiService, type MockAgent, type MockSession, type MockMessage } from './mockData';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

// Use mock data for now
const USE_MOCK_DATA = true;

export interface Agent {
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

export interface Session {
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

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Agent endpoints
  async getAgents(): Promise<{ success: boolean; data: Agent[] }> {
    if (USE_MOCK_DATA) {
      return mockApiService.getAgents();
    }
    return this.request('/api/agents');
  }

  async getAgent(id: string): Promise<{ success: boolean; data: Agent }> {
    if (USE_MOCK_DATA) {
      return mockApiService.getAgent(id);
    }
    return this.request(`/api/agents/${id}`);
  }

  async createAgent(agent: Partial<Agent>): Promise<{ success: boolean; data: Agent }> {
    if (USE_MOCK_DATA) {
      return mockApiService.createAgent(agent);
    }
    return this.request('/api/agents', {
      method: 'POST',
      body: JSON.stringify(agent),
    });
  }

  async updateAgent(id: string, agent: Partial<Agent>): Promise<{ success: boolean; data: Agent }> {
    if (USE_MOCK_DATA) {
      return mockApiService.updateAgent(id, agent);
    }
    return this.request(`/api/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agent),
    });
  }

  async deleteAgent(id: string): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_DATA) {
      return mockApiService.deleteAgent(id);
    }
    return this.request(`/api/agents/${id}`, {
      method: 'DELETE',
    });
  }

  // Session endpoints
  async getSessions(): Promise<{ success: boolean; data: Session[] }> {
    if (USE_MOCK_DATA) {
      return mockApiService.getSessions();
    }
    return this.request('/api/sessions');
  }

  async getSession(id: string): Promise<{ success: boolean; data: Session }> {
    if (USE_MOCK_DATA) {
      return mockApiService.getSession(id);
    }
    return this.request(`/api/sessions/${id}`);
  }

  async createSession(session: Partial<Session>): Promise<{ success: boolean; data: Session }> {
    if (USE_MOCK_DATA) {
      return mockApiService.createSession(session);
    }
    return this.request('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  }

  async updateSession(id: string, session: Partial<Session>): Promise<{ success: boolean; data: Session }> {
    if (USE_MOCK_DATA) {
      return mockApiService.updateSession(id, session);
    }
    return this.request(`/api/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(session),
    });
  }

  async deleteSession(id: string): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_DATA) {
      return mockApiService.deleteSession(id);
    }
    return this.request(`/api/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Message endpoints
  async addMessage(sessionId: string, role: string, content: string, metadata?: Record<string, any>): Promise<{ success: boolean; data: Message }> {
    return this.request(`/api/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ role, content, metadata }),
    });
  }

  // Health check
  async getStatus(): Promise<{ message: string; version: string; timestamp: string }> {
    if (USE_MOCK_DATA) {
      return mockApiService.getStatus();
    }
    return this.request('/api/status');
  }
}

export const apiService = new ApiService();
export default apiService;
