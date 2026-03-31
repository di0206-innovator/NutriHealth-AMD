export default function HealthScoreRing({ score, mealCount }) {
  const size = 200;
  const strokeWidth = 14;
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
    <div className="health-score-section" role="img" 
         aria-label={score ? `Daily health score: ${score} out of 10` : 'No meals logged yet'}>
      <div className="score-ring-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="score-ring-svg">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-primary-dark)" />
            </linearGradient>
            <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="6" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" 
            stroke="var(--color-surface-container)" 
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" 
            stroke={score ? "url(#scoreGradient)" : color} 
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ 
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), stroke 0.4s ease',
              filter: score >= 6 ? 'url(#scoreGlow)' : 'none'
            }}
          />
        </svg>
        <div className="score-ring-center" aria-hidden="true">
          <span className="score-ring-value">
            {score ?? '—'}
          </span>
          <span className="score-ring-label">
            {mealCount === 0 ? 'no logs' : `${mealCount} meals`}
          </span>
        </div>
      </div>
    </div>
  );
}
