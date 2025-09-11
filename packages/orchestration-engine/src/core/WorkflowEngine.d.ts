import { EventEmitter } from 'eventemitter3';
import { Workflow, WorkflowExecution } from '../types/Workflow';
import { AgentRegistry } from './AgentRegistry';
export declare class WorkflowEngine extends EventEmitter {
    private agentRegistry;
    private executions;
    private runningExecutions;
    constructor(agentRegistry: AgentRegistry);
    /**
     * Execute a workflow
     */
    executeWorkflow(workflow: Workflow, variables?: Record<string, any>): Promise<WorkflowExecution>;
    /**
     * Execute workflow nodes
     */
    private executeWorkflowNodes;
    /**
     * Execute a single node
     */
    private executeNode;
    /**
     * Execute agent task
     */
    private executeAgentTask;
    /**
     * Execute condition node
     */
    private executeCondition;
    /**
     * Execute parallel node
     */
    private executeParallel;
    /**
     * Execute sequence node
     */
    private executeSequence;
    /**
     * Execute timer node
     */
    private executeTimer;
    /**
     * Execute webhook node
     */
    private executeWebhook;
    /**
     * Execute data transform node
     */
    private executeDataTransform;
    /**
     * Execute dependent nodes
     */
    private executeDependentNodes;
    /**
     * Validate workflow
     */
    private validateWorkflow;
    /**
     * Resolve parameters with variables
     */
    private resolveParameters;
    /**
     * Evaluate condition
     */
    private evaluateCondition;
    /**
     * Apply data transform
     */
    private applyTransform;
    /**
     * Get execution by ID
     */
    getExecution(executionId: string): WorkflowExecution | undefined;
    /**
     * Get all executions
     */
    getAllExecutions(): WorkflowExecution[];
    /**
     * Cancel execution
     */
    cancelExecution(executionId: string): void;
    /**
     * Get execution statistics
     */
    getStatistics(): {
        totalExecutions: number;
        runningExecutions: number;
        completedExecutions: number;
        failedExecutions: number;
        averageExecutionTime: number;
    };
}
//# sourceMappingURL=WorkflowEngine.d.ts.map