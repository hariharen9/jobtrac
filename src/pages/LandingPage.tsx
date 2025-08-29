
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../hooks/shared/useTheme';
import ThemeToggle from '../components/shared/ThemeToggle';
import Pricing from '../components/landing/Pricing';
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
        className="relative z-50 flex items-center justify-between p-4 sm:p-6 backdrop-blur-md bg-white/70 dark:bg-dark-card/70 amoled:bg-amoled-card/70 border-b border-white/20 dark:border-dark-border/30 amoled:border-amoled-border/30"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative flex items-center justify-center">
            <img 
              src="/assets/jtrac-black-cropped.png" 
              alt="JobTrac Logo" 
              className="h-6 sm:h-10 w-auto object-contain dark:hidden amoled:hidden"
            />
            <img 
              src="/assets/jtrac-white-cropped.png" 
              alt="JobTrac Logo" 
              className="h-6 sm:h-10 w-auto object-contain hidden dark:block amoled:block"
            />
          </div>
        </motion.div>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-6 mr-4">
            <button
              onClick={() => {
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-400 transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => {
                document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-400 transition-colors font-medium"
            >
              Pricing
            </button>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
          <motion.a
            href="https://github.com/hariharen9/jobtrac"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-lg bg-white/50 dark:bg-dark-card/50 amoled:bg-amoled-card/50 backdrop-blur-sm border border-white/20 dark:border-dark-border/30 amoled:border-amoled-border/30 hover:bg-white/70 dark:hover:bg-dark-card/70 amoled:hover:bg-amoled-card/70 transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-dark-text amoled:text-amoled-text" />
          </motion.a>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link
              to="/auth"
              className="px-4 py-2 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm whitespace-nowrap"
            >
              <span className="sm:hidden">START</span>
              <span className="hidden sm:inline">GET STARTED</span>
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

      {/* Features Section */}
      <FeaturesSection />

      {/* Why JobTrac Section */}
      <WhyJobTracSection />

      {/* Problem Solution Section */}
      <ProblemSolutionSection />

      {/* Competitive Advantage */}
      <CompetitiveAdvantageSection />

      {/* Success Metrics */}
      <SuccessMetricsSection />

      {/* Technology Stack */}
      <TechnologyStackSection />

      {/* Pricing Section */}
      <PricingSection />

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

// Feature Card Component
const FeatureCard = ({ feature, index, isInView }: any) => {
  return (
    <motion.div
      className="group relative p-4 sm:p-8 bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20 hover:bg-white/20 dark:hover:bg-dark-card/20 amoled:hover:bg-amoled-card/20 transition-all duration-500 overflow-hidden"
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
        className={`inline-flex p-3 sm:p-4 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 relative z-10`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-slate-900 dark:text-dark-text amoled:text-amoled-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 amoled:group-hover:text-indigo-400 transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4 sm:mb-6 leading-relaxed">
          {feature.description}
        </p>
        
        {/* Details - Hide on very small screens, show abbreviated on mobile */}
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
        
        {/* Mobile: Show only first detail */}
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

      {/* Hover Effects */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        whileHover={{ scale: 1.5 }}
      />
    </motion.div>
  );
};

// Why JobTrac Changes Everything Section
const WhyJobTracSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 sm:py-32 px-6 bg-gradient-to-br from-slate-100/50 to-indigo-100/30 dark:from-dark-card/10 dark:to-dark-bg/10 amoled:from-amoled-card/10 amoled:to-amoled-bg/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            Why JobTrac{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Changes Everything
            </span>
          </motion.h2>
          <motion.p 
            className="text-2xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-4xl mx-auto italic"
            animate={isInView ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            "JobTrac isn't just another application tracker. It's the strategic co-pilot that transforms your job search from scattered chaos into a precision-engineered campaign."
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="bg-white/20 dark:bg-dark-card/20 amoled:bg-amoled-card/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 amoled:from-black amoled:to-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ▶️
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Demo Video Coming 🔜</h3>
                <p className="text-slate-300 text-center max-w-md px-4">
                  🚀
                </p>
              </div>
              
              {/* Optional: Add a subtle overlay pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Problem Solution Section - Reimagined
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

// Competitive Advantage Section - Reimagined
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

// Success Metrics Section
const SuccessMetricsSection = () => {
  return (
    <section className="py-16 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            Success{' '}
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Metrics
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-3xl mx-auto">
            Real results from professionals who transformed their job search with JobTrac
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
          {[
            { metric: 'Job Search Time', before: '5.2 months', after: '3.1 months', improvement: '40% faster' },
            { metric: 'Applications Tracked', before: '67% incomplete', after: '98% complete', improvement: '+31% accuracy' },
            { metric: 'Interview Success Rate', before: '23%', after: '41%', improvement: '78% increase' },
            { metric: 'Stress Level', before: '8.3/10', after: '4.7/10', improvement: '43% reduction' },
          ].map((metric, index) => (
            <div key={index} className="bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20">
              <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2 sm:mb-4">{metric.metric}</h3>
              <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-4">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Before:</span>
                  <span className="font-semibold text-red-600 dark:text-red-400 amoled:text-red-400 text-xs sm:text-sm">{metric.before}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">With JobTrac:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400 amoled:text-green-400 text-xs sm:text-sm">{metric.after}</span>
                </div>
              </div>
              <div className="text-center px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-bold text-xs sm:text-sm">
                {metric.improvement}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <blockquote className="text-xl italic text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-4xl mx-auto mb-4">
            "JobTrac turned my chaotic job search into a strategic campaign. I went from scattered applications to organized success in weeks, not months."
          </blockquote>
          <cite className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400">- Sarah Chen, Software Engineer</cite>
        </div>
      </div>
    </section>
  );
};

// Technology Stack Section
const TechnologyStackSection = () => {
  return (
    <section className="py-16 sm:py-32 px-6 bg-gradient-to-br from-gray-50/50 to-slate-100/30 dark:from-gray-900/10 dark:to-slate-900/10 amoled:from-gray-900/20 amoled:to-slate-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            Built with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Modern Excellence
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-3xl mx-auto">
            Cutting-edge technology stack ensuring reliability, performance, and scalability
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { name: 'React', version: '18.3.1', icon: '⚛️' },
            { name: 'TypeScript', version: '5.5.3', icon: '📘' },
            { name: 'Vite', version: '7.1.3', icon: '⚡' },
            { name: 'Firebase', version: '12.0.0', icon: '🔥' },
            { name: 'Tailwind CSS', version: '3.4.1', icon: '🎨' },
            { name: 'Framer Motion', version: '12.23.6', icon: '🎭' },
          ].map((tech, index) => (
            <div key={index} className="flex flex-col items-center space-y-1 sm:space-y-2 px-3 sm:px-6 py-2 sm:py-3 bg-white/20 dark:bg-dark-card/20 amoled:bg-amoled-card/20 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/30 dark:border-dark-border/30 amoled:border-amoled-border/30">
              <span className="text-lg sm:text-2xl">{tech.icon}</span>
              <div className="text-center">
                <span className="font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text block text-xs sm:text-sm">{tech.name}</span>
                <span className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hidden sm:block">{tech.version}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 sm:py-32 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 amoled:from-indigo-900/30 amoled:via-purple-900/30 amoled:to-pink-900/30" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-8 text-slate-900 dark:text-dark-text amoled:text-amoled-text"
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
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-6 sm:mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their job search with JobTrac's strategic approach.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
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
                className="group relative px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 flex items-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="sm:hidden">Start Free</span>
                  <span className="hidden sm:inline">Start Free Today</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-sm sm:text-base"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" fill="currentColor" />
              <span className="font-semibold">No credit card required 😉</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = () => {
  return <Pricing />;
};

// Footer Section
const FooterSection = () => {
  return (
    <footer className="bg-slate-900 dark:bg-dark-card amoled:bg-amoled-card text-white py-8 sm:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-12">
          {/* Logo and Description */}
          <div className="sm:col-span-2 md:col-span-2">
            <motion.div
              className="flex items-center mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative flex items-center justify-center mr-4">
                <img 
                  src="/assets/jtrac-white-cropped.png" 
                  alt="JobTrac Logo" 
                  className="h-8 w-auto object-contain"
                />
              </div>
            </motion.div>
            <p className="text-slate-300 leading-relaxed mb-3 sm:mb-6 max-w-md text-sm sm:text-base">
              The ultimate job search command center that transforms chaos into strategy and applications into offers.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <motion.a
                href="https://github.com/hariharen9/jobtrac"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
              <motion.a
                href="https://jobtrac.site"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Source Code', url: 'https://github.com/hariharen9/jobtrac' },
                { name: 'Issues', url: 'https://github.com/hariharen9/jobtrac/issues' },
                { name: 'Discussions', url: 'https://github.com/hariharen9/jobtrac/discussions' },
                { name: 'Contributing', url: 'https://github.com/hariharen9/jobtrac/blob/main/CONTRIBUTING.md' },
                { name: 'Releases', url: 'https://github.com/hariharen9/jobtrac/releases' }
              ].map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-indigo-400 transition-colors block"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
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
            © 2025 JobTrac. Built with 💜 by{' '}
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
