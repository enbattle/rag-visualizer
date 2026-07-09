import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { hybridRAGDemo } from './demo-data';
import { hybridRAGCode } from './code-snippet';
import { hybridLayout } from './layout';

const HybridRAG = createSimpleAlgorithm('hybrid', hybridRAGDemo, hybridRAGCode, hybridLayout);
export default HybridRAG;
