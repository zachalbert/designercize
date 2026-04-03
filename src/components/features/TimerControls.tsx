import { useCallback } from 'react';
import { CaretUp, CaretDown, Play, Pause, Stop } from '@phosphor-icons/react';
import { RetroButton } from '../ui/RetroButton';
import { CrtScreen } from '../ui/CrtScreen';
import type { TimerStatus } from '../../data/types';

interface TimerControlsProps {
  timerMinutes: number;
  onTimerMinutesChange: (m: number) => void;
  displayMinutes: string;
  displaySeconds: string;
  timerStatus: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const MIN_MINUTES = 5;
const MAX_MINUTES = 60;
const STEP = 5;

export function TimerControls({
  timerMinutes,
  onTimerMinutesChange,
  displayMinutes,
  displaySeconds,
  timerStatus,
  onStart,
  onPause,
  onResume,
  onStop,
}: TimerControlsProps) {
  const isRunning = timerStatus === 'running';
  const isPaused = timerStatus === 'paused';
  const isIdle = timerStatus === 'idle';
  const showConfiguredTime = isIdle;

  const decrease = useCallback(() => {
    const next = Math.max(MIN_MINUTES, timerMinutes - STEP);
    onTimerMinutesChange(next);
  }, [timerMinutes, onTimerMinutesChange]);

  const increase = useCallback(() => {
    const next = Math.min(MAX_MINUTES, timerMinutes + STEP);
    onTimerMinutesChange(next);
  }, [timerMinutes, onTimerMinutesChange]);

  const configuredMinutes = String(timerMinutes).padStart(2, '0');

  return (
    <div>
      <div className="flex mb-3 items-stretch">
        <RetroButton
          color="blue"
          small
          onClick={decrease}
          disabled={!isIdle || timerMinutes <= MIN_MINUTES}
          aria-label="Decrease time"
          className="!rounded-r-none !border-r-0"
        >
          <CaretDown size={20} weight="bold" />
        </RetroButton>
        <CrtScreen className="flex-1 flex items-center justify-center py-2">
          <div className="timer-display text-2xl md:text-3xl" aria-live="polite">
            <span>{showConfiguredTime ? configuredMinutes : displayMinutes}</span>
            <span>:</span>
            <span>{showConfiguredTime ? '00' : displaySeconds}</span>
          </div>
        </CrtScreen>
        <RetroButton
          color="blue"
          small
          onClick={increase}
          disabled={!isIdle || timerMinutes >= MAX_MINUTES}
          aria-label="Increase time"
          className="!rounded-l-none !border-l-0"
        >
          <CaretUp size={20} weight="bold" />
        </RetroButton>
      </div>

      <div className="retro-btn-group">
        <RetroButton
          color="green"
          onClick={isPaused ? onResume : onStart}
          disabled={isRunning}
          aria-label="Play"
        >
          <Play size={24} weight="fill" />
        </RetroButton>
        <RetroButton
          color="yellow"
          onClick={onPause}
          disabled={!isRunning}
          aria-label="Pause"
        >
          <Pause size={24} weight="fill" />
        </RetroButton>
        <RetroButton
          color="red"
          onClick={onStop}
          disabled={isIdle}
          aria-label="Stop"
        >
          <Stop size={24} weight="fill" />
        </RetroButton>
      </div>
    </div>
  );
}
