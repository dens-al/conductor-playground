import type { TimerSettings } from '../types';

interface TimerSettingsProps {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
  cyclesCompleted: number;
  onUpdate: (settings: Partial<TimerSettings>) => void;
  onResetCycles: () => void;
}

function formatMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

function parseMinutes(minutes: number): number {
  return minutes * 60;
}

export function TimerSettings({
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  cyclesBeforeLongBreak,
  cyclesCompleted,
  onUpdate,
  onResetCycles,
}: TimerSettingsProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Timer Settings</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Focus Duration</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="120"
              value={formatMinutes(workDuration)}
              onChange={(e) =>
                onUpdate({ workDuration: parseMinutes(parseInt(e.target.value) || 25) })
              }
              className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <span className="text-gray-400 text-sm">min</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Short Break</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="60"
              value={formatMinutes(shortBreakDuration)}
              onChange={(e) =>
                onUpdate({ shortBreakDuration: parseMinutes(parseInt(e.target.value) || 5) })
              }
              className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
            />
            <span className="text-gray-400 text-sm">min</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Long Break</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="60"
              value={formatMinutes(longBreakDuration)}
              onChange={(e) =>
                onUpdate({ longBreakDuration: parseMinutes(parseInt(e.target.value) || 15) })
              }
              className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <span className="text-gray-400 text-sm">min</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400">Long Break After</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={cyclesBeforeLongBreak}
              onChange={(e) =>
                onUpdate({ cyclesBeforeLongBreak: parseInt(e.target.value) || 4 })
              }
              className="w-20 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
            <span className="text-gray-400 text-sm">cycles</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Current progress:{' '}
          <span className="text-white font-medium">
            {cyclesCompleted} / {cyclesBeforeLongBreak}
          </span>{' '}
          cycles until long break
        </div>
        {cyclesCompleted > 0 && (
          <button
            onClick={onResetCycles}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Reset Progress
          </button>
        )}
      </div>
    </div>
  );
}
