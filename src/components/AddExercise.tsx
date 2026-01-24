import { useState } from 'react';
import type { Exercise } from '../types';

interface AddExerciseProps {
  onExerciseSaved: (exercise: Exercise) => void;
}

export function AddExercise({ onExerciseSaved }: AddExerciseProps) {
  const [gifUrl, setGifUrl] = useState('');
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [previewError, setPreviewError] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const canSave = name.trim() && gifUrl.trim() && isValidUrl(gifUrl) && !previewError;

  const handleSave = () => {
    if (!canSave) return;

    const exercise: Exercise = {
      id: crypto.randomUUID(),
      name: name.trim(),
      gifUrl: gifUrl.trim(),
      instructions: instructions.trim() || undefined,
      createdAt: Date.now(),
    };

    onExerciseSaved(exercise);

    // Reset form
    setGifUrl('');
    setName('');
    setInstructions('');
    setPreviewError(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-800 rounded-xl max-w-lg">
      <h2 className="text-xl font-semibold text-white">Add New Exercise</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Exercise Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Neck Stretch"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">GIF URL</label>
        <input
          type="url"
          value={gifUrl}
          onChange={(e) => {
            setGifUrl(e.target.value);
            setPreviewError(false);
          }}
          placeholder="https://example.com/exercise.gif"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <p className="text-xs text-gray-500">
          Paste a direct link to a GIF (from Giphy, Tenor, etc.)
        </p>
      </div>

      {gifUrl && isValidUrl(gifUrl) && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Preview</label>
          <div className="bg-gray-900 rounded-lg p-4 flex justify-center">
            {previewError ? (
              <p className="text-red-400 text-sm">Failed to load image. Check the URL.</p>
            ) : (
              <img
                src={gifUrl}
                alt="Preview"
                className="max-w-full max-h-48 object-contain rounded"
                onError={() => setPreviewError(true)}
                onLoad={() => setPreviewError(false)}
              />
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-400">Instructions (optional)</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., Tilt head slowly to each side, hold for 10 seconds"
          rows={2}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
      >
        Save Exercise
      </button>
    </div>
  );
}
