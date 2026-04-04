import { motion } from 'framer-motion';
import { Calendar, Search, Filter, Beef, Zap, Clock, ChevronRight, Activity, Flame, TrendingUp } from 'lucide-react';

export default function History({ meals }) {
  const groupMealsByDate = (mealList) => {
    if (!mealList) return {};
    return mealList.reduce((groups, meal) => {
      const date = new Date(meal.timestamp).toLocaleDateString('en-US', { 
        month: 'long', day: 'numeric', year: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(meal);
      return groups;
    }, {});
  };

  const groupedHistory = groupMealsByDate(meals);
  const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0);
  const avgProtein = (meals.reduce((s, m) => s + (m.protein || 0), 0) / (meals.length || 1)).toFixed(1);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '100px' }}>
      
      {/* 1. History Metadata Scroller */}
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '12px', overflowX: 'auto', margin: '0 -20px', padding: '0 20px', scrollbarWidth: 'none' }}>
         {[
           { label: 'Total Volume', value: `${meals.length} Meals`, icon: <TrendingUp size={14} />, color: 'var(--color-primary)' },
           { label: 'Avg Protein', value: `${avgProtein}g`, icon: <Zap size={14} />, color: 'var(--color-secondary)' },
           { label: 'Calories Consumed', value: `${totalCalories} kcal`, icon: <Flame size={14} />, color: '#ff9500' }
         ].map((stat, i) => (
           <div key={i} style={{ minWidth: '150px', background: 'white', padding: '16px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: stat.color, marginBottom: '8px' }}>
                 {stat.icon}
                 <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>{stat.label}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>{stat.value}</div>
           </div>
         ))}
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', background: 'white', padding: '16px 20px', borderRadius: '24px', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.03)' }}>
        <Search size={20} color="var(--color-text-tertiary)" />
        <input type="text" placeholder="Explore metabolic history..." style={{ background: 'transparent', border: 'none', width: '100%', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }} />
        <Filter size={18} color="var(--color-primary)" />
      </motion.div>

      {Object.entries(groupedHistory).map(([date, dateMeals]) => (
        <div key={date} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
             <Calendar size={14} color="var(--color-primary)" />
             <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {date === new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) ? 'TODAY' : date}
             </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dateMeals.map((meal) => (
              <motion.div key={meal.id} variants={itemVariants} whileTap={{ scale: 0.97 }} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'white', borderRadius: '28px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.02)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '18px', background: meal.health_score >= 8 ? '#ecfdf5' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: meal.health_score >= 8 ? '#34c759' : '#ff9500' }}>
                   {meal.health_score >= 8 ? <Activity size={28} /> : <Flame size={28} />}
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{meal.name}</h4>
                      <div style={{ padding: '4px 10px', background: 'var(--color-surface-bg)', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 900, color: 'var(--color-primary)' }}>{meal.health_score}/10</div>
                   </div>
                   <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 700 }}><Zap size={14} color="var(--color-secondary)" /> {meal.protein}g P</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 700 }}><Clock size={14} /> {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 700 }}><Flame size={14} color="var(--color-primary)" /> {meal.calories} kcal</div>
                   </div>
                </div>
                <ChevronRight size={20} color="var(--color-border)" />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
