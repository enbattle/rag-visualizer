import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { correctiveRAGDemo } from './demo-data';
import { correctiveRAGCode } from './code-snippet';

const CorrectiveRAG = createSimpleAlgorithm('corrective', correctiveRAGDemo, correctiveRAGCode);
export default CorrectiveRAG;
