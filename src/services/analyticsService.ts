import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, AnalyticsOverview, AnalyticsDemographics, AnalyticsEvents, EventType, AnalyticsEvent } from '../types';

export class AnalyticsService {
  private static readonly ANALYTICS_COLLECTION = 'analytics';
  private static readonly OVERVIEW_DOC = 'overview';
  private static readonly DEMOGRAPHICS_DOC = 'demographics';
  private static readonly EVENTS_DOC = 'events';

  /**
   * Track a user event for analytics
   * Cost-optimized: Uses batching and efficient updates
   */
  static async trackEvent(eventType: EventType, userId?: string, parameters?: Record<string, string | number>): Promise<void> {
    try {
      console.log('📊 Tracking event:', eventType, 'User:', userId, 'Params:', parameters);
      
      // Update events analytics document
      const eventsRef = doc(db, this.ANALYTICS_COLLECTION, this.EVENTS_DOC);
      const eventsSnap = await getDoc(eventsRef);
      
      if (!eventsSnap.exists()) {
        // Initialize events document with default structure
        const initialEvents: AnalyticsEvents = {
          // User Lifecycle & Onboarding
          signUps: 0,
          logins: 0,
          onboardingStarted: 0,
          onboardingStepsCompleted: {},
          demoModeEnabled: 0,
          
          // Core Feature Engagement
          applicationsCreated: 0,
          applicationStatusChanges: {},
          jobDescriptionsSaved: 0,
          prepEntriesCreated: 0,
          starStoriesCreated: 0,
          companyResearchCreated: 0,
          networkingContactsCreated: 0,
          
          // Productivity & QOL Features
          commandPaletteOpened: 0,
          commandPaletteActions: {},
          themeChanges: {},
          keyboardShortcutsUsed: {},
          
          // User Outcomes & Success Metrics
          goalsSet: 0,
          applicationOffersReceived: 0,
          dataExported: 0,
          
          lastUpdated: serverTimestamp() as any
        };
        
        await setDoc(eventsRef, initialEvents);
      }
      
      // Prepare updates based on event type
      const updates: any = {
        lastUpdated: serverTimestamp()
      };
      
      switch (eventType) {
        // User Lifecycle Events
        case 'sign_up':
          updates.signUps = increment(1);
          break;
        case 'login':
          updates.logins = increment(1);
          break;
        case 'onboarding_started':
          updates.onboardingStarted = increment(1);
          break;
        case 'onboarding_step_completed':
          if (parameters?.step_name) {
            updates[`onboardingStepsCompleted.${parameters.step_name}`] = increment(1);
          }
          break;
        case 'demo_mode_enabled':
          updates.demoModeEnabled = increment(1);
          break;
          
        // Core Feature Events
        case 'application_created':
          updates.applicationsCreated = increment(1);
          break;
        case 'application_status_changed':
          if (parameters?.new_status) {
            updates[`applicationStatusChanges.${parameters.new_status}`] = increment(1);
          }
          break;
        case 'jd_saved':
          updates.jobDescriptionsSaved = increment(1);
          break;
        case 'prep_entry_created':
          updates.prepEntriesCreated = increment(1);
          break;
        case 'star_story_created':
          updates.starStoriesCreated = increment(1);
          break;
        case 'company_research_created':
          updates.companyResearchCreated = increment(1);
          break;
        case 'networking_contact_created':
          updates.networkingContactsCreated = increment(1);
          break;
          
        // Productivity Events
        case 'command_palette_opened':
          updates.commandPaletteOpened = increment(1);
          break;
        case 'command_palette_action':
          if (parameters?.action_type) {
            updates[`commandPaletteActions.${parameters.action_type}`] = increment(1);
          }
          break;
        case 'theme_changed':
          if (parameters?.theme_name) {
            updates[`themeChanges.${parameters.theme_name}`] = increment(1);
          }
          break;
        case 'keyboard_shortcut_used':
          if (parameters?.shortcut_name) {
            updates[`keyboardShortcutsUsed.${parameters.shortcut_name}`] = increment(1);
          }
          break;
          
        // Success Metrics
        case 'goal_set':
          updates.goalsSet = increment(1);
          break;
        case 'application_offer_received':
          updates.applicationOffersReceived = increment(1);
          break;
        case 'data_exported':
          updates.dataExported = increment(1);
          break;
          
        default:
          console.warn('Unknown event type:', eventType);
          return;
      }
      
      // Apply updates
      await updateDoc(eventsRef, updates);
      console.log('✅ Event tracked successfully:', eventType);
      
    } catch (error) {
      console.error('❌ Error tracking event:', eventType, error);
      // Don't throw to avoid breaking user flow
    }
  }

  /**
   * Save user profile data and update analytics
   */
  static async saveUserProfile(userId: string, profileData: Omit<UserProfile, 'profileCompleted' | 'profileCompletedAt'>): Promise<void> {
    console.log('📊 Starting analytics service save for user:', userId, profileData);
    console.log('🏭 Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
    
    try {
      // Simplified approach: Save user profile first, then analytics separately
      const userDocRef = doc(db, 'users', userId);
      const userProfileData: UserProfile = {
        ...profileData,
        profileCompleted: true,
        profileCompletedAt: serverTimestamp() as any
      };
      
      console.log('💾 Saving user profile data to Firestore path: users/' + userId);
      console.log('💾 Profile data to save:', userProfileData);
      
      const result = await setDoc(userDocRef, { profile: userProfileData }, { merge: true });
      console.log('✅ User profile setDoc result:', result);
      console.log('✅ User profile saved successfully');
      
      // Verify the data was actually written
      const verifyDoc = await getDoc(userDocRef);
      if (verifyDoc.exists()) {
        console.log('✅ VERIFICATION: User document exists with data:', verifyDoc.data());
      } else {
        console.error('❌ VERIFICATION FAILED: User document does not exist after write!');
      }
      
      // Update analytics in a separate operation to avoid transaction complexity
      await this.updateAnalyticsSeparately(profileData);
      
      // Track sign_up event for new user profile completion
      await this.trackEvent('sign_up', userId);
      
      console.log('User profile and analytics updated successfully');
    } catch (error) {
      console.error('❌ Error saving user profile and analytics:', error);
      console.error('❌ Error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        stack: (error as any)?.stack
      });
      throw error;
    }
  }
  
  /**
   * Update analytics separately to avoid transaction issues
   */
  private static async updateAnalyticsSeparately(profileData: Omit<UserProfile, 'profileCompleted' | 'profileCompletedAt'>): Promise<void> {
    try {
      console.log('📈 Starting analytics update for:', profileData);
      
      // Update overview
      const overviewRef = doc(db, this.ANALYTICS_COLLECTION, this.OVERVIEW_DOC);
      console.log('📈 Analytics overview path: analytics/overview');
      
      const overviewSnap = await getDoc(overviewRef);
      console.log('📈 Overview document exists:', overviewSnap.exists());
      
      if (!overviewSnap.exists()) {
        console.log('🆕 Creating new analytics overview document');
        await setDoc(overviewRef, {
          totalUsers: 1,
          lastUpdated: serverTimestamp()
        });
      } else {
        console.log('♾️ Updating existing analytics overview document');
        await updateDoc(overviewRef, {
          totalUsers: increment(1),
          lastUpdated: serverTimestamp()
        });
      }
      
      // Verify overview was written
      const verifyOverview = await getDoc(overviewRef);
      if (verifyOverview.exists()) {
        console.log('✅ VERIFICATION: Analytics overview exists with data:', verifyOverview.data());
      } else {
        console.error('❌ VERIFICATION FAILED: Analytics overview does not exist after write!');
      }
      
      // Update demographics
      const demographicsRef = doc(db, this.ANALYTICS_COLLECTION, this.DEMOGRAPHICS_DOC);
      console.log('📉 Analytics demographics path: analytics/demographics');
      
      const demographicsSnap = await getDoc(demographicsRef);
      console.log('📉 Demographics document exists:', demographicsSnap.exists());
      
      const genderKey = this.normalizeGenderForAnalytics(profileData.gender);
      console.log('📉 Normalized gender key:', genderKey);
      
      if (!demographicsSnap.exists()) {
        const initialDemographics: AnalyticsDemographics = {
          gender: {
            male: genderKey === 'male' ? 1 : 0,
            female: genderKey === 'female' ? 1 : 0,
            other: genderKey === 'other' ? 1 : 0,
            preferNotToSay: genderKey === 'preferNotToSay' ? 1 : 0
          },
          ageRanges: {
            '18-25': profileData.ageRange === '18-25' ? 1 : 0,
            '26-35': profileData.ageRange === '26-35' ? 1 : 0,
            '36-45': profileData.ageRange === '36-45' ? 1 : 0,
            '46-55': profileData.ageRange === '46-55' ? 1 : 0,
            '56+': profileData.ageRange === '56+' ? 1 : 0
          },
          countries: profileData.country ? { [profileData.country]: 1 } : {},
          lastUpdated: serverTimestamp() as any
        };
        
        console.log('🆕 Creating new demographics document with data:', initialDemographics);
        await setDoc(demographicsRef, initialDemographics);
      } else {
        const updates: any = {
          [`gender.${genderKey}`]: increment(1),
          [`ageRanges.${profileData.ageRange}`]: increment(1),
          lastUpdated: serverTimestamp()
        };

        if (profileData.country) {
          updates[`countries.${profileData.country}`] = increment(1);
        }

        console.log('♾️ Updating existing demographics with updates:', updates);
        await updateDoc(demographicsRef, updates);
      }
      
      // Verify demographics was written
      const verifyDemographics = await getDoc(demographicsRef);
      if (verifyDemographics.exists()) {
        console.log('✅ VERIFICATION: Analytics demographics exists with data:', verifyDemographics.data());
      } else {
        console.error('❌ VERIFICATION FAILED: Analytics demographics does not exist after write!');
      }
      
      console.log('✅ Analytics updated successfully');
    } catch (error) {
      console.error('❌ Error updating analytics:', error);
      console.error('❌ Analytics error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        stack: (error as any)?.stack
      });
      // Don't throw here to avoid breaking the main flow
    }
  }

  /**
   * Normalize gender values for analytics keys
   */
  private static normalizeGenderForAnalytics(gender: UserProfile['gender']): keyof AnalyticsDemographics['gender'] {
    switch (gender) {
      case 'Male':
        return 'male';
      case 'Female':
        return 'female';
      case 'Other':
        return 'other';
      case 'Prefer not to say':
        return 'preferNotToSay';
      default:
        return 'preferNotToSay';
    }
  }

  /**
   * Test basic Firestore connectivity and permissions
   */
  static async testFirestoreConnection(userId: string): Promise<boolean> {
    try {
      console.log('🧪 Testing Firestore connectivity for user:', userId);
      console.log('🧪 Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
      
      // Test 1: Try to write a simple test document
      const testRef = doc(db, 'test', 'connectivity-test');
      const testData = {
        timestamp: serverTimestamp(),
        userId: userId,
        test: 'basic-connectivity'
      };
      
      console.log('🧪 Test 1: Writing test document to test/connectivity-test');
      await setDoc(testRef, testData);
      console.log('✅ Test 1: Test document written successfully');
      
      // Test 2: Try to read the test document
      console.log('🧪 Test 2: Reading test document');
      const testSnap = await getDoc(testRef);
      if (testSnap.exists()) {
        console.log('✅ Test 2: Test document read successfully:', testSnap.data());
      } else {
        console.error('❌ Test 2: Test document does not exist after write!');
        return false;
      }
      
      // Test 3: Try to write to users collection
      const userTestRef = doc(db, 'users', userId);
      const userTestData = {
        testField: 'connectivity-test',
        timestamp: serverTimestamp()
      };
      
      console.log('🧪 Test 3: Writing to users collection: users/' + userId);
      await setDoc(userTestRef, userTestData, { merge: true });
      console.log('✅ Test 3: User document written successfully');
      
      // Test 4: Try to read from users collection
      console.log('🧪 Test 4: Reading from users collection');
      const userTestSnap = await getDoc(userTestRef);
      if (userTestSnap.exists()) {
        console.log('✅ Test 4: User document read successfully:', userTestSnap.data());
      } else {
        console.error('❌ Test 4: User document does not exist after write!');
        return false;
      }
      
      console.log('✅ All Firestore connectivity tests passed!');
      return true;
      
    } catch (error) {
      console.error('❌ Firestore connectivity test failed:', error);
      console.error('❌ Error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        code: (error as any)?.code,
        stack: (error as any)?.stack
      });
      return false;
    }
  }

  /**
   * Check if user has completed profile
   */
  static async hasCompletedProfile(userId: string): Promise<boolean> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        return false;
      }

      const userData = userDocSnap.data();
      return userData?.profile?.profileCompleted === true;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }

  /**
   * Get analytics overview data
   */
  static async getAnalyticsOverview(): Promise<AnalyticsOverview | null> {
    try {
      const overviewRef = doc(db, this.ANALYTICS_COLLECTION, this.OVERVIEW_DOC);
      const overviewSnap = await getDoc(overviewRef);
      
      if (!overviewSnap.exists()) {
        return null;
      }

      return overviewSnap.data() as AnalyticsOverview;
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      return null;
    }
  }

  /**
   * Get analytics demographics data
   */
  static async getAnalyticsDemographics(): Promise<AnalyticsDemographics | null> {
    try {
      const demographicsRef = doc(db, this.ANALYTICS_COLLECTION, this.DEMOGRAPHICS_DOC);
      const demographicsSnap = await getDoc(demographicsRef);
      
      if (!demographicsSnap.exists()) {
        return null;
      }

      return demographicsSnap.data() as AnalyticsDemographics;
    } catch (error) {
      console.error('Error fetching analytics demographics:', error);
      return null;
    }
  }

  /**
   * Get analytics events data
   */
  static async getAnalyticsEvents(): Promise<AnalyticsEvents | null> {
    try {
      const eventsRef = doc(db, this.ANALYTICS_COLLECTION, this.EVENTS_DOC);
      const eventsSnap = await getDoc(eventsRef);
      
      if (!eventsSnap.exists()) {
        return null;
      }

      return eventsSnap.data() as AnalyticsEvents;
    } catch (error) {
      console.error('Error fetching analytics events:', error);
      return null;
    }
  }
}