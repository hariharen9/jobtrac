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
import { collection, query, getDocs, writeBatch, doc, getDoc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
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
        // Track login event
        await AnalyticsService.trackEvent('login', user.uid);
        
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

    try {
      // Delete documents from main collections
      for (const collectionName of collectionsToDelete) {
        console.log(`Deleting documents from ${collectionName} for user:`, userId);
        const q = query(collection(db, 'users', userId, collectionName));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        console.log(`Added ${querySnapshot.docs.length} documents from ${collectionName} to deletion batch`);
      }

      // Delete all settings documents
      console.log('Deleting settings for user:', userId);
      const notesSettingsDocRef = doc(db, 'users', userId, 'settings', 'notesSettings');
      const onboardingSettingsDocRef = doc(db, 'users', userId, 'settings', 'onboarding');
      
      batch.delete(notesSettingsDocRef);
      batch.delete(onboardingSettingsDocRef);
      console.log('Settings documents added to batch for deletion.');

      // Delete the entire settings collection by querying and deleting all documents
      const settingsQuery = query(collection(db, 'users', userId, 'settings'));
      const settingsSnapshot = await getDocs(settingsQuery);
      settingsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      console.log(`Added ${settingsSnapshot.docs.length} settings documents to deletion batch`);

      // Commit the batch deletion
      await batch.commit();
      console.log('✅ Batch deletion completed successfully');

      // Delete the main user document (must be done separately after subcollections)
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
      console.log('✅ Main user document deleted successfully');

      toast.success('All user data deleted from Firestore.');
    } catch (error) {
      console.error('❌ Error during data deletion:', error);
      throw error; // Re-throw to allow caller to handle
    }
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

  const deleteAccount = async () => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No current user found');
    }

    try {
      console.log('🗑️ Starting account deletion for user:', currentUser.uid);
      
      // For anonymous users, re-authenticate first
      if (currentUser.isAnonymous) {
        try {
          await signInAnonymously(auth);
          console.log('✅ Anonymous user re-authenticated successfully.');
        } catch (reauthError) {
          console.error('❌ Error re-authenticating anonymous user:', reauthError);
          throw new Error('Failed to re-authenticate guest user.');
        }
      }

      // Delete all user data from Firestore
      try {
        await deleteUserData(currentUser.uid);
        console.log('✅ User data deleted from Firestore.');
      } catch (dataDeleteError) {
        console.error('❌ Error deleting user data:', dataDeleteError);
        throw new Error('Failed to delete user data.');
      }

      // Delete the user account from Firebase Auth
      try {
        await deleteUser(currentUser);
        console.log('✅ User account deleted from Firebase Auth.');
        toast.success('Account deleted successfully.');
      } catch (authDeleteError) {
        console.error('❌ Error deleting user account from Auth:', authDeleteError);
        throw new Error('Failed to delete user account from authentication.');
      }
    } catch (error) {
      console.error('❌ Account deletion failed:', error);
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
    deleteAccount,
    saveUserProfile,
    skipProfileSetup
  };
}