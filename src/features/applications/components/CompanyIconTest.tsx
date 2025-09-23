import React from 'react';
import CompanyIcon from './CompanyIcon';

const CompanyIconTest: React.FC = () => {
  // Test cases with various spelling mistakes and variations
  const testCases = [
    'Google',           // Exact match
    'Googlee',          // Typo
    'Gogle',            // Missing letter
    'Microsft',         // Typo
    'Amazn',            // Missing letter
    'Facebok',          // Typo
    'Twiter',           // Typo
    'Lnkedin',          // Typo
    'TCS',              // Exact match
    'TCSS',             // Extra letter
    'Tata Consultancy', // Partial match
    'Infosys Ltd',      // Partial match with extra words
    'Wipro Tech',       // Partial match with extra words
    'HCL Tech',         // Partial match with abbreviation
    'Tech Mahindraaa',  // Extra letters
    'Zomato Pvt Ltd',   // Partial match with extra words
    'Ola Cabs',         // Partial match with extra words
    'Paytm Wallet',     // Partial match with extra words
    'Swiggyy',          // Extra letter
    'Phonepee',         // Typo
    'Flipkkart',        // Extra letters
    'Reliance Ind',     // Partial match
    'HDFC Bankk',       // Extra letter
    'ICICI Bank Ltd',   // Partial match with extra words
    'Axis Bankk',       // Extra letter
    'State Bank',       // Partial match
    'Tataa',            // Extra letter
    'Mahindraa',        // Extra letter
    'Bajaj Auto',       // Partial match with extra words
    'NonExistentCorp',  // No match
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Company Icon Fuzzy Matching Test</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testCases.map((company, index) => (
          <div 
            key={index} 
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-gray-600 mr-4">
              <CompanyIcon companyName={company} size={24} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{company}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Test case #{index + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyIconTest;