import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { correctiveRAGDemo } from './demo-data';
import { correctiveRAGCode } from './code-snippet';
import { correctiveLayout } from './layout';

const CorrectiveRAG = createSimpleAlgorithm('corrective', correctiveRAGDemo, correctiveRAGCode, correctiveLayout);
export default CorrectiveRAG;
