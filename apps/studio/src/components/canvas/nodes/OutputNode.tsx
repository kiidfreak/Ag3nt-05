/**
 * Output Node Component
 * Beautiful output/result node for React Flow
 */

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { 
  ArrowUp, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Database,
  Globe,
  FileText,
  Zap,
  Bell,
  Download
} from 'lucide-react';

export interface OutputNodeData {
  name: string;
  type: 'webhook' | 'file' | 'database' | 'notification' | 'api' | 'display';
  status: 'idle' | 'running' | 'completed' | 'error' | 'pending';
  description?: string;
  destination?: string;
  lastSent?: Date;
  nextSend?: Date;
  dataFormat?: string;
  successCount?: number;
  errorCount?: number;
}

const OutputNode: React.FC<NodeProps<OutputNodeData>> = ({ data, selected, isConnectable }) => {
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
        return <ArrowUp className="w-4 h-4 text-blue-600 animate-bounce" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <ArrowUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook':
        return <Globe className="w-4 h-4 text-blue-600" />;
      case 'file':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'database':
        return <Database className="w-4 h-4 text-green-600" />;
      case 'notification':
        return <Bell className="w-4 h-4 text-purple-600" />;
      case 'api':
        return <Zap className="w-4 h-4 text-indigo-600" />;
      case 'display':
        return <Download className="w-4 h-4 text-gray-600" />;
      default:
        return <ArrowUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'webhook':
        return 'bg-blue-100 text-blue-800';
      case 'file':
        return 'bg-orange-100 text-orange-800';
      case 'database':
        return 'bg-green-100 text-green-800';
      case 'notification':
        return 'bg-purple-100 text-purple-800';
      case 'api':
        return 'bg-indigo-100 text-indigo-800';
      case 'display':
        return 'bg-gray-100 text-gray-800';
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

        {/* Destination */}
        {data.destination && (
          <div className="bg-gray-100 rounded-lg p-2 mb-3">
            <p className="text-xs text-gray-700 font-mono">{data.destination}</p>
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

        {/* Statistics */}
        {(data.successCount !== undefined || data.errorCount !== undefined) && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {data.successCount !== undefined && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs text-gray-600">{data.successCount}</span>
              </div>
            )}
            {data.errorCount !== undefined && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-600" />
                <span className="text-xs text-gray-600">{data.errorCount}</span>
              </div>
            )}
          </div>
        )}

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 capitalize">{data.status}</span>
          {data.lastSent && (
            <span className="text-gray-400">
              {new Date(data.lastSent).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

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

export default memo(OutputNode);
