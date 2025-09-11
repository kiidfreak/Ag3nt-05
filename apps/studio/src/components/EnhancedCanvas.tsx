import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Bot, 
  Zap, 
  Settings, 
  ArrowRight, 
  Trash2, 
  Edit3, 
  Copy, 
  Link, 
  Unlink,
  MoreVertical,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Code,
  Database,
  Webhook,
  Shield,
  Coins,
  MessageSquare
} from 'lucide-react';

// Types
interface Position {
  x: number;
  y: number;
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

interface FlowNode {
  id: string;
  type: 'input' | 'agent' | 'condition' | 'action' | 'output' | 
        'collector' | 'synthesizer' | 'scorer' | 'auditor' | 'orchestrator' |
        'intake-collector' | 'symptom-synthesizer' | 'memory-synthesizer' | 'skills-synthesizer' |
        'risk-scorer' | 'peril-scorer' | 'fairness-auditor' | 'bias-auditor' |
        'treatment-orchestrator' | 'decision-orchestrator' | 'data-harvester' |
        'evidence-collector' | 'recommendation-engine';
  name: string;
  position: Position;
  config: any;
  ports: Port[];
  status: 'idle' | 'running' | 'completed' | 'error';
  agentId?: string;
}

interface ContextMenu {
  x: number;
  y: number;
  nodeId?: string;
  connectionId?: string;
  type: 'node' | 'connection' | 'canvas';
}

interface EnhancedCanvasProps {
  nodes: FlowNode[];
  connections: Connection[];
  onNodesChange: (nodes: FlowNode[]) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  onNodeSelect: (node: FlowNode | null) => void;
  selectedNode: FlowNode | null;
}

const EnhancedCanvas: React.FC<EnhancedCanvasProps> = React.memo(({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
  onNodeSelect,
  selectedNode
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [connecting, setConnecting] = useState<{
    sourceNodeId: string;
    sourcePortId: string;
  } | null>(null);
  const [hoveredPort, setHoveredPort] = useState<{
    nodeId: string;
    portId: string;
  } | null>(null);

  // Canvas pan and zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState<Position>({ x: 0, y: 0 });
  const [panThreshold, setPanThreshold] = useState(5); // Minimum distance to start panning

  // Component type configurations
  const componentConfigs = {
    input: {
      icon: ArrowRight,
      color: 'bg-green-100 text-green-600 border-green-200',
      ports: [
        { id: 'output', type: 'output' as const, dataType: 'any' as const, label: 'Data' }
      ]
    },
    agent: {
      icon: Bot,
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Input', required: true },
        { id: 'output', type: 'output' as const, dataType: 'any' as const, label: 'Output' }
      ]
    },
    // New agent types from our 3-layer architecture
    collector: {
      icon: Database,
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Data Source', required: true },
        { id: 'output', type: 'output' as const, dataType: 'any' as const, label: 'Collected Data' }
      ]
    },
    synthesizer: {
      icon: Bot,
      color: 'bg-purple-100 text-purple-600 border-purple-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Raw Data', required: true },
        { id: 'output', type: 'output' as const, dataType: 'any' as const, label: 'Synthesized Data' }
      ]
    },
    scorer: {
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Data to Score', required: true },
        { id: 'output', type: 'output' as const, dataType: 'any' as const, label: 'Score' }
      ]
    },
    auditor: {
      icon: Shield,
      color: 'bg-red-100 text-red-600 border-red-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Data to Audit', required: true },
        { id: 'output', type: 'output' as const, dataType: 'any' as const, label: 'Audit Results' }
      ]
    },
    orchestrator: {
      icon: Settings,
      color: 'bg-green-100 text-green-600 border-green-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Input Data', required: true },
        { id: 'output', type: 'output' as const, dataType: 'any' as const, label: 'Decision' }
      ]
    },
    condition: {
      icon: Settings,
      color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Input', required: true },
        { id: 'true', type: 'output' as const, dataType: 'any' as const, label: 'True' },
        { id: 'false', type: 'output' as const, dataType: 'any' as const, label: 'False' }
      ]
    },
    action: {
      icon: Zap,
      color: 'bg-purple-100 text-purple-600 border-purple-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Input', required: true },
        { id: 'output', type: 'output' as const, dataType: 'any' as const, label: 'Result' }
      ]
    },
    output: {
      icon: ArrowRight,
      color: 'bg-red-100 text-red-600 border-red-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Data', required: true }
      ]
    },
    
    // Template-specific node types
    'intake-collector': {
      icon: Database,
      color: 'bg-green-100 text-green-600 border-green-200',
      ports: [
        { id: 'trigger', type: 'input' as const, dataType: 'trigger' as const, label: 'Trigger', required: true },
        { id: 'data', type: 'output' as const, dataType: 'structured-data' as const, label: 'Collected Data' }
      ]
    },
    'symptom-synthesizer': {
      icon: Bot,
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Input Data', required: true },
        { id: 'output', type: 'output' as const, dataType: 'analysis' as const, label: 'Analysis' }
      ]
    },
    'memory-synthesizer': {
      icon: Bot,
      color: 'bg-purple-100 text-purple-600 border-purple-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Input Data', required: true },
        { id: 'output', type: 'output' as const, dataType: 'analysis' as const, label: 'Analysis' }
      ]
    },
    'skills-synthesizer': {
      icon: Bot,
      color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'any' as const, label: 'Input Data', required: true },
        { id: 'output', type: 'output' as const, dataType: 'analysis' as const, label: 'Analysis' }
      ]
    },
    'risk-scorer': {
      icon: Zap,
      color: 'bg-orange-100 text-orange-600 border-orange-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'risk-factors' as const, label: 'Risk Factors', required: true },
        { id: 'output', type: 'output' as const, dataType: 'risk-score' as const, label: 'Risk Score' }
      ]
    },
    'peril-scorer': {
      icon: Zap,
      color: 'bg-red-100 text-red-600 border-red-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'risk-factors' as const, label: 'Risk Factors', required: true },
        { id: 'output', type: 'output' as const, dataType: 'risk-score' as const, label: 'Risk Score' }
      ]
    },
    'fairness-auditor': {
      icon: Shield,
      color: 'bg-pink-100 text-pink-600 border-pink-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'decision-data' as const, label: 'Decision Data', required: true },
        { id: 'output', type: 'output' as const, dataType: 'fairness-report' as const, label: 'Fairness Report' }
      ]
    },
    'bias-auditor': {
      icon: Shield,
      color: 'bg-rose-100 text-rose-600 border-rose-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'decision-data' as const, label: 'Decision Data', required: true },
        { id: 'output', type: 'output' as const, dataType: 'fairness-report' as const, label: 'Fairness Report' }
      ]
    },
    'treatment-orchestrator': {
      icon: Settings,
      color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'analysis-data' as const, label: 'Analysis', required: true },
        { id: 'output', type: 'output' as const, dataType: 'decision' as const, label: 'Decision' }
      ]
    },
    'decision-orchestrator': {
      icon: Settings,
      color: 'bg-teal-100 text-teal-600 border-teal-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'analysis-data' as const, label: 'Analysis', required: true },
        { id: 'output', type: 'output' as const, dataType: 'decision' as const, label: 'Decision' }
      ]
    },
    'data-harvester': {
      icon: Database,
      color: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      ports: [
        { id: 'trigger', type: 'input' as const, dataType: 'application-trigger' as const, label: 'Application', required: true },
        { id: 'data', type: 'output' as const, dataType: 'unstructured-data' as const, label: 'Harvested Data' }
      ]
    },
    'evidence-collector': {
      icon: Database,
      color: 'bg-amber-100 text-amber-600 border-amber-200',
      ports: [
        { id: 'trigger', type: 'input' as const, dataType: 'case-trigger' as const, label: 'Case', required: true },
        { id: 'evidence', type: 'output' as const, dataType: 'evidence-bundle' as const, label: 'Evidence Bundle' }
      ]
    },
    'recommendation-engine': {
      icon: Bot,
      color: 'bg-violet-100 text-violet-600 border-violet-200',
      ports: [
        { id: 'input', type: 'input' as const, dataType: 'user-profile' as const, label: 'User Profile', required: true },
        { id: 'output', type: 'output' as const, dataType: 'recommendations' as const, label: 'Recommendations' }
      ]
    }
  };

  // Platform-specific tools
  const platformTools = {
    agent: [
      { icon: Code, label: 'Edit Code', action: 'edit-code' },
      { icon: Database, label: 'Configure Data', action: 'configure-data' },
      { icon: Webhook, label: 'Add Webhook', action: 'add-webhook' },
      { icon: Shield, label: 'Security Settings', action: 'security' },
      { icon: Coins, label: 'Payment Settings', action: 'payment' },
      { icon: MessageSquare, label: 'Chat Integration', action: 'chat' }
    ],
    condition: [
      { icon: Settings, label: 'Edit Logic', action: 'edit-logic' },
      { icon: Code, label: 'Custom Script', action: 'custom-script' },
      { icon: Database, label: 'Data Validation', action: 'data-validation' }
    ],
    action: [
      { icon: Zap, label: 'Configure Action', action: 'configure-action' },
      { icon: Webhook, label: 'API Call', action: 'api-call' },
      { icon: Database, label: 'Database Query', action: 'db-query' },
      { icon: ExternalLink, label: 'External Service', action: 'external-service' }
    ]
  };

  // Handle node drag start
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't start node dragging if we're already panning
    if (isPanning) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - offsetX;
      const y = e.clientY - canvasRect.top - offsetY;

      const updatedNodes = nodes.map(n =>
        n.id === nodeId
          ? { ...n, position: { x: Math.max(0, x), y: Math.max(0, y) } }
          : n
      );
      onNodesChange(updatedNodes);
    };

    const handleMouseUp = () => {
      setDraggedNode(null);
      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [nodes, onNodesChange, isPanning]);

  // Handle canvas pan and zoom
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 2) { // Left or Right mouse button
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setLastPan(pan);
    }
  }, [pan]);

  // Handle drag over for dropping elements
  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // Handle drop to add new elements
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!dragData || !dragData.type) return;

      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const x = (e.clientX - canvasRect.left - pan.x) / zoom;
      const y = (e.clientY - canvasRect.top - pan.y) / zoom;

      // Handle template drops differently
      if (dragData.type === 'template') {
        console.log('Adding pipeline template:', dragData.template);
        // For templates, we should trigger the template selection handler
        // This will be handled by the parent component (Studio.tsx)
        // We'll emit a custom event or use a callback
        const templateEvent = new CustomEvent('templateDrop', {
          detail: { template: dragData.template, position: { x, y } }
        });
        window.dispatchEvent(templateEvent);
        return;
      }

      // Validate node type for regular elements
      if (!componentConfigs[dragData.type]) {
        console.warn(`Invalid node type: ${dragData.type}`);
        return;
      }

      // Create new node with default name
      const nodeId = `node-${Date.now()}`;
      const defaultNames = {
        input: 'Data Input',
        agent: 'AI Agent',
        condition: 'Condition Check',
        action: 'Action Step',
        output: 'Data Output',
        collector: 'Data Collector',
        synthesizer: 'Data Synthesizer',
        scorer: 'Data Scorer',
        auditor: 'Data Auditor',
        orchestrator: 'Workflow Orchestrator'
      };

      const newNode: FlowNode = {
        id: nodeId,
        type: dragData.type,
        name: defaultNames[dragData.type as keyof typeof defaultNames] || dragData.name || 'New Element',
        position: { x: Math.max(0, x - 70), y: Math.max(0, y - 40) }, // Center the node
        config: {
          name: defaultNames[dragData.type as keyof typeof defaultNames] || dragData.name || 'New Element',
          ...dragData.config
        },
        ports: componentConfigs[dragData.type].ports,
        status: 'idle',
        agentId: dragData.agentId
      };

      onNodesChange([...nodes, newNode]);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [nodes, onNodesChange, pan, zoom, componentConfigs]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setPan({
        x: lastPan.x + deltaX,
        y: lastPan.y + deltaY
      });
    } else if (panStart.x !== 0 || panStart.y !== 0) {
      // Check if we've moved enough to start panning
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > panThreshold) {
        setIsPanning(true);
      }
    }
  }, [isPanning, panStart, lastPan, panThreshold]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
    setPanStart({ x: 0, y: 0 });
  }, []);

  const handleCanvasWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * delta));
    setZoom(newZoom);
  }, [zoom]);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, nodeId?: string, connectionId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId,
      connectionId,
      type: nodeId ? 'node' : connectionId ? 'connection' : 'canvas'
    });
  }, []);

  // Handle port click for connections
  const handlePortClick = useCallback((e: React.MouseEvent, nodeId: string, portId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const port = node.ports.find(p => p.id === portId);
    if (!port) return;

    // If we're not connecting, start a connection from an output port
    if (!connecting) {
      if (port.type === 'output') {
        setConnecting({ sourceNodeId: nodeId, sourcePortId: portId });
      }
      return;
    }

    // If we're connecting, complete the connection to an input port
    if (connecting && port.type === 'input' && nodeId !== connecting.sourceNodeId) {
      // Check if connection already exists
      const existingConnection = connections.find(conn => 
        conn.sourceNodeId === connecting.sourceNodeId && 
        conn.sourcePortId === connecting.sourcePortId &&
        conn.targetNodeId === nodeId &&
        conn.targetPortId === portId
      );

      if (!existingConnection) {
        // Create new connection
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          sourceNodeId: connecting.sourceNodeId,
          sourcePortId: connecting.sourcePortId,
          targetNodeId: nodeId,
          targetPortId: portId,
          type: 'data',
          status: 'connected'
        };

        // Connection created successfully
        
        onConnectionsChange([...connections, newConnection]);
      } else {
        // Connection already exists, skipping
      }
    }

    // Reset connection state
    setConnecting(null);
  }, [connecting, nodes, connections, onConnectionsChange]);

  // Cancel connection on canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (connecting) {
      setConnecting(null);
    }
  }, [connecting]);

  // Handle context menu actions
  const handleContextMenuAction = useCallback((action: string, nodeId?: string, connectionId?: string) => {
    setContextMenu(null);
    
    switch (action) {
      case 'edit-properties':
        if (nodeId) {
          const node = nodes.find(n => n.id === nodeId);
          if (node) onNodeSelect(node);
        }
        break;
      case 'delete':
        if (nodeId) {
          const updatedNodes = nodes.filter(n => n.id !== nodeId);
          const updatedConnections = connections.filter(c => 
            c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId
          );
          onNodesChange(updatedNodes);
          onConnectionsChange(updatedConnections);
        } else if (connectionId) {
          const updatedConnections = connections.filter(c => c.id !== connectionId);
          onConnectionsChange(updatedConnections);
        }
        break;
      case 'duplicate':
        if (nodeId) {
          const node = nodes.find(n => n.id === nodeId);
          if (node) {
            const newNode: FlowNode = {
              ...node,
              id: `node-${Date.now()}`,
              position: { x: node.position.x + 50, y: node.position.y + 50 }
            };
            onNodesChange([...nodes, newNode]);
          }
        }
        break;
      case 'disconnect':
        if (connectionId) {
          const updatedConnections = connections.filter(c => c.id !== connectionId);
          onConnectionsChange(updatedConnections);
        }
        break;
      // Add element actions
      case 'add-input':
      case 'add-agent':
      case 'add-condition':
      case 'add-action':
      case 'add-output':
        // Add new element with default name
        const elementType = action.replace('add-', '');
        
        // Validate element type
        if (!componentConfigs[elementType]) {
          console.warn(`Invalid element type: ${elementType}`);
          return;
        }
        
        const defaultNames = {
          input: 'Data Input',
          agent: 'AI Agent',
          condition: 'Condition Check',
          action: 'Action Step',
          output: 'Data Output'
        };
        
        const newNode: FlowNode = {
          id: `node-${Date.now()}`,
          type: elementType as any,
          name: defaultNames[elementType as keyof typeof defaultNames] || 'New Element',
          position: { x: 200, y: 200 }, // Default position
          config: {
            name: defaultNames[elementType as keyof typeof defaultNames] || 'New Element'
          },
          ports: componentConfigs[elementType].ports,
          status: 'idle'
        };
        
        onNodesChange([...nodes, newNode]);
        break;
      // Platform-specific actions
      case 'edit-code':
      case 'configure-data':
      case 'add-webhook':
      case 'security':
      case 'payment':
      case 'chat':
      case 'edit-logic':
      case 'custom-script':
      case 'data-validation':
      case 'configure-action':
      case 'api-call':
      case 'db-query':
      case 'external-service':
        console.log(`Platform action: ${action} for node: ${nodeId}`);
        // These would open specific configuration modals
        break;
    }
  }, [nodes, connections, onNodesChange, onConnectionsChange, onNodeSelect]);

  // Render connection line
  const renderConnection = useCallback((connection: Connection) => {
    const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
    const targetNode = nodes.find(n => n.id === connection.targetNodeId);
    
    if (!sourceNode || !targetNode) return null;

    const sourcePort = sourceNode.ports.find(p => p.id === connection.sourcePortId);
    const targetPort = targetNode.ports.find(p => p.id === connection.targetPortId);
    
    if (!sourcePort || !targetPort) return null;

    // Calculate port positions (more accurate)
    const sourceX = sourceNode.position.x + 140; // Right side of node (140px width)
    const sourceY = sourceNode.position.y + 40; // Middle of node (80px height)
    const targetX = targetNode.position.x; // Left side of node
    const targetY = targetNode.position.y + 40; // Middle of node

    // Create a more visible curved path
    const controlPointX = (sourceX + targetX) / 2;
    const controlPointY = Math.min(sourceY, targetY) - 50; // Curve upward
    const path = `M ${sourceX} ${sourceY} Q ${controlPointX} ${controlPointY} ${targetX} ${targetY}`;

    return (
      <path
        key={connection.id}
        d={path}
        stroke={connection.status === 'error' ? '#ef4444' : '#3b82f6'}
        strokeWidth="3"
        fill="none"
        markerEnd="url(#arrowhead)"
        className="cursor-pointer hover:stroke-blue-700 transition-colors duration-200"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }}
        onContextMenu={(e) => handleContextMenu(e, undefined, connection.id)}
      />
    );
  }, [nodes, handleContextMenu]);

  // Render port
  const renderPort = useCallback((node: FlowNode, port: Port) => {
    const isHovered = hoveredPort?.nodeId === node.id && hoveredPort?.portId === port.id;
    const isConnecting = connecting?.sourceNodeId === node.id && connecting?.sourcePortId === port.id;
    const canConnect = connecting ? 
      (port.type === 'input' && node.id !== connecting.sourceNodeId) : 
      (port.type === 'output');
    
    // Count connections for this port
    const connectionCount = connections.filter(conn => 
      (port.type === 'input' && conn.targetNodeId === node.id && conn.targetPortId === port.id) ||
      (port.type === 'output' && conn.sourceNodeId === node.id && conn.sourcePortId === port.id)
    ).length;
    
    // Multiple connections are allowed for branching workflows
    
    return (
      <div
        key={port.id}
        className={`absolute w-4 h-4 rounded-full border-2 cursor-pointer transition-all ${
          port.type === 'input' 
            ? 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2' 
            : 'right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2'
        } ${
          port.type === 'input' 
            ? 'bg-green-500 border-green-600 hover:bg-green-600' 
            : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
        } ${
          isHovered ? 'scale-125' : ''
        } ${
          isConnecting ? 'ring-2 ring-blue-400' : ''
        } ${
          canConnect ? 'hover:ring-2 hover:ring-yellow-400' : ''
        }`}
        onClick={(e) => handlePortClick(e, node.id, port.id)}
        onMouseEnter={() => setHoveredPort({ nodeId: node.id, portId: port.id })}
        onMouseLeave={() => setHoveredPort(null)}
        title={`${port.label} (${port.dataType}) - ${connectionCount} connection${connectionCount !== 1 ? 's' : ''} - Click to ${connecting ? 'connect' : 'start connection'}`}
      >
        {/* Connection count indicator */}
        {connectionCount > 0 && (
          <div 
            key={`badge-${node.id}-${port.id}`}
            className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center ${
              port.type === 'input' ? 'bg-green-700' : 'bg-blue-700'
            } text-white font-bold shadow-sm border border-white`}
            style={{ 
              fontSize: '10px',
              lineHeight: '1',
              minWidth: '16px',
              minHeight: '16px'
            }}
          >
            {connectionCount > 9 ? '9+' : connectionCount}
          </div>
        )}
      </div>
    );
  }, [hoveredPort, connecting, handlePortClick, connections]);

  // Render node
  const renderNode = useCallback((node: FlowNode) => {
    const config = componentConfigs[node.type] || componentConfigs.agent; // Fallback to agent config
    if (!config) {
      console.warn(`No config found for node type: ${node.type}`, node);
      return null;
    }
    const Icon = config.icon;
    const isSelected = selectedNode?.id === node.id;
    const isDragging = draggedNode === node.id;

    return (
      <div
        key={node.id}
        className={`absolute cursor-move select-none ${isDragging ? 'z-50' : 'z-10'}`}
        style={{
          left: node.position.x,
          top: node.position.y,
        }}
        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
        onContextMenu={(e) => handleContextMenu(e, node.id)}
        onClick={(e) => {
          e.stopPropagation();
          onNodeSelect(node);
        }}
      >
        <div className={`bg-white border-2 rounded-lg p-3 shadow-sm hover:shadow-md transition-all min-w-[140px] ${
          isSelected ? 'border-blue-500 shadow-lg' : config.color.split(' ')[2]
        }`}>
          {/* Node header */}
          <div className="flex items-center justify-between mb-2">
            <div className={`p-1 rounded ${config.color.split(' ')[0]} ${config.color.split(' ')[1]}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                node.status === 'running' ? 'bg-yellow-500 animate-pulse' :
                node.status === 'completed' ? 'bg-green-500' :
                node.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleContextMenu(e, node.id);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Node content */}
          <h4 className="text-sm font-medium text-gray-900 mb-1">{node.name}</h4>
          <p className="text-xs text-gray-500 capitalize">{node.type}</p>
          
          {/* Ports */}
          {node.ports.map(port => renderPort(node, port))}
        </div>
      </div>
    );
  }, [
    selectedNode, 
    draggedNode, 
    handleNodeMouseDown, 
    handleContextMenu, 
    onNodeSelect, 
    renderPort
  ]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-50">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative overflow-hidden"
        onContextMenu={(e) => handleContextMenu(e)}
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={handleCanvasWheel}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
              <marker
                id="arrowhead"
                markerWidth="12"
                markerHeight="8"
                refX="11"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 12 4, 0 8"
                  fill="#3b82f6"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
              </marker>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Transform container for pan and zoom */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            zIndex: 10
          }}
        >
          {/* Nodes - rendered first so they appear behind connections */}
          {nodes.map(renderNode)}

          {/* Connections - rendered after nodes so they appear on top */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
            {connections.map(connection => renderConnection(connection))}
          </svg>
        </div>

        {/* Connection preview */}
        {connecting && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Click on input ports to create connections (multiple connections allowed)
            </div>
            <div className="absolute top-12 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs">
              💡 Tip: You can connect one output to multiple inputs for branching workflows
            </div>
          </div>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-2 z-20">
        {isPanning && (
          <div className="text-xs text-blue-600 font-medium mr-2">
            Panning
          </div>
        )}
        <button
          onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
          className="p-1 hover:bg-gray-100 rounded"
          title="Zoom Out"
        >
          <span className="text-sm font-bold">-</span>
        </button>
        <span className="text-sm text-gray-600 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
          className="p-1 hover:bg-gray-100 rounded"
          title="Zoom In"
        >
          <span className="text-sm font-bold">+</span>
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="p-1 hover:bg-gray-100 rounded text-xs"
          title="Reset View"
        >
          Reset
        </button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[200px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          {contextMenu.type === 'node' && contextMenu.nodeId && (
            <>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('edit-properties', contextMenu.nodeId)}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Properties</span>
              </button>
              
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('duplicate', contextMenu.nodeId)}
              >
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
              
              <div className="border-t border-gray-200 my-1" />
              
              {/* Platform-specific tools */}
              {(() => {
                const node = nodes.find(n => n.id === contextMenu.nodeId);
                if (!node) return null;
                
                const tools = platformTools[node.type as keyof typeof platformTools] || [];
                return tools.map(tool => (
                  <button
                    key={tool.action}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => handleContextMenuAction(tool.action, contextMenu.nodeId)}
                  >
                    <tool.icon className="w-4 h-4" />
                    <span>{tool.label}</span>
                  </button>
                ));
              })()}
              
              <div className="border-t border-gray-200 my-1" />
              
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-100 text-red-600 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('delete', contextMenu.nodeId)}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>
          )}
          
          {contextMenu.type === 'connection' && contextMenu.connectionId && (
            <>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('disconnect', undefined, contextMenu.connectionId)}
              >
                <Unlink className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
              
              <div className="border-t border-gray-200 my-1" />
              
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-100 text-red-600 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('delete', undefined, contextMenu.connectionId)}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>
          )}
          
          {contextMenu.type === 'canvas' && (
            <>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('add-input')}
              >
                <ArrowRight className="w-4 h-4" />
                <span>Add Input</span>
              </button>
              
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('add-agent')}
              >
                <Bot className="w-4 h-4" />
                <span>Add Agent</span>
              </button>
              
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('add-condition')}
              >
                <Settings className="w-4 h-4" />
                <span>Add Condition</span>
              </button>
              
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('add-action')}
              >
                <Zap className="w-4 h-4" />
                <span>Add Action</span>
              </button>
              
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleContextMenuAction('add-output')}
              >
                <ArrowRight className="w-4 h-4" />
                <span>Add Output</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

EnhancedCanvas.displayName = 'EnhancedCanvas';

export default EnhancedCanvas;
