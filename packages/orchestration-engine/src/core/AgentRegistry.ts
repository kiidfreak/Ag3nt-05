import { EventEmitter } from 'eventemitter3';
import { Agent, AgentStatus, AgentCapability, AgentMessage, MessageType } from '../types/Agent';

export class AgentRegistry extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private capabilities: Map<string, Set<string>> = new Map();

  constructor() {
    super();
  }

  /**
   * Register a new agent
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    
    // Index capabilities
    agent.capabilities.forEach(capability => {
      if (!this.capabilities.has(capability.name)) {
        this.capabilities.set(capability.name, new Set());
      }
      this.capabilities.get(capability.name)!.add(agent.id);
    });

    this.emit('agent:registered', agent);
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    // Remove from capability index
    agent.capabilities.forEach(capability => {
      const agents = this.capabilities.get(capability.name);
      if (agents) {
        agents.delete(agentId);
        if (agents.size === 0) {
          this.capabilities.delete(capability.name);
        }
      }
    });

    this.agents.delete(agentId);
    this.emit('agent:unregistered', agent);
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agents by status
   */
  getAgentsByStatus(status: AgentStatus): Agent[] {
    return Array.from(this.agents.values()).filter(agent => agent.status === status);
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capabilityName: string): Agent[] {
    const agentIds = this.capabilities.get(capabilityName);
    if (!agentIds) return [];

    return Array.from(agentIds)
      .map(id => this.agents.get(id))
      .filter((agent): agent is Agent => agent !== undefined && agent.status === AgentStatus.ACTIVE);
  }

  /**
   * Get agents by category
   */
  getAgentsByCategory(category: string): Agent[] {
    return Array.from(this.agents.values()).filter(agent => 
      agent.metadata.category === category && agent.status === AgentStatus.ACTIVE
    );
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentId: string, status: AgentStatus): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    agent.status = status;
    agent.updatedAt = new Date();
    
    this.emit('agent:status_updated', { agentId, status, agent });
  }

  /**
   * Update agent capabilities
   */
  updateAgentCapabilities(agentId: string, capabilities: AgentCapability[]): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    // Remove old capabilities from index
    agent.capabilities.forEach(capability => {
      const agents = this.capabilities.get(capability.name);
      if (agents) {
        agents.delete(agentId);
        if (agents.size === 0) {
          this.capabilities.delete(capability.name);
        }
      }
    });

    // Update agent capabilities
    agent.capabilities = capabilities;
    agent.updatedAt = new Date();

    // Add new capabilities to index
    capabilities.forEach(capability => {
      if (!this.capabilities.has(capability.name)) {
        this.capabilities.set(capability.name, new Set());
      }
      this.capabilities.get(capability.name)!.add(agentId);
    });

    this.emit('agent:capabilities_updated', { agentId, capabilities, agent });
  }

  /**
   * Get all available capabilities
   */
  getAllCapabilities(): string[] {
    return Array.from(this.capabilities.keys());
  }

  /**
   * Check if capability is available
   */
  isCapabilityAvailable(capabilityName: string): boolean {
    const agents = this.capabilities.get(capabilityName);
    return agents ? agents.size > 0 : false;
  }

  /**
   * Get agent statistics
   */
  getStatistics(): {
    totalAgents: number;
    activeAgents: number;
    totalCapabilities: number;
    agentsByStatus: Record<AgentStatus, number>;
    agentsByCategory: Record<string, number>;
  } {
    const agents = Array.from(this.agents.values());
    const agentsByStatus = agents.reduce((acc, agent) => {
      acc[agent.status] = (acc[agent.status] || 0) + 1;
      return acc;
    }, {} as Record<AgentStatus, number>);

    const agentsByCategory = agents.reduce((acc, agent) => {
      const category = agent.metadata.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === AgentStatus.ACTIVE).length,
      totalCapabilities: this.capabilities.size,
      agentsByStatus,
      agentsByCategory
    };
  }

  /**
   * Search agents
   */
  searchAgents(query: {
    name?: string;
    category?: string;
    capability?: string;
    status?: AgentStatus;
    tags?: string[];
  }): Agent[] {
    let results = Array.from(this.agents.values());

    if (query.name) {
      results = results.filter(agent => 
        agent.name.toLowerCase().includes(query.name!.toLowerCase())
      );
    }

    if (query.category) {
      results = results.filter(agent => 
        agent.metadata.category === query.category
      );
    }

    if (query.capability) {
      results = results.filter(agent => 
        agent.capabilities.some(cap => cap.name === query.capability)
      );
    }

    if (query.status) {
      results = results.filter(agent => agent.status === query.status);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(agent => 
        query.tags!.some(tag => agent.metadata.tags.includes(tag))
      );
    }

    return results;
  }
}
