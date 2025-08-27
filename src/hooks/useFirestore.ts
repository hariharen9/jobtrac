import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FirestoreDocument {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useFirestore<T extends { id: string } & FirestoreDocument>(
  collectionName: string,
  userId?: string | null
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCollectionRef = useCallback(() => {
    if (!userId) return null;
    return collection(db, 'users', userId, collectionName);
  }, [userId, collectionName]);

  useEffect(() => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const collectionRef = getCollectionRef();
    if (!collectionRef) return;

    try {
      const q = query(collectionRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(`Fetched ${snapshot.docs.length} items from ${collectionName} for user ${userId}`);
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
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err);
      setError('Failed to set up data listener');
      setLoading(false);
    }
  }, [collectionName, userId, getCollectionRef]);

  const addItem = useCallback(async (item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!userId) throw new Error('User must be authenticated to add an item.');
    
    const collectionRef = getCollectionRef();
    if (!collectionRef) throw new Error('Could not get collection reference.');

    try {
      const newItem = {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collectionRef, newItem);
      console.log(`Added item to ${collectionName} with ID:`, docRef.id);
      toast.success('Item added successfully!');
      return docRef.id;

    } catch (err) {
      console.error(`Error adding item to ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      toast.error('Failed to add item.');
      throw err;
    }
  }, [collectionName, userId, getCollectionRef]);

  const updateItem = useCallback(async (id: string, updates: Partial<Omit<T, 'id'>>) => {
    if (!userId) throw new Error('User must be authenticated to update an item.');

    const collectionRef = getCollectionRef();
    if (!collectionRef) throw new Error('Could not get collection reference.');

    const docRef = doc(collectionRef, id);
    const updatedData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    try {
      await updateDoc(docRef, updatedData);
      console.log(`Updated item in ${collectionName} with ID:`, id);
      toast.success('Item updated successfully!');
    } catch (err) {
      console.error(`Error updating item in ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      toast.error('Failed to update item.');
      throw err;
    }
  }, [collectionName, userId, getCollectionRef]);

  const deleteItem = useCallback(async (id: string) => {
    if (!userId) throw new Error('User must be authenticated to delete an item.');
    
    const collectionRef = getCollectionRef();
    if (!collectionRef) throw new Error('Could not get collection reference.');

    const docRef = doc(collectionRef, id);
    try {
      await deleteDoc(docRef);
      console.log(`Deleted item from ${collectionName} with ID:`, id);
      toast.success('Item deleted successfully!');
    } catch (err) {
      console.error(`Error deleting item from ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      toast.error('Failed to delete item.');
      throw err;
    }
  }, [collectionName, userId, getCollectionRef]);

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem
  };
}
