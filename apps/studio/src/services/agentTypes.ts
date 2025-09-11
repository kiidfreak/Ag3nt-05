// Enhanced Agent Types for 3-Layer Architecture

export interface AgentPort {
  id: string;
  type: 'input' | 'output';
  dataType: string;
  label: string;
  required?: boolean;
}

export interface AgentPorts {
  input: AgentPort[];
  output: AgentPort[];
}

export interface EnhancedAgent {
  id: string;
  name: string;
  description: string;
  type: 'basic' | 'coral' | 'solana' | 'custom' | 'collector' | 'synthesizer' | 'scorer' | 'auditor' | 'orchestrator';
  category: 'collector' | 'synthesizer' | 'scorer' | 'auditor' | 'orchestrator' | 'basic';
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  version: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
  _count: {
    sessions: number;
  };
  ports?: AgentPorts;
  industry?: string[];
  capabilities?: string[];
}

// Collector Agents
export const collectorAgents: EnhancedAgent[] = [
  {
    id: 'collector-1',
    name: 'Intake Collector',
    description: 'Structured data collection from forms, APIs, databases',
    type: 'collector',
    category: 'collector',
    config: {
      sources: ['api', 'database', 'form', 'file'],
      validation: true,
      transformation: 'json',
      rateLimit: 1000,
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 8,
    },
    ports: {
      input: [
        { id: 'trigger', type: 'input', dataType: 'trigger', label: 'Trigger', required: true }
      ],
      output: [
        { id: 'data', type: 'output', dataType: 'structured-data', label: 'Data' }
      ]
    },
    industry: ['healthcare', 'finance', 'education'],
    capabilities: ['data-validation', 'format-conversion', 'api-integration']
  },
  {
    id: 'collector-2',
    name: 'Data Harvester',
    description: 'Unstructured data collection from web, documents, sensors',
    type: 'collector',
    category: 'collector',
    config: {
      sources: ['web-scraping', 'document-parsing', 'sensor-data', 'social-media'],
      formats: ['text', 'image', 'audio', 'video'],
      realTime: true,
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 12,
    },
    ports: {
      input: [
        { id: 'trigger', type: 'input', dataType: 'trigger', label: 'Trigger', required: true }
      ],
      output: [
        { id: 'data', type: 'output', dataType: 'unstructured-data', label: 'Data' }
      ]
    },
    industry: ['finance', 'insurance', 'justice'],
    capabilities: ['web-scraping', 'document-parsing', 'real-time-data']
  },
  {
    id: 'collector-3',
    name: 'Evidence Collector',
    description: 'Legal evidence gathering from multiple sources',
    type: 'collector',
    category: 'collector',
    config: {
      sources: ['court-records', 'witness-statements', 'digital-evidence', 'expert-reports'],
      chainOfCustody: true,
      encryption: true,
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 5,
    },
    ports: {
      input: [
        { id: 'case-trigger', type: 'input', dataType: 'case-trigger', label: 'Case', required: true }
      ],
      output: [
        { id: 'evidence', type: 'output', dataType: 'evidence-bundle', label: 'Evidence' }
      ]
    },
    industry: ['justice'],
    capabilities: ['legal-compliance', 'chain-of-custody', 'evidence-verification']
  }
];

// Synthesizer Agents
export const synthesizerAgents: EnhancedAgent[] = [
  {
    id: 'synthesizer-1',
    name: 'Symptom Synthesizer',
    description: 'Medical symptom analysis and correlation',
    type: 'synthesizer',
    category: 'synthesizer',
    config: {
      medicalOntology: 'SNOMED-CT',
      correlationEngine: 'ml-based',
      confidenceThreshold: 0.8,
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 20,
    },
    ports: {
      input: [
        { id: 'symptoms', type: 'input', dataType: 'medical-data', label: 'Symptoms', required: true }
      ],
      output: [
        { id: 'analysis', type: 'output', dataType: 'symptom-analysis', label: 'Analysis' }
      ]
    },
    industry: ['healthcare'],
    capabilities: ['medical-ontology', 'symptom-correlation', 'diagnostic-support']
  },
  {
    id: 'synthesizer-2',
    name: 'Skills Synthesizer',
    description: 'Educational skills assessment and mapping',
    type: 'synthesizer',
    category: 'synthesizer',
    config: {
      frameworks: ['SFIA', 'ESCO', 'O*NET'],
      assessmentMethods: ['portfolio', 'testing', 'peer-review'],
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 15,
    },
    ports: {
      input: [
        { id: 'credentials', type: 'input', dataType: 'credential-data', label: 'Credentials', required: true }
      ],
      output: [
        { id: 'skills', type: 'output', dataType: 'skills-profile', label: 'Skills' }
      ]
    },
    industry: ['education'],
    capabilities: ['skills-mapping', 'credential-verification', 'competency-assessment']
  },
  {
    id: 'synthesizer-3',
    name: 'Memory Synthesizer',
    description: 'Historical data correlation and pattern recognition',
    type: 'synthesizer',
    category: 'synthesizer',
    config: {
      timeWindows: ['short-term', 'medium-term', 'long-term'],
      patternTypes: ['trends', 'anomalies', 'correlations'],
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 18,
    },
    ports: {
      input: [
        { id: 'history', type: 'input', dataType: 'historical-data', label: 'History', required: true }
      ],
      output: [
        { id: 'patterns', type: 'output', dataType: 'memory-patterns', label: 'Patterns' }
      ]
    },
    industry: ['finance', 'insurance', 'justice'],
    capabilities: ['pattern-recognition', 'trend-analysis', 'anomaly-detection']
  }
];

// Scorer Agents
export const scorerAgents: EnhancedAgent[] = [
  {
    id: 'scorer-1',
    name: 'Risk Scorer',
    description: 'Multi-dimensional risk assessment',
    type: 'scorer',
    category: 'scorer',
    config: {
      dimensions: ['financial', 'operational', 'reputational', 'regulatory'],
      scoringMethod: 'weighted-composite',
      scale: '0-100',
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 25,
    },
    ports: {
      input: [
        { id: 'factors', type: 'input', dataType: 'risk-factors', label: 'Factors', required: true }
      ],
      output: [
        { id: 'score', type: 'output', dataType: 'risk-score', label: 'Score' }
      ]
    },
    industry: ['healthcare', 'finance', 'insurance'],
    capabilities: ['risk-assessment', 'multi-dimensional-scoring', 'regulatory-compliance']
  },
  {
    id: 'scorer-2',
    name: 'Peril Scorer',
    description: 'Insurance risk and exposure assessment',
    type: 'scorer',
    category: 'scorer',
    config: {
      perilTypes: ['natural', 'man-made', 'cyber', 'liability'],
      actuarialModels: true,
      realTimeData: true,
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 10,
    },
    ports: {
      input: [
        { id: 'exposure', type: 'input', dataType: 'exposure-data', label: 'Exposure', required: true }
      ],
      output: [
        { id: 'peril-score', type: 'output', dataType: 'peril-score', label: 'Peril Score' }
      ]
    },
    industry: ['insurance'],
    capabilities: ['actuarial-modeling', 'real-time-assessment', 'exposure-analysis']
  }
];

// Auditor Agents
export const auditorAgents: EnhancedAgent[] = [
  {
    id: 'auditor-1',
    name: 'Fairness Auditor',
    description: 'Bias detection and fairness assessment',
    type: 'auditor',
    category: 'auditor',
    config: {
      biasTypes: ['demographic', 'geographic', 'temporal', 'algorithmic'],
      metrics: ['demographic-parity', 'equalized-odds', 'calibration'],
      thresholds: { warning: 0.1, critical: 0.2 },
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 30,
    },
    ports: {
      input: [
        { id: 'decision', type: 'input', dataType: 'decision-data', label: 'Decision', required: true }
      ],
      output: [
        { id: 'report', type: 'output', dataType: 'fairness-report', label: 'Report' }
      ]
    },
    industry: ['healthcare', 'finance', 'insurance', 'education', 'justice'],
    capabilities: ['bias-detection', 'fairness-metrics', 'compliance-checking']
  },
  {
    id: 'auditor-2',
    name: 'Bias Auditor',
    description: 'Systemic bias detection in AI systems',
    type: 'auditor',
    category: 'auditor',
    config: {
      biasCategories: ['gender', 'race', 'age', 'socioeconomic'],
      detectionMethods: ['statistical', 'causal', 'counterfactual'],
      reportingFormat: 'detailed',
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 22,
    },
    ports: {
      input: [
        { id: 'output', type: 'input', dataType: 'model-output', label: 'Output', required: true }
      ],
      output: [
        { id: 'analysis', type: 'output', dataType: 'bias-analysis', label: 'Analysis' }
      ]
    },
    industry: ['healthcare', 'finance', 'insurance', 'education', 'justice'],
    capabilities: ['systemic-bias-detection', 'statistical-analysis', 'causal-inference']
  }
];

// Orchestrator Agents
export const orchestratorAgents: EnhancedAgent[] = [
  {
    id: 'orchestrator-1',
    name: 'Decision Orchestrator',
    description: 'Final decision-making with human oversight',
    type: 'orchestrator',
    category: 'orchestrator',
    config: {
      decisionTypes: ['approval', 'rejection', 'escalation', 'conditional'],
      humanOversight: true,
      confidenceThreshold: 0.85,
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 35,
    },
    ports: {
      input: [
        { id: 'analysis', type: 'input', dataType: 'analysis-data', label: 'Analysis', required: true },
        { id: 'human-review', type: 'input', dataType: 'human-input', label: 'Human Review' }
      ],
      output: [
        { id: 'decision', type: 'output', dataType: 'decision', label: 'Decision' }
      ]
    },
    industry: ['healthcare', 'finance', 'insurance', 'education', 'justice'],
    capabilities: ['decision-making', 'human-oversight', 'escalation-management']
  },
  {
    id: 'orchestrator-2',
    name: 'Treatment Orchestrator',
    description: 'Medical treatment recommendation engine',
    type: 'orchestrator',
    category: 'orchestrator',
    config: {
      guidelines: ['clinical-practice', 'evidence-based', 'personalized'],
      safetyChecks: true,
      drugInteractions: true,
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 28,
    },
    ports: {
      input: [
        { id: 'diagnosis', type: 'input', dataType: 'diagnosis', label: 'Diagnosis', required: true }
      ],
      output: [
        { id: 'treatment', type: 'output', dataType: 'treatment-plan', label: 'Treatment' }
      ]
    },
    industry: ['healthcare'],
    capabilities: ['treatment-planning', 'safety-checking', 'drug-interaction-checking']
  },
  {
    id: 'orchestrator-3',
    name: 'Recommendation Engine',
    description: 'Personalized recommendations with fairness constraints',
    type: 'orchestrator',
    category: 'orchestrator',
    config: {
      algorithms: ['collaborative', 'content-based', 'hybrid'],
      fairnessConstraints: true,
      diversityPromotion: true,
      model: 'mistral-7b',
    },
    status: 'active',
    version: '1.0.0',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@agentlabs.io',
    },
    _count: {
      sessions: 40,
    },
    ports: {
      input: [
        { id: 'profile', type: 'input', dataType: 'user-profile', label: 'Profile', required: true }
      ],
      output: [
        { id: 'recommendations', type: 'output', dataType: 'recommendations', label: 'Recommendations' }
      ]
    },
    industry: ['education', 'finance'],
    capabilities: ['personalization', 'fairness-constraints', 'diversity-promotion']
  }
];

// Combine all agents
export const allEnhancedAgents: EnhancedAgent[] = [
  ...collectorAgents,
  ...synthesizerAgents,
  ...scorerAgents,
  ...auditorAgents,
  ...orchestratorAgents
];

// Agent categories for UI organization
export const agentCategories = {
  collector: {
    name: 'Collector Agents',
    description: 'Data intake and collection agents',
    icon: '📥',
    color: 'bg-green-100 text-green-600'
  },
  synthesizer: {
    name: 'Synthesizer Agents',
    description: 'Data processing and analysis agents',
    icon: '🧠',
    color: 'bg-blue-100 text-blue-600'
  },
  scorer: {
    name: 'Scorer Agents',
    description: 'Risk and performance scoring agents',
    icon: '📊',
    color: 'bg-yellow-100 text-yellow-600'
  },
  auditor: {
    name: 'Auditor Agents',
    description: 'Bias detection and compliance agents',
    icon: '🔍',
    color: 'bg-purple-100 text-purple-600'
  },
  orchestrator: {
    name: 'Orchestrator Agents',
    description: 'Decision-making and coordination agents',
    icon: '🎯',
    color: 'bg-red-100 text-red-600'
  }
};
