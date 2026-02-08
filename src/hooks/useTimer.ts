import { useState, useEffect, useCallback, useRef } from 'react';
import type { PomodoroSettings } from '../types';

export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

interface UseTimerOptions {
  settings: PomodoroSettings;
  onComplete: (phase: TimerPhase) => void;
  onSkipWork: (elapsedSeconds: number) => void;
}

interface UseTimerReturn {
  timeLeft: number;
  phase: TimerPhase;
  status: TimerStatus;
  roundProgress: number;
  celebrating: boolean;
  celebrationStage: TimerPhase | null;
  dismissCelebration: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  abandon: () => void;
  reset: () => void;
}

function getDuration(phase: TimerPhase, settings: PomodoroSettings): number {
  switch (phase) {
    case 'work': return settings.workMinutes * 60;
    case 'shortBreak': return settings.shortBreakMinutes * 60;
    case 'longBreak': return settings.longBreakMinutes * 60;
  }
}

export function useTimer({ settings, onComplete, onSkipWork }: UseTimerOptions): UseTimerReturn {
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [roundProgress, setRoundProgress] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [celebrationStage, setCelebrationStage] = useState<TimerPhase | null>(null);
  // Generation counter — increments on phase transitions to force interval restart
  // when auto-start keeps status as 'running'
  const [generation, setGeneration] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const onSkipWorkRef = useRef(onSkipWork);
  const settingsRef = useRef(settings);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onSkipWorkRef.current = onSkipWork;
  }, [onSkipWork]);

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
  }, [status, generation]); // generation forces restart on auto-start transitions

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && status === 'running') {
      const completedPhase = phase;
      const s = settingsRef.current;

      let nextPhase: TimerPhase;
      let nextRoundProgress = roundProgress;

      if (completedPhase === 'work') {
        nextRoundProgress = roundProgress + 1;
        if (nextRoundProgress >= s.pomodorosPerRound) {
          nextPhase = 'longBreak';
        } else {
          nextPhase = 'shortBreak';
        }
      } else {
        if (completedPhase === 'longBreak') {
          nextRoundProgress = 0;
        }
        nextPhase = 'work';
      }

      setRoundProgress(nextRoundProgress);

      if (completedPhase === 'work') {
        setCelebrating(true);
        setCelebrationStage(completedPhase);
      }

      setPhase(nextPhase);
      setTimeLeft(getDuration(nextPhase, s));

      // Auto-start logic
      const shouldAutoStart = completedPhase === 'work'
        ? s.autoStartBreak
        : s.autoStartWork;

      if (shouldAutoStart) {
        // Keep status as 'running' but bump generation to restart the interval
        setGeneration((g) => g + 1);
      } else {
        setStatus('idle');
      }

      onCompleteRef.current(completedPhase);
    }
  }, [timeLeft, status, phase, roundProgress]);

  const start = useCallback(() => {
    setGeneration((g) => g + 1);
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    setGeneration((g) => g + 1);
    setStatus('running');
  }, []);

  const skip = useCallback(() => {
    const s = settingsRef.current;
    let nextPhase: TimerPhase;
    let nextRoundProgress = roundProgress;

    if (phase === 'work') {
      const totalSeconds = getDuration('work', s);
      const elapsedSeconds = totalSeconds - timeLeft;
      if (elapsedSeconds > 0) {
        onSkipWorkRef.current(elapsedSeconds);
      }
      nextRoundProgress = roundProgress + 1;
      if (nextRoundProgress >= s.pomodorosPerRound) {
        nextPhase = 'longBreak';
      } else {
        nextPhase = 'shortBreak';
      }
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
  }, [phase, roundProgress, timeLeft]);

  const abandon = useCallback(() => {
    const s = settingsRef.current;
    setTimeLeft(getDuration(phase, s));
    setStatus('idle');
    setCelebrating(false);
    setCelebrationStage(null);
  }, [phase]);

  const reset = useCallback(() => {
    setPhase('work');
    setTimeLeft(settingsRef.current.workMinutes * 60);
    setStatus('idle');
    setRoundProgress(0);
    setCelebrating(false);
    setCelebrationStage(null);
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebrating(false);
    setCelebrationStage(null);
  }, []);

  return { timeLeft, phase, status, roundProgress, celebrating, celebrationStage, dismissCelebration, start, pause, resume, skip, abandon, reset };
}
