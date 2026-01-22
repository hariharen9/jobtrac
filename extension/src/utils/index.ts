// Parser Index
// Exports all parsers and provides a unified extraction function

import { ExtractedJobData, JobParser } from '../types';
import { linkedinParser } from './parsers/linkedin';
import { indeedParser } from './parsers/indeed';
import { glassdoorParser } from './parsers/glassdoor';
import { naukriParser } from './parsers/naukri';
import { genericParser } from './parsers/generic';

// Order matters - specific parsers first, generic last
export const parsers: JobParser[] = [
  linkedinParser,
  indeedParser,
  glassdoorParser,
  naukriParser,
  genericParser, // Fallback
];

/**
 * Extract job data from the current page
 * Tries each parser in order until one succeeds
 */
export const extractJobData = (): ExtractedJobData | null => {
  const url = window.location.href;

  for (const parser of parsers) {
    if (parser.matches(url)) {
      const data = parser.extract();
      if (data) {
        console.log(`[JobTrac] Extracted with ${parser.name} parser:`, data);
        return data;
      }
    }
  }

  console.log('[JobTrac] No parser could extract job data');
  return null;
};

/**
 * Detect which job site we're on
 */
export const detectJobSite = (url: string): string => {
  for (const parser of parsers) {
    if (parser.matches(url)) {
      return parser.name;
    }
  }
  return 'Unknown';
};

export { linkedinParser, indeedParser, glassdoorParser, naukriParser, genericParser };
