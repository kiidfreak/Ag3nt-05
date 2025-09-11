export interface Agent {
  id: string;
  name: string;
  type: string;
  version: string;
  status: AgentStatus;
  capabilities: AgentCapability[];
  metadata: AgentMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  STARTING = 'starting',
  STOPPING = 'stopping'
}

export interface AgentCapability {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  required: boolean;
}

export interface AgentMetadata {
  author: string;
  description: string;
  tags: string[];
  category: string;
  icon?: string;
  documentation?: string;
}
