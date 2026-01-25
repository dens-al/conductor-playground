import { useState, useEffect } from 'react';
import { useTimer } from './hooks/useTimer';
import { useExerciseLibrary } from './hooks/useExerciseLibrary';
import { ExerciseDisplay } from './components/ExerciseDisplay';
import { AddExercise } from './components/AddExercise';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { CircularTimer } from './components/CircularTimer';
import { TimerSettings } from './components/TimerSettings';
import type { Exercise } from './types';
import './App.css';

type TimerDisplay = 'digital' | 'circular';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function App() {
  const timer = useTimer();
  const { exercises, addExercise, removeExercise, getRandomExercise } = useExerciseLibrary();
  const [showSettings, setShowSettings] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [prevMode, setPrevMode] = useState(timer.mode);
  const [timerDisplay, setTimerDisplay] = useState<TimerDisplay>(() => {
    const saved = localStorage.getItem('timer-display');
    return (saved as TimerDisplay) || 'digital';
  });

  useEffect(() => {
    localStorage.setItem('timer-display', timerDisplay);
  }, [timerDisplay]);

  // Select a random exercise when break starts
  useEffect(() => {
    if (timer.mode === 'break' && prevMode !== 'break') {
      setCurrentExercise(getRandomExercise());
    }
    setPrevMode(timer.mode);
  }, [timer.mode, prevMode, getRandomExercise]);

  // Break view
  if (timer.mode === 'break') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <ExerciseDisplay
          exercise={currentExercise}
          secondsRemaining={timer.secondsRemaining}
          onEndBreak={timer.endBreak}
        />
      </div>
    );
  }

  // Timer view (idle or working)
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-white">Pomodoro</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {showSettings ? (
          <div className="w-full max-w-2xl flex flex-col gap-8 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Timer
              </button>
            </div>

            <TimerSettings
              workDuration={timer.workDuration}
              shortBreakDuration={timer.shortBreakDuration}
              longBreakDuration={timer.longBreakDuration}
              cyclesBeforeLongBreak={timer.cyclesBeforeLongBreak}
              cyclesCompleted={timer.cyclesCompleted}
              onUpdate={timer.updateSettings}
              onResetCycles={timer.resetCycles}
            />

            <AddExercise onExerciseSaved={addExercise} />

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Exercises ({exercises.length})
              </h3>
              <ExerciseLibrary exercises={exercises} onRemove={removeExercise} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {/* Timer display toggle */}
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setTimerDisplay('digital')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timerDisplay === 'digital'
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Digital
              </button>
              <button
                onClick={() => setTimerDisplay('circular')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timerDisplay === 'circular'
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Circular
              </button>
            </div>

            {/* Timer display */}
            {timerDisplay === 'circular' ? (
              <CircularTimer
                secondsRemaining={timer.secondsRemaining}
                totalSeconds={timer.workDuration}
                mode={timer.mode}
              />
            ) : (
              <div className="text-center">
                <div
                  className={`text-8xl font-mono font-bold tracking-tight ${
                    timer.mode === 'working' ? 'text-orange-400' :
                    timer.mode === 'paused' ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  {formatTime(timer.secondsRemaining)}
                </div>
                <div className="mt-2 text-lg text-gray-500 uppercase tracking-wider">
                  {timer.mode === 'working' ? 'Focus' :
                   timer.mode === 'paused' ? 'Paused' : 'Ready'}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {timer.mode === 'idle' && (
                <button
                  onClick={timer.start}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  Start
                </button>
              )}

              {timer.mode === 'working' && (
                <>
                  <button
                    onClick={timer.pause}
                    className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Pause
                  </button>
                  <button
                    onClick={timer.skipToBreak}
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Take Break
                  </button>
                </>
              )}

              {timer.mode === 'paused' && (
                <button
                  onClick={timer.resume}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  Resume
                </button>
              )}

              {timer.mode === 'paused' && (
                <button
                  onClick={timer.reset}
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-gray-300 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Cycle progress indicator */}
            <div className="flex items-center gap-2">
              {Array.from({ length: timer.cyclesBeforeLongBreak }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i < timer.cyclesCompleted
                      ? 'bg-orange-400'
                      : 'bg-gray-700'
                  }`}
                  title={`Cycle ${i + 1}`}
                />
              ))}
              <span className="text-gray-500 text-xs ml-2">
                {timer.cyclesCompleted}/{timer.cyclesBeforeLongBreak} until long break
              </span>
            </div>

            {exercises.length === 0 && (
              <p className="text-gray-500 text-sm mt-4">
                Tip: Add exercises in settings to see them during breaks!
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
