import { useState, useCallback, useEffect, useRef } from 'react';
import { CONFIG } from '@/config';
import type { AnimationStep } from '@/components/algorithm/types';

interface UseAnimationStepReturn {
  currentStep: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  isComplete: boolean;
}

/**
 * Manages algorithm animation playback state and controls
 */
export function useAnimationStep(steps: AnimationStep[]): UseAnimationStepReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const isComplete = currentStep === steps.length - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStep(0);
    setIsPlaying(false);
  }, [clearTimer]);

  const play = useCallback(() => {
    if (isComplete) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timerRef.current = window.setTimeout(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setIsPlaying(false);
          }
          return next;
        });
      }, CONFIG.STEP_DURATION_MS);
    }

    return clearTimer;
  }, [isPlaying, currentStep, steps.length, clearTimer]);

  return {
    currentStep,
    isPlaying,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    setStep: setCurrentStep,
    isComplete,
  };
}
