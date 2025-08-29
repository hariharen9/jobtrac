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
import { collection, query, getDocs, writeBatch, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { AnalyticsService } from '../../../services/analyticsService';
import { UserProfile } from '../../../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // Create user document if it doesn't exist
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email || null,
            createdAt: user.metadata.creationTime,
            lastLoginAt: user.metadata.lastSignInTime,
          }, { merge: true });
          console.log('User document created/updated with metadata.');
          
          // New user needs profile setup (unless anonymous)
          if (!user.isAnonymous) {
            setNeedsProfileSetup(true);
          }
        } else {
          // Update last login time if document exists
          await updateDoc(userDocRef, {
            lastLoginAt: user.metadata.lastSignInTime,
          });
          console.log('User lastLoginAt updated.');
          
          // Check if existing user needs profile setup
          const userData = userDocSnap.data();
          const hasCompletedProfile = userData?.profile?.profileCompleted === true;
          
          if (!hasCompletedProfile && !user.isAnonymous) {
            setNeedsProfileSetup(true);
          } else {
            setNeedsProfileSetup(false);
          }
        }
      } else {
        setNeedsProfileSetup(false);
      }
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

  const signUpWithEmail = async (email: string, password: string) => {
    console.log('Attempting to sign up with email:', email);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    console.log('Attempting to sign in with email:', email);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const deleteUserData = async (userId: string) => {
    const collectionsToDelete = ['applications', 'prepEntries', 'companies', 'contacts', 'stories', 'notesCollection'];
    const batch = writeBatch(db);

    // Delete documents from main collections
    for (const collectionName of collectionsToDelete) {
      const q = query(collection(db, 'users', userId, collectionName));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    // Delete the notesSettings document
    console.log('Attempting to delete notesSettings for user:', userId);
    const notesSettingsDocRef = doc(db, 'users', userId, 'settings', 'notesSettings');
    batch.delete(notesSettingsDocRef);
    console.log('notesSettings document added to batch for deletion.');

    await batch.commit();
    toast.success('All user data deleted from Firestore.');
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        if (auth.currentUser.isAnonymous) {
          const confirmation = window.confirm(
            'You are signed in as a guest, It is intended to just let users try out the application. Signing out will permanently delete all your data( To avoid this, make sure you are connected with Google :). Are you sure you want to continue?'
          );
          if (!confirmation) {
            return;
          }

          try {
            // Re-authenticate anonymous user to refresh token before deletion
            await signInAnonymously(auth);
            console.log('Anonymous user re-authenticated successfully.');
          } catch (reauthError) {
            console.error('Error re-authenticating anonymous user:', reauthError);
            toast.error('Failed to re-authenticate guest user. Please try again.');
            return; // Stop if re-authentication fails
          }

          try {
            await deleteUserData(auth.currentUser.uid);
            console.log('User data deleted from Firestore.');
          } catch (dataDeleteError) {
            console.error('Error deleting user data:', dataDeleteError);
            toast.error('Failed to delete user data. Please try again.');
            return; // Stop if data deletion fails
          }

          try {
            await deleteUser(auth.currentUser);
            toast.success('User account deleted successfully.');
            console.log('User account deleted from Firebase Auth.');
          } catch (authDeleteError) {
            console.error('Error deleting user account from Auth:', authDeleteError);
            toast.error('Failed to delete user account. Please try again.');
            return; // Stop if auth deletion fails
          }
        }
      }
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const saveUserProfile = async (profileData: Omit<UserProfile, 'profileCompleted' | 'profileCompletedAt'>) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    console.log('💾 Saving user profile for user:', user.uid, profileData);

    try {
      await AnalyticsService.saveUserProfile(user.uid, profileData);
      console.log('✅ User profile saved successfully');
      setNeedsProfileSetup(false);
      toast.success('Profile completed successfully! 🎉');
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      throw error;
    }
  };

  const skipProfileSetup = () => {
    setNeedsProfileSetup(false);
  };

  return {
    user,
    loading,
    needsProfileSetup,
    signInWithGoogle,
    signInAnonymous,
    signUpWithEmail,
    signInWithEmail,
    logout,
    saveUserProfile,
    skipProfileSetup
  };
}