import { ArrowClockwise } from '@phosphor-icons/react';
import { CrtScreen } from '../ui/CrtScreen';
import { RetroButton } from '../ui/RetroButton';
import { DifficultySelector } from '../features/DifficultySelector';
import { TimerControls } from '../features/TimerControls';
import type { Difficulty, TimerStatus } from '../../data/types';

import workoutSquatStill from '../../assets/images/illo-workout-squat-still.gif';
import workoutSquat from '../../assets/images/illo-workout-squat.gif';

interface ControlPanelProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onReload: () => void;
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

export function ControlPanel({
  difficulty,
  onDifficultyChange,
  onReload,
  timerMinutes,
  onTimerMinutesChange,
  displayMinutes,
  displaySeconds,
  timerStatus,
  onStart,
  onPause,
  onResume,
  onStop,
}: ControlPanelProps) {
  const isTimerActive = timerStatus === 'running' || timerStatus === 'paused';

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Instruction Screen */}
      <CrtScreen className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col justify-center p-3 flex-1 crt-scrollable">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <img
                src={isTimerActive ? workoutSquat : workoutSquatStill}
                width={72}
                height={72}
                alt="Workout character"
              />
            </div>
            <h2 className="font-[8008135] text-lg md:text-xl">Designercize</h2>
          </div>
          <div className="text-sm">
            <p className="mb-2">Random prompt generator for whiteboard design practice.</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Choose a difficulty</li>
              <li>Reload until you're happy</li>
              <li>Choose duration</li>
              <li>Hit Play</li>
            </ol>
          </div>
        </div>
      </CrtScreen>

      {/* Controls */}
      <div className="flex flex-col gap-2">
        <DifficultySelector
          difficulty={difficulty}
          onSelect={onDifficultyChange}
          disabled={isTimerActive}
        />
        <RetroButton
          color="pink"
          small
          onClick={onReload}
          disabled={isTimerActive}
          className="w-full"
        >
          Reload Challenge&nbsp;&nbsp;<ArrowClockwise size={18} weight="bold" />
        </RetroButton>

        <TimerControls
          timerMinutes={timerMinutes}
          onTimerMinutesChange={onTimerMinutesChange}
          displayMinutes={displayMinutes}
          displaySeconds={displaySeconds}
          timerStatus={timerStatus}
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onStop={onStop}
        />
      </div>
    </div>
  );
}
