export default function HealthScoreRing({ score, mealCount }) {
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = score 
    ? circumference - (score / 10) * circumference 
    : circumference;

  const color = !score ? 'var(--color-border)'
    : score >= 8 ? 'var(--color-success)'
    : score >= 6 ? 'var(--color-primary)'
    : score >= 4 ? 'var(--color-warning)'
    : 'var(--color-error)';

  return (
    <div className="score-ring-container" role="img" 
         aria-label={score ? `Daily health score: ${score} out of 10` : 'No meals logged yet'}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="score-ring-svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--color-surface-elevated)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), stroke 0.4s ease' }}
          filter={score ? "url(#glow)" : "none"}
        />
      </svg>
      <div className="score-ring-center" aria-hidden="true">
        <span className="score-ring-value" style={{ color: score ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
          {score ?? '—'}
        </span>
        <span className="score-ring-label">
          {mealCount === 0 ? 'no meals yet' : `${mealCount} meal${mealCount !== 1 ? 's' : ''} today`}
        </span>
      </div>
    </div>
  );
}
