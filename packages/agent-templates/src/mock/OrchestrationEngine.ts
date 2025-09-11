import { Agent } from '../types/Agent';

/**
 * Mock Orchestration Engine for demonstration purposes
 */
export class OrchestrationEngine {
  private agents: Map<string, Agent> = new Map();
  private isRunning: boolean = false;

  async initialize(): Promise<void> {
    this.isRunning = true;
    console.log('✅ Mock Orchestration Engine initialized');
  }

  async shutdown(): Promise<void> {
    this.isRunning = false;
    console.log('🛑 Mock Orchestration Engine shutdown');
  }

  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    console.log(`   ✅ Agent registered: ${agent.name} (${agent.id})`);
  }

  unregisterAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.agents.delete(agentId);
      console.log(`   ❌ Agent unregistered: ${agent.name}`);
    }
  }

  getAgentRegistry(): any {
    return {
      getAgent: (id: string) => this.agents.get(id),
      getAllAgents: () => Array.from(this.agents.values()),
      getStatistics: () => ({
        totalAgents: this.agents.size,
        activeAgents: Array.from(this.agents.values()).filter(a => a.status === 'active').length,
        agentsByCategory: {},
        agentsByStatus: {}
      })
    };
  }

  getStatus(): any {
    return {
      isRunning: this.isRunning,
      agentCount: this.agents.size,
      activeAgentCount: Array.from(this.agents.values()).filter(a => a.status === 'active').length,
      executionCount: 0,
      runningExecutionCount: 0
    };
  }

  getHealth(): any {
    return {
      status: 'healthy',
      details: {
        engine: this.isRunning,
        agents: this.agents.size > 0,
        executions: true
      },
      metrics: {
        uptime: Date.now(),
        agentHealth: this.agents.size > 0 ? 1 : 0,
        executionSuccessRate: 1
      }
    };
  }

  getMetrics(): any {
    return {
      agents: {
        total: this.agents.size,
        active: Array.from(this.agents.values()).filter(a => a.status === 'active').length,
        byCategory: {},
        byStatus: {}
      },
      workflows: {
        totalExecutions: 0,
        runningExecutions: 0,
        completedExecutions: 0,
        failedExecutions: 0,
        averageExecutionTime: 0
      },
      performance: {
        averageResponseTime: 100,
        throughput: 10,
        errorRate: 0.05
      }
    };
  }
}
