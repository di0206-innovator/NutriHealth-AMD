import { useEffect } from 'react';
import { useMeals } from '../hooks/useMeals';
import MealCard from '../components/MealCard';
import SkeletonLoader from '../components/SkeletonLoader';

export default function History({ user }) {
  const { meals, loading, loadMeals } = useMeals(user?.uid);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  return (
    <main className="history-page page-container" role="main">
      <header className="page-header">
        <h1 className="page-title">Meal History</h1>
        <p className="page-subtitle">Track your nutrition journey</p>
      </header>

      {loading && (
        <div className="history-list" aria-busy="true">
          <SkeletonLoader type="list" count={5} />
        </div>
      )}

      {!loading && meals.length === 0 && (
        <div className="empty-state glass-panel">
          <div className="empty-icon">📋</div>
          <p>Your history is empty.</p>
          <p className="text-secondary">Log your first meal to start tracking insights.</p>
        </div>
      )}

      {!loading && meals.length > 0 && (
        <div className="history-list glass-panel-container">
          {meals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </main>
  );
}
