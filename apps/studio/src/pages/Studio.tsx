import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Save, Settings, Trash2, Bot, Zap, Shield, Coins, ArrowRight, Folder, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';
import { mockApiService, type MockFlow, type MockFlowNode, type MockAgent } from '../services/mockData';
import { allEnhancedAgents, agentCategories } from '../services/agentTypes';
import { allPipelineTemplates, templateCategories } from '../services/pipelineTemplates';
import { checkInfrastructureHealth } from '../services/supportingInfrastructure';
import { executeHealthcareFlowExample, createSamplePatient } from '../services/healthcareFlowExample';
import { executeFinanceFlowExample, createSampleApplicant } from '../services/financeFlowExample';
import { executeInsuranceFlowExample, createSampleInsuranceApplication } from '../services/insuranceFlowExample';
import { executeEducationFlowExample, createSampleStudent } from '../services/educationFlowExample';
import { executeJusticeFlowExample, createSampleLegalCase } from '../services/justiceFlowExample';
import EnhancedCanvas from '../components/EnhancedCanvas';
import EnhancedPropertiesPanel from '../components/EnhancedPropertiesPanel';
import EnhancedSidebar from '../components/EnhancedSidebar';
import VoicePanel from '../components/VoicePanel';
import WorkflowGuide from '../components/WorkflowGuide';

interface DragItem {
  type: 'agent' | 'condition' | 'action' | 'input' | 'output';
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface Connection {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  type: 'data' | 'control' | 'event';
  status: 'connected' | 'disconnected' | 'error';
}

interface Port {
  id: string;
  type: 'input' | 'output';
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'any';
  label: string;
  required?: boolean;
}

interface EnhancedFlowNode extends MockFlowNode {
  name: string; // Add name property
  ports: Port[];
  status: 'idle' | 'running' | 'completed' | 'error';
}

const Studio: React.FC = () => {
  const navigate = useNavigate();
  const [flows, setFlows] = useState<MockFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<MockFlow | null>(null);
  const [nodes, setNodes] = useState<EnhancedFlowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [agents, setAgents] = useState<MockAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [selectedNode, setSelectedNode] = useState<EnhancedFlowNode | null>(null);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [pipelineTemplates, setPipelineTemplates] = useState(allPipelineTemplates);
  const [infrastructureHealth, setInfrastructureHealth] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);

  // Get recent flows (last 3)
  const recentFlows = flows.slice(0, 3).map(flow => ({
    id: flow.id,
    name: flow.name,
    status: flow.status,
  }));

  // Get available agents (combine API agents with enhanced agents)
  const availableAgents = [
    ...agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      status: agent.status,
      type: agent.type,
    })),
    ...allEnhancedAgents.map(agent => ({
      id: agent.id,
      name: agent.name,
      status: agent.status,
      type: agent.type,
    }))
  ];

  const dragItems: DragItem[] = [
    {
      type: 'input',
      id: 'input',
      name: 'Input',
      icon: ArrowRight,
      color: 'bg-green-100 text-green-600',
    },
    {
      type: 'agent',
      id: 'agent',
      name: 'Agent',
      icon: Bot,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      type: 'condition',
      id: 'condition',
      name: 'Condition',
      icon: Settings,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      type: 'action',
      id: 'action',
      name: 'Action',
      icon: Zap,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      type: 'output',
      id: 'output',
      name: 'Output',
      icon: ArrowRight,
      color: 'bg-red-100 text-red-600',
    },
  ];

  // Enhanced drag items with new agent categories
  const enhancedDragItems = [
    ...dragItems,
    // Collector Agents
    ...allEnhancedAgents.filter(agent => agent.category === 'collector').map(agent => ({
      type: 'agent' as const,
      id: agent.id,
      name: agent.name,
      icon: Bot,
      color: agentCategories.collector.color,
      category: 'collector',
      description: agent.description,
      industry: agent.industry,
      capabilities: agent.capabilities
    })),
    // Synthesizer Agents
    ...allEnhancedAgents.filter(agent => agent.category === 'synthesizer').map(agent => ({
      type: 'agent' as const,
      id: agent.id,
      name: agent.name,
      icon: Bot,
      color: agentCategories.synthesizer.color,
      category: 'synthesizer',
      description: agent.description,
      industry: agent.industry,
      capabilities: agent.capabilities
    })),
    // Scorer Agents
    ...allEnhancedAgents.filter(agent => agent.category === 'scorer').map(agent => ({
      type: 'agent' as const,
      id: agent.id,
      name: agent.name,
      icon: Bot,
      color: agentCategories.scorer.color,
      category: 'scorer',
      description: agent.description,
      industry: agent.industry,
      capabilities: agent.capabilities
    })),
    // Auditor Agents
    ...allEnhancedAgents.filter(agent => agent.category === 'auditor').map(agent => ({
      type: 'agent' as const,
      id: agent.id,
      name: agent.name,
      icon: Bot,
      color: agentCategories.auditor.color,
      category: 'auditor',
      description: agent.description,
      industry: agent.industry,
      capabilities: agent.capabilities
    })),
    // Orchestrator Agents
    ...allEnhancedAgents.filter(agent => agent.category === 'orchestrator').map(agent => ({
      type: 'agent' as const,
      id: agent.id,
      name: agent.name,
      icon: Bot,
      color: agentCategories.orchestrator.color,
      category: 'orchestrator',
      description: agent.description,
      industry: agent.industry,
      capabilities: agent.capabilities
    }))
  ];

  // Component port configurations
  const getComponentPorts = (type: string): Port[] => {
    switch (type) {
      case 'input':
        return [
          { id: 'output', type: 'output', dataType: 'any', label: 'Data' }
        ];
      case 'agent':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Input', required: true },
          { id: 'output', type: 'output', dataType: 'any', label: 'Output' }
        ];
      case 'condition':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Input', required: true },
          { id: 'true', type: 'output', dataType: 'any', label: 'True' },
          { id: 'false', type: 'output', dataType: 'any', label: 'False' }
        ];
      case 'action':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Input', required: true },
          { id: 'output', type: 'output', dataType: 'any', label: 'Result' }
        ];
      case 'output':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Data', required: true }
        ];
      // New agent types
      case 'collector':
        return [
          { id: 'output', type: 'output', dataType: 'any', label: 'Collected Data' }
        ];
      case 'synthesizer':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Raw Data', required: true },
          { id: 'output', type: 'output', dataType: 'any', label: 'Synthesized Data' }
        ];
      case 'scorer':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Data to Score', required: true },
          { id: 'output', type: 'output', dataType: 'number', label: 'Score' }
        ];
      case 'auditor':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Data to Audit', required: true },
          { id: 'output', type: 'output', dataType: 'object', label: 'Audit Results' }
        ];
      case 'orchestrator':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Input Data', required: true },
          { id: 'output', type: 'output', dataType: 'any', label: 'Decision/Output' }
        ];
      
      // Template-specific node types
      case 'intake-collector':
        return [
          { id: 'trigger', type: 'input', dataType: 'trigger', label: 'Trigger', required: true },
          { id: 'data', type: 'output', dataType: 'structured-data', label: 'Collected Data' }
        ];
      case 'symptom-synthesizer':
      case 'memory-synthesizer':
      case 'skills-synthesizer':
        return [
          { id: 'input', type: 'input', dataType: 'any', label: 'Input Data', required: true },
          { id: 'output', type: 'output', dataType: 'analysis', label: 'Analysis' }
        ];
      case 'risk-scorer':
      case 'peril-scorer':
        return [
          { id: 'input', type: 'input', dataType: 'risk-factors', label: 'Risk Factors', required: true },
          { id: 'output', type: 'output', dataType: 'risk-score', label: 'Risk Score' }
        ];
      case 'fairness-auditor':
      case 'bias-auditor':
        return [
          { id: 'input', type: 'input', dataType: 'decision-data', label: 'Decision Data', required: true },
          { id: 'output', type: 'output', dataType: 'fairness-report', label: 'Fairness Report' }
        ];
      case 'treatment-orchestrator':
      case 'decision-orchestrator':
        return [
          { id: 'input', type: 'input', dataType: 'analysis-data', label: 'Analysis', required: true },
          { id: 'output', type: 'output', dataType: 'decision', label: 'Decision' }
        ];
      case 'data-harvester':
        return [
          { id: 'trigger', type: 'input', dataType: 'application-trigger', label: 'Application', required: true },
          { id: 'data', type: 'output', dataType: 'unstructured-data', label: 'Harvested Data' }
        ];
      case 'evidence-collector':
        return [
          { id: 'trigger', type: 'input', dataType: 'case-trigger', label: 'Case', required: true },
          { id: 'evidence', type: 'output', dataType: 'evidence-bundle', label: 'Evidence Bundle' }
        ];
      case 'recommendation-engine':
        return [
          { id: 'input', type: 'input', dataType: 'user-profile', label: 'User Profile', required: true },
          { id: 'output', type: 'output', dataType: 'recommendations', label: 'Recommendations' }
        ];
      default:
        return [];
    }
  };

  // Convert MockFlowNode to EnhancedFlowNode
  const enhanceNode = (node: MockFlowNode): EnhancedFlowNode => ({
    ...node,
    name: node.config?.name || `${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node`, // Add default name
    ports: getComponentPorts(node.type),
    status: 'idle'
  });

  // AI Prompts for different node types and industries
  const getAIPromptsForNode = (nodeType: string, industry: string, nodeName: string) => {
    const prompts: Record<string, Record<string, string>> = {
      'intake-collector': {
        healthcare: `You are a medical data intake specialist. Analyze patient information including symptoms, medical history, and current medications. Extract structured data while maintaining HIPAA compliance. Focus on identifying key medical indicators and potential risk factors.`,
        finance: `You are a financial data analyst. Process loan applications, credit reports, and financial statements. Extract key financial metrics, identify red flags, and structure data for risk assessment. Ensure PCI compliance and data accuracy.`,
        insurance: `You are an insurance data specialist. Analyze policy applications, property details, and risk factors. Extract exposure data, identify potential hazards, and structure information for underwriting decisions.`,
        education: `You are an educational credential analyst. Verify academic records, certifications, and skills documentation. Extract structured skill profiles and validate credential authenticity using blockchain verification.`,
        justice: `You are a legal evidence specialist. Process case files, witness statements, and digital evidence. Maintain chain of custody, extract key facts, and structure evidence for legal analysis.`
      },
      'symptom-synthesizer': {
        healthcare: `You are a medical AI specialist. Analyze patient symptoms using SNOMED-CT ontology. Correlate symptoms with potential diagnoses, identify patterns, and provide confidence scores. Consider differential diagnoses and recommend further testing.`,
        finance: `You are a financial pattern analyst. Analyze spending patterns, income stability, and credit behavior. Identify financial health indicators, predict future behavior, and assess creditworthiness using advanced ML models.`,
        insurance: `You are an insurance risk analyst. Analyze property characteristics, location data, and historical claims. Assess exposure to natural disasters, crime rates, and other risk factors using geospatial and climate data.`,
        education: `You are a skills assessment specialist. Map credentials to standardized skill frameworks (SFIA, ESCO, O*NET). Assess skill levels, identify gaps, and create comprehensive skill profiles for career development.`,
        justice: `You are a legal pattern analyst. Analyze case precedents, evidence correlations, and legal patterns. Identify similar cases, assess evidence strength, and provide legal insights for case strategy.`
      },
      'risk-scorer': {
        healthcare: `You are a clinical risk assessment AI. Evaluate patient risk factors across multiple dimensions: clinical severity, safety concerns, and prognosis. Use evidence-based scoring methods and provide detailed risk explanations.`,
        finance: `You are a credit risk assessment AI. Evaluate creditworthiness, fraud risk, and default probability. Use regulatory-compliant scoring models and provide transparent risk explanations for lending decisions.`,
        insurance: `You are an insurance risk assessment AI. Evaluate peril exposure, actuarial risk, and loss probability. Use climate models, historical data, and real-time information for accurate risk scoring.`,
        education: `You are an educational outcome predictor. Assess learning potential, career trajectory, and skill development likelihood. Use market data and educational psychology models for personalized recommendations.`,
        justice: `You are a legal outcome predictor. Assess case strength, precedent alignment, and success probability. Use legal databases and historical case analysis for strategic recommendations.`
      },
      'fairness-auditor': {
        healthcare: `You are a medical fairness auditor. Detect bias in healthcare decisions across demographic, socioeconomic, and geographic dimensions. Ensure equitable treatment and identify potential discrimination in medical care.`,
        finance: `You are a fair lending auditor. Detect bias in credit decisions and ensure compliance with fair lending laws. Analyze demographic parity, equalized odds, and other fairness metrics.`,
        insurance: `You are an insurance fairness auditor. Detect bias in underwriting decisions and ensure equitable treatment across all demographic groups. Analyze geographic and demographic fairness in insurance practices.`,
        education: `You are an educational fairness auditor. Detect bias in assessment and recommendation systems. Ensure equitable access to educational opportunities across all demographic groups.`,
        justice: `You are a legal fairness auditor. Detect bias in legal decisions and ensure equitable treatment under the law. Analyze demographic and socioeconomic fairness in legal outcomes.`
      },
      'decision-orchestrator': {
        healthcare: `You are a medical decision orchestrator. Integrate clinical data, risk assessments, and fairness audits to make evidence-based treatment recommendations. Ensure patient safety and regulatory compliance.`,
        finance: `You are a lending decision orchestrator. Integrate credit scores, risk assessments, and fairness audits to make compliant lending decisions. Balance risk management with fair access to credit.`,
        insurance: `You are an underwriting decision orchestrator. Integrate risk assessments, actuarial models, and fairness audits to make compliant underwriting decisions. Balance profitability with equitable coverage.`,
        education: `You are an educational recommendation orchestrator. Integrate skill assessments, market analysis, and fairness audits to provide personalized learning recommendations. Ensure equitable access to education.`,
        justice: `You are a legal decision orchestrator. Integrate evidence analysis, precedent research, and fairness audits to provide legal recommendations. Ensure equitable treatment under the law.`
      }
    };

    return prompts[nodeType]?.[industry] || `You are an AI specialist for ${nodeName}. Process the input data according to industry best practices and provide accurate, fair, and compliant outputs.`;
  };

  // Process definitions for different node types
  const getProcessesForNode = (nodeType: string, industry: string) => {
    const processes: Record<string, string[]> = {
      'intake-collector': [
        'Data validation and sanitization',
        'Format standardization',
        'Compliance verification',
        'Quality assurance checks',
        'Data encryption and security'
      ],
      'symptom-synthesizer': [
        'Pattern recognition and analysis',
        'Confidence scoring',
        'Correlation identification',
        'Model inference and prediction',
        'Result validation and explanation'
      ],
      'risk-scorer': [
        'Multi-dimensional risk assessment',
        'Weighted scoring calculation',
        'Threshold evaluation',
        'Risk explanation generation',
        'Compliance verification'
      ],
      'fairness-auditor': [
        'Bias detection analysis',
        'Fairness metric calculation',
        'Statistical significance testing',
        'Bias report generation',
        'Recommendation formulation'
      ],
      'decision-orchestrator': [
        'Multi-source data integration',
        'Decision logic evaluation',
        'Confidence assessment',
        'Human oversight integration',
        'Final decision generation'
      ]
    };

    return processes[nodeType] || ['Data processing', 'Analysis', 'Validation', 'Output generation'];
  };

  // Validation rules for different node types and industries
  const getValidationRules = (nodeType: string, industry: string) => {
    const rules: Record<string, Record<string, string[]>> = {
      'intake-collector': {
        healthcare: ['HIPAA compliance', 'Medical data accuracy', 'Patient consent verification'],
        finance: ['PCI compliance', 'Financial data accuracy', 'Identity verification'],
        insurance: ['Data completeness', 'Property verification', 'Risk factor validation'],
        education: ['Credential verification', 'Blockchain validation', 'Skills framework compliance'],
        justice: ['Chain of custody', 'Evidence integrity', 'Legal compliance']
      },
      'symptom-synthesizer': {
        healthcare: ['Medical accuracy', 'Clinical validation', 'Confidence threshold'],
        finance: ['Pattern accuracy', 'Statistical significance', 'Model validation'],
        insurance: ['Risk assessment accuracy', 'Actuarial validation', 'Climate data verification'],
        education: ['Skills mapping accuracy', 'Framework compliance', 'Assessment validation'],
        justice: ['Legal pattern accuracy', 'Precedent validation', 'Evidence correlation']
      },
      'risk-scorer': {
        healthcare: ['Clinical risk accuracy', 'Safety threshold compliance', 'Medical validation'],
        finance: ['Credit risk accuracy', 'Regulatory compliance', 'Fair lending validation'],
        insurance: ['Actuarial accuracy', 'Risk model validation', 'Regulatory compliance'],
        education: ['Outcome prediction accuracy', 'Educational psychology validation', 'Market data accuracy'],
        justice: ['Legal outcome accuracy', 'Precedent alignment', 'Legal validation']
      },
      'fairness-auditor': {
        healthcare: ['Demographic parity', 'Equalized odds', 'Medical fairness standards'],
        finance: ['Fair lending compliance', 'Demographic parity', 'Equal opportunity'],
        insurance: ['Geographic fairness', 'Demographic parity', 'Insurance fairness standards'],
        education: ['Educational equity', 'Demographic parity', 'Access fairness'],
        justice: ['Legal equity', 'Demographic parity', 'Justice fairness standards']
      },
      'decision-orchestrator': {
        healthcare: ['Clinical safety', 'Regulatory compliance', 'Patient outcome optimization'],
        finance: ['Regulatory compliance', 'Risk management', 'Fair access'],
        insurance: ['Actuarial compliance', 'Regulatory requirements', 'Risk management'],
        education: ['Educational standards', 'Equity compliance', 'Outcome optimization'],
        justice: ['Legal compliance', 'Justice standards', 'Equity requirements']
      }
    };

    return rules[nodeType]?.[industry] || ['Data accuracy', 'Process compliance', 'Output validation'];
  };

  useEffect(() => {
    loadFlows();
  }, []);

  useEffect(() => {
    if (selectedFlow) {
      setFlowName(selectedFlow.name);
      setFlowDescription(selectedFlow.description || '');
      // Convert nodes to enhanced nodes
      const enhancedNodes = selectedFlow.nodes.map(enhanceNode);
      setNodes(enhancedNodes);
    }
  }, [selectedFlow]);

  // Listen for template drop events from the canvas
  useEffect(() => {
    const handleTemplateDrop = (event: CustomEvent) => {
      const { template, position } = event.detail;
      handleTemplateSelect(template);
    };

    window.addEventListener('templateDrop', handleTemplateDrop as EventListener);
    
    return () => {
      window.removeEventListener('templateDrop', handleTemplateDrop as EventListener);
    };
  }, []);

  const loadFlows = async () => {
    try {
      setLoading(true);
      const [flowsResponse, agentsResponse, healthData] = await Promise.all([
        mockApiService.getFlows(),
        mockApiService.getAgents(),
        checkInfrastructureHealth()
      ]);
      
      setFlows(flowsResponse.data);
      setAgents(agentsResponse.data);
      setInfrastructureHealth(healthData);
      
      if (flowsResponse.data.length > 0) {
        setSelectedFlow(flowsResponse.data[0]);
        const enhancedNodes = flowsResponse.data[0].nodes.map(enhanceNode);
        setNodes(enhancedNodes);
      } else {
        // Create a sample flow with initial nodes if no flows exist
        const sampleFlow = {
          id: 'sample-flow-1',
          name: 'Sample Agent Workflow',
          description: 'A sample workflow to get you started',
          status: 'draft' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          config: {
            version: '1.0.0',
            triggers: [],
            steps: [],
          },
          nodes: []
        };
        
        setFlows([sampleFlow]);
        setSelectedFlow(sampleFlow);
        
        // Add some sample nodes to get started - positioned in center of viewport
        const sampleNodes: EnhancedFlowNode[] = [
          {
            id: 'node-1',
            type: 'input',
            name: 'Data Input',
            config: { name: 'Data Input' },
            position: { x: 50, y: 50 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            flowId: sampleFlow.id,
            ports: getComponentPorts('input'),
            status: 'idle'
          },
          {
            id: 'node-2',
            type: 'agent',
            name: 'AI Agent',
            config: { name: 'AI Agent' },
            position: { x: 250, y: 50 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            flowId: sampleFlow.id,
            ports: getComponentPorts('agent'),
            status: 'idle'
          },
          {
            id: 'node-3',
            type: 'condition',
            name: 'Decision Point',
            config: { name: 'Decision Point' },
            position: { x: 450, y: 50 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            flowId: sampleFlow.id,
            ports: getComponentPorts('condition'),
            status: 'idle'
          },
          {
            id: 'node-4',
            type: 'action',
            name: 'Process Data',
            config: { name: 'Process Data' },
            position: { x: 250, y: 200 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            flowId: sampleFlow.id,
            ports: getComponentPorts('action'),
            status: 'idle'
          },
          {
            id: 'node-5',
            type: 'output',
            name: 'Result Output',
            config: { name: 'Result Output' },
            position: { x: 450, y: 200 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            flowId: sampleFlow.id,
            ports: getComponentPorts('output'),
            status: 'idle'
          }
        ];
        
        setNodes(sampleNodes);
        
        // Center the viewport after a short delay to ensure canvas is rendered
        setTimeout(() => {
          const canvasElement = document.querySelector('.react-flow__viewport');
          if (canvasElement) {
            // Reset transform to center the view
            (canvasElement as HTMLElement).style.transform = 'translate(0px, 0px) scale(1)';
          }
        }, 100);
        
        // Add some sample connections
        const sampleConnections: Connection[] = [
          {
            id: 'conn-1',
            sourceNodeId: 'node-1',
            sourcePortId: 'output',
            targetNodeId: 'node-2',
            targetPortId: 'input',
            type: 'data',
            status: 'connected'
          },
          {
            id: 'conn-2',
            sourceNodeId: 'node-2',
            sourcePortId: 'output',
            targetNodeId: 'node-3',
            targetPortId: 'input',
            type: 'data',
            status: 'connected'
          },
          {
            id: 'conn-3',
            sourceNodeId: 'node-3',
            sourcePortId: 'true',
            targetNodeId: 'node-4',
            targetPortId: 'input',
            type: 'data',
            status: 'connected'
          },
          {
            id: 'conn-4',
            sourceNodeId: 'node-4',
            sourcePortId: 'output',
            targetNodeId: 'node-5',
            targetPortId: 'input',
            type: 'data',
            status: 'connected'
          }
        ];
        
        setConnections(sampleConnections);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlow = async () => {
    if (!newFlowName.trim()) return;

    try {
      const response = await mockApiService.createFlow({
        name: newFlowName,
        description: 'A new flow created in the studio',
        config: {
          version: '1.0.0',
          triggers: [],
          steps: [],
        },
      });

      setFlows([response.data, ...flows]);
      setSelectedFlow(response.data);
      setNodes([]);
      setNewFlowName('');
      setShowCreateFlow(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create flow');
    }
  };


  const handleFlowNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlowName(e.target.value);
  };

  const handleFlowDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFlowDescription(e.target.value);
  };

  const handleSaveFlowProperties = async () => {
    if (!selectedFlow) return;

    try {
      const updatedFlow = {
        ...selectedFlow,
        name: flowName,
        description: flowDescription,
      };
      
      await mockApiService.updateFlow(selectedFlow.id, {
        name: flowName,
        description: flowDescription,
      });

      setSelectedFlow(updatedFlow);
      setFlows(flows.map((f: MockFlow) => f.id === selectedFlow.id ? updatedFlow : f));
    } catch (err) {
      console.error('Failed to update flow:', err);
    }
  };

  const handleFlowSelect = (flow: MockFlow) => {
    setSelectedFlow(flow);
    const enhancedNodes = flow.nodes.map(enhanceNode);
    setNodes(enhancedNodes);
    setSelectedNode(null);
  };

  // Enhanced node handlers
  const handleNodeUpdate = (updatedNode: EnhancedFlowNode) => {
    const updatedNodes = nodes.map((node: EnhancedFlowNode) => 
      node.id === updatedNode.id ? updatedNode : node
    );
    setNodes(updatedNodes);
    setSelectedNode(updatedNode);
  };

  const handleNodeDelete = (nodeId: string) => {
    const updatedNodes = nodes.filter((node: EnhancedFlowNode) => node.id !== nodeId);
    const updatedConnections = connections.filter((conn: Connection) => 
      conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
    );
    setNodes(updatedNodes);
    setConnections(updatedConnections);
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleConnectionDelete = (connectionId: string) => {
    const updatedConnections = connections.filter((conn: Connection) => conn.id !== connectionId);
    setConnections(updatedConnections);
  };

  const handleNodeDuplicate = (node: EnhancedFlowNode) => {
    const newNode: EnhancedFlowNode = {
      ...node,
      id: `node-${Date.now()}`,
      position: { x: node.position.x + 50, y: node.position.y + 50 }
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodeSelect = (node: EnhancedFlowNode | null) => {
    setSelectedNode(node);
  };

  const handleAgentSelect = (agent: MockAgent) => {
    // Add agent as a node to the current flow
    if (!selectedFlow) return;

    const newNode: EnhancedFlowNode = {
      id: `node-${Date.now()}`,
      type: 'agent',
      name: agent.name, // Add the name property
      config: {
        name: agent.name,
        agentId: agent.id,
        settings: agent.config,
      },
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flowId: selectedFlow.id,
      agentId: agent.id,
      ports: getComponentPorts('agent'),
      status: 'idle'
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);

    const updatedFlow = {
      ...selectedFlow,
      nodes: updatedNodes.map(node => ({
        id: node.id,
        type: node.type,
        config: node.config,
        position: node.position,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        flowId: node.flowId,
        agentId: node.agentId
      })),
    };
    setSelectedFlow(updatedFlow);
    setFlows(flows.map((f: MockFlow) => f.id === selectedFlow.id ? updatedFlow : f));
  };

  const handleTemplateSelect = (template: any) => {
    if (!selectedFlow) return;

    // Create a mapping from template node IDs to new node IDs
    const nodeIdMap = new Map();
    
    // Convert template nodes to enhanced nodes with enhanced AI prompts
    const templateNodes = template.nodes.map((node: any) => {
      const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      nodeIdMap.set(node.id, newNodeId);
      
      // Enhance config with AI prompts and better processes
      const enhancedConfig = {
        name: node.name,
        ...node.config,
        // Add AI prompts based on node type and industry
        aiPrompts: getAIPromptsForNode(node.type, template.industry, node.name),
        // Add process definitions
        processes: getProcessesForNode(node.type, template.industry),
        // Add validation rules
        validation: getValidationRules(node.type, template.industry)
      };

      return {
        id: newNodeId,
        type: node.type,
        name: node.name,
        config: enhancedConfig,
        position: node.position,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        flowId: selectedFlow.id,
        ports: getComponentPorts(node.type),
        status: 'idle' as const
      };
    });

    // Convert template connections using the node ID mapping
    const templateConnections = template.connections.map((conn: any) => ({
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceNodeId: nodeIdMap.get(conn.source) || '',
      targetNodeId: nodeIdMap.get(conn.target) || '',
      sourcePortId: conn.sourcePort || 'output',
      targetPortId: conn.targetPort || 'input',
      type: 'data' as const,
      status: 'connected' as const
    }));

    setNodes(templateNodes);
    setConnections(templateConnections);

    // Mark flow as draft when template is added
    if (selectedFlow) {
      const updatedFlow = {
        ...selectedFlow,
        status: 'draft' as const,
        updatedAt: new Date().toISOString()
      };
      setSelectedFlow(updatedFlow);
      setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
    }
  };

  // Run Flow Handler
  const handleRunFlow = async () => {
    if (!selectedFlow || nodes.length === 0) {
      alert('Please select a flow with nodes to run');
      return;
    }

    try {
      // Update all nodes to running status
      const runningNodes = nodes.map(node => ({ ...node, status: 'running' as const }));
      setNodes(runningNodes);

      console.log('Running flow:', selectedFlow.name);
      console.log('Nodes:', nodes);
      console.log('Connections:', connections);

      // Check flow type and execute appropriate specialized flow
      const flowName = selectedFlow.name.toLowerCase();
      const flowDescription = selectedFlow.description?.toLowerCase() || '';
      
      if (flowName.includes('healthcare') || flowDescription.includes('healthcare') ||
          nodes.some(node => node.type.includes('symptom') || node.type.includes('treatment'))) {
        console.log('Executing Healthcare Flow Example...');
        await executeHealthcareFlowExample();
        console.log('Healthcare flow execution completed!');
      } else if (flowName.includes('finance') || flowDescription.includes('finance') ||
                 nodes.some(node => node.type.includes('credit') || node.type.includes('lending'))) {
        console.log('Executing Finance Flow Example...');
        await executeFinanceFlowExample();
        console.log('Finance flow execution completed!');
      } else if (flowName.includes('insurance') || flowDescription.includes('insurance') ||
                 nodes.some(node => node.type.includes('peril') || node.type.includes('underwriting'))) {
        console.log('Executing Insurance Flow Example...');
        await executeInsuranceFlowExample();
        console.log('Insurance flow execution completed!');
      } else if (flowName.includes('education') || flowDescription.includes('education') ||
                 nodes.some(node => node.type.includes('skills') || node.type.includes('learning'))) {
        console.log('Executing Education Flow Example...');
        await executeEducationFlowExample();
        console.log('Education flow execution completed!');
      } else if (flowName.includes('justice') || flowDescription.includes('justice') ||
                 nodes.some(node => node.type.includes('evidence') || node.type.includes('legal'))) {
        console.log('Executing Justice Flow Example...');
        await executeJusticeFlowExample();
        console.log('Justice flow execution completed!');
      } else {
        // Generic flow execution for other flow types
        console.log('Executing Generic Flow...');
        
        // Find starting nodes (nodes with no input connections)
        const startingNodes = nodes.filter(node => 
          !connections.some(conn => conn.targetNodeId === node.id)
        );

        console.log('Starting nodes:', startingNodes);

        // Simulate execution through the flow
        for (const startNode of startingNodes) {
          await executeNode(startNode);
        }
      }

      // Update nodes to completed status
      const completedNodes = runningNodes.map(node => ({ ...node, status: 'completed' as const }));
      setNodes(completedNodes);

      alert('Flow execution completed successfully!');
    } catch (error) {
      console.error('Flow execution failed:', error);
      
      // Update nodes to error status
      const errorNodes = nodes.map(node => ({ ...node, status: 'error' as const }));
      setNodes(errorNodes);
      
      alert('Flow execution failed. Check console for details.');
    }
  };

  // Execute individual node
  const executeNode = async (node: EnhancedFlowNode): Promise<void> => {
    console.log(`Executing node: ${node.name} (${node.type})`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find connected nodes and execute them
    const connectedNodes = connections
      .filter(conn => conn.sourceNodeId === node.id)
      .map(conn => nodes.find(n => n.id === conn.targetNodeId))
      .filter(Boolean) as EnhancedFlowNode[];

    for (const connectedNode of connectedNodes) {
      await executeNode(connectedNode);
    }
  };

  // Save Flow Handler
  const handleSaveFlow = async () => {
    if (!selectedFlow) {
      alert('No flow selected to save');
      return;
    }

    try {
      // Update the flow with current nodes and connections
      const updatedFlow = {
        ...selectedFlow,
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          config: node.config,
          position: node.position,
          createdAt: node.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          flowId: selectedFlow.id,
          agentId: node.agentId
        })),
        updatedAt: new Date().toISOString(),
        status: 'draft' as const // Keep as draft until explicitly published
      };

      // Update local state
      setSelectedFlow(updatedFlow);
      setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));

      // In a real app, this would save to the backend
      console.log('Saving flow:', updatedFlow);
      
      alert('Flow saved successfully!');
    } catch (error) {
      console.error('Failed to save flow:', error);
      alert('Failed to save flow. Check console for details.');
    }
  };

  // Publish Flow Handler
  const handlePublishFlow = async () => {
    if (!selectedFlow) {
      alert('No flow selected to publish');
      return;
    }

    try {
      const updatedFlow = {
        ...selectedFlow,
        status: 'published' as const,
        updatedAt: new Date().toISOString()
      };

      setSelectedFlow(updatedFlow);
      setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));

      console.log('Published flow:', updatedFlow);
      alert('Flow published successfully!');
    } catch (error) {
      console.error('Failed to publish flow:', error);
      alert('Failed to publish flow. Check console for details.');
    }
  };

  const handleFlowClick = (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    if (flow) {
      setSelectedFlow(flow);
    }
  };

  const handleAgentClick = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      handleAgentSelect(agent);
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar
        recentFlows={recentFlows}
        agents={availableAgents}
        onFlowClick={handleFlowClick}
        onAgentClick={handleAgentClick}
        onCreateFlow={handleCreateFlow}
        onTemplateSelect={handleTemplateSelect}
        infrastructureHealth={infrastructureHealth}
        pipelineTemplates={pipelineTemplates}
      />

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to App</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold">
                  {selectedFlow ? selectedFlow.name : 'Select a Flow'}
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedFlow ? selectedFlow.description : 'Choose a flow to start editing'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowVoicePanel(!showVoicePanel)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Bot className="w-4 h-4" />
                <span>Voice Assistant</span>
              </button>
              <button 
                onClick={() => {
                  // Center the viewport
                  const canvasElement = document.querySelector('.react-flow__viewport');
                  if (canvasElement) {
                    (canvasElement as HTMLElement).style.transform = 'translate(0px, 0px) scale(1)';
                  }
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                title="Center View"
              >
                <Settings className="w-4 h-4" />
                <span>Center</span>
              </button>
              <button 
                onClick={handleRunFlow}
                disabled={!selectedFlow || nodes.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>Run</span>
              </button>
              <button 
                onClick={handleSaveFlow}
                disabled={!selectedFlow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              {selectedFlow && selectedFlow.status === 'draft' && (
                <button 
                  onClick={handlePublishFlow}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Publish</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Enhanced Canvas */}
          <div className="flex-1">
            {selectedFlow ? (
              <div className="relative h-full">
                <EnhancedCanvas
                  nodes={nodes}
                  connections={connections}
                  onNodesChange={setNodes}
                  onConnectionsChange={setConnections}
                  onNodeSelect={handleNodeSelect}
                  selectedNode={selectedNode}
                />
                
                {/* Getting Started Guide */}
                {nodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-6 max-w-md text-center pointer-events-auto">
                      <div className="text-blue-500 mb-4">
                        <Bot className="mx-auto h-12 w-12" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Agent Studio!</h3>
                      <p className="text-gray-600 mb-4">
                        Start building your agent workflow by dragging components from the sidebar or right-clicking on the canvas.
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <p>• Drag agents from the sidebar to add them</p>
                        <p>• Right-click on canvas to add basic nodes</p>
                        <p>• Connect nodes by clicking on their ports</p>
                        <p>• Use templates for quick setup</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <Bot className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Flow Selected</h3>
                  <p className="text-gray-500 mb-4">Select a flow from the sidebar to start editing</p>
                  <button
                    onClick={() => setShowCreateFlow(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create New Flow
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Properties Panel */}
          <div className="w-80 bg-white border-l border-gray-200">
            <EnhancedPropertiesPanel
              selectedNode={selectedNode}
              connections={connections}
              onNodeUpdate={handleNodeUpdate}
              onNodeDelete={handleNodeDelete}
              onNodeDuplicate={handleNodeDuplicate}
              onConnectionDelete={handleConnectionDelete}
            />
          </div>
        </div>
      </div>

      {/* Voice Panel Modal */}
      {showVoicePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Voice Assistant</h2>
                <button
                  onClick={() => setShowVoicePanel(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <VoicePanel
                onWorkflowGenerated={(workflow) => {
                  setGeneratedWorkflow(workflow);
                  setShowWorkflowGuide(true);
                }}
                onGuidanceRequested={(guidance) => {
                  console.log('Guidance requested:', guidance);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Workflow Guide Modal */}
      {showWorkflowGuide && generatedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Workflow Implementation Guide</h2>
                <button
                  onClick={() => setShowWorkflowGuide(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <WorkflowGuide
                workflow={generatedWorkflow}
                onStepComplete={(stepId) => {
                  console.log('Step completed:', stepId);
                }}
                onWorkflowComplete={(workflow) => {
                  console.log('Workflow completed:', workflow);
                  setShowWorkflowGuide(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studio;