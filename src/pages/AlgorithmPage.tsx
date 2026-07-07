import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ALGORITHMS } from '@/config';
import AlgorithmView from '@/components/algorithm/AlgorithmView';

export default function AlgorithmPage() {
  const { algorithmSlug = '' } = useParams();
  const meta = ALGORITHMS.find((a) => a.id === algorithmSlug);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-5 pt-5 pb-1">
        <Link
          to="/"
          className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors text-xs font-mono"
        >
          <ChevronLeft size={13} />
          all algorithms
        </Link>
      </div>
      <div className="px-5 pt-2">
        <h1 className="font-display font-bold text-xl text-text-primary">
          {meta?.name ?? algorithmSlug}
        </h1>
        {meta?.subtitle && (
          <p className="text-[12px] text-text-muted mt-1">{meta.subtitle}</p>
        )}
      </div>
      <AlgorithmView algorithmId={algorithmSlug} />
    </div>
  );
}
