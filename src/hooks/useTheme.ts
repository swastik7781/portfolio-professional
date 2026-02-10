import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = useCallback((t: 'dark' | 'light') => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState(prev => prev === 'dark' ? 'light' : 'dark'), []);

  return { theme, setTheme, toggleTheme };
}
