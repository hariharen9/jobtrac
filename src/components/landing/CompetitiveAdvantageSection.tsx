import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CompetitiveAdvantageSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const advantages = [
    {
      icon: '🎨',
      title: 'Beautiful & Intuitive',
      description: 'Modern interface that makes job searching enjoyable, not overwhelming',
      stat: 'Native-like mobile experience'
    },
    {
      icon: '🚀',
      title: 'All-in-One Platform',
      description: 'Replace multiple tools with one comprehensive job search command center',
      stat: 'Integrated preparation system'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Understand what works in your job search with visual insights and metrics',
      stat: 'Data-driven optimization'
    },
    {
      icon: '🔄',
      title: 'Real-time Sync',
      description: 'Access your job search data seamlessly across all devices, always up-to-date',
      stat: 'Multi-device synchronization'
    },
  ];

  return (
    <section ref={ref} className="py-16 sm:py-32 px-6 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30 dark:from-indigo-900/10 dark:via-purple-900/10 dark:to-pink-900/10 amoled:from-indigo-900/20 amoled:via-purple-900/20 amoled:to-pink-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            What Makes JobTrac{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Special?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-3xl mx-auto">
            We've thoughtfully designed every feature to address real job search challenges
          </p>
        </motion.div>

        {/* Advantage Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-16">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              className="group p-4 sm:p-8 bg-white/20 dark:bg-dark-card/20 amoled:bg-amoled-card/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/30 dark:border-dark-border/30 amoled:border-amoled-border/30 hover:bg-white/30 dark:hover:bg-dark-card/30 amoled:hover:bg-amoled-card/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start space-x-3 sm:space-x-6">
                <motion.div
                  className="text-2xl sm:text-4xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                >
                  {advantage.icon}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2 sm:mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 amoled:group-hover:text-indigo-400 transition-colors">
                    {advantage.title}
                  </h3>
                  <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2 sm:mb-4 leading-relaxed text-sm sm:text-base hidden sm:block">
                    {advantage.description}
                  </p>
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 amoled:text-indigo-300 rounded-full text-xs sm:text-sm font-semibold">
                    ✓ {advantage.stat}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Market Context - Subtle */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-8 px-8 py-4 bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400">$4.5B</div>
              <div className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Market size</div>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-dark-border amoled:bg-amoled-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 amoled:text-purple-400">75M</div>
              <div className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Job seekers</div>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-dark-border amoled:bg-amoled-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 amoled:text-pink-400">43%</div>
              <div className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Use spreadsheets</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompetitiveAdvantageSection;
