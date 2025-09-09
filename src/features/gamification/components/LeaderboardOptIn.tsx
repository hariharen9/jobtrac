import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, UserPlus } from 'lucide-react';

const LeaderboardOptIn = ({ onJoin }: { onJoin: (username: string) => Promise<void> }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsLoading(true);
    try {
      await onJoin(username.trim());
    } catch (error) {
      console.error("Failed to join leaderboard:", error);
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-white/5 dark:bg-white/5 amoled:bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 text-center overflow-hidden"
    >
      <Trophy className="w-20 h-20 mx-auto text-amber-300" />
      <h2 className="text-3xl sm:text-4xl font-bold mt-6 text-slate-900 dark:text-white amoled:text-gray-200 tracking-tighter">Join the Friendly Competition!</h2>
      <p className="max-w-2xl mx-auto mt-4 text-slate-600 dark:text-white/60 amoled:text-gray-400">
        Ready to see how you stack up? Join the JobTrac leaderboards to compare your progress with the community. It's fun, motivational, and completely optional.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 text-left">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <ShieldCheck className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white amoled:text-gray-200">Secure & Optional</h3>
          <p className="text-sm text-slate-500 dark:text-white/60 amoled:text-gray-400 mt-1">Your participation is totally voluntary. Only your chosen public name and calculated score are ever shown. You are in control.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <UserPlus className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white amoled:text-gray-200">You Control Your Data</h3>
          <p className="text-sm text-slate-500 dark:text-white/60 amoled:text-gray-400 mt-1">Scores are not fetched automatically. You decide when to update your score on the leaderboard by clicking the "Publish Score" button.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto">
        <div className="relative">
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose your public leaderboard name..."
            className="w-full h-14 pl-5 pr-40 rounded-full bg-white/10 dark:bg-white/5 amoled:bg-black/20 border border-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
          />
          <motion.button 
            type="submit"
            disabled={!username.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-1/2 right-2 -translate-y-1/2 h-11 px-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Joining...' : 'Join Now'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default LeaderboardOptIn;
