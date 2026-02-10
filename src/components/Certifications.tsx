import { motion } from 'framer-motion';
import { Award, Code2, Trophy, Briefcase } from 'lucide-react';
import { certifications } from '@/lib/portfolio-data';

const achievements = [
  { icon: Trophy, label: "CGPA 9.38", desc: "Academic Excellence" },
  { icon: Code2, label: "40K+ Lines", desc: "Production Code" },
  { icon: Briefcase, label: "CodeBest", desc: "Internship Experience" },
  { icon: Award, label: "5+ Projects", desc: "Built & Deployed" },
];

const Certifications = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Achievements<span className="text-gradient"> & Certs</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-8" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {achievements.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 text-center hover:glow-sm transition-shadow group"
            >
              <a.icon className="mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" size={28} />
              <div className="font-display font-semibold text-foreground">{a.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:glow-sm transition-shadow"
            >
              <Award className="text-primary mb-3" size={22} />
              <h3 className="font-display font-semibold text-foreground">{cert.title}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
