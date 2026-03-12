import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, AlertTriangle, XCircle, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { projects, type ProjectCategory } from '@/lib/portfolio-data';

const categories: ProjectCategory[] = ["All", "Full Stack", "Machine Learning"];

const Projects = () => {
  const [filter, setFilter] = useState<ProjectCategory>("All");
  const [isBlackout, setIsBlackout] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveProgress, setResolveProgress] = useState(0);
  const [errorLogs, setErrorLogs] = useState<{id: number, text: string, top: string, left: string, type: string, width?: string, height?: string}[]>([]);
  const [darkness, setDarkness] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let darknessInterval: NodeJS.Timeout;
    
    if (isBlackout && !isResolving) {
      document.body.style.overflow = 'hidden';
      
      const msgs = [
        "0xERR_SYS_FAIL", "OVERRIDE_PROTOCOL_INIT", "MEMORY_LEAK_DETECTED",
        "BYPASSING_SECURITY_MAINFRAME", "FATAL_EXCEPTION_0x00000008",
        "KERNEL_PANIC", "REBOOT_REQUIRED", "DATA_CORRUPTION_IMMINENT",
        "UNAUTHORIZED_ACCESS", "SYSTEM_COMPROMISED", "DECRYPTING_STORE..."
      ];
      const types = ['text', 'box', 'block', 'window'];
      
      interval = setInterval(() => {
        let rTop = Math.random() * 95;
        let rLeft = Math.random() * 95;
        let pType = types[Math.floor(Math.random() * types.length)];
        
        setErrorLogs(prev => [...prev.slice(-150), {
          id: Date.now() + Math.random(),
          text: msgs[Math.floor(Math.random() * msgs.length)],
          top: `${rTop}%`,
          left: `${rLeft}%`,
          type: pType,
          width: pType === 'block' ? `${Math.random() * 40 + 10}vw` : undefined,
          height: pType === 'block' ? `${Math.random() * 20 + 5}vh` : undefined
        }]);
      }, 100);

      darknessInterval = setInterval(() => {
        setDarkness(prev => Math.min(prev + 0.05, 0.95)); // Slowly darker over time
      }, 500);
      
    } else if (isResolving) {
      setResolveProgress(0);
      const totalInitialLogs = errorLogs.length;
      interval = setInterval(() => {
        setErrorLogs(prev => {
          if (prev.length <= 1) {
            setResolveProgress(100);
            clearInterval(interval);
            setTimeout(() => {
              setIsBlackout(false);
              setIsResolving(false);
              setDarkness(0);
              document.body.style.overflow = 'auto';
              toast.error("Error Code: 404", { description: "You are already here on my portfolio lol. System nominal." });
            }, 600);
            return [];
          }
          const removedRatio = (totalInitialLogs - (prev.length - 1)) / (totalInitialLogs || 1);
          setResolveProgress(Math.floor(removedRatio * 100));
          return prev.slice(3); // remove faster
        });
        setDarkness(prev => Math.max(prev - 0.1, 0));
      }, 40);
    } else {
      setErrorLogs([]);
      setDarkness(0);
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(darknessInterval);
    };
  }, [isBlackout, isResolving]);

  const handleBlackoutClick = () => {
    if (isResolving) return; // Ignore clicks if already resolving
    setIsResolving(true);
  };

  useEffect(() => {
    const handleTrigger = () => {
      setIsBlackout(true);
      setIsResolving(false);
      setErrorLogs([]);
      setDarkness(0);
    };
    document.addEventListener('trigger-easter-egg', handleTrigger);
    return () => document.removeEventListener('trigger-easter-egg', handleTrigger);
  }, []);

  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 bg-background relative z-20">
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isBlackout && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center flex-col overflow-hidden"
              style={{ backgroundColor: `rgba(0, 0, 0, ${darkness})` }}
            >
              <div className="absolute inset-0 cursor-crosshair z-0" onClick={handleBlackoutClick} />
              
              {/* Vigorously spawning errors */}
              {errorLogs.map(log => {
                let content;
                if (log.type === 'window') {
                  content = (
                    <div className="bg-background border-2 border-destructive/80 p-3 rounded-md shadow-2xl flex flex-col gap-2 min-w-[200px] pointer-events-none">
                       <div className="flex items-center gap-2 border-b border-border pb-2 bg-destructive/10 -m-3 mb-2 p-2">
                         <XCircle className="text-destructive h-4 w-4" />
                         <span className="text-xs font-bold font-mono">System.Alert</span>
                       </div>
                       <div className="flex items-center gap-3">
                         <AlertTriangle className="text-destructive animate-pulse h-8 w-8" />
                         <span className="font-mono-code text-sm font-bold">{log.text}</span>
                       </div>
                    </div>
                  );
                } else if (log.type === 'box') {
                  content = (
                    <div className="bg-destructive text-destructive-foreground font-mono-code text-sm font-bold p-2 border-2 border-black whitespace-nowrap pointer-events-none drop-shadow-lg">
                      [ERROR] {log.text}
                    </div>
                  );
                } else if (log.type === 'block') {
                  content = (
                     <div className="bg-black/90 border border-destructive/30 backdrop-blur-md pointer-events-none" style={{ width: log.width, height: log.height }} />
                  );
                } else {
                  content = (
                    <div className="font-mono-code text-sm md:text-base font-bold whitespace-nowrap pointer-events-none text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                      {log.text}
                    </div>
                  );
                }
                
                return (
                  <div key={log.id} className="absolute z-10" style={{ top: log.top, left: log.left }}>
                    {content}
                  </div>
                );
              })}
              
              {/* Central Box */}
              <div 
                className="relative z-50 flex flex-col items-center p-8 bg-background/90 backdrop-blur-xl rounded-2xl border-2 border-destructive max-w-lg w-full mx-4 shadow-[0_0_80px_rgba(239,68,68,0.4)]"
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (!isResolving) setIsResolving(true);
                }}
              >
                <div className="absolute -top-12 animate-bounce">
                  <AlertTriangle className="text-destructive drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] bg-background rounded-full p-2" size={80} />
                </div>
                
                <h1 className="text-destructive font-mono-code text-2xl sm:text-3xl font-bold animate-pulse tracking-widest uppercase text-center mt-6">
                  {isResolving ? "PURGING SYSTEM..." : "SYSTEM CRASH DETECTED"}
                </h1>
                
                {isResolving ? (
                  <div className="mt-8 relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-destructive/20" />
                      <motion.circle 
                        cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" 
                        className="text-destructive"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * resolveProgress) / 100}
                        transition={{ duration: 0.1 }}
                      />
                    </svg>
                    <span className="font-mono-code text-destructive font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">{resolveProgress}%</span>
                  </div>
                ) : (
                  <>
                    <div className="w-full bg-destructive/10 border border-destructive/30 p-4 rounded-lg mt-6 mb-8 text-left">
                       <div className="flex items-center gap-2 mb-2 text-destructive">
                         <Terminal size={16} />
                         <span className="font-mono text-sm font-semibold">Kernel Error Log</span>
                       </div>
                       <p className="font-mono text-xs text-muted-foreground opacity-80 h-16 overflow-hidden leading-relaxed">
                         [FATAL] Multiple sector failures detected.<br/>
                         [WARN] UI Thread disconnected.<br/>
                         [CRIT] Reality anchors failing...<br/>
                         Please initiate manual override.
                       </p>
                    </div>
                    <button className="text-foreground font-mono-code text-[11px] sm:text-xs md:text-sm font-semibold border-2 border-destructive px-4 py-3 rounded-lg bg-destructive hover:bg-destructive/80 transition-all cursor-pointer text-center animate-pulse w-full shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                      CLICK ANYWHERE ON SCREEN TO FIX / PURGE SYSTEM
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
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
