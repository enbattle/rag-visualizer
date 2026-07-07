import AlgorithmWrapper from '@/components/algorithm/AlgorithmWrapper';
import KnowledgeGraph from '@/components/visualizations/KnowledgeGraph';
import { ALGORITHMS } from '@/config';
import { graphRAGDemo, graphRAGNodes, graphRAGEdges } from './demo-data';
import { graphRAGCode } from './code-snippet';

const meta = ALGORITHMS.find((a) => a.id === 'graph')!;

export default function GraphRAG() {
  const specialVisualization = (currentStep: number) => {
    let activeNodeIds: string[] = [];
    let activeHop: 1 | 2 | undefined;

    if (currentStep >= 1 && currentStep <= 3) {
      activeNodeIds = ['OpenAI', 'GPT-4', 'Microsoft', 'Copilot'];
      activeHop = currentStep === 3 ? 1 : undefined;
    } else if (currentStep >= 4) {
      activeNodeIds = ['Microsoft', 'OpenAI'];
      activeHop = 2;
    }

    return (
      <KnowledgeGraph
        nodes={graphRAGNodes}
        edges={graphRAGEdges}
        activeNodeIds={activeNodeIds}
        activeHop={activeHop}
      />
    );
  };

  return (
    <AlgorithmWrapper
      demoData={graphRAGDemo}
      codeSnippets={graphRAGCode}
      specialVisualization={specialVisualization}
      overviewText={meta.overviewText}
    />
  );
}
