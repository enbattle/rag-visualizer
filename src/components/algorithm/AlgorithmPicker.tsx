import { ALGORITHMS } from '@/config';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LATENCY_TOOLTIPS, IMPLEMENTATION_TOOLTIPS, QUALITY_TOOLTIPS } from '@/lib/tooltips';
import { ArrowRight } from 'lucide-react';

const LATENCY_STYLE: Record<string, string> = {
  low:    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  medium: 'bg-amber-500/10  text-amber-600  dark:text-amber-400',
  high:   'bg-rose-500/10   text-rose-600   dark:text-rose-400',
};

const QUALITY_STYLE: Record<string, string> = {
  baseline: 'bg-zinc-500/10    text-zinc-500   dark:text-zinc-400',
  medium:   'bg-sky-500/10     text-sky-600    dark:text-sky-400',
  high:     'bg-violet-500/10  text-violet-600 dark:text-violet-400',
  highest:  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

// Visual index number → accent for each algo row
const ACCENT = '#14b8a6';

interface Props {
  onSelect: (algorithmId: string) => void;
}

export default function AlgorithmPicker({ onSelect }: Props) {
  return (
    <div className="p-5">
      <div className="mb-5">
        <h2 className="font-display font-bold text-text-primary text-sm tracking-wide">
          Choose an Algorithm
        </h2>
        <p className="text-[10.5px] text-text-secondary mt-1 leading-relaxed">
          10 RAG patterns from baseline to production-grade. Step through each one interactively.
        </p>
      </div>

      <div className="space-y-2">
        {ALGORITHMS.map((algo, i) => (
          <button
            key={algo.id}
            onClick={() => onSelect(algo.id)}
            className="w-full text-left rounded-lg border border-border bg-bg-secondary hover:bg-bg-elevated transition-all duration-150 group overflow-hidden"
            style={{ borderLeft: `3px solid ${ACCENT}22` }}
          >
            <div className="px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  {/* Row number */}
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[9px] font-mono font-bold mt-0.5"
                    style={{ color: ACCENT, backgroundColor: `${ACCENT}18` }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <span
                      className="font-display font-semibold text-text-primary text-[12.5px] group-hover:text-[#14b8a6] transition-colors block"
                    >
                      {algo.name}
                    </span>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-0.5 line-clamp-1">
                      {algo.subtitle}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={`text-[8.5px] font-mono font-semibold px-1.5 py-0.5 rounded ${LATENCY_STYLE[algo.latency]}`}>
                            {algo.latency} latency
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{LATENCY_TOOLTIPS[algo.latency]}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={`text-[8.5px] font-mono font-semibold px-1.5 py-0.5 rounded ${LATENCY_STYLE[algo.implementation]}`}>
                            {algo.implementation} impl
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{IMPLEMENTATION_TOOLTIPS[algo.implementation]}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={`text-[8.5px] font-mono font-semibold px-1.5 py-0.5 rounded ${QUALITY_STYLE[algo.quality]}`}>
                            {algo.quality} quality
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{QUALITY_TOOLTIPS[algo.quality]}</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <ArrowRight
                  size={13}
                  className="flex-shrink-0 mt-1 text-text-muted group-hover:text-[#14b8a6] transition-colors"
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
