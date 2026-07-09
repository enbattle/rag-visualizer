import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { selfRAGDemo } from './demo-data';
import { selfRAGCode } from './code-snippet';
import { selfRagLayout } from './layout';

const SelfRAG = createSimpleAlgorithm('self-rag', selfRAGDemo, selfRAGCode, selfRagLayout);
export default SelfRAG;
