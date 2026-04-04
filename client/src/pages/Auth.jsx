import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, Brain, Leaf } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({ uid: 'user-' + Date.now(), email });
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '40px 24px', background: '#ffffff' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}>
         <div style={{ display: 'inline-flex', background: 'var(--color-primary)', color: 'white', padding: '16px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(255,45,85,0.2)', marginBottom: '24px' }}>
            <Leaf size={40} />
         </div>
         <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Vitality Pro</h1>
         <p style={{ color: 'var(--color-text-tertiary)', fontWeight: 700, marginTop: '8px' }}>Ecological Health Intelligence</p>
      </header>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div style={{ position: 'relative' }}>
           <Mail style={{ position: 'absolute', left: '20px', top: '18px', color: 'var(--color-text-tertiary)' }} size={20} />
           <input 
              type="email" 
              required 
              placeholder="Ecosystem ID (Email)" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', height: '56px', borderRadius: '20px', background: '#f8f9fa', border: '1px solid #f2f2f7', padding: '0 20px 0 56px', fontSize: '1rem', fontWeight: 600 }}
           />
        </div>

        <div style={{ position: 'relative' }}>
           <Lock style={{ position: 'absolute', left: '20px', top: '18px', color: 'var(--color-text-tertiary)' }} size={20} />
           <input 
              type="password" 
              required 
              placeholder="Biometric Passcode" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', height: '56px', borderRadius: '20px', background: '#f8f9fa', border: '1px solid #f2f2f7', padding: '0 20px 0 56px', fontSize: '1rem', fontWeight: 600 }}
           />
        </div>

        <button 
          className="btn-primary" 
          type="submit" 
          disabled={loading}
          style={{ height: '64px', borderRadius: '24px', background: 'var(--color-primary)', boxShadow: '0 10px 30px rgba(255,45,85,0.15)', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 900 }}
        >
          {loading ? 'Decrypting Profile...' : <><LogIn size={20} /> Initialize Calibration</>}
        </button>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-text-tertiary)', fontWeight: 800, fontSize: '0.8rem' }}>
              <Brain size={16} color="var(--color-secondary)" />
              Powered by Vision AI Ecosystem
           </div>
        </div>
      </motion.form>
    </div>
  );
}
