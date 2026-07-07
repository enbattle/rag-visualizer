import ChunkCard from './ChunkCard';
import type { ChunkData } from './types';

interface RetrievalPanelProps {
  chunks: ChunkData[];
  title?: string;
}

/**
 * Panel displaying all retrieved chunks with live updates during animation
 */
export default function RetrievalPanel({ chunks, title = 'Retrieved Context' }: RetrievalPanelProps) {
  return (
    <div className="h-full flex flex-col bg-bg-secondary border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-bg-elevated">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {chunks.length > 0 && (
          <p className="text-xs text-text-muted mt-1">
            {chunks.length} chunk{chunks.length !== 1 ? 's' : ''} retrieved
          </p>
        )}
      </div>

      {/* Chunk list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {chunks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-text-muted">No chunks retrieved yet</p>
          </div>
        ) : (
          chunks.map((chunk, index) => (
            <ChunkCard key={`${chunk.rank}-${chunk.source}`} chunk={chunk} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
