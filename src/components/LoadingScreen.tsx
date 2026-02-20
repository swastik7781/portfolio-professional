import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
    const [phase, setPhase] = useState<'loading' | 'done'>('loading');

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('done'), 1400);
        const t2 = setTimeout(() => onComplete(), 1900);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase === 'loading' && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
                >
                    {/* Minimal logo mark */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="font-display text-2xl font-bold text-foreground tracking-tight">
                            {'<SB />'}
                        </div>

                        {/* Progress bar */}
                        <div className="w-32 h-px bg-border overflow-hidden rounded-full">
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.2, ease: 'easeInOut' }}
                                className="h-full bg-primary rounded-full"
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="font-mono-code text-xs text-muted-foreground tracking-widest"
                        >
                            initializing...
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
