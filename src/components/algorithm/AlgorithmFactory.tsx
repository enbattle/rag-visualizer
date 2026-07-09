import AlgorithmWrapper from './AlgorithmWrapper';
import { ALGORITHMS } from '@/config';
import type { AlgorithmDemoData, CodeSnippet } from './types';
import type { PipelineLayout } from '@/components/diagram/types';

/**
 * Factory for the RAG algorithm components that have no special visualization.
 * Reads overviewText from the ALGORITHMS config so it stays in one place.
 */
export function createSimpleAlgorithm(
  algorithmId: string,
  demoData: AlgorithmDemoData,
  codeSnippets: CodeSnippet,
  pipelineLayout?: PipelineLayout
) {
  const meta = ALGORITHMS.find((a) => a.id === algorithmId)!;

  function SimpleAlgorithm() {
    return (
      <AlgorithmWrapper
        demoData={demoData}
        codeSnippets={codeSnippets}
        overviewText={meta.overviewText}
        pipelineLayout={pipelineLayout}
      />
    );
  }
  SimpleAlgorithm.displayName = algorithmId;
  return SimpleAlgorithm;
}
