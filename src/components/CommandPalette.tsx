import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, X } from 'lucide-react';
import { personalInfo } from '@/lib/portfolio-data';

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    category: string;
    action: () => void;
    shortcut?: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onThemeChange: (theme: 'dark' | 'light') => void;
    currentTheme: 'dark' | 'light';
    onChangeName: () => void;
}

const CommandPalette = ({ isOpen, onClose, onThemeChange, currentTheme, onChangeName }: CommandPaletteProps) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        onClose();
    };

    const commands: CommandItem[] = [
        { id: 'home', label: 'Go to Home', category: 'Navigate', action: () => scrollTo('home') },
        { id: 'about', label: 'Go to About', category: 'Navigate', action: () => scrollTo('about') },
        { id: 'skills', label: 'Go to Skills', category: 'Navigate', action: () => scrollTo('skills') },
        { id: 'projects', label: 'Go to Projects', category: 'Navigate', action: () => scrollTo('projects') },
        { id: 'experience', label: 'Go to Experience', category: 'Navigate', action: () => scrollTo('experience') },
        { id: 'contact', label: 'Go to Contact', category: 'Navigate', action: () => scrollTo('contact') },
        {
            id: 'github',
            label: 'Open GitHub',
            description: personalInfo.github,
            category: 'Social',
            action: () => { window.open(personalInfo.github, '_blank'); onClose(); },
        },
        {
            id: 'linkedin',
            label: 'Open LinkedIn',
            description: personalInfo.linkedin,
            category: 'Social',
            action: () => { window.open(personalInfo.linkedin, '_blank'); onClose(); },
        },
        {
            id: 'email',
            label: 'Send Email',
            description: personalInfo.email,
            category: 'Social',
            action: () => { window.open(`mailto:${personalInfo.email}`, '_blank'); onClose(); },
        },
        {
            id: 'resume',
            label: 'Download Resume',
            category: 'Actions',
            action: () => { window.open(personalInfo.resumeUrl, '_blank'); onClose(); },
        },
        {
            id: 'theme',
            label: currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            category: 'Settings',
            shortcut: 'T',
            action: () => { onThemeChange(currentTheme === 'dark' ? 'light' : 'dark'); onClose(); },
        },
        {
            id: 'name',
            label: 'Change My Name',
            category: 'Settings',
            action: () => { onChangeName(); onClose(); },
        },
    ];

    const filtered = query.trim()
        ? commands.filter(c =>
            c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase()) ||
            c.description?.toLowerCase().includes(query.toLowerCase())
        )
        : commands;

    // Group by category
    const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const flatFiltered = Object.values(grouped).flat();

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, flatFiltered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            flatFiltered[activeIndex]?.action();
        }
    };

    // Scroll active item into view
    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    let flatIndex = 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[71] w-full max-w-lg mx-4"
                    >
                        <div className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                                <Search size={16} className="text-muted-foreground shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search commands..."
                                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-medium"
                                />
                                <div className="flex items-center gap-1.5">
                                    <kbd className="font-mono-code text-[10px] text-muted-foreground bg-secondary border border-border rounded px-1.5 py-0.5">
                                        ESC
                                    </kbd>
                                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Results */}
                            <div ref={listRef} className="max-h-72 overflow-y-auto py-2">
                                {Object.entries(grouped).length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">No commands found.</p>
                                ) : (
                                    Object.entries(grouped).map(([category, items]) => (
                                        <div key={category}>
                                            <p className="font-mono-code text-[10px] text-muted-foreground tracking-widest uppercase px-4 py-2">
                                                {category}
                                            </p>
                                            {items.map(item => {
                                                const idx = flatIndex++;
                                                const isActive = idx === activeIndex;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        data-index={idx}
                                                        onClick={item.action}
                                                        onMouseEnter={() => setActiveIndex(idx)}
                                                        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                                                            }`}
                                                    >
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-medium truncate">{item.label}</span>
                                                            {item.description && (
                                                                <span className="font-mono-code text-[11px] text-muted-foreground truncate">
                                                                    {item.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            {item.shortcut && (
                                                                <kbd className="font-mono-code text-[10px] text-muted-foreground bg-secondary border border-border rounded px-1.5 py-0.5">
                                                                    {item.shortcut}
                                                                </kbd>
                                                            )}
                                                            {isActive && <ArrowRight size={12} className="text-primary" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-border px-4 py-2.5 flex items-center gap-4">
                                <span className="font-mono-code text-[10px] text-muted-foreground">
                                    <kbd className="bg-secondary border border-border rounded px-1 py-0.5 mr-1">↑↓</kbd>
                                    navigate
                                </span>
                                <span className="font-mono-code text-[10px] text-muted-foreground">
                                    <kbd className="bg-secondary border border-border rounded px-1 py-0.5 mr-1">↵</kbd>
                                    select
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
