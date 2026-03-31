import MacroChart from './MacroChart';

const SCORE_LABEL = (s) => s >= 8 ? 'Excellent' : s >= 6 ? 'Good' : s >= 4 ? 'Fair' : 'Poor';
const SCORE_COLOR = (s) => s >= 8 ? 'score-excellent' : s >= 6 ? 'score-good' : s >= 4 ? 'score-fair' : 'score-poor';

export default function AnalysisResult({ result, mealType, onReset }) {
  const { food_name, health_score, calories_estimate, macros, 
          insights, healthier_alternatives, personalized_advice, portion_note } = result;

  return (
    <article className="result-card glass-panel fade-in" aria-label={`Nutrition analysis for ${food_name}`}>
      <div className="result-header">
        <div>
          <h2 className="result-food-name">{food_name}</h2>
          <span className="result-meal-type badge">{mealType}</span>
        </div>
        <div className={`score-badge ${SCORE_COLOR(health_score)}`} 
             aria-label={`Health score: ${health_score} out of 10, ${SCORE_LABEL(health_score)}`}>
          <span className="score-number">{health_score}</span>
          <span className="score-label-text">{SCORE_LABEL(health_score)}</span>
        </div>
      </div>

      <div className="calories-hero" aria-label={`Estimated ${calories_estimate} calories`}>
        <span className="calories-number">{calories_estimate}</span>
        <span className="calories-unit">kcal</span>
      </div>

      <MacroChart macros={macros} aria-label="Macronutrient breakdown" />

      <section className="insights-section" aria-label="Nutrition insights">
        <h3 className="section-label"><span aria-hidden="true">💡</span> Insights</h3>
        <ul className="insights-list">
          {insights.map((insight, i) => (
            <li key={i} className="insight-item">{insight}</li>
          ))}
        </ul>
      </section>

      <section className="advice-section" aria-label="Personalised advice">
        <h3 className="section-label"><span aria-hidden="true">🎯</span> For your goal</h3>
        <p className="advice-text">{personalized_advice}</p>
        {portion_note && <p className="portion-note">{portion_note}</p>}
      </section>

      <section className="alternatives-section" aria-label="Healthier alternatives">
        <h3 className="section-label"><span aria-hidden="true">🔄</span> Healthier alternatives</h3>
        <ul className="alt-list">
          {healthier_alternatives.map((alt, i) => (
            <li key={i} className="alt-item">{alt}</li>
          ))}
        </ul>
      </section>

      <button className="reset-btn secondary-btn" onClick={onReset} aria-label="Analyse another meal">
        Analyse another meal
      </button>
    </article>
  );
}
