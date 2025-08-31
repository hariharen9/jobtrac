import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../hooks/shared/useTheme';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import FeaturesSection from '../components/landing/Features';
import WhyJobTracSection from '../components/landing/WhyJobTracSection';
import ProblemSolutionSection from '../components/landing/ProblemSolutionSection';
import CompetitiveAdvantageSection from '../components/landing/CompetitiveAdvantageSection';
import SuccessMetricsSection from '../components/landing/SuccessMetricsSection';
import TechnologyStackSection from '../components/landing/TechnologyStackSection';
import PricingSection from '../components/landing/PricingSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import BackToTopButton from '../components/shared/BackToTopButton';
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
  useTheme();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
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
    <>
      <Helmet>
        <title>JobTrac - The Ultimate Job Search Command Center</title>
      </Helmet>
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

        <Header />
        <Hero />
        <FeaturesSection />
        <WhyJobTracSection />
        <ProblemSolutionSection />
        <CompetitiveAdvantageSection />
        <SuccessMetricsSection />
        <TechnologyStackSection />
        <PricingSection />
        <CTASection />
        <Footer />
        <BackToTopButton />
      </div>
    </>
  );
};

export default LandingPage;
