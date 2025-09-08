import { EventEmitter } from 'eventemitter3';
import { AgentRegistry } from './AgentRegistry';
import { WorkflowEngine } from './WorkflowEngine';
import { Agent, AgentStatus } from '../types/Agent';
import { Workflow, WorkflowExecution, WorkflowStatus, NodeStatus, ComplexityLevel, NodeType } from '../types/Workflow';

export class OrchestrationEngine extends EventEmitter {
  private agentRegistry: AgentRegistry;
  private workflowEngine: WorkflowEngine;
  private isRunning: boolean = false;

  constructor() {
    super();
    this.agentRegistry = new AgentRegistry();
    this.workflowEngine = new WorkflowEngine(this.agentRegistry);
    
    this.setupEventHandlers();
  }

  /**
   * Initialize the orchestration engine
   */
  async initialize(): Promise<void> {
    this.isRunning = true;
    this.emit('engine:initialized');
  }

  /**
   * Shutdown the orchestration engine
   */
  async shutdown(): Promise<void> {
    this.isRunning = false;
    
    // Cancel all running executions
    const runningExecutions = this.workflowEngine.getAllExecutions()
      .filter(execution => execution.status === 'running');
    
    runningExecutions.forEach(execution => {
      this.workflowEngine.cancelExecution(execution.id);
    });

    this.emit('engine:shutdown');
  }

  /**
   * Register an agent
   */
  registerAgent(agent: Agent): void {
    this.agentRegistry.registerAgent(agent);
    this.emit('agent:registered', agent);
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(agentId: string): void {
    const agent = this.agentRegistry.getAgent(agentId);
    if (agent) {
      this.agentRegistry.unregisterAgent(agentId);
      this.emit('agent:unregistered', agent);
    }
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentId: string, status: AgentStatus): void {
    this.agentRegistry.updateAgentStatus(agentId, status);
    this.emit('agent:status_updated', { agentId, status });
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflow: Workflow, 
    variables: Record<string, any> = {}
  ): Promise<WorkflowExecution> {
    if (!this.isRunning) {
      throw new Error('Orchestration engine is not running');
    }

    const execution = await this.workflowEngine.executeWorkflow(workflow, variables);
    this.emit('workflow:executed', { workflow, execution });
    
    return execution;
  }

  /**
   * Get agent registry
   */
  getAgentRegistry(): AgentRegistry {
    return this.agentRegistry;
  }

  /**
   * Get workflow engine
   */
  getWorkflowEngine(): WorkflowEngine {
    return this.workflowEngine;
  }

  /**
   * Get engine status
   */
  getStatus(): {
    isRunning: boolean;
    agentCount: number;
    activeAgentCount: number;
    executionCount: number;
    runningExecutionCount: number;
  } {
    const agentStats = this.agentRegistry.getStatistics();
    const executionStats = this.workflowEngine.getStatistics();

    return {
      isRunning: this.isRunning,
      agentCount: agentStats.totalAgents,
      activeAgentCount: agentStats.activeAgents,
      executionCount: executionStats.totalExecutions,
      runningExecutionCount: executionStats.runningExecutions
    };
  }

  /**
   * Get engine health
   */
  getHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: {
      engine: boolean;
      agents: boolean;
      executions: boolean;
    };
    metrics: {
      uptime: number;
      agentHealth: number;
      executionSuccessRate: number;
    };
  } {
    const agentStats = this.agentRegistry.getStatistics();
    const executionStats = this.workflowEngine.getStatistics();
    
    const agentHealth = agentStats.totalAgents > 0 
      ? agentStats.activeAgents / agentStats.totalAgents 
      : 1;
    
    const executionSuccessRate = executionStats.totalExecutions > 0
      ? executionStats.completedExecutions / executionStats.totalExecutions
      : 1;

    const details = {
      engine: this.isRunning,
      agents: agentStats.activeAgents > 0,
      executions: executionStats.runningExecutions >= 0
    };

    const isHealthy = details.engine && details.agents && details.executions;
    const isDegraded = details.engine && (details.agents || details.executions);

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (isHealthy) {
      status = 'healthy';
    } else if (isDegraded) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      details,
      metrics: {
        uptime: Date.now(), // This would be actual uptime in a real implementation
        agentHealth,
        executionSuccessRate
      }
    };
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    // Agent registry events
    this.agentRegistry.on('agent:registered', (agent) => {
      this.emit('orchestration:agent_registered', agent);
    });

    this.agentRegistry.on('agent:unregistered', (agent) => {
      this.emit('orchestration:agent_unregistered', agent);
    });

    this.agentRegistry.on('agent:status_updated', (data) => {
      this.emit('orchestration:agent_status_updated', data);
    });

    // Workflow engine events
    this.workflowEngine.on('execution:started', (execution) => {
      this.emit('orchestration:execution_started', execution);
    });

    this.workflowEngine.on('execution:completed', (execution) => {
      this.emit('orchestration:execution_completed', execution);
    });

    this.workflowEngine.on('execution:failed', (execution) => {
      this.emit('orchestration:execution_failed', execution);
    });

    this.workflowEngine.on('node:started', (data) => {
      this.emit('orchestration:node_started', data);
    });

    this.workflowEngine.on('node:completed', (data) => {
      this.emit('orchestration:node_completed', data);
    });

    this.workflowEngine.on('node:failed', (data) => {
      this.emit('orchestration:node_failed', data);
    });
  }

  /**
   * Create a simple workflow
   */
  createSimpleWorkflow(
    name: string, 
    description: string,
    agentTasks: Array<{
      agentId: string;
      capability: string;
      parameters: Record<string, any>;
    }>
  ): Workflow {
    const nodes = agentTasks.map((task, index) => ({
      id: `node-${index}`,
      type: NodeType.AGENT_TASK,
      name: `Task ${index + 1}`,
      agentId: task.agentId,
      capability: task.capability,
      parameters: task.parameters,
      position: { x: index * 200, y: 0 },
      status: NodeStatus.PENDING
    }));

    const edges = nodes.slice(0, -1).map((node, index) => ({
      id: `edge-${index}`,
      source: node.id,
      target: nodes[index + 1].id
    }));

    return {
      id: `workflow-${Date.now()}`,
      name,
      description,
      version: '1.0.0',
      status: WorkflowStatus.DRAFT,
      nodes,
      edges,
      variables: [],
      metadata: {
        author: 'system',
        tags: ['auto-generated'],
        category: 'automation',
        complexity: ComplexityLevel.SIMPLE
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Get orchestration metrics
   */
  getMetrics(): {
    agents: {
      total: number;
      active: number;
      byCategory: Record<string, number>;
      byStatus: Record<string, number>;
    };
    workflows: {
      totalExecutions: number;
      runningExecutions: number;
      completedExecutions: number;
      failedExecutions: number;
      averageExecutionTime: number;
    };
    performance: {
      averageResponseTime: number;
      throughput: number;
      errorRate: number;
    };
  } {
    const agentStats = this.agentRegistry.getStatistics();
    const executionStats = this.workflowEngine.getStatistics();

    return {
      agents: {
        total: agentStats.totalAgents,
        active: agentStats.activeAgents,
        byCategory: agentStats.agentsByCategory,
        byStatus: agentStats.agentsByStatus
      },
      workflows: {
        totalExecutions: executionStats.totalExecutions,
        runningExecutions: executionStats.runningExecutions,
        completedExecutions: executionStats.completedExecutions,
        failedExecutions: executionStats.failedExecutions,
        averageExecutionTime: executionStats.averageExecutionTime
      },
      performance: {
        averageResponseTime: 100, // This would be calculated from actual metrics
        throughput: 10, // Executions per minute
        errorRate: 0.05 // 5% error rate
      }
    };
  }
}
