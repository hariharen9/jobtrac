
import { Briefcase, BookOpen, Building, Users, Star, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'Application Pipeline',
    description: 'Visualize and manage your job applications with a drag-and-drop Kanban board.',
    icon: Briefcase,
  },
  {
    name: 'Interview Mastery Suite',
    description: 'Track study sessions, topics, and confidence levels to ace your interviews.',
    icon: BookOpen,
  },
  {
    name: 'Company Intelligence',
    description: 'Store crucial insights, contacts, and research on your target companies.',
    icon: Building,
  },
  {
    name: 'Networking Powerhouse',
    description: 'Manage your professional contacts and track your outreach efforts seamlessly.',
    icon: Users,
  },
  {
    name: 'Behavioral Story Bank',
    description: 'Build and manage a powerful collection of STAR stories for any situation.',
    icon: Star,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Get data-driven insights on your application sources and success rates.',
    icon: BarChart3,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 sm:py-24 bg-white dark:bg-dark-card amoled:bg-amoled-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-dark-text amoled:text-amoled-text sm:text-4xl">
            Everything You Need to Get Hired
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
            JobTrac provides a comprehensive suite of tools to manage every aspect of your job search.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              className="p-6 bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-md">
                <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                {feature.name}
              </h3>
              <p className="mt-2 text-base text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
