import React from 'react';

interface AtsGaugeProps {
  score: number;
  grade: string;
  size?: number;
}

export const AtsGauge: React.FC<AtsGaugeProps> = ({ score, grade, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return 'text-emerald-400 stroke-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]';
    if (s >= 70) return 'text-cyan-400 stroke-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]';
    if (s >= 55) return 'text-amber-400 stroke-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]';
    return 'text-rose-500 stroke-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]';
  };

  const getGradientId = (s: number) => {
    if (s >= 85) return 'emeraldGrad';
    if (s >= 70) return 'cyanGrad';
    if (s >= 55) return 'amberGrad';
    return 'roseGrad';
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Dynamic Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${getGradientId(score)})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Score Display */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
          {score}
          <span className="text-lg font-medium text-slate-400">/100</span>
        </span>
        <div className="mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-300">Grade</span>
          <span className={`text-sm font-extrabold ${getColor(score).split(' ')[0]}`}>{grade}</span>
        </div>
      </div>
    </div>
  );
};
