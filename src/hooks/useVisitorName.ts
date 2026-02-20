import { useState, useCallback } from 'react';

export function useVisitorName() {
    const [visitorName, setVisitorNameState] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('visitor_name') || '';
        }
        return '';
    });

    const hasName = visitorName.trim().length > 0;

    const setVisitorName = useCallback((name: string) => {
        const trimmed = name.trim();
        setVisitorNameState(trimmed);
        if (typeof window !== 'undefined') {
            if (trimmed) {
                localStorage.setItem('visitor_name', trimmed);
            } else {
                localStorage.removeItem('visitor_name');
            }
        }
    }, []);

    const clearName = useCallback(() => {
        setVisitorNameState('');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('visitor_name');
        }
    }, []);

    return { visitorName, setVisitorName, clearName, hasName };
}
