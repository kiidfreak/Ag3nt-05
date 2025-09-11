// Agent Type Definitions and Help Text
export interface AgentTypeDefinition {
  id: string;
  name: string;
  category: 'basic' | 'specialized';
  description: string;
  useCases: string[];
  examples: string[];
  icon: string;
  color: string;
  ports: {
    inputs: Array<{ id: string; label: string; dataType: string; required?: boolean }>;
    outputs: Array<{ id: string; label: string; dataType: string }>;
  };
}

export const agentTypeDefinitions: Record<string, AgentTypeDefinition> = {
  // Basic Building Blocks
  input: {
    id: 'input',
    name: 'Input',
    category: 'basic',
    description: 'Entry point for data into your flow. Handles user input, API calls, or data ingestion.',
    useCases: ['User forms', 'API data fetching', 'File uploads', 'Manual data entry'],
    examples: ['Patient intake form', 'Banking transaction data', 'Insurance claim submission'],
    icon: '→',
    color: 'green',
    ports: {
      inputs: [],
      outputs: [{ id: 'output', label: 'Data', dataType: 'any' }]
    }
  },
  output: {
    id: 'output',
    name: 'Output',
    category: 'basic',
    description: 'Exit point for processed data. Displays results, saves files, or sends notifications.',
    useCases: ['Display results', 'Save to database', 'Send notifications', 'Export files'],
    examples: ['Treatment recommendation', 'Credit decision', 'Claim settlement'],
    icon: '←',
    color: 'purple',
    ports: {
      inputs: [{ id: 'input', label: 'Data', dataType: 'any', required: true }],
      outputs: []
    }
  },
  agent: {
    id: 'agent',
    name: 'AI Agent',
    category: 'basic',
    description: 'Generic AI processing unit. Handles chat, analysis, and general AI tasks.',
    useCases: ['Chat conversations', 'General analysis', 'Text processing', 'Basic AI tasks'],
    examples: ['Customer support chat', 'Document analysis', 'General Q&A'],
    icon: '🤖',
    color: 'blue',
    ports: {
      inputs: [{ id: 'input', label: 'Input', dataType: 'any', required: true }],
      outputs: [{ id: 'output', label: 'Output', dataType: 'any' }]
    }
  },
  action: {
    id: 'action',
    name: 'Action',
    category: 'basic',
    description: 'Performs specific operations like API calls, database queries, or system actions.',
    useCases: ['API calls', 'Database operations', 'System actions', 'External integrations'],
    examples: ['Fetch patient records', 'Update database', 'Send email notification'],
    icon: '⚡',
    color: 'purple',
    ports: {
      inputs: [{ id: 'input', label: 'Input', dataType: 'any', required: true }],
      outputs: [{ id: 'output', label: 'Result', dataType: 'any' }]
    }
  },
  condition: {
    id: 'condition',
    name: 'Condition',
    category: 'basic',
    description: 'Decision logic for branching flows. Routes data based on conditions.',
    useCases: ['Flow branching', 'Decision trees', 'Conditional logic', 'Routing'],
    examples: ['Risk level check', 'Approval routing', 'Priority assignment'],
    icon: '❓',
    color: 'yellow',
    ports: {
      inputs: [{ id: 'input', label: 'Input', dataType: 'any', required: true }],
      outputs: [
        { id: 'true', label: 'True', dataType: 'any' },
        { id: 'false', label: 'False', dataType: 'any' }
      ]
    }
  },

  // Specialized Agent Types
  collector: {
    id: 'collector',
    name: 'Data Collector',
    category: 'specialized',
    description: 'Specialized for gathering and ingesting data from various sources. Optimized for data collection workflows.',
    useCases: ['Patient intake', 'Data harvesting', 'Evidence collection', 'Multi-source data gathering'],
    examples: ['FHIR/HL7 patient data', 'Open Banking transactions', 'Insurance claim documents'],
    icon: '📥',
    color: 'green',
    ports: {
      inputs: [],
      outputs: [{ id: 'output', label: 'Collected Data', dataType: 'any' }]
    }
  },
  synthesizer: {
    id: 'synthesizer',
    name: 'Data Synthesizer',
    category: 'specialized',
    description: 'Processes and analyzes raw data to create meaningful insights. Specialized for data synthesis and correlation.',
    useCases: ['Symptom analysis', 'Skills assessment', 'Memory synthesis', 'Data correlation'],
    examples: ['Symptom pattern recognition', 'Financial risk analysis', 'Claim history correlation'],
    icon: '🧠',
    color: 'blue',
    ports: {
      inputs: [{ id: 'input', label: 'Raw Data', dataType: 'any', required: true }],
      outputs: [{ id: 'output', label: 'Synthesized Data', dataType: 'any' }]
    }
  },
  scorer: {
    id: 'scorer',
    name: 'Risk Scorer',
    category: 'specialized',
    description: 'Quantifies risk, reliability, and exposure levels. Specialized for scoring and risk assessment.',
    useCases: ['Risk scoring', 'Peril assessment', 'Reliability scoring', 'Exposure calculation'],
    examples: ['Patient risk assessment', 'Credit risk scoring', 'Insurance peril scoring'],
    icon: '📊',
    color: 'orange',
    ports: {
      inputs: [{ id: 'input', label: 'Data to Score', dataType: 'any', required: true }],
      outputs: [{ id: 'output', label: 'Score', dataType: 'number' }]
    }
  },
  auditor: {
    id: 'auditor',
    name: 'Bias Auditor',
    category: 'specialized',
    description: 'Detects and flags systemic bias, ensures compliance, and maintains fairness standards.',
    useCases: ['Bias detection', 'Compliance checking', 'Fairness auditing', 'Regulatory compliance'],
    examples: ['Demographic bias check', 'GDPR compliance', 'Fair lending audit'],
    icon: '🛡️',
    color: 'red',
    ports: {
      inputs: [{ id: 'input', label: 'Data to Audit', dataType: 'any', required: true }],
      outputs: [{ id: 'output', label: 'Audit Results', dataType: 'object' }]
    }
  },
  orchestrator: {
    id: 'orchestrator',
    name: 'Decision Orchestrator',
    category: 'specialized',
    description: 'Final decision-making unit that coordinates multiple inputs to make complex decisions.',
    useCases: ['Treatment decisions', 'Credit decisions', 'Settlement decisions', 'Recommendation engines'],
    examples: ['Treatment plan orchestration', 'Credit approval decision', 'Insurance settlement decision'],
    icon: '🎯',
    color: 'purple',
    ports: {
      inputs: [{ id: 'input', label: 'Input Data', dataType: 'any', required: true }],
      outputs: [{ id: 'output', label: 'Decision/Output', dataType: 'any' }]
    }
  }
};

export const getAgentTypeDefinition = (type: string): AgentTypeDefinition | null => {
  return agentTypeDefinitions[type] || null;
};

export const getAgentTypeCategory = (type: string): 'basic' | 'specialized' | 'unknown' => {
  const definition = getAgentTypeDefinition(type);
  return definition?.category || 'unknown';
};

export const getBasicAgentTypes = (): AgentTypeDefinition[] => {
  return Object.values(agentTypeDefinitions).filter(def => def.category === 'basic');
};

export const getSpecializedAgentTypes = (): AgentTypeDefinition[] => {
  return Object.values(agentTypeDefinitions).filter(def => def.category === 'specialized');
};
