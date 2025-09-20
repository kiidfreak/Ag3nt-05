/**
 * Agent Node Component
 * Beautiful, interactive agent node for React Flow
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Settings,
  Zap,
  Shield,
  Database,
  Cpu,
  MemoryStick
} from 'lucide-react';

export interface AgentNodeData {
  name: string;
  type: string;
  status: 'idle' | 'running' | 'completed' | 'error' | 'pending';
  description?: string;
  category: 'ai' | 'data' | 'security' | 'integration' | 'processing';
  metrics?: {
    cpu?: number;
    memory?: number;
    latency?: number;
    throughput?: number;
  };
  config?: Record<string, any>;
  lastRun?: Date;
  nextRun?: Date;
  executionState?: 'idle' | 'running' | 'completed' | 'pending';
  isCurrentlyRunning?: boolean;
  isCompleted?: boolean;
  isPending?: boolean;
  executionStep?: number;
  executionPath?: string[];
}

const AgentNode: React.FC<NodeProps<AgentNodeData>> = ({ data, selected, isConnectable }) => {
  const getStatusColor = (status: string) => {
    // Use execution state if available, otherwise fall back to status
    const currentStatus = data.executionState || status;
    
    switch (currentStatus) {
      case 'running':
        return 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-200';
      case 'completed':
        return 'border-green-500 bg-green-50 shadow-lg shadow-green-200';
      case 'error':
        return 'border-red-500 bg-red-50 shadow-lg shadow-red-200';
      case 'pending':
        return 'border-yellow-500 bg-yellow-50 shadow-lg shadow-yellow-200';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getStatusIcon = (status: string) => {
    // Use execution state if available, otherwise fall back to status
    const currentStatus = data.executionState || status;
    
    switch (currentStatus) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Bot className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai':
        return <Zap className="w-4 h-4 text-purple-600" />;
      case 'data':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'security':
        return <Shield className="w-4 h-4 text-green-600" />;
      case 'integration':
        return <Settings className="w-4 h-4 text-orange-600" />;
      case 'processing':
        return <Cpu className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bot className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai':
        return 'bg-purple-100 text-purple-800';
      case 'data':
        return 'bg-blue-100 text-blue-800';
      case 'security':
        return 'bg-green-100 text-green-800';
      case 'integration':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: data.isCurrentlyRunning ? 1.05 : 1, 
        opacity: data.isPending ? 0.6 : 1 
      }}
      transition={{ duration: 0.3 }}
      className={`
        relative min-w-[200px] max-w-[280px] rounded-xl border-2 shadow-lg transition-all duration-300
        ${getStatusColor(data.status)}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${data.isCurrentlyRunning ? 'ring-4 ring-blue-400 ring-offset-2 shadow-2xl shadow-blue-300' : ''}
        ${data.isCompleted ? 'ring-2 ring-green-400 ring-offset-1' : ''}
        ${data.isPending ? 'opacity-60 grayscale-30' : ''}
        hover:shadow-xl hover:scale-105
      `}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ top: -6 }}
      />

      {/* Node Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getCategoryIcon(data.category)}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{data.name}</h3>
              <p className="text-xs text-gray-500">{data.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(data.status)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(data.category)}`}>
              {data.category}
            </span>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{data.description}</p>
        )}

        {/* Metrics */}
        {data.metrics && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {data.metrics.cpu !== undefined && (
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">{data.metrics.cpu}%</span>
              </div>
            )}
            {data.metrics.memory !== undefined && (
              <div className="flex items-center gap-1">
                <MemoryStick className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">{data.metrics.memory}MB</span>
              </div>
            )}
            {data.metrics.latency !== undefined && (
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">{data.metrics.latency}ms</span>
              </div>
            )}
            {data.metrics.throughput !== undefined && (
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">{data.metrics.throughput}/s</span>
              </div>
            )}
          </div>
        )}

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 capitalize">{data.status}</span>
          {data.lastRun && (
            <span className="text-gray-400">
              {new Date(data.lastRun).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
        style={{ bottom: -6 }}
      />

      {/* Running Animation */}
      {(data.executionState === 'running' || data.status === 'running') && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-500"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      {/* Execution State Indicator */}
      {data.isCurrentlyRunning && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Activity className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(AgentNode);
