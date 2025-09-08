import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentStatus, AgentCapability, AgentMetadata } from '../types/Agent';
import { Workflow, WorkflowNode, WorkflowEdge, NodeType, WorkflowMetadata, WorkflowStatus, NodeStatus, ComplexityLevel } from '../types/Workflow';

/**
 * Create a new agent
 */
export function createAgent(
  name: string,
  type: string,
  capabilities: AgentCapability[],
  metadata: Partial<AgentMetadata> = {}
): Agent {
  return {
    id: uuidv4(),
    name,
    type,
    version: '1.0.0',
    status: AgentStatus.ACTIVE,
    capabilities,
    metadata: {
      author: 'system',
      description: '',
      tags: [],
      category: 'general',
      ...metadata
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Create a new workflow
 */
export function createWorkflow(
  name: string,
  description: string,
  metadata: Partial<WorkflowMetadata> = {}
): Workflow {
  return {
    id: uuidv4(),
    name,
    description,
    version: '1.0.0',
    status: WorkflowStatus.DRAFT,
    nodes: [],
    edges: [],
    variables: [],
    metadata: {
      author: 'system',
      tags: [],
      category: 'automation',
      complexity: ComplexityLevel.SIMPLE,
      ...metadata
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Create a workflow node
 */
export function createWorkflowNode(
  type: NodeType,
  name: string,
  position: { x: number; y: number },
  parameters: Record<string, any> = {}
): WorkflowNode {
  return {
    id: uuidv4(),
    type,
    name,
    parameters,
    position,
    status: NodeStatus.PENDING
  };
}

/**
 * Create an agent task node
 */
export function createAgentTaskNode(
  name: string,
  agentId: string,
  capability: string,
  position: { x: number; y: number },
  parameters: Record<string, any> = {}
): WorkflowNode {
  return {
    id: uuidv4(),
    type: NodeType.AGENT_TASK,
    name,
    agentId,
    capability,
    parameters,
    position,
    status: NodeStatus.PENDING
  };
}

/**
 * Create a condition node
 */
export function createConditionNode(
  name: string,
  condition: string,
  position: { x: number; y: number }
): WorkflowNode {
  return {
    id: uuidv4(),
    type: NodeType.CONDITION,
    name,
    parameters: { condition },
    position,
    status: NodeStatus.PENDING
  };
}

/**
 * Create a parallel node
 */
export function createParallelNode(
  name: string,
  position: { x: number; y: number }
): WorkflowNode {
  return {
    id: uuidv4(),
    type: NodeType.PARALLEL,
    name,
    parameters: {},
    position,
    status: NodeStatus.PENDING
  };
}

/**
 * Create a sequence node
 */
export function createSequenceNode(
  name: string,
  position: { x: number; y: number }
): WorkflowNode {
  return {
    id: uuidv4(),
    type: NodeType.SEQUENCE,
    name,
    parameters: {},
    position,
    status: NodeStatus.PENDING
  };
}

/**
 * Create a timer node
 */
export function createTimerNode(
  name: string,
  duration: number,
  position: { x: number; y: number }
): WorkflowNode {
  return {
    id: uuidv4(),
    type: NodeType.TIMER,
    name,
    parameters: { duration },
    position,
    status: NodeStatus.PENDING
  };
}

/**
 * Create a webhook node
 */
export function createWebhookNode(
  name: string,
  url: string,
  position: { x: number; y: number },
  method: string = 'POST'
): WorkflowNode {
  return {
    id: uuidv4(),
    type: NodeType.WEBHOOK,
    name,
    parameters: { url, method },
    position,
    status: NodeStatus.PENDING
  };
}

/**
 * Create a data transform node
 */
export function createDataTransformNode(
  name: string,
  transform: string,
  position: { x: number; y: number }
): WorkflowNode {
  return {
    id: uuidv4(),
    type: NodeType.DATA_TRANSFORM,
    name,
    parameters: { transform },
    position,
    status: NodeStatus.PENDING
  };
}

/**
 * Create a workflow edge
 */
export function createWorkflowEdge(
  source: string,
  target: string,
  condition?: string,
  label?: string
): WorkflowEdge {
  return {
    id: uuidv4(),
    source,
    target,
    condition,
    label
  };
}
