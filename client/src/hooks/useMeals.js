import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

export const useMeals = (uid) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Snippet 5: Firestore real-time listener
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    
    const q = query(
      collection(db, 'users', uid, 'meals'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    
    // Real-time listener — auto-updates when Firestore changes
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMeals(data);
        setLoading(false);
      },
      (err) => {
        console.error("Meal stream interrupted:", err);
        setError('Could not load meal history');
        setLoading(false);
      }
    );
    
    return unsubscribe; // cleanup on unmount
  }, [uid]);

  return { meals, loading, error };
};

// Snippet 1: Meal similarity memory search
export const findSimilarMeals = async (uid, foodName) => {
  if (!uid || !foodName) return [];
  
  const q = query(
    collection(db, 'users', uid, 'meals'),
    where('food_name', '>=', foodName.substring(0, 4)),
    limit(5)
  );
  
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.error("Similarity Memory Failure:", e);
    return [];
  }
};
