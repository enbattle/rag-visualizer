/**
 * Centralized tooltip configurations for algorithm metadata
 */

export const LATENCY_TOOLTIPS = {
  low: 'Fast response time - minimal additional processing overhead',
  medium: 'Moderate response time - some additional processing steps',
  high: 'Slower response time - multiple processing steps or iterations',
} as const;

export const IMPLEMENTATION_TOOLTIPS = {
  low: 'Simple to implement - straightforward architecture with few components',
  medium: 'Moderate complexity - requires additional components or integration',
  high: 'Complex implementation - multiple systems and sophisticated logic required',
} as const;

export const QUALITY_TOOLTIPS = {
  baseline: 'Standard retrieval quality - basic semantic search without enhancements',
  medium: 'Improved retrieval quality - enhanced relevance through additional techniques',
  high: 'High retrieval quality - advanced methods for better accuracy',
  highest: 'Best retrieval quality - state-of-the-art techniques for maximum accuracy',
} as const;
