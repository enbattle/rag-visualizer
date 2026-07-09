import { createSimpleAlgorithm } from '@/components/algorithm/AlgorithmFactory';
import { standardRAGDemo } from './demo-data';
import { standardRAGCode } from './code-snippet';
import { standardLayout } from './layout';

const StandardRAG = createSimpleAlgorithm('standard', standardRAGDemo, standardRAGCode, standardLayout);
export default StandardRAG;
