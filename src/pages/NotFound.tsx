import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-sm"
      >
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-8xl font-bold text-foreground/10 mb-6 select-none"
        >
          404
        </motion.div>

        <div className="w-10 h-px bg-primary mx-auto mb-6" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-mono-code text-xs text-primary tracking-widest uppercase mb-3">
            Page not found
          </p>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3 tracking-tight">
            This route doesn't exist.
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            The page you're looking for has been moved, deleted, or never existed.
            Let's get you back on track.
          </p>

          <div className="flex items-center justify-center gap-3">
            <a
              href="/"
              className="btn-primary flex items-center gap-2"
            >
              <Home size={14} />
              Back to Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Subtle decoration */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-mono-code text-[11px] text-muted-foreground/40 mt-12"
        >
          {location.pathname}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
