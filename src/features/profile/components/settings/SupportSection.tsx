import React from 'react';
import { MessageCircle, Heart, Globe } from 'lucide-react';
import { FaPaypal, FaCoffee, FaLinkedin, FaTwitter, FaGithub, FaMedium } from 'react-icons/fa';

const SupportSection: React.FC = () => {
  const socialLinks = [
    { name: 'Portfolio', url: 'https://hariharen.site', icon: Globe, color: 'slate' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/hariharen9', icon: FaLinkedin, color: 'blue' },
    { name: 'Twitter', url: 'https://twitter.com/thisishariharen', icon: FaTwitter, color: 'sky' },
    { name: 'GitHub', url: 'https://github.com/hariharen9', icon: FaGithub, color: 'gray' },
    { name: 'Medium', url: 'https://medium.com/@hariharen', icon: FaMedium, color: 'green' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      slate: 'bg-slate-100 dark:bg-slate-700/30 amoled:bg-slate-700/30 text-slate-700 dark:text-slate-300 amoled:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50 amoled:hover:bg-slate-700/50',
      blue: 'bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/30 text-blue-700 dark:text-blue-300 amoled:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 amoled:hover:bg-blue-900/50',
      sky: 'bg-sky-100 dark:bg-sky-900/30 amoled:bg-sky-900/30 text-sky-700 dark:text-sky-300 amoled:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/50 amoled:hover:bg-sky-900/50',
      gray: 'bg-gray-100 dark:bg-gray-700/30 amoled:bg-gray-700/30 text-gray-700 dark:text-gray-300 amoled:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50 amoled:hover:bg-gray-700/50',
      green: 'bg-green-100 dark:bg-green-900/30 amoled:bg-green-900/30 text-green-700 dark:text-green-300 amoled:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 amoled:hover:bg-green-900/50'
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
          Support & Connect
        </h3>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
          Get help, share feedback, and support the project
        </p>
      </div>

      {/* Thank You Card */}
      <div className="p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-700/50 amoled:border-indigo-700/50 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 amoled:from-indigo-900/20 amoled:via-purple-900/20 amoled:to-pink-900/20">
        <div className="text-center mb-4">
          <div className="inline-flex p-3 rounded-full bg-white dark:bg-dark-card amoled:bg-amoled-card shadow-sm mb-3">
            <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400 amoled:text-pink-400" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">
            Thank You for Using JobTrac! 💜
          </h4>
          <p className="text-sm text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-md mx-auto">
            Your job search journey matters, and I'm honored to be part of it! Every feature you use brings you one step closer to success.
          </p>
        </div>
      </div>

      {/* Feedback Card */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 amoled:bg-green-900/30">
            <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400 amoled:text-green-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
              Share Feedback
            </h4>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3">
              Help improve JobTrac with your suggestions and ideas
            </p>
            
            <a
              href="https://github.com/hariharen9/jobtrac/discussions/categories/user-feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Give Feedback
            </a>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">
          Connect with the Developer
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${getColorClasses(link.color)}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{link.name}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Support the Project */}
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">
          Support the Project
        </h4>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
          Love JobTrac? Consider supporting the development!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://www.buymeacoffee.com/hariharen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:shadow-lg transition-all"
          >
            <FaCoffee className="w-5 h-5" />
            Buy Me a Coffee
          </a>
          <a
            href="https://paypal.me/thisishariharen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            <FaPaypal className="w-5 h-5" />
            PayPal
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
