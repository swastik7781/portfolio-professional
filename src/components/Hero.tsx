import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Terminal, FileDown } from 'lucide-react';
import { personalInfo } from '@/lib/portfolio-data';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface HeroProps {
  onOpenConsole: () => void;
  onLogoClick: () => void;
}

const useTypingEffect = (strings: string[], speed = 80, pause = 1500) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = strings[index];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length === current.length) {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIndex((index + 1) % strings.length);
        }
      }
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, index, strings, speed, pause]);

  return text;
};

const Hero = ({ onOpenConsole, onLogoClick }: HeroProps) => {
  const typedText = useTypingEffect(personalInfo.taglines);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono-code text-sm text-primary mb-4 tracking-wider">
            {'// hello world'}
          </p>

          <Tooltip>
            <TooltipTrigger asChild>
              <h1
                onClick={onLogoClick}
                className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-4 cursor-default select-none"
              >
                SWASTIK
                <br />
                <span className="text-gradient">BHARDWAJ</span>
              </h1>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="font-mono-code text-xs">
              I mass-produce bugs and call them "features" 🐛
            </TooltipContent>
          </Tooltip>

          <div className="h-8 flex items-center justify-center mb-8">
            <span className="font-mono-code text-lg text-muted-foreground">
              {typedText}
            </span>
            <span className="ml-1 w-0.5 h-5 bg-primary animate-pulse" />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity glow-sm"
            >
              View Projects
            </a>
            <a
              href={personalInfo.resumeUrl}
              className="px-6 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <FileDown size={16} /> Resume
            </a>
            <button
              onClick={onOpenConsole}
              className="px-6 py-3 rounded-lg bg-secondary text-foreground font-mono-code text-sm hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <Terminal size={16} /> Open Console
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a href="#about" aria-label="Scroll down">
            <ArrowDown size={20} className="text-muted-foreground animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
