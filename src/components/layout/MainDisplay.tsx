import { CrtScreen } from '../ui/CrtScreen';
import { PromptDisplay } from '../features/PromptDisplay';
import { Countdown } from '../features/Countdown';
import { OutOfTime } from '../features/OutOfTime';
import { AboutContent } from '../features/AboutContent';
import type { Challenge, Scene } from '../../data/types';

interface MainDisplayProps {
  scene: Scene;
  challenge: Challenge;
  onCountdownComplete: () => void;
  onShowAbout: () => void;
  onBackFromAbout: () => void;
}

export function MainDisplay({ scene, challenge, onCountdownComplete, onShowAbout, onBackFromAbout }: MainDisplayProps) {
  return (
    <CrtScreen className="h-full flex flex-col min-h-0">
      <div className="flex-1 crt-scrollable" style={{ padding: 'var(--space-screen-padding)' }}>
        {scene === 'prompt' && <PromptDisplay challenge={challenge} />}
        {scene === 'countdown' && <Countdown onComplete={onCountdownComplete} />}
        {scene === 'outOfTime' && <OutOfTime challenge={challenge} />}
        {scene === 'about' && <AboutContent onBack={onBackFromAbout} />}
      </div>
    </CrtScreen>
  );
}
