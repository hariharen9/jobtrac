
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../hooks/shared/useTheme';
import ThemeToggle from '../components/shared/ThemeToggle';
import {
  Briefcase,
  Target,
  Zap,
  TrendingUp,
  Users,
  Calendar,
  Brain,
  Building2,
  Network,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Rocket,
  Sparkles,
  Timer,
  Trophy,
  Heart,
  Github,
  Play,
  ChevronDown,
  MousePointer,
  Eye
} from 'lucide-react';

const LandingPage = () => {
  useTheme();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (loading || user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-indigo-600 border-dashed rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-dark-bg dark:via-dark-bg dark:to-dark-card/20 amoled:from-amoled-bg amoled:via-amoled-bg amoled:to-amoled-card/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          style={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 flex items-center justify-between p-6 backdrop-blur-md bg-white/70 dark:bg-dark-card/70 amoled:bg-amoled-card/70 border-b border-white/20 dark:border-dark-border/30 amoled:border-amoled-border/30"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Briefcase className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            JobTrac
          </motion.h1>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <motion.a
            href="https://github.com/hariharen9/jobtrac"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/50 dark:bg-dark-card/50 amoled:bg-amoled-card/50 backdrop-blur-sm border border-white/20 dark:border-dark-border/30 amoled:border-amoled-border/30 hover:bg-white/70 dark:hover:bg-dark-card/70 amoled:hover:bg-amoled-card/70 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github className="w-5 h-5 text-slate-700 dark:text-dark-text amoled:text-amoled-text" />
          </motion.a>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/auth"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 py-20"
        style={{ y: yTransform, opacity: opacityTransform }}
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
                    JobTrac is the strategic co-pilot
                  </motion.span>{' '}
                  for your entire job search campaign.
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

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

  return (
    <section id="features-section" ref={ref} className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text"
          >
            Core Features That{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Drive Results
            </span>
          </motion.h2>
          <p className="text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-3xl mx-auto">
            Every tool you need to transform your job search from chaos to strategic success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ feature, index, isInView }: any) => {
  return (
    <motion.div
      className="group relative p-8 bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20 hover:bg-white/20 dark:hover:bg-dark-card/20 amoled:hover:bg-amoled-card/20 transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -10 }}
    >
      {/* Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        whileHover={{ scale: 1.1 }}
      />
      
      {/* Icon */}
      <motion.div
        className={`inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 relative z-10`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <feature.icon className="w-8 h-8 text-white" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-dark-text amoled:text-amoled-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 amoled:group-hover:text-indigo-400 transition-colors">
          {feature.title}
        </h3>
        <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-6 leading-relaxed">
          {feature.description}
        </p>
        
        {/* Details */}
        <ul className="space-y-2">
          {feature.details.map((detail: string, detailIndex: number) => (
            <motion.li
              key={detailIndex}
              className="flex items-center text-sm text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: (index * 0.1) + (detailIndex * 0.05) }}
            >
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              {detail}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Hover Effects */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        whileHover={{ scale: 1.5 }}
      />
    </motion.div>
  );
};

// CTA Section
const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 amoled:from-indigo-900/30 amoled:via-purple-900/30 amoled:to-pink-900/30" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-8 text-slate-900 dark:text-dark-text amoled:text-amoled-text"
            animate={isInView ? {
              scale: [1, 1.02, 1],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Ready to Transform Your{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Career Journey?
            </span>
          </motion.h2>
          
          <p className="text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their job search with JobTrac's strategic approach.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/auth"
                className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 flex items-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Zap className="w-6 h-6 mr-3" />
                  Start Free Today
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" />
              <span className="font-semibold">No credit card required</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Section
const FooterSection = () => {
  return (
    <footer className="bg-slate-900 dark:bg-dark-card amoled:bg-amoled-card text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Briefcase className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                JobTrac
              </h3>
            </motion.div>
            <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
              The ultimate job search command center that transforms chaos into strategy and applications into offers.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/hariharen9/jobtrac"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://jobtrac.site"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Globe className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">Quick Links</h4>
            <ul className="space-y-2">
              {['Features', 'Demo', 'GitHub', 'Documentation'].map((link, index) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button className="text-slate-300 hover:text-indigo-400 transition-colors">
                    {link}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">Impact</h4>
            <div className="space-y-3">
              {[
                { label: 'Job Search Time', value: '-40%' },
                { label: 'Success Rate', value: '+78%' },
                { label: 'Stress Reduction', value: '-43%' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-slate-300 text-sm">{stat.label}</span>
                  <span className="text-green-400 font-semibold">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <motion.div
          className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-400 mb-4 md:mb-0">
            © 2024 JobTrac. Built with 💜 by{' '}
            <a 
              href="https://hariharen9.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Hariharen
            </a>
          </p>
          <p className="text-slate-400 text-sm">
            Empowering careers, one application at a time.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default LandingPage;
