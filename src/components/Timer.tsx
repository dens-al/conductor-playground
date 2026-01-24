import { useTimer } from '../hooks/useTimer';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

interface TimerProps {
  onBreakStart?: () => void;
  onBreakEnd?: () => void;
}

export function Timer({ onBreakStart, onBreakEnd }: TimerProps) {
  const { mode, secondsRemaining, start, pause, reset, skipToBreak, endBreak } = useTimer();

  const handleStart = () => {
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = () => {
    reset();
  };

  const handleSkipToBreak = () => {
    skipToBreak();
    onBreakStart?.();
  };

  const handleEndBreak = () => {
    endBreak();
    onBreakEnd?.();
  };

  const isWorking = mode === 'working';
  const isBreak = mode === 'break';
  const isIdle = mode === 'idle';

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <div
          className={`text-8xl font-mono font-bold tracking-tight ${
            isBreak ? 'text-green-400' : isWorking ? 'text-orange-400' : 'text-gray-300'
          }`}
        >
          {formatTime(secondsRemaining)}
        </div>
        <div className="mt-2 text-lg text-gray-500 uppercase tracking-wider">
          {isBreak ? 'Break Time' : isWorking ? 'Focus' : 'Ready'}
        </div>
      </div>

      <div className="flex gap-4">
        {isIdle && (
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            Start
          </button>
        )}

        {isWorking && (
          <>
            <button
              onClick={handlePause}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Pause
            </button>
            <button
              onClick={handleSkipToBreak}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Take Break
            </button>
          </>
        )}

        {isBreak && (
          <button
            onClick={handleEndBreak}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            End Break
          </button>
        )}

        {!isIdle && (
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-gray-300 rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
