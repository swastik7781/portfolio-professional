import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * CustomCursor — desktop only (pointer: fine media query).
 * A subtle dot + ring cursor. No gimmicks.
 * Hidden on touch devices via CSS.
 */
const CustomCursor = () => {
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const ringRef = useRef({ x: -100, y: -100 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        // Only activate on pointer: fine (desktop)
        const mq = window.matchMedia('(pointer: fine)');
        if (!mq.matches) return;

        const onMove = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const onLeave = () => setIsVisible(false);
        const onEnter = () => setIsVisible(true);

        // Detect hoverable elements
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const hoverable = target.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]');
            setIsHovering(!!hoverable);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', onLeave);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseover', onMouseOver);

        // Smooth ring follow with RAF
        const animateRing = () => {
            ringRef.current.x += (pos.x - ringRef.current.x) * 0.12;
            ringRef.current.y += (pos.y - ringRef.current.y) * 0.12;
            setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
            rafRef.current = requestAnimationFrame(animateRing);
        };
        rafRef.current = requestAnimationFrame(animateRing);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseleave', onLeave);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseover', onMouseOver);
            cancelAnimationFrame(rafRef.current);
        };
    }, [pos.x, pos.y]);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
        return null;
    }

    return (
        <>
            {/* Dot — follows exactly */}
            <div
                className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
                style={{
                    transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.2s',
                }}
            >
                <div
                    className="w-2 h-2 rounded-full bg-primary transition-transform duration-150"
                    style={{ transform: isHovering ? 'scale(0)' : 'scale(1)' }}
                />
            </div>

            {/* Ring — lags behind */}
            <div
                className="fixed top-0 left-0 z-[9998] pointer-events-none hidden md:block"
                style={{
                    transform: `translate(${ringPos.x - 16}px, ${ringPos.y - 16}px)`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.2s',
                }}
            >
                <div
                    className="rounded-full border border-primary/40 transition-all duration-200"
                    style={{
                        width: isHovering ? '40px' : '32px',
                        height: isHovering ? '40px' : '32px',
                        transform: isHovering ? 'translate(-4px, -4px)' : 'none',
                    }}
                />
            </div>
        </>
    );
};

export default CustomCursor;
