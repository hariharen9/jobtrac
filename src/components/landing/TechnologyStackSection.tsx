import React from 'react';

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

export default TechnologyStackSection;
