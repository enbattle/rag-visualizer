import AlgorithmWrapper from '@/components/algorithm/AlgorithmWrapper';
import EmbeddingSpace from '@/components/visualizations/EmbeddingSpace';
import { ALGORITHMS } from '@/config';
import { hydeRAGDemo, hydeEmbeddingPoints } from './demo-data';
import { hydeRAGCode } from './code-snippet';

const meta = ALGORITHMS.find((a) => a.id === 'hyde')!;
const HYPOTHESIS_ANIMATION_PATH = { from: { x: 85, y: 70 }, to: { x: 290, y: 215 } } as const;

export default function HyDE() {
  const specialVisualization = (currentStep: number) => {
    if (currentStep === 0) {
      const questionPoints = hydeEmbeddingPoints.filter(
        (p) => p.type === 'query' || (p.type === 'document' && p.x < 150)
      );
      return <EmbeddingSpace points={questionPoints} />;
    }

    if (currentStep === 1) {
      return (
        <EmbeddingSpace
          points={hydeEmbeddingPoints}
          animatedPointId="hypothesis"
          animationPath={HYPOTHESIS_ANIMATION_PATH}
        />
      );
    }

    return <EmbeddingSpace points={hydeEmbeddingPoints} />;
  };

  return (
    <AlgorithmWrapper
      demoData={hydeRAGDemo}
      codeSnippets={hydeRAGCode}
      specialVisualization={specialVisualization}
      overviewText={meta.overviewText}
    />
  );
}
