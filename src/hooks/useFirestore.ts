import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Add a more specific type for Firestore documents
interface FirestoreDoc {
  id: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useFirestore<T extends { id: string }>(
  collectionName: string,
  userId?: string | null
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    const collectionRef = collection(db, collectionName);
    const q = query(
      collectionRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as T));
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, userId]);

  const addItem = useCallback(async (item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!userId) throw new Error('User must be authenticated to add an item.');
    
    setLoading(true);
    try {
      const newItem = {
        ...item,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, collectionName), newItem);
      
      // Optimistic update: add to local state immediately
      setData(prevData => [{ id: docRef.id, ...newItem } as T, ...prevData]);
      return docRef.id;

    } catch (err) {
      console.error(`Error adding item to ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err; // Re-throw to be caught in the component
    } finally {
      setLoading(false);
    }
  }, [collectionName, userId]);

  const updateItem = useCallback(async (id: string, updates: Partial<Omit<T, 'id'>>) => {
    if (!userId) throw new Error('User must be authenticated to update an item.');

    const docRef = doc(db, collectionName, id);
    const updatedData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    try {
      await updateDoc(docRef, updatedData);
      
      // Optimistic update: update local state
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, ...updatedData } : item
        )
      );
    } catch (err) {
      console.error(`Error updating item in ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  }, [collectionName, userId]);

  const deleteItem = useCallback(async (id: string) => {
    if (!userId) throw new Error('User must be authenticated to delete an item.');

    const docRef = doc(db, collectionName, id);
    try {
      await deleteDoc(docRef);
      
      // Optimistic update: remove from local state
      setData(prevData => prevData.filter(item => item.id !== id));

    } catch (err) {
      console.error(`Error deleting item from ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    }
  }, [collectionName, userId]);

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem
  };
}
