import { motion } from 'framer-motion';

export default function SkeletonLoader({ type = 'card' }) {
  const variants = {
    animate: {
      opacity: [0.4, 0.7, 0.4],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  if (type === 'app') {
    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center', background: '#ffffff' }}>
        <motion.div variants={variants} animate="animate" style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'var(--color-primary)', margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Synchronizing Ecosystem...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={variants} 
      animate="animate" 
      className="card-vitality" 
      style={{ height: '140px', background: 'var(--color-surface-bg)', border: 'none' }}
    />
  );
}
