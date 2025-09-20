/**
 * Agent SDK for Node.js
 * Provides standard interfaces for building agents that work with Agent OS
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { AgentManifest, AgentManifestValidator } from '../schemas/AgentManifest';

export interface AgentContext {
  agentId: string;
  sessionId: string;
  userId?: string;
  metadata: Record<string, any>;
}

export interface AgentInput {
  [key: string]: any;
}

export interface AgentOutput {
  [key: string]: any;
}

export interface AgentConfig {
  [key: string]: any;
}

export interface AgentEvent {
  type: string;
  data: any;
  timestamp: Date;
  correlationId?: string;
}

export interface AgentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  details: Record<string, any>;
  metrics: Record<string, number>;
}

export abstract class BaseAgent extends EventEmitter {
  protected manifest: AgentManifest;
  protected context: AgentContext | null = null;
  protected config: AgentConfig = {};
  protected isRunning: boolean = false;
  protected healthStatus: AgentHealth = {
    status: 'healthy',
    details: {},
    metrics: {}
  };

  constructor(manifest: AgentManifest) {
    super();
    
    // Validate manifest
    const validation = AgentManifestValidator.validate(manifest);
    if (!validation.valid) {
      throw new Error(`Invalid agent manifest: ${validation.errors.join(', ')}`);
    }
    
    this.manifest = manifest;
    this.setupEventHandlers();
  }

  /**
   * Initialize the agent
   */
  async initialize(context: AgentContext, config: AgentConfig = {}): Promise<void> {
    this.context = context;
    this.config = { ...this.manifest.config, ...config };
    this.isRunning = true;
    
    await this.onInitialize();
    this.emit('agent:initialized', { agentId: this.manifest.id, context });
  }

  /**
   * Shutdown the agent
   */
  async shutdown(): Promise<void> {
    this.isRunning = false;
    await this.onShutdown();
    this.emit('agent:shutdown', { agentId: this.manifest.id });
  }

  /**
   * Execute a task
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    if (!this.isRunning) {
      throw new Error('Agent is not running');
    }

    const taskId = uuidv4();
    const startTime = Date.now();

    try {
      this.emit('task:started', { taskId, input, agentId: this.manifest.id });
      
      // Validate input
      this.validateInput(input);
      
      // Execute the task
      const result = await this.onExecute(input);
      
      // Validate output
      this.validateOutput(result);
      
      const executionTime = Date.now() - startTime;
      this.emit('task:completed', { 
        taskId, 
        result, 
        executionTime, 
        agentId: this.manifest.id 
      });
      
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.emit('task:failed', { 
        taskId, 
        error: error instanceof Error ? error.message : String(error),
        executionTime,
        agentId: this.manifest.id 
      });
      throw error;
    }
  }

  /**
   * Get agent health status
   */
  getHealth(): AgentHealth {
    return this.healthStatus;
  }

  /**
   * Update health status
   */
  protected updateHealth(status: Partial<AgentHealth>): void {
    this.healthStatus = { ...this.healthStatus, ...status };
    this.emit('health:updated', this.healthStatus);
  }

  /**
   * Publish an event
   */
  protected publishEvent(type: string, data: any, correlationId?: string): void {
    const event: AgentEvent = {
      type,
      data,
      timestamp: new Date(),
      correlationId
    };
    
    this.emit('event:published', event);
  }

  /**
   * Log a message
   */
  protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    const logEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      agentId: this.manifest.id,
      sessionId: this.context?.sessionId
    };
    
    this.emit('log', logEntry);
  }

  /**
   * Get agent manifest
   */
  getManifest(): AgentManifest {
    return this.manifest;
  }

  /**
   * Get agent context
   */
  getContext(): AgentContext | null {
    return this.context;
  }

  /**
   * Get agent configuration
   */
  getConfig(): AgentConfig {
    return this.config;
  }

  /**
   * Validate input against manifest schema
   */
  private validateInput(input: AgentInput): void {
    for (const [key, schema] of Object.entries(this.manifest.inputs)) {
      if (schema.required && !(key in input)) {
        throw new Error(`Required input '${key}' is missing`);
      }
      
      if (key in input) {
        this.validateValue(input[key], schema, key);
      }
    }
  }

  /**
   * Validate output against manifest schema
   */
  private validateOutput(output: AgentOutput): void {
    for (const [key, schema] of Object.entries(this.manifest.outputs)) {
      if (!(key in output)) {
        throw new Error(`Required output '${key}' is missing`);
      }
      
      this.validateValue(output[key], schema, key);
    }
  }

  /**
   * Validate a value against a schema
   */
  private validateValue(value: any, schema: any, path: string): void {
    if (schema.type === 'array' && !Array.isArray(value)) {
      throw new Error(`Expected array for '${path}', got ${typeof value}`);
    }
    
    if (schema.type === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
      throw new Error(`Expected object for '${path}', got ${typeof value}`);
    }
    
    if (['string', 'text'].includes(schema.type) && typeof value !== 'string') {
      throw new Error(`Expected string for '${path}', got ${typeof value}`);
    }
    
    if (schema.type === 'number' && typeof value !== 'number') {
      throw new Error(`Expected number for '${path}', got ${typeof value}`);
    }
    
    if (schema.type === 'boolean' && typeof value !== 'boolean') {
      throw new Error(`Expected boolean for '${path}', got ${typeof value}`);
    }
    
    // Validate constraints
    if (schema.constraints) {
      this.validateConstraints(value, schema.constraints, path);
    }
  }

  /**
   * Validate constraints
   */
  private validateConstraints(value: any, constraints: any, path: string): void {
    if (constraints.min !== undefined && value < constraints.min) {
      throw new Error(`Value for '${path}' must be >= ${constraints.min}`);
    }
    
    if (constraints.max !== undefined && value > constraints.max) {
      throw new Error(`Value for '${path}' must be <= ${constraints.max}`);
    }
    
    if (constraints.minLength !== undefined && value.length < constraints.minLength) {
      throw new Error(`Value for '${path}' must have length >= ${constraints.minLength}`);
    }
    
    if (constraints.maxLength !== undefined && value.length > constraints.maxLength) {
      throw new Error(`Value for '${path}' must have length <= ${constraints.maxLength}`);
    }
    
    if (constraints.pattern && !new RegExp(constraints.pattern).test(value)) {
      throw new Error(`Value for '${path}' does not match pattern ${constraints.pattern}`);
    }
    
    if (constraints.enum && !constraints.enum.includes(value)) {
      throw new Error(`Value for '${path}' must be one of: ${constraints.enum.join(', ')}`);
    }
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    this.on('error', (error) => {
      this.log('error', 'Agent error', { error: error.message, stack: error.stack });
    });
  }

  // Abstract methods to be implemented by concrete agents
  protected abstract onInitialize(): Promise<void>;
  protected abstract onShutdown(): Promise<void>;
  protected abstract onExecute(input: AgentInput): Promise<AgentOutput>;
}

/**
 * HTTP Agent - for agents that communicate via HTTP
 */
export class HttpAgent extends BaseAgent {
  private server: any = null;
  private port: number;

  constructor(manifest: AgentManifest, port: number = 3000) {
    super(manifest);
    this.port = port;
  }

  protected async onInitialize(): Promise<void> {
    // Start HTTP server
    const express = require('express');
    const app = express();
    
    app.use(express.json());
    
    // Health check endpoint
    app.get('/health', (req: any, res: any) => {
      res.json(this.getHealth());
    });
    
    // Execute endpoint
    app.post('/execute', async (req: any, res: any) => {
      try {
        const result = await this.execute(req.body);
        res.json({ success: true, data: result });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    });
    
    this.server = app.listen(this.port, () => {
      this.log('info', `HTTP agent listening on port ${this.port}`);
    });
  }

  protected async onShutdown(): Promise<void> {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  protected async onExecute(input: AgentInput): Promise<AgentOutput> {
    // This should be overridden by concrete implementations
    throw new Error('onExecute must be implemented by concrete HTTP agents');
  }
}

/**
 * WebSocket Agent - for real-time communication
 */
export class WebSocketAgent extends BaseAgent {
  private wss: any = null;
  private port: number;

  constructor(manifest: AgentManifest, port: number = 3001) {
    super(manifest);
    this.port = port;
  }

  protected async onInitialize(): Promise<void> {
    const WebSocket = require('ws');
    
    this.wss = new WebSocket.Server({ port: this.port });
    
    this.wss.on('connection', (ws: any) => {
      this.log('info', 'WebSocket client connected');
      
      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          
          if (data.type === 'execute') {
            const result = await this.execute(data.input);
            ws.send(JSON.stringify({ 
              type: 'result', 
              taskId: data.taskId,
              data: result 
            }));
          }
        } catch (error) {
          ws.send(JSON.stringify({ 
            type: 'error', 
            taskId: data.taskId,
            error: error instanceof Error ? error.message : String(error) 
          }));
        }
      });
      
      ws.on('close', () => {
        this.log('info', 'WebSocket client disconnected');
      });
    });
    
    this.log('info', `WebSocket agent listening on port ${this.port}`);
  }

  protected async onShutdown(): Promise<void> {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
  }

  protected async onExecute(input: AgentInput): Promise<AgentOutput> {
    // This should be overridden by concrete implementations
    throw new Error('onExecute must be implemented by concrete WebSocket agents');
  }
}

/**
 * Utility functions
 */
export class AgentUtils {
  /**
   * Create a correlation ID
   */
  static createCorrelationId(): string {
    return uuidv4();
  }

  /**
   * Format execution time
   */
  static formatExecutionTime(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  }

  /**
   * Retry with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (i === maxRetries) {
          throw lastError;
        }
        
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Timeout a promise
   */
  static async timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
      )
    ]);
  }
}

// Export types and classes
export {
  AgentManifest,
  AgentManifestValidator,
  AgentManifestFactory
} from '../schemas/AgentManifest';

export * from './types';
