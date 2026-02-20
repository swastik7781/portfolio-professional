import { motion } from 'framer-motion';
import { personalInfo } from '@/lib/portfolio-data';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="text-center sm:text-left">
            <div className="font-display font-bold text-foreground tracking-tight mb-1">
              {'<SB />'}
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              {personalInfo.tagline}
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              aria-label="GitHub"
            >
              <Github size={14} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={14} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
              aria-label="Email"
            >
              <Mail size={14} />
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-200"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono-code text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Swastik Bhardwaj. All rights reserved.
          </p>
          <p className="font-mono-code text-[11px] text-muted-foreground">
            Built with React + TypeScript + Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
