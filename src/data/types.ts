export type Difficulty = 'easy' | 'medium' | 'hard';

export type Scene = 'prompt' | 'countdown' | 'outOfTime' | 'about';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface Challenge {
  feature: string;
  useCase: string;
  audience: string;
  quote: string;
  happyResponse: boolean;
}

export interface DifficultyTiered {
  easy: string[];
  medium: string[];
  hard: string[];
}

export interface PromptData {
  inspiration: string[];
  features: DifficultyTiered;
  useCases: DifficultyTiered;
  audiences: DifficultyTiered;
  devices: DifficultyTiered;
  needs: DifficultyTiered;
}
