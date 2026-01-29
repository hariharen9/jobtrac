import { useState, useEffect, useCallback } from 'react';
import { AnalyticsService } from '../../services/analyticsService';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'amoled');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : prevTheme === 'dark' ? 'amoled' : 'light';

      if (user?.uid) {
        AnalyticsService.trackEvent('theme_changed', user.uid, { theme_name: newTheme });
      }

      return newTheme;
    });
  }, [user?.uid]);

  const setThemeValue = useCallback((newTheme: string) => {
    setTheme(newTheme);
    if (user?.uid) {
      AnalyticsService.trackEvent('theme_changed', user.uid, { theme_name: newTheme });
    }
  }, [user?.uid]);

  return { theme, toggleTheme, setTheme: setThemeValue };
}