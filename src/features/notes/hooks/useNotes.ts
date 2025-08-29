import { useState, useEffect, useCallback } from 'react';
import { 
  collection,
  doc, 
  addDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
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
  title: 'My First Note',
  content: '# Welcome to Your Notes!\n\nThis is your brand new note-taking space. Here are some things you can do:\n\n- **Bold text** with `**`\n- *Italicize* with `*`\n- Create lists\n  - Like this one\n- Write `code` snippets\n\nFeel free to explore and make this space your own!\n',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  color: '#fbbf24',
  tags: [],
  pinned: false,
};

export const useNotes = (userId: string | undefined, usePolling: boolean = true, pollingInterval: number = 60000) => {
  const [notes, setNotes] = useState<NotePage[]>([]);
  const [settings, setSettings] = useState<UserNotes['settings']>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const notesCollectionRef = collection(db, 'users', userId, 'notesCollection');
    const settingsDocRef = doc(db, 'users', userId, 'settings', 'notesSettings');

    if (usePolling) {
      // Polling mode for notes
      const fetchData = async () => {
        try {
          const [notesSnapshot, settingsSnap] = await Promise.all([
            getDocs(query(notesCollectionRef, orderBy('createdAt', 'asc'))),
            getDoc(settingsDocRef)
          ]);
          
          const fetchedNotes: NotePage[] = notesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<NotePage, 'id'>
          }));
          
          setNotes(fetchedNotes);
          
          if (settingsSnap.exists()) {
            setSettings(settingsSnap.data().settings || DEFAULT_SETTINGS);
          }
          
          setLoading(false);
        } catch (err: any) {
          console.error('Error fetching notes (polling):', err);
          setError(err.message);
          setLoading(false);
        }
      };

      // Initial fetch
      fetchData();
      
      // Set up polling interval
      const intervalId = setInterval(fetchData, pollingInterval);
      
      return () => clearInterval(intervalId);
    } else {
      // Real-time mode for notes
      const unsubscribeNotes = onSnapshot(
        query(notesCollectionRef, orderBy('createdAt', 'asc')),
        (snapshot) => {
          const fetchedNotes: NotePage[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<NotePage, 'id'>
          }));
          setNotes(fetchedNotes);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching notes (real-time):', err);
          setError(err.message);
          setLoading(false);
        }
      );

      const unsubscribeSettings = onSnapshot(
        settingsDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setSettings(docSnap.data().settings || DEFAULT_SETTINGS);
          }
        },
        (err) => {
          console.error('Error fetching settings (real-time):', err);
          setError(err.message);
        }
      );

      return () => {
        unsubscribeNotes();
        unsubscribeSettings();
      };
    }
  }, [userId, usePolling, pollingInterval]);

  const addPage = useCallback(async (title: string = 'New Note', color: string = settings.defaultColor) => {
    if (!userId) return null;

    const notesCollectionRef = collection(db, 'users', userId, 'notesCollection');

    const newNote: Omit<NotePage, 'id'> = {
      title,
      content: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      color,
      tags: [],
      pinned: false,
    };

    try {
      const docRef = await addDoc(notesCollectionRef, newNote);
      return docRef.id;
    } catch (err) {
      console.error('Error adding note:', err);
      setError(err instanceof Error ? err.message : 'Failed to add note');
      return null;
    }
  }, [userId, settings]);

  const updatePage = useCallback(async (pageId: string, updates: Partial<Omit<NotePage, 'id'>>) => {
    if (!userId) return;

    const notesCollectionRef = collection(db, 'users', userId, 'notesCollection');
    const noteDocRef = doc(notesCollectionRef, pageId);

    const updatedData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    try {
      await updateDoc(noteDocRef, updatedData);
    } catch (err) {
      console.error('Error updating note:', err);
      setError(err instanceof Error ? err.message : 'Failed to update note');
    }
  }, [userId]);

  const deletePage = useCallback(async (pageId: string) => {
    if (!userId) return;
    
    if (notes.length <= 1) {
      setError('Cannot delete the last page.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const notesCollectionRef = collection(db, 'users', userId, 'notesCollection');
    const noteDocRef = doc(notesCollectionRef, pageId);

    try {
      await deleteDoc(noteDocRef);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  }, [userId, notes]);

  const reorderPages = useCallback(async (fromIndex: number, toIndex: number) => {
    console.warn('Reordering notes is not yet implemented with the new Firestore structure.');
    setError('Reordering notes is not yet implemented.');
    setTimeout(() => setError(null), 3000);
  }, []);

  const updateSettings = useCallback(async (updates: Partial<UserNotes['settings']>) => {
    if (!userId) return;

    const settingsDocRef = doc(db, 'users', userId, 'notesSettings');

    try {
      await updateDoc(settingsDocRef, { settings: updates });
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  }, [userId]);

  const clearError = useCallback(() => setError(null), []);

  return {
    notes,
    settings,
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