import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ProblemSolutionSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const challenges = [
    { icon: '📊', title: 'Scattered Information', description: 'Applications, notes, and research spread across multiple tools' },
    { icon: '😰', title: 'Interview Uncertainty', description: 'Unprepared for behavioral questions and company-specific inquiries' },
    { icon: '🔍', title: 'Lost Opportunities', description: 'Missed follow-ups and forgotten networking connections' },
    { icon: '📈', title: 'No Progress Insight', description: 'Unclear what strategies are working or need improvement' },
  ];

  return (
    <section ref={ref} className="py-16 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            From{' '}
            <span className="bg-gradient-to-r from-slate-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Chaos to Strategy
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-3xl mx-auto">
            We understand the job search struggle. That's why we built a comprehensive solution.
          </p>
        </motion.div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-16">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              className="group p-3 sm:p-6 bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20 hover:bg-white/20 dark:hover:bg-dark-card/20 amoled:hover:bg-amoled-card/20 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">{challenge.icon}</div>
              <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1 sm:mb-3">{challenge.title}</h3>
              <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-xs sm:text-sm leading-relaxed hidden sm:block">{challenge.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution Statement */}
        <motion.div
          className="text-center p-8 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 amoled:from-indigo-900/30 amoled:via-purple-900/30 amoled:to-pink-900/30 backdrop-blur-sm rounded-3xl border border-indigo-200/50 dark:border-indigo-700/30 amoled:border-indigo-700/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-4xl mr-3">✨</span>
          </motion.div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-4">
            JobTrac brings everything together
          </h3>
          <p className="text-lg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-2xl mx-auto">
            One unified platform for tracking applications, preparing for interviews, researching companies, managing networking, and analyzing your progress—all with beautiful design and real-time sync.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
