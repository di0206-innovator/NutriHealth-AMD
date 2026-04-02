import { motion } from 'framer-motion';
import { Flame, Droplets, Target, Activity } from 'lucide-react';
import InteractiveShape3D from '../components/InteractiveShape3D';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Home({ user, profile }) {
  const getDailyTarget = () => {
    if (!profile) return 2000;
    let bmr;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const tdee = bmr * (multipliers[profile.activityLevel] || 1.2);
    if (profile.goal === 'lose') return Math.round(tdee - 500);
    if (profile.goal === 'gain') return Math.round(tdee + 500);
    return Math.round(tdee);
  };

  const score = 84; 
  const targetCals = getDailyTarget();
  const consumedCals = 1240; 
  
  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      exit={{ opacity: 0 }}
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      <div className="ambient-glow" />
      
      <motion.header className="home-header" variants={itemVariants}>
        <span className="greeting-sub">Welcome Back</span>
        <h1 className="editorial-title">
          Ready to fuel<br/>your body, {user?.displayName?.split(' ')[0] || 'Foodie'}?
        </h1>
      </motion.header>

      {/* 3D Visual Centerpiece */}
      <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 1} }}}>
        <InteractiveShape3D color="#34d399" />
      </motion.div>

      <motion.section className="health-score-section" variants={itemVariants}>
        <div className="score-ring-container">
          <svg viewBox="0 0 100 100" className="score-ring-center" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%', position: 'absolute' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * score) / 100} style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.2,0.8,0.2,1)' }} />
          </svg>
          <div className="score-ring-center">
            <span className="score-ring-value">{score}</span>
            <span className="score-ring-label">Health Score</span>
          </div>
        </div>
      </motion.section>

      <motion.section className="quick-stats" variants={containerVariants}>
        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-accent-orange)' }}><Flame size={24} /></div>
          <span className="stat-value">{consumedCals}</span>
          <span className="stat-label">Cals Eaten</span>
        </motion.div>
        
        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-primary)' }}><Target size={24} /></div>
          <span className="stat-value">{targetCals - consumedCals}</span>
          <span className="stat-label">Remaining</span>
        </motion.div>
        
        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-info)' }}><Droplets size={24} /></div>
          <span className="stat-value">1.2<span style={{ fontSize: '0.6em', opacity: 0.6}}>L</span></span>
          <span className="stat-label">Hydration</span>
        </motion.div>
      </motion.section>
      
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="primary-btn" onClick={() => window.location.href = '/analyze'}>
          <Activity size={20} />
          Analyse New Meal
        </button>
      </motion.div>

    </motion.div>
  );
}
