import { useState, useEffect, useRef } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

const STEPS = [3, 2, 1, 'fun!'];

export function Countdown({ onComplete }: CountdownProps) {
  const [index, setIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          window.clearInterval(id);
          setTimeout(() => onCompleteRef.current(), 500);
          return prev;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center h-full min-h-[300px]" role="status" aria-live="assertive">
      <h1 className="text-6xl md:text-8xl font-[8008135] text-center">{STEPS[index]}</h1>
    </div>
  );
}
