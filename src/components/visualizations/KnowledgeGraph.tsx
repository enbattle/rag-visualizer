import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { GraphNode, GraphEdge } from '@/components/algorithm/types';

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeNodeIds?: string[];
  activeHop?: 1 | 2;
}

// Fixed positions for the GraphRAG demo knowledge graph
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  openai:    { x: 200, y: 80  },
  'gpt-4':   { x: 120, y: 180 },
  microsoft: { x: 280, y: 180 },
  copilot:   { x: 200, y: 280 },
};

export default function KnowledgeGraph({
  nodes,
  edges,
  activeNodeIds = [],
  activeHop,
}: KnowledgeGraphProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative w-full h-full bg-bg-secondary border border-border rounded-lg overflow-hidden">
      {/* Title */}
      <div className="absolute top-4 left-4 text-sm text-text-primary font-semibold">
        Knowledge Graph
      </div>

      {/* Hop indicator */}
      {activeHop && (
        <div className="absolute top-4 right-4 text-xs text-text-muted font-mono">
          Hop {activeHop}
        </div>
      )}

      {/* SVG canvas */}
      <svg className="w-full h-full" viewBox="0 0 400 360">
        {/* Edges */}
        {edges.map((edge) => {
          const sourcePos = NODE_POSITIONS[edge.source.toLowerCase()];
          const targetPos = NODE_POSITIONS[edge.target.toLowerCase()];
          if (!sourcePos || !targetPos) return null;

          const isActive =
            activeHop === edge.hop &&
            (activeNodeIds.includes(edge.source) || activeNodeIds.includes(edge.target));

          return (
            <g key={`${edge.source}-${edge.target}`}>
              <motion.line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke="currentColor"
                strokeWidth={isActive ? 2 : 1}
                className={isActive ? 'text-node-query' : 'text-border'}
                initial={!prefersReducedMotion && isActive ? { pathLength: 0 } : {}}
                animate={isActive ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5 }}
              />
              {/* Edge label */}
              <text
                x={(sourcePos.x + targetPos.x) / 2}
                y={(sourcePos.y + targetPos.y) / 2}
                className={`text-[9px] ${isActive ? 'fill-node-query' : 'fill-text-muted'}`}
                textAnchor="middle"
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = NODE_POSITIONS[node.id.toLowerCase()];
          if (!pos) return null;

          const isActive = activeNodeIds.includes(node.id);

          return (
            <g key={node.id}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 24 : 20}
                stroke="currentColor"
                strokeWidth={2}
                className={isActive ? 'fill-node-query stroke-node-query' : 'fill-bg-elevated stroke-border'}
                animate={
                  !prefersReducedMotion && isActive
                    ? { scale: [1, 1.1, 1] }
                    : {}
                }
                transition={
                  isActive
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                }
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                className={`text-[11px] font-medium ${isActive ? 'fill-text-primary' : 'fill-text-secondary'}`}
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 text-xs text-text-muted">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-0.5 bg-node-query" />
          <span>Hop {activeHop || 1} relationships</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-border" />
          <span>Other relationships</span>
        </div>
      </div>
    </div>
  );
}
