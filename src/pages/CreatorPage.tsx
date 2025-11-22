import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Coffee } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { FaPaypal } from 'react-icons/fa';

const CreatorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About the Creator - JobTrac</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-dark-bg dark:via-black dark:to-dark-card/20 amoled:from-amoled-bg amoled:via-black amoled:to-amoled-card/20 text-slate-800 dark:text-slate-200">
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-4xl mx-auto bg-white/60 dark:bg-dark-card/50 amoled:bg-amoled-card/50 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50"
          >
            <div className="md:flex">
              {/* Left Side: Image and Bio */}
              <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white flex flex-col items-center justify-center text-center">
                <motion.img 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  src="https://ik.imagekit.io/halcyonweb/me.jpg" 
                  alt="Hariharen"
                  className="w-32 h-32 rounded-full border-4 border-white/50 shadow-lg"
                />
                <h2 className="mt-4 text-2xl font-bold">Hariharen</h2>
                <p className="mt-2 text-sm text-indigo-100">Full Stack Engineer & Creator of JobTrac</p>
              </div>

              {/* Right Side: Content and CTAs */}
              <div className="md:w-2/3 p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold animated-gradient-text mb-4">
                  A Message from the Creator
                </h1>
                <p className="mb-6 text-slate-600 dark:text-slate-300">
                  "I built JobTrac to solve a problem I faced myself: the chaos of managing a modern job search. My goal was to create more than just a tracker—I wanted to build a command center that empowers job seekers with strategy, confidence, and a clear path to their next role. This project is a testament to the power of technology to solve real-world challenges."
                </p>
                
                <div className="space-y-4">
                  <motion.a 
                    href="https://hariharen.site/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between w-full px-6 py-4 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl"
                  >
                    <span>View My Portfolio</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.a>

                  <motion.a 
                    href="https://github.com/hariharen9/jobtrac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between w-full px-6 py-4 font-bold transition-all duration-300 bg-slate-800 text-white rounded-lg hover:bg-slate-900"
                  >
                    <span>Star the Project on GitHub</span>
                    <Github className="w-5 h-5" />
                  </motion.a>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-dark-border/80">
                  <h3 className="text-center text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">Thank You for Using JobTrac!</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.a 
                      href="https://www.buymeacoffee.com/hariharen" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold text-black transition-colors bg-[#FFDD00] rounded-lg hover:bg-[#FBCB00]"
                    >
                      <Coffee />
                      <span>Buy Me a Coffee</span>
                    </motion.a>
                    <motion.a 
                      href="https://paypal.me/thisishariharen" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white transition-colors bg-[#00457C] rounded-lg hover:bg-[#003057]"
                    >
                      <FaPaypal />
                      <span>Support with PayPal</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreatorPage;