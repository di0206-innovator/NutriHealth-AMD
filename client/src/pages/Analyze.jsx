import { useState, useRef, useCallback } from 'react';
import { useMeals } from '../hooks/useMeals';
import AnalysisResult from '../components/AnalysisResult';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Analyze({ user, profile }) {
  const { addMeal } = useMeals(user?.uid);
  const [mealText, setMealText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mealType, setMealType] = useState(() => {
    const h = new Date().getHours();
    if (h < 10) return 'breakfast';
    if (h < 14) return 'lunch';
    if (h < 18) return 'snack';
    return 'dinner';
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleAnalyze = useCallback(async () => {
    if (!mealText && !imageFile) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = {
        meal_text: mealText || null,
        meal_type: mealType,
        user_profile: profile ? {
          goal: profile.goal,
          restriction: profile.restriction,
          activity_level: profile.activity_level
        } : null
      };

      if (imageFile) {
        body.image_base64 = await fileToBase64(imageFile);
        body.image_mime_type = imageFile.type;
      }

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (!data.success) {
        setError(data);
        return;
      }

      setResult(data.data);

      if (user?.uid) {
        await addMeal({
          food_name: data.data.food_name,
          health_score: data.data.health_score,
          calories_estimate: data.data.calories_estimate,
          macros: data.data.macros,
          insights: data.data.insights,
          meal_type: mealType,
          had_image: !!imageFile
        });
      }
    } catch (err) {
      setError({
        message: 'Could not connect to the analysis service',
        suggestion: 'Check your connection and try again'
      });
    } finally {
      setLoading(false);
    }
  }, [mealText, imageFile, mealType, profile, user, addMeal]);

  const reset = () => {
    setResult(null);
    setError(null);
    setMealText('');
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <main className="analyze-page page-container" role="main">
      <h1 className="page-title editorial-title">Scan or Describe</h1>

      {!result && !loading && (
        <section className="analyze-form" aria-label="Food analysis form">
          <div className="meal-type-row" role="group" aria-label="Select meal type">
            {MEAL_TYPES.map(type => (
              <button
                key={type}
                className={`meal-type-btn ${mealType === type ? 'active' : ''}`}
                onClick={() => setMealType(type)}
                aria-pressed={mealType === type}
                aria-label={`Meal type: ${type}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="upload-zone viewfinder" 
               onClick={() => fileRef.current?.click()}
               onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
               tabIndex={0}
               role="button"
               aria-label="Upload a food photo — click or press enter">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded food" className="image-preview" />
            ) : (
              <div className="upload-placeholder" aria-hidden="true">
                <span className="upload-icon">◎</span>
                <span className="upload-main-text">Capture Nutritional Intelligence</span>
                <span className="upload-sub">Tap to scan your meal</span>
              </div>
            )}
          </div>
          <input 
            ref={fileRef}
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="sr-only"
            aria-label="Food photo file input"
            tabIndex={-1}
          />

          <div className="text-input-group">
            <label htmlFor="meal-input" className="input-label sr-only">
              Or describe your meal
            </label>
            <input
              id="meal-input"
              type="text"
              className="meal-input"
              placeholder="Or describe your meal (e.g. 2 slices of pizza)"
              value={mealText}
              onChange={(e) => setMealText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              aria-label="Describe your meal in text"
            />
          </div>

          {error && <ErrorState error={error} onRetry={() => setError(null)} />}

          <button
            className="analyze-btn primary-btn"
            onClick={handleAnalyze}
            disabled={!mealText && !imageFile}
            aria-label="Analyse meal for nutrition information"
          >
            Analyse meal
          </button>
        </section>
      )}

      {loading && (
        <div role="status" aria-live="polite" aria-label="Analysing your meal...">
          <SkeletonLoader type="result" />
        </div>
      )}

      {result && !loading && (
        <AnalysisResult result={result} mealType={mealType} onReset={reset} />
      )}
    </main>
  );
}
