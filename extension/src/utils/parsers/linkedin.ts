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

// Helper to get attribute from multiple possible selectors
const getAttributeFromSelectors = (selectors: string[], attribute: string): string => {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.getAttribute(attribute)) {
      return el.getAttribute(attribute) || '';
    }
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
      // Job title - multiple possible selectors for different LinkedIn layouts
      const role = getTextFromSelectors([
        // Search results page selectors
        '.job-details-jobs-unified-top-card__job-title h1 a',
        '.job-details-jobs-unified-top-card__job-title h1',
        '.job-details-jobs-unified-top-card__job-title',
        '.jobs-search__job-details--container h1',
        '.jobs-search-results-list h1',
        // Collections/recommended page selectors
        '.jobs-unified-top-card__job-title',
        '.t-24.job-details-jobs-unified-top-card__job-title',
        'h1.topcard__title',
        '.jobs-details-top-card__job-title',
        'h1[class*="job-title"]',
        '.job-view-layout h1',
        // Fallback - any h1 in job details area
        '.jobs-details h1',
        '.scaffold-layout__detail h1',
      ]);

      // Company name
      const company = getTextFromSelectors([
        // Search results page selectors
        '.job-details-jobs-unified-top-card__company-name a',
        '.job-details-jobs-unified-top-card__company-name',
        '.job-details-jobs-unified-top-card__primary-description-container a',
        // Collections/recommended page selectors
        '.jobs-unified-top-card__company-name a',
        '.jobs-unified-top-card__company-name',
        '.topcard__org-name-link',
        '.jobs-details-top-card__company-url',
        'a[class*="company-name"]',
        // Fallback selectors
        '.jobs-details a[data-control-name="company_link"]',
        '.scaffold-layout__detail a[href*="/company/"]',
      ]);

      // Location
      const location = getTextFromSelectors([
        // Search results page selectors
        '.job-details-jobs-unified-top-card__primary-description-container .tvm__text',
        '.job-details-jobs-unified-top-card__primary-description-container span:nth-child(1)',
        '.job-details-jobs-unified-top-card__bullet',
        // Collections/recommended page selectors
        '.jobs-unified-top-card__bullet',
        '.topcard__flavor--bullet',
        '.jobs-details-top-card__bullet',
        'span[class*="location"]',
        // Fallback
        '.jobs-details span[class*="bullet"]',
      ]);

      // Job description
      const jobDescription = getTextFromSelectors([
        '.jobs-description__content',
        '.jobs-description-content__text',
        '.jobs-box__html-content',
        '#job-details',
        '.description__text',
        // Search results specific
        '.jobs-description',
        'article[class*="jobs-description"]',
      ]);

      // Salary (if available)
      const salaryRange = getTextFromSelectors([
        '.job-details-jobs-unified-top-card__job-insight span',
        '.compensation__salary',
        '[class*="salary"]',
        '.job-details-jobs-unified-top-card__job-insight--highlight',
      ]);

      // Employment type
      const employmentType = getTextFromSelectors([
        '.job-details-jobs-unified-top-card__job-insight--highlight span',
        '.jobs-unified-top-card__workplace-type',
        '.job-details-jobs-unified-top-card__job-insight li span',
      ]);

      // Company logo - try multiple selectors
      let companyLogo = '';
      const logoSelectors = [
        '.job-details-jobs-unified-top-card__company-logo img',
        '.jobs-unified-top-card__company-logo img',
        '.scaffold-layout__detail img[class*="company-logo"]',
        '.jobs-details img[class*="logo"]',
      ];
      for (const selector of logoSelectors) {
        const logoEl = document.querySelector(selector) as HTMLImageElement;
        if (logoEl?.src) {
          companyLogo = logoEl.src;
          break;
        }
      }

      if (!role && !company) {
        return null;
      }

      // Clean URL logic
      let cleanLink = window.location.href;

      try {
        const urlObj = new URL(window.location.href);
        const currentJobId = urlObj.searchParams.get('currentJobId');

        if (currentJobId) {
          // Priority 1: Get ID from URL query param
          cleanLink = `https://www.linkedin.com/jobs/view/${currentJobId}/`;
        } else {
          // Priority 2: Try to find canonical link in DOM
          const domLink = getAttributeFromSelectors([
            '.job-details-jobs-unified-top-card__job-title h1 a',
            '.jobs-unified-top-card__job-title a',
            'h1.topcard__title a',
            '.jobs-details-top-card__job-title a',
            'a.app-aware-link[href*="/jobs/view/"]'
          ], 'href');

          if (domLink) {
            // Handle relative URLs
            const fullLink = domLink.startsWith('http') ? domLink : `https://www.linkedin.com${domLink}`;
            const domUrlObj = new URL(fullLink);

            // Extract ID from pathname: /jobs/view/123456/
            const match = domUrlObj.pathname.match(/\/jobs\/view\/(\d+)/);
            if (match && match[1]) {
              cleanLink = `https://www.linkedin.com/jobs/view/${match[1]}/`;
            } else {
              // Just clean the params
              cleanLink = `${domUrlObj.origin}${domUrlObj.pathname}`;
            }
          } else if (urlObj.pathname.includes('/jobs/view/')) {
             // Priority 3: Clean current URL if it is a view page
             cleanLink = `${urlObj.origin}${urlObj.pathname}`;
          }
        }
      } catch (e) {
        // Keep original URL if parsing fails
        console.error('Error cleaning LinkedIn URL:', e);
      }

      return {
        company: company || 'Unknown Company',
        role: role || 'Unknown Role',
        location: location || '',
        salaryRange: salaryRange || undefined,
        jobDescription: jobDescription || undefined,
        link: cleanLink,
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
