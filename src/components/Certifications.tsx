import { motion } from 'framer-motion';
import { certifications, achievements as achievementsList } from '@/lib/portfolio-data';
import { ExternalLink, Award, Code2, Trophy, Briefcase, FileDown } from 'lucide-react';

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
                className="card-base card-hover p-5 flex flex-col gap-4 relative group"
              >
                <div className="flex items-start gap-4 h-full">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border/50 group-hover:border-primary/30 transition-colors duration-300">
                    <Award size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-display text-sm font-semibold text-foreground leading-snug">
                        {cert.title}
                      </h3>
                      <p className="font-mono-code text-xs text-muted-foreground mt-1">
                        {cert.issuer} · {cert.year}
                      </p>
                    </div>

                    {/* Score / Links row */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                      {'score' in cert && cert.score ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-[11px] text-muted-foreground">Score</span>
                          <span className="font-mono-code text-[11px] font-bold text-green-500">{cert.score}</span>
                        </div>
                      ) : (
                        <div /> /* Empty div for flex spacing if no score */
                      )}

                      <div className="flex items-center gap-3">
                        {cert.file && (
                          <>
                            <a
                              href={cert.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-mono-code text-[11px] uppercase tracking-wider"
                              title="View Certificate"
                            >
                              <ExternalLink size={13} /> View
                            </a>
                            <div className="w-px h-3 bg-border" />
                            <a
                              href={cert.file}
                              download
                              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-mono-code text-[11px] uppercase tracking-wider"
                              title="Download Certificate"
                            >
                              <FileDown size={13} />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
