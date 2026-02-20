import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import DevConsole from '@/components/DevConsole';
import Confetti from '@/components/Confetti';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import CommandPalette from '@/components/CommandPalette';
import VisitorNameModal from '@/components/VisitorNameModal';
import { useTheme } from '@/hooks/useTheme';
import { useEasterEggs } from '@/hooks/useEasterEggs';
import { useVisitorName } from '@/hooks/useVisitorName';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { AnimatePresence } from 'framer-motion';

const SECTIONS = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];

const Index = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { handleLogoClick, triggerConfetti, showConfetti } = useEasterEggs();
  const { visitorName, setVisitorName, hasName } = useVisitorName();
  const { isOpen: paletteOpen, open: openPalette, close: closePalette } = useCommandPalette();

  const [consoleOpen, setConsoleOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Show name modal on first visit (after loading)
  useEffect(() => {
    if (!loading && !hasName) {
      const t = setTimeout(() => setShowNameModal(true), 400);
      return () => clearTimeout(t);
    }
  }, [loading, hasName]);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [loading]);

  // Ctrl + ` shortcut for console
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setConsoleOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNameSubmit = useCallback((name: string) => {
    setVisitorName(name);
    setShowNameModal(false);
  }, [setVisitorName]);

  const handleChangeName = useCallback(() => {
    setShowNameModal(true);
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`min-h-screen bg-background text-foreground transition-colors duration-300 ${
      // Apply cursor-none on desktop when custom cursor is active
      typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
        ? 'cursor-none-desktop'
        : ''
      }`}>
      {/* Custom cursor — desktop only */}
      <CustomCursor />

      {/* Visitor name modal */}
      <AnimatePresence>
        {showNameModal && (
          <VisitorNameModal onSubmit={handleNameSubmit} />
        )}
      </AnimatePresence>

      {/* Command palette */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={closePalette}
        onThemeChange={setTheme}
        currentTheme={theme}
        onChangeName={handleChangeName}
      />

      {/* Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenConsole={() => setConsoleOpen(true)}
        onOpenPalette={openPalette}
        activeSection={activeSection}
      />

      <main>
        <Hero
          onOpenConsole={() => setConsoleOpen(true)}
          onLogoClick={handleLogoClick}
          visitorName={visitorName}
        />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Testimonials />
        <Contact visitorName={visitorName} />
      </main>

      <Footer />

      {/* Dev Console */}
      <DevConsole
        isOpen={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        onThemeChange={setTheme}
        onEasterEgg={triggerConfetti}
      />

      {/* Confetti easter egg */}
      <Confetti show={showConfetti} />
    </div>
  );
};

export default Index;
