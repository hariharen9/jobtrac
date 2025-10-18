import { useState, useEffect } from 'react';

export type ApplicationTrackerSettings = {
  viewMode: 'comfy' | 'compact';
  showStats: boolean;
  currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  salaryDenomination: 'K' | 'L';
};

export const useApplicationSettings = () => {
  const [settings, setSettings] = useState<ApplicationTrackerSettings>(() => {
    const saved = localStorage.getItem('applicationTrackerSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    return {
      viewMode: 'comfy',
      showStats: false,
      currency: 'INR',
      salaryDenomination: 'L',
    };
  });

  // Listen for storage changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('applicationTrackerSettings');
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse settings:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-window updates
    window.addEventListener('applicationSettingsChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('applicationSettingsChanged', handleStorageChange);
    };
  }, []);

  return settings;
};
