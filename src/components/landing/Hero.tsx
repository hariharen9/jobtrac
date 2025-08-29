
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="py-20 sm:py-28 text-center bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            The Ultimate <span className="animated-gradient-text">Job Search</span> Command Center
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
            Transform chaos into strategy. Turn applications into offers. JobTrac is the strategic co-pilot for your entire job search campaign.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth"
              className="px-8 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started for Free
            </Link>
            <a
              href="#features"
              className="px-8 py-3 text-base font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 transition-all"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
