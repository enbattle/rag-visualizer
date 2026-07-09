import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { ragFusionDemo } from './demo-data';
import { ragFusionCode } from './code-snippet';
import { ragFusionLayout } from './layout';

const RagFusion = createSimpleAlgorithm('rag-fusion', ragFusionDemo, ragFusionCode, ragFusionLayout);
export default RagFusion;
