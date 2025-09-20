/**
 * Condition Node Component
 * Beautiful condition/decision node for React Flow
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Settings
} from 'lucide-react';

export interface ConditionNodeData {
  name: string;
  condition: string;
  status: 'idle' | 'running' | 'completed' | 'error' | 'pending';
  description?: string;
  truePath?: string;
  falsePath?: string;
  result?: boolean;
  lastEvaluated?: Date;
  executionState?: 'idle' | 'running' | 'completed' | 'pending';
  isCurrentlyRunning?: boolean;
  isCompleted?: boolean;
  isPending?: boolean;
  executionStep?: number;
  executionPath?: string[];
}

const ConditionNode: React.FC<NodeProps<ConditionNodeData>> = ({ data, selected, isConnectable }) => {
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
        return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'completed':
        return data.result ? 
          <CheckCircle className="w-4 h-4 text-green-600" /> : 
          <XCircle className="w-4 h-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <GitBranch className="w-4 h-4 text-gray-600" />;
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
        relative min-w-[180px] max-w-[240px] rounded-xl border-2 shadow-lg transition-all duration-300
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
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-5 h-5 text-orange-600" />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{data.name}</h3>
            <p className="text-xs text-gray-500">Condition</p>
          </div>
          {getStatusIcon(data.status)}
        </div>

        {/* Condition */}
        <div className="bg-gray-100 rounded-lg p-2 mb-3">
          <p className="text-xs text-gray-700 font-mono">{data.condition}</p>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{data.description}</p>
        )}

        {/* Result */}
        {data.result !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">Result:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              data.result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {data.result ? 'True' : 'False'}
            </span>
          </div>
        )}

        {/* Paths */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span className="text-gray-600">True: {data.truePath || 'Continue'}</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <span className="text-gray-600">False: {data.falsePath || 'Skip'}</span>
          </div>
        </div>

        {/* Last Evaluated */}
        {data.lastEvaluated && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-400">
              Last: {new Date(data.lastEvaluated).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* True Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ right: -6, top: '30%' }}
      />

      {/* False Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ right: -6, top: '70%' }}
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

export default memo(ConditionNode);
