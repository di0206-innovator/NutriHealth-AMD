import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveUserProfile } from '../firebase';
import InteractiveShape3D from '../components/InteractiveShape3D';
import { ChevronRight, Leaf, Dumbbell, Zap, TrendingUp, TrendingDown, Target } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30
};

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: ''
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(s => s + 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await saveUserProfile(user.uid, formData);
      onComplete(formData);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container" style={{ position: 'relative' }}>
      <div className="ambient-glow orange" />
      
      <header className="onboarding-header">
        <div className="onboarding-logo">
          <Leaf size={24} /> Nutri<span>Lens</span>
        </div>
        <div className="step-dots">
          {[1, 2, 3].map(i => (
            <div key={i} className={`dot ${step === i ? 'active' : ''}`} />
          ))}
        </div>
      </header>

      {step === 1 && (
        <motion.div style={{ marginTop: '-40px' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity:1, scale: 1 }} transition={{ duration: 1 }}>
          <InteractiveShape3D color="#fb923c" />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="glass-panel"
          style={{ padding: '40px 32px', marginTop: step > 1 ? '40px' : '-20px', zIndex: 10, position: 'relative' }}
        >
          {step === 1 && (
            <div>
              <h2 className="step-title">Let's craft your<br/>perfect plate.</h2>
              <p className="step-subtitle">What's your primary goal right now?</p>
              
              <div className="step-options">
                <button className={`option-btn ${formData.goal === 'lose' ? 'selected' : ''}`} onClick={() => { updateForm('goal', 'lose'); handleNext(); }}>
                  <div className="option-icon"><TrendingDown size={28} /></div>
                  <div className="option-text-group">
                    <span className="option-label">Lean & Tone</span>
                    <span className="option-desc">Shed weight, keep muscle.</span>
                  </div>
                </button>
                <button className={`option-btn ${formData.goal === 'maintain' ? 'selected' : ''}`} onClick={() => { updateForm('goal', 'maintain'); handleNext(); }}>
                  <div className="option-icon"><Target size={28} /></div>
                  <div className="option-text-group">
                    <span className="option-label">Maintain Harmony</span>
                    <span className="option-desc">Stay active, stay healthy.</span>
                  </div>
                </button>
                <button className={`option-btn ${formData.goal === 'gain' ? 'selected' : ''}`} onClick={() => { updateForm('goal', 'gain'); handleNext(); }}>
                  <div className="option-icon"><TrendingUp size={28} /></div>
                  <div className="option-text-group">
                    <span className="option-label">Build Muscle</span>
                    <span className="option-desc">Fuel your gains.</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="step-title">How do you move?</h2>
              <p className="step-subtitle">Tell us about your daily activity level.</p>
              
              <div className="step-options">
                <button className={`option-btn ${formData.activityLevel === 'sedentary' ? 'selected' : ''}`} onClick={() => { updateForm('activityLevel', 'sedentary'); handleNext(); }}>
                  <div className="option-icon"><Target size={28} /></div>
                  <div className="option-text-group">
                    <span className="option-label">Chill</span>
                    <span className="option-desc">Mostly sitting, light walks.</span>
                  </div>
                </button>
                <button className={`option-btn ${formData.activityLevel === 'light' ? 'selected' : ''}`} onClick={() => { updateForm('activityLevel', 'light'); handleNext(); }}>
                  <div className="option-icon"><Zap size={28} /></div>
                  <div className="option-text-group">
                    <span className="option-label">Active</span>
                    <span className="option-desc">Exercise 1-3 times a week.</span>
                  </div>
                </button>
                <button className={`option-btn ${formData.activityLevel === 'active' ? 'selected' : ''}`} onClick={() => { updateForm('activityLevel', 'active'); handleNext(); }}>
                  <div className="option-icon"><Dumbbell size={28} /></div>
                  <div className="option-text-group">
                    <span className="option-label">Athlete</span>
                    <span className="option-desc">Intense daily workouts.</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="step-title">The details.</h2>
              <p className="step-subtitle">Just a few numbers to calibrate our engines.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <select value={formData.gender} onChange={(e) => updateForm('gender', e.target.value)} required>
                  <option value="" disabled>Biological Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                
                <input type="number" placeholder="Age (years)" value={formData.age} onChange={(e) => updateForm('age', e.target.value)} required />
                <input type="number" placeholder="Height (cm)" value={formData.height} onChange={(e) => updateForm('height', e.target.value)} required />
                <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={(e) => updateForm('weight', e.target.value)} required />
                
                <button 
                  className="primary-btn orange" 
                  onClick={handleSubmit}
                  disabled={!formData.age || !formData.height || !formData.weight || !formData.gender || loading}
                  style={{ marginTop: '20px' }}
                >
                  {loading ? 'Calibrating...' : 'Start Journey'}
                  {!loading && <ChevronRight size={20} />}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
