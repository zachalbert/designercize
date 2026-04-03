import { Link } from 'react-router-dom';
import { ShareNetwork } from '@phosphor-icons/react';
import { CrtScreen } from '../ui/CrtScreen';
import { RetroButton } from '../ui/RetroButton';
import { PromptDisplay } from '../features/PromptDisplay';
import { Countdown } from '../features/Countdown';
import { OutOfTime } from '../features/OutOfTime';
import type { Challenge, Scene } from '../../data/types';
import { buildChallengeUrl } from '../../lib/prompt-utils';

import logoMezzo from '../../assets/images/logo-mezzo.svg';

interface MainDisplayProps {
  scene: Scene;
  challenge: Challenge;
  onCountdownComplete: () => void;
  onShare?: () => void;
}

export function MainDisplay({ scene, challenge, onCountdownComplete, onShare }: MainDisplayProps) {
  const handleShare = () => {
    const url = window.location.origin + buildChallengeUrl(challenge);
    navigator.clipboard.writeText(url).then(() => {
      onShare?.();
    }).catch(() => {
      // Fallback: just alert the URL
      window.prompt('Copy this URL:', url);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 flex flex-col">
        <CrtScreen className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 crt-scrollable p-2">
            {scene === 'prompt' && <PromptDisplay challenge={challenge} />}
            {scene === 'countdown' && <Countdown onComplete={onCountdownComplete} />}
            {scene === 'outOfTime' && <OutOfTime challenge={challenge} />}
          </div>
        </CrtScreen>
      </div>

      {scene === 'prompt' && (
        <div className="flex justify-center mt-2">
          <RetroButton
            color="blue"
            small
            onClick={handleShare}
            aria-label="Share challenge"
            className="px-3"
          >
            <ShareNetwork size={16} weight="bold" />
            <span className="text-xs">Share</span>
          </RetroButton>
        </div>
      )}

      <div className="flex items-center justify-center mt-auto pt-3 pb-1">
        <span className="mr-2 text-sm">Made by</span>
        <Link to="/about" className="inline-flex items-center gap-2 no-underline">
          <RetroButton color="blue" small className="px-3">
            <img src={logoMezzo} alt="" width={20} height={20} className="relative z-10" style={{ filter: 'brightness(0) invert(1)' }} />
          </RetroButton>
        </Link>
        <span className="ml-2 text-sm">Mezzotent</span>
      </div>
    </div>
  );
}
