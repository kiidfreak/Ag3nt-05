/**
 * Workflow Guide Component
 * Provides step-by-step guidance for implementing workflows in Studio
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Circle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Code,
  Settings,
  Zap,
  AlertCircle,
  Info,
  Copy,
  Download,
  Upload
} from 'lucide-react';

interface WorkflowGuideProps {
  workflow: any;
  onStepComplete?: (stepId: string) => void;
  onWorkflowComplete?: (workflow: any) => void;
}

interface GuideStep {
  id: string;
  title: string;
  description: string;
  type: 'setup' | 'configure' | 'connect' | 'test' | 'deploy';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  instructions: string[];
  codeSnippets?: CodeSnippet[];
  resources?: Resource[];
  estimatedTime: string;
  dependencies?: string[];
}

interface CodeSnippet {
  language: string;
  code: string;
  description: string;
}

interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'example' | 'tutorial';
}

export const WorkflowGuide: React.FC<WorkflowGuideProps> = ({
  workflow,
  onStepComplete,
  onWorkflowComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<GuideStep[]>([]);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (workflow) {
      const guideSteps = generateGuideSteps(workflow);
      setSteps(guideSteps);
    }
  }, [workflow]);

  useEffect(() => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const totalSteps = steps.length;
    setProgress(totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0);
  }, [steps]);

  const generateGuideSteps = (workflow: any): GuideStep[] => {
    const steps: GuideStep[] = [];

    // Step 1: Setup
    steps.push({
      id: 'setup',
      title: 'Set up Workflow Environment',
      description: 'Initialize the workflow in Agent OS Studio',
      type: 'setup',
      status: 'pending',
      instructions: [
        'Open Agent OS Studio',
        'Create a new workflow project',
        'Select the appropriate template',
        'Configure basic workflow settings'
      ],
      codeSnippets: [
        {
          language: 'json',
          code: JSON.stringify({
            name: workflow.name,
            description: workflow.description,
            version: '1.0.0',
            category: workflow.category
          }, null, 2),
          description: 'Workflow configuration'
        }
      ],
      resources: [
        {
          title: 'Studio Documentation',
          url: 'https://docs.agentlabs.ai/studio',
          type: 'documentation'
        }
      ],
      estimatedTime: '2-3 minutes',
      dependencies: []
    });

    // Step 2: Configure Agents
    workflow.agents.forEach((agent: any, index: number) => {
      steps.push({
        id: `configure_${agent.id}`,
        title: `Configure ${agent.name}`,
        description: `Set up the ${agent.name} agent with required parameters`,
        type: 'configure',
        status: 'pending',
        instructions: [
          `Add ${agent.name} to the workflow canvas`,
          'Configure input parameters',
          'Set up output mappings',
          'Configure security settings',
          'Test agent configuration'
        ],
        codeSnippets: [
          {
            language: 'json',
            code: JSON.stringify({
              id: agent.id,
              name: agent.name,
              config: agent.config || {},
              inputs: agent.inputs || {},
              outputs: agent.outputs || {}
            }, null, 2),
            description: `${agent.name} configuration`
          }
        ],
        resources: [
          {
            title: `${agent.name} Documentation`,
            url: `https://docs.agentlabs.ai/agents/${agent.id}`,
            type: 'documentation'
          }
        ],
        estimatedTime: '3-5 minutes',
        dependencies: index === 0 ? ['setup'] : [`configure_${workflow.agents[index - 1].id}`]
      });
    });

    // Step 3: Connect Agents
    steps.push({
      id: 'connect',
      title: 'Connect Agents',
      description: 'Wire up the agents in the correct sequence',
      type: 'connect',
      status: 'pending',
      instructions: [
        'Drag connection lines between agents',
        'Configure data mappings',
        'Set up conditional logic',
        'Validate connections',
        'Test data flow'
      ],
      codeSnippets: workflow.connections?.map((conn: any) => ({
        language: 'json',
        code: JSON.stringify(conn, null, 2),
        description: `Connection: ${conn.source} → ${conn.target}`
      })) || [],
      resources: [
        {
          title: 'Workflow Connections Guide',
          url: 'https://docs.agentlabs.ai/workflows/connections',
          type: 'tutorial'
        }
      ],
      estimatedTime: '5-7 minutes',
      dependencies: workflow.agents.map((agent: any) => `configure_${agent.id}`)
    });

    // Step 4: Test Workflow
    steps.push({
      id: 'test',
      title: 'Test Workflow',
      description: 'Run the workflow with sample data to verify functionality',
      type: 'test',
      status: 'pending',
      instructions: [
        'Prepare test data',
        'Run workflow in test mode',
        'Monitor execution logs',
        'Verify outputs',
        'Debug any issues'
      ],
      codeSnippets: [
        {
          language: 'json',
          code: JSON.stringify(workflow.variables || {}, null, 2),
          description: 'Test data structure'
        }
      ],
      resources: [
        {
          title: 'Testing Guide',
          url: 'https://docs.agentlabs.ai/testing',
          type: 'tutorial'
        }
      ],
      estimatedTime: '5-10 minutes',
      dependencies: ['connect']
    });

    // Step 5: Deploy
    steps.push({
      id: 'deploy',
      title: 'Deploy Workflow',
      description: 'Deploy the workflow to production environment',
      type: 'deploy',
      status: 'pending',
      instructions: [
        'Review deployment settings',
        'Configure environment variables',
        'Set up monitoring',
        'Deploy to production',
        'Verify deployment'
      ],
      codeSnippets: [
        {
          language: 'yaml',
          code: `name: ${workflow.name}
version: 1.0.0
environment: production
monitoring:
  enabled: true
  alerts: true
  metrics: true`,
          description: 'Deployment configuration'
        }
      ],
      resources: [
        {
          title: 'Deployment Guide',
          url: 'https://docs.agentlabs.ai/deployment',
          type: 'documentation'
        }
      ],
      estimatedTime: '3-5 minutes',
      dependencies: ['test']
    });

    return steps;
  };

  const startStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'in_progress' }
        : step
    ));
  };

  const completeStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'completed' }
        : step
    ));
    
    onStepComplete?.(stepId);
    
    // Auto-advance to next step
    if (isAutoMode) {
      const currentIndex = steps.findIndex(step => step.id === stepId);
      if (currentIndex < steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(currentIndex + 1);
          startStep(steps[currentIndex + 1].id);
        }, 2000);
      } else {
        onWorkflowComplete?.(workflow);
      }
    }
  };

  const failStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'failed' }
        : step
    ));
  };

  const resetStep = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'pending' }
        : step
    ));
  };

  const getStepIcon = (step: GuideStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'setup':
        return <Settings className="w-4 h-4" />;
      case 'configure':
        return <Code className="w-4 h-4" />;
      case 'connect':
        return <ArrowRight className="w-4 h-4" />;
      case 'test':
        return <Play className="w-4 h-4" />;
      case 'deploy':
        return <Zap className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportWorkflow = () => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  if (!workflow) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflow Selected</h3>
        <p className="text-gray-500">Select a workflow to see the implementation guide</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{workflow.name}</h2>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportWorkflow}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setIsAutoMode(!isAutoMode)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded ${
                isAutoMode 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isAutoMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAutoMode ? 'Auto Mode' : 'Manual Mode'}</span>
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="p-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
                  <div className="flex items-center space-x-1 text-gray-400">
                    {getStepTypeIcon(step.type)}
                    <span className="text-xs capitalize">{step.type}</span>
                  </div>
                  <span className="text-xs text-gray-400">{step.estimatedTime}</span>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                
                {/* Instructions */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    {step.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ol>
                </div>
                
                {/* Code Snippets */}
                {step.codeSnippets && step.codeSnippets.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Code Snippets:</h4>
                    {step.codeSnippets.map((snippet, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">{snippet.language}</span>
                          <button
                            onClick={() => copyToClipboard(snippet.code)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            <Copy className="w-3 h-3 inline mr-1" />
                            Copy
                          </button>
                        </div>
                        <pre className="text-xs text-gray-800 overflow-x-auto">
                          <code>{snippet.code}</code>
                        </pre>
                        <p className="text-xs text-gray-500 mt-1">{snippet.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Resources */}
                {step.resources && step.resources.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resources:</h4>
                    <div className="space-y-1">
                      {step.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{resource.title}</span>
                          <span className="text-xs text-gray-400">({resource.type})</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {step.status === 'pending' && (
                    <button
                      onClick={() => startStep(step.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Start Step
                    </button>
                  )}
                  
                  {step.status === 'in_progress' && (
                    <>
                      <button
                        onClick={() => completeStep(step.id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => failStep(step.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Mark Failed
                      </button>
                    </>
                  )}
                  
                  {step.status === 'failed' && (
                    <button
                      onClick={() => resetStep(step.id)}
                      className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                    >
                      <RotateCcw className="w-4 h-4 inline mr-1" />
                      Retry
                    </button>
                  )}
                  
                  {step.status === 'completed' && (
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowGuide;
