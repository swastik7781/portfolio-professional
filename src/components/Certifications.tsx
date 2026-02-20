import { motion } from 'framer-motion';
import { Award, Code2, Trophy, Briefcase } from 'lucide-react';
import { certifications, achievements as achievementsList } from '@/lib/portfolio-data';

const achievementIcons = [Trophy, Code2, Briefcase, Award];

const Certifications = () => {
  return (
    <section className="py-24 px-4 sm:px-6 bg-background relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label">Recognition</p>
          <h2 className="section-title">
            Achievements <span className="text-gradient">& Certs</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {achievementsList.map((achievement, i) => {
            const Icon = achievementIcons[i % achievementIcons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="card-base card-hover p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{achievement}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <div>
          <p className="font-mono-code text-xs text-muted-foreground tracking-widest uppercase mb-4">
            Certifications
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="card-base card-hover p-5 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Award size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-semibold text-foreground leading-snug">
                      {cert.title}
                    </h3>
                    <p className="font-mono-code text-xs text-muted-foreground mt-0.5">
                      {cert.issuer} · {cert.year}
                    </p>
                  </div>
                </div>
                {'score' in cert && cert.score && (
                  <div className="flex items-center gap-2 pt-1 border-t border-border">
                    <span className="font-mono-code text-xs text-muted-foreground">Score</span>
                    <span className="font-mono-code text-xs font-bold text-green-500">{cert.score}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
