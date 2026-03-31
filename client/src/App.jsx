import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getUserProfile } from './firebase';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import History from './pages/History';
import SkeletonLoader from './components/SkeletonLoader';
import './styles/global.css';
import './styles/components.css';
import './styles/animations.css';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(undefined);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(p => {
      setProfile(p);
      setProfileLoading(false);
    });
  }, [user]);

  if (authLoading || profileLoading) {
    return (
      <div className="app-loading" role="status" aria-label="Loading NutriLens">
        <SkeletonLoader type="app" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!profile ? (
          <>
            <Route path="/onboarding" element={
              <Onboarding user={user} onComplete={setProfile} />
            } />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<Home user={user} profile={profile} />} />
            <Route path="/analyze" element={<Analyze user={user} profile={profile} />} />
            <Route path="/history" element={<History user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}
