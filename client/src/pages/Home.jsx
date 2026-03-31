import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMeals } from '../hooks/useMeals';
import HealthScoreRing from '../components/HealthScoreRing';
import MealCard from '../components/MealCard';
import SkeletonLoader from '../components/SkeletonLoader';

const GOAL_LABELS = {
  weight_loss: 'Weight loss',
  muscle_gain: 'Muscle gain',
  energy: 'Energy boost',
  gut_health: 'Gut health',
  general: 'General wellness'
};

export default function Home({ user, profile }) {
  const { meals, todayMeals, dailyScore, loading, loadMeals } = useMeals(user?.uid);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  return (
    <main className="home-page page-container" role="main">
      <header className="home-header">
        <div>
          <p className="greeting-sub">Goal: {GOAL_LABELS[profile?.goal] || 'General'}</p>
          <h1 className="greeting-title">Today's nutrition</h1>
        </div>
      </header>

      <section aria-label="Daily health score" className="health-score-section">
        <HealthScoreRing score={dailyScore} mealCount={todayMeals.length} />
      </section>

      <section className="quick-stats" aria-label="Today's meal stats">
        <div className="stat-card" role="group" aria-label="Meals logged today">
          <span className="stat-value">{todayMeals.length}</span>
          <span className="stat-label">meals</span>
        </div>
        <div className="stat-card" role="group" aria-label="Total calories today">
          <span className="stat-value">
            {todayMeals.reduce((s, m) => s + (m.calories_estimate || 0), 0)}
          </span>
          <span className="stat-label">calories</span>
        </div>
        <div className="stat-card" role="group" aria-label="Average health score">
          <span className="stat-value">{dailyScore ?? '—'}</span>
          <span className="stat-label">avg score</span>
        </div>
      </section>

      <Link to="/analyze" className="cta-button primary-btn" aria-label="Log a new meal">
        Log a meal
      </Link>

      <section className="recent-meals-section" aria-label="Recent meals">
        <h2 className="section-title">Recent meals</h2>
        {loading && <SkeletonLoader type="list" count={3} />}
        {!loading && meals.length === 0 && (
          <div className="empty-state" role="status">
            <p>No meals logged yet. Tap "Log a meal" to get started.</p>
          </div>
        )}
        {!loading && meals.slice(0, 5).map(meal => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </section>
    </main>
  );
}
