import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import ScoreBar from './ScoreBar';
import { FileText, Image as ImageIcon, Table2 } from 'lucide-react';
import type { ChunkData } from './types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ChunkCardProps {
  chunk: ChunkData;
  index: number;
}

/**
 * Card displaying a single retrieved chunk with metadata and score
 */
export default function ChunkCard({ chunk, index }: ChunkCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const getModalityIcon = () => {
    switch (chunk.modality) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'table':
        return <Table2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getModalityLabel = () => {
    switch (chunk.modality) {
      case 'image':
        return 'Image';
      case 'table':
        return 'Table';
      default:
        return 'Text';
    }
  };

  return (
    <motion.div
      initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={`bg-bg-elevated border border-border rounded-lg p-4 space-y-3 ${
        chunk.isRejected ? 'opacity-50' : ''
      }`}
    >
      {/* Header: rank + modality badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-semibold text-text-primary">
            #{chunk.rank}
          </span>
          {chunk.modality && (
            <Badge variant="default" className="flex items-center gap-1 text-xs">
              {getModalityIcon()}
              {getModalityLabel()}
            </Badge>
          )}
        </div>
        {chunk.isRejected && (
          <Badge variant="low" className="text-xs">
            Rejected
          </Badge>
        )}
      </div>

      {/* Content */}
      <p
        className={`text-sm text-text-secondary leading-relaxed ${
          chunk.isRejected ? 'line-through' : ''
        }`}
      >
        {chunk.content}
      </p>

      {/* Footer: source + score */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-text-muted font-mono truncate max-w-[140px]">
          {chunk.source}
        </span>
        <ScoreBar score={chunk.score} tooltip={chunk.tooltip} />
      </div>
    </motion.div>
  );
}
