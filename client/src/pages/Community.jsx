import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, User, Sparkles, TrendingUp, Zap } from 'lucide-react';

export default function Community() {
  const posts = [
    {
      id: 1,
      user: 'Sarah_Fit',
      content: 'Just smashed my 2200 kcal goal for the 5th day in a row! NutriLens Vision AI is a game changer for my meal prep.',
      likes: 124,
      comments: 12,
      time: '2h ago',
      score: 'A+',
      avatar: 'S'
    },
    {
      id: 2,
      user: 'Marcus_Peak',
      content: 'Post-workout fuel: Grilled Salmon with a side of Quinoa. Perfectly balanced for muscle synthesis. #VitalityPro',
      likes: 89,
      comments: 6,
      time: '4h ago',
      score: 'A',
      avatar: 'M'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px' }}
    >
      {/* 1. Community Highlights (Horizontal Scroller) */}
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '12px', overflowX: 'auto', margin: '0 -20px', padding: '0 20px', scrollbarWidth: 'none' }}>
         {[
           { label: 'Weekly Peak', user: 'Alex_V', icon: <TrendingUp size={14} />, color: '#34c759' },
           { label: 'Hypertrophy King', user: 'Jon_Bio', icon: <Zap size={14} />, color: '#ff9500' },
           { label: 'Macro Master', user: 'Elena_F', icon: <Sparkles size={14} />, color: '#5856d6' }
         ].map((card, i) => (
           <div key={i} style={{ minWidth: '160px', background: 'white', padding: '16px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: card.color, marginBottom: '8px' }}>
                 {card.icon}
                 <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>{card.label}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{card.user}</div>
           </div>
         ))}
      </motion.div>

      {/* 2. Engagement Feed */}
      {posts.map((post) => (
        <motion.div
          key={post.id}
          variants={itemVariants}
          style={{ 
            background: 'white',
            borderRadius: '32px',
            padding: '24px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '16px', background: 'linear-gradient(135deg, #f2f2f7 0%, #e5e5ea 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--color-primary)' }}>
                   {post.avatar}
                </div>
                <div>
                   <div style={{ fontWeight: 800, fontSize: '1rem' }}>{post.user}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>{post.time} • Verified Metabolic Score: <span style={{ color: 'var(--color-primary)', fontWeight: 900 }}>{post.score}</span></div>
                </div>
             </div>
             <MoreHorizontal size={20} color="var(--color-border)" />
          </div>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: '20px' }}>
            {post.content}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f2f2f7', paddingTop: '16px' }}>
             <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-tertiary)', fontWeight: 800, fontSize: '0.85rem' }}>
                   <Heart size={20} /> {post.likes}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-tertiary)', fontWeight: 800, fontSize: '0.85rem' }}>
                   <MessageCircle size={20} /> {post.comments}
                </div>
             </div>
             <Share2 size={20} color="var(--color-border)" />
          </div>
        </motion.div>
      ))}

    </motion.div>
  );
}
