import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getScoreColor, formatScore } from '@/lib/utils';

interface ScoreBarProps {
  score: number;
  tooltip?: string;
}

/**
 * Visual score indicator with color-coded bar and percentage
 */
export default function ScoreBar({ score, tooltip }: ScoreBarProps) {
  const scoreColor = getScoreColor(score);
  const widthPercent = score * 100;

  const barElement = (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full bg-${scoreColor} transition-all duration-300`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
      <span className={`text-xs font-mono text-${scoreColor} min-w-[45px] text-right`}>
        {formatScore(score)}
      </span>
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{barElement}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return barElement;
}
