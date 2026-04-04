import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, Flame, Target, Zap, Info, ChevronRight, AlertTriangle, Sparkles } from 'lucide-react';

export default function AnalysisResult({ result, onLog }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!result) return;

    // Snippet 21: Confetti burst on elite health scores (≥ 9)
    if (result.health_score >= 9) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500); // 2.5s celebration
    }

    // Snippet 9: Haptic feedback on score reveal
    if ('vibrate' in navigator) {
      if (result.health_score >= 9) {
        navigator.vibrate([100, 50, 100, 50, 100]); // Celebration pattern
      } else if (result.health_score >= 8) {
        navigator.vibrate([50, 30, 50]);
      } else if (result.health_score >= 5) {
        navigator.vibrate(40);
      } else {
        navigator.vibrate([80, 40, 80]);
      }
    }
  }, [result]);

  if (!result) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid #f2f2f7', width: '100%', position: 'relative' }}
    >
      {/* 🎊 Celebration Overlay */}
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.8}s`,
              background: ['#ff2d55', '#007aff', '#34c759', '#ffcc00', '#5856d6'][i % 5]
            }} />
          ))}
        </div>
      )}

      <div style={{ 
         background: result.health_score >= 8 ? 'linear-gradient(135deg, #34c759 0%, #30d158 100%)' : result.health_score >= 5 ? 'linear-gradient(135deg, #ff9500 0%, #ffcc00 100%)' : 'linear-gradient(135deg, #ff3b30 0%, #ff453a 100%)',
         color: 'white', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
         <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{result.food_name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <p style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 700 }}>VERIFIED METABOLIC CALIBRATION</p>
                {result.health_score >= 9 && <Sparkles size={14} className="pulse-animation" />}
            </div>
         </div>
         <div style={{ background: 'white', color: result.health_score >= 8 ? '#34c759' : '#ff9500', padding: '12px 18px', borderRadius: '20px', fontWeight: 900, fontSize: '1.2rem', boxShadow: 'var(--shadow-sm)' }}>
            {result.health_score}/10
         </div>
      </div>

      <div style={{ padding: '24px' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Kcal', val: result.calories_estimate, icon: <Flame size={14} />, color: '#ff3b30' },
              { label: 'Prot.', val: `${result.macros.protein_g}g`, icon: <Zap size={14} />, color: 'var(--color-secondary)' },
              { label: 'Crbs.', val: `${result.macros.carbs_g}g`, icon: <Target size={14} />, color: '#ff9500' },
              { label: 'Fat', val: `${result.macros.fat_g}g`, icon: <Brain size={14} />, color: '#5856d6' }
            ].map(m => (
              <div key={m.label} style={{ background: '#f8f9fa', padding: '12px 8px', borderRadius: '16px', textAlign: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, marginBottom: '4px' }}>{m.icon}</div>
                 <div style={{ fontSize: '0.6rem', color: 'var(--color-text-tertiary)', fontWeight: 800, textTransform: 'uppercase' }}>{m.label}</div>
                 <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{m.val}</div>
              </div>
            ))}
         </div>

         {(result.macros.sodium_mg > 0 || result.macros.sugar_g > 0 || result.macros.glycemic_load > 0) && (
           <div style={{ marginBottom: '24px', padding: '16px', background: '#fdf2f2', borderRadius: '20px', border: '1px solid #fee2e2' }}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Clinical Bio-Markers</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#991b1b' }}>SODIUM</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900 }}>{result.macros.sodium_mg || 0}mg</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#991b1b' }}>SUGAR</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900 }}>{result.macros.sugar_g || 0}g</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#991b1b' }}>G. LOAD</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: (result.macros.glycemic_load > 20) ? '#dc2626' : 'inherit' }}>{result.macros.glycemic_load || 0}</div>
                 </div>
              </div>
           </div>
         )}

         {result.top_ingredients && result.top_ingredients.length > 0 && (
           <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '12px' }}>Metabolic Components</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.top_ingredients.map((ing, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8f9fa', borderRadius: '16px', borderLeft: `4px solid ${ing.health_impact === 'positive' ? '#34c759' : ing.health_impact === 'negative' ? '#ff3b30' : '#8e8e93'}` }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', flex: 1 }}>{ing.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500, fontStyle: 'italic' }}>{ing.reason}</span>
                  </div>
                ))}
              </div>
           </div>
         )}

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'rgba(255,45,85,0.03)', borderRadius: '24px', border: '1px solid rgba(255,45,85,0.05)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', marginBottom: '12px' }}>
                  <Brain size={20} />
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Vision AI Personalized Feedback</span>
               </div>
               <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#4b5563', fontWeight: 500 }}>{result.personalized_advice}</p>
            </div>
         </div>

         <button className="btn-primary" onClick={onLog} style={{ marginTop: '32px', height: '68px', borderRadius: '24px', fontSize: '1rem', fontWeight: 900, background: 'var(--color-primary)', boxShadow: '0 10px 30px rgba(255,45,85,0.2)' }}>
            <CheckCircle size={24} /> Log Bio-Data
         </button>
      </div>
    </motion.div>
  );
}
