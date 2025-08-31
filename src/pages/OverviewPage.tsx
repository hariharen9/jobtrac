import React from 'react';
import { motion } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import atomOneDark from 'react-syntax-highlighter/dist/styles/atom-one-dark';
import { 
  Briefcase, 
  BookOpen, 
  Building, 
  Users, 
  Star, 
  Rocket, 
  Github, 
  Cpu, 
  Database, 
  LayoutTemplate 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const SectionHeader = ({ title, icon }) => {
  const Icon = icon;
  return (
    <div className="flex items-center mb-6">
      <Icon className="w-8 h-8 mr-4 animated-gradient-text" />
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
};

const FeatureCard = ({ icon, title, children }) => {
  const Icon = icon;
  return (
    <div className="p-6 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50">
      <div className="flex items-center mb-3">
        <Icon className="w-6 h-6 mr-3 text-indigo-500" />
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
      <p className="text-slate-600 dark:text-slate-400">{children}</p>
    </div>
  );
};

const CodeBlock = ({ code, language }) => (
  <div className="my-4 rounded-lg shadow-lg overflow-hidden">
    <SyntaxHighlighter language={language} style={atomOneDark} customStyle={{ margin: 0 }}>
      {code.trim()}
    </SyntaxHighlighter>
  </div>
);

const OverviewPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Project Overview - JobTrac</title>
      </Helmet>
      <div className="min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
        <div className="container mx-auto max-w-5xl px-4 py-12 sm:py-20">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold animated-gradient-text mb-4">JobTrac Project Overview</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">The ultimate command center for your job search.</p>
          </motion.div>

          {/* Project Purpose */}
          <section className="mb-16">
            <SectionHeader title="Project Purpose & Value" icon={Rocket} />
            <p className="text-lg text-slate-700 dark:text-slate-300">
              JobTrac transforms the job search from a chaotic, spreadsheet-driven process into a strategic, organized campaign. It eliminates the need for scattered tools by providing a unified platform to manage the entire job search lifecycle, increasing your chances of landing an offer.
            </p>
          </section>

          {/* Core Features */}
          <section className="mb-16">
            <SectionHeader title="Core Features" icon={Star} />
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard icon={Briefcase} title="Application Tracker">A Kanban board interface to visualize and manage your application pipeline from start to finish.</FeatureCard>
              <FeatureCard icon={BookOpen} title="Interview Preparation">A systematic suite to track study sessions, manage STAR stories, and store company-specific research.</FeatureCard>
              <FeatureCard icon={Building} title="Company Intelligence">Centralize research on company culture, values, and key contacts to tailor your applications and interviews.</FeatureCard>
              <FeatureCard icon={Users} title="Networking Hub">A relationship management system to track contacts, manage outreach, and monitor referral opportunities.</FeatureCard>
            </div>
          </section>

          {/* Technical Architecture */}
          <section className="mb-16">
            <SectionHeader title="Technical Architecture" icon={Cpu} />
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Frontend Stack</h3>
                <CodeBlock language="typescript" code={`// Core Technologies\nReact 18.3.1 + TypeScript 5.5.3\nVite 7.1.3 (Build Tool)\nTailwind CSS 3.4.1 (Styling)\nFramer Motion 12.23.6 (Animations)`} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Backend & Data</h3>
                <CodeBlock language="typescript" code={`// Firebase Integration\nFirebase 12.0.0 (Firestore + Auth + Analytics)\nReal-time data synchronization\nUser authentication (Google, Email, Anonymous)`} />
              </div>
            </div>
          </section>

          {/* Project Structure */}
          <section className="mb-16">
            <SectionHeader title="Project Structure" icon={LayoutTemplate} />
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
              JobTrac uses a feature-based architecture to keep the codebase organized, scalable, and easy to maintain. Shared logic is abstracted into custom hooks and reusable components.
            </p>
            <CodeBlock language="bash" code={`src/\n├── components/shared/  # Reusable UI components\n├── features/          # Feature-based modules (auth, apps, etc.)\n├── hooks/             # Custom React hooks (useFirestore, etc.)\n├── lib/               # External service integrations (Firebase)\n├── pages/             # Top-level page components\n├── types/             # TypeScript type definitions\n└── utils/             # Utility functions`} />
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Ready to Take Control of Your Job Search?</h2>
            <div className="flex justify-center gap-4">
              <a href="https://jobtrac.site/" target="_blank" rel="noopener noreferrer" className="px-8 py-3 font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
                Try the Live Demo
              </a>
              <a href="https://github.com/hariharen9/jobtrac" target="_blank" rel="noopener noreferrer" className="px-8 py-3 font-bold bg-slate-200 text-slate-800 rounded-lg shadow-lg hover:bg-slate-300 transition-transform transform hover:scale-105 flex items-center">
                <Github className="w-5 h-5 mr-2" />
                Star on GitHub
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default OverviewPage;