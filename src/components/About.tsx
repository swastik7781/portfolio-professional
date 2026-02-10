import { motion } from 'framer-motion';
import { personalInfo, stats } from '@/lib/portfolio-data';

const About = () => {
  return (
    <section id="about" className="py-24 px-6 bg-background relative z-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            About<span className="text-gradient"> Me</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-8" />

          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mb-12">
            {personalInfo.bio}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-center hover:glow-sm transition-shadow duration-300"
            >
              <div className="font-display text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
