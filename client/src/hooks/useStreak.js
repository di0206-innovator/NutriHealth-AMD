import { useState, useEffect } from 'react';
import { getDailyStats } from '../firebase';

const MILESTONES = { 
  3: 'Three days strong', 
  7: 'One week of consistency', 
  14: 'Two weeks of dedication', 
  30: 'One full month of vitality' 
};

async function calculateStreak(uid) {
  const stats = await getDailyStats(uid, 30); // Get last 30 days
  let days = 0;
  const today = new Date();
  
  // Logic to walk backwards through the dates
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    
    // Check if the user logged any meals on this date
    if (stats[key]?.total_meals > 0) {
      days++;
    } else {
      // If no meals were logged today, the streak is only broken if yesterday was also missed
      // (This allows the user to still log for "today")
      if (i > 0) break; 
    }
  }
  
  return { days, isMilestone: MILESTONES[days] !== undefined };
}

export function useStreak(uid) {
  const [streak, setStreak] = useState(0);
  const [milestone, setMilestone] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    calculateStreak(uid).then(({ days, isMilestone }) => {
      setStreak(days);
      if (isMilestone) setMilestone(MILESTONES[days]);
      setLoading(false);
    }).catch(err => {
      console.error("Streak Calculation Interrupted:", err);
      setLoading(false);
    });
  }, [uid]);
  
  return { streak, milestone, loading };
}
