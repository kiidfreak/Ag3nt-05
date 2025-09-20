/**
 * Modern Studio Page
 * Beautiful, modern interface for Agent OS Studio
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Shield, 
  Database, 
  Globe, 
  FileText,
  Settings,
  Play,
  Pause,
  Square,
  Save,
  Download,
  Upload,
  Share,
  HelpCircle,
  Menu,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Globe as GlobeIcon,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Eye,
  EyeOff,
  Grid,
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  Search,
  Filter,
  Star,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  HelpCircle as HelpIcon
} from 'lucide-react';

import NewFlowCanvas from '../components/canvas/NewFlowCanvas';
import ModernSidebar, { Agent, Template } from '../components/sidebar/ModernSidebar';
import ModernHeader from '../components/header/ModernHeader';
import VoicePanel from '../components/VoicePanel';
import WorkflowGuide from '../components/WorkflowGuide';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

// Mock data for agents and templates
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'GPT-4 Agent',
    description: 'Advanced language model for natural language processing and generation',
    category: 'ai',
    icon: <Bot className="w-4 h-4 text-purple-600" />,
    status: 'active',
    rating: 4.8,
    usage: 1250,
    lastUpdated: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Data Processor',
    description: 'Efficient data processing and transformation agent',
    category: 'data',
    icon: <Database className="w-4 h-4 text-blue-600" />,
    status: 'active',
    rating: 4.6,
    usage: 890,
    lastUpdated: new Date('2024-01-14'),
  },
  {
    id: '3',
    name: 'Security Scanner',
    description: 'Comprehensive security vulnerability scanner',
    category: 'security',
    icon: <Shield className="w-4 h-4 text-green-600" />,
    status: 'active',
    rating: 4.9,
    usage: 650,
    lastUpdated: new Date('2024-01-13'),
  },
  {
    id: '4',
    name: 'API Integrator',
    description: 'Seamless integration with external APIs and services',
    category: 'integration',
    icon: <Globe className="w-4 h-4 text-orange-600" />,
    status: 'beta',
    rating: 4.3,
    usage: 320,
    lastUpdated: new Date('2024-01-12'),
  },
  {
    id: '5',
    name: 'Workflow Engine',
    description: 'High-performance workflow execution engine',
    category: 'processing',
    icon: <Zap className="w-4 h-4 text-indigo-600" />,
    status: 'active',
    rating: 4.7,
    usage: 1100,
    lastUpdated: new Date('2024-01-11'),
  },
];

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Knowledge Pipeline',
    description: 'Research, analyze, and synthesize information from multiple sources',
    category: 'ai',
    agents: ['GPT-4 Agent', 'Data Processor', 'Security Scanner'],
    complexity: 'medium',
    estimatedTime: '5-10 min',
    rating: 4.8,
    usage: 450,
  },
  {
    id: '2',
    name: 'Finance Pipeline',
    description: 'Automated loan processing and risk assessment workflow',
    category: 'data',
    agents: ['Data Processor', 'Security Scanner', 'API Integrator'],
    complexity: 'complex',
    estimatedTime: '15-30 min',
    rating: 4.6,
    usage: 320,
  },
  {
    id: '3',
    name: 'Healthcare Pipeline',
    description: 'Patient data processing and care coordination workflow',
    category: 'security',
    agents: ['Security Scanner', 'Data Processor', 'Workflow Engine'],
    complexity: 'complex',
    estimatedTime: '10-20 min',
    rating: 4.9,
    usage: 280,
  },
  {
    id: '4',
    name: 'Developer Tools',
    description: 'Automated code review, testing, and deployment pipeline',
    category: 'processing',
    agents: ['Workflow Engine', 'API Integrator', 'Security Scanner'],
    complexity: 'medium',
    estimatedTime: '8-15 min',
    rating: 4.5,
    usage: 380,
  },
];

const ModernStudio: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [executionStep, setExecutionStep] = useState<number>(-1);
  const [executionPath, setExecutionPath] = useState<string[]>([]);
  const [currentExecutingNode, setCurrentExecutingNode] = useState<string | null>(null);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: '1',
        type: 'input',
        position: { x: 50, y: 50 },
        data: {
          name: 'Webhook Trigger',
          type: 'webhook',
          status: 'idle',
          description: 'Triggers workflow on incoming webhook',
          trigger: 'POST /webhook',
          dataFormat: 'JSON',
        },
      },
      {
        id: '2',
        type: 'agent',
        position: { x: 250, y: 50 },
        data: {
          name: 'GPT-4 Agent',
          type: 'AI Processing',
          status: 'idle',
          description: 'Processes incoming data with AI',
          category: 'ai',
          metrics: {
            cpu: 45,
            memory: 128,
            latency: 250,
            throughput: 10,
          },
        },
      },
      {
        id: '3',
        type: 'condition',
        position: { x: 450, y: 50 },
        data: {
          name: 'Quality Check',
          condition: 'data.quality > 0.8',
          status: 'idle',
          description: 'Checks data quality before processing',
          truePath: 'Continue',
          falsePath: 'Reject',
        },
      },
      {
        id: '4',
        type: 'action',
        position: { x: 250, y: 200 },
        data: {
          name: 'Save to Database',
          action: 'INSERT INTO results',
          status: 'idle',
          description: 'Saves processed data to database',
          type: 'database',
          duration: 150,
        },
      },
      {
        id: '5',
        type: 'output',
        position: { x: 450, y: 200 },
        data: {
          name: 'Send Notification',
          type: 'notification',
          status: 'idle',
          description: 'Sends completion notification',
          destination: 'user@example.com',
          dataFormat: 'Email',
        },
      },
    ];

    const initialEdges: Edge[] = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'custom',
        data: { label: 'Data', status: 'idle' },
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        type: 'custom',
        data: { label: 'Processed Data', status: 'idle' },
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        type: 'custom',
        data: { label: 'Valid Data', status: 'idle' },
      },
      {
        id: 'e4-5',
        source: '4',
        target: '5',
        type: 'custom',
        data: { label: 'Result', status: 'idle' },
      },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  // Event handlers
  const handleNodesChange = useCallback((newNodes: Node[]) => {
    setNodes(newNodes);
    setHasUnsavedChanges(true);
  }, []);

  const handleEdgesChange = useCallback((newEdges: Edge[]) => {
    setEdges(newEdges);
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    // Save workflow logic here
    setHasUnsavedChanges(false);
    setExecutionLogs(prev => [...prev, `Workflow saved at ${new Date().toLocaleTimeString()}`]);
  }, []);

  const handleRun = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setExecutionStep(-1);
      setCurrentExecutingNode(null);
      setExecutionLogs(prev => [...prev, 'Execution paused']);
    } else {
      setIsRunning(true);
      setExecutionStep(0);
      setCurrentExecutingNode(null);
      setExecutionLogs(prev => [...prev, `Workflow started at ${new Date().toLocaleTimeString()}`]);
      
      // Find execution path (topological sort of nodes)
      const executionOrder = findExecutionOrder(nodes, edges);
      setExecutionPath(executionOrder);
      
      // Start execution
      executeFlow(executionOrder, 0);
    }
  }, [isRunning, nodes, edges]);

  // Find execution order using topological sort
  const findExecutionOrder = useCallback((nodes: Node[], edges: Edge[]): string[] => {
    const nodeIds = nodes.map(n => n.id);
    const incomingEdges = new Map<string, string[]>();
    const outgoingEdges = new Map<string, string[]>();
    
    // Initialize maps
    nodeIds.forEach(id => {
      incomingEdges.set(id, []);
      outgoingEdges.set(id, []);
    });
    
    // Build adjacency lists
    edges.forEach(edge => {
      const source = edge.source;
      const target = edge.target;
      
      if (outgoingEdges.has(source)) {
        outgoingEdges.get(source)!.push(target);
      }
      if (incomingEdges.has(target)) {
        incomingEdges.get(target)!.push(source);
      }
    });
    
    // Find nodes with no incoming edges (start nodes)
    const queue = nodeIds.filter(id => incomingEdges.get(id)!.length === 0);
    const result: string[] = [];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      
      visited.add(current);
      result.push(current);
      
      // Add nodes that depend on current node
      const dependents = outgoingEdges.get(current) || [];
      dependents.forEach(dep => {
        if (!visited.has(dep)) {
          // Check if all dependencies are satisfied
          const deps = incomingEdges.get(dep) || [];
          const allDepsSatisfied = deps.every(d => result.includes(d));
          if (allDepsSatisfied && !queue.includes(dep)) {
            queue.push(dep);
          }
        }
      });
    }
    
    return result;
  }, []);

  // Execute flow step by step
  const executeFlow = useCallback((executionOrder: string[], step: number) => {
    if (step >= executionOrder.length) {
      setIsRunning(false);
      setCurrentExecutingNode(null);
      setExecutionLogs(prev => [...prev, `Workflow completed at ${new Date().toLocaleTimeString()}`]);
      return;
    }
    
    const nodeId = executionOrder[step];
    setCurrentExecutingNode(nodeId);
    setExecutionStep(step);
    
    // Update node status to running
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, status: 'running' } }
        : node
    ));
    
    setExecutionLogs(prev => [...prev, `Executing node: ${nodeId}`]);
    
    // Simulate node execution time (1-3 seconds)
    const executionTime = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      // Update node status to completed
      setNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, status: 'completed' } }
          : node
      ));
      
      setExecutionLogs(prev => [...prev, `Completed node: ${nodeId}`]);
      
      // Move to next step
      executeFlow(executionOrder, step + 1);
    }, executionTime);
  }, [setNodes]);

  const handleExport = useCallback(() => {
    const data = { nodes, edges };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    link.click();
  }, [nodes, edges]);

  const handleImport = useCallback(() => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.nodes && data.edges) {
              setNodes(data.nodes);
              setEdges(data.edges);
              setHasUnsavedChanges(true);
              setExecutionLogs(prev => [...prev, `Workflow imported at ${new Date().toLocaleTimeString()}`]);
              setExecutionLogs(prev => [...prev, `Imported ${data.nodes.length} nodes and ${data.edges.length} edges`]);
            } else {
              setExecutionLogs(prev => [...prev, `Invalid workflow file format`]);
            }
          } catch (error) {
            setExecutionLogs(prev => [...prev, `Error importing workflow: ${error}`]);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  const handleShare = useCallback(() => {
    // Share logic here
    setExecutionLogs(prev => [...prev, `Workflow shared at ${new Date().toLocaleTimeString()}`]);
  }, []);

  const handleAgentSelect = useCallback((agent: Agent) => {
    // Add agent to canvas logic here
    setExecutionLogs(prev => [...prev, `Agent ${agent.name} added to canvas`]);
  }, []);

  const handleTemplateSelect = useCallback((template: Template) => {
    // Add template to canvas logic here
    setExecutionLogs(prev => [...prev, `Template ${template.name} added to canvas`]);
  }, []);

  const handleSearch = useCallback((query: string) => {
    // Search logic here
    console.log('Searching for:', query);
  }, []);

  const handleAgentEdit = useCallback((agent: Agent) => {
    console.log('Editing agent:', agent);
    // Open agent edit modal or navigate to edit page
    alert(`Edit Agent: ${agent.name}\nDescription: ${agent.description}`);
  }, []);

  const handleTemplateEdit = useCallback((template: Template) => {
    console.log('Editing template:', template);
    // Open template edit modal or navigate to edit page
    alert(`Edit Template: ${template.name}\nDescription: ${template.description}`);
  }, []);

  const handleAgentAdd = useCallback((agent: any) => {
    console.log('Agent added to canvas:', agent);
    setExecutionLogs(prev => [...prev, `Added agent: ${agent.name}`]);
  }, []);

  const handleTemplateAdd = useCallback((template: any) => {
    console.log('Template added to canvas:', template);
    setExecutionLogs(prev => [...prev, `Added template: ${template.name}`]);
  }, []);

  const handleAgentDelete = useCallback((agent: Agent) => {
    console.log('Deleting agent:', agent);
    setExecutionLogs(prev => [...prev, `Deleted agent: ${agent.name}`]);
    // In a real app, you would remove the agent from the agents array
    // For now, we'll just show a confirmation
    if (window.confirm(`Are you sure you want to delete "${agent.name}"?`)) {
      setExecutionLogs(prev => [...prev, `Agent "${agent.name}" deleted successfully`]);
    }
  }, []);

  const handleTemplateDelete = useCallback((template: Template) => {
    console.log('Deleting template:', template);
    setExecutionLogs(prev => [...prev, `Deleted template: ${template.name}`]);
    // In a real app, you would remove the template from the templates array
    // For now, we'll just show a confirmation
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      setExecutionLogs(prev => [...prev, `Template "${template.name}" deleted successfully`]);
    }
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    console.log('Deleting node:', nodeId);
    setExecutionLogs(prev => [...prev, `Deleted node: ${nodeId}`]);
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, properties: any) => {
    console.log('Updating node:', nodeId, properties);
    setExecutionLogs(prev => [...prev, `Updated node: ${properties.name}`]);
  }, []);

  const handleCenterView = useCallback(() => {
    // Center the viewport - this will be handled by the FlowCanvas component
    console.log('Centering view...');
    // The FlowCanvas component will handle this via its fitView functionality
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <ModernHeader
        title="Agent OS Studio"
        subtitle="Build intelligent workflows with AI agents"
        onSave={handleSave}
        onRun={handleRun}
        onExport={handleExport}
        onImport={handleImport}
        onShare={handleShare}
        isRunning={isRunning}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ModernSidebar
          agents={mockAgents}
          templates={mockTemplates}
          onAgentSelect={handleAgentSelect}
          onTemplateSelect={handleTemplateSelect}
          onAgentEdit={handleAgentEdit}
          onTemplateEdit={handleTemplateEdit}
          onSearch={handleSearch}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => setShowVoicePanel(true)}
                  leftIcon={<Bot className="w-4 h-4" />}
                >
                  Voice Assistant
                </Button>
                
                <div className="w-px h-6 bg-gray-300" />
                
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  New Workflow
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Settings className="w-4 h-4" />}
                >
                  Settings
                </Button>
                
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => navigate('/sponsor-demo')}
                  leftIcon={<Globe className="w-4 h-4" />}
                >
                  Sponsor APIs
                </Button>
                
                <div className="w-px h-6 bg-gray-300" />
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCenterView}
                  leftIcon={<Maximize2 className="w-4 h-4" />}
                >
                  Center View
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {nodes.length} nodes, {edges.length} connections
                </span>
                {hasUnsavedChanges && (
                  <span className="text-xs text-orange-600 font-medium">
                    Unsaved changes
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative">
            <NewFlowCanvas
              onSave={handleSave}
              onExport={handleExport}
              onImport={handleImport}
              onShare={handleShare}
              isRunning={isRunning}
              hasUnsavedChanges={hasUnsavedChanges}
              executionLogs={executionLogs}
              onAgentAdd={handleAgentAdd}
              onTemplateAdd={handleTemplateAdd}
              onNodeDelete={handleNodeDelete}
              onNodeUpdate={handleNodeUpdate}
              executionStep={executionStep}
              executionPath={executionPath}
              currentExecutingNode={currentExecutingNode}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Voice Panel Modal */}
      <AnimatePresence>
        {showVoicePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Voice Assistant</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVoicePanel(false)}
                    className="p-2"
                  >
                    ×
                  </Button>
                </div>
                <VoicePanel
                  onWorkflowGenerated={(workflow) => {
                    setGeneratedWorkflow(workflow);
                    setShowWorkflowGuide(true);
                    setShowVoicePanel(false);
                  }}
                  onGuidanceRequested={(guidance) => {
                    console.log('Guidance requested:', guidance);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow Guide Modal */}
      <AnimatePresence>
        {showWorkflowGuide && generatedWorkflow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Workflow Implementation Guide</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWorkflowGuide(false)}
                    className="p-2"
                  >
                    ×
                  </Button>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernStudio;
