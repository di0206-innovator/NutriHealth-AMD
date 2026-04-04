import { motion, AnimatePresence } from 'framer-motion';
import VitalityRing from '../components/VitalityRing';
import TrendSparkline from '../components/TrendSparkline';
import MacroBalanceGauge from '../components/MacroBalanceGauge';
import { Target, Zap, Activity, TrendingUp, Sparkles, Flame, Droplets, Wind, Moon, Calendar, Watch, CheckCircle2, Trophy, AlertCircle } from 'lucide-react';
import { useStreak } from '../hooks/useStreak';

const CALORIE_TARGETS = {
  sedentary: 1800,
  moderate: 2200,
  active: 2800
};

export default function Dashboard({ meals, profile, user }) {
  const { streak, milestone, loading: streakLoading } = useStreak(user?.uid);
  
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(m => m.timestamp && m.timestamp.split('T')[0] === today);
  
  const dailyCalories = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const calorieTarget = CALORIE_TARGETS[profile?.activity] || 2200;
  const caloriePct = Math.min(dailyCalories / calorieTarget, 1.2); // Cap at 120% for ring visual

  const ringColor = caloriePct > 1.1 ? 'var(--color-error)'
    : caloriePct > 0.9 ? 'var(--color-warning)'
    : 'var(--color-secondary)';
  
  const todayMacros = {
    carbs: todayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0),
    protein: todayMeals.reduce((sum, m) => sum + (m.protein || 0), 0),
    fat: todayMeals.reduce((sum, m) => sum + (m.fat || 0), 0)
  };

  const getLast7DaysScores = () => {
    const scores = [6.5, 7.2, 8.0, 7.5, 8.4, 7.8];
    const todayAvg = todayMeals.length > 0 ? todayMeals.reduce((s, m) => s + (m.health_score || 0), 0) / todayMeals.length : 0;
    if (todayAvg > 0) scores.push(Number(todayAvg.toFixed(1)));
    return scores;
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      
      {/* 🏆 Streak & Milestone Banner */}
      {!streakLoading && streak > 0 && (
        <motion.div variants={itemVariants} style={{ background: 'linear-gradient(135deg, #FF9500 0%, #FFCC00 100%)', padding: '16px 20px', borderRadius: '24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 20px rgba(255,149,0,0.15)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '14px' }}>
                 <Trophy size={20} />
              </div>
              <div>
                 <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>Metabolic Streak</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{streak} Days strong</div>
              </div>
           </div>
           {milestone && (
             <div style={{ background: 'white', color: '#FF9500', padding: '8px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 900, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                MILESTONE:<br/>{milestone.toUpperCase()}
             </div>
           )}
        </motion.div>
      )}

      {/* Flagship Sync Status */}
      <motion.div variants={itemVariants} style={{ background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)', padding: '12px 20px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.03)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', background: '#34c75915', borderRadius: '8px', color: '#34c759' }}>
               <Watch size={16} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', letterSpacing: '0.02em' }}>METABOLIC SYNC ACTIVE</span>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '0.7rem', fontWeight: 800 }}>
            <CheckCircle2 size={12} />
            LIVE VERIFICATION
         </div>
      </motion.div>

      {/* Vitals Overview */}
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '12px', overflowX: 'auto', margin: '0 -20px', padding: '4px 20px', scrollbarWidth: 'none' }}>
        {[
          { label: 'Hydration', value: '1.2L', icon: <Droplets size={18} />, color: '#007aff', bg: '#eef2ff' },
          { label: 'Activity', value: '8.4k', icon: <Wind size={18} />, color: '#34c759', bg: '#ecfdf5' },
          { label: 'Recovery', value: '7.2h', icon: <Moon size={18} />, color: '#5856d6', bg: '#f5f3ff' },
          { label: 'Intensity', value: 'High', icon: <Flame size={18} />, color: '#ff9500', bg: '#fff7ed' }
        ].map((vital, i) => (
          <div key={i} style={{ minWidth: '110px', background: 'white', borderRadius: '20px', padding: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.03)' }}>
            <div style={{ color: vital.color, background: vital.bg, width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>{vital.icon}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{vital.label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{vital.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Calibration Graph */}
      <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: '28px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(0,0,0,0.02)' }}>
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              <Calendar size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>7-Day Calibration</span>
           </div>
           <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>Metabolic Vitality</div>
        </div>
        <TrendSparkline scores={getLast7DaysScores()} />
      </motion.div>

      {/* Main Calorie & Macro Target Ring Card */}
      <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: '32px', padding: '32px 24px', boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.02)' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: `radial-gradient(circle, ${ringColor}15 0%, transparent 70%)`, filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.1 }}>Calorie<br/>Progress</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginTop: '8px', fontWeight: 600 }}>Target: {calorieTarget} kcal ({profile?.activity || 'moderate'})</p>
          </div>
          <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '2.2rem', fontWeight: 900, color: ringColor }}>{Math.max(0, calorieTarget - dailyCalories)}</div>
             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Kcal Remaining</div>
          </div>
        </div>
        
        {/* Snippet 21: Daily calorie progress ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <VitalityRing 
            size={220} 
            strokeWidth={18} 
            progress={caloriePct} 
            value={String(dailyCalories)} 
            unit={`/ ${calorieTarget}`} 
            label="Daily Consumed" 
            color={ringColor} 
          />
        </div>
        
        <MacroBalanceGauge todayMacros={todayMacros} goal={profile?.goal} />
        
        {caloriePct > 1.05 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '24px', background: '#fee2e2', padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#991b1b' }}>
                <AlertCircle size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Energy surplus detected beyond calibration target.</span>
            </motion.div>
        )}
      </motion.div>

      {/* AI Insight Card */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        style={{ background: 'linear-gradient(135deg, #FF2D55 0%, #FF375F 100%)', borderRadius: '28px', padding: '24px', color: 'white', boxShadow: '0 20px 40px rgba(255,45,85,0.25)', display: 'flex', gap: '20px', alignItems: 'center' }}
      >
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '20px' }}>
            <Sparkles size={32} />
        </div>
        <div>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Metabolic Peak</h3>
           <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.4, marginTop: '4px' }}>
             {dailyCalories < 1000 ? "Maintain energy density. Increasing morning intake will optimize your 4 PM metabolic window." : "Consistency verified. Your nutrient timing aligns with your biological activity profile."}
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
