import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, List, Save, CheckCircle2, ChevronRight, UtensilsCrossed, Flame, Info } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function RecipeBuilder({ user }) {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingName, setIngName] = useState('');
  const [ingCals, setIngCals] = useState('');
  const [ingProt, setIngProt] = useState('');
  const [ingCarbs, setIngCarbs] = useState('');
  const [ingFat, setIngFat] = useState('');
  const [saved, setSaved] = useState(false);

  const addIngredient = () => {
    if (!ingName || !ingCals) return;
    setIngredients([...ingredients, {
      id: Date.now(),
      name: ingName,
      calories: Number(ingCals),
      protein: Number(ingProt || 0),
      carbs: Number(ingCarbs || 0),
      fat: Number(ingFat || 0)
    }]);
    setIngName(''); setIngCals(''); setIngProt(''); setIngCarbs(''); setIngFat('');
  };

  const removeIngredient = (id) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const totals = ingredients.reduce((acc, i) => ({
    calories: acc.calories + i.calories,
    protein: acc.protein + i.protein,
    carbs: acc.carbs + i.carbs,
    fat: acc.fat + i.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const saveRecipe = async () => {
    if (!recipeName || !ingredients.length || !user) return;
    
    try {
      await addDoc(collection(db, 'users', user.uid, 'recipes'), {
        name: recipeName,
        ingredients: ingredients,
        totals: totals,
        createdAt: serverTimestamp()
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false); setRecipeName(''); setIngredients([]);
      }, 2000);
    } catch (e) {
      console.error("Recipe Save Interrupted:", e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '32px', boxShadow: 'var(--shadow-lg)', border: '1px solid #f2f2f7' }}>
         <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '24px' }}>Recipe Ecosystem</h2>
         
         <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Recipe Signature</label>
            <input 
              type="text" 
              placeholder="e.g. Grandma's Special Lentil Soup" 
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              style={{ width: '100%', height: '64px', padding: '0 24px', borderRadius: '20px', border: '1px solid #f2f2f7', background: 'white', fontSize: '1rem', fontWeight: 600 }}
            />
         </div>

         <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--color-secondary)' }}>
               <UtensilsCrossed size={18} />
               <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Capture Individual Bio-Data</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input placeholder="Ingredient" value={ingName} onChange={(e) => setIngName(e.target.value)} style={{ height: '56px', padding: '0 16px', borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '0.85rem' }} />
                <input placeholder="Kcal" type="number" value={ingCals} onChange={(e) => setIngCals(e.target.value)} style={{ height: '56px', padding: '0 16px', borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '0.85rem' }} />
                <input placeholder="Prot(g)" type="number" value={ingProt} onChange={(e) => setIngProt(e.target.value)} style={{ height: '56px', padding: '0 16px', borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '0.85rem' }} />
            </div>
            
            <button 
                onClick={addIngredient}
                style={{ width: '100%', height: '56px', background: 'white', border: '1px solid var(--color-secondary)', color: 'var(--color-secondary)', borderRadius: '16px', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
                <Plus size={18} /> Add Component
            </button>
         </div>

         {ingredients.length > 0 && (
           <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '16px' }}>Biological Components</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ingredients.map(ing => (
                  <motion.div key={ing.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'white', border: '1px solid #f2f2f7', borderRadius: '16px' }}>
                     <div>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{ing.name}</span>
                        <span style={{ marginLeft: '12px', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>{ing.calories} kcal · {ing.protein}g protein</span>
                     </div>
                     <button onClick={() => removeIngredient(ing.id)} style={{ color: '#ff3b30', background: 'none', border: 'none', padding: '6px' }}><X size={18} /></button>
                  </motion.div>
                ))}
              </div>
           </div>
         )}

         {ingredients.length > 0 && (
            <div style={{ background: 'var(--color-text-primary)', color: 'white', padding: '24px', borderRadius: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                   <span style={{ fontSize: '1rem', fontWeight: 800 }}>Computed Metabolic Yield</span>
                   <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-primary)' }}>{totals.calories} kcal</span>
                </div>
                <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', fontWeight: 700, opacity: 0.8 }}>
                   <span>Prot: {totals.protein}g</span>
                   <span>Carbs: {totals.carbs}g</span>
                   <span>Fat: {totals.fat}g</span>
                </div>
            </div>
         )}

         <button 
           onClick={saveRecipe}
           disabled={!recipeName || !ingredients.length}
           style={{ width: '100%', height: '64px', background: saved ? '#34c759' : 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '1rem', fontWeight: 900, boxShadow: '0 10px 30px rgba(255,45,85,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: (!recipeName || !ingredients.length) ? 0.5 : 1 }}
         >
           {saved ? <CheckCircle2 size={24} /> : <Save size={24} />}
           {saved ? 'AUTHENTICATED & SAVED' : 'COMMIT TO ECOSYSTEM'}
         </button>
      </div>
    </motion.div>
  );
}
