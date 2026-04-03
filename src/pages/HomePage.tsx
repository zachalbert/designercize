import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ControlPanel } from '../components/layout/ControlPanel';
import { MainDisplay } from '../components/layout/MainDisplay';
import { useTimer } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import { generateChallenge, challengeFromParams, buildChallengeUrl } from '../lib/prompt-utils';
import type { Difficulty, Scene, Challenge } from '../data/types';

import { RetroButton } from '../components/ui/RetroButton';
import logoMezzo from '../assets/images/logo-mezzo.svg';

function updateUrlWithChallenge(challenge: Challenge) {
  const url = buildChallengeUrl(challenge);
  window.history.replaceState(null, '', url);
}

export function HomePage() {
  const [searchParams] = useSearchParams();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [challenge, setChallenge] = useState<Challenge>(() => {
    const fromUrl = challengeFromParams(searchParams);
    if (fromUrl) return fromUrl;
    return generateChallenge('easy');
  });
  const [scene, setScene] = useState<Scene>('prompt');
  const [timerMinutes, setTimerMinutes] = useState(15);
  const { playClick } = useSound();

  useEffect(() => {
    updateUrlWithChallenge(challenge);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeUp = useCallback(() => {
    setScene('outOfTime');
  }, []);

  const timer = useTimer(handleTimeUp);

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    playClick();
    setDifficulty(d);
    const newChallenge = generateChallenge(d);
    setChallenge(newChallenge);
    updateUrlWithChallenge(newChallenge);
  }, [playClick]);

  const handleReload = useCallback(() => {
    playClick();
    const newChallenge = generateChallenge(difficulty);
    setChallenge(newChallenge);
    updateUrlWithChallenge(newChallenge);
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

  const handleShowAbout = useCallback(() => {
    setScene('about');
  }, []);

  const handleBackFromAbout = useCallback(() => {
    setScene('prompt');
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ padding: 'var(--space-layout)' }}>
      {/* Main grid — both columns same height so controls bottom = CRT screen bottom */}
      <div
        className="grid grid-cols-1 md:grid-cols-[minmax(280px,1fr)_2fr] flex-1 min-h-0"
        style={{ gap: 'var(--space-layout)' }}
      >
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
            onShowAbout={handleShowAbout}
            onBackFromAbout={handleBackFromAbout}
          />
        </div>
      </div>

      {/* Footer — below the grid, aligned to right column */}
      <div className="flex items-center justify-center pt-3 pb-1 md:pl-[calc(33.333%+var(--space-layout))]">
        <span className="mr-2">Made by</span>
        <button type="button" onClick={handleShowAbout} className="inline-flex items-center gap-2 no-underline cursor-pointer bg-transparent border-none p-0">
          <RetroButton color="blue" small className="px-3">
            <img src={logoMezzo} alt="" width={20} height={20} className="relative z-10" style={{ filter: 'brightness(0) invert(1)' }} />
          </RetroButton>
        </button>
        <span className="ml-2">Mezzotent</span>
      </div>
    </div>
  );
}
