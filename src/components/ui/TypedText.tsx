import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface TypedTextProps {
  text: string;
  typeSpeed?: number;
  startDelay?: number;
  onComplete?: () => void;
}

export function TypedText({ text, typeSpeed = 40, startDelay = 0, onComplete }: TypedTextProps) {
  const elRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<Typed | null>(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!elRef.current) return;

    if (reducedMotion.current) {
      elRef.current.textContent = text;
      onComplete?.();
      return;
    }

    typedRef.current = new Typed(elRef.current, {
      strings: [text],
      typeSpeed,
      startDelay,
      showCursor: false,
      onComplete: () => onComplete?.(),
    });

    return () => {
      typedRef.current?.destroy();
    };
  }, [text, typeSpeed, startDelay, onComplete]);

  return <span ref={elRef} />;
}
