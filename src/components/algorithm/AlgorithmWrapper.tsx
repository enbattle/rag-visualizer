import { useMemo, useState, useEffect, Fragment, type ReactNode, type JSX } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAnimationStep } from '@/hooks/useAnimationStep';
import CodePanel from './CodePanel';
import RetrievalPanel from './RetrievalPanel';
import PipelineDiagram from '@/components/diagram/PipelineDiagram';
import { Play, Pause, ChevronLeft, ChevronRight, Lightbulb, X } from 'lucide-react';
import type { AlgorithmDemoData, ChunkData, CodeSnippet } from './types';
import type { PipelineLayout } from '@/components/diagram/types';

interface AlgorithmWrapperProps {
  demoData: AlgorithmDemoData;
  codeSnippets: CodeSnippet;
  /** Optional visualization rendered below the step walkthrough (ReActTrace, KnowledgeGraph, EmbeddingSpace) */
  specialVisualization?: ReactNode | ((currentStep: number) => JSX.Element);
  overviewText?: string;
  /** Optional animated pipeline diagram rendered above the step explanation */
  pipelineLayout?: PipelineLayout;
}

export default function AlgorithmWrapper({
  demoData,
  codeSnippets,
  specialVisualization,
  overviewText,
  pipelineLayout,
}: AlgorithmWrapperProps) {
  const { currentStep, isPlaying, isComplete, play, pause, nextStep, prevStep, setStep } =
    useAnimationStep(demoData.steps);

  const [showInsight, setShowInsight] = useState(true);

  const currentStepData = demoData.steps[currentStep];

  useEffect(() => {
    if (!isComplete) setShowInsight(true);
  }, [isComplete]);

  const currentChunks = useMemo(() => {
    let chunks: ChunkData[] = [];
    for (let i = 0; i <= currentStep; i++) {
      if (demoData.steps[i].retrievalUpdate) {
        chunks = demoData.steps[i].retrievalUpdate!;
      }
    }
    return chunks;
  }, [currentStep, demoData.steps]);

  const renderedSpecialViz = specialVisualization
    ? typeof specialVisualization === 'function'
      ? specialVisualization(currentStep)
      : specialVisualization
    : null;

  return (
    <div className="space-y-6">
      {/* Overview — no heading, just a styled intro paragraph */}
      {overviewText && (
        <p className="text-[13px] text-text-secondary leading-relaxed pb-5 border-b border-border">
          {overviewText}
        </p>
      )}

      {/* Pipeline Walkthrough */}
      <div>
        {/* Section label + counter */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-mono tracking-[0.2em] text-text-muted uppercase">
            Pipeline Walkthrough
          </span>
          <span className="text-[9px] font-mono text-text-muted tabular-nums">
            {currentStep + 1} / {demoData.steps.length}
          </span>
        </div>

        {/* Step indicator — numbered circles connected by lines, clickable */}
        <div className="flex items-center mb-4">
          {demoData.steps.map((_, i) => (
            <Fragment key={i}>
              <button
                onClick={() => { pause(); setStep(i); }}
                aria-label={`Go to step ${i + 1}`}
                className={`
                  flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center
                  text-[7px] font-mono font-bold border transition-all duration-150
                  ${i === currentStep
                    ? 'bg-teal-500/20 border-teal-500 text-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.3)]'
                    : i < currentStep
                    ? 'bg-border/50 border-border/80 text-text-muted/70'
                    : 'bg-transparent border-border/40 text-text-muted/30'
                  }
                `}
              >
                {i + 1}
              </button>
              {i < demoData.steps.length - 1 && (
                <div
                  className="flex-1 h-px transition-colors duration-300"
                  style={{ backgroundColor: i < currentStep ? 'rgba(20,184,166,0.35)' : 'rgb(var(--color-border))' }}
                />
              )}
            </Fragment>
          ))}
        </div>

        {/* Pipeline diagram — animated node/edge graph, kept outside the AnimatePresence
            below so its own per-node/edge state persists across step changes instead of
            unmounting/remounting with the explanation text. */}
        {pipelineLayout && (
          <div className="h-[240px] mb-3">
            <PipelineDiagram layout={pipelineLayout} steps={demoData.steps} currentStep={currentStep} />
          </div>
        )}

        {/* Step explanation card */}
        <div className="rounded-xl border border-border bg-bg-secondary px-4 py-3.5 mb-3 min-h-[68px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.14 }}
              className="text-[13px] text-text-secondary leading-relaxed"
            >
              {currentStepData.explanation}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-1.5 py-1 rounded hover:bg-bg-elevated"
          >
            <ChevronLeft size={11} />
            prev
          </button>

          <button
            onClick={isPlaying ? pause : play}
            className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.15em] uppercase text-text-muted hover:text-text-primary transition-colors px-2 py-1 rounded hover:bg-bg-elevated"
          >
            {isPlaying ? <Pause size={9} /> : <Play size={9} />}
            {isPlaying ? 'pause' : 'auto'}
          </button>

          <button
            onClick={nextStep}
            disabled={isComplete}
            className="flex items-center gap-1 text-[11px] font-mono text-text-muted hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-1.5 py-1 rounded hover:bg-bg-elevated"
          >
            next
            <ChevronRight size={11} />
          </button>
        </div>
      </div>

      {/* Key insight banner — visible on completion */}
      {isComplete && showInsight && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.07] px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[9.5px] font-mono font-semibold text-amber-500 mb-1 tracking-[0.1em] uppercase">
                Key Insight
              </p>
              <p className="text-[12px] text-text-secondary leading-relaxed">{demoData.insight}</p>
            </div>
            <button
              onClick={() => setShowInsight(false)}
              className="flex-shrink-0 p-0.5 hover:bg-amber-500/20 rounded transition-colors"
              aria-label="Dismiss insight"
            >
              <X className="h-3 w-3 text-text-muted hover:text-text-primary" />
            </button>
          </div>
        </div>
      )}

      {/* Special visualization (ReActTrace, KnowledgeGraph, EmbeddingSpace) */}
      {renderedSpecialViz && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="h-[340px]">{renderedSpecialViz}</div>
        </div>
      )}

      {/* Retrieved context — live data that accumulates with steps */}
      {currentChunks.length > 0 && (
        <div className="border-t border-border pt-5">
          <h2 className="text-base font-bold text-text-primary mb-3">Retrieved Context</h2>
          <div className="h-[280px]">
            <RetrievalPanel chunks={currentChunks} />
          </div>
        </div>
      )}

      {/* Code implementation */}
      <div className="border-t border-border pt-5">
        <CodePanel codeSnippets={codeSnippets} />
      </div>
    </div>
  );
}
