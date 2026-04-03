import { useCallback, useState } from 'react';
import { TypedText } from '../ui/TypedText';
import type { Challenge } from '../../data/types';

import workoutHeadStill from '../../assets/images/illo-workout-head-still.gif';
import workoutHead from '../../assets/images/illo-workout-head.gif';

interface PromptDisplayProps {
  challenge: Challenge;
}

interface PromptLineProps {
  label: string;
  text: string;
  delay: number;
  onComplete?: () => void;
}

function PromptLine({ label, text, delay, onComplete }: PromptLineProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-baseline gap-0 lg:gap-3 mb-3">
      <div className="font-weight-fat text-right whitespace-nowrap">{label}</div>
      <div className="text-center lg:text-left">
        <TypedText text={text} startDelay={delay} onComplete={onComplete} />
      </div>
    </div>
  );
}

export function PromptDisplay({ challenge }: PromptDisplayProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  const handleLastComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return (
    <div className="flex flex-col items-center py-3 w-full">
      <img
        src={isAnimating ? workoutHead : workoutHeadStill}
        width={96}
        height={96}
        alt="Drill instructor"
        className="mb-4"
      />
      <div className="talk-bubble text-center">
        <div className="talk-bubble-arrow" />
        <div className="w-full px-4 py-3">
          <PromptLine label="Design:" text={challenge.feature} delay={0} />
          <PromptLine label="For:" text={challenge.useCase} delay={300} />
          <PromptLine label="To help:" text={challenge.audience} delay={600} onComplete={handleLastComplete} />
        </div>
        <div className="py-2">- - - &bull; &bull;&nbsp;&nbsp;- - - &bull; &bull;</div>
        <div className="quote-box">{challenge.quote}</div>
      </div>
    </div>
  );
}
