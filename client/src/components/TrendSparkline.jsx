// Snippet 23: 7-day trend sparklines
export default function TrendSparkline({ scores }) {
  if (!scores || scores.length < 2) return null;
  
  const W = 120, H = 32, PAD = 2;
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;
  
  const points = scores.map((score, i) => {
    const x = PAD + (i / (scores.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (score - min) / range) * (H - PAD * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  
  const trend = scores[scores.length - 1] - scores[0];
  const color = trend > 0 ? '#34c759' : trend < 0 ? '#ff3b30' : '#8e8e93';
  
  return (
    <div 
      className="sparkline-wrap" 
      aria-label={`7-day trend: ${trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable'}`}
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ overflow: 'visible' }}>
        <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <circle 
          cx={points.split(' ').pop().split(',')[0]} 
          cy={points.split(' ').pop().split(',')[1]}
          r="3" 
          fill={color} 
          style={{ filter: trend !== 0 ? `drop-shadow(0 0 4px ${color})` : 'none' }}
        />
      </svg>
      <span style={{ 
        color, 
        fontSize: '0.75rem', 
        fontWeight: 800, 
        background: `${color}10`, 
        padding: '2px 6px', 
        borderRadius: '8px',
        minWidth: '40px',
        textAlign: 'center'
      }}>
        {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend).toFixed(1)}
      </span>
    </div>
  );
}
