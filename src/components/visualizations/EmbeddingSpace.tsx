import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { EmbeddingPoint } from '@/components/algorithm/types';

interface EmbeddingSpaceProps {
  points: EmbeddingPoint[];
  animatedPointId?: string;
  animationPath?: { from: { x: number; y: number }; to: { x: number; y: number } };
}

/**
 * 2D scatter plot visualization for HyDE
 * Shows question-space to answer-space transition
 */
export default function EmbeddingSpace({
  points,
  animatedPointId,
  animationPath,
}: EmbeddingSpaceProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full h-full bg-bg-secondary border border-border rounded-lg overflow-hidden">
      {/* Axis labels */}
      <div className="absolute top-2 left-2 text-xs text-text-muted font-mono">
        Embedding Space
      </div>

      {/* Cluster labels */}
      <div className="absolute top-12 left-8 text-xs text-text-secondary font-medium">
        Question Space
      </div>
      <div className="absolute bottom-12 right-8 text-xs text-text-secondary font-medium">
        Answer Space
      </div>

      {/* SVG canvas */}
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* Animation path trail */}
        {animationPath && !prefersReducedMotion && (
          <motion.line
            x1={animationPath.from.x}
            y1={animationPath.from.y}
            x2={animationPath.to.x}
            y2={animationPath.to.y}
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="text-node-query/50"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
        )}

        {/* Static points */}
        {points
          .filter((p) => p.id !== animatedPointId)
          .map((point) => (
            <g key={point.id}>
              <circle
                cx={point.x}
                cy={point.y}
                r={point.type === 'document' ? 4 : 6}
                className={
                  point.type === 'query'
                    ? 'fill-node-query'
                    : point.type === 'hypothesis'
                      ? 'fill-node-llm'
                      : 'fill-text-muted'
                }
                opacity={point.type === 'document' ? 0.4 : 1}
              />
              {point.type !== 'document' && (
                <text
                  x={point.x}
                  y={point.y - 12}
                  className="text-[10px] fill-text-secondary"
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              )}
            </g>
          ))}

        {/* Animated point */}
        {animatedPointId && animationPath && (
          <motion.g
            initial={
              !prefersReducedMotion
                ? { x: animationPath.from.x, y: animationPath.from.y }
                : { x: animationPath.to.x, y: animationPath.to.y }
            }
            animate={{ x: animationPath.to.x, y: animationPath.to.y }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <motion.circle
              r={8}
              className="fill-node-llm"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text
              y={-12}
              className="text-[10px] fill-text-primary font-medium"
              textAnchor="middle"
            >
              Hypothesis
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
}
