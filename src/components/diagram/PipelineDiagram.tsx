import { useMemo } from 'react';
import DiagramNode from './DiagramNode';
import DiagramEdge from './DiagramEdge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PipelineLayout } from './types';
import type { AnimationStep } from '@/components/algorithm/types';

export const CANVAS = { w: 940, h: 240 } as const;

interface PipelineDiagramProps {
  layout: PipelineLayout;
  steps: AnimationStep[];
  currentStep: number;
}

export default function PipelineDiagram({ layout, steps, currentStep }: PipelineDiagramProps) {
  const reducedMotion = useReducedMotion();

  const { activatedNodes, currentNodes, activatedEdges, currentEdges } = useMemo(() => {
    const activatedNodes = new Set<string>();
    const activatedEdges = new Set<string>();
    for (let i = 0; i <= currentStep; i++) {
      steps[i]?.activeNodeIds.forEach((id) => activatedNodes.add(id));
      steps[i]?.activeEdgeIds.forEach((id) => activatedEdges.add(id));
    }
    return {
      activatedNodes,
      activatedEdges,
      currentNodes: new Set(steps[currentStep]?.activeNodeIds ?? []),
      currentEdges: new Set(steps[currentStep]?.activeEdgeIds ?? []),
    };
  }, [steps, currentStep]);

  const nodeById = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout.nodes]);

  function nodeState(id: string) {
    if (currentNodes.has(id)) return 'active' as const;
    if (activatedNodes.has(id)) return 'visited' as const;
    return 'idle' as const;
  }

  function edgeState(activeWhen: string[]) {
    if (activeWhen.some((id) => currentEdges.has(id))) return 'active' as const;
    if (activeWhen.some((id) => activatedEdges.has(id))) return 'visited' as const;
    return 'idle' as const;
  }

  return (
    <div className="diagram-grid w-full h-full flex items-center justify-center bg-bg-secondary border border-border rounded-lg overflow-hidden">
      <svg viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`} className="w-full h-full">
        <defs>
          <marker id="diagram-arrow-dim" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" className="fill-border" />
          </marker>
          <marker id="diagram-arrow-flow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#14b8a6" />
          </marker>
        </defs>

        {layout.edges.map((edge) => {
          const fromNode = nodeById.get(edge.from);
          const toNode = nodeById.get(edge.to);
          if (!fromNode || !toNode) return null;
          return (
            <DiagramEdge
              key={edge.id}
              edge={edge}
              fromNode={fromNode}
              toNode={toNode}
              state={edgeState(edge.activeWhen ?? [edge.id])}
              reducedMotion={reducedMotion}
              stepKey={currentStep}
            />
          );
        })}
        {layout.nodes.map((node) => (
          <DiagramNode key={node.id} node={node} state={nodeState(node.id)} reducedMotion={reducedMotion} />
        ))}
      </svg>
    </div>
  );
}
