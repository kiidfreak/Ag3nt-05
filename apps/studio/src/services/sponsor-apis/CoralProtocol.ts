/**
 * Coral Protocol API Integration
 * Real integration with Coral Protocol - Zero-trust API for Internet of Agents
 */

import axios from 'axios';

export interface CoralConfig {
  apiKey: string;
  baseURL?: string;
  environment?: 'local' | 'staging' | 'production';
}

export interface CoralAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'pending';
  price?: number;
  currency?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoralSession {
  id: string;
  agents: string[];
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: string;
  endTime?: string;
  results?: any;
  cost?: number;
}

export interface CoralRegistry {
  agents: CoralAgent[];
  total: number;
  page: number;
  limit: number;
}

export class CoralProtocolService {
  private config: CoralConfig;
  private client: any;

  constructor(config: CoralConfig) {
    this.config = {
      baseURL: 'https://api.coralprotocol.ai/v1',
      environment: 'staging',
      ...config
    };
    
    this.client = axios.create({
      baseURL: this.config.baseURL,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Environment': this.config.environment,
      },
    });
  }

  /**
   * Discover agents from Coral Registry
   */
  async discoverAgents(query?: string, category?: string): Promise<CoralRegistry> {
    try {
      const params: any = {};
      if (query) params.q = query;
      if (category) params.category = category;
      
      const response = await this.client.get('/registry/agents', { params });
      
      return response.data;
    } catch (error) {
      console.error('Coral Registry Error:', error);
      throw new Error('Failed to discover agents');
    }
  }

  /**
   * Create a new agent session
   */
  async createSession(agentIds: string[], config?: any): Promise<CoralSession> {
    try {
      const response = await this.client.post('/sessions', {
        agents: agentIds,
        config: config || {},
        environment: this.config.environment,
      });

      return response.data;
    } catch (error) {
      console.error('Coral Session Creation Error:', error);
      throw new Error('Failed to create agent session');
    }
  }

  /**
   * Execute a task with multiple agents
   */
  async executeTask(sessionId: string, task: string, context?: any): Promise<any> {
    try {
      const response = await this.client.post(`/sessions/${sessionId}/execute`, {
        task,
        context: context || {},
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Coral Task Execution Error:', error);
      throw new Error('Failed to execute task');
    }
  }

  /**
   * Get session status and results
   */
  async getSessionStatus(sessionId: string): Promise<CoralSession> {
    try {
      const response = await this.client.get(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Coral Session Status Error:', error);
      throw new Error('Failed to get session status');
    }
  }

  /**
   * Register a new agent to the Coral Registry
   */
  async registerAgent(agentData: Partial<CoralAgent>): Promise<CoralAgent> {
    try {
      const response = await this.client.post('/registry/agents', {
        ...agentData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Coral Agent Registration Error:', error);
      throw new Error('Failed to register agent');
    }
  }

  /**
   * Get agent details from registry
   */
  async getAgent(agentId: string): Promise<CoralAgent> {
    try {
      const response = await this.client.get(`/registry/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Coral Agent Details Error:', error);
      throw new Error('Failed to get agent details');
    }
  }

  /**
   * Create a multi-agent workflow
   */
  async createWorkflow(workflowConfig: {
    name: string;
    description: string;
    agents: string[];
    flow: any[];
    triggers?: any[];
  }): Promise<any> {
    try {
      const response = await this.client.post('/workflows', {
        ...workflowConfig,
        createdAt: new Date().toISOString(),
        status: 'draft',
      });

      return response.data;
    } catch (error) {
      console.error('Coral Workflow Creation Error:', error);
      throw new Error('Failed to create workflow');
    }
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, inputs?: any): Promise<any> {
    try {
      const response = await this.client.post(`/workflows/${workflowId}/execute`, {
        inputs: inputs || {},
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Coral Workflow Execution Error:', error);
      throw new Error('Failed to execute workflow');
    }
  }

  /**
   * Get workflow execution history
   */
  async getWorkflowHistory(workflowId: string): Promise<any[]> {
    try {
      const response = await this.client.get(`/workflows/${workflowId}/history`);
      return response.data;
    } catch (error) {
      console.error('Coral Workflow History Error:', error);
      throw new Error('Failed to get workflow history');
    }
  }

  /**
   * Get Coral Protocol health status
   */
  async getHealthStatus(): Promise<any> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Coral Health Check Error:', error);
      throw new Error('Failed to get health status');
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<any> {
    try {
      const response = await this.client.get('/usage/stats');
      return response.data;
    } catch (error) {
      console.error('Coral Usage Stats Error:', error);
      throw new Error('Failed to get usage statistics');
    }
  }
}

// Export singleton instance
export const coralProtocolService = new CoralProtocolService({
  apiKey: import.meta.env.VITE_CORAL_API_KEY || '',
  environment: 'staging',
});
