import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Target,
  Brain,
  Building2,
  Network,
  BarChart3,
  Trophy,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Application Pipeline',
    description: 'Kanban-style visualization with drag-and-drop status management',
    color: 'from-indigo-500 to-blue-500',
    details: ['Visual pipeline tracking', 'Activity calendar', 'Mobile-optimized']
  },
  {
    icon: Brain,
    title: 'Interview Mastery',
    description: 'Systematic preparation with STAR stories and confidence tracking',
    color: 'from-purple-500 to-pink-500',
    details: ['STAR story bank', 'Prep session logs', 'Confidence metrics']
  },
  {
    icon: Building2,
    title: 'Company Intelligence',
    description: 'Strategic research hub with culture and contact mapping',
    color: 'from-green-500 to-emerald-500',
    details: ['Company database', 'Culture insights', 'Key contacts']
  },
  {
    icon: Network,
    title: 'Networking Hub',
    description: 'Relationship management with outreach tracking',
    color: 'from-orange-500 to-red-500',
    details: ['Contact management', 'Outreach tracking', 'Referral pipeline']
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Data-driven insights with success rate visualization',
    color: 'from-cyan-500 to-blue-500',
    details: ['Success metrics', 'Progress charts', 'Performance insights']
  },
  {
    icon: Trophy,
    title: 'Goal Achievement',
    description: 'Weekly targets with progress celebration system',
    color: 'from-yellow-500 to-orange-500',
    details: ['Weekly goals', 'Progress tracking', 'Achievement rewards']
  },
];

const FeatureCard = ({ feature, index, isInView }: any) => {
  return (
    <motion.div
      className="group relative p-4 sm:p-8 bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20 hover:bg-white/20 dark:hover:bg-dark-card/20 amoled:hover:bg-amoled-card/20 transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -10 }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        whileHover={{ scale: 1.1 }}
      />
      
      <motion.div
        className={`inline-flex p-3 sm:p-4 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 relative z-10`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </motion.div>

      <div className="relative z-10">
        <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-slate-900 dark:text-dark-text amoled:text-amoled-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 amoled:group-hover:text-indigo-400 transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4 sm:mb-6 leading-relaxed">
          {feature.description}
        </p>
        
        <ul className="space-y-1 sm:space-y-2 hidden sm:block">
          {feature.details.map((detail: string, detailIndex: number) => (
            <motion.li
              key={detailIndex}
              className="flex items-center text-xs sm:text-sm text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: (index * 0.1) + (detailIndex * 0.05) }}
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500 flex-shrink-0" />
              {detail}
            </motion.li>
          ))}
        </ul>
        
        <div className="sm:hidden">
          <motion.div
            className="flex items-center text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1 }}
          >
            <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
            {feature.details[0]}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        whileHover={{ scale: 1.5 }}
      />
    </motion.div>
  );
};

const Features = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="features-section" ref={ref} className="py-16 sm:py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12 sm:mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text"
          >
            Core Features That{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Drive Results
            </span>
          </motion.h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-3xl mx-auto">
            Every tool you need to transform your job search from chaos to strategic success
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;