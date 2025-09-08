import { Agent, AgentCapability } from '../types/Agent';
import { Workflow, WorkflowNode, WorkflowEdge } from '../types/Workflow';

/**
 * Validate an agent
 */
export function validateAgent(agent: Agent): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!agent.id) {
    errors.push('Agent must have an ID');
  }

  if (!agent.name || agent.name.trim().length === 0) {
    errors.push('Agent must have a name');
  }

  if (!agent.type || agent.type.trim().length === 0) {
    errors.push('Agent must have a type');
  }

  if (!agent.version || agent.version.trim().length === 0) {
    errors.push('Agent must have a version');
  }

  if (!agent.capabilities || agent.capabilities.length === 0) {
    errors.push('Agent must have at least one capability');
  } else {
    agent.capabilities.forEach((capability, index) => {
      const capabilityErrors = validateAgentCapability(capability, index);
      errors.push(...capabilityErrors);
    });
  }

  if (!agent.metadata) {
    errors.push('Agent must have metadata');
  } else {
    if (!agent.metadata.author || agent.metadata.author.trim().length === 0) {
      errors.push('Agent metadata must have an author');
    }

    if (!agent.metadata.description || agent.metadata.description.trim().length === 0) {
      errors.push('Agent metadata must have a description');
    }

    if (!agent.metadata.category || agent.metadata.category.trim().length === 0) {
      errors.push('Agent metadata must have a category');
    }
  }

  if (!agent.createdAt || !(agent.createdAt instanceof Date)) {
    errors.push('Agent must have a valid createdAt date');
  }

  if (!agent.updatedAt || !(agent.updatedAt instanceof Date)) {
    errors.push('Agent must have a valid updatedAt date');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate an agent capability
 */
export function validateAgentCapability(capability: AgentCapability, index: number): string[] {
  const errors: string[] = [];

  if (!capability.name || capability.name.trim().length === 0) {
    errors.push(`Capability ${index} must have a name`);
  }

  if (!capability.description || capability.description.trim().length === 0) {
    errors.push(`Capability ${index} must have a description`);
  }

  if (!capability.inputSchema || typeof capability.inputSchema !== 'object') {
    errors.push(`Capability ${index} must have a valid input schema`);
  }

  if (!capability.outputSchema || typeof capability.outputSchema !== 'object') {
    errors.push(`Capability ${index} must have a valid output schema`);
  }

  if (typeof capability.required !== 'boolean') {
    errors.push(`Capability ${index} must have a required boolean flag`);
  }

  return errors;
}

/**
 * Validate a workflow
 */
export function validateWorkflow(workflow: Workflow): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!workflow.id) {
    errors.push('Workflow must have an ID');
  }

  if (!workflow.name || workflow.name.trim().length === 0) {
    errors.push('Workflow must have a name');
  }

  if (!workflow.description || workflow.description.trim().length === 0) {
    errors.push('Workflow must have a description');
  }

  if (!workflow.version || workflow.version.trim().length === 0) {
    errors.push('Workflow must have a version');
  }

  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push('Workflow must have at least one node');
  } else {
    workflow.nodes.forEach((node, index) => {
      const nodeErrors = validateWorkflowNode(node, index);
      errors.push(...nodeErrors);
    });
  }

  if (!workflow.edges) {
    errors.push('Workflow must have edges array (can be empty)');
  } else {
    workflow.edges.forEach((edge, index) => {
      const edgeErrors = validateWorkflowEdge(edge, index, workflow.nodes);
      errors.push(...edgeErrors);
    });
  }

  if (!workflow.variables) {
    errors.push('Workflow must have variables array (can be empty)');
  }

  if (!workflow.metadata) {
    errors.push('Workflow must have metadata');
  } else {
    if (!workflow.metadata.author || workflow.metadata.author.trim().length === 0) {
      errors.push('Workflow metadata must have an author');
    }

    if (!workflow.metadata.category || workflow.metadata.category.trim().length === 0) {
      errors.push('Workflow metadata must have a category');
    }
  }

  if (!workflow.createdAt || !(workflow.createdAt instanceof Date)) {
    errors.push('Workflow must have a valid createdAt date');
  }

  if (!workflow.updatedAt || !(workflow.updatedAt instanceof Date)) {
    errors.push('Workflow must have a valid updatedAt date');
  }

  // Validate workflow structure
  const structureErrors = validateWorkflowStructure(workflow);
  errors.push(...structureErrors);

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate a workflow node
 */
export function validateWorkflowNode(node: WorkflowNode, index: number): string[] {
  const errors: string[] = [];

  if (!node.id) {
    errors.push(`Node ${index} must have an ID`);
  }

  if (!node.type) {
    errors.push(`Node ${index} must have a type`);
  }

  if (!node.name || node.name.trim().length === 0) {
    errors.push(`Node ${index} must have a name`);
  }

  if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
    errors.push(`Node ${index} must have a valid position`);
  }

  if (!node.parameters || typeof node.parameters !== 'object') {
    errors.push(`Node ${index} must have parameters object`);
  }

  if (!node.status) {
    errors.push(`Node ${index} must have a status`);
  }

  // Validate specific node types
  if (node.type === 'agent_task') {
    if (!node.agentId) {
      errors.push(`Agent task node ${index} must have an agentId`);
    }
    if (!node.capability) {
      errors.push(`Agent task node ${index} must have a capability`);
    }
  }

  if (node.type === 'condition') {
    if (!node.parameters.condition) {
      errors.push(`Condition node ${index} must have a condition parameter`);
    }
  }

  if (node.type === 'timer') {
    if (typeof node.parameters.duration !== 'number' || node.parameters.duration <= 0) {
      errors.push(`Timer node ${index} must have a positive duration parameter`);
    }
  }

  if (node.type === 'webhook') {
    if (!node.parameters.url) {
      errors.push(`Webhook node ${index} must have a URL parameter`);
    }
  }

  if (node.type === 'data_transform') {
    if (!node.parameters.transform) {
      errors.push(`Data transform node ${index} must have a transform parameter`);
    }
  }

  return errors;
}

/**
 * Validate a workflow edge
 */
export function validateWorkflowEdge(
  edge: WorkflowEdge, 
  index: number, 
  nodes: WorkflowNode[]
): string[] {
  const errors: string[] = [];

  if (!edge.id) {
    errors.push(`Edge ${index} must have an ID`);
  }

  if (!edge.source) {
    errors.push(`Edge ${index} must have a source`);
  }

  if (!edge.target) {
    errors.push(`Edge ${index} must have a target`);
  }

  // Check if source and target nodes exist
  const sourceExists = nodes.some(node => node.id === edge.source);
  const targetExists = nodes.some(node => node.id === edge.target);

  if (!sourceExists) {
    errors.push(`Edge ${index} references non-existent source node: ${edge.source}`);
  }

  if (!targetExists) {
    errors.push(`Edge ${index} references non-existent target node: ${edge.target}`);
  }

  if (edge.source === edge.target) {
    errors.push(`Edge ${index} cannot connect a node to itself`);
  }

  return errors;
}

/**
 * Validate workflow structure
 */
export function validateWorkflowStructure(workflow: Workflow): string[] {
  const errors: string[] = [];

  // Check for cycles
  const hasCycle = detectCycle(workflow.nodes, workflow.edges);
  if (hasCycle) {
    errors.push('Workflow contains cycles, which are not allowed');
  }

  // Check for orphaned nodes
  const nodeIds = new Set(workflow.nodes.map(node => node.id));
  const connectedNodes = new Set<string>();

  workflow.edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  const orphanedNodes = Array.from(nodeIds).filter(id => !connectedNodes.has(id));
  if (orphanedNodes.length > 1) {
    errors.push(`Workflow has multiple disconnected components: ${orphanedNodes.join(', ')}`);
  }

  // Check for unreachable nodes
  const reachableNodes = new Set<string>();
  const startingNodes = workflow.nodes.filter(node => 
    !workflow.edges.some(edge => edge.target === node.id)
  );

  if (startingNodes.length === 0) {
    errors.push('Workflow must have at least one starting node (node with no incoming edges)');
  }

  // Traverse from starting nodes
  const traverse = (nodeId: string) => {
    if (reachableNodes.has(nodeId)) return;
    reachableNodes.add(nodeId);
    
    const outgoingEdges = workflow.edges.filter(edge => edge.source === nodeId);
    outgoingEdges.forEach(edge => traverse(edge.target));
  };

  startingNodes.forEach(node => traverse(node.id));

  const unreachableNodes = Array.from(nodeIds).filter(id => !reachableNodes.has(id));
  if (unreachableNodes.length > 0) {
    errors.push(`Workflow has unreachable nodes: ${unreachableNodes.join(', ')}`);
  }

  return errors;
}

/**
 * Detect cycles in workflow graph
 */
function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycleDFS = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) {
      return true; // Cycle detected
    }

    if (visited.has(nodeId)) {
      return false; // Already processed
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    for (const edge of outgoingEdges) {
      if (hasCycleDFS(edge.target)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycleDFS(node.id)) {
        return true;
      }
    }
  }

  return false;
}
