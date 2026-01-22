import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'amoled';

const STORAGE_KEY = 'jobtrac-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from Chrome storage on mount
  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const savedTheme = result[STORAGE_KEY] as Theme | undefined;
      if (savedTheme && ['light', 'dark', 'amoled'].includes(savedTheme)) {
        setTheme(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
      setIsLoading(false);
    });
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'amoled');
    root.classList.add(theme);

    // Save to Chrome storage
    chrome.storage.local.set({ [STORAGE_KEY]: theme });
  }, [theme, isLoading]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'amoled';
      return 'light';
    });
  }, []);

  const setSpecificTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  return { theme, toggleTheme, setSpecificTheme, isLoading };
}
