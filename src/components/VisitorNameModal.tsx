import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VisitorNameModalProps {
    onSubmit: (name: string) => void;
}

const VisitorNameModal = ({ onSubmit }: VisitorNameModalProps) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(t);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter your name.');
            return;
        }
        if (trimmed.length > 40) {
            setError('Name must be under 40 characters.');
            return;
        }
        onSubmit(trimmed);
    };

    const handleSkip = () => onSubmit('');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-6"
            style={{ background: 'hsl(var(--background) / 0.85)', backdropFilter: 'blur(8px)' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-elevated"
            >
                {/* Header */}
                <div className="mb-6">
                    <p className="font-mono-code text-xs text-primary tracking-widest uppercase mb-3">
                        Welcome
                    </p>
                    <h2 className="font-display text-xl font-semibold text-foreground tracking-tight">
                        What should I call you?
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        I'll use your name to personalize your visit.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={name}
                            onChange={e => { setName(e.target.value); setError(''); }}
                            placeholder="Your name"
                            maxLength={40}
                            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground
                         placeholder:text-muted-foreground text-sm font-medium
                         focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
                         transition-all duration-200"
                            autoComplete="given-name"
                        />
                        {error && (
                            <p className="text-xs text-destructive mt-1.5 font-mono-code">{error}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground
                         font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                        >
                            Continue
                        </button>
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground
                         font-medium text-sm transition-all duration-200 hover:text-foreground hover:bg-secondary active:scale-95"
                        >
                            Skip
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default VisitorNameModal;
