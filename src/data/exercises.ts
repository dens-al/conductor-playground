import type { Exercise } from '../types';

const R2_BASE_URL = 'https://pub-71e455396ad14e68b398b0b6861db0ef.r2.dev';

export const EXERCISE_CATALOG: Exercise[] = Array.from({ length: 33 }, (_, i) => ({
  id: `exercise-${i + 1}`,
  name: `Exercise ${i + 1}`,
  videoUrl: `${R2_BASE_URL}/${i + 1}.mp4`,
}));

export function getRandomExercise(): Exercise {
  const index = Math.floor(Math.random() * EXERCISE_CATALOG.length);
  return EXERCISE_CATALOG[index];
}
