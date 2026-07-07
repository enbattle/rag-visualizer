import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { standardRAGDemo } from './demo-data';
import { standardRAGCode } from './code-snippet';

const StandardRAG = createSimpleAlgorithm('standard', standardRAGDemo, standardRAGCode);
export default StandardRAG;
