import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, Zap, CheckCircle, ChevronDown, Flame, Search, Sparkles, Brain, Mic, MicOff, Barcode, X } from 'lucide-react';
import AnalysisResult from '../components/AnalysisResult';
import { saveMealWithStats } from '../firebase';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Analyze({ user, profile }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mealText, setMealText] = useState('');
  const [listening, setListening] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const fileInputRef = useRef();

  // Barcode Scanner Cleanup
  useEffect(() => {
    return () => {
      // Ensure scanner is stopped if component unmounts
    };
  }, []);

  const startBarcode = () => {
    setShowScanner(true);
    setError(null);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.777778
      });
      
      scanner.render((decodedText) => {
        scanner.clear();
        setShowScanner(false);
        fetchBarcodeData(decodedText);
      }, (err) => {
        // Silently handle scan errors (no barcode in view)
      });
    }, 100);
  };

  const fetchBarcodeData = async (barcode) => {
    setAnalyzing(true);
    try {
      // Snippet 16: OpenFoodFacts Integration
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,nutriments,image_url,ingredients_text`);
      const data = await res.json();
      
      if (data.status === 1) {
        const prod = data.product;
        const nut = prod.nutriments;
        
        setResult({
          food_name: prod.product_name || "Packaged Product",
          health_score: 7, // Calculated or generic for now
          calories_estimate: Math.round(nut['energy-kcal_100g'] || 0),
          macros: {
            protein_g: Math.round(nut.proteins_100g || 0),
            carbs_g: Math.round(nut.carbohydrates_100g || 0),
            fat_g: Math.round(nut.fat_100g || 0),
            fiber_g: Math.round(nut.fiber_100g || 0)
          },
          insights: ["Verified from OpenFoodFacts", "Packaged meal detected"],
          personalized_advice: `This ${prod.product_name} contains ${Math.round(nut.sugars_100g || 0)}g sugar per 100g. Check your daily sugar calibration.`,
          top_ingredients: prod.ingredients_text ? prod.ingredients_text.split(',').slice(0, 3).map(ing => ({
            name: ing.trim(),
            health_impact: "neutral",
            reason: "Ingredient found in verified database."
          })) : []
        });
      } else {
        throw new Error("Product not found in verified database.");
      }
    } catch (e) {
      setError(e.message || "Barcode verification failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Snippet 8: Voice meal logging
  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice calibration not supported in this browser ecosystem.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMealText(transcript);
      handleCapture(null, null, transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.start();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCapture(reader.result.split(',')[1], file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = async (base64 = null, mimeType = 'image/jpeg', textOverride = null) => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const userProfile = {
        goal: profile?.goal || 'general',
        restriction: profile?.restriction || 'none',
        activity_level: profile?.activity || 'moderate'
      };

      if (import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.DEV) {
        const response = await fetch(`${apiUrl}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            meal_text: textOverride || (mealText || (!base64 ? 'Vibrant Mediterranean Bowl' : null)),
            image_base64: base64,
            image_mime_type: mimeType,
            user_profile: userProfile,
            meal_type: 'lunch'
          })
        });
        const data = await response.json();
        
        if (data.success) {
          setResult(data.data);
          setAnalyzing(false);
          return;
        } else {
          setError(data.message || "Deep metabolic scan failed.");
        }
      }

      // Simulator Failover
      await new Promise(r => setTimeout(r, 2200));
      setResult({
        food_name: textOverride || mealText || 'Grilled Atlantic Salmon & Quinoa',
        health_score: 9,
        calories_estimate: 480,
        macros: { protein_g: 34, carbs_g: 42, fat_g: 16, fiber_g: 6 },
        insights: ["High Omega-3 concentration", "Low glycemic index carbs"],
        personalized_advice: "This aligns 94% with your biological target.",
        portion_note: "Standard 250g serving size detected.",
        top_ingredients: [
          { name: "Atlantic Salmon", health_impact: "positive", reason: "Rich in Omega-3" },
          { name: "Quinoa", health_impact: "positive", reason: "Complete protein source" }
        ]
      });
    } catch (e) {
      console.error('AI Ecosystem Connection Interrupted:', e);
      setError("AI Ecosystem Connection Interrupted.");
    } finally {
      setAnalyzing(false);
    }
  };

  const finalizeLog = async () => {
    if (!result || !user) return;
    try {
        await saveMealWithStats(user.uid, {
            name: result.food_name,
            calories: result.calories_estimate,
            protein: result.macros.protein_g,
            carbs: result.macros.carbs_g,
            fat: result.macros.fat_g,
            health_score: result.health_score,
            timestamp: new Date().toISOString()
        });
        setResult(null);
        setMealText('');
    } catch (e) {
        setError("Synchronization failure. Metadata not logged.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px' }}
    >
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />

      {/* Barcode Overlay */}
      {showScanner && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'black', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Barcode Analyzer</h2>
                <button onClick={() => { setShowScanner(false); window.location.reload(); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '12px', borderRadius: '50%', color: 'white' }}>
                    <X size={24} />
                </button>
            </div>
            <div id="reader" style={{ flex: 1 }}></div>
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                Point the camera at the product barcode for authenticated nutritional retrieval.
            </div>
        </div>
      )}

      {!result ? (
        <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            style={{ 
                height: '320px', background: 'white', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid #f2f2f7'
            }}
            onClick={() => !analyzing && fileInputRef.current.click()}
          >
            {analyzing ? (
              <div style={{ textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} style={{ width: '60px', height: '60px', border: '3px solid var(--color-primary)', borderRadius: '50%', borderTopColor: 'transparent', margin: '0 auto' }} />
                <p style={{ marginTop: '16px', fontWeight: 900, fontSize: '0.65rem', color: 'var(--color-primary)' }}>SCANNING...</p>
              </div>
            ) : (
              <>
                <div style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)', padding: '24px', borderRadius: '50%', marginBottom: '16px' }}>
                  <Camera size={40} color="var(--color-primary)" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Vision AI</h3>
              </>
            )}
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.98 }}
            style={{ 
                height: '320px', background: 'white', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid #f2f2f7'
            }}
            onClick={startBarcode}
          >
            <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)', padding: '24px', borderRadius: '50%', marginBottom: '16px' }}>
              <Barcode size={40} color="#007aff" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Barcode Link</h3>
          </motion.div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <input type="text" placeholder="Describe your meal..." value={mealText} onChange={(e) => setMealText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleCapture()} style={{ width: '100%', height: '64px', padding: '0 24px', borderRadius: '20px', border: '1px solid #f2f2f7', background: 'white', boxShadow: 'var(--shadow-sm)', fontSize: '0.95rem', fontWeight: 600 }} />
                <button onClick={startVoice} style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', width: '48px', borderRadius: '16px', border: 'none', background: listening ? 'var(--color-primary)' : '#f2f2f7', color: listening ? 'white' : 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {listening ? <Mic size={20} className="pulse-animation" /> : <Mic size={20} />}
                </button>
            </div>
            <button className="btn-primary" onClick={() => handleCapture()} style={{ width: '64px', height: '64px', borderRadius: '20px', padding: 0 }}><Search size={24} /></button>
        </div>
        </>
      ) : (
        <AnimatePresence>
          <AnalysisResult result={result} onLog={finalizeLog} />
        </AnimatePresence>
      )}

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>{error}</div>}
    </motion.div>
  );
}
