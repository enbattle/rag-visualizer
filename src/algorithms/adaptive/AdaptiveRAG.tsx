import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { adaptiveRAGDemo } from './demo-data';
import { adaptiveRAGCode } from './code-snippet';

const AdaptiveRAG = createSimpleAlgorithm('adaptive', adaptiveRAGDemo, adaptiveRAGCode);
export default AdaptiveRAG;
