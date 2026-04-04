import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, History, Users, User, Bell, FileText, Utensils, WifiOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Layout({ user, logout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const shortcuts = { 'h': '/', 'a': '/analyze', 'l': '/history', 'c': '/community', 'p': '/profile', 'r': '/reports', 'k': '/recipes' };
      if (shortcuts[e.key.toLowerCase()]) {
        e.preventDefault();
        navigate(shortcuts[e.key.toLowerCase()]);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [navigate]);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => { 
      window.removeEventListener('online', on); window.removeEventListener('offline', off);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { path: '/', icon: <Home size={22} />, label: 'Home' },
    { path: '/analyze', icon: <Camera size={22} />, label: 'Analyze' },
    { path: '/history', icon: <History size={22} />, label: 'Log' },
    { path: '/recipes', icon: <Utensils size={22} />, label: 'Kitchen' },
    { path: '/reports', icon: <FileText size={22} />, label: 'Pulse' },
    { path: '/profile', icon: <User size={22} />, label: 'Bio' }
  ];

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Command Center';
      case '/analyze': return 'Vision AI';
      case '/history': return 'Metabolic Log';
      case '/community': return 'Metabolic Social';
      case '/reports': return 'Health Pulse';
      case '/recipes': return 'Kitchen Studio';
      case '/profile': return 'Bio-Profile';
      default: return 'Vitality Pro';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', color: 'var(--color-text-primary)' }}>
      <AnimatePresence>
        {offline && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ background: '#ff3b30', color: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                <WifiOff size={16} /> ECOSYSTEM OFFLINE: ANALYTICS SUSPENDED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', padding: '24px 20px 12px', transition: 'all 0.4s', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div>
             <h1 style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>VITALITY PRO</h1>
             <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{getPageTitle(location.pathname)}</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <Bell size={18} color="var(--color-text-secondary)" />
             </button>
             <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(255,45,85,0.2)', overflow: 'hidden', color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>
                {user?.email[0].toUpperCase()}
             </div>
          </div>
        </div>
      </header>

      {/* Snippet 21: Smooth Cinematic Page Transitions */}
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', minHeight: '80vh' }}>
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(30px) saturate(180%)', padding: '12px 14px 34px', borderTop: '1px solid rgba(0,0,0,0.06)', zIndex: 1000 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)', transition: 'all 0.3s', padding: '8px', borderRadius: '14px', background: isActive ? 'rgba(255,45,85,0.08)' : 'transparent', minWidth: '54px'
              })}
            >
              {({ isActive }) => (
                <>
                  <motion.div animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }}>{item.icon}</motion.div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
