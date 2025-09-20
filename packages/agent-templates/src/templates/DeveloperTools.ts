/**
 * Developer Tools Pipeline Template
 * PR Collector → Static Analyzer → Test Runner → Review Synthesizer → Deployment Orchestrator
 * 
 * This template demonstrates a complete CI/CD pipeline with automated code review,
 * testing, and deployment orchestration.
 */

import { AgentManifest, AgentManifestFactory } from '../schemas/AgentManifest';

export interface DeveloperToolsConfig {
  github: {
    repository: string;
    webhook_secret: string;
    access_token: string;
  };
  static_analysis: {
    tools: string[];
    severity_threshold: 'low' | 'medium' | 'high' | 'critical';
    custom_rules: string[];
  };
  testing: {
    test_frameworks: string[];
    coverage_threshold: number;
    timeout_minutes: number;
  };
  deployment: {
    environments: string[];
    canary_percent: number;
    rollback_criteria: {
      error_rate_threshold: number;
      response_time_threshold: number;
    };
  };
}

export interface DeveloperToolsResult {
  pr_analysis: {
    pr_id: number;
    status: 'passed' | 'failed' | 'needs_review';
    checks: Array<{
      name: string;
      status: 'passed' | 'failed' | 'skipped';
      details: any;
    }>;
  };
  review_summary: {
    summary: string;
    action_items: Array<{
      type: 'bug' | 'improvement' | 'security' | 'style';
      description: string;
      file: string;
      line?: number;
      severity: 'low' | 'medium' | 'high';
    }>;
    approval_recommendation: 'approve' | 'request_changes' | 'comment';
  };
  deployment_status: {
    environment: string;
    status: 'success' | 'failed' | 'in_progress';
    deployment_url?: string;
    metrics: {
      error_rate: number;
      response_time: number;
      throughput: number;
    };
  };
}

/**
 * GitHub Connector Agent
 * Handles GitHub webhooks and API interactions
 */
export const GitHubConnectorManifest: AgentManifest = {
  id: 'github_connector_v1',
  name: 'GitHub Connector',
  version: '1.0.0',
  description: 'Handles GitHub webhooks and API interactions for PR management',
  runtime: 'nodejs',
  inputs: {
    webhook_payload: {
      type: 'object',
      description: 'GitHub webhook payload',
      required: true,
      properties: {
        action: { type: 'string' },
        pull_request: { type: 'object' },
        repository: { type: 'object' }
      }
    },
    github_config: {
      type: 'object',
      description: 'GitHub configuration',
      properties: {
        repository: { type: 'string' },
        access_token: { type: 'string' },
        webhook_secret: { type: 'string' }
      }
    }
  },
  outputs: {
    pr_data: {
      type: 'object',
      description: 'Extracted PR data',
      properties: {
        pr_id: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'text' },
        author: { type: 'string' },
        files_changed: { type: 'array', items: { type: 'string' } },
        diff_url: { type: 'string' }
      }
    },
    repository_info: {
      type: 'object',
      description: 'Repository information',
      properties: {
        name: { type: 'string' },
        owner: { type: 'string' },
        default_branch: { type: 'string' },
        language: { type: 'string' }
      }
    }
  },
  config: {
    webhook_secret: {
      type: 'string',
      description: 'GitHub webhook secret',
      required: true
    },
    access_token: {
      type: 'string',
      description: 'GitHub access token',
      required: true
    }
  },
  security: {
    networkAccess: {
      allowedHosts: ['api.github.com', 'github.com']
    },
    limits: {
      maxMemory: 256,
      maxExecutionTime: 60
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['github', 'webhooks', 'pr', 'git'],
    category: 'development',
    keywords: ['github', 'webhooks', 'pull-request', 'git', 'api']
  }
};

/**
 * Static Analyzer Agent
 * Performs static code analysis using various tools
 */
export const StaticAnalyzerManifest: AgentManifest = {
  id: 'static_analyzer_v1',
  name: 'Static Analyzer',
  version: '1.0.0',
  description: 'Performs static code analysis using multiple tools',
  runtime: 'nodejs',
  inputs: {
    pr_data: {
      type: 'object',
      description: 'PR data from GitHub connector',
      required: true,
      properties: {
        pr_id: { type: 'number' },
        files_changed: { type: 'array', items: { type: 'string' } },
        diff_url: { type: 'string' }
      }
    },
    analysis_config: {
      type: 'object',
      description: 'Analysis configuration',
      properties: {
        tools: { type: 'array', items: { type: 'string' }, default: ['eslint', 'sonarqube', 'semgrep'] },
        severity_threshold: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
        custom_rules: { type: 'array', items: { type: 'string' } }
      }
    }
  },
  outputs: {
    analysis_results: {
      type: 'array',
      description: 'Static analysis results',
      items: {
        type: 'object',
        properties: {
          tool: { type: 'string' },
          file: { type: 'string' },
          line: { type: 'number' },
          severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          message: { type: 'string' },
          rule_id: { type: 'string' },
          category: { type: 'string' }
        }
      }
    },
    summary: {
      type: 'object',
      description: 'Analysis summary',
      properties: {
        total_issues: { type: 'number' },
        issues_by_severity: { type: 'object' },
        issues_by_tool: { type: 'object' },
        pass_rate: { type: 'number' }
      }
    }
  },
  config: {
    tools: {
      type: 'array',
      description: 'Analysis tools to use',
      default: ['eslint', 'sonarqube', 'semgrep']
    },
    severity_threshold: {
      type: 'string',
      description: 'Minimum severity to report',
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  },
  security: {
    networkAccess: {
      allowedHosts: ['api.sonarqube.org', 'api.semgrep.dev']
    },
    limits: {
      maxMemory: 1024,
      maxExecutionTime: 300
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['static-analysis', 'code-quality', 'security', 'linting'],
    category: 'development',
    keywords: ['static-analysis', 'eslint', 'sonarqube', 'semgrep', 'security']
  }
};

/**
 * Test Runner Agent
 * Executes tests and collects results
 */
export const TestRunnerManifest: AgentManifest = {
  id: 'test_runner_v1',
  name: 'Test Runner',
  version: '1.0.0',
  description: 'Executes tests and collects results',
  runtime: 'nodejs',
  inputs: {
    pr_data: {
      type: 'object',
      description: 'PR data from GitHub connector',
      required: true,
      properties: {
        pr_id: { type: 'number' },
        files_changed: { type: 'array', items: { type: 'string' } },
        repository_info: { type: 'object' }
      }
    },
    test_config: {
      type: 'object',
      description: 'Test configuration',
      properties: {
        test_frameworks: { type: 'array', items: { type: 'string' }, default: ['jest', 'mocha', 'pytest'] },
        coverage_threshold: { type: 'number', default: 80 },
        timeout_minutes: { type: 'number', default: 30 }
      }
    }
  },
  outputs: {
    test_results: {
      type: 'object',
      description: 'Test execution results',
      properties: {
        total_tests: { type: 'number' },
        passed: { type: 'number' },
        failed: { type: 'number' },
        skipped: { type: 'number' },
        coverage: { type: 'number' },
        execution_time: { type: 'number' },
        failures: { type: 'array', items: { type: 'object' } }
      }
    },
    ci_status: {
      type: 'string',
      description: 'CI status',
      enum: ['passed', 'failed', 'pending']
    }
  },
  config: {
    test_frameworks: {
      type: 'array',
      description: 'Test frameworks to use',
      default: ['jest', 'mocha', 'pytest']
    },
    coverage_threshold: {
      type: 'number',
      description: 'Minimum coverage percentage',
      default: 80
    },
    timeout_minutes: {
      type: 'number',
      description: 'Test timeout in minutes',
      default: 30
    }
  },
  security: {
    limits: {
      maxMemory: 2048,
      maxExecutionTime: 1800
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['testing', 'ci', 'coverage', 'automation'],
    category: 'development',
    keywords: ['testing', 'jest', 'mocha', 'pytest', 'coverage', 'ci']
  }
};

/**
 * Review Synthesizer Agent
 * Creates AI-powered code review summaries
 */
export const ReviewSynthesizerManifest: AgentManifest = {
  id: 'review_synthesizer_v1',
  name: 'Review Synthesizer',
  version: '1.0.0',
  description: 'Creates AI-powered code review summaries and recommendations',
  runtime: 'nodejs',
  inputs: {
    pr_data: {
      type: 'object',
      description: 'PR data from GitHub connector',
      required: true,
      properties: {
        pr_id: { type: 'number' },
        title: { type: 'string' },
        description: { type: 'text' },
        files_changed: { type: 'array', items: { type: 'string' } }
      }
    },
    analysis_results: {
      type: 'array',
      description: 'Static analysis results',
      items: { type: 'object' }
    },
    test_results: {
      type: 'object',
      description: 'Test execution results',
      properties: {
        total_tests: { type: 'number' },
        passed: { type: 'number' },
        failed: { type: 'number' },
        coverage: { type: 'number' }
      }
    }
  },
  outputs: {
    review_summary: {
      type: 'text',
      description: 'AI-generated review summary'
    },
    action_items: {
      type: 'array',
      description: 'Action items for the developer',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['bug', 'improvement', 'security', 'style'] },
          description: { type: 'string' },
          file: { type: 'string' },
          line: { type: 'number' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'] }
        }
      }
    },
    approval_recommendation: {
      type: 'string',
      description: 'Approval recommendation',
      enum: ['approve', 'request_changes', 'comment']
    }
  },
  config: {
    llm_provider: {
      type: 'string',
      description: 'LLM provider to use',
      enum: ['mistral', 'openai', 'anthropic'],
      default: 'mistral'
    },
    max_tokens: {
      type: 'number',
      description: 'Maximum tokens for review generation',
      default: 1000
    },
    temperature: {
      type: 'number',
      description: 'Sampling temperature',
      default: 0.3
    }
  },
  security: {
    networkAccess: {
      allowedHosts: ['api.mistral.ai', 'api.openai.com', 'api.anthropic.com']
    },
    limits: {
      maxMemory: 512,
      maxExecutionTime: 120
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['review', 'ai', 'synthesis', 'code-review'],
    category: 'development',
    keywords: ['review', 'ai', 'synthesis', 'code-review', 'llm']
  }
};

/**
 * Deployment Orchestrator Agent
 * Manages deployment pipeline and monitoring
 */
export const DeploymentOrchestratorManifest: AgentManifest = {
  id: 'deployment_orchestrator_v1',
  name: 'Deployment Orchestrator',
  version: '1.0.0',
  description: 'Manages deployment pipeline and post-deployment monitoring',
  runtime: 'nodejs',
  inputs: {
    pr_data: {
      type: 'object',
      description: 'PR data from GitHub connector',
      required: true,
      properties: {
        pr_id: { type: 'number' },
        title: { type: 'string' },
        author: { type: 'string' }
      }
    },
    review_results: {
      type: 'object',
      description: 'Review results from synthesizer',
      properties: {
        approval_recommendation: { type: 'string' },
        action_items: { type: 'array' }
      }
    },
    deployment_config: {
      type: 'object',
      description: 'Deployment configuration',
      properties: {
        environments: { type: 'array', items: { type: 'string' }, default: ['staging', 'production'] },
        canary_percent: { type: 'number', default: 10 },
        rollback_criteria: { type: 'object' }
      }
    }
  },
  outputs: {
    deployment_status: {
      type: 'object',
      description: 'Deployment status information',
      properties: {
        environment: { type: 'string' },
        status: { type: 'string', enum: ['success', 'failed', 'in_progress', 'cancelled'] },
        deployment_url: { type: 'string' },
        deployment_id: { type: 'string' }
      }
    },
    monitoring_metrics: {
      type: 'object',
      description: 'Post-deployment monitoring metrics',
      properties: {
        error_rate: { type: 'number' },
        response_time: { type: 'number' },
        throughput: { type: 'number' },
        health_score: { type: 'number' }
      }
    },
    rollback_decision: {
      type: 'object',
      description: 'Rollback decision information',
      properties: {
        should_rollback: { type: 'boolean' },
        reason: { type: 'string' },
        metrics_threshold_exceeded: { type: 'array', items: { type: 'string' } }
      }
    }
  },
  config: {
    environments: {
      type: 'array',
      description: 'Deployment environments',
      default: ['staging', 'production']
    },
    canary_percent: {
      type: 'number',
      description: 'Percentage of traffic for canary deployment',
      default: 10
    },
    rollback_criteria: {
      type: 'object',
      description: 'Criteria for automatic rollback',
      default: {
        error_rate_threshold: 0.05,
        response_time_threshold: 2000
      }
    }
  },
  security: {
    networkAccess: {
      allowedHosts: ['api.github.com', 'api.heroku.com', 'api.aws.amazon.com']
    },
    limits: {
      maxMemory: 512,
      maxExecutionTime: 600
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['deployment', 'orchestration', 'monitoring', 'rollback'],
    category: 'development',
    keywords: ['deployment', 'orchestration', 'monitoring', 'rollback', 'ci-cd']
  }
};

/**
 * Developer Tools Pipeline Workflow Definition
 */
export const DeveloperToolsWorkflow = {
  id: 'developer_tools_pipeline_v1',
  name: 'Developer Tools Pipeline',
  description: 'Complete CI/CD pipeline with automated review and deployment',
  version: '1.0.0',
  nodes: [
    {
      id: 'github_connector',
      type: 'agent',
      name: 'GitHub Connector',
      agentId: 'github_connector_v1',
      position: { x: 100, y: 100 },
      config: {
        webhook_secret: '${GITHUB_WEBHOOK_SECRET}',
        access_token: '${GITHUB_ACCESS_TOKEN}'
      }
    },
    {
      id: 'static_analyzer',
      type: 'agent',
      name: 'Static Analyzer',
      agentId: 'static_analyzer_v1',
      position: { x: 400, y: 100 },
      config: {
        tools: ['eslint', 'sonarqube', 'semgrep'],
        severity_threshold: 'medium'
      }
    },
    {
      id: 'test_runner',
      type: 'agent',
      name: 'Test Runner',
      agentId: 'test_runner_v1',
      position: { x: 400, y: 300 },
      config: {
        test_frameworks: ['jest', 'mocha', 'pytest'],
        coverage_threshold: 80,
        timeout_minutes: 30
      }
    },
    {
      id: 'review_synthesizer',
      type: 'agent',
      name: 'Review Synthesizer',
      agentId: 'review_synthesizer_v1',
      position: { x: 700, y: 200 },
      config: {
        llm_provider: 'mistral',
        max_tokens: 1000,
        temperature: 0.3
      }
    },
    {
      id: 'deployment_orchestrator',
      type: 'agent',
      name: 'Deployment Orchestrator',
      agentId: 'deployment_orchestrator_v1',
      position: { x: 1000, y: 200 },
      config: {
        environments: ['staging', 'production'],
        canary_percent: 10,
        rollback_criteria: {
          error_rate_threshold: 0.05,
          response_time_threshold: 2000
        }
      }
    }
  ],
  edges: [
    {
      id: 'github_to_analyzer',
      source: 'github_connector',
      target: 'static_analyzer',
      dataMapping: {
        'pr_data': 'pr_data'
      }
    },
    {
      id: 'github_to_tests',
      source: 'github_connector',
      target: 'test_runner',
      dataMapping: {
        'pr_data': 'pr_data'
      }
    },
    {
      id: 'analyzer_to_review',
      source: 'static_analyzer',
      target: 'review_synthesizer',
      dataMapping: {
        'analysis_results': 'analysis_results'
      }
    },
    {
      id: 'tests_to_review',
      source: 'test_runner',
      target: 'review_synthesizer',
      dataMapping: {
        'test_results': 'test_results'
      }
    },
    {
      id: 'review_to_deploy',
      source: 'review_synthesizer',
      target: 'deployment_orchestrator',
      dataMapping: {
        'review_results': 'review_results'
      }
    },
    {
      id: 'github_to_deploy',
      source: 'github_connector',
      target: 'deployment_orchestrator',
      dataMapping: {
        'pr_data': 'pr_data'
      }
    }
  ],
  variables: [
    {
      name: 'github_config',
      type: 'object',
      description: 'GitHub configuration',
      required: true,
      properties: {
        repository: { type: 'string' },
        webhook_secret: { type: 'string' },
        access_token: { type: 'string' }
      }
    },
    {
      name: 'pipeline_config',
      type: 'object',
      description: 'Pipeline configuration',
      default: {
        static_analysis: {
          tools: ['eslint', 'sonarqube', 'semgrep'],
          severity_threshold: 'medium'
        },
        testing: {
          test_frameworks: ['jest', 'mocha', 'pytest'],
          coverage_threshold: 80,
          timeout_minutes: 30
        },
        deployment: {
          environments: ['staging', 'production'],
          canary_percent: 10
        }
      }
    }
  ]
};

/**
 * Example usage and test data
 */
export const DeveloperToolsExamples = {
  feature_pr: {
    name: 'Feature PR Processing',
    description: 'Process a feature pull request through the complete pipeline',
    input: {
      github_config: {
        repository: 'myorg/myapp',
        webhook_secret: 'webhook_secret_123',
        access_token: 'ghp_xxx'
      },
      pipeline_config: {
        static_analysis: {
          tools: ['eslint', 'sonarqube'],
          severity_threshold: 'medium'
        },
        testing: {
          test_frameworks: ['jest'],
          coverage_threshold: 85,
          timeout_minutes: 20
        }
      }
    },
    expected_output: {
      pr_analysis: {
        pr_id: 123,
        status: 'passed',
        checks: [
          {
            name: 'Static Analysis',
            status: 'passed',
            details: { issues_found: 2, severity: 'low' }
          },
          {
            name: 'Tests',
            status: 'passed',
            details: { coverage: 87, tests_passed: 45 }
          }
        ]
      },
      review_summary: {
        summary: 'This PR introduces a new user authentication feature with good test coverage and minimal issues.',
        action_items: [
          {
            type: 'improvement',
            description: 'Consider extracting the auth logic into a separate service',
            file: 'src/auth.js',
            line: 45,
            severity: 'low'
          }
        ],
        approval_recommendation: 'approve'
      },
      deployment_status: {
        environment: 'staging',
        status: 'success',
        deployment_url: 'https://staging.myapp.com',
        metrics: {
          error_rate: 0.01,
          response_time: 150,
          throughput: 1000
        }
      }
    }
  }
};

/**
 * Database schema for Developer Tools Pipeline
 */
export const DeveloperToolsDatabaseSchema = {
  pull_requests: `
    CREATE TABLE pull_requests (
      id BIGINT PRIMARY KEY,
      repo TEXT NOT NULL,
      number INTEGER NOT NULL,
      author TEXT NOT NULL,
      title TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX idx_pull_requests_repo ON pull_requests(repo);
    CREATE INDEX idx_pull_requests_status ON pull_requests(status);
    CREATE INDEX idx_pull_requests_created_at ON pull_requests(created_at);
  `,
  
  pr_checks: `
    CREATE TABLE pr_checks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      pr_id BIGINT REFERENCES pull_requests(id),
      check_name TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      details JSONB,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX idx_pr_checks_pr_id ON pr_checks(pr_id);
    CREATE INDEX idx_pr_checks_status ON pr_checks(status);
  `,
  
  deployments: `
    CREATE TABLE deployments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      pr_id BIGINT REFERENCES pull_requests(id),
      environment VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      deployment_url TEXT,
      metrics JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX idx_deployments_pr_id ON deployments(pr_id);
    CREATE INDEX idx_deployments_environment ON deployments(environment);
    CREATE INDEX idx_deployments_status ON deployments(status);
  `
};

/**
 * Event topics for Developer Tools Pipeline
 */
export const DeveloperToolsEvents = {
  'pr.opened': {
    description: 'Pull request opened',
    schema: {
      pr_id: 'number',
      repo: 'string',
      author: 'string',
      title: 'string'
    }
  },
  
  'check.completed': {
    description: 'PR check completed',
    schema: {
      pr_id: 'number',
      check_name: 'string',
      status: 'string',
      details: 'object'
    }
  },
  
  'review.generated': {
    description: 'AI review generated',
    schema: {
      pr_id: 'number',
      summary: 'string',
      approval_recommendation: 'string',
      action_items: 'array'
    }
  },
  
  'deploy.triggered': {
    description: 'Deployment triggered',
    schema: {
      pr_id: 'number',
      environment: 'string',
      deployment_id: 'string'
    }
  }
};

export default {
  manifests: {
    GitHubConnectorManifest,
    StaticAnalyzerManifest,
    TestRunnerManifest,
    ReviewSynthesizerManifest,
    DeploymentOrchestratorManifest
  },
  workflow: DeveloperToolsWorkflow,
  examples: DeveloperToolsExamples,
  database: DeveloperToolsDatabaseSchema,
  events: DeveloperToolsEvents
};
