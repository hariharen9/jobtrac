import { Timestamp } from 'firebase/firestore';
import { Application, PrepEntry, CompanyResearch, NetworkingContact, StarStory, Subject, UserOnboarding, QuickStartTask, TooltipConfig } from '../types';

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Data Structures',
    description: 'Practice problems related to data structures.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'System Design',
    description: 'Concepts and case studies for system design interviews.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Behavioral Prep',
    description: 'Preparing for behavioral interview questions.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const enhancedSamplePrepEntries: PrepEntry[] = [
  {
    id: '1',
    date: '2025-09-22',
    resources: [
      { title: 'NeetCode video on Arrays', url: 'https://www.youtube.com/watch?v=1', completed: true },
    ],
    time: 2,
    confidence: 4,
    notes: 'Practiced two-pointer techniques. Feeling more confident.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '1',
    srsStage: 2,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
  },
  {
    id: '2',
    date: '2025-09-23',
    resources: [
      { title: 'Grokking the System Design Interview', url: 'https://www.educative.io/courses/grokking-the-system-design-interview', completed: false },
    ],
    time: 1.5,
    confidence: 3,
    notes: 'Read the first two chapters. Need to review the concepts.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '2',
    srsStage: 1,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  },
  {
    id: '3',
    date: '2025-09-24',
    resources: [],
    time: 1,
    confidence: 2,
    notes: 'Mock interview for behavioral questions. Need to be more concise.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '3',
    srsStage: 0,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  },
];

export const enhancedSampleApplications: Application[] = [
    {
        id: '1',
        company: 'Netflix',
        role: 'Software Engineer',
        link: 'https://careers.netflix.com/',
        date: '2025-09-20',
        status: 'Applied',
        source: 'Company Website',
        recruiter: 'Jane Doe',
        referral: 'N',
        location: 'Mountain View, CA',
        notes: 'Applied through the company website.',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: '2',
        company: 'Facebook',
        role: 'Frontend Engineer',
        link: 'https://www.facebook.com/careers/',
        date: '2025-09-18',
        status: 'HR Screen',
        source: 'LinkedIn',
        recruiter: 'John Doe',
        referral: 'N',
        location: 'Menlo Park, CA',
        notes: 'Passed the initial phone screen.',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: '3',
        company: 'Amazon',
        role: 'Backend Engineer',
        link: 'https://www.amazon.jobs/',
        date: '2025-09-15',
        status: 'Round 2',
        source: 'Indeed',
        recruiter: 'Mary Jane',
        referral: 'Y',
        location: 'Seattle, WA',
        notes: 'Failed the technical screen.',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: '4',
        company: 'Microsoft',
        role: 'Data Scientist',
        link: 'https://careers.microsoft.com/',
        date: '2025-09-12',
        status: 'Final Round',
        source: 'LinkedIn',
        recruiter: 'Susan Smith',
        referral: 'N',
        location: 'Redmond, WA',
        notes: 'Did not pass the interview.',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: '5',
        company: 'Apple',
        role: 'iOS Developer',
        link: 'https://www.apple.com/careers/',
        date: '2025-09-10',
        status: 'Offer',
        source: 'LinkedIn',
        recruiter: 'Jimmy Smith',
        referral: 'N',
        location: 'Cupertino, CA',
        notes: 'Accepted the offer.',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    }
];

export const initialCompanyResearch: CompanyResearch[] = [
    {
        id: '1',
        company: 'Google',
        whatTheyDo: 'Search engine, cloud computing, advertising technologies',
        values: 'Focus on the user and all else will follow.',
        why: 'I want to work on products that impact billions of users.',
        questions: 'What are the biggest challenges for Google in the next 5 years?',
        news: 'Google announced a new AI model.',
        date: '2025-09-19',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: '2',
        company: 'Facebook',
        whatTheyDo: 'Social media and advertising platform.',
        values: 'Move fast and break things.',
        why: 'Interested in their work on React and open source.',
        questions: 'How does Facebook handle content moderation at scale?',
        news: 'Facebook is investing heavily in the metaverse.',
        date: '2025-09-17',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    }
];

export const initialNetworkingContacts: NetworkingContact[] = [
    {
        id: '1',
        name: 'John Smith',
        company: 'Google',
        role: 'Software Engineer',
        date: '2025-09-18',
        status: 'Connected',
        referral: 'N',
        notes: 'Met at a tech conference.',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: '2',
        name: 'Jane Doe',
        company: 'Facebook',
        role: 'Engineering Manager',
        date: '2025-09-16',
        status: 'Contacted',
        referral: 'N',
        notes: 'Sent a connection request on LinkedIn.',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    }
];

export const enhancedSampleStarStories: StarStory[] = [
    {
        id: '1',
        title: 'Led a project to improve API performance',
        situation: 'The main API was slow, causing a poor user experience.',
        task: 'I was tasked with improving the API response time by 50%.',
        action: 'I identified the bottleneck in the database query and optimized it by adding an index.',
        result: 'The API response time improved by 75%, exceeding the goal.',
        date: '2025-09-17',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: '2',
        title: 'Resolved a critical production bug',
        situation: 'A critical bug was causing the application to crash for 5% of users.',
        task: 'I was assigned to find and fix the bug as quickly as possible.',
        action: 'I used logs and debugging tools to trace the error to a race condition and implemented a fix.',
        result: 'The bug was resolved within 2 hours, and the crash rate dropped to zero.',
        date: '2025-09-14',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    }
];

export const defaultQuickStartTasks: QuickStartTask[] = [
  { id: 'add-application', title: 'Add your first application', description: 'Track a job you\'ve applied for.', actionText: 'Add Application', completed: false, feature: 'applications', icon: 'FileText' },
  { id: 'add-prep-entry', title: 'Log a study session', description: 'Keep a record of your interview prep.', actionText: 'Log Prep', completed: false, feature: 'prep', icon: 'BookOpen' },
  { id: 'add-star-story', title: 'Create a STAR story', description: 'Prepare for behavioral interviews.', actionText: 'Add Story', completed: false, feature: 'star', icon: 'Star' },
  { id: 'add-contact', title: 'Add a networking contact', description: 'Manage your professional network.', actionText: 'Add Contact', completed: false, feature: 'networking', icon: 'Users' },
];

export const defaultOnboarding: UserOnboarding = {
  hasCompletedWelcome: false,
  hasSeenTooltips: false,
  completedSteps: [],
  quickStartTasks: defaultQuickStartTasks,
  demoMode: false,
  createdAt: new Date().toISOString(),
};

export const tooltipConfigs: TooltipConfig[] = [];
