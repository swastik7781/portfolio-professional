import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileDown, Terminal, Github, Linkedin } from 'lucide-react';
import { personalInfo } from '@/lib/portfolio-data';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useToast } from '@/hooks/use-toast';

interface HeroProps {
  onOpenConsole: () => void;
  onLogoClick: () => void;
  visitorName: string;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

// Profile easter egg — 4 clicks triggers a techy terminal-style surprise
const useProfileEasterEgg = () => {
  const { toast } = useToast();
  const clickCount = useRef(0);
  const timer = useRef<NodeJS.Timeout>();

  const handleProfileClick = useCallback(() => {
    clickCount.current += 1;
    clearTimeout(timer.current);

    if (clickCount.current >= 4) {
      clickCount.current = 0;
      // Techy easter egg messages — cycling through them
      const messages = [
        {
          title: '$ whoami',
          description: 'swastik@dev:~$ Full Stack Developer | Bug Producer | Coffee Consumer',
        },
        {
          title: '$ git log --oneline',
          description: 'a1b2c3d feat: added coffee dependency\nb4c5d6e fix: removed sleep() from life\nc7d8e9f chore: updated brain to v9.31',
        },
        {
          title: '$ sudo rm -rf /bugs',
          description: 'Permission denied. Bugs are a feature, not a bug.',
        },
        {
          title: '$ cat /etc/developer',
          description: 'NAME=Swastik\nSTATUS=Building\nMODE=Dark\nCAFFEINE=Required\nBUGS=Intentional',
        },
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      toast({
        title: msg.title,
        description: msg.description,
        duration: 4000,
      });
    }

    timer.current = setTimeout(() => { clickCount.current = 0; }, 2500);
  }, [toast]);

  return handleProfileClick;
};

const Hero = ({ onOpenConsole, onLogoClick, visitorName }: HeroProps) => {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const handleProfileClick = useProfileEasterEgg();

  // Subtle parallax on mouse move — desktop only
  useEffect(() => {
    if (reducedMotion) return;
    const mq = window.matchMedia('(pointer: fine)');
    if (!mq.matches) return;

    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 8;
      const y = (clientY / innerHeight - 0.5) * 8;
      hero.style.setProperty('--parallax-x', `${x}px`);
      hero.style.setProperty('--parallax-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  const greeting = visitorName ? `Hello ${visitorName},` : 'Hello there,';
  const subline = visitorName ? `${visitorName}, here's what I build.` : "Here's what I build.";

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle dot background */}
      <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      {/* Subtle accent shape — top right */}
      <div
        className="absolute top-20 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
          transform: 'translate(30%, -20%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">

          {/* Profile photo — ROUND, with 4-click easter egg */}
          <motion.div
            {...(reducedMotion ? {} : {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            })}
            className="shrink-0"
          >
            <div
              className="relative group cursor-pointer select-none"
              onClick={handleProfileClick}
              role="button"
              tabIndex={0}
              aria-label="Profile photo — click 4 times for a surprise"
              onKeyDown={e => e.key === 'Enter' && handleProfileClick()}
            >
              {/* Round photo */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden border-2 border-border shadow-card transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-0.5 group-hover:border-primary/40">
                <img
                  src={personalInfo.profilePic}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Subtle ring animation on hover */}
              <div className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/20 transition-all duration-500 scale-110" />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            {/* Greeting */}
            <motion.p
              {...(reducedMotion ? {} : fadeUp(0.1))}
              className="font-mono-code text-sm text-primary mb-3 tracking-wide"
            >
              {greeting}
            </motion.p>

            {/* Name */}
            <motion.div {...(reducedMotion ? {} : fadeUp(0.2))}>
              <h1
                onClick={onLogoClick}
                className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-bold tracking-tight text-foreground leading-none cursor-default select-none mb-1"
              >
                I'm Swastik
                <br />
                <span className="text-gradient">Bhardwaj.</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              {...(reducedMotion ? {} : fadeUp(0.3))}
              className="mt-5 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              {personalInfo.tagline}
            </motion.p>

            {/* Sub-line */}
            <motion.p
              {...(reducedMotion ? {} : fadeUp(0.35))}
              className="mt-2 font-mono-code text-sm md:text-base text-muted-foreground/60"
            >
              {subline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              {...(reducedMotion ? {} : fadeUp(0.45))}
              className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
            >
              <a href="#projects" className="btn-primary flex items-center gap-2">
                View Projects
                <ArrowDown size={14} />
              </a>
              <a
                href={personalInfo.resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <FileDown size={14} />
                Resume
              </a>
              <button
                onClick={onOpenConsole}
                className="btn-ghost flex items-center gap-2 font-mono-code"
              >
                <Terminal size={14} />
                Console
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div
              {...(reducedMotion ? {} : fadeUp(0.55))}
              className="mt-6 flex items-center gap-3 justify-center md:justify-start"
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <div className="h-px w-8 bg-border" />
              <span className="font-mono-code text-xs text-muted-foreground">
                {personalInfo.location}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          {...(reducedMotion ? {} : {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 1.2 },
          })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            aria-label="Scroll to about section"
          >
            <span className="font-mono-code text-[10px] tracking-widest uppercase opacity-60">scroll</span>
            <div className="w-px h-8 bg-border group-hover:bg-primary/40 transition-colors duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;