/**
 * Canonical Agent Manifest Schema
 * This is the universal specification for describing agent capabilities,
 * inputs/outputs, runtime requirements, and metadata.
 */

export interface AgentManifest {
  /** Unique identifier for the agent */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Semantic version */
  version: string;
  
  /** Brief description of what the agent does */
  description: string;
  
  /** Runtime environment (nodejs, python, wasm, docker) */
  runtime: AgentRuntime;
  
  /** Input schema definition */
  inputs: Record<string, InputSchema>;
  
  /** Output schema definition */
  outputs: Record<string, OutputSchema>;
  
  /** Configuration parameters */
  config?: Record<string, ConfigSchema>;
  
  /** Event subscriptions */
  events?: EventSubscription[];
  
  /** Security and sandboxing requirements */
  security?: SecurityConfig;
  
  /** Resource requirements */
  resources?: ResourceRequirements;
  
  /** Metadata for discovery and categorization */
  metadata: AgentMetadata;
  
  /** Dependencies on other agents or services */
  dependencies?: AgentDependency[];
  
  /** Health check configuration */
  healthCheck?: HealthCheckConfig;
  
  /** Pricing information */
  pricing?: PricingConfig;
}

export type AgentRuntime = 'nodejs' | 'python' | 'wasm' | 'docker' | 'rust';

export interface InputSchema {
  /** Data type */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'text' | 'json';
  
  /** Description of the input */
  description: string;
  
  /** Whether this input is required */
  required?: boolean;
  
  /** Default value */
  default?: any;
  
  /** Validation constraints */
  constraints?: ValidationConstraints;
  
  /** For arrays, the item type */
  items?: InputSchema;
  
  /** For objects, the property schema */
  properties?: Record<string, InputSchema>;
}

export interface OutputSchema {
  /** Data type */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'text' | 'json';
  
  /** Description of the output */
  description: string;
  
  /** For arrays, the item type */
  items?: OutputSchema;
  
  /** For objects, the property schema */
  properties?: Record<string, OutputSchema>;
}

export interface ConfigSchema {
  /** Data type */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  
  /** Description */
  description: string;
  
  /** Default value */
  default?: any;
  
  /** Whether this config is required */
  required?: boolean;
  
  /** Validation constraints */
  constraints?: ValidationConstraints;
}

export interface ValidationConstraints {
  /** Minimum value (for numbers) */
  min?: number;
  
  /** Maximum value (for numbers) */
  max?: number;
  
  /** Minimum length (for strings/arrays) */
  minLength?: number;
  
  /** Maximum length (for strings/arrays) */
  maxLength?: number;
  
  /** Regular expression pattern (for strings) */
  pattern?: string;
  
  /** Enum values */
  enum?: any[];
  
  /** Custom validation function name */
  validator?: string;
}

export interface EventSubscription {
  /** Event type to subscribe to */
  event: string;
  
  /** Handler function name */
  handler: string;
  
  /** Filter conditions */
  filter?: Record<string, any>;
}

export interface SecurityConfig {
  /** Network access permissions */
  networkAccess?: {
    allowedHosts?: string[];
    blockedHosts?: string[];
    allowedPorts?: number[];
  };
  
  /** File system access */
  fileSystem?: {
    readPaths?: string[];
    writePaths?: string[];
    blockedPaths?: string[];
  };
  
  /** Environment variables access */
  environment?: {
    allowedVars?: string[];
    blockedVars?: string[];
  };
  
  /** CPU and memory limits */
  limits?: {
    maxCpu?: number; // CPU percentage
    maxMemory?: number; // MB
    maxExecutionTime?: number; // seconds
  };
  
  /** Sandboxing level */
  sandboxLevel?: 'none' | 'basic' | 'strict' | 'paranoid';
}

export interface ResourceRequirements {
  /** Minimum CPU cores */
  minCpu?: number;
  
  /** Minimum memory in MB */
  minMemory?: number;
  
  /** Minimum disk space in MB */
  minDisk?: number;
  
  /** GPU requirements */
  gpu?: {
    required: boolean;
    minMemory?: number;
    computeCapability?: string;
  };
  
  /** Network requirements */
  network?: {
    bandwidth?: number; // Mbps
    latency?: number; // ms
  };
}

export interface AgentMetadata {
  /** Author information */
  author: {
    name: string;
    email?: string;
    organization?: string;
  };
  
  /** Tags for categorization */
  tags: string[];
  
  /** Category (e.g., 'ai', 'data', 'security', 'finance') */
  category: string;
  
  /** Icon URL or emoji */
  icon?: string;
  
  /** Documentation URL */
  documentation?: string;
  
  /** License */
  license?: string;
  
  /** Repository URL */
  repository?: string;
  
  /** Keywords for search */
  keywords?: string[];
  
  /** Long description */
  longDescription?: string;
  
  /** Example usage */
  examples?: AgentExample[];
}

export interface AgentExample {
  /** Example name */
  name: string;
  
  /** Example description */
  description: string;
  
  /** Input example */
  input: Record<string, any>;
  
  /** Expected output */
  output: Record<string, any>;
}

export interface AgentDependency {
  /** Dependency type */
  type: 'agent' | 'service' | 'library';
  
  /** Dependency identifier */
  id: string;
  
  /** Version constraint */
  version?: string;
  
  /** Whether this dependency is required */
  required: boolean;
}

export interface HealthCheckConfig {
  /** Health check endpoint */
  endpoint?: string;
  
  /** Health check interval in seconds */
  interval?: number;
  
  /** Timeout in seconds */
  timeout?: number;
  
  /** Retry count */
  retries?: number;
  
  /** Health check command */
  command?: string;
}

export interface PricingConfig {
  /** Pricing model */
  model: 'per-request' | 'per-minute' | 'per-hour' | 'per-day' | 'free';
  
  /** Cost per unit */
  cost: number;
  
  /** Currency */
  currency: string;
  
  /** Free tier limits */
  freeTier?: {
    requests?: number;
    minutes?: number;
    hours?: number;
    days?: number;
  };
}

/**
 * Agent Manifest Validator
 */
export class AgentManifestValidator {
  private static readonly REQUIRED_FIELDS = [
    'id', 'name', 'version', 'description', 'runtime', 'inputs', 'outputs', 'metadata'
  ];

  private static readonly REQUIRED_METADATA_FIELDS = [
    'author', 'tags', 'category'
  ];

  /**
   * Validate an agent manifest
   */
  static validate(manifest: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    for (const field of this.REQUIRED_FIELDS) {
      if (!manifest[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate metadata
    if (manifest.metadata) {
      for (const field of this.REQUIRED_METADATA_FIELDS) {
        if (!manifest.metadata[field]) {
          errors.push(`Missing required metadata field: ${field}`);
        }
      }
    }

    // Validate runtime
    if (manifest.runtime && !['nodejs', 'python', 'wasm', 'docker', 'rust'].includes(manifest.runtime)) {
      errors.push(`Invalid runtime: ${manifest.runtime}`);
    }

    // Validate version format
    if (manifest.version && !this.isValidVersion(manifest.version)) {
      errors.push(`Invalid version format: ${manifest.version}`);
    }

    // Validate inputs/outputs schemas
    if (manifest.inputs) {
      this.validateSchemas(manifest.inputs, 'inputs', errors, warnings);
    }

    if (manifest.outputs) {
      this.validateSchemas(manifest.outputs, 'outputs', errors, warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static validateSchemas(
    schemas: Record<string, any>, 
    context: string, 
    errors: string[], 
    warnings: string[]
  ): void {
    for (const [key, schema] of Object.entries(schemas)) {
      if (!schema.type) {
        errors.push(`Missing type in ${context}.${key}`);
      } else if (!['string', 'number', 'boolean', 'object', 'array', 'text', 'json'].includes(schema.type)) {
        errors.push(`Invalid type in ${context}.${key}: ${schema.type}`);
      }

      if (!schema.description) {
        warnings.push(`Missing description in ${context}.${key}`);
      }
    }
  }

  private static isValidVersion(version: string): boolean {
    // Simple semantic version validation
    return /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(version);
  }
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Agent Manifest Factory
 */
export class AgentManifestFactory {
  /**
   * Create a basic agent manifest template
   */
  static createTemplate(
    id: string,
    name: string,
    description: string,
    runtime: AgentRuntime = 'nodejs'
  ): AgentManifest {
    return {
      id,
      name,
      version: '1.0.0',
      description,
      runtime,
      inputs: {},
      outputs: {},
      metadata: {
        author: {
          name: 'Unknown',
          email: '',
          organization: ''
        },
        tags: [],
        category: 'general',
        keywords: [],
        examples: []
      }
    };
  }

  /**
   * Create a research synthesizer agent manifest
   */
  static createResearchSynthesizer(): AgentManifest {
    return {
      id: 'research_synthesizer_v1',
      name: 'Research Synthesizer',
      version: '1.0.0',
      description: 'Generates structured summaries from research documents with citations',
      runtime: 'nodejs',
      inputs: {
        documents: {
          type: 'array',
          description: 'Array of research documents to synthesize',
          required: true,
          items: {
            type: 'object',
            description: 'Research document',
            properties: {
              title: { type: 'string', description: 'Document title' },
              content: { type: 'text', description: 'Document content' },
              source: { type: 'string', description: 'Document source URL' }
            }
          }
        },
        prompt_config: {
          type: 'object',
          description: 'Configuration for the synthesis prompt',
          properties: {
            max_tokens: { type: 'number', description: 'Maximum tokens to generate', default: 1500 },
            temperature: { type: 'number', description: 'Sampling temperature', default: 0.0 },
            focus_areas: { type: 'array', description: 'Areas to focus on', items: { type: 'string' } }
          }
        }
      },
      outputs: {
        summary: {
          type: 'text',
          description: 'Structured summary of the research'
        },
        claims: {
          type: 'array',
          description: 'List of claims with evidence',
          items: {
            type: 'object',
            properties: {
              claim: { type: 'text', description: 'The claim being made' },
              evidence: { type: 'array', description: 'Supporting evidence', items: { type: 'string' } },
              confidence: { type: 'number', description: 'Confidence score 0-1' }
            }
          }
        },
        confidence_score: {
          type: 'number',
          description: 'Overall confidence in the synthesis'
        }
      },
      config: {
        llm_provider: {
          type: 'string',
          description: 'LLM provider to use',
          default: 'mistral',
          enum: ['mistral', 'openai', 'anthropic']
        },
        max_tokens: {
          type: 'number',
          description: 'Maximum tokens to generate',
          default: 1500,
          constraints: { min: 100, max: 4000 }
        },
        temperature: {
          type: 'number',
          description: 'Sampling temperature',
          default: 0.0,
          constraints: { min: 0, max: 2 }
        }
      },
      security: {
        networkAccess: {
          allowedHosts: ['api.mistral.ai', 'api.openai.com', 'api.anthropic.com']
        },
        limits: {
          maxMemory: 512,
          maxExecutionTime: 300
        },
        sandboxLevel: 'basic'
      },
      metadata: {
        author: {
          name: 'Agent Labs',
          email: 'team@agentlabs.ai',
          organization: 'Agent Labs'
        },
        tags: ['ai', 'research', 'synthesis', 'llm'],
        category: 'ai',
        keywords: ['research', 'synthesis', 'summarization', 'citations'],
        longDescription: 'An AI agent that synthesizes research documents into structured summaries with proper citations and confidence scoring.',
        examples: [
          {
            name: 'Academic Paper Synthesis',
            description: 'Synthesize multiple academic papers on a topic',
            input: {
              documents: [
                {
                  title: 'Machine Learning in Healthcare',
                  content: 'This paper explores...',
                  source: 'https://example.com/paper1'
                }
              ],
              prompt_config: {
                max_tokens: 1000,
                temperature: 0.1,
                focus_areas: ['methodology', 'results']
              }
            },
            output: {
              summary: 'This synthesis covers...',
              claims: [
                {
                  claim: 'ML improves diagnostic accuracy',
                  evidence: ['Paper 1, Section 3', 'Paper 2, Figure 2'],
                  confidence: 0.85
                }
              ],
              confidence_score: 0.82
            }
          }
        ]
      }
    };
  }

  /**
   * Create a risk scorer agent manifest
   */
  static createRiskScorer(): AgentManifest {
    return {
      id: 'risk_scorer_xgb_v1',
      name: 'Risk Scorer',
      version: '1.0.0',
      description: 'Machine learning risk scoring for financial applications',
      runtime: 'python',
      inputs: {
        features: {
          type: 'object',
          description: 'Financial features for risk assessment',
          required: true,
          properties: {
            monthly_income: { type: 'number', description: 'Monthly income' },
            avg_balance: { type: 'number', description: 'Average account balance' },
            debt_ratio: { type: 'number', description: 'Debt to income ratio' },
            credit_score: { type: 'number', description: 'Credit score' },
            employment_years: { type: 'number', description: 'Years of employment' }
          }
        },
        model_config: {
          type: 'object',
          description: 'Model configuration parameters',
          properties: {
            model_version: { type: 'string', description: 'Model version to use', default: 'v2.1' },
            explain: { type: 'boolean', description: 'Generate explanations', default: true }
          }
        }
      },
      outputs: {
        score: {
          type: 'number',
          description: 'Risk score between 0 and 1'
        },
        explanations: {
          type: 'object',
          description: 'Feature importance and explanations',
          properties: {
            feature_importance: { type: 'object', description: 'Feature importance scores' },
            decision_factors: { type: 'array', description: 'Key decision factors', items: { type: 'string' } },
            risk_level: { type: 'string', description: 'Risk level category' }
          }
        }
      },
      config: {
        model_version: {
          type: 'string',
          description: 'Model version to use',
          default: 'v2.1'
        },
        threshold_map: {
          type: 'object',
          description: 'Score thresholds for different risk levels',
          default: {
            low: 0.3,
            medium: 0.6,
            high: 0.8
          }
        },
        explain: {
          type: 'boolean',
          description: 'Generate explanations',
          default: true
        }
      },
      security: {
        limits: {
          maxMemory: 1024,
          maxExecutionTime: 60
        },
        sandboxLevel: 'strict'
      },
      metadata: {
        author: {
          name: 'Agent Labs',
          email: 'team@agentlabs.ai',
          organization: 'Agent Labs'
        },
        tags: ['finance', 'ml', 'risk', 'scoring'],
        category: 'finance',
        keywords: ['risk', 'scoring', 'credit', 'finance', 'ml'],
        longDescription: 'A machine learning agent that scores financial risk using XGBoost and provides explainable AI insights.',
        examples: [
          {
            name: 'Credit Application Scoring',
            description: 'Score a credit application',
            input: {
              features: {
                monthly_income: 5000,
                avg_balance: 2500,
                debt_ratio: 0.3,
                credit_score: 720,
                employment_years: 3
              },
              model_config: {
                model_version: 'v2.1',
                explain: true
              }
            },
            output: {
              score: 0.25,
              explanations: {
                feature_importance: {
                  credit_score: 0.4,
                  debt_ratio: 0.3,
                  employment_years: 0.2,
                  monthly_income: 0.1
                },
                decision_factors: [
                  'Strong credit score',
                  'Low debt ratio',
                  'Stable employment history'
                ],
                risk_level: 'low'
              }
            }
          }
        ]
      }
    };
  }
}
