import { motion } from 'framer-motion';
import { personalInfo, stats, timelineItems } from '@/lib/portfolio-data';
import { MapPin, GraduationCap, Briefcase, Code2, School } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'education': return GraduationCap;
    case 'work': return Briefcase;
    case 'project': return Code2;
    default: return School;
  }
};

const getAccentColor = (type: string) => {
  switch (type) {
    case 'education': return 'text-blue-400';
    case 'work': return 'text-primary';
    case 'project': return 'text-purple-400';
    default: return 'text-primary';
  }
};

const About = () => {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 bg-background relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="section-label">Identity</p>
          <h2 className="section-title">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left — bio + philosophy + stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-foreground text-base leading-relaxed">
              {personalInfo.bio}
            </p>

            {/* Philosophy block */}
            <div className="border-l-2 border-primary/30 pl-5 py-1">
              <p className="font-mono-code text-xs text-primary tracking-widest uppercase mb-2">
                Technical Philosophy
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed italic">
                "{personalInfo.philosophy}"
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" />
              <span>{personalInfo.location}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="card-base p-4"
                >
                  <div className="font-display text-xl font-bold text-primary mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — full chronological timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="font-mono-code text-xs text-muted-foreground tracking-widest uppercase mb-6">
              Journey — Chronological
            </p>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

              <div className="space-y-6">
                {timelineItems.map((item, i) => {
                  const Icon = getIcon(item.type);
                  const accent = getAccentColor(item.type);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      className="relative flex gap-5 pl-10"
                    >
                      {/* Icon dot */}
                      <div className="absolute left-0 top-0.5 w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                        <Icon size={13} className={accent} />
                      </div>

                      <div className="flex-1 pb-1">
                        <span className="font-mono-code text-[10px] text-muted-foreground">
                          {item.date}
                        </span>
                        <h3 className="font-display text-sm font-semibold text-foreground mt-0.5 leading-snug">
                          {item.title}
                        </h3>
                        <p className={`text-xs font-medium mb-1 ${accent}`}>{item.subtitle}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
