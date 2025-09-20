/**
 * Action Node Component
 * Beautiful action/process node for React Flow
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Settings,
  Zap,
  Database,
  Globe,
  FileText
} from 'lucide-react';

export interface ActionNodeData {
  name: string;
  action: string;
  status: 'idle' | 'running' | 'completed' | 'error' | 'pending';
  description?: string;
  type: 'process' | 'api' | 'database' | 'file' | 'notification';
  duration?: number;
  lastRun?: Date;
  nextRun?: Date;
  retryCount?: number;
  maxRetries?: number;
  executionState?: 'idle' | 'running' | 'completed' | 'pending';
  isCurrentlyRunning?: boolean;
  isCompleted?: boolean;
  isPending?: boolean;
  executionStep?: number;
  executionPath?: string[];
}

const ActionNode: React.FC<NodeProps<ActionNodeData>> = ({ data, selected, isConnectable }) => {
  const getStatusColor = (status: string) => {
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
    const currentStatus = data.executionState || status;
    
    switch (currentStatus) {
      case 'running':
        return <Play className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Play className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'process':
        return <Zap className="w-4 h-4 text-purple-600" />;
      case 'api':
        return <Globe className="w-4 h-4 text-blue-600" />;
      case 'database':
        return <Database className="w-4 h-4 text-green-600" />;
      case 'file':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'notification':
        return <Settings className="w-4 h-4 text-indigo-600" />;
      default:
        return <Play className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'process':
        return 'bg-purple-100 text-purple-800';
      case 'api':
        return 'bg-blue-100 text-blue-800';
      case 'database':
        return 'bg-green-100 text-green-800';
      case 'file':
        return 'bg-orange-100 text-orange-800';
      case 'notification':
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

      {/* Node Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(data.type)}
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{data.name}</h3>
              <p className="text-xs text-gray-500 capitalize">{data.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon(data.status)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(data.type)}`}>
              {data.type}
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="bg-gray-100 rounded-lg p-2 mb-3">
          <p className="text-xs text-gray-700 font-mono">{data.action}</p>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{data.description}</p>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {data.duration !== undefined && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">{data.duration}ms</span>
            </div>
          )}
          {data.retryCount !== undefined && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">
                {data.retryCount}/{data.maxRetries || 3}
              </span>
            </div>
          )}
        </div>

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
      {data.status === 'running' && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default memo(ActionNode);
