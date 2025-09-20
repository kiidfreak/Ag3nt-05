/**
 * New Flow Canvas Component
 * Clean, rebuilt implementation with all functionality
 */

import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ConnectionMode,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnSelectionChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import node components
import AgentNode from './nodes/AgentNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';
import DimensionsNode from './nodes/DimensionsNode';
import DataNode from './nodes/DataNode';
import ProcessNode from './nodes/ProcessNode';
import PositionNode from './nodes/PositionNode';
import TransformNode from './nodes/TransformNode';
import FilterNode from './nodes/FilterNode';

// Import edge components
import CustomEdge from './edges/CustomEdge';
import AnimatedEdge from './edges/AnimatedEdge';
import SelectEdge from './edges/SelectEdge';
import StraightEdge from './edges/StraightEdge';
import StepEdge from './edges/StepEdge';

// Import UI components
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { 
  Play, 
  Square, 
  Settings, 
  Trash2, 
  Save, 
  Download, 
  Upload, 
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Grid,
  Map,
  Layers,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';

// Node Types Configuration
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  condition: ConditionNode,
  action: ActionNode,
  input: InputNode,
  output: OutputNode,
  dimensions: DimensionsNode,
  data: DataNode,
  process: ProcessNode,
  position: PositionNode,
  transform: TransformNode,
  filter: FilterNode,
  // Aliases
  processor: ProcessNode,
  datastore: DataNode,
  measurement: DimensionsNode,
  coordinate: PositionNode,
  conversion: TransformNode,
  selection: FilterNode,
  default: AgentNode,
};

// Edge Types Configuration
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
  animated: AnimatedEdge,
  select: SelectEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: CustomEdge,
  smooth: CustomEdge,
  bezier: CustomEdge,
  default: CustomEdge,
};

// Example workflow data
const exampleWorkflow = {
  nodes: [
    {
      id: 'input-1',
      type: 'input',
      position: { x: 100, y: 100 },
      data: {
        name: 'User Input',
        description: 'Start of the workflow',
        status: 'idle'
      }
    },
    {
      id: 'agent-1',
      type: 'agent',
      position: { x: 300, y: 100 },
      data: {
        name: 'AI Processor',
        description: 'Processes the input data',
        status: 'idle',
        type: 'AI Agent',
        category: 'AI',
        metrics: {
          cpu: 0,
          memory: 0,
          latency: 0,
          throughput: 0
        }
      }
    },
    {
      id: 'condition-1',
      type: 'condition',
      position: { x: 500, y: 100 },
      data: {
        name: 'Decision Point',
        description: 'Makes routing decisions',
        status: 'idle',
        condition: 'if value > threshold'
      }
    },
    {
      id: 'action-1',
      type: 'action',
      position: { x: 300, y: 250 },
      data: {
        name: 'Process Data',
        description: 'Executes data processing',
        status: 'idle',
        action: 'process'
      }
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 500, y: 250 },
      data: {
        name: 'Final Result',
        description: 'Output of the workflow',
        status: 'idle'
      }
    }
  ],
  edges: [
    {
      id: 'e1',
      source: 'input-1',
      target: 'agent-1',
      type: 'custom',
      sourceHandle: '',
      targetHandle: ''
    },
    {
      id: 'e2',
      source: 'agent-1',
      target: 'condition-1',
      type: 'animated',
      sourceHandle: '',
      targetHandle: ''
    },
    {
      id: 'e3',
      source: 'condition-1',
      target: 'action-1',
      type: 'select',
      sourceHandle: '',
      targetHandle: ''
    },
    {
      id: 'e4',
      source: 'action-1',
      target: 'output-1',
      type: 'custom',
      sourceHandle: '',
      targetHandle: ''
    }
  ]
};

export interface NewFlowCanvasProps {
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onExport?: (nodes: Node[], edges: Edge[]) => void;
  onImport?: () => void;
  onShare?: (nodes: Node[], edges: Edge[]) => void;
  isRunning?: boolean;
  hasUnsavedChanges?: boolean;
  executionLogs?: string[];
  onAgentAdd?: (agent: any) => void;
  onTemplateAdd?: (template: any) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeUpdate?: (nodeId: string, properties: any) => void;
  executionStep?: number;
  executionPath?: string[];
  currentExecutingNode?: string | null;
  className?: string;
}

const NewFlowCanvasInner: React.FC<NewFlowCanvasProps> = ({
  onSave,
  onExport,
  onImport,
  onShare,
  isRunning = false,
  hasUnsavedChanges = false,
  executionLogs = [],
  onAgentAdd,
  onTemplateAdd,
  onNodeDelete,
  onNodeUpdate,
  executionStep = -1,
  executionPath = [],
  currentExecutingNode = null,
  className = '',
}) => {
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState(exampleWorkflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(exampleWorkflow.edges);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<any>(null);

  const reactFlowInstance = useReactFlow();
  const flowRef = useRef<HTMLDivElement>(null);

  // Handle node changes
  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    onNodesChange(changes);
  }, [onNodesChange]);

  // Handle edge changes
  const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  // Handle connections
  const handleConnect: OnConnect = useCallback((connection) => {
    const newEdge = {
      ...connection,
      id: `edge-${Date.now()}`,
      type: 'custom',
      animated: false,
    };
    setEdges((prev) => [...prev, newEdge]);
  }, [setEdges]);

  // Handle selection changes
  const handleSelectionChange: OnSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedNodes(nodes);
    setSelectedEdges(edges);
  }, []);

  // Handle node double-click
  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    setEditingNode(node);
    setIsPropertiesModalOpen(true);
  }, []);

  // Handle node deletion
  const handleDeleteSelected = useCallback(() => {
    if (selectedNodes.length > 0) {
      const nodeIds = selectedNodes.map(node => node.id);
      setNodes(prev => prev.filter(node => !nodeIds.includes(node.id)));
      setEdges(prev => prev.filter(edge => 
        !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
      ));
      
      nodeIds.forEach(nodeId => onNodeDelete?.(nodeId));
      setSelectedNodes([]);
    }
  }, [selectedNodes, setNodes, setEdges, onNodeDelete]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodes.length > 0) {
          event.preventDefault();
          handleDeleteSelected();
        }
      } else if (event.key === 'Enter' && selectedNodes.length === 1) {
        event.preventDefault();
        handleNodeDoubleClick({} as React.MouseEvent, selectedNodes[0]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteSelected, selectedNodes, handleNodeDoubleClick]);

  // Handle drag and drop from sidebar
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    try {
      const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const { type, data: itemData } = data;
      
      if (type === 'agent') {
        const newNode: Node = {
          id: `agent-${Date.now()}`,
          type: 'agent',
          position: { x: 100, y: 100 },
          data: {
            name: itemData.name,
            type: itemData.type || 'AI Agent',
            status: 'idle',
            description: itemData.description,
            category: itemData.category,
            metrics: {
              cpu: 0,
              memory: 0,
              latency: 0,
              throughput: 0,
            },
          },
        };
        
        setNodes(prev => [...prev, newNode]);
        onAgentAdd?.(itemData);
      } else if (type === 'template') {
        onTemplateAdd?.(itemData);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [setNodes, onAgentAdd, onTemplateAdd]);

  // Handle file import
  const handleImport = useCallback(() => {
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
              // Process edges to ensure proper handle IDs
              const processedEdges = data.edges.map((edge: any) => ({
                ...edge,
                sourceHandle: edge.sourceHandle || '',
                targetHandle: edge.targetHandle || '',
              }));
              
              setNodes(data.nodes);
              setEdges(processedEdges);
              onImport?.();
            }
          } catch (error) {
            console.error('Error importing workflow:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges, onImport]);

  // Handle export
  const handleExport = useCallback(() => {
    const data = { nodes, edges };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    link.click();
    onExport?.(nodes, edges);
  }, [nodes, edges, onExport]);

  // Handle save
  const handleSave = useCallback(() => {
    onSave?.(nodes, edges);
  }, [nodes, edges, onSave]);

  // Handle share
  const handleShare = useCallback(() => {
    onShare?.(nodes, edges);
  }, [nodes, edges, onShare]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);

  const zoomOut = useCallback(() => {
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);

  const fitView = useCallback(() => {
    reactFlowInstance.fitView();
  }, [reactFlowInstance]);

  // Update nodes when execution state changes
  useEffect(() => {
    if (executionStep >= 0 && executionPath.length > 0) {
      setNodes(prev => prev.map(node => {
        const nodeIndex = executionPath.indexOf(node.id);
        let status = 'idle';
        let executionState = 'idle';
        
        if (nodeIndex < executionStep) {
          status = 'completed';
          executionState = 'completed';
        } else if (nodeIndex === executionStep) {
          status = 'running';
          executionState = 'running';
        } else if (nodeIndex > executionStep) {
          status = 'pending';
          executionState = 'pending';
        }
        
        return {
          ...node,
          data: {
            ...node.data,
            status: status as any,
            executionState: executionState,
            isCurrentlyRunning: nodeIndex === executionStep,
            isCompleted: nodeIndex < executionStep,
            isPending: nodeIndex > executionStep,
            executionStep: executionStep,
            executionPath: executionPath
          }
        };
      }));
    } else if (executionStep === -1) {
      setNodes(prev => prev.map(node => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle',
          executionState: 'idle',
          isCurrentlyRunning: false,
          isCompleted: false,
          isPending: false,
          executionStep: -1,
          executionPath: []
        }
      })));
    }
  }, [executionStep, executionPath, setNodes]);

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Main React Flow */}
      <ReactFlow
        ref={flowRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        onSelectionChange={handleSelectionChange}
        onNodeDoubleClick={handleNodeDoubleClick}
        onMoveEnd={(event, viewport) => setZoomLevel(viewport.zoom)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        attributionPosition="bottom-left"
        className="bg-gray-50"
      >
        {/* Background */}
        <Background
          variant={showGrid ? BackgroundVariant.Dots : BackgroundVariant.Cross}
          gap={20}
          size={1}
        />

        {/* Controls */}
        <Controls />

        {/* MiniMap */}
        {showMiniMap && <MiniMap />}

        {/* Top Toolbar */}
        <Panel position="top-center" className="p-4">
          <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Play className="w-4 h-4" />}
                  onClick={() => {}}
                >
                  Run
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Square className="w-4 h-4" />}
                  onClick={() => {}}
                >
                  Stop
                </Button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Save className="w-4 h-4" />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={handleExport}
                >
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Upload className="w-4 h-4" />}
                  onClick={handleImport}
                >
                  Import
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Share2 className="w-4 h-4" />}
                  onClick={handleShare}
                >
                  Share
                </Button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Settings className="w-4 h-4" />}
                  onClick={() => {}}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={handleDeleteSelected}
                  disabled={selectedNodes.length === 0}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </Panel>

        {/* Bottom Controls */}
        <Panel position="bottom-center" className="p-4">
          <Card className="p-3 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ZoomIn className="w-4 h-4" />}
                onClick={zoomIn}
              >
                Zoom In
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ZoomOut className="w-4 h-4" />}
                onClick={zoomOut}
              >
                Zoom Out
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={fitView}
              >
                Fit View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Grid className="w-4 h-4" />}
                onClick={() => setShowGrid(!showGrid)}
              >
                Grid
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Map className="w-4 h-4" />}
                onClick={() => setShowMiniMap(!showMiniMap)}
              >
                MiniMap
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Layers className="w-4 h-4" />}
                onClick={() => setShowLayers(!showLayers)}
              >
                Layers
              </Button>
            </div>
          </Card>
        </Panel>

        {/* Status Panel */}
        <Panel position="top-right" className="p-4 mt-20">
          <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Status</span>
            </div>
            <div className="text-sm text-gray-600">
              {nodes.length} nodes, {edges.length} connections
            </div>
            {hasUnsavedChanges && (
              <div className="text-xs text-orange-600 mt-1">Unsaved changes</div>
            )}
          </Card>
        </Panel>

        {/* Execution Logs */}
        {executionLogs.length > 0 && (
          <Panel position="top-right" className="p-4 mt-32">
            <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg max-w-md max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Execution Logs</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLogs(false)}
                  className="p-1 h-6 w-6"
                >
                  <EyeOff className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {executionLogs.slice(-10).map((log, index) => (
                  <div key={index} className="text-xs text-gray-600 font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </Card>
          </Panel>
        )}

        {/* Show Logs Button */}
        {executionLogs.length > 0 && !showLogs && (
          <Panel position="top-right" className="p-4 mt-32">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowLogs(true)}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Show Logs
            </Button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

const NewFlowCanvas: React.FC<NewFlowCanvasProps> = (props) => (
  <ReactFlowProvider>
    <NewFlowCanvasInner {...props} />
  </ReactFlowProvider>
);

export default NewFlowCanvas;
