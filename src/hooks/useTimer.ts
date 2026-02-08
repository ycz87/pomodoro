import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerPhase = 'work' | 'break';
export type TimerStatus = 'idle' | 'running' | 'paused';

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

interface UseTimerReturn {
  timeLeft: number;
  phase: TimerPhase;
  status: TimerStatus;
  start: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  reset: () => void;
}

export function useTimer(onComplete: (phase: TimerPhase) => void): UseTimerReturn {
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && status === 'running') {
      const completedPhase = phase;
      const nextPhase: TimerPhase = phase === 'work' ? 'break' : 'work';
      const nextDuration = nextPhase === 'work' ? WORK_DURATION : BREAK_DURATION;

      setPhase(nextPhase);
      setTimeLeft(nextDuration);
      setStatus('idle');
      onCompleteRef.current(completedPhase);
    }
  }, [timeLeft, status, phase]);

  const start = useCallback(() => {
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    setStatus('running');
  }, []);

  const skip = useCallback(() => {
    const nextPhase: TimerPhase = phase === 'work' ? 'break' : 'work';
    const nextDuration = nextPhase === 'work' ? WORK_DURATION : BREAK_DURATION;
    setPhase(nextPhase);
    setTimeLeft(nextDuration);
    setStatus('idle');
  }, [phase]);

  const reset = useCallback(() => {
    setPhase('work');
    setTimeLeft(WORK_DURATION);
    setStatus('idle');
  }, []);

  return { timeLeft, phase, status, start, pause, resume, skip, reset };
}
