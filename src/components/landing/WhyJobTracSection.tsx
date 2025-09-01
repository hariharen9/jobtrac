import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const WhyJobTracSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="px-6 py-16 sm:py-32 bg-gradient-to-br from-slate-100/50 to-indigo-100/30 dark:from-dark-card/10 dark:to-dark-bg/10 amoled:from-amoled-card/10 amoled:to-amoled-bg/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}>
          <motion.h2 className="mb-6 text-5xl font-bold md:text-6xl text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            Why JobTrac{" "}
            <span className="text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text">
              Changes Everything
            </span>
          </motion.h2>
          <motion.p
            className="max-w-4xl mx-auto text-2xl italic text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary"
            animate={isInView ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity }}>
            "JobTrac isn't just another application tracker. It's the strategic
            co-pilot that transforms your job search from scattered chaos into a
            precision-engineered campaign."
          </motion.p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}>
          <div className="p-8 border bg-white/20 dark:bg-dark-card/20 amoled:bg-amoled-card/20 backdrop-blur-sm rounded-3xl border-white/30 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <div className="relative flex items-center justify-center overflow-hidden aspect-video bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 amoled:from-black amoled:to-slate-900 rounded-2xl">
              <video
                src="/assets/JobTrac-trim.mp4"
                autoPlay
                muted
                loop
                playsInline
                poster="/assets/preview.png"
                className="absolute inset-0 object-cover w-full h-full"
              />

              {/* Optional: Add a subtle overlay pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyJobTracSection;
