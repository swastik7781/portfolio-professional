import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { personalInfo, skillCategories, projects } from '@/lib/portfolio-data';

interface DevConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange: (theme: 'dark' | 'light') => void;
  onEasterEgg: () => void;
}

type ConsoleLine = { type: 'input' | 'output' | 'error' | 'system' | 'link' | 'portfolio-link'; text: string; url?: string };

const COMMANDS: Record<string, string> = {
  help: "List all available commands",
  about: "Display developer bio",
  skills: "Show skills with proficiency",
  projects: "Scroll to projects section",
  experience: "Scroll to experience section",
  contact: "Scroll to contact section",
  "open github": "Open GitHub in new tab",
  "open linkedin": "Open LinkedIn in new tab",
  "theme dark": "Switch to dark mode",
  "theme light": "Switch to light mode",
  whoami: "Who am I?",
  clear: "Clear console output",
  easteregg: "???",
  exit: "Close the terminal",
  "download resume": "Download my latest resume",
  certifications: "View my certifications",
  eastereggs: "Discover the hidden easter eggs",
};

const DevConsole = ({ isOpen, onClose, onThemeChange, onEasterEgg }: DevConsoleProps) => {
  const [lines, setLines] = useState<ConsoleLine[]>([
    { type: 'system', text: '[System] Swastik Bhardwaj Developer Console v1.0' },
    { type: 'system', text: 'Type "help" to see available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const addLine = useCallback((type: ConsoleLine['type'], text: string) => {
    setLines(prev => [...prev, { type, text }]);
  }, []);

  useEffect(() => {
    const handleResolved = () => {
      addLine('output', '\n[System] Resolving recursive anomaly...');
      setTimeout(() => {
        addLine('error', '$ cat /etc/portfolio/location');
        addLine('error', 'ERROR: 404_ALREADY_HERE');
        addLine('output', '  > Target location identical to current directory.');
        addLine('output', '  > Where are you trying to go? lol');
        addLine('output', '  > You are already in my portfolio\n');
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }, 50);
      }, 500);
    };
    document.addEventListener('terminal-easter-egg-resolved', handleResolved);
    return () => document.removeEventListener('terminal-easter-egg-resolved', handleResolved);
  }, [addLine]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    addLine('input', `$ ${cmd}`);

    if (!trimmed) return;
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    switch (trimmed) {
      case 'help':
        addLine('output', '\nAvailable commands:');
        Object.entries(COMMANDS).forEach(([k, v]) => {
          addLine('output', `  ${k.padEnd(18)} — ${v}`);
        });
        addLine('output', '');
        break;
      case 'about':
        addLine('output', `\n${personalInfo.bio}\n`);
        break;
      case 'skills':
        addLine('output', '\nSkills & Proficiency:');
        skillCategories.forEach(cat => {
          addLine('output', `\n  [${cat.name}]`);
          cat.skills.forEach(s => {
            const bar = '█'.repeat(Math.round(s.proficiency / 10)) + '░'.repeat(10 - Math.round(s.proficiency / 10));
            addLine('output', `    ${s.name.padEnd(14)} ${bar} ${s.proficiency}%`);
          });
        });
        addLine('output', '');
        break;
      case 'projects':
        addLine('output', '\nFeatured Projects:');
        projects.forEach(p => {
          addLine('output', `\n  [${p.title}]`);
          setLines(prev => [...prev, { type: 'link', text: `    Code: ${p.github}`, url: p.github }]);
          if (p.live !== '#') {
            if (p.title === 'Portfolio Website') {
               setLines(prev => [...prev, { type: 'portfolio-link', text: `    Live: ${p.live}`, url: p.live }]);
            } else {
               setLines(prev => [...prev, { type: 'link', text: `    Live: ${p.live}`, url: p.live }]);
            }
          }
        });
        addLine('output', '\n(Click the links above to open them)\n');
        break;
      case 'experience':
        scrollTo('experience');
        addLine('output', '→ Scrolling to experience...');
        break;
      case 'contact':
        scrollTo('contact');
        addLine('output', '→ Scrolling to contact...');
        break;
      case 'open github':
        window.open(personalInfo.github, '_blank');
        addLine('output', '→ Opening GitHub...');
        break;
      case 'open linkedin':
        window.open(personalInfo.linkedin, '_blank');
        addLine('output', '→ Opening LinkedIn...');
        break;
      case 'theme dark':
        onThemeChange('dark');
        addLine('output', '[Theme] Dark mode activated.');
        break;
      case 'theme light':
        onThemeChange('light');
        addLine('output', '[Theme] Light mode activated.');
        break;
      case 'whoami':
        addLine('output', `\n${personalInfo.name} — ${personalInfo.title}\nVisitor to this terminal.\n`);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'easteregg':
        addLine('output', '[Secret] You found a secret! Launching surprise...');
        onEasterEgg();
        break;
      case 'exit':
        onClose();
        break;
      case 'download resume':
        window.open(personalInfo.resumeUrl, '_blank');
        addLine('output', '-> Downloading resume...');
        break;
      case 'certifications':
        addLine('output', '\nCertifications:');
        addLine('output', '  1. MERN Stack Development (CodeBeat, 2024)');
        addLine('output', '  2. Spring Boot & Angular Training (Enterprise Program, 2025)');
        addLine('output', '  3. Joy of Computing with Python (NPTEL, 2024 - 90%)');
        addLine('output', '');
        break;
      case 'eastereggs':
        addLine('output', '\nHidden Easter Eggs:');
        addLine('output', '  - Click on "Portfolio Website" in Projects');
        addLine('output', '  - Type "easteregg" in this console');
        addLine('output', '  - ??? There might be more.');
        addLine('output', '');
        break;
      default:
        addLine('error', `Command not found: "${trimmed}". Type "help" for available commands.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[60] h-[50vh] sm:h-[40vh] flex flex-col"
          style={{ background: 'hsl(var(--terminal))' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="font-mono-code text-xs ml-2" style={{ color: 'hsl(var(--terminal-foreground))' }}>
                swastik@portfolio:~
              </span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>

          {/* Output */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 font-mono-code text-sm">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  line.type === 'input' ? 'text-primary' :
                  line.type === 'error' ? 'text-destructive whitespace-pre-wrap' :
                  line.type === 'system' ? 'opacity-60 whitespace-pre-wrap' : 'whitespace-pre-wrap'
                }`}
                style={{ color: line.type === 'output' ? 'hsl(var(--terminal-foreground))' : undefined }}
              >
                {line.type === 'link' && line.url ? (
                  <div className="flex whitespace-pre-wrap"><span className="whitespace-pre">{line.text.split(line.url)[0]}</span><a href={line.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors cursor-pointer">{line.url}</a></div>
                ) : line.type === 'portfolio-link' && line.url ? (
                  <div className="flex whitespace-pre-wrap"><span className="whitespace-pre">{line.text.split(line.url)[0]}</span><span onClick={() => { document.dispatchEvent(new CustomEvent('trigger-easter-egg', { detail: { fromTerminal: true } })); }} className="underline hover:text-primary transition-colors cursor-pointer">{line.url}</span></div>
                ) : (
                  line.text
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            <span className="font-mono-code text-sm text-primary">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent font-mono-code text-sm outline-none"
              style={{ color: 'hsl(var(--terminal-foreground))' }}
              placeholder="Type a command..."
              spellCheck={false}
              autoComplete="off"
            />
            <span className="w-2 h-4 bg-primary animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DevConsole;
