import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const ProblemSolutionSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const challenges = [
    { icon: '📊', title: 'Scattered Information', description: 'Applications, notes, and research spread across multiple tools' },
    { icon: '😰', title: 'Interview Uncertainty', description: 'Unprepared for behavioral questions and company-specific inquiries' },
    { icon: '🔍', title: 'Lost Opportunities', description: 'Missed follow-ups and forgotten networking connections' },
    { icon: '📈', title: 'No Progress Insight', description: 'Unclear what strategies are working or need improvement' },
  ];

  const testimonials = [
    {
      quote: "JobTrac turned my chaotic job search into a strategic campaign. I went from scattered applications to organized success in weeks, not months.",
      author: "Manassa Varshni",
      role: "Software Engineer",
      company: "IBM"
    },
    {
      quote: "As a career switcher, JobTrac's comprehensive platform helped me manage every aspect of my transition - from tracking over 100 applications to preparing confident interview responses. The structured approach gave me clarity and momentum when I needed it most.",
      author: "Thriambika Kumar",
      role: "Security Analyst",
      company: "Accenture"
    },
    {
      quote: "The Company Research feature helped me understand organizational cultures and tailor my applications accordingly, while the Prep Log transformed my interview preparation with structured STAR stories. Together, they increased my callback rate by 3x and interview confidence significantly.",
      author: "Sajal I",
      role: "HR Data Analyst",
      company: "Reliance"
    },
    {
      quote: "JobTrac's intuitive interface and comprehensive feature set streamlined my entire job search process. The ability to track applications, prepare for interviews, and research companies all in one place saved me countless hours and ultimately helped me land my dream role.",
      author: "Balaganesh S",
      role: "RFSW Engineer",
      company: "Qualcomm"
    }
  ];

  // Auto-rotate testimonials every 3 seconds, pause on hover
  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      }, 3000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, testimonials.length]);

  const nextTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  // Handle swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
  };

  return (
    <section ref={ref} className="py-16 sm:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            From{' '}
            <span className="bg-gradient-to-r from-slate-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Chaos to Strategy
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-3xl mx-auto">
            We understand the job search struggle. That's why we built a comprehensive solution.
          </p>
        </motion.div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-16">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              className="group p-3 sm:p-6 bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20 hover:bg-white/20 dark:hover:bg-dark-card/20 amoled:hover:bg-amoled-card/20 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">{challenge.icon}</div>
              <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1 sm:mb-3">{challenge.title}</h3>
              <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-xs sm:text-sm leading-relaxed hidden sm:block">{challenge.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution Statement */}
        <motion.div
          className="text-center p-8 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 amoled:from-indigo-900/30 amoled:via-purple-900/30 amoled:to-pink-900/30 backdrop-blur-sm rounded-3xl border border-indigo-200/50 dark:border-indigo-700/30 amoled:border-indigo-700/50 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-4xl mr-3">✨</span>
          </motion.div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-4">
            JobTrac brings everything together
          </h3>
          <p className="text-lg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-2xl mx-auto">
            One unified platform for tracking applications, preparing for interviews, researching companies, managing networking, and analyzing your progress—all with beautiful design and real-time sync.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          className="max-w-4xl mx-auto bg-white/10 dark:bg-dark-card/10 amoled:bg-amoled-card/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 border border-white/20 dark:border-dark-border/20 amoled:border-amoled-border/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-52 sm:h-60 md:h-56">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <blockquote className="text-base sm:text-xl md:text-2xl italic text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-6 sm:mb-6 text-center px-2 sm:px-4">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <cite className="text-sm sm:text-base md:text-lg font-semibold text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 text-center">
                  - {testimonials[currentTestimonial].author}, {testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-indigo-600 dark:bg-indigo-400 amoled:bg-indigo-400 w-4 sm:w-6' 
                    : 'bg-slate-300 dark:bg-slate-600 amoled:bg-slate-600'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows - Hidden on mobile, visible on larger screens */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-400 transition-colors duration-300 hidden sm:block"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-400 transition-colors duration-300 hidden sm:block"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;