// Glassdoor Jobs Parser
// Extracts job data from Glassdoor job posting pages

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

export const glassdoorParser: JobParser = {
  name: 'Glassdoor',

  matches: (url: string): boolean => {
    return url.includes('glassdoor.com') || url.includes('glassdoor.co.in');
  },

  extract: (): ExtractedJobData | null => {
    try {
      // Job title
      const role = getTextFromSelectors([
        '[data-test="jobTitle"]',
        '.JobDetails_jobTitle__Rg_NM',
        '.e1tk4kwz4',
        'h1.heading_Heading__BqX5J',
        '.job-title',
        '.css-1vg6q84.e1tk4kwz4',
      ]);

      // Company name
      const company = getTextFromSelectors([
        '[data-test="employerName"]',
        '.JobDetails_companyName__N0Rnu',
        '.e1tk4kwz1',
        '.EmployerProfile_employerName__fveld',
        '.css-16nw49e.e1tk4kwz1',
      ]);

      // Location
      const location = getTextFromSelectors([
        '[data-test="location"]',
        '.JobDetails_location__mSg5h',
        '.e1tk4kwz2',
        '.css-1buaf54.e1tk4kwz2',
        '.location',
      ]);

      // Job description
      const jobDescription = getTextFromSelectors([
        '.JobDetails_jobDescription__uW_fK',
        '[data-test="jobDescription"]',
        '.jobDescriptionContent',
        '.desc',
        '.css-1tru6t8',
      ]);

      // Salary
      const salaryRange = getTextFromSelectors([
        '[data-test="detailSalary"]',
        '.SalaryEstimate_salaryEstimate__arV5J',
        '.css-1bluz6i',
        '.salary',
      ]);

      // Company logo
      const logoEl = document.querySelector('[data-test="employer-logo"] img, .EmployerLogo_logo__xKyyI img') as HTMLImageElement;
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
        source: 'Glassdoor',
        companyLogo: companyLogo || undefined,
      };
    } catch (error) {
      console.error('Glassdoor parser error:', error);
      return null;
    }
  },
};

export default glassdoorParser;
