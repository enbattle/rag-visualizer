import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { multimodalRAGDemo } from './demo-data';
import { multimodalRAGCode } from './code-snippet';
import { multimodalLayout } from './layout';

const MultimodalRAG = createSimpleAlgorithm('multimodal', multimodalRAGDemo, multimodalRAGCode, multimodalLayout);
export default MultimodalRAG;
