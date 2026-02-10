import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories } from '@/lib/portfolio-data';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].name);
  const activeSkills = skillCategories.find(c => c.name === activeCategory)?.skills || [];

  return (
    <section id="skills" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Tech<span className="text-gradient"> Stack</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-8" />
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {skillCategories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.name
                  ? 'bg-primary text-primary-foreground glow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {activeSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-5 hover:glow-sm transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className="font-mono-code text-xs text-muted-foreground">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Skills;
