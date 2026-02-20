import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories } from '@/lib/portfolio-data';

// Skill icon component — uses devicons CDN
const SkillIcon = ({ icon, name }: { icon: string; name: string }) => {
  const iconMap: Record<string, string> = {
    react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    angular: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    html5: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    express: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    spring: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
    c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    github: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    vscode: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
    postman: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
    linux: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
    api: null,
  };

  const src = iconMap[icon];

  if (!src) {
    // Fallback: first 2 letters
    return (
      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
        <span className="font-mono-code text-[9px] font-bold text-primary uppercase">
          {name.slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-6 h-6 object-contain"
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].name);
  const activeSkills = skillCategories.find(c => c.name === activeCategory)?.skills || [];

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 bg-secondary/20 relative z-20">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label">Capability</p>
          <h2 className="section-title">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {skillCategories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeCategory === cat.name
                ? 'bg-primary text-primary-foreground shadow-card'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {activeSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="card-base card-hover p-5"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <SkillIcon icon={skill.icon} name={skill.name} />
                    <span className="font-medium text-sm text-foreground">{skill.name}</span>
                  </div>
                  <span className="font-mono-code text-xs text-muted-foreground">
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="skill-bar-track">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.8, delay: i * 0.06, ease: 'easeOut' }}
                    className="skill-bar-fill"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* All skills summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="font-mono-code text-xs text-muted-foreground tracking-widest uppercase mb-4">
            All Technologies
          </p>
          <div className="flex flex-wrap gap-2">
            {skillCategories.flatMap(cat => cat.skills).map(skill => (
              <div
                key={skill.name}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg hover:border-primary/30 hover:bg-secondary transition-colors duration-200 group"
              >
                <SkillIcon icon={skill.icon} name={skill.name} />
                <span className="text-xs text-muted-foreground group-hover:text-foreground font-mono-code transition-colors duration-200">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
