
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Footer from '../components/landing/Footer';
import { useTheme } from '../hooks/shared/useTheme';

const LandingPage = () => {
  useTheme(); // Ensure theme is applied
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  // While checking auth, show a blank page or a loader
  if (loading || user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg"></div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-bg amoled:bg-amoled-bg">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
