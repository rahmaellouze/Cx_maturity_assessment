type Props = {
  percentage: number | null;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
};

export default function DonutChart({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = "#111827",
  backgroundColor = "#e2e8f0",
}: Props) {
  if (percentage === null) {
    return (
      <div className="flex items-center justify-center" style={{ width: `${size}px`, height: `${size}px` }}>
        <span className="text-sm font-semibold text-slate-500">—</span>
      </div>
    );
  }

  const normalizedPercentage = Math.max(0, Math.min(percentage, 100));
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div className="flex items-center justify-center">
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-slate-900">{Math.round(normalizedPercentage)}%</span>
          <span className="text-[10px] font-medium text-slate-500">Score</span>
        </div>
      </div>
    </div>
  );
}
