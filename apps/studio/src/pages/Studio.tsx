import React, { useState, useEffect } from 'react';
import { Plus, Play, Save, Settings, Trash2, Bot, Zap, Shield, Coins, ArrowRight, Folder } from 'lucide-react';
import { apiService } from '../services/api';
import { mockApiService, type MockFlow, type MockFlowNode, type MockAgent } from '../services/mockData';

interface DragItem {
  type: 'agent' | 'condition' | 'action' | 'input' | 'output';
  id: string;
  name: string;
  icon: any;
  color: string;
}

const Studio: React.FC = () => {
  const [flows, setFlows] = useState<MockFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<MockFlow | null>(null);
  const [nodes, setNodes] = useState<MockFlowNode[]>([]);
  const [agents, setAgents] = useState<MockAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');

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

  useEffect(() => {
    loadFlows();
  }, []);

  useEffect(() => {
    if (selectedFlow) {
      setFlowName(selectedFlow.name);
      setFlowDescription(selectedFlow.description || '');
    }
  }, [selectedFlow]);

  const loadFlows = async () => {
    try {
      setLoading(true);
      const [flowsResponse, agentsResponse] = await Promise.all([
        mockApiService.getFlows(),
        mockApiService.getAgents()
      ]);
      
      setFlows(flowsResponse.data);
      setAgents(agentsResponse.data);
      
      if (flowsResponse.data.length > 0) {
        setSelectedFlow(flowsResponse.data[0]);
        setNodes(flowsResponse.data[0].nodes);
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

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || !selectedFlow) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: MockFlowNode = {
      id: `node-${Date.now()}`,
      type: draggedItem.type,
      config: {
        name: draggedItem.name,
        settings: {},
      },
      position: { x, y },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flowId: selectedFlow.id,
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);

    // Update the flow with new nodes
    const updatedFlow = {
      ...selectedFlow,
      nodes: updatedNodes,
    };
    setSelectedFlow(updatedFlow);

    // Update flows array
    setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('.canvas-container');
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - offsetX;
      const y = e.clientY - canvasRect.top - offsetY;

      // Update node position in real-time
      const updatedNodes = nodes.map(n =>
        n.id === nodeId
          ? { ...n, position: { x: Math.max(0, x), y: Math.max(0, y) } }
          : n
      );
      setNodes(updatedNodes);
    };

    const handleMouseUp = () => {
      setDraggedNode(null);
      setDragOffset({ x: 0, y: 0 });

      // Save the final position
      if (selectedFlow) {
        const updatedFlow = {
          ...selectedFlow,
          nodes: nodes,
        };
        setSelectedFlow(updatedFlow);
        setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    setNodes(updatedNodes);

    if (selectedFlow) {
      const updatedFlow = {
        ...selectedFlow,
        nodes: updatedNodes,
      };
      setSelectedFlow(updatedFlow);
      setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
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
      setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
    } catch (err) {
      console.error('Failed to update flow:', err);
    }
  };

  const handleFlowSelect = (flow: MockFlow) => {
    setSelectedFlow(flow);
    setNodes(flow.nodes);
  };

  const handleAgentSelect = (agent: MockAgent) => {
    // Add agent as a node to the current flow
    if (!selectedFlow) return;

    const newNode: MockFlowNode = {
      id: `node-${Date.now()}`,
      type: 'agent',
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
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);

    const updatedFlow = {
      ...selectedFlow,
      nodes: updatedNodes,
    };
    setSelectedFlow(updatedFlow);
    setFlows(flows.map(f => f.id === selectedFlow.id ? updatedFlow : f));
  };

  const getNodeIcon = (type: string) => {
    const item = dragItems.find(item => item.type === type);
    return item ? item.icon : Bot;
  };

  const getNodeColor = (type: string) => {
    const item = dragItems.find(item => item.type === type);
    return item ? item.color : 'bg-gray-100 text-gray-600';
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
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Flows</h2>
            <button
              onClick={() => setShowCreateFlow(true)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {showCreateFlow && (
            <div className="mb-4">
              <input
                type="text"
                value={newFlowName}
                onChange={(e) => setNewFlowName(e.target.value)}
                placeholder="Flow name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFlow()}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleCreateFlow}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateFlow(false);
                    setNewFlowName('');
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {flows.map((flow) => (
              <button
                key={flow.id}
                onClick={() => handleFlowSelect(flow)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedFlow?.id === flow.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium text-sm">{flow.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{flow.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    flow.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {flow.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {flow.nodes.length} nodes
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Components</h3>
          <div className="space-y-2">
            {dragItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="flex items-center p-2 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-sm transition-shadow"
                >
                  <div className={`p-2 rounded-lg ${item.color} mr-3`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Agent Library</h3>
          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleAgentSelect(agent)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={!selectedFlow}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{agent.name}</h4>
                    <p className="text-xs text-gray-500">{agent.type}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Properties</h3>
          {selectedFlow && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Flow Name</label>
                <input
                  type="text"
                  value={flowName}
                  onChange={handleFlowNameChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Description</label>
                <textarea
                  value={flowDescription}
                  onChange={handleFlowDescriptionChange}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm h-20 resize-none"
                />
              </div>
              <div>
                <button
                  onClick={handleSaveFlowProperties}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Save Properties
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                {selectedFlow ? selectedFlow.name : 'Select a Flow'}
              </h1>
              <p className="text-sm text-gray-600">
                {selectedFlow ? selectedFlow.description : 'Choose a flow to start editing'}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Run</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className="flex-1 relative overflow-hidden canvas-container"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {selectedFlow ? (
            <div className="w-full h-full relative">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Flow nodes */}
              {nodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                    className={`absolute cursor-move select-none ${
                      draggedNode === node.id ? 'z-50' : 'z-10'
                    }`}
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                    }}
                  >
                    <div className={`bg-white border-2 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow min-w-[120px] ${
                      draggedNode === node.id 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1 rounded ${getNodeColor(node.type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <button
                          onClick={() => handleDeleteNode(node.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900">{node.config.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{node.type}</p>
                    </div>
                  </div>
                );
              })}

              {/* Drop zone indicator */}
              {draggedItem && (
                <div className="absolute inset-0 border-2 border-dashed border-blue-300 bg-blue-50 bg-opacity-50 flex items-center justify-center">
                  <div className="text-blue-600 font-medium">
                    Drop {draggedItem.name} here
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
      </div>
    </div>
  );
};

export default Studio;