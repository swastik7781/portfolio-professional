import { useEffect, useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useEasterEggs() {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const logoClickCount = useRef(0);
  const logoTimer = useRef<NodeJS.Timeout>();
  const konamiBuffer = useRef<string[]>([]);

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const handleLogoClick = useCallback(() => {
    logoClickCount.current += 1;
    clearTimeout(logoTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      toast({
        title: "🎮 Secret Unlocked!",
        description: "You found a hidden easter egg! You're a curious dev. I like that.",
      });
    }
    logoTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
  }, [toast]);

  useEffect(() => {
    const handleKonami = (e: KeyboardEvent) => {
      konamiBuffer.current.push(e.key);
      if (konamiBuffer.current.length > KONAMI.length) {
        konamiBuffer.current.shift();
      }
      if (konamiBuffer.current.join(',') === KONAMI.join(',')) {
        konamiBuffer.current = [];
        toast({
          title: "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️",
          description: "Konami Code activated! You're a true gamer-developer. 🕹️",
        });
        triggerConfetti();
      }
    };
    window.addEventListener('keydown', handleKonami);
    return () => window.removeEventListener('keydown', handleKonami);
  }, [toast, triggerConfetti]);

  return { handleLogoClick, triggerConfetti, showConfetti };
}
