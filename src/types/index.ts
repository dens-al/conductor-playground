export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  instructions?: string;
}

export type TimerMode = 'idle' | 'working' | 'paused' | 'break';

export interface TimerState {
  mode: TimerMode;
  secondsRemaining: number;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesCompleted: number;
  cyclesBeforeLongBreak: number;
}

export interface TimerSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesBeforeLongBreak: number;
}
