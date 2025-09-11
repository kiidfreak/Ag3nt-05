import { EventEmitter } from 'eventemitter3';
import { AgentRegistry } from './AgentRegistry';
import { WorkflowEngine } from './WorkflowEngine';
import { Agent, AgentStatus } from '../types/Agent';
import { Workflow, WorkflowExecution } from '../types/Workflow';
export declare class OrchestrationEngine extends EventEmitter {
    private agentRegistry;
    private workflowEngine;
    private isRunning;
    constructor();
    /**
     * Initialize the orchestration engine
     */
    initialize(): Promise<void>;
    /**
     * Shutdown the orchestration engine
     */
    shutdown(): Promise<void>;
    /**
     * Register an agent
     */
    registerAgent(agent: Agent): void;
    /**
     * Unregister an agent
     */
    unregisterAgent(agentId: string): void;
    /**
     * Update agent status
     */
    updateAgentStatus(agentId: string, status: AgentStatus): void;
    /**
     * Execute a workflow
     */
    executeWorkflow(workflow: Workflow, variables?: Record<string, any>): Promise<WorkflowExecution>;
    /**
     * Get agent registry
     */
    getAgentRegistry(): AgentRegistry;
    /**
     * Get workflow engine
     */
    getWorkflowEngine(): WorkflowEngine;
    /**
     * Get engine status
     */
    getStatus(): {
        isRunning: boolean;
        agentCount: number;
        activeAgentCount: number;
        executionCount: number;
        runningExecutionCount: number;
    };
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
    };
    /**
     * Setup event handlers
     */
    private setupEventHandlers;
    /**
     * Create a simple workflow
     */
    createSimpleWorkflow(name: string, description: string, agentTasks: Array<{
        agentId: string;
        capability: string;
        parameters: Record<string, any>;
    }>): Workflow;
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
    };
}
//# sourceMappingURL=OrchestrationEngine.d.ts.map