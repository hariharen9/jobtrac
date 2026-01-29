import { ExtractedJobData } from '../../types';

export const getText = (selector: string): string => {
  const el = document.querySelector(selector);
  return el?.textContent?.trim() || '';
};

export const getTextFromSelectors = (selectors: string[]): string => {
  for (const selector of selectors) {
    const text = getText(selector);
    if (text) return text;
  }
  return '';
};

/**
 * Try to extract data from JSON-LD structured data (application/ld+json)
 */
export const extractFromJsonLd = (): Partial<ExtractedJobData> | null => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');

  for (const script of scripts) {
    try {
      const content = script.textContent || '';
      if (!content.includes('JobPosting')) continue;
      
      const data = JSON.parse(content);

      // Handle both single object and array of objects
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        // Some sites wrap it in @graph
        const objects = item['@graph'] && Array.isArray(item['@graph']) 
          ? item['@graph'] 
          : [item];

        for (const obj of objects) {
          if (obj['@type'] === 'JobPosting') {
            return {
              role: obj.title || '',
              company: obj.hiringOrganization?.name || 
                      (typeof obj.hiringOrganization === 'string' ? obj.hiringOrganization : ''),
              location: obj.jobLocation?.address?.addressLocality ||
                       obj.jobLocation?.name || 
                       (typeof obj.jobLocation === 'string' ? obj.jobLocation : ''),
              jobDescription: obj.description || '',
              salaryRange: obj.baseSalary?.value?.value
                ? `${obj.baseSalary.currency || ''} ${obj.baseSalary.value.value}`
                : undefined,
              employmentType: obj.employmentType || undefined,
            };
          }
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  return null;
};
