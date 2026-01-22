import React from 'react';
import Modal from './Modal';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms and Conditions" size="lg">
      <div className="space-y-6 text-slate-600 dark:text-slate-300 p-2">
        <div>
          <p className="text-sm text-slate-500 mb-4">Last updated: January 22, 2026</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">1. Agreement to Terms</h3>
          <p>
            By accessing or using JobTrac, you agree to be bound by these Terms and Conditions. 
            If you disagree with any part of the terms, you may not access the service.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">2. Open Source License</h3>
          <p>
            JobTrac is an open-source project created by Hariharen. The source code is available on GitHub 
            and is licensed under the MIT License. You are free to fork, modify, and distribute the code 
            in accordance with the license terms.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">3. User Accounts</h3>
          <p>
            When you create an account with us, you must provide accurate information (via Google Auth). 
            You are responsible for safeguarding the password/credentials that you use to access the service 
            and for any activities or actions under your password/account.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">4. Disclaimer of Warranties</h3>
          <p className="uppercase font-medium">
            The service is provided on an "AS-IS" and "AS AVAILABLE" basis.
          </p>
          <p className="mt-2">
            I, Hariharen, make no representations or warranties of any kind, express or implied, regarding 
            the operation of the service, or the information, content, or materials included therein. 
            You expressly agree that your use of the service is at your sole risk.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">5. Limitation of Liability</h3>
          <p>
            In no event shall Hariharen be liable for any indirect, incidental, special, consequential or punitive damages, 
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
            resulting from (i) your access to or use of or inability to access or use the Service; 
            (ii) any conduct or content of any third party on the Service; 
            (iii) any content obtained from the Service; and 
            (iv) unauthorized access, use or alteration of your transmissions or content.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">6. Data Loss</h3>
          <p>
            While we strive to keep your data safe using Google Firebase, we are not responsible for any data loss. 
            We recommend you keep copies of important information.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">7. Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">8. Changes</h3>
          <p>
            I reserve the right, at my sole discretion, to modify or replace these Terms at any time. 
            By continuing to access or use the service after those revisions become effective, you agree to be bound by the revised terms.
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

export default TermsModal;
