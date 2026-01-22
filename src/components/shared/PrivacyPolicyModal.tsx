import React from 'react';
import Modal from './Modal';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy" size="lg">
      <div className="space-y-6 text-slate-600 dark:text-slate-300 p-2">
        <div>
          <p className="text-sm text-slate-500 mb-4">Last updated: January 22, 2026</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">1. Introduction</h3>
          <p>
            Welcome to JobTrac. I am Hariharen, the developer behind this open-source project. 
            Your privacy is critically important to me. This Privacy Policy explains how I collect, use, and protect your information 
            when you use the JobTrac application.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">2. Data We Collect</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Account Information:</strong> When you sign up via Google, we store your email address, display name, and profile picture URL provided by Google Authentication.</li>
            <li><strong>User Content:</strong> We store the data you explicitly create, including job applications, prep logs, company research notes, STAR stories, and networking contacts.</li>
            <li><strong>Usage Data:</strong> We use Google Analytics and Firebase Analytics to understand how the application is used (e.g., features used, pages visited) to improve the user experience. This data is anonymized.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">3. How We Use Your Data</h3>
          <p>
            Your data is used solely to provide the functionality of the JobTrac application:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>To manage your job search dashboard and related content.</li>
            <li>To authenticate your access to your private data.</li>
            <li>To improve the application based on usage patterns.</li>
          </ul>
          <p className="mt-2 font-medium">
            I do not sell, trade, or rent your personal identification information to others.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">4. Data Storage and Security</h3>
          <p>
            Your data is stored securely in Google Firebase (Firestore and Authentication services). 
            Firebase implements industry-standard security measures to protect your data. 
            However, no method of transmission over the Internet is 100% secure, and I cannot guarantee absolute security.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">5. Your Rights</h3>
          <p>
            Since this is your data, you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li><strong>Access:</strong> View all your stored data within the application.</li>
            <li><strong>Export:</strong> You can export your data (implementation pending/available via request or settings).</li>
            <li><strong>Delete:</strong> You can request the deletion of your account and all associated data by contacting me or using the delete account feature (if available).</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">6. Third-Party Services</h3>
          <p>
            JobTrac uses the following third-party services:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li><strong>Google Firebase:</strong> For authentication, database, and hosting.</li>
            <li><strong>Google Analytics:</strong> For usage tracking.</li>
            <li><strong>Logo.dev:</strong> For fetching company logos (in the browser extension).</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">7. Browser Extension</h3>
          <p>
            The JobTrac Browser Extension helps you import job postings from job boards directly into JobTrac. Here's how it handles your data:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li><strong>Data Collected:</strong> The extension only reads job posting data (company name, role, location, salary, job description) from the current page when you click the extension icon.</li>
            <li><strong>Data Storage:</strong> Your theme preference is stored locally in your browser using Chrome Storage API. No data is sent to external servers except when you choose to save to JobTrac.</li>
            <li><strong>Permissions Used:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><code className="text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">activeTab</code> - To read job posting data from the current page</li>
                <li><code className="text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">storage</code> - To save your preferences (theme, default status)</li>
                <li><code className="text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded">tabs</code> - To open JobTrac with pre-filled job data</li>
              </ul>
            </li>
            <li><strong>No Background Tracking:</strong> The extension does not run in the background, track your browsing, or collect any data without your explicit action.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">8. Changes to This Policy</h3>
          <p>
            I may update this Privacy Policy from time to time. I will notify users of any changes by posting the new Privacy Policy on this page.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">9. Contact Me</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact me at:
          </p>
          <p className="mt-1">
            <a href="mailto:thisishariharen@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              thisishariharen@gmail.com
            </a>
          </p>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PrivacyPolicyModal;
