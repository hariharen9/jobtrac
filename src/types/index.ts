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
}

export interface PrepEntry {
  id: string;
  date: string;
  topic: string;
  problems: string;
  time: number;
  confidence: number;
  notes: string;
}

export interface CompanyResearch {
  id: string;
  company: string;
  whatTheyDo: string;
  values: string;
  why: string;
  questions: string;
  news: string;
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
}

export interface StarStory {
  id: string;
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

export type EditableItem = Application | PrepEntry | CompanyResearch | NetworkingContact | StarStory;

export interface NotePage {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  tags: string[];
  pinned: boolean;
}

export interface UserNotes {
  id: string;
  userId: string;
  pages: NotePage[];
  settings: {
    defaultColor: string;
    showPreview: boolean;
    fontSize: number;
    theme: 'light' | 'dark' | 'auto';
  };
}

export type TabType = 'applications' | 'prep' | 'research' | 'networking' | 'star';
