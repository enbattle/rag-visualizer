import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Database, Sparkles, GitBranch, Wrench, Bot, CheckCircle2, type LucideIcon } from 'lucide-react';
import type { NodeLayout, NodeKind } from './types';

export type DiagramNodeState = 'idle' | 'active' | 'visited';

interface DiagramNodeProps {
  node: NodeLayout;
  state: DiagramNodeState;
  reducedMotion: boolean;
}

const KIND_ICON: Record<NodeKind, LucideIcon> = {
  input: MessageSquare,
  retrieval: Database,
  llm: Sparkles,
  decision: GitBranch,
  tool: Wrench,
  agent: Bot,
  output: CheckCircle2,
};

// Mirrors the node-* tokens in tailwind.config.ts — kept as literal hex here since
// these drive inline style (fill/stroke/filter), not Tailwind classes.
const KIND_HEX: Record<NodeKind, string> = {
  input: '#2563eb',
  retrieval: '#16a34a',
  llm: '#9333ea',
  decision: '#ea580c',
  tool: '#059669',
  agent: '#0284c7',
  output: '#2563eb',
};

export default function DiagramNode({ node, state, reducedMotion }: DiagramNodeProps) {
  const kind = node.kind ?? 'input';
  const Icon = KIND_ICON[kind];
  const hex = KIND_HEX[kind];
  const isActive = state === 'active';
  const isVisited = state === 'visited';

  const rectStyle: CSSProperties = {
    fill: isActive ? `${hex}2E` : isVisited ? `${hex}14` : 'rgb(var(--color-bg-elevated))',
    stroke: isActive ? hex : isVisited ? `${hex}55` : 'rgb(var(--color-border))',
    filter: isActive ? `drop-shadow(0 0 4px ${hex}99) drop-shadow(0 0 12px ${hex}4D)` : 'none',
    transition: 'fill 0.3s, stroke 0.3s, filter 0.3s',
  };

  const iconColor = isActive ? hex : isVisited ? `${hex}99` : 'rgb(var(--color-text-muted))';
  const textFill = isActive ? hex : isVisited ? 'rgb(var(--color-text-secondary))' : 'rgb(var(--color-text-muted))';

  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;
  const pingR = Math.min(node.w, node.h) * 0.42;

  return (
    <g>
      {/* Radar ping — reads as "this is live" without competing with the glow */}
      {isActive && !reducedMotion && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={pingR}
          fill="none"
          stroke={hex}
          strokeWidth={1.5}
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.7 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx={12}
        strokeWidth={isActive ? 2 : 1.5}
        style={rectStyle}
      />

      <Icon x={cx - 8} y={node.y + 10} width={16} height={16} style={{ color: iconColor, transition: 'color 0.3s' }} />

      <text
        x={cx}
        y={node.y + node.h - 13}
        textAnchor="middle"
        className={`text-[10px] ${isActive ? 'font-semibold' : ''}`}
        style={{ fill: textFill, transition: 'fill 0.3s' }}
      >
        {node.label}
      </text>
    </g>
  );
}
