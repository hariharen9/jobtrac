import React from 'react';
import { 
  Briefcase, 
  BookOpen, 
  Building, 
  Users, 
  Star, 
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface HelpPageProps {
  onClose: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ onClose }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-4">
          JobTrac Guide
        </h1>
        <p className="text-lg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
          Master your job search with this comprehensive tracking system. Here's how to use each feature effectively.
        </p>
      </div>

      <div className="space-y-8">
        {/* Application Tracker */}
        <section className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 amoled:bg-indigo-900 rounded-lg">
              <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Application Tracker</h2>
          </div>
          <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
            Track every job application from initial interest to final outcome.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Status Progression:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Track applications through stages: To Apply → Applied → HR Screen → Tech Screen → Manager Round → Final Round → Offer/Rejected
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Next Steps:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Always note what needs to happen next to keep momentum going
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Referral Tracking:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Mark applications that came through referrals to measure networking effectiveness
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prep Log */}
        <section className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 amoled:bg-green-900 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Prep Log</h2>
          </div>
          <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
            Document your interview preparation sessions to track progress and identify areas for improvement.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Topic Focus:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Organize by topics like "DSA: Arrays", "System Design: Databases", "Behavioral Questions"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Confidence Tracking:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Rate your confidence (1-5) to identify topics that need more practice
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Key Takeaways:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Document insights, techniques, and concepts learned for future reference
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Research */}
        <section className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 amoled:bg-blue-900 rounded-lg">
              <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Company Research</h2>
          </div>
          <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
            Deep dive into companies you're interested in to prepare compelling applications and interviews.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text">Research Areas:</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <li>• Business model and products</li>
                <li>• Company values and culture</li>
                <li>• Recent news and developments</li>
                <li>• Leadership and team structure</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text">Preparation Questions:</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <li>• Why do you want to work here?</li>
                <li>• What questions will you ask them?</li>
                <li>• How do your skills align?</li>
                <li>• What challenges might they face?</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Networking */}
        <section className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 amoled:bg-purple-900 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Networking & Referrals</h2>
          </div>
          <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
            Build and maintain professional relationships that can lead to job opportunities.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Outreach Strategy:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Track LinkedIn messages, emails, and coffee chats with potential referrers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Follow-up Management:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Note conversation details and schedule appropriate follow-ups
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">Referral Tracking:</strong>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Mark which contacts provided referrals and their outcomes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STAR Stories */}
        <section className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 amoled:bg-yellow-900 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">STAR Story Bank</h2>
          </div>
          <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
            Prepare compelling behavioral interview responses using the STAR method.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">STAR Framework:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 amoled:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">S</span>
                  </div>
                  <div>
                    <strong className="text-blue-700 dark:text-blue-400">Situation:</strong>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Set the context and background</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 amoled:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">T</span>
                  </div>
                  <div>
                    <strong className="text-purple-700 dark:text-purple-400">Task:</strong>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Describe your responsibility</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">A</span>
                  </div>
                  <div>
                    <strong className="text-orange-700 dark:text-orange-400">Action:</strong>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Explain what you did</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 amoled:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">R</span>
                  </div>
                  <div>
                    <strong className="text-green-700 dark:text-green-400">Result:</strong>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Share the outcome and impact</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">Story Categories:</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <li>• Leadership and team management</li>
                <li>• Problem-solving and innovation</li>
                <li>• Conflict resolution</li>
                <li>• Project management</li>
                <li>• Learning and adaptation</li>
                <li>• Customer focus</li>
                <li>• Technical challenges</li>
                <li>• Process improvement</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 amoled:from-amoled-card amoled:to-amoled-card rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-4">
            🎯 Best Practices for Job Search Success
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">Daily Habits:</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <li>• Update application statuses immediately</li>
                <li>• Log prep sessions while fresh in memory</li>
                <li>• Set reminders for follow-ups</li>
                <li>• Review and refine STAR stories regularly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">Weekly Reviews:</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <li>• Analyze application success rates</li>
                <li>• Identify prep topics needing attention</li>
                <li>• Plan networking outreach</li>
                <li>• Update company research with new info</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Got it! Let's start tracking
        </button>
      </div>
    </div>
  );
};

export default HelpPage;