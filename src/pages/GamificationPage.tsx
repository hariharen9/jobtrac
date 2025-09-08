import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import useGamification from '../hooks/useGamification';
import { useAuth } from '../features/auth/hooks/useAuth';
import BadgeProgress from '../features/gamification/components/BadgeProgress';
import StreakTracker from '../features/gamification/components/StreakTracker';

const GamificationPage = () => {
  const { user } = useAuth();
  const { profile, loading } = useGamification(user?.uid);

  return (
    <>
      <Helmet>
        <title>JobTrac - Achievements</title>
      </Helmet>
      <div className="relative overflow-hidden bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="absolute top-4 left-4">
            <Link to="/app" className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-400 transition-colors">
                &larr; Back to Dashboard
            </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <Trophy className="w-16 h-16 mx-auto text-amber-500" />
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            Achievements & Stats
          </h1>
          <p className="mt-2 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
            Track your progress, earn badges, and compete with others.
          </p>
        </motion.div>

        <div className="mt-12 max-w-5xl mx-auto space-y-8">
          <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg border border-slate-200 dark:border-dark-border amoled:border-amoled-border p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text mb-4">My Streaks</h2>
            {loading ? (
              <p>Loading streaks...</p>
            ) : profile ? (
              <StreakTracker streaks={profile.streaks} />
            ) : (
              <p>Could not load streaks.</p>
            )}
          </div>

          <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg border border-slate-200 dark:border-dark-border amoled:border-amoled-border p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text mb-4">All Badges</h2>
            {loading ? (
              <p>Loading badge progress...</p>
            ) : (
              <BadgeProgress profile={profile} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GamificationPage;
      
