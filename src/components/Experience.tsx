import { motion } from 'framer-motion';
import { experiences } from '@/lib/portfolio-data';
import { Briefcase, GraduationCap, Code2 } from 'lucide-react';

const icons = [Briefcase, GraduationCap, Code2];

const Experience = () => {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 bg-secondary/20 relative z-20">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="section-label">Depth</p>
          <h2 className="section-title">
            Experience <span className="text-gradient">& Journey</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const Icon = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex gap-6 pl-12"
                >
                  {/* Icon dot */}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 shadow-card">
                    <Icon size={14} className="text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 card-base p-5 card-hover">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-primary font-medium">{exp.company}</p>
                      </div>
                      <span className="font-mono-code text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg shrink-0 self-start">
                        {exp.date}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map(t => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-secondary text-[11px] font-mono-code text-muted-foreground rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
