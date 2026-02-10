import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const Confetti = ({ show }: { show: boolean }) => {
  const particles = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['hsl(220,70%,55%)', 'hsl(250,60%,60%)', 'hsl(120,60%,50%)', 'hsl(40,90%,60%)', 'hsl(0,80%,60%)'][i % 5],
      size: 6 + Math.random() * 8,
    }))
  , []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
