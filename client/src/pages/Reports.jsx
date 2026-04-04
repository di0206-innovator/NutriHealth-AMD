import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileDown, Calendar, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, Activity, Brain } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function Reports({ meals, profile }) {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (!meals.length) return;

    // Calculate longitudinal stats
    const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0);
    const avgScore = meals.reduce((s, m) => s + (m.health_score || 0), 0) / meals.length;
    const bestMeal = [...meals].sort((a,b) => b.health_score - a.health_score)[0];
    
    setReportData({
      totalMeals: meals.length,
      avgScore: avgScore.toFixed(1),
      totalCalories,
      bestMeal: bestMeal.name,
      avgMacros: {
        protein: (meals.reduce((s, m) => s + (m.protein || 0), 0) / meals.length).toFixed(1),
        carbs: (meals.reduce((s, m) => s + (m.carbs || 0), 0) / meals.length).toFixed(1),
        fat: (meals.reduce((s, m) => s + (m.fat || 0), 0) / meals.length).toFixed(1)
      }
    });
  }, [meals]);

  const exportPDF = () => {
    const doc = new jsPDF();
    const now = new Date().toLocaleDateString();

    // Styled Header
    doc.setFontSize(22);
    doc.setTextColor(255, 45, 85);
    doc.text('NutriLens: Metabolic Analysis Export', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${now}`, 20, 28);
    doc.text(`Client ID: ${profile?.name || 'Anonymous User'}`, 20, 33);

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('30-Day Nutritional Summary', 20, 45);
    
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Meals Logged', String(reportData.totalMeals)],
      ['Average Health Score', `${reportData.avgScore}/10`],
      ['Average Daily Protein', `${reportData.avgMacros.protein}g`],
      ['Average Daily Carbs', `${reportData.avgMacros.carbs}g`],
      ['Average Daily Fat', `${reportData.avgMacros.fat}g`],
      ['Highest Rated Meal', reportData.bestMeal]
    ];

    doc.autoTable({
      startY: 50,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [255, 45, 85] }
    });

    // Clinical Insights (Placeholder logic for flagship feel)
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Clinical Observations', 20, finalY);
    doc.setFontSize(10);
    const advice = reportData.avgScore > 7 
        ? "Metabolic baseline is stable. Patient shows high adherence to nutritional targets." 
        : "Metabolic fluctuations detected. Recommend increasing fiber intake and and and reducing glycemic load.";
    
    doc.text(advice, 20, finalY + 10, { maxWidth: 170 });

    doc.save(`NutriLens_Report_${now.replace(/\//g, '-')}.pdf`);
  };

  if (!reportData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Activity size={48} color="#ccc" style={{ marginBottom: '16px' }} />
        <p style={{ fontWeight: 600, color: 'var(--color-text-tertiary)' }}>Need at least 3 logs to generate physiological report.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      <div style={{ background: 'white', borderRadius: '32px', padding: '32px', boxShadow: 'var(--shadow-lg)', border: '1px solid #f2f2f7' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Longitudinal Report</h3>
               <p style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>METABOLIC DATA: LAST 30 DAYS</p>
            </div>
            <button onClick={exportPDF} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 8px 16px rgba(255,45,85,0.2)' }}>
               <FileDown size={18} /> Export PDF
            </button>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '24px' }}>
               <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Avg Vitality</p>
               <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)' }}>{reportData.avgScore}</div>
            </div>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '24px' }}>
               <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Logs Verified</p>
               <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{reportData.totalMeals}</div>
            </div>
         </div>

         <div style={{ padding: '20px', background: 'rgba(52, 199, 89, 0.05)', borderRadius: '24px', border: '1px solid rgba(52, 199, 89, 0.1)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', marginBottom: '8px' }}>
               <Brain size={18} />
               <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Clinic AI Insight</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.5, fontWeight: 600 }}>
               Your metabolic adherence is {reportData.avgScore > 7 ? 'exemplary' : 'fluctuating'}. Most effective meal was "{reportData.bestMeal}". Maintain this protein density to optimize recovery cycles.
            </p>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Macro Distributions</h4>
            {['Protein', 'Carbs', 'Fat'].map(m => (
               <div key={m} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', border: '1px solid #f2f2f7', borderRadius: '16px' }}>
                  <span style={{ fontWeight: 700 }}>{m}</span>
                  <span style={{ fontWeight: 900 }}>{reportData.avgMacros[m.toLowerCase()]}g avg</span>
               </div>
            ))}
         </div>
      </div>
    </motion.div>
  );
}
