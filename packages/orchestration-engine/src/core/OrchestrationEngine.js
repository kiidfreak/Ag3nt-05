"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationEngine = void 0;
const eventemitter3_1 = require("eventemitter3");
const AgentRegistry_1 = require("./AgentRegistry");
const WorkflowEngine_1 = require("./WorkflowEngine");
const Workflow_1 = require("../types/Workflow");
class OrchestrationEngine extends eventemitter3_1.EventEmitter {
    constructor() {
        super();
        this.isRunning = false;
        this.agentRegistry = new AgentRegistry_1.AgentRegistry();
        this.workflowEngine = new WorkflowEngine_1.WorkflowEngine(this.agentRegistry);
        this.setupEventHandlers();
    }
    /**
     * Initialize the orchestration engine
     */
    async initialize() {
        this.isRunning = true;
        this.emit('engine:initialized');
    }
    /**
     * Shutdown the orchestration engine
     */
    async shutdown() {
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
    registerAgent(agent) {
        this.agentRegistry.registerAgent(agent);
        this.emit('agent:registered', agent);
    }
    /**
     * Unregister an agent
     */
    unregisterAgent(agentId) {
        const agent = this.agentRegistry.getAgent(agentId);
        if (agent) {
            this.agentRegistry.unregisterAgent(agentId);
            this.emit('agent:unregistered', agent);
        }
    }
    /**
     * Update agent status
     */
    updateAgentStatus(agentId, status) {
        this.agentRegistry.updateAgentStatus(agentId, status);
        this.emit('agent:status_updated', { agentId, status });
    }
    /**
     * Execute a workflow
     */
    async executeWorkflow(workflow, variables = {}) {
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
    getAgentRegistry() {
        return this.agentRegistry;
    }
    /**
     * Get workflow engine
     */
    getWorkflowEngine() {
        return this.workflowEngine;
    }
    /**
     * Get engine status
     */
    getStatus() {
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
    getHealth() {
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
        let status;
        if (isHealthy) {
            status = 'healthy';
        }
        else if (isDegraded) {
            status = 'degraded';
        }
        else {
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
    setupEventHandlers() {
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
    createSimpleWorkflow(name, description, agentTasks) {
        const nodes = agentTasks.map((task, index) => ({
            id: `node-${index}`,
            type: Workflow_1.NodeType.AGENT_TASK,
            name: `Task ${index + 1}`,
            agentId: task.agentId,
            capability: task.capability,
            parameters: task.parameters,
            position: { x: index * 200, y: 0 },
            status: Workflow_1.NodeStatus.PENDING
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
            status: Workflow_1.WorkflowStatus.DRAFT,
            nodes,
            edges,
            variables: [],
            metadata: {
                author: 'system',
                tags: ['auto-generated'],
                category: 'automation',
                complexity: Workflow_1.ComplexityLevel.SIMPLE
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
    /**
     * Get orchestration metrics
     */
    getMetrics() {
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
exports.OrchestrationEngine = OrchestrationEngine;
//# sourceMappingURL=OrchestrationEngine.js.map