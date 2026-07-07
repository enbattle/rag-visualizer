import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { selfRAGDemo } from './demo-data';
import { selfRAGCode } from './code-snippet';

const SelfRAG = createSimpleAlgorithm('self-rag', selfRAGDemo, selfRAGCode);
export default SelfRAG;
