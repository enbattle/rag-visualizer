import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { ragFusionDemo } from './demo-data';
import { ragFusionCode } from './code-snippet';

const RagFusion = createSimpleAlgorithm('rag-fusion', ragFusionDemo, ragFusionCode);
export default RagFusion;
