export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
  metadata: WorkflowMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ERROR = 'error',
  COMPLETED = 'completed'
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  agentId?: string;
  capability?: string;
  parameters: Record<string, any>;
  position: Position;
  status: NodeStatus;
  executionTime?: number;
  error?: string;
}

export enum NodeType {
  AGENT_TASK = 'agent_task',
  CONDITION = 'condition',
  PARALLEL = 'parallel',
  SEQUENCE = 'sequence',
  TIMER = 'timer',
  WEBHOOK = 'webhook',
  DATA_TRANSFORM = 'data_transform'
}

export interface Position {
  x: number;
  y: number;
}

export enum NodeStatus {
  PENDING = 'pending',
  READY = 'ready',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
  label?: string;
}

export interface WorkflowVariable {
  name: string;
  type: VariableType;
  value: any;
  description?: string;
  required: boolean;
}

export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array'
}

export interface WorkflowMetadata {
  author: string;
  tags: string[];
  category: string;
  icon?: string;
  documentation?: string;
  estimatedDuration?: number;
  complexity: ComplexityLevel;
}

export enum ComplexityLevel {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  ENTERPRISE = 'enterprise'
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  variables: Record<string, any>;
  results: Record<string, any>;
  errors: WorkflowError[];
  nodeExecutions: NodeExecution[];
}

export enum ExecutionStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout'
}

export interface WorkflowError {
  nodeId: string;
  message: string;
  stack?: string;
  timestamp: Date;
}

export interface NodeExecution {
  nodeId: string;
  status: NodeStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  result?: any;
  error?: string;
}
