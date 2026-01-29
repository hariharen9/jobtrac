// Generic Job Parser
// Fallback parser for company career pages and other job sites
// Uses common patterns and structured data (JSON-LD)

import { ExtractedJobData, JobParser, ApplicationSource } from '../../types';

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

// Try to extract data from JSON-LD structured data
const extractFromJsonLd = (): Partial<ExtractedJobData> | null => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');

  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent || '');

      // Handle both single object and array of objects
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        if (item['@type'] === 'JobPosting') {
          return {
            role: item.title || '',
            company: item.hiringOrganization?.name || '',
            location: item.jobLocation?.address?.addressLocality ||
                     item.jobLocation?.name || '',
            jobDescription: item.description || '',
            salaryRange: item.baseSalary?.value?.value
              ? `${item.baseSalary.currency || ''} ${item.baseSalary.value.value}`
              : undefined,
            employmentType: item.employmentType || undefined,
            // companyLogo removed to let CompanyIcon component handle it
          };
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  return null;
};

// Heuristic to detect source based on domain
const detectSourceFromUrl = (url: string): ApplicationSource => {
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('indeed.com')) return 'Indeed';
  if (url.includes('glassdoor.com')) return 'Glassdoor';
  if (url.includes('naukri.com')) return 'Naukri';
  if (url.includes('greenhouse.io')) return 'Company Website'; // Common ATS
  if (url.includes('lever.co')) return 'Company Website'; // Common ATS
  if (url.includes('workday')) return 'Company Website'; // Common ATS

  return 'Company Website';
};

export const genericParser: JobParser = {
  name: 'Company Website',

  matches: (): boolean => {
    // Generic parser always matches as fallback
    return true;
  },

  extract: (): ExtractedJobData | null => {
    try {
      // First try JSON-LD structured data
      const jsonLdData = extractFromJsonLd();

      // Common selectors for job postings
      const role = jsonLdData?.role || getTextFromSelectors([
        'h1[class*="title"]',
        'h1[class*="job"]',
        '.job-title',
        '.jobTitle',
        '.position-title',
        '.posting-title',
        'h1',
      ]);

      const company = jsonLdData?.company || getTextFromSelectors([
        '[class*="company-name"]',
        '[class*="companyName"]',
        '[class*="employer"]',
        '.company',
        '.organization',
        // Fallback: try meta tags
      ]) || document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '';

      const location = jsonLdData?.location || getTextFromSelectors([
        '[class*="location"]',
        '.job-location',
        '.jobLocation',
        '.address',
        '[class*="city"]',
      ]);

      const jobDescription = jsonLdData?.jobDescription || getTextFromSelectors([
        '[class*="description"]',
        '[class*="job-details"]',
        '.job-content',
        '.posting-description',
        'article',
      ]);

      const salaryRange = jsonLdData?.salaryRange || getTextFromSelectors([
        '[class*="salary"]',
        '[class*="compensation"]',
        '[class*="pay"]',
        '.salary-range',
      ]);

      // Detect Source
      const source = detectSourceFromUrl(window.location.href);

      if (!role && !company) {
        // Try to get at least the page title but clean it
        const pageTitle = document.title;
        if (pageTitle) {
          // Heuristic: "Senior Engineer at Google - Careers" -> Role: Senior Engineer, Company: Google
          const separators = [' at ', ' | ', ' - ', ' – '];
          let inferredRole = pageTitle;
          let inferredCompany = '';

          for (const sep of separators) {
            if (pageTitle.includes(sep)) {
              const parts = pageTitle.split(sep);
              // Assume first part is role, second part is company
              if (parts.length >= 2) {
                inferredRole = parts[0].trim();
                // Take the last part as company often works for "Role | Company"
                // But for "Role at Company - Careers" it might need more logic
                // Keep it simple for now
                inferredCompany = parts[1].trim();
              }
              break;
            }
          }

          return {
            company: inferredCompany,
            role: inferredRole,
            location: '',
            jobDescription: '',
            link: window.location.href,
            source: source,
            // No companyLogo
          };
        }
        return null;
      }

      return {
        company: company || 'Unknown Company',
        role: role || 'Unknown Role',
        location: location || '',
        salaryRange: salaryRange || undefined,
        jobDescription: jobDescription || undefined,
        link: window.location.href,
        source: source,
        employmentType: jsonLdData?.employmentType,
        // No companyLogo - let CompanyIcon handle it
      };
    } catch (error) {
      console.error('Generic parser error:', error);
      return null;
    }
  },
};

export default genericParser;
