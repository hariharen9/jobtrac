import { motion } from 'framer-motion';
import { Github, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-dark-card amoled:bg-amoled-card text-white py-8 sm:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-12">
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
                href="https://hariharen9.site"
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

          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-400">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Source Code', url: 'https://github.com/hariharen9/jobtrac' },
                { name: 'Issues', url: 'https://github.com/hariharen9/jobtrac/issues' },
                { name: ' LICENSE', url: 'https://github.com/hariharen9/jobtrac/blob/main/LICENSE' },
                { name: 'Pull Requests', url: 'https://github.com/hariharen9/jobtrac/pulls' },
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

export default Footer;