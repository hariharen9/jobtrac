import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check,
  Star,
  Heart,
  Github,
  Zap,
  Shield,
  Users,
  Crown,
  Sparkles,
  ArrowRight,
  Code,
  Globe
} from 'lucide-react';

const Pricing = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const openSourceFeatures = [
    'Job application tracking system',
    'Interview preparation tools (prep log, STAR stories)',
    'Company research management',
    'Networking contact system',
    'Basic analytics dashboard',
    'Notes system with markdown support',
    'User authentication and data management',
    'Theme system (light/dark/amoled)',
    'Mobile-responsive interface',
    'Keyboard shortcuts and navigation',
    'Command palette functionality',
    'Search capabilities'
  ];

  const futureFeatures = [
    'Advanced analytics with AI-powered insights',
    'Automated email reminders and follow-up systems',
    'Team collaboration and multi-user workspaces',
    'Advanced data export capabilities',
    'Integration APIs and webhooks',
    'Priority customer support',
    'Mobile applications (iOS/Android)',
    'Advanced goal tracking with predictive analytics',
    'Bulk operations and data management tools',
    'Custom branding and white-label options'
  ];

  return (
    <section id="pricing-section" ref={ref} className="py-16 sm:py-32 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-purple-50/30 dark:from-green-900/10 dark:via-blue-900/10 dark:to-purple-900/10 amoled:from-green-900/20 amoled:via-blue-900/20 amoled:to-purple-900/20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 amoled:from-green-900/50 amoled:to-blue-900/50 text-green-700 dark:text-green-300 amoled:text-green-300 rounded-full text-sm font-semibold backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 amoled:border-green-700/50 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-4 h-4 mr-2" />
            Open Core - Free Forever
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            Open Source{' '}
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              First
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-4xl mx-auto leading-relaxed">
            JobTrac follows an <strong>Open Core</strong> model. Everything you need for successful job searching is 
            <span className="font-semibold text-green-600 dark:text-green-400 amoled:text-green-400"> completely free forever</span>. 
            Some advanced features may require a subscription in the future.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-16">
          {/* Free Open Source Plan */}
          <motion.div
            className="relative p-6 sm:p-8 bg-white/20 dark:bg-dark-card/20 amoled:bg-amoled-card/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-green-200/50 dark:border-green-700/50 amoled:border-green-700/50 hover:bg-white/30 dark:hover:bg-dark-card/30 amoled:hover:bg-amoled-card/30 transition-all duration-500 overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Badge */}
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              FREE FOREVER
            </motion.div>

            <div className="mb-6">
              <motion.div
                className="inline-flex p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Code className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">
                Open Source Core
              </h3>
              <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-lg mb-4">
                Everything you need for successful job searching
              </p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">$0</span>
                <span className="text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary ml-2">/forever</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {openSourceFeatures.slice(0, 8).map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + (index * 0.05) }}
                >
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-dark-text amoled:text-amoled-text">{feature}</span>
                </motion.div>
              ))}
              <motion.div
                className="flex items-center text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <span className="text-sm italic">+ {openSourceFeatures.length - 8} more core features</span>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/auth"
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Free Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>

            {/* GitHub Link */}
            <motion.div
              className="mt-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <a
                href="https://github.com/hariharen9/jobtrac"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-green-600 dark:hover:text-green-400 amoled:hover:text-green-400 transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                View Source Code
              </a>
            </motion.div>
          </motion.div>

          {/* Future Premium Plan */}
          <motion.div
            className="relative p-6 sm:p-8 bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-purple-200/50 dark:border-purple-700/50 amoled:border-purple-700/50 hover:bg-white/20 dark:hover:bg-dark-card/20 amoled:hover:bg-amoled-card/20 transition-all duration-500 overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Badge */}
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              COMING SOON
            </motion.div>

            <div className="mb-6">
              <motion.div
                className="inline-flex p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Crown className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">
                JobTrac Cloud
              </h3>
              <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-lg mb-4">
                Advanced features for power users
              </p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">TBD</span>
                <span className="text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary ml-2">/month</span>
              </div>
            </div>

            {/* Included Features */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-slate-700 dark:text-dark-text amoled:text-amoled-text font-semibold">All Open Source features</span>
              </div>
              <div className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-sm italic mb-4">Plus these advanced capabilities:</div>
            </div>

            {/* Premium Features */}
            <div className="space-y-3 mb-8">
              {futureFeatures.slice(0, 6).map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start opacity-70"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 0.7, x: 0 } : {}}
                  transition={{ delay: 0.5 + (index * 0.05) }}
                >
                  <Sparkles className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-dark-text amoled:text-amoled-text">{feature}</span>
                </motion.div>
              ))}
              <motion.div
                className="flex items-center text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary opacity-70"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.7 } : {}}
                transition={{ delay: 0.9 }}
              >
                <span className="text-sm italic">+ {futureFeatures.length - 6} more premium features</span>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                disabled
                className="w-full flex items-center justify-center px-6 py-4 bg-slate-400 dark:bg-slate-600 amoled:bg-slate-700 text-white rounded-xl font-semibold text-lg opacity-70 cursor-not-allowed"
              >
                <Globe className="w-5 h-5 mr-2" />
                Coming Soon
              </button>
            </motion.div>

            {/* Note */}
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary italic">
                Pricing will be announced later
              </p>
            </div>
          </motion.div>
        </div>

        {/* Open Source Commitment */}
        <motion.div
          className="text-center p-6 sm:p-8 bg-gradient-to-r from-green-50/50 via-blue-50/50 to-purple-50/50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 amoled:from-green-900/30 amoled:via-blue-900/30 amoled:to-purple-900/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-green-200/50 dark:border-green-700/30 amoled:border-green-700/50"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-red-500 mr-2" />
            <span className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Our Open Source Promise</span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">Always Free Core</h4>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Essential job search tools will remain free forever</p>
            </div>
            <div>
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">Community Driven</h4>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Built with and for the job searching community</p>
            </div>
            <div>
              <Code className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">Transparent Development</h4>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Open source, open roadmap, open community</p>
            </div>
          </div>
        </motion.div>

        {/* License Information */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
            Core features licensed under MIT License. 
            <a 
              href="https://github.com/hariharen9/jobtrac/blob/main/LICENSE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 hover:underline"
            >
              View full license details →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;