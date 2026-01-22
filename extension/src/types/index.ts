// Types for JobTrac Extension
// Aligned with main app's Application interface

export type ApplicationSource =
  | 'LinkedIn'
  | 'Indeed'
  | 'Glassdoor'
  | 'Naukri'
  | 'Company Website'
  | 'Referral'
  | 'Other';

export type ApplicationStatus =
  | 'To Apply'
  | 'Applied'
  | 'HR Screen'
  | 'Tech Screen'
  | 'Round 1'
  | 'Round 2'
  | 'Manager Round'
  | 'Final Round'
  | 'Offer'
  | 'Rejected'
  | 'Ghosted';

export type Priority = 'High' | 'Medium' | 'Low';

// Data extracted from job posting pages
export interface ExtractedJobData {
  company: string;
  role: string;
  location: string;
  salaryRange?: string;
  jobDescription?: string;
  link: string;
  source: ApplicationSource;
  // Additional metadata
  postedDate?: string;
  employmentType?: string; // Full-time, Part-time, Contract, etc.
  experienceLevel?: string;
  companyLogo?: string;
}

// Application data ready to save to Firestore
export interface ApplicationPayload {
  company: string;
  role: string;
  link: string;
  date: string; // Application date (today)
  status: ApplicationStatus;
  source: ApplicationSource;
  sourceOther?: string;
  recruiter: string;
  referral: 'Y' | 'N';
  location: string;
  notes: string;
  jobDescription?: string;
  salaryRange?: string;
  priority?: Priority;
}

// Message types for extension communication
export type MessageType =
  | 'EXTRACT_JOB_DATA'
  | 'JOB_DATA_EXTRACTED'
  | 'SAVE_APPLICATION'
  | 'APPLICATION_SAVED'
  | 'GET_AUTH_STATUS'
  | 'AUTH_STATUS';

export interface ExtensionMessage {
  type: MessageType;
  payload?: unknown;
}

export interface ExtractJobDataMessage extends ExtensionMessage {
  type: 'EXTRACT_JOB_DATA';
}

export interface JobDataExtractedMessage extends ExtensionMessage {
  type: 'JOB_DATA_EXTRACTED';
  payload: ExtractedJobData | null;
}

export interface SaveApplicationMessage extends ExtensionMessage {
  type: 'SAVE_APPLICATION';
  payload: ApplicationPayload;
}

export interface AuthStatusMessage extends ExtensionMessage {
  type: 'AUTH_STATUS';
  payload: {
    isAuthenticated: boolean;
    userId?: string;
    email?: string;
  };
}

// Parser interface for site-specific extractors
export interface JobParser {
  name: ApplicationSource;
  matches: (url: string) => boolean;
  extract: () => ExtractedJobData | null;
}

// Storage types
export interface StoredSettings {
  defaultStatus: ApplicationStatus;
  defaultPriority: Priority;
  autoFillDate: boolean;
  jobtracUrl: string;
}

export const DEFAULT_SETTINGS: StoredSettings = {
  defaultStatus: 'To Apply',
  defaultPriority: 'Medium',
  autoFillDate: true,
  // Use localhost for development, production URL for release
  jobtracUrl: 'http://localhost:5173',  // Change to 'https://jobtrac.site' for production
};
