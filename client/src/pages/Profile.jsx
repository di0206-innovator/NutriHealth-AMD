import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Shield, LogOut, ChevronRight, Target, Activity, Zap, Sparkles, Watch, Smartphone, CheckCircle2, RotateCw } from 'lucide-react';

export default function Profile({ user, profile, logout }) {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const simulateSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
    }, 2500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '100px' }}
    >
      <motion.div 
        variants={itemVariants}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 0' }}
      >
        <div style={{ width: '120px', height: '120px', borderRadius: '44px', background: 'linear-gradient(135deg, var(--color-primary) 0%, #ff5e7e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 20px 40px rgba(255,45,85,0.2)', marginBottom: '20px', fontSize: '3rem', fontWeight: 900 }}>
          {user?.email[0].toUpperCase()}
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{user?.email.split('@')[0]}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', background: 'rgba(255,45,85,0.08)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, marginTop: '8px' }}>
          <Sparkles size={14} /> VITALITY+ ELITE MEMBER
        </div>
      </motion.div>

      {/* Snippet: Wearable Sync Bridge */}
      <motion.div variants={itemVariants} style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid #f2f2f7' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <Watch size={24} color="var(--color-primary)" />
               <span style={{ fontWeight: 800, fontSize: '1rem' }}>Ecosystem Bridge</span>
            </div>
            <button 
              onClick={simulateSync}
              disabled={syncing}
              style={{ background: synced ? '#34c759' : '#f2f2f7', color: synced ? 'white' : 'var(--color-text-secondary)', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s' }}
            >
              {syncing ? <RotateCw size={14} className="spin-animation" /> : synced ? <CheckCircle2 size={14} /> : <RotateCw size={14} />}
              {syncing ? 'SYNCING...' : synced ? 'SYNCED' : 'CALIBRATE'}
            </button>
         </div>
         <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, fontWeight: 500, marginBottom: '20px' }}>
            Synchronize your Apple Health, Garmin, or or or Google Fit bio-metrics to enhance AI precision.
         </p>
         <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, padding: '16px', borderRadius: '20px', background: '#f8f9fa', border: '1px solid #f2f2f7', textAlign: 'center' }}>
               <Smartphone size={18} style={{ marginBottom: '8px' }} />
               <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Phone</div>
               <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Connected</div>
            </div>
            <div style={{ flex: 1, padding: '16px', borderRadius: '20px', background: '#f8f9fa', border: '1px solid #f2f2f7', textAlign: 'center' }}>
               <Watch size={18} style={{ marginBottom: '8px' }} />
               <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Watch</div>
               <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Standby</div>
            </div>
         </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
         <div className="card-vitality" style={{ padding: '20px', border: 'none', background: '#f8f9fa' }}>
            <Target size={20} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Current Goal</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, marginTop: '4px' }}>{profile?.goal?.toUpperCase()}</div>
         </div>
         <div className="card-vitality" style={{ padding: '20px', border: 'none', background: '#f8f9fa' }}>
            <Activity size={20} color="var(--color-secondary)" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Activity</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, marginTop: '4px' }}>{profile?.activity?.toUpperCase()}</div>
         </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
         <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '8px' }}>Security & Matrix</h3>
         {[
           { icon: <Settings size={20} />, label: 'Ecosystem Calibration', color: '#64748b' },
           { icon: <Shield size={20} />, label: 'Privacy & Bio-Data', color: '#10b981' }
         ].map(item => (
           <div key={item.label} className="card-vitality" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ color: item.color }}>{item.icon}</div>
              <span style={{ flex: 1, fontWeight: 700 }}>{item.label}</span>
              <ChevronRight size={18} color="var(--color-border)" />
           </div>
         ))}
      </motion.div>

      <motion.button 
        variants={itemVariants}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        style={{ marginTop: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 900, fontSize: '1rem' }}
      >
        <LogOut size={20} /> Terminate Session
      </motion.button>
    </motion.div>
  );
}
