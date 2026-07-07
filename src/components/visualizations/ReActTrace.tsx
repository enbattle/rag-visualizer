import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Brain, Zap, Eye } from 'lucide-react';
import type { ReActEntry } from '@/components/algorithm/types';

interface ReActTraceProps {
  entries: ReActEntry[];
  currentIteration?: number;
}

type EntryType = ReActEntry['type'];

const ENTRY_META: Record<EntryType, { icon: React.ReactNode; color: string; label: string }> = {
  thought:     { icon: <Brain className="w-4 h-4" />, color: 'text-text-secondary', label: 'Thought'     },
  action:      { icon: <Zap className="w-4 h-4" />,   color: 'text-node-query',     label: 'Action'      },
  observation: { icon: <Eye className="w-4 h-4" />,   color: 'text-node-data',      label: 'Observation' },
};

export default function ReActTrace({ entries, currentIteration }: ReActTraceProps) {
  const prefersReducedMotion = useReducedMotion();

  const groupedEntries = useMemo(
    () =>
      entries.reduce((acc, entry) => {
        if (!acc[entry.iteration]) acc[entry.iteration] = [];
        acc[entry.iteration].push(entry);
        return acc;
      }, {} as Record<number, ReActEntry[]>),
    [entries]
  );

  return (
    <div className="h-full flex flex-col bg-bg-secondary border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-bg-elevated">
        <h3 className="text-sm font-semibold text-text-primary">ReAct Trace</h3>
        <p className="text-xs text-text-muted mt-1">
          {Object.keys(groupedEntries).length} iteration
          {Object.keys(groupedEntries).length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Trace entries */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {Object.entries(groupedEntries).map(([iteration, iterEntries]) => {
          const iterNum = parseInt(iteration);
          const isActive = currentIteration === iterNum;

          return (
            <motion.div
              key={iteration}
              initial={!prefersReducedMotion ? { opacity: 0, x: -20 } : {}}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: iterNum * 0.2 }}
              className={`space-y-2 ${isActive ? 'ring-2 ring-node-query rounded-lg p-3' : ''}`}
            >
              <div className="text-xs font-semibold text-text-primary font-mono mb-2">
                Iteration {iterNum}
              </div>

              {iterEntries.map((entry, index) => {
                const meta = ENTRY_META[entry.type];
                return (
                  <motion.div
                    key={`${iteration}-${index}`}
                    initial={!prefersReducedMotion ? { opacity: 0, y: 10 } : {}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: iterNum * 0.2 + index * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className={`flex items-center gap-1 min-w-[100px] ${meta.color}`}>
                      {meta.icon}
                      <span className="text-xs font-medium">[{meta.label}]</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed flex-1">
                      {entry.content}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}

        {entries.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-text-muted">No trace entries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
