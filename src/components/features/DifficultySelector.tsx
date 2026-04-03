import { RetroButton } from '../ui/RetroButton';
import type { Difficulty } from '../../data/types';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onSelect: (d: Difficulty) => void;
  disabled?: boolean;
}

const levels: Difficulty[] = ['easy', 'medium', 'hard'];

export function DifficultySelector({ difficulty, onSelect, disabled }: DifficultySelectorProps) {
  return (
    <div className="retro-btn-group">
      {levels.map((level) => (
        <RetroButton
          key={level}
          color="blue"
          small
          selected={difficulty === level}
          disabled={disabled}
          onClick={() => onSelect(level)}
          aria-pressed={difficulty === level}
        >
          <span className="hidden sm:inline">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
          <span className="sm:hidden">{level.charAt(0).toUpperCase()}</span>
        </RetroButton>
      ))}
    </div>
  );
}
