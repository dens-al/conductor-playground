import { useCallback } from 'react';
import { EXERCISE_CATALOG, getRandomExercise } from '../data/exercises';

export function useExerciseLibrary() {
  const exercises = EXERCISE_CATALOG;

  const getRandomExerciseCallback = useCallback(() => {
    return getRandomExercise();
  }, []);

  return {
    exercises,
    getRandomExercise: getRandomExerciseCallback,
  };
}
