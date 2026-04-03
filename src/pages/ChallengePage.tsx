import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ControlPanel } from '../components/layout/ControlPanel';
import { MainDisplay } from '../components/layout/MainDisplay';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { generateChallenge, challengeFromParams } from '../lib/prompt-utils';
import type { Difficulty, Scene, Challenge } from '../data/types';

export function ChallengePage() {
  const [searchParams] = useSearchParams();
  const initialChallenge = useMemo(
    () => challengeFromParams(searchParams) ?? generateChallenge('easy'),
    [searchParams]
  );

  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [challenge, setChallenge] = useState<Challenge>(initialChallenge);
  const [scene, setScene] = useState<Scene>('prompt');
  const [timerMinutes, setTimerMinutes] = useState(15);
  const { playClick } = useSound();

  const handleTimeUp = useCallback(() => {
    setScene('outOfTime');
  }, []);

  const timer = useTimer(handleTimeUp);

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    playClick();
    setDifficulty(d);
    setChallenge(generateChallenge(d));
  }, [playClick]);

  const handleReload = useCallback(() => {
    playClick();
    setChallenge(generateChallenge(difficulty));
  }, [difficulty, playClick]);

  const handleStart = useCallback(() => {
    playClick();
    setScene('countdown');
  }, [playClick]);

  const handleCountdownComplete = useCallback(() => {
    setScene('prompt');
    timer.start(timerMinutes);
  }, [timer, timerMinutes]);

  const handlePause = useCallback(() => {
    playClick();
    timer.pause();
  }, [timer, playClick]);

  const handleResume = useCallback(() => {
    playClick();
    timer.resume();
  }, [timer, playClick]);

  const handleStop = useCallback(() => {
    playClick();
    timer.stop();
    setScene('prompt');
  }, [timer, playClick]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(280px,1fr)_2fr] gap-2 h-full p-2">
      <div className="order-2 md:order-1">
        <ControlPanel
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onReload={handleReload}
          timerMinutes={timerMinutes}
          onTimerMinutesChange={setTimerMinutes}
          displayMinutes={timer.displayMinutes}
          displaySeconds={timer.displaySeconds}
          timerStatus={timer.status}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
        />
      </div>
      <div className="order-1 md:order-2 min-h-0">
        <MainDisplay
          scene={scene}
          challenge={challenge}
          onCountdownComplete={handleCountdownComplete}
        />
      </div>
    </div>
  );
}
