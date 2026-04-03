import { useState, useRef, useCallback } from 'react';
import type { TimerStatus } from '../data/types';

interface UseTimerReturn {
  remainingMs: number;
  status: TimerStatus;
  displayMinutes: string;
  displaySeconds: string;
  start: (durationMinutes: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useTimer(onComplete: () => void): UseTimerReturn {
  const [remainingMs, setRemainingMs] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number>(0);
  const pausedRemainingRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const remaining = Math.max(0, endTimeRef.current - now);
    setRemainingMs(remaining);

    if (remaining <= 0) {
      clearTimer();
      setStatus('idle');
      onComplete();
    }
  }, [clearTimer, onComplete]);

  const start = useCallback((durationMinutes: number) => {
    clearTimer();
    const durationMs = durationMinutes * 60 * 1000;
    endTimeRef.current = Date.now() + durationMs;
    setRemainingMs(durationMs);
    setStatus('running');
    intervalRef.current = window.setInterval(tick, 1000);
  }, [clearTimer, tick]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    clearTimer();
    pausedRemainingRef.current = Math.max(0, endTimeRef.current - Date.now());
    setRemainingMs(pausedRemainingRef.current);
    setStatus('paused');
  }, [status, clearTimer]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    endTimeRef.current = Date.now() + pausedRemainingRef.current;
    setStatus('running');
    intervalRef.current = window.setInterval(tick, 1000);
  }, [status, tick]);

  const stop = useCallback(() => {
    clearTimer();
    setRemainingMs(0);
    setStatus('idle');
  }, [clearTimer]);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const displayMinutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const displaySeconds = String(totalSeconds % 60).padStart(2, '0');

  return {
    remainingMs,
    status,
    displayMinutes,
    displaySeconds,
    start,
    pause,
    resume,
    stop,
  };
}
