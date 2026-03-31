export default function MealCard({ meal }) {
  const date = meal.timestamp?.toDate ? meal.timestamp.toDate() : new Date();
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const score = meal.health_score || 0;
  
  const getScoreColor = (s) => 
    s >= 8 ? 'var(--color-success)' : 
    s >= 6 ? 'var(--color-primary)' : 
    s >= 4 ? 'var(--color-warning)' : 
    'var(--color-error)';

  return (
    <article className="meal-card glass-panel" aria-label={`Meal: ${meal.food_name}`}>
      <div className="meal-card-content">
        <div className="meal-info">
          <h3 className="meal-name">{meal.food_name}</h3>
          <p className="meal-meta">
            <span className="meal-time">{timeString}</span> • <span className="meal-type">{meal.meal_type || 'meal'}</span>
          </p>
        </div>
        <div className="meal-metrics">
          <div className="meal-stats">
            <span className="meal-calories" style={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>
              {meal.calories_estimate}
            </span>
            <span className="meal-unit">kcal</span>
          </div>
          <div 
            className="meal-score-pill" 
            style={{ 
              borderColor: getScoreColor(score),
              color: getScoreColor(score),
              background: `${getScoreColor(score)}10`
            }}
          >
            {score}
          </div>
        </div>
      </div>
    </article>
  );
}
