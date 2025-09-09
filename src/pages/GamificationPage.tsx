import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import useGamification from '../hooks/useGamification';
import BadgeProgress from '../features/gamification/components/BadgeProgress';
import StreakTracker from '../features/gamification/components/StreakTracker';
import { Award, Flame, BarChart2, ArrowLeft, Github, Bug } from 'lucide-react';
import { useTheme } from '../hooks/shared/useTheme';
import ThemeToggle from '../components/shared/ThemeToggle';

// --- New, Self-Contained Components for this Page ---

const GameHeader = ({ level, points }: { level?: number, points?: number }) => (
  <motion.header 
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 amoled:bg-black/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/10 amoled:border-white/10"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center gap-4">
          <img src="/assets/jtrac-black-cropped.png" alt="JobTrac Logo" className="h-10 w-auto dark:hidden amoled:hidden" />
          <img src="/assets/jtrac-white-cropped.png" alt="JobTrac Logo" className="h-10 w-auto hidden dark:block amoled:block" />
          <Link to="/app" className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-white/60 amoled:text-gray-400 hover:text-slate-900 dark:hover:text-white amoled:hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-slate-200 dark:border-white/10 pr-6">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-bold text-slate-900 dark:text-white amoled:text-gray-200">Lv. {level || 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-cyan-400" />
              <span className="text-lg font-bold text-slate-900 dark:text-white amoled:text-gray-200">{points || 0} XP</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </motion.header>
);

const GameFooter = () => (
    <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 py-12"
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-white/40 amoled:text-gray-500">
            <p className="mb-4">Built with 💖 by <a href="https://hariharen9.site" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-slate-800 dark:hover:text-white amoled:hover:text-gray-300 transition-colors">Hariharen</a></p>
            <div className="flex justify-center items-center gap-6">
                <a href="https://github.com/hariharen9/jobtrac" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-700 dark:hover:text-white amoled:hover:text-gray-300 transition-colors"><Github className="w-4 h-4" /> Source Code</a>
                <a href="https://github.com/hariharen9/jobtrac/issues" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-700 dark:hover:text-white amoled:hover:text-gray-300 transition-colors"><Bug className="w-4 h-4" /> Report an Issue</a>
            </div>
        </div>
    </motion.footer>
);

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <motion.div 
    className="bg-white/80 dark:bg-white/5 amoled:bg-black/30 backdrop-blur-lg border border-slate-200 dark:border-white/10 amoled:border-white/20 rounded-2xl p-6 text-center flex flex-col items-center justify-center shadow-lg"
    whileHover={{ scale: 1.05, boxShadow: '0px 15px 40px rgba(0, 180, 255, 0.2)' }}
  >
    <div className="text-4xl text-cyan-500 dark:text-cyan-300 mb-3">{icon}</div>
    <h3 className="text-5xl font-bold text-slate-900 dark:text-white amoled:text-gray-200 tracking-tighter">{value}</h3>
    <p className="text-sm text-slate-500 dark:text-white/60 amoled:text-gray-400 uppercase tracking-widest mt-2">{label}</p>
  </motion.div>
);

const GamificationPage = () => {
  useTheme(); // Apply theme
  const { user } = useAuth();
  const { profile, loading } = useGamification(user?.uid);

  const longestStreak = profile ? Math.max(...Object.values(profile.streaks).map(s => s.longest), 0) : 0;

  return (
    <>
      <Helmet>
        <title>JobTrac - Gamification Hub</title>
      </Helmet>
      <div className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-gray-900 amoled:bg-black">
        <div className="fixed inset-0 h-full w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-blue-900/80 dark:to-black amoled:from-black amoled:via-gray-900/50 amoled:to-black pointer-events-none z-0"></div>
        
        <GameHeader level={profile?.level} points={profile?.points} />
        
        <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <motion.div 
            className="text-center my-12 sm:my-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-cyan-600 dark:from-white dark:to-cyan-400 amoled:from-gray-200 amoled:to-cyan-400">Your Progress Hub</h1>
            <p className="max-w-3xl mx-auto mt-6 text-lg text-slate-600 dark:text-white/60 amoled:text-gray-400">Level up your job search. Track your progress, earn rewards, and stay motivated.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
            initial="hidden"
            animate="show"
          >
            <StatCard label="Level" value={loading ? '-' : profile?.level || 1} icon={<Award />} />
            <StatCard label="JobTrac Points" value={loading ? '-' : profile?.points || 0} icon={<BarChart2 />} />
            <StatCard label="Longest Streak" value={loading ? '-' : `${longestStreak} Days`} icon={<Flame />} />
          </motion.div>

          <div className="max-w-6xl mx-auto mt-20">
            <h2 className="text-4xl font-bold text-center mb-6 tracking-tighter text-slate-900 dark:text-white amoled:text-gray-200">Streaks</h2>
            {loading ? <p className="text-center">Loading streaks...</p> : <StreakTracker streaks={profile?.streaks || {}} />}
          </div>

          <div className="max-w-6xl mx-auto mt-20">
            <h2 className="text-4xl font-bold text-center mb-12 tracking-tighter text-slate-900 dark:text-white amoled:text-gray-200">Badges</h2>
            {loading ? <p className="text-center">Loading badges...</p> : <BadgeProgress profile={profile} />}
          </div>

        </main>
        
        <GameFooter />
      </div>
    </>
  );
};

export default GamificationPage;
