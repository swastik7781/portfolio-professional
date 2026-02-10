import { useState, useEffect, useCallback } from 'react';
import { Terminal } from 'lucide-react';
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
import { useTheme } from '@/hooks/useTheme';
import { useEasterEggs } from '@/hooks/useEasterEggs';

const Index = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { handleLogoClick, triggerConfetti, showConfetti } = useEasterEggs();
  const [consoleOpen, setConsoleOpen] = useState(false);

  // Ctrl + ` shortcut
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero onOpenConsole={() => setConsoleOpen(true)} onLogoClick={handleLogoClick} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

      {/* Floating console button */}
      <button
        onClick={() => setConsoleOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity glow-md"
        aria-label="Toggle developer console"
      >
        <Terminal size={20} />
      </button>

      <DevConsole
        isOpen={consoleOpen}
        onClose={() => setConsoleOpen(false)}
        onThemeChange={setTheme}
        onEasterEgg={triggerConfetti}
      />

      <Confetti show={showConfetti} />
    </div>
  );
};

export default Index;
