import AlgorithmWrapper from './AlgorithmWrapper';
import { ALGORITHMS } from '@/config';
import type { AlgorithmDemoData, CodeSnippet } from './types';

/**
 * Factory for the 6 simple RAG algorithm components that have no special visualization.
 * Reads overviewText from the ALGORITHMS config so it stays in one place.
 */
export function createSimpleAlgorithm(
  algorithmId: string,
  demoData: AlgorithmDemoData,
  codeSnippets: CodeSnippet
) {
  const meta = ALGORITHMS.find((a) => a.id === algorithmId)!;

  function SimpleAlgorithm() {
    return <AlgorithmWrapper demoData={demoData} codeSnippets={codeSnippets} overviewText={meta.overviewText} />;
  }
  SimpleAlgorithm.displayName = algorithmId;
  return SimpleAlgorithm;
}
