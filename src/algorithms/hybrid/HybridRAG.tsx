import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { hybridRAGDemo } from './demo-data';
import { hybridRAGCode } from './code-snippet';

const HybridRAG = createSimpleAlgorithm('hybrid', hybridRAGDemo, hybridRAGCode);
export default HybridRAG;
