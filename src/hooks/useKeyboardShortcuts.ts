import { useEffect, useCallback } from 'react';
import { TabType } from '../types';
import { AnalyticsService } from '../services/analyticsService';
import { useAuth } from '../features/auth/hooks/useAuth';

interface UseKeyboardShortcutsProps {
  setActiveTab: (tab: TabType) => void;
  openCommandPalette: () => void;
  openHelp: () => void;
  openProfile: () => void;
  toggleTheme: () => void;
  toggleNotes: () => void;
  isModalOpen: boolean;
  isCommandPaletteOpen: boolean;
}

export const useKeyboardShortcuts = ({
  setActiveTab,
  openCommandPalette,
  openHelp,
  openProfile,
  toggleTheme,
  toggleNotes,
  isModalOpen,
  isCommandPaletteOpen
}: UseKeyboardShortcutsProps) => {
  const { user } = useAuth();
  
  // Function to track keyboard shortcut usage
  const trackShortcut = useCallback((shortcutName: string) => {
    if (user?.uid) {
      AnalyticsService.trackEvent('keyboard_shortcut_used', user.uid, { shortcut_name: shortcutName });
    }
  }, [user]);
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when modal is open or user is typing in input fields
    if (
      isModalOpen || 
      isCommandPaletteOpen ||
      e.target instanceof HTMLInputElement || 
      e.target instanceof HTMLTextAreaElement ||
      (e.target as any)?.contentEditable === 'true'
    ) {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isModifierPressed = isMac ? e.metaKey : e.ctrlKey;
    const isSecondaryModifierPressed = isMac ? e.altKey : e.shiftKey;

    // Primary shortcuts (Cmd/Ctrl + key)
    if (isModifierPressed && !isSecondaryModifierPressed) {
      switch (e.key.toLowerCase()) {
        case 'k':
          e.preventDefault();
          trackShortcut('open_command_palette');
          openCommandPalette();
          break;
        case '1':
          e.preventDefault();
          trackShortcut('navigate_to_applications');
          setActiveTab('applications');
          break;
        case '2':
          e.preventDefault();
          trackShortcut('navigate_to_prep');
          setActiveTab('prep');
          break;
        case '3':
          e.preventDefault();
          trackShortcut('navigate_to_research');
          setActiveTab('research');
          break;
        case '4':
          e.preventDefault();
          trackShortcut('navigate_to_networking');
          setActiveTab('networking');
          break;
        case '5':
          e.preventDefault();
          trackShortcut('navigate_to_star');
          setActiveTab('star');
          break;
        case '6':
          e.preventDefault();
          trackShortcut('navigate_to_vault');
          setActiveTab('vault');
          break;
        case 'h':
          e.preventDefault();
          trackShortcut('open_help');
          openHelp();
          break;
        case 'p':
          e.preventDefault();
          trackShortcut('open_profile');
          openProfile();
          break;
      }
    }

    // Secondary shortcuts (Cmd+Option/Ctrl+Shift + key)
    if (isModifierPressed && isSecondaryModifierPressed) {
      switch (e.key.toLowerCase()) {
        case 't':
          e.preventDefault();
          trackShortcut('toggle_theme');
          toggleTheme();
          break;
        case 'n':
          e.preventDefault();
          trackShortcut('toggle_notes');
          toggleNotes();
          break;
      }
    }
  }, [
    setActiveTab, 
    openCommandPalette, 
    openHelp, 
    openProfile, 
    toggleTheme,
    toggleNotes,
    isModalOpen, 
    isCommandPaletteOpen,
    trackShortcut
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
};