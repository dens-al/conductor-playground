import type { Exercise } from '../types';

interface ExerciseDisplayProps {
  exercise: Exercise | null;
  secondsRemaining: number;
  onEndBreak: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function ExerciseDisplay({ exercise, secondsRemaining, onEndBreak }: ExerciseDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-2">Break Time!</h2>
        <p className="text-gray-400">Take a moment to stretch</p>
      </div>

      {exercise ? (
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gray-800 rounded-2xl p-4 overflow-hidden">
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="w-64 h-64 object-contain rounded-lg"
            />
          </div>
          <h3 className="text-xl font-semibold text-white">{exercise.name}</h3>
          {exercise.instructions && (
            <p className="text-gray-400 text-center max-w-sm">{exercise.instructions}</p>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl p-8 text-center">
          <p className="text-gray-400 mb-4">No exercises added yet!</p>
          <p className="text-gray-500 text-sm">
            Click the settings icon to add exercise GIFs.
          </p>
        </div>
      )}

      <div className="text-center">
        <div className="text-5xl font-mono font-bold text-green-400">
          {formatTime(secondsRemaining)}
        </div>
        <p className="text-gray-500 mt-2">remaining</p>
      </div>

      <button
        onClick={onEndBreak}
        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
      >
        End Break Early
      </button>
    </div>
  );
}
