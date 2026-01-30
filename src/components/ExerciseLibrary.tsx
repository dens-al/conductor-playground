import type { Exercise } from '../types';

interface ExerciseLibraryProps {
  exercises: Exercise[];
}

export function ExerciseLibrary({ exercises }: ExerciseLibraryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2"
        >
          <video
            src={exercise.videoUrl}
            preload="metadata"
            muted
            loop
            playsInline
            className="w-24 h-24 object-contain rounded"
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
          <span className="text-white text-sm font-medium text-center">
            {exercise.name}
          </span>
        </div>
      ))}
    </div>
  );
}
