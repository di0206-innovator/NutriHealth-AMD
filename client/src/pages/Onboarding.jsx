import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ChevronRight, Target, Zap, Activity, TrendingUp, Sparkles, Ruler, Weight, User } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: '',
    activity: '',
    gender: '',
    age: '',
    height: '',
    weight: ''
  });

  const handleNext = () => setStep(s => s + 1);
  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onComplete(formData);
    }, 2000);
  };

  const steps = [
    { id: 1, title: 'Primary Objective', subtitle: 'Calibrate your metabolic target.', icon: <Target size={24} /> },
    { id: 2, title: 'Biological Matrix', subtitle: 'Define your ecosystem metrics.', icon: <User size={24} /> },
    { id: 3, title: 'Activity Level', subtitle: 'Sync your kinetic output.', icon: <Activity size={24} /> }
  ];

  return (
    <div className="page-container" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>
          <Leaf size={24} /> NutriLens
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {steps.map(s => (
            <div 
              key={s.id} 
              style={{ 
                width: step === s.id ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                background: step === s.id ? 'var(--color-primary)' : 'var(--color-border)',
                transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
              }} 
            />
          ))}
        </div>
      </header>

      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          >
            {step === 1 && (
              <>
                <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '16px' }}>Biological Goals.</h2>
                <p style={{ color: 'var(--color-text-tertiary)', fontWeight: 500, marginBottom: '40px' }}>Select your primary metabolic target.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { id: 'lose', label: 'Fat Loss & Tone', desc: 'Preserve lean mass while shedding adiposity.', icon: <TrendingUp /> },
                    { id: 'maintain', label: 'Vitality Maintain', desc: 'Optimize current metabolic stability.', icon: <Sparkles /> },
                    { id: 'gain', label: 'Structural Gain', desc: 'Build lean muscle and skeletal strength.', icon: <Zap /> }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => { updateForm('goal', opt.id); handleNext(); }}
                      className="card-vitality"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '20px', 
                        padding: '24px 20px', 
                        textAlign: 'left',
                        marginBottom: 0
                      }}
                    >
                      <div style={{ color: 'var(--color-primary)', background: '#fff0f3', padding: '12px', borderRadius: '12px' }}>{opt.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>{opt.desc}</div>
                      </div>
                      <ChevronRight size={18} color="var(--color-border)" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '16px' }}>Biological Matrix.</h2>
                <p style={{ color: 'var(--color-text-tertiary)', fontWeight: 500, marginBottom: '40px' }}>Physical metrics for baseline calibration.</p>
                
                <div className="card-vitality" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => updateForm('gender', 'male')}
                        style={{ flex: 1, height: '56px', borderRadius: '14px', border: formData.gender === 'male' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', background: '#f8f9fa', fontWeight: 700 }}
                      >
                         Male
                      </button>
                      <button 
                         onClick={() => updateForm('gender', 'female')}
                         style={{ flex: 1, height: '56px', borderRadius: '14px', border: formData.gender === 'female' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', background: '#f8f9fa', fontWeight: 700 }}
                      >
                         Female
                      </button>
                   </div>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input type="number" placeholder="Age" value={formData.age} onChange={(e) => updateForm('age', e.target.value)} style={{ height: '56px', borderRadius: '14px', padding: '0 16px', background: '#f8f9fa', border: '1px solid var(--color-border)', width: '100%' }} />
                      <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={(e) => updateForm('weight', e.target.value)} style={{ height: '56px', borderRadius: '14px', padding: '0 16px', background: '#f8f9fa', border: '1px solid var(--color-border)', width: '100%' }} />
                   </div>
                   
                   <input type="number" placeholder="Height (cm)" value={formData.height} onChange={(e) => updateForm('height', e.target.value)} style={{ height: '56px', borderRadius: '14px', padding: '0 16px', background: '#f8f9fa', border: '1px solid var(--color-border)', width: '100%' }} />

                   <button className="btn-primary" onClick={handleNext} style={{ marginTop: '20px' }}>
                     Analyze Baseline
                   </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '16px' }}>Kinetic Output.</h2>
                <p style={{ color: 'var(--color-text-tertiary)', fontWeight: 500, marginBottom: '40px' }}>Sync your physical activity level.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 'sedentary', label: 'Biologic Balance', desc: 'Minimal activity, sedentary objective.', icon: <Activity /> },
                    { id: 'active', label: 'Ecosystem Vitality', desc: 'Moderate physical output 3-4x weekly.', icon: <Zap /> },
                    { id: 'athlete', label: 'Peak Performance', desc: 'Extreme physical intensity daily.', icon: <Sparkles /> }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => { updateForm('activity', opt.id); }}
                      className="card-vitality"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '20px', 
                        padding: '24px 20px', 
                        textAlign: 'left',
                        marginBottom: 0,
                        border: formData.activity === opt.id ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ color: 'var(--color-secondary)', background: '#edf6ff', padding: '12px', borderRadius: '12px' }}>{opt.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>{opt.desc}</div>
                      </div>
                    </button>
                  ))}

                  <button 
                    className="btn-primary" 
                    onClick={handleSubmit} 
                    disabled={loading || !formData.activity} 
                    style={{ marginTop: '24px' }}
                  >
                    {loading ? 'Initializing Ecosystem...' : 'Establish Profile & Begin'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
