import { useState, useEffect, useCallback } from 'react';
import type { Exercise } from '../types';

const STORAGE_KEY = 'pomodoro-exercises';

export function useExerciseLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExercises(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored exercises:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
    }
  }, [exercises, isLoaded]);

  const addExercise = useCallback((exercise: Exercise) => {
    setExercises((prev) => [...prev, exercise]);
  }, []);

  const removeExercise = useCallback((id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getRandomExercise = useCallback((): Exercise | null => {
    if (exercises.length === 0) return null;
    const index = Math.floor(Math.random() * exercises.length);
    return exercises[index];
  }, [exercises]);

  return {
    exercises,
    addExercise,
    removeExercise,
    getRandomExercise,
  };
}
