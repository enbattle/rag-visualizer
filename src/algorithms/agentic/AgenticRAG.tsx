import AlgorithmWrapper from '@/components/algorithm/AlgorithmWrapper';
import ReActTrace from '@/components/visualizations/ReActTrace';
import { ALGORITHMS } from '@/config';
import { agenticRAGDemo, agenticReActTrace } from './demo-data';
import { agenticRAGCode } from './code-snippet';

const meta = ALGORITHMS.find((a) => a.id === 'agentic')!;

export default function AgenticRAG() {
  const specialVisualization = (currentStep: number) => {
    const currentIteration = Math.floor(currentStep / 3) + 1;
    const visibleTraceEntries = agenticReActTrace.filter(
      (entry) => entry.iteration <= currentIteration
    );
    return <ReActTrace entries={visibleTraceEntries} currentIteration={currentIteration} />;
  };

  return (
    <AlgorithmWrapper
      demoData={agenticRAGDemo}
      codeSnippets={agenticRAGCode}
      specialVisualization={specialVisualization}
      overviewText={meta.overviewText}
    />
  );
}
