import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns score color based on threshold ranges
 */
export function getScoreColor(score: number): string {
  if (score >= 0.75) return 'score-high';
  if (score >= 0.5) return 'score-medium';
  return 'score-low';
}

/**
 * Formats score as percentage with one decimal
 */
export function formatScore(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}
