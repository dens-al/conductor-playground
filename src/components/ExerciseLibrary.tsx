import type { Exercise } from '../types';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onRemove: (id: string) => void;
}

export function ExerciseLibrary({ exercises, onRemove }: ExerciseLibraryProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No exercises yet. Add some using the form above!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2"
        >
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-24 h-24 object-contain rounded"
          />
          <span className="text-white text-sm font-medium text-center">
            {exercise.name}
          </span>
          <button
            onClick={() => onRemove(exercise.id)}
            className="text-red-400 text-xs hover:text-red-300 transition-colors"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
