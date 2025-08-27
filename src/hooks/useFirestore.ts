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
  where,
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

  useEffect(() => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const collectionRef = collection(db, collectionName);
      
      // Try with ordering first, fallback to simple query if index doesn't exist
      let q;
      try {
        q = query(
          collectionRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      } catch (indexError) {
        console.warn(`Composite index not available for ${collectionName}, using simple query:`, indexError);
        q = query(
          collectionRef,
          where('userId', '==', userId)
        );
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(`Fetched ${snapshot.docs.length} items from ${collectionName} for user ${userId}`);
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as T));
          
          // If we couldn't use orderBy in query, sort client-side
          const sortedItems = items.sort((a: T, b: T) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime; // desc order
          });
          
          setData(sortedItems);
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching ${collectionName}:`, err);
          
          // If it's an index error, try simple query
          if (err.code === 'failed-precondition' || err.message.includes('index')) {
            console.log(`Retrying with simple query for ${collectionName}`);
            const simpleQuery = query(
              collectionRef,
              where('userId', '==', userId)
            );
            
            const retryUnsubscribe = onSnapshot(
              simpleQuery,
              (snapshot) => {
                console.log(`Fetched ${snapshot.docs.length} items from ${collectionName} (simple query) for user ${userId}`);
                const items = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                } as T));
                
                // Sort client-side
                const sortedItems = items.sort((a: T, b: T) => {
                  const aTime = a.createdAt?.toMillis?.() || 0;
                  const bTime = b.createdAt?.toMillis?.() || 0;
                  return bTime - aTime;
                });
                
                setData(sortedItems);
                setLoading(false);
              },
              (retryErr) => {
                console.error(`Retry also failed for ${collectionName}:`, retryErr);
                setError(retryErr.message);
                setLoading(false);
              }
            );
            
            return () => retryUnsubscribe();
          }
          
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
  }, [collectionName, userId]);

  const addItem = useCallback(async (item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!userId) throw new Error('User must be authenticated to add an item.');
    
    try {
      const newItem = {
        ...item,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, collectionName), newItem);
      console.log(`Added item to ${collectionName} with ID:`, docRef.id);
      toast.success('Item added successfully!');
      return docRef.id;

    } catch (err) {
      console.error(`Error adding item to ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to add item');
      toast.error('Failed to add item.');
      throw err;
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
      console.log(`Updated item in ${collectionName} with ID:`, id);
      toast.success('Item updated successfully!');
    } catch (err) {
      console.error(`Error updating item in ${collectionName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to update item');
      toast.error('Failed to update item.');
      throw err;
    }
  }, [collectionName, userId]);

  const deleteItem = useCallback(async (id: string) => {
    if (!userId) throw new Error('User must be authenticated to delete an item.');

    const docRef = doc(db, collectionName, id);
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
