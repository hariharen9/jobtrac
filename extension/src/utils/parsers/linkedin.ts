// LinkedIn Jobs Parser
// Extracts job data from LinkedIn job posting pages

import { ExtractedJobData, JobParser } from '../../types';

// Helper to safely get text content
const getText = (selector: string): string => {
  const el = document.querySelector(selector);
  return el?.textContent?.trim() || '';
};

// Helper to get text from multiple possible selectors
const getTextFromSelectors = (selectors: string[]): string => {
  for (const selector of selectors) {
    const text = getText(selector);
    if (text) return text;
  }
  return '';
};

export const linkedinParser: JobParser = {
  name: 'LinkedIn',

  matches: (url: string): boolean => {
    return url.includes('linkedin.com/jobs');
  },

  extract: (): ExtractedJobData | null => {
    try {
      // Job title - multiple possible selectors
      const role = getTextFromSelectors([
        '.job-details-jobs-unified-top-card__job-title h1',
        '.jobs-unified-top-card__job-title',
        '.t-24.job-details-jobs-unified-top-card__job-title',
        'h1.topcard__title',
        '.jobs-details-top-card__job-title',
        'h1[class*="job-title"]',
        '.job-view-layout h1',
      ]);

      // Company name
      const company = getTextFromSelectors([
        '.job-details-jobs-unified-top-card__company-name a',
        '.job-details-jobs-unified-top-card__company-name',
        '.jobs-unified-top-card__company-name a',
        '.jobs-unified-top-card__company-name',
        '.topcard__org-name-link',
        '.jobs-details-top-card__company-url',
        'a[class*="company-name"]',
      ]);

      // Location
      const location = getTextFromSelectors([
        '.job-details-jobs-unified-top-card__primary-description-container .tvm__text',
        '.jobs-unified-top-card__bullet',
        '.topcard__flavor--bullet',
        '.jobs-details-top-card__bullet',
        'span[class*="location"]',
      ]);

      // Job description
      const jobDescription = getTextFromSelectors([
        '.jobs-description__content',
        '.jobs-description-content__text',
        '.jobs-box__html-content',
        '#job-details',
        '.description__text',
      ]);

      // Salary (if available)
      const salaryRange = getTextFromSelectors([
        '.job-details-jobs-unified-top-card__job-insight span',
        '.compensation__salary',
        '[class*="salary"]',
      ]);

      // Employment type
      const employmentType = getTextFromSelectors([
        '.job-details-jobs-unified-top-card__job-insight--highlight span',
        '.jobs-unified-top-card__workplace-type',
      ]);

      // Company logo
      const logoEl = document.querySelector('.job-details-jobs-unified-top-card__company-logo img') as HTMLImageElement;
      const companyLogo = logoEl?.src || '';

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
        source: 'LinkedIn',
        employmentType: employmentType || undefined,
        companyLogo: companyLogo || undefined,
      };
    } catch (error) {
      console.error('LinkedIn parser error:', error);
      return null;
    }
  },
};

export default linkedinParser;
