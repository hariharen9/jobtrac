import React from 'react';
import { SiReact, SiTypescript, SiVite, SiFirebase, SiTailwindcss, SiFramer } from 'react-icons/si';

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
            { name: 'React', version: '18.3.1', icon: SiReact, url: 'https://react.dev', color: '#61DAFB' },
            { name: 'TypeScript', version: '5.5.3', icon: SiTypescript, url: 'https://www.typescriptlang.org', color: '#3178C6' },
            { name: 'Vite', version: '7.1.3', icon: SiVite, url: 'https://vitejs.dev', color: '#646CFF' },
            { name: 'Firebase', version: '12.0.0', icon: SiFirebase, url: 'https://firebase.google.com', color: '#FFCA28' },
            { name: 'Tailwind CSS', version: '3.4.1', icon: SiTailwindcss, url: 'https://tailwindcss.com', color: '#06B6D4' },
            { name: 'Framer Motion', version: '12.23.6', icon: SiFramer, url: 'https://www.framer.com/motion', color: '#0055FF' },
          ].map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <a
                key={index}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-1 sm:space-y-2 px-3 sm:px-6 py-2 sm:py-3 bg-white/20 dark:bg-dark-card/20 amoled:bg-amoled-card/20 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/30 dark:border-dark-border/30 amoled:border-amoled-border/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10 cursor-pointer no-underline relative overflow-visible"
              >
                {/* Floating icons on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {[...Array(5)].map((_, i) => (
                    <IconComponent
                      key={i}
                      className="absolute text-2xl sm:text-3xl"
                      style={{ 
                        color: tech.color,
                        top: `${20 + Math.sin(i * 72 * Math.PI / 180) * 30}%`,
                        left: `${50 + Math.cos(i * 72 * Math.PI / 180) * 30}%`,
                        transform: 'translate(-50%, -50%)',
                        animation: `float-${index}-${i} 3s ease-in-out infinite`
                      }}
                    />
                  ))}
                </div>
                
                {/* Main icon */}
                <IconComponent className="text-3xl sm:text-4xl transition-transform duration-300 group-hover:scale-125 relative z-10" style={{ color: tech.color }} />
                
                <div className="text-center relative z-10">
                  <span className="font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text block text-xs sm:text-sm">{tech.name}</span>
                  <span className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hidden sm:block">{tech.version}</span>
                </div>
                
                {/* Add floating animations to style tag */}
                <style jsx>{`
                  @keyframes float-${index}-0 {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-10px); }
                  }
                  @keyframes float-${index}-1 {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-15px); }
                  }
                  @keyframes float-${index}-2 {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-12px); }
                  }
                  @keyframes float-${index}-3 {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-14px); }
                  }
                  @keyframes float-${index}-4 {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-11px); }
                  }
                `}</style>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechnologyStackSection;