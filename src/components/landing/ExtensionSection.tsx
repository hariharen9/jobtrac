import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Chrome, Zap, MousePointerClick, Keyboard, CheckCircle, Download, ExternalLink } from 'lucide-react';

const ExtensionSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const EXTENSION_URL = "https://chromewebstore.google.com/detail/jobtrac-job-application-i/nipmnhedccgblgibeiikbcphcofgjfba";

  const benefits = [
    {
      icon: MousePointerClick,
      title: "One-Click Import",
      description: "Save jobs instantly without manual data entry"
    },
    {
      icon: Chrome,
      title: "Works Everywhere",
      description: "LinkedIn, Indeed, Glassdoor, Naukri & more"
    },
    {
      icon: Zap,
      title: "Instant Sync",
      description: "Auto-fills your JobTrac dashboard immediately"
    },
    {
      icon: Keyboard,
      title: "Power User Ready",
      description: "Use Alt/Ctrl+Shift+J to capture jobs in milliseconds"
    }
  ];

  return (
    <section id="extension-section" ref={ref} className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-full h-full bg-gradient-to-b from-transparent to-indigo-50/30 dark:to-indigo-900/10 amoled:to-indigo-900/10 -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Copy & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 amoled:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 amoled:bg-indigo-400 mr-2 animate-pulse"></span>
              New Release
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-6 leading-tight">
              Stop Copy-Pasting. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Start applying.
              </span>
            </h2>

            <p className="text-lg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-8 leading-relaxed">
              The JobTrac browser extension transforms how you save jobs.
              Capture role details, salary, and requirements from any job board
              directly into your pipeline with a single click.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 amoled:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text text-sm">{benefit.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mt-0.5">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href={EXTENSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Add to Chrome - It's Free
              </motion.a>
              {/* <button className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl hover:bg-slate-50 dark:hover:bg-dark-card/80 amoled:hover:bg-amoled-card/80 transition-all">
                Watch Demo
              </button> */}
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary flex items-center">
              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
              Rated 5/5 on Chrome Web Store.
            </p>
          </motion.div>

          {/* Right Column: Visual Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: -2 }}
            animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full transform scale-90" />

            <div className="relative bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border overflow-hidden">
              {/* Fake Browser Toolbar */}
              <div className="bg-slate-100 dark:bg-[#0d1117] amoled:bg-black border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border p-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white dark:bg-dark-bg amoled:bg-amoled-bg rounded-md px-3 py-1 text-xs text-slate-400 flex items-center">
                  <span className="mr-2 text-slate-300">🔒</span>
                  linkedin.com/jobs/view/381029...
                </div>
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                  JT
                </div>
              </div>

              {/* Mockup Content */}
              <div className="p-6 relative">
                 {/* Job Post Mockup */}
                 <div className="space-y-4 opacity-50 blur-[1px]">
                    <div className="h-8 w-3/4 bg-slate-200 dark:bg-dark-border rounded" />
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-dark-border rounded" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 w-24 bg-blue-100 dark:bg-blue-900/20 rounded" />
                      <div className="h-8 w-24 bg-green-100 dark:bg-green-900/20 rounded" />
                    </div>
                    <div className="space-y-2 mt-6">
                      <div className="h-3 w-full bg-slate-100 dark:bg-dark-border rounded" />
                      <div className="h-3 w-full bg-slate-100 dark:bg-dark-border rounded" />
                      <div className="h-3 w-5/6 bg-slate-100 dark:bg-dark-border rounded" />
                    </div>
                 </div>

                 {/* Extension Popover Overlay */}
                 <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute top-4 right-4 w-72 bg-white dark:bg-dark-bg amoled:bg-amoled-bg rounded-xl shadow-2xl border border-indigo-100 dark:border-indigo-900/50 p-4 z-10"
                 >
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-dark-border pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">J</div>
                        <span className="font-bold text-slate-900 dark:text-dark-text">JobTrac Importer</span>
                      </div>
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Active</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold">Role</label>
                        <div className="text-sm font-medium text-slate-800 dark:text-dark-text bg-slate-50 dark:bg-dark-card p-2 rounded border border-slate-100 dark:border-dark-border">Senior React Developer</div>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold">Company</label>
                        <div className="text-sm font-medium text-slate-800 dark:text-dark-text bg-slate-50 dark:bg-dark-card p-2 rounded border border-slate-100 dark:border-dark-border">TechCorp Inc.</div>
                      </div>

                      <button className="w-full mt-2 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                        <Zap className="w-3 h-3" />
                        Save to JobTrac
                      </button>
                    </div>
                 </motion.div>

                 {/* Cursor Animation */}
                 <motion.div
                    initial={{ x: 200, y: 200, opacity: 0 }}
                    animate={isInView ? { x: 180, y: 110, opacity: 1 } : {}}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute z-20 pointer-events-none"
                 >
                   <MousePointerClick className="w-8 h-8 text-slate-900 dark:text-white fill-current" />
                 </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ExtensionSection;
