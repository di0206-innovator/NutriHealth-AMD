import { useState, useEffect } from 'react';
import { signInAnon, onAuth } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
      } else {
        try {
          await signInAnon();
        } catch (error) {
          console.error('Auth error:', error);
          setLoading(false);
        }
      }
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
