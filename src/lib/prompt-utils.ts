import { prompts } from '../data/prompts';
import type { Challenge, Difficulty } from '../data/types';

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateChallenge(difficulty: Difficulty): Challenge {
  return {
    feature: pickRandom(prompts.features[difficulty]),
    useCase: pickRandom(prompts.useCases[difficulty]),
    audience: pickRandom(prompts.audiences[difficulty]),
    quote: pickRandom(prompts.inspiration),
    happyResponse: Math.random() > 0.5,
  };
}

export function challengeFromParams(params: URLSearchParams): Challenge | null {
  const design = params.get('design');
  const forParam = params.get('for');
  const toHelp = params.get('to-help');

  if (!design || !forParam || !toHelp) return null;

  return {
    feature: unslugify(design),
    useCase: unslugify(forParam),
    audience: unslugify(toHelp),
    quote: pickRandom(prompts.inspiration),
    happyResponse: Math.random() > 0.5,
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function unslugify(slug: string): string {
  return slug.replace(/-/g, ' ');
}

export function buildChallengeUrl(challenge: Challenge): string {
  const params = new URLSearchParams({
    design: slugify(challenge.feature),
    for: slugify(challenge.useCase),
    'to-help': slugify(challenge.audience),
  });
  return `/challenge?${params.toString()}`;
}
