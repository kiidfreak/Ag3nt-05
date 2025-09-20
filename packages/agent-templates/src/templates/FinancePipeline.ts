/**
 * Finance Pipeline Template
 * Data Harvester → Risk Synthesizer → Auditor → Decision Orchestrator
 * 
 * This template demonstrates a complete financial decision pipeline
 * for loan/credit applications with fairness auditing.
 */

import { AgentManifest, AgentManifestFactory } from '../schemas/AgentManifest';

export interface FinancePipelineConfig {
  data_sources: {
    bank_connector: {
      provider: 'plaid' | 'open_banking' | 'manual';
      credentials: Record<string, string>;
      lookback_days: number;
    };
    kyc_verifier: {
      provider: 'onfido' | 'civic' | 'manual';
      required_documents: string[];
    };
  };
  risk_scoring: {
    model_version: string;
    explain: boolean;
    threshold_map: {
      low: number;
      medium: number;
      high: number;
    };
  };
  fairness_audit: {
    protected_attributes: string[];
    fairness_metric: 'demographic_parity' | 'equalized_odds' | 'equal_opportunity';
    threshold: number;
  };
  decision_routing: {
    auto_approve_threshold: number;
    manual_review_threshold: number;
    appeal_process: boolean;
  };
}

export interface FinancePipelineResult {
  decision: 'approve' | 'partial' | 'decline' | 'manual_review';
  score: number;
  explanations: {
    feature_importance: Record<string, number>;
    decision_factors: string[];
    risk_level: 'low' | 'medium' | 'high';
  };
  audit_results: {
    fairness_score: number;
    bias_detected: boolean;
    protected_attribute_impact: Record<string, number>;
    recommendations: string[];
  };
  metadata: {
    processing_time: number;
    data_quality_score: number;
    compliance_checks: string[];
  };
}

/**
 * Bank Connector Agent
 * Connects to banking APIs to fetch transaction data
 */
export const BankConnectorManifest: AgentManifest = {
  id: 'bank_connector_v1',
  name: 'Bank Connector',
  version: '1.0.0',
  description: 'Connects to banking APIs to fetch transaction and account data',
  runtime: 'nodejs',
  inputs: {
    connection_config: {
      type: 'object',
      description: 'Banking connection configuration',
      required: true,
      properties: {
        provider: { type: 'string', enum: ['plaid', 'open_banking', 'manual'] },
        credentials: { type: 'object', description: 'API credentials' },
        lookback_days: { type: 'number', description: 'Days to look back', default: 90 }
      }
    },
    applicant_id: {
      type: 'string',
      description: 'Applicant identifier',
      required: true
    }
  },
  outputs: {
    transaction_data: {
      type: 'array',
      description: 'Transaction history',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          amount: { type: 'number' },
          description: { type: 'string' },
          category: { type: 'string' },
          account_type: { type: 'string' }
        }
      }
    },
    account_summary: {
      type: 'object',
      description: 'Account summary information',
      properties: {
        total_balance: { type: 'number' },
        monthly_income: { type: 'number' },
        monthly_expenses: { type: 'number' },
        account_count: { type: 'number' }
      }
    }
  },
  config: {
    timeout: {
      type: 'number',
      description: 'Request timeout in seconds',
      default: 30
    },
    retry_attempts: {
      type: 'number',
      description: 'Number of retry attempts',
      default: 3
    }
  },
  security: {
    networkAccess: {
      allowedHosts: ['api.plaid.com', 'api.openbanking.org.uk']
    },
    limits: {
      maxMemory: 256,
      maxExecutionTime: 120
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['finance', 'banking', 'data-collection'],
    category: 'finance',
    keywords: ['banking', 'transactions', 'plaid', 'open-banking']
  }
};

/**
 * KYC Verifier Agent
 * Verifies identity and KYC documents
 */
export const KYCVerifierManifest: AgentManifest = {
  id: 'kyc_verifier_v1',
  name: 'KYC Verifier',
  version: '1.0.0',
  description: 'Verifies identity and KYC documents for compliance',
  runtime: 'nodejs',
  inputs: {
    documents: {
      type: 'array',
      description: 'KYC documents to verify',
      required: true,
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['passport', 'drivers_license', 'utility_bill', 'bank_statement'] },
          content: { type: 'string', description: 'Document content or URL' },
          metadata: { type: 'object' }
        }
      }
    },
    applicant_info: {
      type: 'object',
      description: 'Applicant information for verification',
      properties: {
        name: { type: 'string' },
        dob: { type: 'string' },
        address: { type: 'object' }
      }
    }
  },
  outputs: {
    verification_status: {
      type: 'string',
      description: 'Overall verification status',
      enum: ['verified', 'pending', 'failed', 'requires_manual_review']
    },
    document_results: {
      type: 'array',
      description: 'Individual document verification results',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          status: { type: 'string' },
          confidence: { type: 'number' },
          issues: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    extracted_data: {
      type: 'object',
      description: 'Extracted data from documents',
      properties: {
        name: { type: 'string' },
        dob: { type: 'string' },
        address: { type: 'object' },
        document_numbers: { type: 'object' }
      }
    }
  },
  config: {
    provider: {
      type: 'string',
      description: 'KYC provider to use',
      enum: ['onfido', 'civic', 'manual'],
      default: 'onfido'
    },
    confidence_threshold: {
      type: 'number',
      description: 'Minimum confidence for verification',
      default: 0.8
    }
  },
  security: {
    networkAccess: {
      allowedHosts: ['api.onfido.com', 'api.civic.com']
    },
    limits: {
      maxMemory: 512,
      maxExecutionTime: 180
    }
  },
  metadata: {
    author: {
      name: 'Agent Labs',
      email: 'team@agentlabs.ai',
      organization: 'Agent Labs'
    },
    tags: ['kyc', 'verification', 'compliance', 'identity'],
    category: 'finance',
    keywords: ['kyc', 'verification', 'identity', 'compliance', 'onfido']
  }
};

/**
 * Feature Synthesizer Agent
 * Extracts financial features from raw data
 */
export const FeatureSynthesizerManifest: AgentManifest = {
  id: 'feature_synthesizer_v1',
  name: 'Feature Synthesizer',
  version: '1.0.0',
  description: 'Extracts and synthesizes financial features from raw data',
  runtime: 'python',
  inputs: {
    transaction_data: {
      type: 'array',
      description: 'Raw transaction data',
      required: true,
      items: { type: 'object' }
    },
    account_summary: {
      type: 'object',
      description: 'Account summary data',
      required: true
    },
    applicant_info: {
      type: 'object',
      description: 'Applicant demographic information',
      properties: {
        age: { type: 'number' },
        employment_status: { type: 'string' },
        income_source: { type: 'string' }
      }
    }
  },
  outputs: {
    features: {
      type: 'object',
      description: 'Synthesized financial features',
      properties: {
        monthly_income: { type: 'number' },
        avg_balance: { type: 'number' },
        debt_ratio: { type: 'number' },
        income_stability: { type: 'number' },
        expense_volatility: { type: 'number' },
        savings_rate: { type: 'number' },
        credit_utilization: { type: 'number' }
      }
    },
    feature_metadata: {
      type: 'object',
      description: 'Metadata about feature calculation',
      properties: {
        calculation_method: { type: 'string' },
        data_quality_score: { type: 'number' },
        missing_data_flags: { type: 'array', items: { type: 'string' } }
      }
    }
  },
  config: {
    calculation_period: {
      type: 'number',
      description: 'Period for calculations in days',
      default: 90
    },
    outlier_threshold: {
      type: 'number',
      description: 'Threshold for outlier detection',
      default: 3.0
    }
  },
  security: {
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
    tags: ['finance', 'features', 'analytics', 'ml'],
    category: 'finance',
    keywords: ['features', 'analytics', 'financial', 'ml', 'synthesis']
  }
};

/**
 * Risk Scorer Agent
 * Uses the manifest from AgentManifestFactory
 */
export const RiskScorerManifest: AgentManifest = AgentManifestFactory.createRiskScorer();

/**
 * Fairness Auditor Agent
 * Audits decisions for bias and fairness
 */
export const FairnessAuditorManifest: AgentManifest = {
  id: 'fairness_auditor_v1',
  name: 'Fairness Auditor',
  version: '1.0.0',
  description: 'Audits financial decisions for bias and fairness compliance',
  runtime: 'python',
  inputs: {
    decision_data: {
      type: 'object',
      description: 'Decision data to audit',
      required: true,
      properties: {
        score: { type: 'number' },
        decision: { type: 'string' },
        features: { type: 'object' },
        explanations: { type: 'object' }
      }
    },
    applicant_demographics: {
      type: 'object',
      description: 'Applicant demographic information',
      properties: {
        age: { type: 'number' },
        gender: { type: 'string' },
        ethnicity: { type: 'string' },
        location: { type: 'string' }
      }
    },
    audit_config: {
      type: 'object',
      description: 'Audit configuration',
      properties: {
        protected_attributes: { type: 'array', items: { type: 'string' } },
        fairness_metric: { type: 'string', enum: ['demographic_parity', 'equalized_odds', 'equal_opportunity'] },
        threshold: { type: 'number', default: 0.8 }
      }
    }
  },
  outputs: {
    audit_results: {
      type: 'object',
      description: 'Fairness audit results',
      properties: {
        fairness_score: { type: 'number', description: 'Overall fairness score' },
        bias_detected: { type: 'boolean', description: 'Whether bias was detected' },
        protected_attribute_impact: { type: 'object', description: 'Impact of protected attributes' },
        recommendations: { type: 'array', description: 'Recommendations for improvement', items: { type: 'string' } },
        compliance_status: { type: 'string', description: 'Compliance status' }
      }
    }
  },
  config: {
    bias_threshold: {
      type: 'number',
      description: 'Threshold for bias detection',
      default: 0.1
    },
    statistical_significance: {
      type: 'number',
      description: 'Statistical significance level',
      default: 0.05
    }
  },
  security: {
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
    tags: ['fairness', 'bias', 'audit', 'compliance'],
    category: 'finance',
    keywords: ['fairness', 'bias', 'audit', 'compliance', 'equity']
  }
};

/**
 * Decision Orchestrator Agent
 * Makes final decisions and routes applications
 */
export const DecisionOrchestratorManifest: AgentManifest = {
  id: 'decision_orchestrator_v1',
  name: 'Decision Orchestrator',
  version: '1.0.0',
  description: 'Makes final decisions and routes applications based on scores and audits',
  runtime: 'nodejs',
  inputs: {
    risk_score: {
      type: 'number',
      description: 'Risk score from risk scorer',
      required: true
    },
    audit_results: {
      type: 'object',
      description: 'Fairness audit results',
      required: true
    },
    application_data: {
      type: 'object',
      description: 'Original application data',
      required: true
    },
    routing_config: {
      type: 'object',
      description: 'Decision routing configuration',
      properties: {
        auto_approve_threshold: { type: 'number', default: 0.8 },
        manual_review_threshold: { type: 'number', default: 0.3 },
        appeal_process: { type: 'boolean', default: true }
      }
    }
  },
  outputs: {
    decision: {
      type: 'string',
      description: 'Final decision',
      enum: ['approve', 'partial', 'decline', 'manual_review']
    },
    decision_details: {
      type: 'object',
      description: 'Detailed decision information',
      properties: {
        reasoning: { type: 'string' },
        conditions: { type: 'array', items: { type: 'string' } },
        next_steps: { type: 'array', items: { type: 'string' } }
      }
    },
    routing_info: {
      type: 'object',
      description: 'Routing information',
      properties: {
        requires_manual_review: { type: 'boolean' },
        appeal_available: { type: 'boolean' },
        estimated_processing_time: { type: 'string' }
      }
    }
  },
  config: {
    default_loan_amount: {
      type: 'number',
      description: 'Default loan amount for approvals',
      default: 10000
    },
    max_loan_amount: {
      type: 'number',
      description: 'Maximum loan amount',
      default: 50000
    }
  },
  security: {
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
    tags: ['decision', 'routing', 'orchestration'],
    category: 'finance',
    keywords: ['decision', 'routing', 'orchestration', 'approval']
  }
};

/**
 * Finance Pipeline Workflow Definition
 */
export const FinancePipelineWorkflow = {
  id: 'finance_pipeline_v1',
  name: 'Finance Pipeline',
  description: 'Complete financial decision pipeline with fairness auditing',
  version: '1.0.0',
  nodes: [
    {
      id: 'bank_connector',
      type: 'agent',
      name: 'Bank Connector',
      agentId: 'bank_connector_v1',
      position: { x: 100, y: 100 },
      config: {
        timeout: 30,
        retry_attempts: 3
      }
    },
    {
      id: 'kyc_verifier',
      type: 'agent',
      name: 'KYC Verifier',
      agentId: 'kyc_verifier_v1',
      position: { x: 100, y: 300 },
      config: {
        provider: 'onfido',
        confidence_threshold: 0.8
      }
    },
    {
      id: 'feature_synthesizer',
      type: 'agent',
      name: 'Feature Synthesizer',
      agentId: 'feature_synthesizer_v1',
      position: { x: 400, y: 200 },
      config: {
        calculation_period: 90,
        outlier_threshold: 3.0
      }
    },
    {
      id: 'risk_scorer',
      type: 'agent',
      name: 'Risk Scorer',
      agentId: 'risk_scorer_xgb_v1',
      position: { x: 700, y: 200 },
      config: {
        model_version: 'v2.1',
        explain: true
      }
    },
    {
      id: 'fairness_auditor',
      type: 'agent',
      name: 'Fairness Auditor',
      agentId: 'fairness_auditor_v1',
      position: { x: 1000, y: 200 },
      config: {
        bias_threshold: 0.1,
        statistical_significance: 0.05
      }
    },
    {
      id: 'decision_orchestrator',
      type: 'agent',
      name: 'Decision Orchestrator',
      agentId: 'decision_orchestrator_v1',
      position: { x: 1300, y: 200 },
      config: {
        auto_approve_threshold: 0.8,
        manual_review_threshold: 0.3,
        appeal_process: true
      }
    }
  ],
  edges: [
    {
      id: 'bank_to_features',
      source: 'bank_connector',
      target: 'feature_synthesizer',
      dataMapping: {
        'transaction_data': 'transaction_data',
        'account_summary': 'account_summary'
      }
    },
    {
      id: 'kyc_to_features',
      source: 'kyc_verifier',
      target: 'feature_synthesizer',
      dataMapping: {
        'extracted_data': 'applicant_info'
      }
    },
    {
      id: 'features_to_risk',
      source: 'feature_synthesizer',
      target: 'risk_scorer',
      dataMapping: {
        'features': 'features'
      }
    },
    {
      id: 'risk_to_auditor',
      source: 'risk_scorer',
      target: 'fairness_auditor',
      dataMapping: {
        'score': 'decision_data.score',
        'explanations': 'decision_data.explanations'
      }
    },
    {
      id: 'auditor_to_decision',
      source: 'fairness_auditor',
      target: 'decision_orchestrator',
      dataMapping: {
        'audit_results': 'audit_results'
      }
    },
    {
      id: 'risk_to_decision',
      source: 'risk_scorer',
      target: 'decision_orchestrator',
      dataMapping: {
        'score': 'risk_score'
      }
    }
  ],
  variables: [
    {
      name: 'application_data',
      type: 'object',
      description: 'Original application data',
      required: true
    },
    {
      name: 'pipeline_config',
      type: 'object',
      description: 'Pipeline configuration',
      default: {
        data_sources: {
          bank_connector: { provider: 'plaid', lookback_days: 90 },
          kyc_verifier: { provider: 'onfido', required_documents: ['passport', 'utility_bill'] }
        },
        risk_scoring: {
          model_version: 'v2.1',
          explain: true,
          threshold_map: { low: 0.3, medium: 0.6, high: 0.8 }
        },
        fairness_audit: {
          protected_attributes: ['age', 'gender', 'ethnicity'],
          fairness_metric: 'demographic_parity',
          threshold: 0.8
        }
      }
    }
  ]
};

/**
 * Example usage and test data
 */
export const FinancePipelineExamples = {
  loan_application: {
    name: 'Personal Loan Application',
    description: 'Process a personal loan application with full pipeline',
    input: {
      application_data: {
        applicant_id: 'app_12345',
        loan_amount: 15000,
        purpose: 'debt_consolidation',
        term_months: 36
      },
      pipeline_config: {
        data_sources: {
          bank_connector: {
            provider: 'plaid',
            credentials: { client_id: 'xxx', secret: 'xxx' },
            lookback_days: 90
          },
          kyc_verifier: {
            provider: 'onfido',
            required_documents: ['passport', 'utility_bill']
          }
        },
        risk_scoring: {
          model_version: 'v2.1',
          explain: true,
          threshold_map: { low: 0.3, medium: 0.6, high: 0.8 }
        }
      }
    },
    expected_output: {
      decision: 'approve',
      score: 0.75,
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
      },
      audit_results: {
        fairness_score: 0.92,
        bias_detected: false,
        protected_attribute_impact: {
          age: 0.05,
          gender: 0.02,
          ethnicity: 0.01
        },
        recommendations: []
      }
    }
  }
};

/**
 * Database schema for Finance Pipeline
 */
export const FinancePipelineDatabaseSchema = {
  applicants: `
    CREATE TABLE applicants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      dob DATE,
      kyc_status VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX idx_applicants_kyc_status ON applicants(kyc_status);
    CREATE INDEX idx_applicants_created_at ON applicants(created_at);
  `,
  
  credit_features: `
    CREATE TABLE credit_features (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      applicant_id UUID REFERENCES applicants(id),
      period_start DATE,
      period_end DATE,
      monthly_income NUMERIC,
      avg_balance NUMERIC,
      debt_ratio NUMERIC,
      computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX idx_credit_features_applicant_id ON credit_features(applicant_id);
    CREATE INDEX idx_credit_features_period ON credit_features(period_start, period_end);
  `,
  
  decisions: `
    CREATE TABLE decisions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      applicant_id UUID REFERENCES applicants(id),
      score FLOAT NOT NULL,
      decision VARCHAR(50) NOT NULL,
      explanation JSONB,
      audited BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX idx_decisions_applicant_id ON decisions(applicant_id);
    CREATE INDEX idx_decisions_decision ON decisions(decision);
    CREATE INDEX idx_decisions_score ON decisions(score);
  `,
  
  audit_results: `
    CREATE TABLE audit_results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      decision_id UUID REFERENCES decisions(id),
      fairness_score FLOAT NOT NULL,
      bias_detected BOOLEAN NOT NULL,
      protected_attribute_impact JSONB,
      recommendations TEXT[],
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX idx_audit_results_decision_id ON audit_results(decision_id);
    CREATE INDEX idx_audit_results_fairness_score ON audit_results(fairness_score);
  `
};

/**
 * Event topics for Finance Pipeline
 */
export const FinancePipelineEvents = {
  'applicant.submitted': {
    description: 'New application submitted',
    schema: {
      applicant_id: 'string',
      application_data: 'object'
    }
  },
  
  'features.computed': {
    description: 'Financial features computed',
    schema: {
      applicant_id: 'string',
      features: 'object',
      data_quality_score: 'number'
    }
  },
  
  'score.generated': {
    description: 'Risk score generated',
    schema: {
      applicant_id: 'string',
      score: 'number',
      explanations: 'object'
    }
  },
  
  'decision.finalized': {
    description: 'Final decision made',
    schema: {
      applicant_id: 'string',
      decision: 'string',
      score: 'number',
      audit_results: 'object'
    }
  }
};

export default {
  manifests: {
    BankConnectorManifest,
    KYCVerifierManifest,
    FeatureSynthesizerManifest,
    RiskScorerManifest,
    FairnessAuditorManifest,
    DecisionOrchestratorManifest
  },
  workflow: FinancePipelineWorkflow,
  examples: FinancePipelineExamples,
  database: FinancePipelineDatabaseSchema,
  events: FinancePipelineEvents
};
