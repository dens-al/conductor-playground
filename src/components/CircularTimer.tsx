interface CircularTimerProps {
  secondsRemaining: number;
  totalSeconds: number;
  mode: 'idle' | 'working' | 'paused' | 'break';
  size?: number;
}

export function CircularTimer({
  secondsRemaining,
  totalSeconds,
  mode,
  size = 280,
}: CircularTimerProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsRemaining / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  const getColor = () => {
    switch (mode) {
      case 'working':
        return '#fb923c'; // orange-400
      case 'paused':
        return '#facc15'; // yellow-400
      case 'break':
        return '#4ade80'; // green-400
      default:
        return '#d1d5db'; // gray-300
    }
  };

  const color = getColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
    </div>
  );
}
