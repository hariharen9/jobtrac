// Indeed Jobs Parser
// Extracts job data from Indeed job posting pages

import { ExtractedJobData, JobParser } from '../../types';

const getText = (selector: string): string => {
  const el = document.querySelector(selector);
  return el?.textContent?.trim() || '';
};

const getTextFromSelectors = (selectors: string[]): string => {
  for (const selector of selectors) {
    const text = getText(selector);
    if (text) return text;
  }
  return '';
};

export const indeedParser: JobParser = {
  name: 'Indeed',

  matches: (url: string): boolean => {
    return url.includes('indeed.com');
  },

  extract: (): ExtractedJobData | null => {
    try {
      // Job title
      const role = getTextFromSelectors([
        '.jobsearch-JobInfoHeader-title',
        'h1[data-testid="jobsearch-JobInfoHeader-title"]',
        '.icl-u-xs-mb--xs.icl-u-xs-mt--none.jobsearch-JobInfoHeader-title',
        'h1.jobTitle',
        '[data-testid="job-title"]',
        '.jcs-JobTitle',
      ]);

      // Company name
      const company = getTextFromSelectors([
        '[data-testid="inlineHeader-companyName"] a',
        '[data-testid="inlineHeader-companyName"]',
        '.jobsearch-InlineCompanyRating-companyHeader a',
        '.jobsearch-InlineCompanyRating-companyHeader',
        '[data-company-name="true"]',
        '.icl-u-lg-mr--sm.icl-u-xs-mr--xs',
      ]);

      // Location
      const location = getTextFromSelectors([
        '[data-testid="inlineHeader-companyLocation"]',
        '[data-testid="job-location"]',
        '.jobsearch-JobInfoHeader-subtitle > div:last-child',
        '.icl-u-xs-mt--xs.jobsearch-JobInfoHeader-subtitle',
      ]);

      // Job description
      const jobDescription = getTextFromSelectors([
        '#jobDescriptionText',
        '.jobsearch-jobDescriptionText',
        '[data-testid="jobDescriptionText"]',
        '.jobDescription',
      ]);

      // Salary
      const salaryRange = getTextFromSelectors([
        '#salaryInfoAndJobType span',
        '[data-testid="attribute_snippet_testid"]',
        '.jobsearch-JobMetadataHeader-item',
        '.salary-snippet',
        '.metadata.salary-snippet-container',
      ]);

      // Employment type
      const employmentType = getTextFromSelectors([
        '.jobsearch-JobMetadataHeader-item',
        '[data-testid="job-type"]',
      ]);

      if (!role && !company) {
        return null;
      }

      return {
        company: company || 'Unknown Company',
        role: role || 'Unknown Role',
        location: location || '',
        salaryRange: salaryRange || undefined,
        jobDescription: jobDescription || undefined,
        link: window.location.href,
        source: 'Indeed',
        employmentType: employmentType || undefined,
      };
    } catch (error) {
      console.error('Indeed parser error:', error);
      return null;
    }
  },
};

export default indeedParser;
