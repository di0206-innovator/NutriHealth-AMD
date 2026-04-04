import { motion } from 'framer-motion';

export default function VitalityRing({ 
  size = 220, 
  strokeWidth = 22, 
  progress = 0, 
  color = 'var(--color-primary)', 
  label = '', 
  value = '',
  unit = '',
  centerText = true
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.min(progress, 1));

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`gradient-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#ff9a9e" /> {/* Soft peach secondary for depth */}
          </linearGradient>
          
          <filter id="inner-shadow">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="3" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.08" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Outer Halo Track (Ghost) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          opacity="0.03"
        />

        {/* Primary Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-surface-bg)"
          strokeWidth={strokeWidth}
          fill="none"
          filter="url(#inner-shadow)"
        />

        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
          strokeLinecap="round"
          fill="none"
          style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.05))' }}
        />
      </svg>
      
      {centerText && (
        <div style={{ 
          position: 'absolute', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center' 
        }}>
          {label && <span className="label-text" style={{ fontSize: '0.65rem' }}>{label}</span>}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span className="vitals-text" style={{ fontSize: '2.4rem' }}>{value}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>{unit}</span>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--color-text-tertiary)', marginTop: '-2px' }}>Remaining</span>
        </div>
      )}
    </div>
  );
}
