/**
 * Input Node Component
 * Beautiful input/trigger node for React Flow
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { 
  ArrowDown, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Database,
  Globe,
  FileText,
  Zap,
  User
} from 'lucide-react';

export interface InputNodeData {
  name: string;
  type: 'webhook' | 'schedule' | 'manual' | 'file' | 'api' | 'user';
  status: 'idle' | 'running' | 'completed' | 'error' | 'pending';
  description?: string;
  trigger?: string;
  lastTriggered?: Date;
  nextTrigger?: Date;
  dataFormat?: string;
  sampleData?: any;
}

const InputNode: React.FC<NodeProps<InputNodeData>> = ({ data, selected, isConnectable }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'border-blue-500 bg-blue-50';
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'pending':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <ArrowDown className="w-4 h-4 text-blue-600 animate-bounce" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <ArrowDown className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook':
        return <Globe className="w-4 h-4 text-blue-600" />;
      case 'schedule':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'manual':
        return <User className="w-4 h-4 text-green-600" />;
      case 'file':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'api':
        return <Database className="w-4 h-4 text-indigo-600" />;
      default:
        return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'webhook':
        return 'bg-blue-100 text-blue-800';
      case 'schedule':
        return 'bg-purple-100 text-purple-800';
      case 'manual':
        return 'bg-green-100 text-green-800';
      case 'file':
        return 'bg-orange-100 text-orange-800';
      case 'api':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        relative min-w-[180px] max-w-[240px] rounded-xl border-2 shadow-lg transition-all duration-200
        ${getStatusColor(data.status)}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        hover:shadow-xl hover:scale-105
      `}
    >
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

        {/* Trigger */}
        {data.trigger && (
          <div className="bg-gray-100 rounded-lg p-2 mb-3">
            <p className="text-xs text-gray-700 font-mono">{data.trigger}</p>
          </div>
        )}

        {/* Description */}
        {data.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{data.description}</p>
        )}

        {/* Data Format */}
        {data.dataFormat && (
          <div className="mb-3">
            <span className="text-xs text-gray-500">Format: </span>
            <span className="text-xs text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded">
              {data.dataFormat}
            </span>
          </div>
        )}

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 capitalize">{data.status}</span>
          {data.lastTriggered && (
            <span className="text-gray-400">
              {new Date(data.lastTriggered).toLocaleTimeString()}
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

export default memo(InputNode);
