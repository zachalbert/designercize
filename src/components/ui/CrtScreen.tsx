import type { ReactNode } from 'react';

interface CrtScreenProps {
  children: ReactNode;
  className?: string;
}

export function CrtScreen({ children, className = '' }: CrtScreenProps) {
  return (
    <div className={`crt-screen ${className}`}>
      {children}
    </div>
  );
}
