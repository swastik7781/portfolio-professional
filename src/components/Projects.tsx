import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { projects, type ProjectCategory } from '@/lib/portfolio-data';

const categories: ProjectCategory[] = ["All", "Full Stack", "Machine Learning"];

const Projects = () => {
  const [filter, setFilter] = useState<ProjectCategory>("All");
  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Featured<span className="text-gradient"> Projects</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-8" />
        </motion.div>

        <div className="flex gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === cat
                  ? 'bg-primary text-primary-foreground glow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover:glow-sm transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map(t => (
                        <span key={t} className="px-3 py-1 bg-secondary text-xs font-mono-code text-muted-foreground rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={18} />
                    </a>
                    {project.live !== "#" && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                        aria-label="Live demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
