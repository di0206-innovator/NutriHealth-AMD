import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRecentMeals } from '../firebase';
import { Clock, TrendingUp } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }
};

export default function History({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentMeals(user.uid, 50).then(data => {
      setHistory(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div style={{ padding: '40px 24px' }}><SkeletonLoader type="history" count={4} /></div>;

  return (
    <motion.div initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={containerVariants}>
      <div className="ambient-glow" style={{ opacity: 0.4 }} />
      
      <motion.header className="home-header" variants={itemVariants}>
        <span className="greeting-sub" style={{ color: 'var(--color-accent-pink)' }}>Activity Log</span>
        <h1 className="editorial-title">Your Nutrition<br/>Journey</h1>
      </motion.header>

      {history.length === 0 ? (
        <motion.div className="glass-panel" variants={itemVariants} style={{ padding: '40px 24px', textAlign: 'center' }}>
          <Clock size={48} color="var(--color-text-tertiary)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', marginBottom: '8px' }}>No meals logged yet</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Scan your first meal to start tracking your health score.</p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {history.map(item => (
            <motion.div key={item.id} className="meal-card" variants={itemVariants}>
              <div className="meal-card-glass">
                <div className="meal-card-content">
                  <div className="meal-info">
                    <h3 className="meal-name">{item.foodName}</h3>
                    <div className="meal-meta">
                      <Clock size={14} /> 
                      {item.mealType} • {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                    </div>
                  </div>
                  
                  <div className="meal-metrics">
                    <div className="meal-stats">
                      <span className="meal-calories">{item.nutritionalInfo?.calories || 0}</span>
                      <span className="meal-unit">kcal</span>
                    </div>
                    
                    <div className="meal-score-pill" style={{ 
                      borderColor: item.healthScoreCategory === 'Excellent' ? 'var(--color-success)' : 
                                  item.healthScoreCategory === 'Good' ? 'var(--color-primary-light)' : 
                                  item.healthScoreCategory === 'Poor' ? 'var(--color-error)' : 'var(--color-warning)',
                      color: item.healthScoreCategory === 'Excellent' ? 'var(--color-success)' : 
                            item.healthScoreCategory === 'Good' ? 'var(--color-primary-light)' : 
                            item.healthScoreCategory === 'Poor' ? 'var(--color-error)' : 'var(--color-warning)'
                    }}>
                      {item.healthScore}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
