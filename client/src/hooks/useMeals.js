import { useState, useCallback } from 'react';
import { saveMeal, getRecentMeals, getTodayMeals } from '../firebase';

export function useMeals(uid) {
  const [meals, setMeals] = useState([]);
  const [todayMeals, setTodayMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMeals = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    try {
      const [recent, today] = await Promise.all([
        getRecentMeals(uid, 20),
        getTodayMeals(uid)
      ]);
      setMeals(recent);
      setTodayMeals(today);
    } catch (err) {
      setError('Could not load meal history');
    } finally {
      setLoading(false);
    }
  }, [uid]);

  const addMeal = useCallback(async (mealData) => {
    if (!uid) return;
    try {
      await saveMeal(uid, mealData);
      await loadMeals();
    } catch (err) {
      setError('Could not save meal');
    }
  }, [uid, loadMeals]);

  const dailyScore = todayMeals.length > 0
    ? Math.round(todayMeals.reduce((sum, m) => sum + (m.health_score || 0), 0) / todayMeals.length)
    : null;

  return { meals, todayMeals, dailyScore, loading, error, loadMeals, addMeal };
}
