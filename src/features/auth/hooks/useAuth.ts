import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser
} from 'firebase/auth';
import { auth, googleProvider, db } from '../../../lib/firebase';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInAnonymous = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    console.log('Attempting to sign up with email:', email);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    console.log('Attempting to sign in with email:', email);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        const confirmation = window.confirm(
          'You are signed in as a guest, It is intended to just let users try out the application. Signing out will permanently delete all your data( To avoid this, make sure you are connected with Google :). Are you sure you want to continue?'
        );
        if (!confirmation) {
          return;
        }

        const collectionsToDelete = ['applications', 'prepEntries', 'companies', 'contacts', 'stories', 'userNotes'];
        const batch = writeBatch(db);
  
        for (const collectionName of collectionsToDelete) {
          const q = query(collection(db, collectionName), where('userId', '==', auth.currentUser.uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
        }
        await batch.commit();
        toast.success('All user data deleted from Firestore.');

        await deleteUser(auth.currentUser);
        toast.success('Guest user account deleted successfully.');
      }
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInAnonymous,
    signUpWithEmail,
    signInWithEmail,
    logout
  };
}