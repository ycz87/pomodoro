import { useState, useEffect, useCallback, useRef } from 'react';
import type { PomodoroSettings } from '../types';

export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

interface UseTimerOptions {
  settings: PomodoroSettings;
  onComplete: (phase: TimerPhase) => void;
}

interface UseTimerReturn {
  timeLeft: number;
  phase: TimerPhase;
  status: TimerStatus;
  roundProgress: number; // how many pomodoros completed in current round (0-based)
  start: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  reset: () => void;
}

function getDuration(phase: TimerPhase, settings: PomodoroSettings): number {
  switch (phase) {
    case 'work': return settings.workMinutes * 60;
    case 'shortBreak': return settings.shortBreakMinutes * 60;
    case 'longBreak': return settings.longBreakMinutes * 60;
  }
}

export function useTimer({ settings, onComplete }: UseTimerOptions): UseTimerReturn {
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [roundProgress, setRoundProgress] = useState(0); // pomodoros completed in current round
  const onCompleteRef = useRef(onComplete);
  const settingsRef = useRef(settings);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Update timeLeft when settings change and timer is idle
  useEffect(() => {
    if (status === 'idle') {
      setTimeLeft(getDuration(phase, settings));
    }
  }, [settings, status, phase]);

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
      const s = settingsRef.current;

      let nextPhase: TimerPhase;
      let nextRoundProgress = roundProgress;

      if (completedPhase === 'work') {
        nextRoundProgress = roundProgress + 1;
        // Check if we should do a long break
        if (nextRoundProgress >= s.pomodorosPerRound) {
          nextPhase = 'longBreak';
        } else {
          nextPhase = 'shortBreak';
        }
      } else {
        // After any break, go back to work
        if (completedPhase === 'longBreak') {
          nextRoundProgress = 0; // reset round
        }
        nextPhase = 'work';
      }

      setRoundProgress(nextRoundProgress);
      setPhase(nextPhase);
      setTimeLeft(getDuration(nextPhase, s));
      setStatus('idle');
      onCompleteRef.current(completedPhase);
    }
  }, [timeLeft, status, phase, roundProgress]);

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
    const s = settingsRef.current;
    let nextPhase: TimerPhase;
    let nextRoundProgress = roundProgress;

    if (phase === 'work') {
      // Skipping work doesn't count as completed
      nextPhase = 'shortBreak';
    } else {
      if (phase === 'longBreak') {
        nextRoundProgress = 0;
      }
      nextPhase = 'work';
    }

    setRoundProgress(nextRoundProgress);
    setPhase(nextPhase);
    setTimeLeft(getDuration(nextPhase, s));
    setStatus('idle');
  }, [phase, roundProgress]);

  const reset = useCallback(() => {
    setPhase('work');
    setTimeLeft(settingsRef.current.workMinutes * 60);
    setStatus('idle');
    setRoundProgress(0);
  }, []);

  return { timeLeft, phase, status, roundProgress, start, pause, resume, skip, reset };
}
