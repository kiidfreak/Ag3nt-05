/**
 * Animated Edge Component
 * Beautiful animated edges with flowing particles
 */

import React, { memo } from 'react';
import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import { motion } from 'framer-motion';

const AnimatedEdge: React.FC<EdgeProps> = ({
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

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: getEdgeColor(),
          strokeWidth: 3,
          strokeDasharray: 'none',
          ...style,
        }}
      />
      
      {/* Animated Particles */}
      {data?.status === 'active' && (
        <>
          {[...Array(3)].map((_, index) => (
            <motion.circle
              key={`particle-${index}`}
              r="2"
              fill={getEdgeColor()}
              initial={{ offsetDistance: '0%', opacity: 0 }}
              animate={{ 
                offsetDistance: '100%', 
                opacity: [0, 1, 0] 
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: 'linear',
              }}
              style={{
                offsetPath: `path("${edgePath}")`,
              }}
            />
          ))}
        </>
      )}
      
      {/* Edge Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              color: getEdgeColor(),
            }}
            className="nodrag nopan"
          >
            {data.label}
          </motion.div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default memo(AnimatedEdge);
