"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEngine = void 0;
const eventemitter3_1 = require("eventemitter3");
const uuid_1 = require("uuid");
const Workflow_1 = require("../types/Workflow");
const Agent_1 = require("../types/Agent");
class WorkflowEngine extends eventemitter3_1.EventEmitter {
    constructor(agentRegistry) {
        super();
        this.agentRegistry = agentRegistry;
        this.executions = new Map();
        this.runningExecutions = new Set();
    }
    /**
     * Execute a workflow
     */
    async executeWorkflow(workflow, variables = {}) {
        const executionId = (0, uuid_1.v4)();
        const execution = {
            id: executionId,
            workflowId: workflow.id,
            status: Workflow_1.ExecutionStatus.QUEUED,
            startTime: new Date(),
            variables: { ...variables },
            results: {},
            errors: [],
            nodeExecutions: []
        };
        this.executions.set(executionId, execution);
        this.emit('execution:started', execution);
        try {
            // Validate workflow
            this.validateWorkflow(workflow);
            // Initialize node executions
            workflow.nodes.forEach(node => {
                execution.nodeExecutions.push({
                    nodeId: node.id,
                    status: Workflow_1.NodeStatus.PENDING,
                    startTime: new Date()
                });
            });
            // Start execution
            execution.status = Workflow_1.ExecutionStatus.RUNNING;
            this.runningExecutions.add(executionId);
            this.emit('execution:running', execution);
            // Execute workflow
            await this.executeWorkflowNodes(workflow, execution);
            // Complete execution
            execution.status = Workflow_1.ExecutionStatus.COMPLETED;
            execution.endTime = new Date();
            execution.duration = execution.endTime.getTime() - execution.startTime.getTime();
            this.runningExecutions.delete(executionId);
            this.emit('execution:completed', execution);
        }
        catch (error) {
            execution.status = Workflow_1.ExecutionStatus.FAILED;
            execution.endTime = new Date();
            execution.duration = execution.endTime.getTime() - execution.startTime.getTime();
            execution.errors.push({
                nodeId: 'workflow',
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                timestamp: new Date()
            });
            this.runningExecutions.delete(executionId);
            this.emit('execution:failed', execution);
        }
        return execution;
    }
    /**
     * Execute workflow nodes
     */
    async executeWorkflowNodes(workflow, execution) {
        const nodeMap = new Map(workflow.nodes.map(node => [node.id, node]));
        const edgeMap = new Map(workflow.edges.map(edge => [edge.source, edge]));
        // Find starting nodes (nodes with no incoming edges)
        const startingNodes = workflow.nodes.filter(node => !workflow.edges.some(edge => edge.target === node.id));
        // Execute starting nodes
        for (const node of startingNodes) {
            await this.executeNode(node, execution, workflow);
        }
        // Continue with dependent nodes
        await this.executeDependentNodes(workflow, execution, nodeMap, edgeMap);
    }
    /**
     * Execute a single node
     */
    async executeNode(node, execution, workflow) {
        const nodeExecution = execution.nodeExecutions.find(ne => ne.nodeId === node.id);
        if (!nodeExecution)
            return;
        try {
            nodeExecution.status = Workflow_1.NodeStatus.RUNNING;
            this.emit('node:started', { node, execution });
            let result;
            switch (node.type) {
                case Workflow_1.NodeType.AGENT_TASK:
                    result = await this.executeAgentTask(node, execution);
                    break;
                case Workflow_1.NodeType.CONDITION:
                    result = await this.executeCondition(node, execution);
                    break;
                case Workflow_1.NodeType.PARALLEL:
                    result = await this.executeParallel(node, execution, workflow);
                    break;
                case Workflow_1.NodeType.SEQUENCE:
                    result = await this.executeSequence(node, execution, workflow);
                    break;
                case Workflow_1.NodeType.TIMER:
                    result = await this.executeTimer(node, execution);
                    break;
                case Workflow_1.NodeType.WEBHOOK:
                    result = await this.executeWebhook(node, execution);
                    break;
                case Workflow_1.NodeType.DATA_TRANSFORM:
                    result = await this.executeDataTransform(node, execution);
                    break;
                default:
                    throw new Error(`Unknown node type: ${node.type}`);
            }
            nodeExecution.status = Workflow_1.NodeStatus.COMPLETED;
            nodeExecution.endTime = new Date();
            nodeExecution.duration = nodeExecution.endTime.getTime() - nodeExecution.startTime.getTime();
            nodeExecution.result = result;
            execution.results[node.id] = result;
            this.emit('node:completed', { node, result, execution });
        }
        catch (error) {
            nodeExecution.status = Workflow_1.NodeStatus.FAILED;
            nodeExecution.endTime = new Date();
            nodeExecution.duration = nodeExecution.endTime.getTime() - nodeExecution.startTime.getTime();
            nodeExecution.error = error instanceof Error ? error.message : 'Unknown error';
            execution.errors.push({
                nodeId: node.id,
                message: nodeExecution.error,
                stack: error instanceof Error ? error.stack : undefined,
                timestamp: new Date()
            });
            this.emit('node:failed', { node, error, execution });
            throw error;
        }
    }
    /**
     * Execute agent task
     */
    async executeAgentTask(node, execution) {
        if (!node.agentId || !node.capability) {
            throw new Error('Agent task node must have agentId and capability');
        }
        const agent = this.agentRegistry.getAgent(node.agentId);
        if (!agent) {
            throw new Error(`Agent not found: ${node.agentId}`);
        }
        const capability = agent.capabilities.find(cap => cap.name === node.capability);
        if (!capability) {
            throw new Error(`Capability not found: ${node.capability}`);
        }
        // Create task request
        const taskRequest = {
            taskId: (0, uuid_1.v4)(),
            agentId: node.agentId,
            capability: node.capability,
            parameters: this.resolveParameters(node.parameters, execution.variables),
            priority: Agent_1.TaskPriority.NORMAL,
            timeout: 30000 // 30 seconds default
        };
        // Emit task request
        this.emit('task:requested', taskRequest);
        // For now, simulate agent execution
        // In a real implementation, this would send the task to the agent
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful execution
                resolve({
                    taskId: taskRequest.taskId,
                    result: `Task completed by ${agent.name}`,
                    timestamp: new Date()
                });
            }, 1000);
        });
    }
    /**
     * Execute condition node
     */
    async executeCondition(node, execution) {
        const condition = node.parameters.condition;
        if (!condition) {
            throw new Error('Condition node must have a condition parameter');
        }
        // Simple condition evaluation
        // In a real implementation, this would use a proper expression evaluator
        const result = this.evaluateCondition(condition, execution.variables);
        return result;
    }
    /**
     * Execute parallel node
     */
    async executeParallel(node, execution, workflow) {
        const childNodes = workflow.nodes.filter(n => workflow.edges.some(edge => edge.source === node.id && edge.target === n.id));
        const promises = childNodes.map(childNode => this.executeNode(childNode, execution, workflow));
        return Promise.all(promises);
    }
    /**
     * Execute sequence node
     */
    async executeSequence(node, execution, workflow) {
        const childNodes = workflow.nodes.filter(n => workflow.edges.some(edge => edge.source === node.id && edge.target === n.id));
        const results = [];
        for (const childNode of childNodes) {
            const result = await this.executeNode(childNode, execution, workflow);
            results.push(result);
        }
        return results;
    }
    /**
     * Execute timer node
     */
    async executeTimer(node, execution) {
        const duration = node.parameters.duration || 1000; // Default 1 second
        return new Promise(resolve => setTimeout(resolve, duration));
    }
    /**
     * Execute webhook node
     */
    async executeWebhook(node, execution) {
        const url = node.parameters.url;
        if (!url) {
            throw new Error('Webhook node must have a URL parameter');
        }
        // In a real implementation, this would make an HTTP request
        return {
            url,
            method: node.parameters.method || 'POST',
            status: 200,
            response: 'Webhook executed successfully'
        };
    }
    /**
     * Execute data transform node
     */
    async executeDataTransform(node, execution) {
        const transform = node.parameters.transform;
        if (!transform) {
            throw new Error('Data transform node must have a transform parameter');
        }
        // Simple data transformation
        // In a real implementation, this would use a proper transformation engine
        return this.applyTransform(transform, execution.variables);
    }
    /**
     * Execute dependent nodes
     */
    async executeDependentNodes(workflow, execution, nodeMap, edgeMap) {
        // This is a simplified implementation
        // In a real implementation, this would handle complex dependency graphs
        const remainingNodes = workflow.nodes.filter(node => {
            const nodeExecution = execution.nodeExecutions.find(ne => ne.nodeId === node.id);
            return nodeExecution && nodeExecution.status === Workflow_1.NodeStatus.PENDING;
        });
        for (const node of remainingNodes) {
            await this.executeNode(node, execution, workflow);
        }
    }
    /**
     * Validate workflow
     */
    validateWorkflow(workflow) {
        if (!workflow.nodes || workflow.nodes.length === 0) {
            throw new Error('Workflow must have at least one node');
        }
        // Validate nodes
        workflow.nodes.forEach(node => {
            if (!node.id || !node.type) {
                throw new Error('All nodes must have an id and type');
            }
        });
        // Validate edges
        workflow.edges.forEach(edge => {
            const sourceExists = workflow.nodes.some(node => node.id === edge.source);
            const targetExists = workflow.nodes.some(node => node.id === edge.target);
            if (!sourceExists || !targetExists) {
                throw new Error(`Edge references non-existent node: ${edge.source} -> ${edge.target}`);
            }
        });
    }
    /**
     * Resolve parameters with variables
     */
    resolveParameters(parameters, variables) {
        const resolved = {};
        for (const [key, value] of Object.entries(parameters)) {
            if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
                const variableName = value.slice(2, -2).trim();
                resolved[key] = variables[variableName];
            }
            else {
                resolved[key] = value;
            }
        }
        return resolved;
    }
    /**
     * Evaluate condition
     */
    evaluateCondition(condition, variables) {
        // Simple condition evaluation
        // In a real implementation, this would use a proper expression evaluator
        try {
            // Replace variables in condition
            let evaluatedCondition = condition;
            for (const [key, value] of Object.entries(variables)) {
                evaluatedCondition = evaluatedCondition.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
            }
            // Simple evaluation (this is not secure for production)
            return eval(evaluatedCondition);
        }
        catch {
            return false;
        }
    }
    /**
     * Apply data transform
     */
    applyTransform(transform, variables) {
        // Simple data transformation
        // In a real implementation, this would use a proper transformation engine
        try {
            // Replace variables in transform
            let evaluatedTransform = transform;
            for (const [key, value] of Object.entries(variables)) {
                evaluatedTransform = evaluatedTransform.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), JSON.stringify(value));
            }
            return eval(evaluatedTransform);
        }
        catch (error) {
            throw new Error(`Transform evaluation failed: ${error}`);
        }
    }
    /**
     * Get execution by ID
     */
    getExecution(executionId) {
        return this.executions.get(executionId);
    }
    /**
     * Get all executions
     */
    getAllExecutions() {
        return Array.from(this.executions.values());
    }
    /**
     * Cancel execution
     */
    cancelExecution(executionId) {
        const execution = this.executions.get(executionId);
        if (!execution)
            return;
        execution.status = Workflow_1.ExecutionStatus.CANCELLED;
        execution.endTime = new Date();
        execution.duration = execution.endTime.getTime() - execution.startTime.getTime();
        this.runningExecutions.delete(executionId);
        this.emit('execution:cancelled', execution);
    }
    /**
     * Get execution statistics
     */
    getStatistics() {
        const executions = Array.from(this.executions.values());
        const completedExecutions = executions.filter(e => e.status === Workflow_1.ExecutionStatus.COMPLETED);
        const failedExecutions = executions.filter(e => e.status === Workflow_1.ExecutionStatus.FAILED);
        const averageExecutionTime = completedExecutions.length > 0
            ? completedExecutions.reduce((sum, e) => sum + (e.duration || 0), 0) / completedExecutions.length
            : 0;
        return {
            totalExecutions: executions.length,
            runningExecutions: this.runningExecutions.size,
            completedExecutions: completedExecutions.length,
            failedExecutions: failedExecutions.length,
            averageExecutionTime
        };
    }
}
exports.WorkflowEngine = WorkflowEngine;
//# sourceMappingURL=WorkflowEngine.js.map