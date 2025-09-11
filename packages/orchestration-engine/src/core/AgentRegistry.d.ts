import { EventEmitter } from 'eventemitter3';
import { Agent, AgentStatus, AgentCapability } from '../types/Agent';
export declare class AgentRegistry extends EventEmitter {
    private agents;
    private capabilities;
    constructor();
    /**
     * Register a new agent
     */
    registerAgent(agent: Agent): void;
    /**
     * Unregister an agent
     */
    unregisterAgent(agentId: string): void;
    /**
     * Get agent by ID
     */
    getAgent(agentId: string): Agent | undefined;
    /**
     * Get all agents
     */
    getAllAgents(): Agent[];
    /**
     * Get agents by status
     */
    getAgentsByStatus(status: AgentStatus): Agent[];
    /**
     * Get agents by capability
     */
    getAgentsByCapability(capabilityName: string): Agent[];
    /**
     * Get agents by category
     */
    getAgentsByCategory(category: string): Agent[];
    /**
     * Update agent status
     */
    updateAgentStatus(agentId: string, status: AgentStatus): void;
    /**
     * Update agent capabilities
     */
    updateAgentCapabilities(agentId: string, capabilities: AgentCapability[]): void;
    /**
     * Get all available capabilities
     */
    getAllCapabilities(): string[];
    /**
     * Check if capability is available
     */
    isCapabilityAvailable(capabilityName: string): boolean;
    /**
     * Get agent statistics
     */
    getStatistics(): {
        totalAgents: number;
        activeAgents: number;
        totalCapabilities: number;
        agentsByStatus: Record<AgentStatus, number>;
        agentsByCategory: Record<string, number>;
    };
    /**
     * Search agents
     */
    searchAgents(query: {
        name?: string;
        category?: string;
        capability?: string;
        status?: AgentStatus;
        tags?: string[];
    }): Agent[];
}
//# sourceMappingURL=AgentRegistry.d.ts.map