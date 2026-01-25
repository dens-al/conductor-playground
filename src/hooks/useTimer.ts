import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerState, TimerSettings } from '../types';

const STORAGE_KEY = 'pomodoro-timer-settings';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  cyclesBeforeLongBreak: 4,
};

function loadSettings(): TimerSettings {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: TimerSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useTimer() {
  const [state, setState] = useState<TimerState>(() => {
    const settings = loadSettings();
    return {
      mode: 'idle',
      secondsRemaining: settings.workDuration,
      workDuration: settings.workDuration,
      shortBreakDuration: settings.shortBreakDuration,
      longBreakDuration: settings.longBreakDuration,
      cyclesCompleted: 0,
      cyclesBeforeLongBreak: settings.cyclesBeforeLongBreak,
    };
  });

  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (state.mode === 'idle') {
      setState(prev => ({
        ...prev,
        mode: 'working',
        secondsRemaining: prev.workDuration,
      }));
    }
  }, [state.mode]);

  const pause = useCallback(() => {
    clearTimer();
    setState(prev => ({
      ...prev,
      mode: 'paused',
    }));
  }, [clearTimer]);

  const resume = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'working',
    }));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState(prev => ({
      ...prev,
      mode: 'idle',
      secondsRemaining: prev.workDuration,
    }));
  }, [clearTimer]);

  const skipToBreak = useCallback(() => {
    clearTimer();
    setState(prev => {
      const newCyclesCompleted = prev.cyclesCompleted + 1;
      const isLongBreak = newCyclesCompleted >= prev.cyclesBeforeLongBreak;
      const breakDuration = isLongBreak ? prev.longBreakDuration : prev.shortBreakDuration;
      return {
        ...prev,
        mode: 'break',
        secondsRemaining: breakDuration,
        cyclesCompleted: isLongBreak ? 0 : newCyclesCompleted,
      };
    });
  }, [clearTimer]);

  const endBreak = useCallback(() => {
    clearTimer();
    setState(prev => ({
      ...prev,
      mode: 'idle',
      secondsRemaining: prev.workDuration,
    }));
  }, [clearTimer]);

  const updateSettings = useCallback((settings: Partial<TimerSettings>) => {
    setState(prev => {
      const newState = {
        ...prev,
        ...(settings.workDuration !== undefined && { workDuration: settings.workDuration }),
        ...(settings.shortBreakDuration !== undefined && { shortBreakDuration: settings.shortBreakDuration }),
        ...(settings.longBreakDuration !== undefined && { longBreakDuration: settings.longBreakDuration }),
        ...(settings.cyclesBeforeLongBreak !== undefined && { cyclesBeforeLongBreak: settings.cyclesBeforeLongBreak }),
      };

      // Update secondsRemaining if in idle mode
      if (prev.mode === 'idle' && settings.workDuration !== undefined) {
        newState.secondsRemaining = settings.workDuration;
      }

      // Save to localStorage
      saveSettings({
        workDuration: newState.workDuration,
        shortBreakDuration: newState.shortBreakDuration,
        longBreakDuration: newState.longBreakDuration,
        cyclesBeforeLongBreak: newState.cyclesBeforeLongBreak,
      });

      return newState;
    });
  }, []);

  const resetCycles = useCallback(() => {
    setState(prev => ({
      ...prev,
      cyclesCompleted: 0,
    }));
  }, []);

  useEffect(() => {
    if (state.mode === 'idle' || state.mode === 'paused') {
      clearTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.secondsRemaining <= 1) {
          if (prev.mode === 'working') {
            const newCyclesCompleted = prev.cyclesCompleted + 1;
            const isLongBreak = newCyclesCompleted >= prev.cyclesBeforeLongBreak;
            const breakDuration = isLongBreak ? prev.longBreakDuration : prev.shortBreakDuration;
            return {
              ...prev,
              mode: 'break',
              secondsRemaining: breakDuration,
              cyclesCompleted: isLongBreak ? 0 : newCyclesCompleted,
            };
          } else {
            return {
              ...prev,
              mode: 'idle',
              secondsRemaining: prev.workDuration,
            };
          }
        }
        return {
          ...prev,
          secondsRemaining: prev.secondsRemaining - 1,
        };
      });
    }, 1000);

    return clearTimer;
  }, [state.mode, clearTimer]);

  return {
    ...state,
    start,
    pause,
    resume,
    reset,
    skipToBreak,
    endBreak,
    updateSettings,
    resetCycles,
  };
}
