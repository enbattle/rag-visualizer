import { useNavigate } from 'react-router-dom';
import AlgorithmPicker from '@/components/algorithm/AlgorithmPicker';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="px-5 pt-10 pb-2">
        <h1 className="font-display font-bold text-2xl text-text-primary tracking-tight">
          RAG Visualizer
        </h1>
        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
          10 retrieval-augmented generation architectures, explained step by step — from
          baseline vector search to agentic multi-hop retrieval — with the real Python
          behind each one.
        </p>
      </div>
      <AlgorithmPicker onSelect={(id) => navigate(`/${id}`)} />
    </div>
  );
}
