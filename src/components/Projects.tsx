import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import { toast } from 'sonner';
import { projects, type ProjectCategory } from '@/lib/portfolio-data';
import Confetti from '@/components/Confetti';

const categories: ProjectCategory[] = ["All", "Full Stack", "Machine Learning"];

const Projects = () => {
  const [filter, setFilter] = useState<ProjectCategory>("All");
  const [isBlackout, setIsBlackout] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorLogs, setErrorLogs] = useState<{id: number, text: string, top: string, left: string}[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlackout) {
      const msgs = [
        "0xERR_SYS_FAIL", "OVERRIDE_PROTOCOL_INIT", "MEMORY_LEAK_DETECTED",
        "BYPASSING_SECURITY_MAINFRAME", "FATAL_EXCEPTION_0x00000008",
        "KERNEL_PANIC", "REBOOT_REQUIRED", "DATA_CORRUPTION_IMMINENT",
        "UNAUTHORIZED_ACCESS", "SYSTEM_COMPROMISED", "DECRYPTING_STORE..."
      ];
      interval = setInterval(() => {
        setErrorLogs(prev => [...prev.slice(-25), {
          id: Date.now(),
          text: msgs[Math.floor(Math.random() * msgs.length)],
          top: `${Math.floor(Math.random() * 95)}%`,
          left: `${Math.floor(Math.random() * 85)}%`
        }]);
      }, 250);
    } else {
      setErrorLogs([]);
    }
    return () => clearInterval(interval);
  }, [isBlackout]);

  const handleBlackoutClick = () => {
    setIsBlackout(false);
    setShowConfetti(true);
    toast("Well, you're already here...", { "description": "Might as well enjoy some confetti while you stay." });
    setTimeout(() => setShowConfetti(false), 5000);
  };

  useEffect(() => {
    const handleTrigger = () => {
      // Funny blackout & confetti
      setIsBlackout(true);
      toast("SYSTEM MALFUNCTION...", { "description": "Just kidding. You're already looking at it!" });
    };
    document.addEventListener('trigger-easter-egg', handleTrigger);
    return () => document.removeEventListener('trigger-easter-egg', handleTrigger);
  }, []);

  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 bg-background relative z-20">
      <Confetti show={showConfetti} />
      <AnimatePresence>
        {isBlackout && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-background z-[200] flex items-center justify-center flex-col gap-4 cursor-pointer overflow-hidden"
            onClick={handleBlackoutClick}
          >
            {errorLogs.map(log => (
              <div key={log.id} className="absolute text-destructive/30 font-mono-code text-xs md:text-sm whitespace-nowrap pointer-events-none" style={{ top: log.top, left: log.left }}>
                {log.text}
              </div>
            ))}
            <div className="relative z-10 flex flex-col items-center">
              <h1 className="text-destructive font-mono-code text-2xl animate-pulse tracking-widest uppercase text-center px-4">Fatal Reality Error</h1>
              <p className="text-muted-foreground font-mono-code text-sm animate-pulse">Initiating fallback protocols...</p>
              <p className="text-muted-foreground font-mono-code text-xs mt-8 opacity-70">(Click anywhere to bypass system failure)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label">Proof</p>
          <h2 className="section-title">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === cat
                ? 'bg-primary text-primary-foreground shadow-card'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`card-base card-hover p-6 flex flex-col group ${project.featured ? 'sm:col-span-1' : ''
                  }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono-code text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {project.category}
                      </span>
                    </div>
                    <a
                      href={project.live !== "#" ? project.live : project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (project.title === "Portfolio Website") {
                          e.preventDefault();
                          document.dispatchEvent(new CustomEvent('trigger-easter-egg'));
                        }
                      }}
                      className="font-display text-base font-semibold text-foreground hover:text-primary transition-colors duration-200 leading-snug cursor-pointer underline-offset-4 hover:underline"
                    >
                      {project.title}
                    </a>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 h-8 rounded-lg border border-border flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all duration-200"
                      aria-label="Code"
                    >
                      <Github size={14} />
                      <span>Code</span>
                    </a>
                    {project.live !== "#" && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (project.title === "Portfolio Website") {
                            e.preventDefault();
                            document.dispatchEvent(new CustomEvent('trigger-easter-egg'));
                          }
                        }}
                        className="px-3 py-1.5 h-8 rounded-lg border border-border flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary transition-all duration-200"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-secondary text-[11px] font-mono-code text-muted-foreground rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <a
            href="https://github.com/swastik7781"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <Github size={15} />
            <span>More on GitHub</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
