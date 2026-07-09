import { motion } from 'framer-motion';
import { anchor, edgePath, type Side } from './geometry';
import type { EdgeLayout, NodeLayout } from './types';

export type DiagramEdgeState = 'idle' | 'active' | 'visited';

interface DiagramEdgeProps {
  edge: EdgeLayout;
  fromNode: NodeLayout;
  toNode: NodeLayout;
  state: DiagramEdgeState;
  reducedMotion: boolean;
  /** Changes each step; keys the traveling packet so it replays on re-activation. */
  stepKey: number;
}

const FLOW_COLOR = '#14b8a6';

export default function DiagramEdge({ edge, fromNode, toNode, state, reducedMotion, stepKey }: DiagramEdgeProps) {
  const fromSide: Side = edge.fromSide ?? 'right';
  const toSide: Side = edge.toSide ?? 'left';
  const a = anchor(fromNode, fromSide);
  const b = anchor(toNode, toSide);
  const defaultBend = edge.curve === 'loop-back' ? 50 : 60;
  const d = edgePath(a, fromSide, b, toSide, edge.bend ?? defaultBend);

  const isActive = state === 'active';
  const isVisited = state === 'visited';

  return (
    <g>
      {/* Base pass: full topology, always faintly visible */}
      <path
        d={d}
        fill="none"
        className="stroke-border"
        strokeWidth={1.5}
        opacity={0.35}
        markerEnd="url(#diagram-arrow-dim)"
      />

      {/* Overlay pass: flow indicator once this edge has been (or is) active */}
      {(isActive || isVisited) && (
        <motion.path
          d={d}
          fill="none"
          stroke={FLOW_COLOR}
          strokeWidth={isActive ? 2.5 : 2}
          markerEnd="url(#diagram-arrow-flow)"
          style={{ opacity: isActive ? 1 : 0.45, transition: 'opacity 0.3s' }}
          initial={!reducedMotion && isActive ? { pathLength: 0 } : { pathLength: 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45 }}
        />
      )}

      {/* Traveling packet — plays once each time this edge becomes active */}
      {isActive && !reducedMotion && (
        <g key={`packet-${stepKey}-${edge.id}`}>
          <circle r={9} fill={FLOW_COLOR} opacity={0.3}>
            <animateMotion dur="0.5s" fill="freeze" path={d} />
          </circle>
          <circle r={4} fill={FLOW_COLOR}>
            <animateMotion dur="0.5s" fill="freeze" path={d} />
          </circle>
        </g>
      )}
    </g>
  );
}
