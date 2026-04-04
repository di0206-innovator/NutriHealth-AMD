// Snippet 24: Macro balance gauge
const IDEAL_RATIOS = {
  weight_loss:  { carbs: 40, protein: 35, fat: 25 },
  muscle_gain:  { carbs: 40, protein: 40, fat: 20 },
  energy:       { carbs: 55, protein: 20, fat: 25 },
  gut_health:   { carbs: 50, protein: 25, fat: 25 },
  general:      { carbs: 50, protein: 25, fat: 25 }
};

export default function MacroBalanceGauge({ todayMacros, goal }) {
  const ideal = IDEAL_RATIOS[goal] || IDEAL_RATIOS.general;
  const total = todayMacros.carbs + todayMacros.protein + todayMacros.fat || 1;
  
  const actual = {
    carbs: Math.round((todayMacros.carbs / total) * 100),
    protein: Math.round((todayMacros.protein / total) * 100),
    fat: Math.round((todayMacros.fat / total) * 100)
  };
  
  const isGood = (key) => Math.abs(actual[key] - ideal[key]) <= 10;
  
  return (
    <div 
      className="macro-gauge" 
      role="region" 
      aria-label="Macro balance vs your goal"
      style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '24px', 
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid #f2f2f7',
        width: '100%'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
         <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Macro Calibration</h4>
         <div style={{ fontSize: '0.65rem', fontWeight: 700, px: '6px', py: '2px', borderRadius: '4px', background: '#f2f2f7', color: 'var(--color-text-secondary)' }}>
            Goal: {goal?.replace('_', ' ') || 'General'}
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {['carbs', 'protein', 'fat'].map(k => (
          <div key={k} className="macro-bar-row">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
               <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'capitalize' }}>{k}</span>
               <span style={{ fontSize: '0.75rem', fontWeight: 900, color: isGood(k) ? '#34c759' : '#ff9500' }}>{actual[k]}%</span>
            </div>
            <div style={{ height: '8px', background: '#f2f2f7', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
              <div 
                className="macro-bar-fill" 
                style={{
                  height: '100%',
                  width: `${actual[k]}%`, 
                  background: isGood(k) ? '#34c759' : '#ff9500',
                  borderRadius: '4px',
                  transition: 'width 1s ease-out'
                }} 
              />
              {/* Ideal marker */}
              <div 
                aria-label={`Ideal: ${ideal[k]}%`}
                style={{
                  position: 'absolute',
                  left: `${ideal[k]}%`,
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'rgba(0,0,0,0.2)',
                  zIndex: 2
                }} 
              />
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '16px', fontSize: '0.65rem', color: 'var(--color-text-tertiary)', fontWeight: 600, fontStyle: 'italic' }}>
         * Dark markers indicate your personalized metabolic targets.
      </p>
    </div>
  );
}
