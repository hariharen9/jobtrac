import React from 'react';

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
          <cite className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400">- Manassa Varshni, Software Engineer</cite>
        </div>
      </div>
    </section>
  );
};

export default SuccessMetricsSection;
