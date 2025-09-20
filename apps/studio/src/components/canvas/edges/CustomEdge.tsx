/**
 * Custom Edge Component
 * Beautiful, animated edges for React Flow
 */

import React, { memo } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import { motion } from 'framer-motion';

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getEdgeColor = () => {
    if (data?.status === 'active') return '#3b82f6';
    if (data?.status === 'error') return '#ef4444';
    if (data?.status === 'success') return '#10b981';
    return '#6b7280';
  };

  const getEdgeWidth = () => {
    if (data?.status === 'active') return 3;
    if (data?.status === 'error') return 2;
    return 2;
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: getEdgeColor(),
          strokeWidth: getEdgeWidth(),
          strokeDasharray: data?.status === 'pending' ? '5,5' : 'none',
          ...style,
        }}
      />
      
      {/* Edge Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              color: getEdgeColor(),
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
      
      {/* Animated Flow */}
      {data?.status === 'active' && (
        <motion.circle
          r="3"
          fill={getEdgeColor()}
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            offsetPath: `path("${edgePath}")`,
          }}
        />
      )}
    </>
  );
};

export default memo(CustomEdge);
