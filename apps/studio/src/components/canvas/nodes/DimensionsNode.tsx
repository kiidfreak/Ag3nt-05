/**
 * Dimensions Node Component
 * Node for handling dimensional data and measurements
 */

import React, { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Ruler, Activity } from 'lucide-react';

interface DimensionsNodeData {
  name: string;
  description?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: string;
  };
  executionState?: 'idle' | 'running' | 'completed' | 'pending';
  isCurrentlyRunning?: boolean;
  isCompleted?: boolean;
  isPending?: boolean;
  executionStep?: number;
  executionPath?: string[];
}

const DimensionsNode: React.FC<NodeProps<DimensionsNodeData>> = ({ data, selected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-3 h-3 animate-pulse" />;
      case 'completed':
        return <Ruler className="w-3 h-3" />;
      case 'error':
        return <Ruler className="w-3 h-3" />;
      default:
        return <Ruler className="w-3 h-3" />;
    }
  };

  const isRunning = data.executionState === 'running' || data.isCurrentlyRunning;
  const isCompleted = data.executionState === 'completed' || data.isCompleted;
  const isPending = data.executionState === 'pending' || data.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isRunning ? 1.05 : 1,
        boxShadow: isRunning ? '0 0 20px rgba(59, 130, 246, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.2 }}
      className={`
        relative bg-white border-2 rounded-lg shadow-lg min-w-[200px] max-w-[250px]
        ${selected ? 'border-blue-500' : 'border-gray-200'}
        ${isRunning ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
        ${isCompleted ? 'opacity-80 brightness-110' : ''}
        ${isPending ? 'opacity-60 grayscale-30' : ''}
      `}
      style={{ cursor: 'grab' }}
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Ruler className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{data.name}</h3>
              <p className="text-xs text-gray-500">Dimensions</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(data.status)}`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(data.status)}
              <span className="capitalize">{data.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {data.description && (
          <p className="text-xs text-gray-600 mb-3">{data.description}</p>
        )}
        
        {data.dimensions && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700">Measurements</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.dimensions.width && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Width:</span>
                  <span className="ml-1 font-medium">{data.dimensions.width}{data.dimensions.unit || 'px'}</span>
                </div>
              )}
              {data.dimensions.height && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Height:</span>
                  <span className="ml-1 font-medium">{data.dimensions.height}{data.dimensions.unit || 'px'}</span>
                </div>
              )}
              {data.dimensions.depth && (
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Depth:</span>
                  <span className="ml-1 font-medium">{data.dimensions.depth}{data.dimensions.unit || 'px'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Execution State Indicator */}
        {isRunning && (
          <div className="absolute top-2 right-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-blue-500 rounded-full"
            />
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </motion.div>
  );
};

export default memo(DimensionsNode);
