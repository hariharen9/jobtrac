import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { 
  UserOnboarding, 
  QuickStartTask, 
  OnboardingStatus, 
  Application, 
  PrepEntry, 
  StarStory, 
  CompanyResearch,
  NetworkingContact
} from '../types';
import { 
  defaultOnboarding, 
  enhancedSampleApplications, 
  enhancedSamplePrepEntries, 
  enhancedSampleStarStories,
  initialCompanyResearch,
  initialNetworkingContacts
} from '../data/initialData';

export function useOnboarding(userId?: string | null) {
  const [onboarding, setOnboarding] = useState<UserOnboarding>(defaultOnboarding);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load onboarding state from Firestore
  useEffect(() => {
    if (!userId) {
      setOnboarding(defaultOnboarding);
      setLoading(false);
      return;
    }

    const loadOnboardingState = async () => {
      try {
        setLoading(true);
        const onboardingDocRef = doc(db, 'users', userId, 'settings', 'onboarding');
        const onboardingDoc = await getDoc(onboardingDocRef);

        if (onboardingDoc.exists()) {
          const data = onboardingDoc.data() as UserOnboarding;
          setOnboarding(data);
        } else {
          // Create default onboarding document for new user
          await setDoc(onboardingDocRef, defaultOnboarding);
          setOnboarding(defaultOnboarding);
        }
      } catch (err) {
        console.error('Error loading onboarding state:', err);
        setError('Failed to load onboarding state');
        setOnboarding(defaultOnboarding);
      } finally {
        setLoading(false);
      }
    };

    loadOnboardingState();
  }, [userId]);

  // Save onboarding state to Firestore
  const saveOnboardingState = useCallback(async (updates: Partial<UserOnboarding>) => {
    if (!userId) return;

    try {
      const onboardingDocRef = doc(db, 'users', userId, 'settings', 'onboarding');
      const updatedOnboarding = { ...onboarding, ...updates };
      
      await updateDoc(onboardingDocRef, updates);
      setOnboarding(updatedOnboarding);
    } catch (err) {
      console.error('Error saving onboarding state:', err);
      toast.error('Failed to save progress');
      throw err;
    }
  }, [userId, onboarding]);

  // Complete welcome wizard
  const completeWelcome = useCallback(async () => {
    await saveOnboardingState({ 
      hasCompletedWelcome: true,
      completedSteps: [...onboarding.completedSteps, 'welcome']
    });
    toast.success('Welcome completed!');
  }, [saveOnboardingState, onboarding.completedSteps]);

  // Mark step as completed
  const completeStep = useCallback(async (stepId: string) => {
    if (!onboarding.completedSteps.includes(stepId)) {
      await saveOnboardingState({
        completedSteps: [...onboarding.completedSteps, stepId]
      });
    }
  }, [saveOnboardingState, onboarding.completedSteps]);

  // Complete quick start task
  const completeQuickStartTask = useCallback(async (taskId: string) => {
    const updatedTasks = onboarding.quickStartTasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    await saveOnboardingState({ quickStartTasks: updatedTasks });
    
    const completedTask = onboarding.quickStartTasks.find(task => task.id === taskId);
    if (completedTask) {
      toast.success(`✓ ${completedTask.title} completed!`);
    }
  }, [saveOnboardingState, onboarding.quickStartTasks]);

  // Enable demo mode and populate with sample data
  const enableDemoMode = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // Add sample data to all collections
      const collections = [
        { name: 'applications', data: enhancedSampleApplications },
        { name: 'prepEntries', data: enhancedSamplePrepEntries },
        { name: 'stories', data: enhancedSampleStarStories },
        { name: 'companies', data: initialCompanyResearch },
        { name: 'contacts', data: initialNetworkingContacts }
      ];

      const batch = [];
      
      for (const collection of collections) {
        for (const item of collection.data) {
          const docRef = doc(db, 'users', userId, collection.name, item.id);
          batch.push(setDoc(docRef, {
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
          }));
        }
      }

      await Promise.all(batch);

      // Update onboarding state
      await saveOnboardingState({ 
        demoMode: true,
        completedSteps: [...onboarding.completedSteps, 'demo-data']
      });

      toast.success('Demo data loaded! Explore the features.');
    } catch (err) {
      console.error('Error enabling demo mode:', err);
      toast.error('Failed to load demo data');
    } finally {
      setLoading(false);
    }
  }, [userId, saveOnboardingState, onboarding.completedSteps]);

  // Disable demo mode and clear sample data
  const disableDemoMode = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      
      // This would require deleting sample data items
      // For now, just update the demo mode flag
      await saveOnboardingState({ demoMode: false });
      
      toast.success('Demo mode disabled');
    } catch (err) {
      console.error('Error disabling demo mode:', err);
      toast.error('Failed to disable demo mode');
    } finally {
      setLoading(false);
    }
  }, [userId, saveOnboardingState]);

  // Mark tooltips as seen
  const markTooltipsAsSeen = useCallback(async () => {
    await saveOnboardingState({ hasSeenTooltips: true });
  }, [saveOnboardingState]);

  // Check if user needs onboarding
  const needsOnboarding = !onboarding.hasCompletedWelcome;

  // Calculate onboarding progress
  const getOnboardingStatus = useCallback((): OnboardingStatus => {
    if (!onboarding.hasCompletedWelcome) return 'not-started';
    
    const totalTasks = onboarding.quickStartTasks.length;
    const completedTasks = onboarding.quickStartTasks.filter(task => task.completed).length;
    
    if (completedTasks === totalTasks) return 'completed';
    return 'in-progress';
  }, [onboarding]);

  // Get progress percentage
  const getProgressPercentage = useCallback((): number => {
    const totalTasks = onboarding.quickStartTasks.length;
    const completedTasks = onboarding.quickStartTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [onboarding.quickStartTasks]);

  // Reset onboarding (for testing)
  const resetOnboarding = useCallback(async () => {
    if (!userId) return;
    
    try {
      const onboardingDocRef = doc(db, 'users', userId, 'settings', 'onboarding');
      await setDoc(onboardingDocRef, defaultOnboarding);
      setOnboarding(defaultOnboarding);
      toast.success('Onboarding reset');
    } catch (err) {
      console.error('Error resetting onboarding:', err);
      toast.error('Failed to reset onboarding');
    }
  }, [userId]);

  return {
    // State
    onboarding,
    loading,
    error,
    needsOnboarding,
    
    // Actions
    completeWelcome,
    completeStep,
    completeQuickStartTask,
    enableDemoMode,
    disableDemoMode,
    markTooltipsAsSeen,
    resetOnboarding,
    
    // Computed values
    getOnboardingStatus,
    getProgressPercentage
  };
}