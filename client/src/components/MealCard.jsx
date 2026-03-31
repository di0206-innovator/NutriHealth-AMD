export default function MealCard({ meal }) {
  const date = meal.timestamp?.toDate ? meal.timestamp.toDate() : new Date();
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const SCORE_COLOR = (s) => s >= 8 ? 'score-excellent' : s >= 6 ? 'score-good' : s >= 4 ? 'score-fair' : 'score-poor';

  return (
    <article className="meal-card glass-panel fade-in" aria-label={`Meal: ${meal.food_name}`}>
      <div className="meal-card-main">
        <h3 className="meal-name">{meal.food_name}</h3>
        <p className="meal-meta">
          <span className="meal-time">{timeString}</span> • <span className="meal-type">{meal.meal_type || 'meal'}</span>
        </p>
        <div className="meal-stats">
          <span className="meal-calories">{meal.calories_estimate} kcal</span>
        </div>
      </div>
      <div className={`meal-score-circle ${SCORE_COLOR(meal.health_score)}`} aria-label={`Score: ${meal.health_score}`}>
        {meal.health_score}
      </div>
    </article>
  );
}
