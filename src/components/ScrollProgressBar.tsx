import { useScrollProgress } from '@/hooks/useScrollProgress';

const ScrollProgressBar = () => {
    const progress = useScrollProgress();

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none"
            aria-hidden="true"
        >
            <div
                className="h-full bg-primary transition-none"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ScrollProgressBar;
