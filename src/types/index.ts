export interface Application {
  id: number;
  company: string;
  role: string;
  link: string;
  date: string;
  status: ApplicationStatus;
  nextStep: string;
  recruiter: string;
  referral: 'Y' | 'N';
  location: string;
  notes: string;
}

export interface PrepEntry {
  id: number;
  date: string;
  topic: string;
  problems: string;
  time: number;
  confidence: number;
  notes: string;
}

export interface CompanyResearch {
  id: number;
  company: string;
  whatTheyDo: string;
  values: string;
  why: string;
  questions: string;
  news: string;
}

export interface NetworkingContact {
  id: number;
  name: string;
  company: string;
  role: string;
  date: string;
  status: string;
  referral: 'Y' | 'N';
  notes: string;
}

export interface StarStory {
  id: number;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export type ApplicationStatus = 
  | 'To Apply'
  | 'Applied'
  | 'HR Screen'
  | 'Tech Screen'
  | 'Round 1'
  | 'Manager Round'
  | 'Final Round'
  | 'Offer'
  | 'Rejected'
  | 'Ghosted';

export type TabType = 'applications' | 'prep' | 'research' | 'networking' | 'star';