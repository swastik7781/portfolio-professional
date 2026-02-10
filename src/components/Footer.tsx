import { personalInfo } from '@/lib/portfolio-data';

const Footer = () => (
  <footer className="border-t border-border py-8 px-6">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} {personalInfo.name}. Built with React & TypeScript.
      </p>
      <p className="font-mono-code text-xs text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border text-xs">Ctrl + `</kbd> to open console
      </p>
    </div>
  </footer>
);

export default Footer;
