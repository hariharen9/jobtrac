import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserGamificationProfile, EarnedBadge } from '../types';
import { allBadges, badgeTriggers } from '../data/badges';
import { toast } from 'react-hot-toast';
import { Timestamp } from 'firebase/firestore';

const useGamification = (userId?: string) => {
  const [profile, setProfile] = useState<UserGamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getProfileRef = useCallback(() => {
    if (!userId) return null;
    return doc(db, 'gamification', userId);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const profileRef = getProfileRef();
      if (!profileRef) return;

      const docSnap = await getDoc(profileRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserGamificationProfile);
      } else {
        // Create a new profile if it doesn't exist
        const newProfile: UserGamificationProfile = {
          points: 0,
          level: 1,
          badges: [],
          progress: {},
          streaks: {},
        };
        await setDoc(profileRef, newProfile);
        setProfile(newProfile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId, getProfileRef]);

  const updateStreak = useCallback(async (streakType: string) => {
    if (!userId || !profile) return;

    const profileRef = getProfileRef();
    if (!profileRef) return;

    const today = new Date().toISOString().split('T')[0];
    const streakData = profile.streaks[streakType] || { current: 0, longest: 0, lastActivityDate: '' };

    if (streakData.lastActivityDate === today) {
      return; // Already updated today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrent = 1;
    if (streakData.lastActivityDate === yesterdayStr) {
      newCurrent = streakData.current + 1;
    }

    const newLongest = Math.max(newCurrent, streakData.longest);

    await updateDoc(profileRef, {
      [`streaks.${streakType}.current`]: newCurrent,
      [`streaks.${streakType}.longest`]: newLongest,
      [`streaks.${streakType}.lastActivityDate`]: today,
    });

    if (newCurrent > 1) {
        toast.success(`${streakType.charAt(0).toUpperCase() + streakType.slice(1)} streak: ${newCurrent} days!`, { icon: '🔥' });
    }

    setProfile(prev => prev ? { ...prev, streaks: { ...prev.streaks, [streakType]: { current: newCurrent, longest: newLongest, lastActivityDate: today } } } : null);

  }, [userId, profile, getProfileRef]);

  const trackProgress = useCallback(async (progressType: keyof typeof badgeTriggers, value: number = 1) => {
    if (!userId || !profile) return;

    const profileRef = getProfileRef();
    if (!profileRef) return;

    const newProgressValue = (profile.progress[progressType] || 0) + value;

    await updateDoc(profileRef, {
      [`progress.${progressType}`]: increment(value),
    });

    // Update streak for this activity, if it's a streakable one
    const streakableActivities = ['applications', 'prepEntries', 'contacts', 'companies', 'stories'];
    if (streakableActivities.includes(progressType)) {
      updateStreak(progressType);
    }

    // Check for new badges
    const triggers = badgeTriggers[progressType];
    const earnedBadgeIds = profile.badges.map(b => b.badgeId);

    for (const trigger of triggers) {
      if (newProgressValue >= trigger.progress && !earnedBadgeIds.includes(trigger.badgeId)) {
        const newBadge: EarnedBadge = {
          badgeId: trigger.badgeId,
          earnedAt: Timestamp.now(),
        };
        await updateDoc(profileRef, {
          badges: arrayUnion(newBadge),
          points: increment(100) // Award points for a new badge
        });

        const badgeInfo = allBadges.find(b => b.id === trigger.badgeId);
        if (badgeInfo) {
          toast.success(`Badge Unlocked: ${badgeInfo.name}!`, { icon: '🏆' });
        }
      }
    }

    // Refresh profile state
    setProfile(prev => prev ? { ...prev, progress: { ...prev.progress, [progressType]: newProgressValue } } : null);

  }, [userId, profile, getProfileRef, updateStreak]);

  const trackAppOpen = useCallback(() => {
    updateStreak('appOpen');
  }, [updateStreak]);

  const trackThemeChange = useCallback((theme: string) => {
    if (theme === 'dark' || theme === 'amoled') {
      trackProgress('theme_dark');
    }
  }, [trackProgress]);

  const trackQuickStartComplete = useCallback(() => {
    trackProgress('quick_start_done');
  }, [trackProgress]);

  return { profile, loading, trackProgress, trackAppOpen, trackThemeChange, trackQuickStartComplete };
};

export default useGamification;
