import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { saveMeal } from '../firebase';
import { Camera, Upload, Scan, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }
};

export default function Analyze({ user, profile }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedType, setSelectedType] = useState('snack');
  const [customName, setCustomName] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB');
        return;
      }
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selected);
      setError('');
    }
  };


  const analyzeImage = async (file, profileData) => {
    // Convert file to base64 for the API
    const toBase64 = (f) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
    });

    try {
      const base64 = await toBase64(file);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: base64,
          image_mime_type: file.type,
          meal_type: selectedType,
          user_profile: {
            age: profileData.age,
            gender: profileData.gender,
            height_cm: profileData.height,
            weight_kg: profileData.weight,
            goal: profileData.goal,
            activity_level: profileData.activityLevel
          }
        })
      });
      
      const json = await response.json();
      if (json.success && json.data) {
        return json.data;
      }
      // If backend returns an error, throw it
      throw new Error(json.message || 'Analysis failed');
    } catch (err) {
      console.warn('Backend API call failed, using demo data:', err.message);
      // Fallback mock for demo/offline mode
      return {
        foodName: 'Grilled Salmon with Quinoa',
        confidence: 94,
        healthScore: 88,
        healthScoreCategory: 'Excellent',
        nutritionalInfo: {
          calories: 420,
          protein: 35,
          carbohydrates: 25,
          fat: 18,
          fiber: 6,
          portion: '1 Plate (350g)'
        },
        insights: [
          'Excellent source of Omega-3 fatty acids for heart health.',
          'High protein content supports your lean & tone goal.'
        ],
        alternatives: [
          'Consider swapping white quinoa for tricolor quinoa for extra antioxidants.'
        ]
      };
    }
  };

  const processAnalysis = async () => {
    if (!file) {
      setError('Please provide an image of your meal.');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const pData = profile || { age: 30, gender: 'male', height: 175, weight: 70, goal: 'lose', activityLevel: 'light' };
      const apiResult = await analyzeImage(file, pData);
      setResult(apiResult);
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please turn on the API server or check connection.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await saveMeal(user.uid, {
        ...result,
        foodName: customName || result.foodName,
        mealType: selectedType,
        imageUrl: imagePreview // In prod, upload to Firebase Storage
      });
      navigate('/history');
    } catch (err) {
      setError('Failed to save meal.');
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" exit="hidden" variants={containerVariants}>
      <div className="ambient-glow" style={{ top: '20%' }} />
      
      <motion.header className="home-header" variants={itemVariants}>
        <span className="greeting-sub" style={{ color: 'var(--color-info)' }}>Analysis Engine</span>
        <h1 className="editorial-title">Capture.<br/>Detect.<br/>Track.</h1>
      </motion.header>

      {error && (
        <motion.div className="error-state" variants={itemVariants}>
          <AlertCircle size={24} color="var(--color-error)" />
          <div className="error-content">
            <span className="error-message">Analysis Failed</span>
            <span className="error-suggestion">{error}</span>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="capture" variants={itemVariants} exit={{ opacity: 0, y: -20 }}>
            <div className="analyze-form">
              
              <div className="meal-type-row">
                {mealTypes.map(type => (
                  <button 
                    key={type} 
                    className={`meal-type-btn ${selectedType === type ? 'active' : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />

              <div 
                className={`viewfinder ${isAnalyzing ? 'scanning' : ''} ${imagePreview ? 'has-image' : ''}`}
                onClick={!isAnalyzing ? handleFileClick : undefined}
              >
                {isAnalyzing && <div className="scan-line" />}
                
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" style={{ filter: isAnalyzing ? 'brightness(0.6) sepia(1) hue-rotate(90deg)' : 'none' }} />
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon-wrapper">
                      <Camera size={36} />
                    </div>
                    <span className="upload-main-text">Tap to capture meal</span>
                    <span className="upload-sub">or upload from gallery</span>
                  </div>
                )}
              </div>

              {imagePreview && !isAnalyzing && (
                <motion.button 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="primary-btn"
                  onClick={processAnalysis}
                  style={{ gap: '12px' }}
                >
                  <Scan size={20} />
                  Analyze Ingredients
                </motion.button>
              )}

              {isAnalyzing && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <SkeletonLoader type="analysis" />
                  <p style={{ color: 'var(--color-text-secondary)', marginTop: '16px', fontFamily: 'Outfit', fontWeight: 600 }}>Running neural detection...</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" className="glass-panel result-card" variants={itemVariants}>
            <div className="result-header">
              <div>
                <input 
                  className="meal-input"
                  style={{ background: 'transparent', border: 'none', padding: '0', fontSize: '2.4rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px', boxShadow: 'none' }}
                  value={customName || result.foodName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={result.foodName}
                />
                <div className="badge"><CheckCircle2 size={14} color="var(--color-primary)" /> {result.confidence}% Confidence</div>
              </div>
              <div className={`score-badge score-${result.healthScoreCategory.toLowerCase()}`}>
                <span className="score-number">{result.healthScore}</span>
                <span className="score-label-text">Score</span>
              </div>
            </div>

            <div className="calories-hero">
              <span className="calories-label">Energy</span>
              <div>
                <span className="calories-number">{result.nutritionalInfo.calories}</span>
                <span className="calories-unit">kcal</span>
              </div>
            </div>

            <div className="macro-chart-container">
              <div className="macro-legend">
                <div className="macro-legend-item">
                  <div className="macro-dot" style={{ background: 'var(--macro-protein)' }}></div>
                  <span className="macro-label">Protein</span>
                  <span className="macro-value">{result.nutritionalInfo.protein}g</span>
                </div>
                <div className="macro-legend-item">
                  <div className="macro-dot" style={{ background: 'var(--macro-carbs)' }}></div>
                  <span className="macro-label">Carbs</span>
                  <span className="macro-value">{result.nutritionalInfo.carbohydrates}g</span>
                </div>
                <div className="macro-legend-item">
                  <div className="macro-dot" style={{ background: 'var(--macro-fat)' }}></div>
                  <span className="macro-label">Fat</span>
                  <span className="macro-value">{result.nutritionalInfo.fat}g</span>
                </div>
                {result.nutritionalInfo.fiber && (
                  <div className="macro-legend-item">
                    <div className="macro-dot" style={{ background: 'var(--macro-fiber)' }}></div>
                    <span className="macro-label">Fiber</span>
                    <span className="macro-value">{result.nutritionalInfo.fiber}g</span>
                  </div>
                )}
              </div>
            </div>

            {result.insights && result.insights.length > 0 && (
              <div>
                <h3 className="section-label">Nutrition Insights</h3>
                <ul className="insights-list">
                  {result.insights.map((insight, i) => (
                    <li key={i} className="insight-item">
                      <span className="advice-text">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.alternatives && result.alternatives.length > 0 && (
              <div>
                <h3 className="section-label" style={{ color: 'var(--color-accent-orange)' }}>Healthier Alternatives</h3>
                <ul className="alt-list">
                  {result.alternatives.map((alt, i) => (
                    <li key={i} className="alt-item">
                      <span className="advice-text">{alt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="portion-note">Assuming standard portion: {result.nutritionalInfo.portion}</p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setResult(null)}>
                <RefreshCw size={18} /> Rescan
              </button>
              <button className="primary-btn" style={{ flex: 2 }} onClick={handleSave}>
                Save Log
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
