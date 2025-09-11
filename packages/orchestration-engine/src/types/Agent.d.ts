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
export declare enum AgentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ERROR = "error",
    STARTING = "starting",
    STOPPING = "stopping"
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
export interface AgentMessage {
    id: string;
    from: string;
    to: string;
    type: MessageType;
    payload: any;
    timestamp: Date;
    correlationId?: string;
}
export declare enum MessageType {
    TASK_REQUEST = "task_request",
    TASK_RESPONSE = "task_response",
    TASK_ERROR = "task_error",
    HEARTBEAT = "heartbeat",
    STATUS_UPDATE = "status_update",
    CAPABILITY_ANNOUNCEMENT = "capability_announcement"
}
export interface TaskRequest {
    taskId: string;
    agentId: string;
    capability: string;
    parameters: Record<string, any>;
    priority: TaskPriority;
    timeout?: number;
    retryCount?: number;
}
export declare enum TaskPriority {
    LOW = 1,
    NORMAL = 2,
    HIGH = 3,
    CRITICAL = 4
}
export interface TaskResponse {
    taskId: string;
    agentId: string;
    status: TaskStatus;
    result?: any;
    error?: string;
    executionTime: number;
    timestamp: Date;
}
export declare enum TaskStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    TIMEOUT = "timeout",
    CANCELLED = "cancelled"
}
//# sourceMappingURL=Agent.d.ts.map