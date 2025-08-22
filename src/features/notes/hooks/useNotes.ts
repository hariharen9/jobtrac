import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { UserNotes, NotePage } from '../../../types';

const DEFAULT_SETTINGS = {
  defaultColor: '#fbbf24', // amber-400
  showPreview: true,
  fontSize: 14,
  theme: 'auto' as const,
};

const DEFAULT_PAGE: Omit<NotePage, 'id'> = {
  title: 'My Notes',
  content: 'Welcome to your quick notes!\n\nUse **bold text** and *italic text* for formatting.\n\nStart writing your thoughts and ideas here...',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  color: '#fbbf24',
  tags: [],
  pinned: false,
};

export const useNotes = (userId: string | undefined) => {
  const [userNotes, setUserNotes] = useState<UserNotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserNotes(null);
      setLoading(false);
      return;
    }

    let unsubscribe: Unsubscribe | null = null;

    const initializeNotes = async () => {
      try {
        const notesDocRef = doc(db, 'userNotes', userId);
        
        // Check if user notes exist
        const notesDoc = await getDoc(notesDocRef);
        
        if (!notesDoc.exists()) {
          // Create initial notes document
          const initialNotes: UserNotes = {
            id: userId,
            userId,
            pages: [{ ...DEFAULT_PAGE, id: generateId() }],
            settings: DEFAULT_SETTINGS,
          };
          
          await setDoc(notesDocRef, initialNotes);
          setUserNotes(initialNotes);
        }

        // Set up real-time listener
        unsubscribe = onSnapshot(notesDocRef, (doc) => {
          if (doc.exists()) {
            setUserNotes(doc.data() as UserNotes);
          } else {
            setUserNotes(null);
          }
          setLoading(false);
        }, (error) => {
          console.error('Error listening to notes:', error);
          setError(error.message);
          setLoading(false);
        });

      } catch (err) {
        console.error('Error initializing notes:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    initializeNotes();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  const addPage = async (title: string = 'New Note', color: string = DEFAULT_SETTINGS.defaultColor) => {
    if (!userId || !userNotes) return null;

    const newPageId = generateId();
    const newPage: NotePage = {
      id: newPageId,
      title,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color,
      tags: [],
      pinned: false,
    };

    const updatedPages = [...userNotes.pages, newPage];
    
    try {
      const notesDocRef = doc(db, 'userNotes', userId);
      await updateDoc(notesDocRef, {
        pages: updatedPages,
      });
      return newPageId;
    } catch (err) {
      console.error('Error adding page:', err);
      setError(err instanceof Error ? err.message : 'Failed to add page');
      return null;
    }
  };

  const updatePage = async (pageId: string, updates: Partial<NotePage>) => {
    if (!userId || !userNotes) return;

    const pageIndex = userNotes.pages.findIndex(page => page.id === pageId);
    if (pageIndex === -1) return;

    const updatedPages = [...userNotes.pages];
    updatedPages[pageIndex] = {
      ...updatedPages[pageIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      const notesDocRef = doc(db, 'userNotes', userId);
      await updateDoc(notesDocRef, {
        pages: updatedPages,
      });
    } catch (err) {
      console.error('Error updating page:', err);
      setError(err instanceof Error ? err.message : 'Failed to update page');
    }
  };

  const deletePage = async (pageId: string) => {
    if (!userId || !userNotes) return;
    
    // Don't allow deleting the last page
    if (userNotes.pages.length <= 1) {
      setError('Cannot delete the last page');
      return;
    }

    const updatedPages = userNotes.pages.filter(page => page.id !== pageId);
    
    try {
      const notesDocRef = doc(db, 'userNotes', userId);
      await updateDoc(notesDocRef, {
        pages: updatedPages,
      });
    } catch (err) {
      console.error('Error deleting page:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete page');
    }
  };

  const reorderPages = async (fromIndex: number, toIndex: number) => {
    if (!userId || !userNotes) return;

    const updatedPages = [...userNotes.pages];
    const [reorderedPage] = updatedPages.splice(fromIndex, 1);
    updatedPages.splice(toIndex, 0, reorderedPage);

    try {
      const notesDocRef = doc(db, 'userNotes', userId);
      await updateDoc(notesDocRef, {
        pages: updatedPages,
      });
    } catch (err) {
      console.error('Error reordering pages:', err);
      setError(err instanceof Error ? err.message : 'Failed to reorder pages');
    }
  };

  const updateSettings = async (settings: Partial<UserNotes['settings']>) => {
    if (!userId || !userNotes) return;

    const updatedSettings = { ...userNotes.settings, ...settings };

    try {
      const notesDocRef = doc(db, 'userNotes', userId);
      await updateDoc(notesDocRef, {
        settings: updatedSettings,
      });
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  const clearError = () => setError(null);

  return {
    userNotes,
    loading,
    error,
    addPage,
    updatePage,
    deletePage,
    reorderPages,
    updateSettings,
    clearError,
  };
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
