import { useEffect, useCallback } from 'react';
import { TabType } from '../types';

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
          openCommandPalette();
          break;
        case '1':
          e.preventDefault();
          setActiveTab('applications');
          break;
        case '2':
          e.preventDefault();
          setActiveTab('prep');
          break;
        case '3':
          e.preventDefault();
          setActiveTab('research');
          break;
        case '4':
          e.preventDefault();
          setActiveTab('networking');
          break;
        case '5':
          e.preventDefault();
          setActiveTab('star');
          break;
        case 'h':
          e.preventDefault();
          openHelp();
          break;
        case 'p':
          e.preventDefault();
          openProfile();
          break;
      }
    }

    // Secondary shortcuts (Cmd+Option/Ctrl+Shift + key)
    if (isModifierPressed && isSecondaryModifierPressed) {
      switch (e.key.toLowerCase()) {
        case 't':
          e.preventDefault();
          toggleTheme();
          break;
        case 'n':
          e.preventDefault();
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
    isCommandPaletteOpen
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
};