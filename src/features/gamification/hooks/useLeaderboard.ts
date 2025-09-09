import { useState, useCallback } from 'react';
import { doc, updateDoc, setDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { toast } from 'react-hot-toast';

export const useLeaderboard = (userId?: string) => {
  const [isPublishing, setIsPublishing] = useState(false);

  const updateUserPublicProfile = useCallback(async (username: string) => {
    if (!userId) return;
    const userDocRef = doc(db, 'users', userId);
    const gamificationDocRef = doc(db, 'gamification', userId);

    try {
      await updateDoc(userDocRef, { publicUsername: username });
      await updateDoc(gamificationDocRef, { leaderboardOptIn: true });
      toast.success(`Welcome to the leaderboards, ${username}!`);
    } catch (error) {
      console.error("Error opting into leaderboard:", error);
      toast.error("Could not join the leaderboard. Please try again.");
      throw error;
    }
  }, [userId]);

  const publishScore = useCallback(async (leaderboardId: string, score: number, username: string) => {
    if (!userId) return;
    setIsPublishing(true);
    const leaderboardDocId = `${userId}_${leaderboardId}`;
    const leaderboardRef = doc(db, 'leaderboard_scores', leaderboardDocId);

    try {
      await setDoc(leaderboardRef, {
        userId,
        username,
        score,
        leaderboardId,
        lastUpdated: new Date(),
      }, { merge: true });
      toast.success('Your score has been published!');
    } catch (error) {
      console.error("Error publishing score:", error);
      toast.error("Could not publish your score. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  }, [userId]);

  const fetchLeaderboard = useCallback(async (leaderboardId: string) => {
    const leaderboardRef = collection(db, 'leaderboard_scores');
    const q = query(
      leaderboardRef,
      where("leaderboardId", "==", leaderboardId),
      orderBy("score", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  }, []);

  return { isPublishing, updateUserPublicProfile, publishScore, fetchLeaderboard };
};
