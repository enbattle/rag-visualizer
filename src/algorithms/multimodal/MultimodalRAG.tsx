import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { multimodalRAGDemo } from './demo-data';
import { multimodalRAGCode } from './code-snippet';

const MultimodalRAG = createSimpleAlgorithm('multimodal', multimodalRAGDemo, multimodalRAGCode);
export default MultimodalRAG;
