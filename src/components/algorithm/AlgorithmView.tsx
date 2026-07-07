import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy-loaded algorithm components
const ALGO_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  standard: lazy(() => import('@/algorithms/standard/StandardRAG')),
  hybrid: lazy(() => import('@/algorithms/hybrid/HybridRAG')),
  agentic: lazy(() => import('@/algorithms/agentic/AgenticRAG')),
  graph: lazy(() => import('@/algorithms/graph/GraphRAG')),
  corrective: lazy(() => import('@/algorithms/corrective/CorrectiveRAG')),
  hyde: lazy(() => import('@/algorithms/hyde/HyDE')),
  multimodal: lazy(() => import('@/algorithms/multimodal/MultimodalRAG')),
  'self-rag': lazy(() => import('@/algorithms/self-rag/SelfRAG')),
  adaptive: lazy(() => import('@/algorithms/adaptive/AdaptiveRAG')),
  'rag-fusion': lazy(() => import('@/algorithms/rag-fusion/RagFusion')),
};

function AlgorithmSkeleton() {
  return (
    <div className="p-5 space-y-4">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

interface Props {
  algorithmId: string;
}

export default function AlgorithmView({ algorithmId }: Props) {
  const Component = ALGO_COMPONENTS[algorithmId];

  if (!Component) {
    return (
      <div className="p-5 text-sm text-text-secondary">
        Algorithm not found: <code className="font-mono text-xs">{algorithmId}</code>
      </div>
    );
  }

  return (
    <div className="p-5">
      <Suspense fallback={<AlgorithmSkeleton />}>
        <Component />
      </Suspense>
    </div>
  );
}
