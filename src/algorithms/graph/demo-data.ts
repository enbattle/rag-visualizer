import type { AlgorithmDemoData, GraphNode, GraphEdge } from '@/components/algorithm/types';

export const graphRAGNodes: GraphNode[] = [
  { id: 'OpenAI', label: 'OpenAI', type: 'organization' },
  { id: 'GPT-4', label: 'GPT-4', type: 'model' },
  { id: 'Microsoft', label: 'Microsoft', type: 'organization' },
  { id: 'Copilot', label: 'Copilot', type: 'product' },
];

export const graphRAGEdges: GraphEdge[] = [
  { source: 'OpenAI', target: 'GPT-4', label: 'developed', hop: 1 },
  { source: 'GPT-4', target: 'Copilot', label: 'powers', hop: 1 },
  { source: 'Microsoft', target: 'Copilot', label: 'owns', hop: 1 },
  { source: 'Microsoft', target: 'OpenAI', label: 'invested_in', hop: 2 },
  { source: 'OpenAI', target: 'Microsoft', label: 'licensed_to', hop: 2 },
];

export const graphRAGDemo: AlgorithmDemoData = {
  steps: [
    { activeNodeIds: ['query'], activeEdgeIds: [], explanation: 'Relational query: "What is the relationship between GPT-4 and Microsoft Copilot?"' },
    { activeNodeIds: ['extract'], activeEdgeIds: ['e1'], explanation: 'Entity extraction identifies: OpenAI, GPT-4, Microsoft, Copilot.' },
    { activeNodeIds: ['graph'], activeEdgeIds: ['e2'], explanation: 'Entry point nodes located in knowledge graph.' },
    { activeNodeIds: ['hop1'], activeEdgeIds: ['e3'], explanation: 'Hop 1: Direct neighbors retrieved. GPT-4 powers Copilot, Microsoft owns Copilot.' },
    { activeNodeIds: ['hop2'], activeEdgeIds: ['e4'], explanation: 'Hop 2: Indirect relationships. Microsoft invested in OpenAI, OpenAI licensed to Microsoft.' },
    { activeNodeIds: ['llm'], activeEdgeIds: ['e5'], explanation: 'Generation with full relational context from graph traversal.' },
    { activeNodeIds: ['answer'], activeEdgeIds: ['e6'], explanation: 'Answer describes investment, licensing, and product dependencies.' },
  ],
  insight: 'Flat chunking destroys relational structure. A chunk about GPT-4 and a chunk about Copilot contain no information about how they connect. Graph traversal preserves and navigates relationships.',
};
