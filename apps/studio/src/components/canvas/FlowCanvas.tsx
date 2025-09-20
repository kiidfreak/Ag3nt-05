/**
 * Modern Flow Canvas Component
 * Built with React Flow for professional visual workflow editing
 */

import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  ConnectionMode,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { NodePropertiesModal, NodeProperties } from '../modals/NodePropertiesModal';
import { 
  Play, 
  Pause, 
  Square, 
  Save, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Grid,
  Layers,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  MoreHorizontal,
  Trash2
} from 'lucide-react';

// Custom Node Types
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

// Custom Edge Types
import CustomEdge from './edges/CustomEdge';
import AnimatedEdge from './edges/AnimatedEdge';
import SelectEdge from './edges/SelectEdge';
import StraightEdge from './edges/StraightEdge';
import StepEdge from './edges/StepEdge';

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
  // Common node type aliases
  processor: ProcessNode,
  datastore: DataNode,
  measurement: DimensionsNode,
  coordinate: PositionNode,
  conversion: TransformNode,
  selection: FilterNode,
  // Default fallback
  default: AgentNode,
};

// Edge Types Configuration
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
  animated: AnimatedEdge,
  select: SelectEdge,
  straight: StraightEdge,
  step: StepEdge,
  // Common edge type aliases
  smoothstep: CustomEdge,
  smooth: CustomEdge,
  bezier: CustomEdge,
  // Default fallback
  default: CustomEdge,
};

export interface FlowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onRun?: (nodes: Node[], edges: Edge[]) => void;
  isRunning?: boolean;
  executionLogs?: string[];
  className?: string;
  onAgentAdd?: (agent: any) => void;
  onTemplateAdd?: (template: any) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeUpdate?: (nodeId: string, properties: NodeProperties) => void;
  executionStep?: number;
  executionPath?: string[];
  currentExecutingNode?: string | null;
}

const FlowCanvasInner: React.FC<FlowCanvasProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  onSave,
  onRun,
  isRunning = false,
  executionLogs = [],
  className = '',
  onAgentAdd,
  onTemplateAdd,
  onNodeDelete,
  onNodeUpdate,
  executionStep = -1,
  executionPath = [],
  currentExecutingNode = null,
}) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<NodeProperties | null>(null);

  // Sync internal state with props when they change (for imports)
  React.useEffect(() => {
    if (initialNodes.length > 0) {
      console.log('FlowCanvas: Updating nodes from props:', initialNodes.length, initialNodes);
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    if (initialEdges.length > 0) {
      console.log('FlowCanvas: Updating edges from props:', initialEdges.length, initialEdges);
      // Validate edges before setting them
      const nodeIds = new Set(initialNodes.map(n => n.id));
      const validEdges = initialEdges
        .filter(edge => 
          nodeIds.has(edge.source) && nodeIds.has(edge.target)
        )
        .map(edge => ({
          ...edge,
          // Add default handle IDs if missing (React Flow uses empty string for single handles)
          sourceHandle: edge.sourceHandle || '',
          targetHandle: edge.targetHandle || '',
        }));
      
      if (validEdges.length !== initialEdges.length) {
        console.warn('FlowCanvas: Filtered out invalid edges:', 
          initialEdges.length - validEdges.length, 'invalid edges removed');
      }
      
      console.log('FlowCanvas: Processed edges with handle IDs:', validEdges);
      setEdges(validEdges);
    }
  }, [initialEdges, setEdges, initialNodes]);

  // Force re-render when nodes or edges change significantly
  React.useEffect(() => {
    console.log('FlowCanvas: Current internal state - nodes:', nodes.length, 'edges:', edges.length);
    console.log('FlowCanvas: Current nodes:', nodes);
    console.log('FlowCanvas: Current edges:', edges);
    
    // Validate edge connections
    const nodeIds = new Set(nodes.map(n => n.id));
    const invalidEdges = edges.filter(edge => 
      !nodeIds.has(edge.source) || !nodeIds.has(edge.target)
    );
    
    if (invalidEdges.length > 0) {
      console.warn('FlowCanvas: Invalid edges found:', invalidEdges);
      console.warn('Available node IDs:', Array.from(nodeIds));
    }
  }, [nodes, edges]);
  
  const reactFlowInstance = useReactFlow();
  const flowRef = useRef<HTMLDivElement>(null);

  // Fit view when nodes are loaded (only on initial load, not during execution)
  React.useEffect(() => {
    if (nodes.length > 0 && reactFlowInstance && executionStep === -1) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1 });
      }, 100);
    }
  }, [nodes.length, reactFlowInstance, executionStep]);

  // Handle node changes
  const handleNodesChange = useCallback((changes: any) => {
    console.log('FlowCanvas: Node changes detected:', changes);
    onNodesChangeInternal(changes);
    const updatedNodes = nodes.map(node => {
      const change = changes.find((c: any) => c.id === node.id);
      if (change) {
        console.log('FlowCanvas: Updating node:', node.id, 'with change:', change);
        return { ...node, ...change };
      }
      return node;
    });
    onNodesChange?.(updatedNodes);
  }, [nodes, onNodesChangeInternal, onNodesChange]);

  // Debug logging
  console.log('FlowCanvas rendering with nodes:', nodes.length, nodes);
  console.log('FlowCanvas rendering with edges:', edges.length, edges);

  // Handle edge changes
  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeInternal(changes);
    const updatedEdges = edges.map(edge => {
      const change = changes.find((c: any) => c.id === edge.id);
      if (change) {
        return { ...edge, ...change };
      }
      return edge;
    });
    onEdgesChange?.(updatedEdges);
  }, [edges, onEdgesChangeInternal, onEdgesChange]);

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'custom',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#3b82f6',
        },
        style: {
          strokeWidth: 2,
          stroke: '#3b82f6',
        },
        animated: isRunning,
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      onEdgesChange?.(addEdge(newEdge, edges));
    },
    [setEdges, edges, onEdgesChange, isRunning]
  );

  // Handle node selection
  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }: any) => {
    setSelectedNodes(selectedNodes);
    setSelectedEdges(selectedEdges);
  }, []);

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
        // Create a new agent node
        const newNode: Node = {
          id: `agent-${Date.now()}`,
          type: 'agent',
          position: { x: 100, y: 100 }, // Default position
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
        // Create nodes from template
        onTemplateAdd?.(itemData);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [setNodes, onAgentAdd, onTemplateAdd]);

  // Handle node deletion
  const handleDeleteSelected = useCallback(() => {
    if (selectedNodes.length > 0) {
      const nodeIds = selectedNodes.map(node => node.id);
      setNodes(prev => prev.filter(node => !nodeIds.includes(node.id)));
      setEdges(prev => prev.filter(edge => 
        !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
      ));
      
      // Call the delete handler for each node
      nodeIds.forEach(nodeId => onNodeDelete?.(nodeId));
      
      setSelectedNodes([]);
    }
  }, [selectedNodes, setNodes, setEdges, onNodeDelete]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodes.length > 0) {
          event.preventDefault();
          handleDeleteSelected();
        }
      } else if (event.key === 'Enter' && selectedNodes.length === 1) {
        event.preventDefault();
        handleEditNode(selectedNodes[0]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteSelected, selectedNodes]);

  // Handle node editing
  const handleEditNode = useCallback((node: Node) => {
    const nodeProperties: NodeProperties = {
      id: node.id,
      name: node.data?.name || node.id,
      type: node.type || 'agent',
      description: node.data?.description || '',
      status: node.data?.status || 'idle',
      config: node.data?.config || {},
      position: node.position,
      data: node.data || {},
    };
    
    setEditingNode(nodeProperties);
    setIsPropertiesModalOpen(true);
  }, []);

  // Handle node properties save
  const handleNodePropertiesSave = useCallback((properties: NodeProperties) => {
    setNodes(prev => prev.map(node => {
      if (node.id === properties.id) {
        return {
          ...node,
          position: properties.position,
          data: {
            ...node.data,
            name: properties.name,
            description: properties.description,
            status: properties.status,
            config: properties.config,
            ...properties.data,
          },
        };
      }
      return node;
    }));
    
    onNodeUpdate?.(properties.id, properties);
  }, [setNodes, onNodeUpdate]);

  // Handle node double-click
  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    handleEditNode(node);
  }, [handleEditNode]);

  // Update nodes when execution state changes (without changing positions)
  React.useEffect(() => {
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
          // Only update data, preserve all other properties including position
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
      // Reset all nodes to idle when execution stops
      setNodes(prev => prev.map(node => ({
        ...node,
        // Only update data, preserve all other properties including position
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

  // Add execution highlighting to nodes
  const getNodeStyle = (node: Node) => {
    const nodeIndex = executionPath.indexOf(node.id);
    const isCurrentlyRunning = nodeIndex === executionStep;
    const isCompleted = nodeIndex < executionStep;
    const isPending = nodeIndex > executionStep;
    
    let style = {};
    
    if (isCurrentlyRunning) {
      style = {
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
        transform: 'scale(1.05)',
        zIndex: 1000,
      };
    } else if (isCompleted) {
      style = {
        opacity: 0.8,
        filter: 'brightness(1.1)',
      };
    } else if (isPending) {
      style = {
        opacity: 0.6,
        filter: 'grayscale(0.3)',
      };
    }
    
    return style;
  };

  // Add execution highlighting to edges
  const getEdgeStyle = (edge: Edge) => {
    const sourceIndex = executionPath.indexOf(edge.source);
    const targetIndex = executionPath.indexOf(edge.target);
    const isInExecutionPath = sourceIndex >= 0 && targetIndex >= 0 && targetIndex === sourceIndex + 1;
    const isCompleted = sourceIndex < executionStep && targetIndex < executionStep;
    const isActive = sourceIndex === executionStep - 1 && targetIndex === executionStep;
    
    let style: any = {
      stroke: '#94a3b8', // Default gray color
      strokeWidth: 2,
      strokeDasharray: 'none',
    };
    
    if (isActive) {
      style = {
        stroke: '#3b82f6',
        strokeWidth: 3,
        strokeDasharray: '5,5',
        animation: 'dash 1s linear infinite',
      };
    } else if (isCompleted && isInExecutionPath) {
      style = {
        stroke: '#10b981',
        strokeWidth: 2,
        strokeDasharray: 'none',
      };
    } else if (isInExecutionPath) {
      style = {
        stroke: '#6b7280',
        strokeWidth: 1,
        opacity: 0.5,
        strokeDasharray: 'none',
      };
    }
    
    return style;
  };

  // Handle zoom changes - now handled by onMoveEnd

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

  // Save and run handlers
  const handleSave = useCallback(() => {
    onSave?.(nodes, edges);
  }, [nodes, edges, onSave]);

  const handleRun = useCallback(() => {
    onRun?.(nodes, edges);
  }, [nodes, edges, onRun]);

  // Export/Import handlers
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

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        } catch (error) {
          console.error('Error importing workflow:', error);
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges]);

  // Execution status
  const executionStatus = useMemo(() => {
    if (isRunning) {
      return { status: 'running', color: 'text-blue-600', icon: Activity };
    }
    return { status: 'idle', color: 'text-gray-600', icon: Clock };
  }, [isRunning]);

  const StatusIcon = executionStatus.icon;

  return (
    <div className={`relative w-full h-full bg-gray-50 ${className}`}>
      {/* CSS for edge animations */}
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -10;
            }
          }
        `}
      </style>
      
      {/* Top Toolbar */}
      <Panel position="top-left" className="flex items-center gap-2 p-4">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <Button
            variant={isRunning ? 'warning' : 'success'}
            size="sm"
            onClick={handleRun}
            leftIcon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isRunning ? 'Pause' : 'Run'}
          </Button>
          
          <Button
            variant="error"
            size="sm"
            onClick={() => {/* Stop execution */}}
            leftIcon={<Square className="w-4 h-4" />}
          >
            Stop
          </Button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => selectedNodes.length === 1 && handleEditNode(selectedNodes[0])}
            disabled={selectedNodes.length !== 1}
            leftIcon={<Settings className="w-4 h-4" />}
            title={selectedNodes.length === 1 ? 'Edit selected node' : 'Select a single node to edit'}
          >
            Edit
          </Button>
          
          <Button
            variant="error"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedNodes.length === 0}
            leftIcon={<Trash2 className="w-4 h-4" />}
            title={selectedNodes.length > 0 ? `Delete ${selectedNodes.length} selected node${selectedNodes.length > 1 ? 's' : ''}` : 'Select nodes to delete'}
          >
            Delete
          </Button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
          
          <label className="cursor-pointer">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors">
              <Upload className="w-4 h-4" />
              Import
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </Panel>

      {/* Top Right Status */}
      <Panel position="top-right" className="p-4">
        <Card variant="elevated" className="p-3">
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-5 h-5 ${executionStatus.color}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isRunning ? 'Running' : 'Idle'}
              </p>
              <p className="text-xs text-gray-500">
                {nodes.length} nodes, {edges.length} connections
              </p>
            </div>
          </div>
        </Card>
      </Panel>

      {/* Bottom Left Controls */}
      <Panel position="bottom-left" className="p-4">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomIn}
            leftIcon={<ZoomIn className="w-4 h-4" />}
          >
            Zoom In
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={zoomOut}
            leftIcon={<ZoomOut className="w-4 h-4" />}
          >
            Zoom Out
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={fitView}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Fit View
          </Button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <Button
            variant={showGrid ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            leftIcon={<Grid className="w-4 h-4" />}
          >
            Grid
          </Button>
          
          <Button
            variant={showMiniMap ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setShowMiniMap(!showMiniMap)}
            leftIcon={showMiniMap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          >
            MiniMap
          </Button>
          
          <Button
            variant={showLayers ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setShowLayers(!showLayers)}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            Layers
          </Button>
        </div>
      </Panel>

      {/* Bottom Right Zoom Level */}
      <Panel position="bottom-right" className="p-4">
        <Card variant="elevated" className="p-2">
          <p className="text-xs text-gray-600">
            {Math.round(zoomLevel * 100)}%
          </p>
        </Card>
      </Panel>

      {/* Main React Flow */}
      <ReactFlow
        ref={flowRef}
        nodes={nodes.map(node => ({
          ...node,
          draggable: true,
          style: {
            ...node.style,
            ...getNodeStyle(node),
            transition: 'all 0.3s ease-in-out',
          }
        }))}
        edges={edges.map(edge => ({
          ...edge,
          style: {
            ...edge.style,
            ...getEdgeStyle(edge),
            transition: 'all 0.3s ease-in-out',
          }
        }))}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
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
          color="#e5e7eb"
        />
        
        {/* Controls */}
        <Controls
          position="bottom-left"
          showZoom={false}
          showFitView={false}
          showInteractive={false}
        />
        
        {/* Mini Map */}
        {showMiniMap && (
          <MiniMap
            position="bottom-right"
            nodeColor={(node) => {
              switch (node.type) {
                case 'agent': return '#3b82f6';
                case 'condition': return '#f59e0b';
                case 'action': return '#10b981';
                case 'input': return '#8b5cf6';
                case 'output': return '#ef4444';
                default: return '#6b7280';
              }
            }}
            nodeStrokeWidth={3}
            nodeBorderRadius={8}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        )}
      </ReactFlow>

      {/* Execution Logs Panel - Right Side Below Status */}
      {executionLogs.length > 0 && showLogs && (
        <Panel position="top-right" className="p-4 mt-32">
          <Card variant="elevated" className="max-w-md max-h-48 overflow-y-auto">
            <div className="p-3">
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
            </div>
          </Card>
        </Panel>
      )}

      {/* Show Logs Button - When logs are hidden */}
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

      {/* Execution Progress */}
      {isRunning && executionPath.length > 0 && (
        <Panel position="top-center" className="p-4">
          <Card variant="elevated" className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="text-sm font-medium text-gray-900">
                  Executing Step {executionStep + 1} of {executionPath.length}
                </span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((executionStep + 1) / executionPath.length) * 100}%` }}
                />
              </div>
              {currentExecutingNode && (
                <span className="text-xs text-gray-600">
                  Running: {currentExecutingNode}
                </span>
              )}
            </div>
          </Card>
        </Panel>
      )}

      {/* Selection Info */}
      {selectedNodes.length > 0 && !isRunning && (
        <Panel position="top-center" className="p-4">
          <Card variant="elevated" className="p-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-900">
                {selectedNodes.length} node{selectedNodes.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Press</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd>
                <span>to edit,</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Delete</kbd>
                <span>to delete</span>
              </div>
            </div>
          </Card>
        </Panel>
      )}

      {/* Node Properties Modal */}
      <NodePropertiesModal
        isOpen={isPropertiesModalOpen}
        onClose={() => {
          setIsPropertiesModalOpen(false);
          setEditingNode(null);
        }}
        onSave={handleNodePropertiesSave}
        node={editingNode}
      />
    </div>
  );
};

// Wrapper with ReactFlowProvider
export const FlowCanvas: React.FC<FlowCanvasProps> = (props) => (
  <ReactFlowProvider>
    <FlowCanvasInner {...props} />
  </ReactFlowProvider>
);

export default FlowCanvas;
