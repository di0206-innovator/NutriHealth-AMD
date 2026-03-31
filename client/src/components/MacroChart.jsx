export default function MacroChart({ macros }) {
  const { carbs_g = 0, protein_g = 0, fat_g = 0, fiber_g = 0 } = macros || {};
  const total = carbs_g + protein_g + fat_g + fiber_g || 1;
  
  const segments = [
    { label: 'Carbs', value: carbs_g, color: 'var(--macro-carbs)', pct: Math.round(carbs_g / total * 100) },
    { label: 'Protein', value: protein_g, color: 'var(--macro-protein)', pct: Math.round(protein_g / total * 100) },
    { label: 'Fat', value: fat_g, color: 'var(--macro-fat)', pct: Math.round(fat_g / total * 100) },
    { label: 'Fiber', value: fiber_g, color: 'var(--macro-fiber)', pct: Math.round(fiber_g / total * 100) },
  ].filter(s => s.value > 0);

  let accumulated = 0;
  const size = 100;
  const cx = 50, cy = 50, r = 38, inner = 24;

  const arcs = segments.map(seg => {
    const startAngle = accumulated * 3.6 - 90;
    const endAngle = (accumulated + seg.pct) * 3.6 - 90;
    accumulated += seg.pct;
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const iStart = polarToCartesian(cx, cy, inner, startAngle);
    const iEnd = polarToCartesian(cx, cy, inner, endAngle);
    const large = seg.pct > 50 ? 1 : 0;
    return {
      ...seg,
      path: `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} L ${iEnd.x} ${iEnd.y} A ${inner} ${inner} 0 ${large} 0 ${iStart.x} ${iStart.y} Z`
    };
  });

  return (
    <div className="macro-chart-container" role="img" 
         aria-label={`Macros: ${segments.map(s => `${s.label} ${s.value}g`).join(', ')}`}>
      <svg className="macro-svg" viewBox={`0 0 ${size} ${size}`} width="120" height="120" aria-hidden="true">
        {arcs.map((arc, i) => (
          <path 
            key={i} 
            d={arc.path} 
            fill={arc.color} 
            stroke="var(--color-surface-container)" 
            strokeWidth="2" 
            style={{ transition: 'all 0.5s var(--ease-kinetic)' }}
            className="macro-arc"
          />
        ))}
        <text x="50" y="55" textAnchor="middle" className="chart-total-text" 
          style={{ fill: 'var(--color-text-primary)', fontSize: '10px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>
          {total}g
        </text>
      </svg>
      <div className="macro-legend" aria-hidden="true">
        {segments.map((seg, i) => (
          <div key={i} className="macro-legend-item">
            <span className="macro-dot" style={{ background: seg.color, boxShadow: `0 0 8px ${seg.color}` }} />
            <span className="macro-label">{seg.label}</span>
            <span className="macro-value" style={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>{seg.value}g</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
