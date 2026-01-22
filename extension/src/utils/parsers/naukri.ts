// Naukri Jobs Parser
// Extracts job data from Naukri.com job posting pages

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

export const naukriParser: JobParser = {
  name: 'Naukri',

  matches: (url: string): boolean => {
    return url.includes('naukri.com');
  },

  extract: (): ExtractedJobData | null => {
    try {
      // Job title
      const role = getTextFromSelectors([
        '.jd-header-title',
        'h1.styles_jd-header-title__rZwM1',
        '.styles_jhc__job-title__6dXzO',
        '.title',
        'h1[class*="header-title"]',
      ]);

      // Company name
      const company = getTextFromSelectors([
        '.jd-header-comp-name a',
        '.styles_jd-header-comp-name__MvqAI a',
        '.styles_jd-header-comp-name__MvqAI',
        '.jd-header-comp-name',
        'a[class*="comp-name"]',
        '.company-name',
      ]);

      // Location
      const location = getTextFromSelectors([
        '.jd-header-comp-loc .location',
        '.styles_jhc__loc___Du2H',
        '.locWdth',
        '.loc',
        '[class*="location"]',
      ]);

      // Job description
      const jobDescription = getTextFromSelectors([
        '.styles_JDC__dang-inner-html__h0K4t',
        '.job-desc',
        '.dang-inner-html',
        '.JDdesc',
        '#job-details',
      ]);

      // Salary
      const salaryRange = getTextFromSelectors([
        '.styles_jhc__salary__jdfEC',
        '.salary',
        '.salaryText',
        '[class*="salary"]',
      ]);

      // Experience
      const experienceLevel = getTextFromSelectors([
        '.styles_jhc__exp__k_giM',
        '.experience',
        '.expwdth',
        '[class*="experience"]',
      ]);

      // Company logo
      const logoEl = document.querySelector('.styles_jhc__comp-logo__N3k0C img, .jd-header-comp-logo img') as HTMLImageElement;
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
        source: 'Naukri',
        experienceLevel: experienceLevel || undefined,
        companyLogo: companyLogo || undefined,
      };
    } catch (error) {
      console.error('Naukri parser error:', error);
      return null;
    }
  },
};

export default naukriParser;
