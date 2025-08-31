import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faqs = [
  {
    question: "Is JobTrac free to use?",
    answer: "Yes, JobTrac is completely free to use for individuals. All core features—unlimited application tracking, interview prep, company research, and networking—are available at no cost."
  },
  {
    question: "How does JobTrac help with job search organization?",
    answer: "JobTrac provides a unified command center to replace scattered spreadsheets and notes. It features a Kanban board for visual tracking, a calendar for deadlines, and dedicated sections for every aspect of your job hunt, from preparation to networking."
  },
  {
    question: "Can I import my existing job application data?",
    answer: "Yes, JobTrac supports CSV import functionality. This allows you to easily migrate your existing job application data from spreadsheets or other tracking systems so you can get started without losing your history."
  },
  {
    question: "What is the difference between JobTrac and a simple spreadsheet?",
    answer: "While a spreadsheet is static, JobTrac is a dynamic, interactive platform. It offers features like a drag-and-drop Kanban board, integrated prep logs with confidence tracking, a dedicated STAR story bank, analytics, and a relationship-focused networking hub—all things a spreadsheet can't do."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Your data is stored securely in Firebase Firestore. Each user's data is isolated and protected by security rules, ensuring that only you can access your own information."
  },
  {
    question: "Can I self-host JobTrac?",
    answer: "Absolutely. JobTrac is open-source, and you are encouraged to self-host it for personal or small team use. Check the README on our GitHub repository for instructions."
  },
  {
    question: "What is the STAR method and how does the Story Bank help?",
    answer: "The STAR (Situation, Task, Action, Result) method is a technique for answering behavioral interview questions. JobTrac includes a dedicated Story Bank to help you build, manage, and practice these stories so you're always prepared."
  },
  {
    question: "Does JobTrac work on mobile devices?",
    answer: "Yes, JobTrac is designed to be fully responsive and works seamlessly on desktops, tablets, and mobile phones, allowing you to manage your job search from anywhere."
  },
  {
    question: "What are keyboard shortcuts and the command palette?",
    answer: "For power users, JobTrac includes keyboard shortcuts (e.g., Cmd+K) to open a command palette. This allows you to navigate the app, search all your data, and perform actions without ever taking your hands off the keyboard."
  },
  {
    question: "How can I contribute to the project?",
    answer: "We welcome contributors! The best way to start is by visiting our GitHub repository. Look for issues tagged `good first issue`, or feel free to suggest a new feature. See our `CONTRIBUTING.md` file for more details."
  },
  {
    question: "Are there any premium or paid features planned?",
    answer: "The core product will always be free and open-source. We may introduce a hosted `JobTrac Pro` service in the future with advanced cloud-based features for power users or teams, but self-hosting will always give you access to everything."
  }
];

const AccordionItem = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border">
    <button 
      onClick={onClick}
      className="flex items-center justify-between w-full py-5 text-left text-lg font-medium text-slate-800 dark:text-slate-200"
    >
      <span>{faq.question}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="pb-5 pr-8 text-slate-600 dark:text-slate-400">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions - JobTrac</title>
      </Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
        <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-8 text-center">
              <HelpCircle className="w-12 h-12 mr-4 animated-gradient-text" />
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Frequently Asked Questions
              </h1>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-10 border border-slate-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50"
          >
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                faq={faq} 
                isOpen={openIndex === index}
                onClick={() => handleClick(index)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;