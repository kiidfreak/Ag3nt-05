// Pipeline Templates for Industry-Specific Engines

export interface PipelineTemplate {
  templateId: string;
  name: string;
  description: string;
  industry: string;
  category: string;
  nodes: PipelineNode[];
  connections: PipelineConnection[];
  config: {
    version: string;
    estimatedCost: number;
    estimatedTime: number;
    complexity: 'low' | 'medium' | 'high';
    requirements: string[];
  };
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    usage: number;
  };
}

export interface PipelineNode {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  ports?: {
    input: Array<{
      id: string;
      type: 'input';
      dataType: string;
      label: string;
      required?: boolean;
    }>;
    output: Array<{
      id: string;
      type: 'output';
      dataType: string;
      label: string;
    }>;
  };
}

export interface PipelineConnection {
  id: string;
  source: string;
  target: string;
  sourcePort?: string;
  targetPort?: string;
  dataType: string;
}

// Healthcare Engine Template
export const healthcareTemplate: PipelineTemplate = {
  templateId: 'healthcare-engine',
  name: 'Healthcare Decision Engine',
  description: 'Medical diagnosis and treatment pipeline with fairness auditing',
  industry: 'healthcare',
  category: 'medical',
  nodes: [
    {
      id: 'intake',
      type: 'intake-collector',
      name: 'Patient Intake',
      config: {
        sources: ['patient-forms', 'medical-records', 'lab-results'],
        validation: 'medical-standards',
        encryption: true,
        hipaaCompliant: true
      },
      position: { x: 100, y: 100 },
      ports: {
        input: [
          { id: 'trigger', type: 'input', dataType: 'patient-trigger', label: 'Patient Data', required: true }
        ],
        output: [
          { id: 'data', type: 'output', dataType: 'structured-data', label: 'Medical Data' }
        ]
      }
    },
    {
      id: 'symptom-analysis',
      type: 'symptom-synthesizer',
      name: 'Symptom Analysis',
      config: {
        ontology: 'SNOMED-CT',
        correlationEngine: 'ml-based',
        confidenceThreshold: 0.8,
        model: 'mistral-7b'
      },
      position: { x: 300, y: 100 },
      ports: {
        input: [
          { id: 'symptoms', type: 'input', dataType: 'medical-data', label: 'Symptoms', required: true }
        ],
        output: [
          { id: 'analysis', type: 'output', dataType: 'symptom-analysis', label: 'Analysis' }
        ]
      }
    },
    {
      id: 'risk-assessment',
      type: 'risk-scorer',
      name: 'Clinical Risk Assessment',
      config: {
        dimensions: ['clinical', 'safety', 'prognosis'],
        medicalModels: true,
        scoringMethod: 'weighted-composite',
        scale: '0-100'
      },
      position: { x: 500, y: 100 },
      ports: {
        input: [
          { id: 'factors', type: 'input', dataType: 'risk-factors', label: 'Risk Factors', required: true }
        ],
        output: [
          { id: 'score', type: 'output', dataType: 'risk-score', label: 'Risk Score' }
        ]
      }
    },
    {
      id: 'fairness-check',
      type: 'fairness-auditor',
      name: 'Medical Fairness Audit',
      config: {
        biasTypes: ['demographic', 'socioeconomic', 'geographic'],
        medicalBias: true,
        metrics: ['demographic-parity', 'equalized-odds'],
        thresholds: { warning: 0.1, critical: 0.2 }
      },
      position: { x: 700, y: 100 },
      ports: {
        input: [
          { id: 'decision', type: 'input', dataType: 'decision-data', label: 'Decision', required: true }
        ],
        output: [
          { id: 'report', type: 'output', dataType: 'fairness-report', label: 'Fairness Report' }
        ]
      }
    },
    {
      id: 'treatment-plan',
      type: 'treatment-orchestrator',
      name: 'Treatment Planning',
      config: {
        guidelines: 'evidence-based',
        safetyChecks: true,
        drugInteractions: true,
        personalized: true
      },
      position: { x: 900, y: 100 },
      ports: {
        input: [
          { id: 'diagnosis', type: 'input', dataType: 'diagnosis', label: 'Diagnosis', required: true }
        ],
        output: [
          { id: 'treatment', type: 'output', dataType: 'treatment-plan', label: 'Treatment Plan' }
        ]
      }
    }
  ],
  connections: [
    { id: 'conn-1', source: 'intake', target: 'symptom-analysis', dataType: 'medical-data' },
    { id: 'conn-2', source: 'symptom-analysis', target: 'risk-assessment', dataType: 'risk-factors' },
    { id: 'conn-3', source: 'risk-assessment', target: 'fairness-check', dataType: 'decision-data' },
    { id: 'conn-4', source: 'fairness-check', target: 'treatment-plan', dataType: 'diagnosis' }
  ],
  config: {
    version: '1.0.0',
    estimatedCost: 0.05,
    estimatedTime: 30,
    complexity: 'high',
    requirements: ['HIPAA compliance', 'Medical data encryption', 'Clinical validation']
  },
  metadata: {
    author: 'Agent Labs Team',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    tags: ['healthcare', 'medical', 'diagnosis', 'treatment', 'fairness'],
    usage: 0
  }
};

// Finance Engine Template
export const financeTemplate: PipelineTemplate = {
  templateId: 'finance-engine',
  name: 'Financial Risk Assessment Engine',
  description: 'Credit scoring and financial decision pipeline with bias detection',
  industry: 'finance',
  category: 'banking',
  nodes: [
    {
      id: 'data-harvest',
      type: 'data-harvester',
      name: 'Financial Data Collection',
      config: {
        sources: ['banking-apis', 'credit-bureaus', 'transaction-data'],
        realTime: true,
        encryption: true,
        pciCompliant: true
      },
      position: { x: 100, y: 100 },
      ports: {
        input: [
          { id: 'trigger', type: 'input', dataType: 'application-trigger', label: 'Application', required: true }
        ],
        output: [
          { id: 'data', type: 'output', dataType: 'unstructured-data', label: 'Financial Data' }
        ]
      }
    },
    {
      id: 'risk-synthesis',
      type: 'memory-synthesizer',
      name: 'Financial Pattern Analysis',
      config: {
        timeWindows: ['30-day', '90-day', '12-month'],
        patternTypes: ['spending', 'income', 'debt', 'credit-utilization'],
        model: 'mistral-7b'
      },
      position: { x: 300, y: 100 },
      ports: {
        input: [
          { id: 'history', type: 'input', dataType: 'historical-data', label: 'History', required: true }
        ],
        output: [
          { id: 'patterns', type: 'output', dataType: 'memory-patterns', label: 'Patterns' }
        ]
      }
    },
    {
      id: 'credit-score',
      type: 'risk-scorer',
      name: 'Credit Risk Scoring',
      config: {
        dimensions: ['creditworthiness', 'fraud-risk', 'default-risk'],
        regulatoryCompliance: true,
        scoringMethod: 'weighted-composite',
        scale: '300-850'
      },
      position: { x: 500, y: 100 },
      ports: {
        input: [
          { id: 'factors', type: 'input', dataType: 'risk-factors', label: 'Risk Factors', required: true }
        ],
        output: [
          { id: 'score', type: 'output', dataType: 'risk-score', label: 'Credit Score' }
        ]
      }
    },
    {
      id: 'bias-audit',
      type: 'bias-auditor',
      name: 'Fair Lending Audit',
      config: {
        biasCategories: ['demographic', 'geographic', 'socioeconomic'],
        fairLending: true,
        detectionMethods: ['statistical', 'causal'],
        reportingFormat: 'detailed'
      },
      position: { x: 700, y: 100 },
      ports: {
        input: [
          { id: 'output', type: 'input', dataType: 'model-output', label: 'Model Output', required: true }
        ],
        output: [
          { id: 'analysis', type: 'output', dataType: 'bias-analysis', label: 'Bias Analysis' }
        ]
      }
    },
    {
      id: 'decision',
      type: 'decision-orchestrator',
      name: 'Lending Decision',
      config: {
        decisionTypes: ['approve', 'deny', 'conditional'],
        humanOversight: true,
        confidenceThreshold: 0.85,
        regulatoryApproval: true
      },
      position: { x: 900, y: 100 },
      ports: {
        input: [
          { id: 'analysis', type: 'input', dataType: 'analysis-data', label: 'Analysis', required: true },
          { id: 'human-review', type: 'input', dataType: 'human-input', label: 'Human Review' }
        ],
        output: [
          { id: 'decision', type: 'output', dataType: 'decision', label: 'Lending Decision' }
        ]
      }
    }
  ],
  connections: [
    { id: 'conn-1', source: 'data-harvest', target: 'risk-synthesis', dataType: 'historical-data' },
    { id: 'conn-2', source: 'risk-synthesis', target: 'credit-score', dataType: 'risk-factors' },
    { id: 'conn-3', source: 'credit-score', target: 'bias-audit', dataType: 'model-output' },
    { id: 'conn-4', source: 'bias-audit', target: 'decision', dataType: 'analysis-data' }
  ],
  config: {
    version: '1.0.0',
    estimatedCost: 0.03,
    estimatedTime: 15,
    complexity: 'high',
    requirements: ['PCI compliance', 'Fair lending regulations', 'Real-time processing']
  },
  metadata: {
    author: 'Agent Labs Team',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    tags: ['finance', 'banking', 'credit', 'risk', 'fairness'],
    usage: 0
  }
};

// Insurance Engine Template
export const insuranceTemplate: PipelineTemplate = {
  templateId: 'insurance-engine',
  name: 'Insurance Risk Assessment Engine',
  description: 'Policy underwriting and risk evaluation pipeline',
  industry: 'insurance',
  category: 'underwriting',
  nodes: [
    {
      id: 'exposure-data',
      type: 'data-harvester',
      name: 'Exposure Data Collection',
      config: {
        sources: ['satellite-data', 'weather-apis', 'property-records'],
        realTime: true,
        geospatial: true,
        climateData: true
      },
      position: { x: 100, y: 100 },
      ports: {
        input: [
          { id: 'trigger', type: 'input', dataType: 'policy-trigger', label: 'Policy Application', required: true }
        ],
        output: [
          { id: 'data', type: 'output', dataType: 'unstructured-data', label: 'Exposure Data' }
        ]
      }
    },
    {
      id: 'peril-assessment',
      type: 'peril-scorer',
      name: 'Peril Risk Assessment',
      config: {
        perilTypes: ['natural', 'cyber', 'liability'],
        actuarialModels: true,
        realTimeData: true,
        climateModels: true
      },
      position: { x: 300, y: 100 },
      ports: {
        input: [
          { id: 'exposure', type: 'input', dataType: 'exposure-data', label: 'Exposure', required: true }
        ],
        output: [
          { id: 'peril-score', type: 'output', dataType: 'peril-score', label: 'Peril Score' }
        ]
      }
    },
    {
      id: 'memory-analysis',
      type: 'memory-synthesizer',
      name: 'Historical Claims Analysis',
      config: {
        timeWindows: ['historical', 'seasonal', 'trending'],
        patternTypes: ['claims', 'losses', 'exposure', 'weather-patterns'],
        model: 'mistral-7b'
      },
      position: { x: 500, y: 100 },
      ports: {
        input: [
          { id: 'history', type: 'input', dataType: 'historical-data', label: 'History', required: true }
        ],
        output: [
          { id: 'patterns', type: 'output', dataType: 'memory-patterns', label: 'Patterns' }
        ]
      }
    },
    {
      id: 'fairness-check',
      type: 'fairness-auditor',
      name: 'Insurance Fairness Audit',
      config: {
        biasTypes: ['geographic', 'demographic', 'socioeconomic'],
        insuranceBias: true,
        metrics: ['demographic-parity', 'geographic-fairness'],
        thresholds: { warning: 0.1, critical: 0.2 }
      },
      position: { x: 700, y: 100 },
      ports: {
        input: [
          { id: 'decision', type: 'input', dataType: 'decision-data', label: 'Decision', required: true }
        ],
        output: [
          { id: 'report', type: 'output', dataType: 'fairness-report', label: 'Fairness Report' }
        ]
      }
    },
    {
      id: 'underwriting',
      type: 'decision-orchestrator',
      name: 'Underwriting Decision',
      config: {
        decisionTypes: ['accept', 'decline', 'modify'],
        actuarialApproval: true,
        humanOversight: true,
        confidenceThreshold: 0.8
      },
      position: { x: 900, y: 100 },
      ports: {
        input: [
          { id: 'analysis', type: 'input', dataType: 'analysis-data', label: 'Analysis', required: true },
          { id: 'human-review', type: 'input', dataType: 'human-input', label: 'Actuarial Review' }
        ],
        output: [
          { id: 'decision', type: 'output', dataType: 'decision', label: 'Underwriting Decision' }
        ]
      }
    }
  ],
  connections: [
    { id: 'conn-1', source: 'exposure-data', target: 'peril-assessment', dataType: 'exposure-data' },
    { id: 'conn-2', source: 'peril-assessment', target: 'memory-analysis', dataType: 'historical-data' },
    { id: 'conn-3', source: 'memory-analysis', target: 'fairness-check', dataType: 'decision-data' },
    { id: 'conn-4', source: 'fairness-check', target: 'underwriting', dataType: 'analysis-data' }
  ],
  config: {
    version: '1.0.0',
    estimatedCost: 0.04,
    estimatedTime: 20,
    complexity: 'high',
    requirements: ['Actuarial models', 'Real-time data', 'Climate data integration']
  },
  metadata: {
    author: 'Agent Labs Team',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    tags: ['insurance', 'underwriting', 'risk', 'climate', 'fairness'],
    usage: 0
  }
};

// Education Engine Template
export const educationTemplate: PipelineTemplate = {
  templateId: 'education-engine',
  name: 'Educational Assessment Engine',
  description: 'Skills verification and learning path recommendation',
  industry: 'education',
  category: 'assessment',
  nodes: [
    {
      id: 'credential-intake',
      type: 'intake-collector',
      name: 'Credential Collection',
      config: {
        sources: ['linkedin', 'coursera', 'university-dbs'],
        verification: true,
        blockchain: true,
        standards: ['OpenBadges', 'Blockcerts']
      },
      position: { x: 100, y: 100 },
      ports: {
        input: [
          { id: 'trigger', type: 'input', dataType: 'student-trigger', label: 'Student Profile', required: true }
        ],
        output: [
          { id: 'data', type: 'output', dataType: 'structured-data', label: 'Credentials' }
        ]
      }
    },
    {
      id: 'skills-mapping',
      type: 'skills-synthesizer',
      name: 'Skills Assessment',
      config: {
        frameworks: ['SFIA', 'ESCO', 'O*NET'],
        assessmentMethods: ['portfolio', 'testing', 'peer-review'],
        model: 'mistral-7b'
      },
      position: { x: 300, y: 100 },
      ports: {
        input: [
          { id: 'credentials', type: 'input', dataType: 'credential-data', label: 'Credentials', required: true }
        ],
        output: [
          { id: 'skills', type: 'output', dataType: 'skills-profile', label: 'Skills Profile' }
        ]
      }
    },
    {
      id: 'market-analysis',
      type: 'memory-synthesizer',
      name: 'Job Market Analysis',
      config: {
        timeWindows: ['current', '6-month', '12-month'],
        patternTypes: ['job-trends', 'skill-demand', 'salary', 'growth'],
        model: 'mistral-7b'
      },
      position: { x: 500, y: 100 },
      ports: {
        input: [
          { id: 'history', type: 'input', dataType: 'historical-data', label: 'Market Data', required: true }
        ],
        output: [
          { id: 'patterns', type: 'output', dataType: 'memory-patterns', label: 'Market Patterns' }
        ]
      }
    },
    {
      id: 'bias-audit',
      type: 'bias-auditor',
      name: 'Educational Bias Audit',
      config: {
        biasCategories: ['demographic', 'educational', 'geographic'],
        educationalBias: true,
        detectionMethods: ['statistical', 'causal'],
        reportingFormat: 'detailed'
      },
      position: { x: 700, y: 100 },
      ports: {
        input: [
          { id: 'output', type: 'input', dataType: 'model-output', label: 'Model Output', required: true }
        ],
        output: [
          { id: 'analysis', type: 'output', dataType: 'bias-analysis', label: 'Bias Analysis' }
        ]
      }
    },
    {
      id: 'recommendations',
      type: 'recommendation-engine',
      name: 'Learning Path Recommendation',
      config: {
        algorithms: ['content-based', 'collaborative'],
        fairnessConstraints: true,
        diversityPromotion: true,
        personalized: true
      },
      position: { x: 900, y: 100 },
      ports: {
        input: [
          { id: 'profile', type: 'input', dataType: 'user-profile', label: 'Student Profile', required: true }
        ],
        output: [
          { id: 'recommendations', type: 'output', dataType: 'recommendations', label: 'Learning Path' }
        ]
      }
    }
  ],
  connections: [
    { id: 'conn-1', source: 'credential-intake', target: 'skills-mapping', dataType: 'credential-data' },
    { id: 'conn-2', source: 'skills-mapping', target: 'market-analysis', dataType: 'historical-data' },
    { id: 'conn-3', source: 'market-analysis', target: 'bias-audit', dataType: 'model-output' },
    { id: 'conn-4', source: 'bias-audit', target: 'recommendations', dataType: 'user-profile' }
  ],
  config: {
    version: '1.0.0',
    estimatedCost: 0.02,
    estimatedTime: 10,
    complexity: 'medium',
    requirements: ['Credential verification', 'Skills frameworks', 'Job market data']
  },
  metadata: {
    author: 'Agent Labs Team',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    tags: ['education', 'skills', 'assessment', 'recommendations', 'fairness'],
    usage: 0
  }
};

// Justice Engine Template
export const justiceTemplate: PipelineTemplate = {
  templateId: 'justice-engine',
  name: 'Legal Evidence Analysis Engine',
  description: 'Evidence collection and case analysis pipeline',
  industry: 'justice',
  category: 'legal',
  nodes: [
    {
      id: 'evidence-collection',
      type: 'evidence-collector',
      name: 'Evidence Collection',
      config: {
        sources: ['court-records', 'witness-statements', 'digital-evidence'],
        chainOfCustody: true,
        encryption: true,
        legalCompliance: true
      },
      position: { x: 100, y: 100 },
      ports: {
        input: [
          { id: 'case-trigger', type: 'input', dataType: 'case-trigger', label: 'Case', required: true }
        ],
        output: [
          { id: 'evidence', type: 'output', dataType: 'evidence-bundle', label: 'Evidence Bundle' }
        ]
      }
    },
    {
      id: 'case-analysis',
      type: 'memory-synthesizer',
      name: 'Case Pattern Analysis',
      config: {
        timeWindows: ['case-timeline', 'precedent-history'],
        patternTypes: ['legal-patterns', 'evidence-correlations', 'precedent-similarities'],
        model: 'mistral-7b'
      },
      position: { x: 300, y: 100 },
      ports: {
        input: [
          { id: 'history', type: 'input', dataType: 'historical-data', label: 'Case History', required: true }
        ],
        output: [
          { id: 'patterns', type: 'output', dataType: 'memory-patterns', label: 'Legal Patterns' }
        ]
      }
    },
    {
      id: 'bias-detection',
      type: 'bias-auditor',
      name: 'Legal Bias Detection',
      config: {
        biasCategories: ['demographic', 'socioeconomic', 'geographic'],
        legalBias: true,
        detectionMethods: ['statistical', 'causal', 'counterfactual'],
        reportingFormat: 'detailed'
      },
      position: { x: 500, y: 100 },
      ports: {
        input: [
          { id: 'output', type: 'input', dataType: 'model-output', label: 'Model Output', required: true }
        ],
        output: [
          { id: 'analysis', type: 'output', dataType: 'bias-analysis', label: 'Bias Analysis' }
        ]
      }
    },
    {
      id: 'decision-support',
      type: 'decision-orchestrator',
      name: 'Legal Decision Support',
      config: {
        decisionTypes: ['recommendation', 'escalation', 'review'],
        legalOversight: true,
        confidenceThreshold: 0.9,
        precedentWeight: 0.7
      },
      position: { x: 700, y: 100 },
      ports: {
        input: [
          { id: 'analysis', type: 'input', dataType: 'analysis-data', label: 'Analysis', required: true },
          { id: 'human-review', type: 'input', dataType: 'human-input', label: 'Legal Review' }
        ],
        output: [
          { id: 'decision', type: 'output', dataType: 'decision', label: 'Legal Recommendation' }
        ]
      }
    },
    {
      id: 'recommendations',
      type: 'recommendation-engine',
      name: 'Case Strategy Recommendation',
      config: {
        algorithms: ['precedent-based', 'evidence-weighted'],
        legalConstraints: true,
        fairnessConstraints: true,
        precedentWeight: 0.8
      },
      position: { x: 900, y: 100 },
      ports: {
        input: [
          { id: 'profile', type: 'input', dataType: 'user-profile', label: 'Case Profile', required: true }
        ],
        output: [
          { id: 'recommendations', type: 'output', dataType: 'recommendations', label: 'Strategy Recommendations' }
        ]
      }
    }
  ],
  connections: [
    { id: 'conn-1', source: 'evidence-collection', target: 'case-analysis', dataType: 'historical-data' },
    { id: 'conn-2', source: 'case-analysis', target: 'bias-detection', dataType: 'model-output' },
    { id: 'conn-3', source: 'bias-detection', target: 'decision-support', dataType: 'analysis-data' },
    { id: 'conn-4', source: 'decision-support', target: 'recommendations', dataType: 'user-profile' }
  ],
  config: {
    version: '1.0.0',
    estimatedCost: 0.06,
    estimatedTime: 45,
    complexity: 'high',
    requirements: ['Legal compliance', 'Chain of custody', 'Precedent database']
  },
  metadata: {
    author: 'Agent Labs Team',
    createdAt: '2025-01-08T10:00:00Z',
    updatedAt: '2025-01-08T10:00:00Z',
    tags: ['justice', 'legal', 'evidence', 'bias', 'precedent'],
    usage: 0
  }
};

// All pipeline templates
export const allPipelineTemplates: PipelineTemplate[] = [
  healthcareTemplate,
  financeTemplate,
  insuranceTemplate,
  educationTemplate,
  justiceTemplate
];

// Template categories for UI organization
export const templateCategories = {
  healthcare: {
    name: 'Healthcare',
    description: 'Medical diagnosis and treatment pipelines',
    icon: '🏥',
    color: 'bg-red-100 text-red-600'
  },
  finance: {
    name: 'Finance',
    description: 'Banking and financial services pipelines',
    icon: '🏦',
    color: 'bg-green-100 text-green-600'
  },
  insurance: {
    name: 'Insurance',
    description: 'Risk assessment and underwriting pipelines',
    icon: '🛡️',
    color: 'bg-blue-100 text-blue-600'
  },
  education: {
    name: 'Education',
    description: 'Skills assessment and learning pipelines',
    icon: '🎓',
    color: 'bg-purple-100 text-purple-600'
  },
  justice: {
    name: 'Justice',
    description: 'Legal analysis and evidence pipelines',
    icon: '⚖️',
    color: 'bg-yellow-100 text-yellow-600'
  }
};
