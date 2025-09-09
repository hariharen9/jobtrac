import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import useGamification from '../hooks/useGamification';
import { useLeaderboard } from '../features/gamification/hooks/useLeaderboard';
import BadgeProgress from '../features/gamification/components/BadgeProgress';
import StreakTracker from '../features/gamification/components/StreakTracker';
import LeaderboardOptIn from '../features/gamification/components/LeaderboardOptIn';
import Leaderboard from '../features/gamification/components/Leaderboard';
import { Award, Flame, BarChart2, ArrowLeft, Users, Github, Bug } from 'lucide-react';
import { useTheme } from '../hooks/shared/useTheme';
import ThemeToggle from '../components/shared/ThemeToggle';
import { useFirestore } from '../hooks/useFirestore';
import { Application, PrepEntry, StarStory, CompanyResearch, NetworkingContact } from '../types';

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
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      transition={{ type: 'spring' }}
    >
      <div className="text-4xl text-cyan-500 dark:text-cyan-300 mb-3">{icon}</div>
      <h3 className="text-5xl font-bold text-slate-900 dark:text-white amoled:text-gray-200 tracking-tighter">{value}</h3>
      <p className="text-sm text-slate-500 dark:text-white/60 amoled:text-gray-400 uppercase tracking-widest mt-2">{label}</p>
    </motion.div>
  );

const TabButton = ({ label, icon, isActive, onClick }: { label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="relative flex items-center gap-2 px-5 py-3 text-lg font-semibold text-slate-600 dark:text-white/80 amoled:text-gray-300 transition-colors duration-300 hover:text-slate-900 dark:hover:text-white amoled:hover:text-white">
      {icon}
      {label}
      {isActive && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />}
    </button>
);

const GamificationPage = () => {
  useTheme();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useGamification(user?.uid);
  const { updateUserPublicProfile } = useLeaderboard(user?.uid);
  const [activeTab, setActiveTab] = useState('badges');

  const { data: applications } = useFirestore<Application>('applications', user?.uid);
  const { data: prepEntries } = useFirestore<PrepEntry>('prepEntries', user?.uid, true);
  const { data: stories } = useFirestore<StarStory>('stories', user?.uid, true);
  const { data: companies } = useFirestore<CompanyResearch>('companies', user?.uid, true);
  const { data: contacts } = useFirestore<NetworkingContact>('contacts', user?.uid, true);

  const longestStreak = profile ? Math.max(...Object.values(profile.streaks).map(s => s.longest), 0) : 0;

  const handleJoinLeaderboard = async (username: string) => {
    await updateUserPublicProfile(username);
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>JobTrac - Gamification Hub</title>
      </Helmet>
      <div className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-gray-900 amoled:bg-black">
        <GameHeader level={profile?.level} points={profile?.points} />
        
        <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <Link to="/app" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-white/60 amoled:text-gray-400 hover:text-slate-900 dark:hover:text-white amoled:hover:text-gray-200 transition-colors mb-12">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
                initial="hidden"
                animate="show"
            >
                <StatCard label="Level" value={profileLoading ? '-' : profile?.level || 1} icon={<Award />} />
                <StatCard label="JobTrac Points" value={profileLoading ? '-' : profile?.points || 0} icon={<BarChart2 />} />
                <StatCard label="Longest Streak" value={profileLoading ? '-' : `${longestStreak} Days`} icon={<Flame />} />
            </motion.div>

          <motion.div 
            className="flex items-center justify-center my-12 border-b border-slate-200 dark:border-white/10"
          >
            <TabButton label="Badges" icon={<Award />} isActive={activeTab === 'badges'} onClick={() => setActiveTab('badges')} />
            <TabButton label="Streaks" icon={<Flame />} isActive={activeTab === 'streaks'} onClick={() => setActiveTab('streaks')} />
            <TabButton label="Leaderboards" icon={<Users />} isActive={activeTab === 'leaderboards'} onClick={() => setActiveTab('leaderboards')} />
          </motion.div>

          <div className="max-w-7xl mx-auto">
            {profileLoading ? (
              <div className="text-center"><p className="dark:text-white">Loading your stats...</p></div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {activeTab === 'badges' && <BadgeProgress profile={profile} />}
                {activeTab === 'streaks' && <StreakTracker streaks={profile?.streaks || {}} />}
                {activeTab === 'leaderboards' && (
                  profile?.leaderboardOptIn ? 
                    <Leaderboard 
                        user={user}
                        applications={applications || []}
                        prepEntries={prepEntries || []}
                        stories={stories || []}
                        companies={companies || []}
                        contacts={contacts || []}
                    /> : 
                    <LeaderboardOptIn onJoin={handleJoinLeaderboard} />
                )}
              </motion.div>
            )}
          </div>
        </main>
        <GameFooter />
      </div>
    </>
  );
};

export default GamificationPage;
