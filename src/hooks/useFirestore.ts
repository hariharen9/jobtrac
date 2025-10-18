import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  getDocs,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useOfflineWarning } from '../components/shared/OfflineWarning';

interface FirestoreDocument {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function useFirestore<T extends { id: string } & FirestoreDocument>(
  collectionName: string,
  userId?: string | null,
  usePolling: boolean = false,
  pollingInterval: number = 1000 // 1 seconds default
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOffline, showOfflineModal } = useOfflineWarning();

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

      if (usePolling) {
        // Polling mode: fetch data at intervals
        const fetchData = async () => {
          try {
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as T));
            
            setData(items);
            setLoading(false);
          } catch (err: any) {
            console.error(`Error fetching ${collectionName} (polling):`, err);
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
        // Real-time mode: use onSnapshot listener
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
            console.error(`Error fetching ${collectionName} (real-time):`, err);
            setError(err.message);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      }
    } catch (err) {
      console.error(`Error setting up listener for ${collectionName}:`, err);
      setError('Failed to set up data listener');
      setLoading(false);
    }
  }, [collectionName, userId, getCollectionRef, usePolling, pollingInterval]);

  const addItem = useCallback(async (item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (isOffline) {
      showOfflineModal();
      toast.error('You are offline. Please check your connection.');
      throw new Error('Offline');
    }
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
      toast.success('Item added successfully!');
      return docRef.id;

    } catch (err) {
      console.error(`Error adding item to ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      toast.error('Failed to add item.');
      throw err;
    }
  }, [collectionName, userId, getCollectionRef, isOffline, showOfflineModal]);

  const updateItem = useCallback(async (id: string, updates: Partial<Omit<T, 'id'>>) => {
    if (isOffline) {
      showOfflineModal();
      toast.error('You are offline. Please check your connection.');
      throw new Error('Offline');
    }
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
      toast.success('Item updated successfully!');
    } catch (err) {
      console.error(`Error updating item in ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      toast.error('Failed to update item.');
      throw err;
    }
  }, [collectionName, userId, getCollectionRef, isOffline, showOfflineModal]);

  const deleteItem = useCallback(async (id: string) => {
    if (isOffline) {
      showOfflineModal();
      toast.error('You are offline. Please check your connection.');
      throw new Error('Offline');
    }
    if (!userId) throw new Error('User must be authenticated to delete an item.');
    
    const collectionRef = getCollectionRef();
    if (!collectionRef) throw new Error('Could not get collection reference.');

    const docRef = doc(collectionRef, id);
    try {
      await deleteDoc(docRef);
      toast.success('Item deleted successfully!');
    } catch (err) {
      console.error(`Error deleting item from ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      toast.error('Failed to delete item.');
      throw err;
    }
  }, [collectionName, userId, getCollectionRef, isOffline, showOfflineModal]);

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem
  };
}
