import { Timestamp } from 'firebase/firestore';

export interface Application {
  id: string;
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
  jobDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PrepEntry {
  id: string;
  date: string;
  topic: string;
  problems: string;
  time: number;
  confidence: number;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CompanyResearch {
  id: string;
  company: string;
  whatTheyDo: string;
  values: string;
  why: string;
  questions: string;
  news: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NetworkingContact {
  id: string;
  name: string;
  company: string;
  role: string;
  date: string;
  status: string;
  referral: 'Y' | 'N';
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StarStory {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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

export type EditableItem = Application | PrepEntry | CompanyResearch | NetworkingContact | StarStory;

export interface NotePage {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  color: string;
  tags: string[];
  pinned: boolean;
}

export interface UserNotes {
  id: string;
  pages: NotePage[];
  settings: {
    defaultColor: string;
    showPreview: boolean;
    fontSize: number;
    theme: 'light' | 'dark' | 'auto';
  };
}

export type TabType = 'applications' | 'prep' | 'research' | 'networking' | 'star';

export interface Goal {
  id: string;
  type: 'weekly' | 'monthly';
  applications: number;
  networking: number;
  prep: number;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component?: string;
  completed: boolean;
}

export interface QuickStartTask {
  id: string;
  title: string;
  description: string;
  actionText: string;
  completed: boolean;
  feature: TabType;
  icon: string;
}

export interface UserOnboarding {
  hasCompletedWelcome: boolean;
  hasSeenTooltips: boolean;
  completedSteps: string[];
  quickStartTasks: QuickStartTask[];
  demoMode: boolean;
  createdAt: string;
  lastActiveStep?: string;
}

export interface TooltipConfig {
  id: string;
  targetSelector: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  feature: TabType;
  priority: number;
}

export type OnboardingStatus = 'not-started' | 'in-progress' | 'completed';

// User Profile Data Collection
export interface UserProfile {
  name: string;
  ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '56+';
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  country?: string;
  profileCompleted: boolean;
  profileCompletedAt?: Timestamp;
}

// Analytics Data Structures
export interface AnalyticsOverview {
  totalUsers: number;
  lastUpdated: Timestamp;
}

export interface AnalyticsDemographics {
  gender: {
    male: number;
    female: number;
    other: number;
    preferNotToSay: number;
  };
  ageRanges: {
    '18-25': number;
    '26-35': number;
    '36-45': number;
    '46-55': number;
    '56+': number;
  };
  countries: Record<string, number>;
  lastUpdated: Timestamp;
}
