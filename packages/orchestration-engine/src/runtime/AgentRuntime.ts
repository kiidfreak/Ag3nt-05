/**
 * Agent Runtime System
 * Manages execution of agents in secure sandboxes
 */

import { EventEmitter } from 'events';
import { AgentManifest, SecurityConfig } from '../schemas/AgentManifest';
import { AgentContext, AgentInput, AgentOutput } from '../types/Agent';

export interface RuntimeConfig {
  sandboxType: 'docker' | 'wasm' | 'node' | 'python';
  securityLevel: 'none' | 'basic' | 'strict' | 'paranoid';
  resourceLimits: {
    maxMemory: number; // MB
    maxCpu: number; // percentage
    maxExecutionTime: number; // seconds
    maxDisk: number; // MB
  };
  networkPolicy: {
    allowedHosts: string[];
    blockedHosts: string[];
    allowedPorts: number[];
  };
  fileSystemPolicy: {
    readPaths: string[];
    writePaths: string[];
    blockedPaths: string[];
  };
}

export interface RuntimeMetrics {
  startTime: number;
  endTime?: number;
  memoryUsage: number;
  cpuUsage: number;
  networkRequests: number;
  fileOperations: number;
  executionTime: number;
  status: 'running' | 'completed' | 'failed' | 'timeout' | 'killed';
}

export abstract class AgentRuntime extends EventEmitter {
  protected manifest: AgentManifest;
  protected config: RuntimeConfig;
  protected metrics: RuntimeMetrics;
  protected isRunning: boolean = false;
  protected processId?: string;

  constructor(manifest: AgentManifest, config: RuntimeConfig) {
    super();
    this.manifest = manifest;
    this.config = config;
    this.metrics = {
      startTime: Date.now(),
      memoryUsage: 0,
      cpuUsage: 0,
      networkRequests: 0,
      fileOperations: 0,
      executionTime: 0,
      status: 'running'
    };
  }

  /**
   * Initialize the runtime environment
   */
  abstract initialize(): Promise<void>;

  /**
   * Execute an agent with given input
   */
  abstract execute(
    context: AgentContext,
    input: AgentInput
  ): Promise<AgentOutput>;

  /**
   * Shutdown the runtime
   */
  abstract shutdown(): Promise<void>;

  /**
   * Get runtime metrics
   */
  getMetrics(): RuntimeMetrics {
    return { ...this.metrics };
  }

  /**
   * Get runtime status
   */
  getStatus(): string {
    return this.metrics.status;
  }

  /**
   * Kill the runtime process
   */
  abstract kill(): Promise<void>;

  /**
   * Validate security configuration
   */
  protected validateSecurityConfig(security: SecurityConfig): void {
    if (security.limits) {
      if (security.limits.maxMemory && security.limits.maxMemory > this.config.resourceLimits.maxMemory) {
        throw new Error(`Agent memory limit (${security.limits.maxMemory}MB) exceeds runtime limit (${this.config.resourceLimits.maxMemory}MB)`);
      }
      
      if (security.limits.maxExecutionTime && security.limits.maxExecutionTime > this.config.resourceLimits.maxExecutionTime) {
        throw new Error(`Agent execution time limit (${security.limits.maxExecutionTime}s) exceeds runtime limit (${this.config.resourceLimits.maxExecutionTime}s)`);
      }
    }

    if (security.networkAccess) {
      const allowedHosts = security.networkAccess.allowedHosts || [];
      const blockedHosts = security.networkAccess.blockedHosts || [];
      
      for (const host of allowedHosts) {
        if (this.config.networkPolicy.blockedHosts.includes(host)) {
          throw new Error(`Agent requested access to blocked host: ${host}`);
        }
      }
      
      for (const host of blockedHosts) {
        if (this.config.networkPolicy.allowedHosts.includes(host)) {
          throw new Error(`Agent blocked access to allowed host: ${host}`);
        }
      }
    }
  }

  /**
   * Update metrics
   */
  protected updateMetrics(updates: Partial<RuntimeMetrics>): void {
    this.metrics = { ...this.metrics, ...updates };
    this.emit('metrics:updated', this.metrics);
  }

  /**
   * Mark execution as completed
   */
  protected markCompleted(): void {
    this.metrics.endTime = Date.now();
    this.metrics.executionTime = this.metrics.endTime - this.metrics.startTime;
    this.metrics.status = 'completed';
    this.updateMetrics(this.metrics);
  }

  /**
   * Mark execution as failed
   */
  protected markFailed(error: Error): void {
    this.metrics.endTime = Date.now();
    this.metrics.executionTime = this.metrics.endTime - this.metrics.startTime;
    this.metrics.status = 'failed';
    this.updateMetrics(this.metrics);
    this.emit('error', error);
  }
}

/**
 * Docker Runtime
 * Executes agents in Docker containers
 */
export class DockerRuntime extends AgentRuntime {
  private containerId?: string;
  private dockerClient: any;

  constructor(manifest: AgentManifest, config: RuntimeConfig) {
    super(manifest, config);
    this.dockerClient = require('dockerode')();
  }

  async initialize(): Promise<void> {
    try {
      // Validate security configuration
      if (this.manifest.security) {
        this.validateSecurityConfig(this.manifest.security);
      }

      // Create Docker container
      const containerConfig = this.createContainerConfig();
      const container = await this.dockerClient.createContainer(containerConfig);
      this.containerId = container.id;
      this.processId = container.id;

      // Start container
      await container.start();
      
      this.isRunning = true;
      this.emit('runtime:initialized', { containerId: this.containerId });
    } catch (error) {
      this.markFailed(error as Error);
      throw error;
    }
  }

  async execute(context: AgentContext, input: AgentInput): Promise<AgentOutput> {
    if (!this.containerId) {
      throw new Error('Runtime not initialized');
    }

    try {
      const container = this.dockerClient.getContainer(this.containerId);
      
      // Execute the agent
      const exec = await container.exec({
        Cmd: ['node', 'agent.js', JSON.stringify({ context, input })],
        AttachStdout: true,
        AttachStderr: true
      });

      const stream = await exec.start();
      
      let output = '';
      let error = '';

      stream.on('data', (chunk: Buffer) => {
        output += chunk.toString();
      });

      stream.on('error', (err: Error) => {
        error += err.message;
      });

      // Wait for completion with timeout
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Execution timeout'));
        }, this.config.resourceLimits.maxExecutionTime * 1000);

        stream.on('end', () => {
          clearTimeout(timeout);
          resolve(undefined);
        });
      });

      if (error) {
        throw new Error(`Agent execution failed: ${error}`);
      }

      const result = JSON.parse(output);
      this.markCompleted();
      return result;

    } catch (error) {
      this.markFailed(error as Error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    if (this.containerId) {
      try {
        const container = this.dockerClient.getContainer(this.containerId);
        await container.stop();
        await container.remove();
        this.isRunning = false;
        this.emit('runtime:shutdown', { containerId: this.containerId });
      } catch (error) {
        this.emit('error', error);
      }
    }
  }

  async kill(): Promise<void> {
    if (this.containerId) {
      try {
        const container = this.dockerClient.getContainer(this.containerId);
        await container.kill();
        await container.remove();
        this.isRunning = false;
        this.metrics.status = 'killed';
        this.emit('runtime:killed', { containerId: this.containerId });
      } catch (error) {
        this.emit('error', error);
      }
    }
  }

  private createContainerConfig(): any {
    const security = this.manifest.security || {};
    const limits = security.limits || {};

    return {
      Image: this.getAgentImage(),
      Cmd: ['node', 'agent.js'],
      Env: [
        `AGENT_ID=${this.manifest.id}`,
        `AGENT_VERSION=${this.manifest.version}`,
        `RUNTIME_CONFIG=${JSON.stringify(this.config)}`
      ],
      HostConfig: {
        Memory: (limits.maxMemory || this.config.resourceLimits.maxMemory) * 1024 * 1024, // Convert to bytes
        CpuQuota: (limits.maxCpu || this.config.resourceLimits.maxCpu) * 10000, // Convert to microseconds
        CpuPeriod: 100000, // 100ms
        NetworkMode: 'bridge',
        ReadonlyRootfs: security.sandboxLevel === 'strict' || security.sandboxLevel === 'paranoid',
        SecurityOpt: security.sandboxLevel === 'paranoid' ? ['no-new-privileges:true'] : [],
        Ulimits: [
          {
            Name: 'nproc',
            Soft: 100,
            Hard: 100
          }
        ]
      },
      Labels: {
        'agent.id': this.manifest.id,
        'agent.version': this.manifest.version,
        'runtime.type': 'docker'
      }
    };
  }

  private getAgentImage(): string {
    const runtime = this.manifest.runtime;
    
    switch (runtime) {
      case 'nodejs':
        return 'node:18-alpine';
      case 'python':
        return 'python:3.11-alpine';
      case 'rust':
        return 'rust:alpine';
      default:
        return 'node:18-alpine';
    }
  }
}

/**
 * WASM Runtime
 * Executes agents in WebAssembly sandbox
 */
export class WASMRuntime extends AgentRuntime {
  private wasmModule?: WebAssembly.Module;
  private wasmInstance?: WebAssembly.Instance;

  constructor(manifest: AgentManifest, config: RuntimeConfig) {
    super(manifest, config);
  }

  async initialize(): Promise<void> {
    try {
      // Load WASM module
      const wasmBytes = await this.loadWASMModule();
      this.wasmModule = await WebAssembly.compile(wasmBytes);
      this.wasmInstance = await WebAssembly.instantiate(this.wasmModule, {
        env: this.createWASMImports()
      });

      this.isRunning = true;
      this.emit('runtime:initialized', { type: 'wasm' });
    } catch (error) {
      this.markFailed(error as Error);
      throw error;
    }
  }

  async execute(context: AgentContext, input: AgentInput): Promise<AgentOutput> {
    if (!this.wasmInstance) {
      throw new Error('WASM runtime not initialized');
    }

    try {
      // Execute WASM function
      const executeFunc = this.wasmInstance.exports.execute as Function;
      const result = executeFunc(JSON.stringify({ context, input }));
      
      this.markCompleted();
      return JSON.parse(result);
    } catch (error) {
      this.markFailed(error as Error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    this.wasmInstance = undefined;
    this.wasmModule = undefined;
    this.isRunning = false;
    this.emit('runtime:shutdown', { type: 'wasm' });
  }

  async kill(): Promise<void> {
    await this.shutdown();
    this.metrics.status = 'killed';
    this.emit('runtime:killed', { type: 'wasm' });
  }

  private async loadWASMModule(): Promise<ArrayBuffer> {
    // This would load the actual WASM module for the agent
    // For now, return a placeholder
    return new ArrayBuffer(0);
  }

  private createWASMImports(): any {
    return {
      // Provide limited system calls to WASM
      console_log: (ptr: number, len: number) => {
        // Limited console logging
      },
      memory_alloc: (size: number) => {
        // Memory allocation with limits
        if (size > this.config.resourceLimits.maxMemory * 1024 * 1024) {
          throw new Error('Memory allocation limit exceeded');
        }
        return 0; // Placeholder
      },
      memory_free: (ptr: number) => {
        // Memory deallocation
      }
    };
  }
}

/**
 * Node.js Runtime
 * Executes agents in Node.js process with sandboxing
 */
export class NodeRuntime extends AgentRuntime {
  private vmContext?: any;
  private agentCode?: string;

  constructor(manifest: AgentManifest, config: RuntimeConfig) {
    super(manifest, config);
  }

  async initialize(): Promise<void> {
    try {
      const vm = require('vm');
      
      // Create sandboxed context
      this.vmContext = vm.createContext({
        console: {
          log: (...args: any[]) => this.emit('log', args.join(' ')),
          error: (...args: any[]) => this.emit('error', args.join(' '))
        },
        setTimeout: (fn: Function, delay: number) => {
          if (delay > this.config.resourceLimits.maxExecutionTime * 1000) {
            throw new Error('Timeout exceeds execution limit');
          }
          return setTimeout(fn, delay);
        },
        require: this.createSandboxedRequire()
      });

      // Load agent code
      this.agentCode = await this.loadAgentCode();
      
      this.isRunning = true;
      this.emit('runtime:initialized', { type: 'node' });
    } catch (error) {
      this.markFailed(error as Error);
      throw error;
    }
  }

  async execute(context: AgentContext, input: AgentInput): Promise<AgentOutput> {
    if (!this.vmContext || !this.agentCode) {
      throw new Error('Node runtime not initialized');
    }

    try {
      const vm = require('vm');
      
      // Execute agent code in sandbox
      const script = new vm.Script(this.agentCode);
      const result = script.runInContext(this.vmContext, {
        timeout: this.config.resourceLimits.maxExecutionTime * 1000
      });

      this.markCompleted();
      return result;
    } catch (error) {
      this.markFailed(error as Error);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    this.vmContext = undefined;
    this.agentCode = undefined;
    this.isRunning = false;
    this.emit('runtime:shutdown', { type: 'node' });
  }

  async kill(): Promise<void> {
    await this.shutdown();
    this.metrics.status = 'killed';
    this.emit('runtime:killed', { type: 'node' });
  }

  private createSandboxedRequire(): Function {
    const allowedModules = [
      'crypto', 'util', 'events', 'stream', 'buffer', 'url', 'querystring'
    ];

    return (moduleName: string) => {
      if (!allowedModules.includes(moduleName)) {
        throw new Error(`Module '${moduleName}' is not allowed in sandbox`);
      }
      return require(moduleName);
    };
  }

  private async loadAgentCode(): Promise<string> {
    // This would load the actual agent code
    // For now, return a placeholder
    return `
      module.exports = async function execute(input) {
        return { result: 'placeholder' };
      };
    `;
  }
}

/**
 * Runtime Factory
 * Creates appropriate runtime based on manifest and configuration
 */
export class RuntimeFactory {
  static createRuntime(
    manifest: AgentManifest,
    config: RuntimeConfig
  ): AgentRuntime {
    const sandboxType = config.sandboxType || this.getDefaultSandboxType(manifest.runtime);
    
    switch (sandboxType) {
      case 'docker':
        return new DockerRuntime(manifest, config);
      case 'wasm':
        return new WASMRuntime(manifest, config);
      case 'node':
        return new NodeRuntime(manifest, config);
      default:
        throw new Error(`Unsupported sandbox type: ${sandboxType}`);
    }
  }

  private static getDefaultSandboxType(runtime: string): string {
    switch (runtime) {
      case 'nodejs':
        return 'node';
      case 'python':
        return 'docker';
      case 'rust':
        return 'docker';
      case 'wasm':
        return 'wasm';
      default:
        return 'node';
    }
  }
}

export default {
  AgentRuntime,
  DockerRuntime,
  WASMRuntime,
  NodeRuntime,
  RuntimeFactory
};
