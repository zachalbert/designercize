import { useRef, useCallback } from 'react';

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playClick = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/button-down.mp3');
    }
    const clone = audioRef.current.cloneNode() as HTMLAudioElement;
    clone.volume = 0.5;
    clone.play().catch(() => {});
  }, []);

  return { playClick };
}
