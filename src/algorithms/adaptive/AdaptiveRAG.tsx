import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { adaptiveRAGDemo } from './demo-data';
import { adaptiveRAGCode } from './code-snippet';
import { adaptiveLayout } from './layout';

const AdaptiveRAG = createSimpleAlgorithm('adaptive', adaptiveRAGDemo, adaptiveRAGCode, adaptiveLayout);
export default AdaptiveRAG;
