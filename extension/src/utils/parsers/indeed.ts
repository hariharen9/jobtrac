// Indeed Jobs Parser
// Extracts job data from Indeed job posting pages

import { ExtractedJobData, JobParser } from '../../types';
import { getTextFromSelectors, extractFromJsonLd } from './helpers';

export const indeedParser: JobParser = {
  name: 'Indeed',

  matches: (url: string): boolean => {
    return url.includes('indeed.com');
  },

  extract: (): ExtractedJobData | null => {
    try {
      // Try JSON-LD first as Indeed usually provides it
      const jsonLdData = extractFromJsonLd();

      // Job title
      const role = jsonLdData?.role || getTextFromSelectors([
        '.jobsearch-JobInfoHeader-title',
        'h1[data-testid="jobsearch-JobInfoHeader-title"]',
        '.icl-u-xs-mb--xs.icl-u-xs-mt--none.jobsearch-JobInfoHeader-title',
        'h1.jobTitle',
        '[data-testid="job-title"]',
        '.jcs-JobTitle',
        '.jobsearch-JobInfoHeader-title-container h1',
      ]);

      // Company name
      const company = jsonLdData?.company || getTextFromSelectors([
        '[data-testid="inlineHeader-companyName"] a',
        '[data-testid="inlineHeader-companyName"]',
        '.jobsearch-InlineCompanyRating-companyHeader a',
        '.jobsearch-InlineCompanyRating-companyHeader',
        '[data-company-name="true"]',
        '.icl-u-lg-mr--sm.icl-u-xs-mr--xs',
        '.jobsearch-CompanyReview--heading',
        '.jobsearch-JobInfoHeader-companyName',
      ]);

      // Location
      const location = jsonLdData?.location || getTextFromSelectors([
        '[data-testid="inlineHeader-companyLocation"]',
        '[data-testid="job-location"]',
        '.jobsearch-JobInfoHeader-subtitle > div:last-child',
        '.icl-u-xs-mt--xs.jobsearch-JobInfoHeader-subtitle',
        '.jobsearch-JobInfoHeader-companyLocation',
        '.jobsearch-DesktopStickyContainer-subtitle .jobsearch-JobInfoHeader-subtitle > div:nth-child(2)',
      ]);

      // Job description
      const jobDescription = jsonLdData?.jobDescription || getTextFromSelectors([
        '#jobDescriptionText',
        '.jobsearch-jobDescriptionText',
        '[data-testid="jobDescriptionText"]',
        '.jobDescription',
      ]);

      // Salary
      const salaryRange = jsonLdData?.salaryRange || getTextFromSelectors([
        '#salaryInfoAndJobType span',
        '[data-testid="attribute_snippet_testid"]',
        '.jobsearch-JobMetadataHeader-item',
        '.salary-snippet',
        '.metadata.salary-snippet-container',
        '.jobsearch-JobMetadataHeader-item:contains("$")',
      ]);

      // Employment type
      const employmentType = jsonLdData?.employmentType || getTextFromSelectors([
        '.jobsearch-JobMetadataHeader-item',
        '[data-testid="job-type"]',
        '.jobsearch-JobMetadataHeader-item:last-child',
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
