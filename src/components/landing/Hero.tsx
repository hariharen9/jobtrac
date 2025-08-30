import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Rocket,
  ArrowRight,
  Play,
  Heart,
  MousePointer,
  ChevronDown,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
    >
      <div className="max-w-6xl mx-auto text-center">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="mb-8"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.span
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 amoled:from-indigo-900/50 amoled:to-purple-900/50 text-indigo-700 dark:text-indigo-300 amoled:text-indigo-300 rounded-full text-sm font-semibold backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-700/50 amoled:border-indigo-700/50"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Transform Your Job Search Journey
                </motion.span>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                  The Ultimate{' '}
                </span>
                <motion.span
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  Job Search
                </motion.span>
                <br />
                <span className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                  Command Center
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Transform chaos into strategy. Turn applications into offers.{' '}
                <motion.span
                  className="text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 font-semibold"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  JobTrac replaces fragmented tools
                </motion.span>{' '}
                with a unified, strategic platform to help you land job offers more effectively.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth"
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 flex items-center overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <Rocket className="w-5 h-5 mr-2" />
                      Start Your Success Story
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => {
                      document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group px-8 py-4 bg-white/20 dark:bg-dark-card/20 amoled:bg-amoled-card/20 backdrop-blur-sm text-slate-700 dark:text-dark-text amoled:text-amoled-text rounded-2xl font-semibold text-lg border border-white/30 dark:border-dark-border/30 amoled:border-amoled-border/30 hover:bg-white/30 dark:hover:bg-dark-card/30 amoled:hover:bg-amoled-card/30 transition-all duration-300 flex items-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Explore Features
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => {
                      document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group px-8 py-4 bg-green-50/20 dark:bg-green-900/20 amoled:bg-green-900/20 backdrop-blur-sm text-green-700 dark:text-green-300 amoled:text-green-300 rounded-2xl font-semibold text-lg border border-green-200/50 dark:border-green-700/50 amoled:border-green-700/50 hover:bg-green-50/30 dark:hover:bg-green-900/30 amoled:hover:bg-green-900/30 transition-all duration-300 flex items-center"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    100% Free
                    <motion.div
                      className="ml-2"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  </button>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {[
                  { icon: Timer, number: '40%', label: 'Faster Job Search', color: 'from-green-500 to-emerald-500' },
                  { icon: TrendingUp, number: '78%', label: 'Higher Success Rate', color: 'from-blue-500 to-cyan-500' },
                  { icon: Heart, number: '43%', label: 'Less Stress', color: 'from-pink-500 to-rose-500' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-6 bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className={`inline-flex p-3 bg-gradient-to-r ${stat.color} rounded-xl mb-4`}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <motion.h3
                      className="text-3xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.7 }}
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary font-medium">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.button
          onClick={() => {
            document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-400 transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <MousePointer className="w-5 h-5 mb-2" />
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default Hero;