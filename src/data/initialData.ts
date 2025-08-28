import { Application, PrepEntry, CompanyResearch, NetworkingContact, StarStory, QuickStartTask, TooltipConfig, UserOnboarding, OnboardingStep } from '../types';

export const initialApplications: Application[] = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineer, Cloud',
    link: '#',
    date: '2025-09-22',
    status: 'To Apply',
    nextStep: 'Apply via referral',
    recruiter: '',
    referral: 'Y',
    location: 'Bangalore',
    notes: 'Target team: GKE Networking.'
  },
  {
    id: '2',
    company: 'Microsoft',
    role: 'SDE 2, Azure',
    link: '#',
    date: '2025-09-22',
    status: 'HR Screen',
    nextStep: 'Tech Screen on 28-Sep',
    recruiter: 'recruiter@ms.com',
    referral: 'N',
    location: 'Hyderabad',
    notes: 'Discussed 17LPA expectation.'
  },
  {
    id: '3',
    company: 'Atlassian',
    role: 'Backend Engineer',
    link: '#',
    date: '2025-09-23',
    status: 'Rejected',
    nextStep: '',
    recruiter: '',
    referral: 'N',
    location: 'Bangalore',
    notes: 'Auto-rejection email.'
  }
];

export const initialPrepEntries: PrepEntry[] = [
  {
    id: '1',
    date: '2025-07-21',
    topic: 'DSA: Arrays & Hashing',
    problems: 'https://leetcode.com/problems/two-sum/',
    time: 2,
    confidence: 3,
    notes: 'Two-pointer technique is very useful for sorted arrays.'
  },
  {
    id: '2',
    date: '2025-07-22',
    topic: 'System Design: Core Concepts',
    problems: '',
    time: 1,
    confidence: 2,
    notes: 'Watched video on Load Balancers. Learned about Round Robin vs. Least Connections.'
  }
];

export const initialCompanyResearch: CompanyResearch[] = [
  {
    id: '1',
    company: 'Oracle',
    whatTheyDo: 'Cloud Infrastructure (OCI), direct competitor to IBM Cloud.',
    values: 'Customer success, innovation.',
    why: 'Strong GoLang usage, direct relevance to my network overlay experience.',
    questions: 'What are the biggest scaling challenges for the OCI networking team right now?',
    news: 'OCI announced new AI-focused data centers.'
  }
];

export const initialNetworkingContacts: NetworkingContact[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Google',
    role: 'SDE 3',
    date: '2025-09-20',
    status: 'Messaged on LinkedIn',
    referral: 'Y',
    notes: 'Sent connection request with a personalized note about my interest in GKE.'
  }
];

export const initialStarStories: StarStory[] = [
  {
    id: '1',
    title: 'K8s Test Automation',
    situation: 'Manual testing for K8s deployments was slow, error-prone, and inconsistent across multiple teams.',
    task: 'My task was to create a unified solution to automate the entire resource management and testing process.',
    action: 'I led the development of a Python-based automation framework that handled resource creation, test execution, and cleanup. I documented the tool and onboarded other teams to use it.',
    result: 'This reduced testing times by a massive 90% and eliminated manual configuration errors, significantly improving developer productivity and release velocity.'
  },
  {
    id: '2',
    title: 'Orphaned Object Cleanup',
    situation: 'Legacy cleanup scripts were unreliable and frequently failed, leaving orphaned network resources in our production and staging cloud environments, causing resource leakage.',
    task: 'I needed to build a robust, native solution to handle the resource lifecycle automatically and reliably.',
    action: 'I designed and developed a garbage collection system from scratch using GoLang, implementing the controller/operator pattern. This controller watched for specific resources and ensured their entire lifecycle was managed correctly.',
    result: 'This new system completely eliminated all orphaned objects, ensuring 100% resource compliance and improving the high availability and stability of our core infrastructure.'
  }
];

// Onboarding Configuration
export const defaultQuickStartTasks: QuickStartTask[] = [
  {
    id: 'add-first-application',
    title: 'Add Your First Job Application',
    description: 'Track your first job application to see how the tracker works',
    actionText: 'Add Application',
    completed: false,
    feature: 'applications',
    icon: 'Briefcase'
  },
  {
    id: 'set-weekly-goal',
    title: 'Set Your Weekly Goals',
    description: 'Define targets for applications, networking, and prep to stay on track',
    actionText: 'Set Goals',
    completed: false,
    feature: 'applications',
    icon: 'Target'
  },
  {
    id: 'add-prep-session',
    title: 'Log Your First Prep Session',
    description: 'Track interview preparation to build confidence over time',
    actionText: 'Log Prep',
    completed: false,
    feature: 'prep',
    icon: 'BookOpen'
  },
  {
    id: 'create-star-story',
    title: 'Write a STAR Story',
    description: 'Prepare behavioral interview answers using the proven STAR method',
    actionText: 'Write Story',
    completed: false,
    feature: 'star',
    icon: 'Star'
  },
  {
    id: 'add-company-research',
    title: 'Research a Target Company',
    description: 'Store insights about companies you want to work for',
    actionText: 'Add Research',
    completed: false,
    feature: 'research',
    icon: 'Building'
  },
  {
    id: 'add-networking-contact',
    title: 'Add a Networking Contact',
    description: 'Track professional connections and referral opportunities',
    actionText: 'Add Contact',
    completed: false,
    feature: 'networking',
    icon: 'Users'
  }
];

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to JobTrac',
    description: 'Your complete job search command center',
    component: 'WelcomeStep',
    completed: false
  },
  {
    id: 'overview',
    title: 'Feature Overview',
    description: 'Discover what JobTrac can do for you',
    component: 'OverviewStep',
    completed: false
  },
  {
    id: 'demo-data',
    title: 'Try It Out',
    description: 'Explore with sample data or start fresh',
    component: 'DemoDataStep',
    completed: false
  },
  {
    id: 'quick-start',
    title: 'Quick Start',
    description: 'Complete these tasks to get the most value',
    component: 'QuickStartStep',
    completed: false
  }
];

export const tooltipConfigs: TooltipConfig[] = [
  {
    id: 'kanban-board',
    targetSelector: '[data-tooltip="kanban-board"]',
    title: 'Kanban Board',
    content: 'Drag applications between columns to track your progress visually',
    placement: 'bottom',
    feature: 'applications',
    priority: 1
  },
  {
    id: 'add-application',
    targetSelector: '[data-tooltip="add-application"]',
    title: 'Add New Application',
    content: 'Click here to add a new job application and start tracking your progress',
    placement: 'bottom',
    feature: 'applications',
    priority: 2
  },
  {
    id: 'confidence-meter',
    targetSelector: '[data-tooltip="confidence-meter"]',
    title: 'Confidence Tracking',
    content: 'Rate your confidence level after each prep session to track improvement',
    placement: 'top',
    feature: 'prep',
    priority: 3
  },
  {
    id: 'star-method',
    targetSelector: '[data-tooltip="star-method"]',
    title: 'STAR Method',
    content: 'Structure your behavioral interview answers: Situation, Task, Action, Result',
    placement: 'right',
    feature: 'star',
    priority: 4
  },
  {
    id: 'analytics-dashboard',
    targetSelector: '[data-tooltip="analytics-dashboard"]',
    title: 'Progress Analytics',
    content: 'Visualize your job search progress and identify improvement opportunities',
    placement: 'top',
    feature: 'applications',
    priority: 5
  }
];

export const defaultOnboarding: UserOnboarding = {
  hasCompletedWelcome: false,
  hasSeenTooltips: false,
  completedSteps: [],
  quickStartTasks: defaultQuickStartTasks,
  demoMode: false,
  createdAt: new Date().toISOString()
};

// Enhanced sample data with more realistic examples
export const enhancedSampleApplications: Application[] = [
  {
    id: 'sample-1',
    company: 'Google',
    role: 'Senior Software Engineer',
    link: 'https://careers.google.com/jobs/123',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week ago
    status: 'Tech Screen',
    nextStep: 'System Design Interview - Friday 2PM',
    recruiter: 'sarah.chen@google.com',
    referral: 'Y',
    location: 'Mountain View, CA',
    notes: 'Referral from John (ex-colleague). Discussed distributed systems experience.',
    jobDescription: 'We are looking for a Senior Software Engineer to join our Cloud Infrastructure team...'
  },
  {
    id: 'sample-2',
    company: 'Microsoft',
    role: 'Principal SDE - Azure',
    link: 'https://careers.microsoft.com/us/en/job/456',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
    status: 'Applied',
    nextStep: 'Wait for response (applied Tuesday)',
    recruiter: '',
    referral: 'N',
    location: 'Seattle, WA',
    notes: 'Applied through LinkedIn. Strong match for Kubernetes experience.',
    jobDescription: 'Join the Azure Compute team to build the next generation of container orchestration...'
  },
  {
    id: 'sample-3',
    company: 'Netflix',
    role: 'Staff Software Engineer',
    link: 'https://jobs.netflix.com/jobs/789',
    date: new Date().toISOString().split('T')[0], // Today
    status: 'To Apply',
    nextStep: 'Complete application by end of week',
    recruiter: '',
    referral: 'Y',
    location: 'Los Gatos, CA',
    notes: 'Reached out to hiring manager via LinkedIn. Focus on streaming infrastructure.',
    jobDescription: 'We need a Staff Engineer to lead our video streaming optimization initiatives...'
  },
  {
    id: 'sample-4',
    company: 'Stripe',
    role: 'Engineering Manager',
    link: 'https://stripe.com/jobs/101112',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks ago
    status: 'Final Round',
    nextStep: 'Executive interview with CTO next Monday',
    recruiter: 'talent@stripe.com',
    referral: 'N',
    location: 'San Francisco, CA',
    notes: 'Great cultural fit. Team is excited about my fintech background.',
    jobDescription: 'Lead a team of 8 engineers building payment processing infrastructure...'
  }
];

export const enhancedSamplePrepEntries: PrepEntry[] = [
  {
    id: 'prep-1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    topic: 'System Design: Distributed Caching',
    problems: 'Designed Twitter-like feed system with Redis clustering',
    time: 120, // 2 hours
    confidence: 7,
    notes: 'Covered Redis Cluster, consistent hashing, and cache eviction policies. Need to review CAP theorem.'
  },
  {
    id: 'prep-2',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    topic: 'Behavioral: Leadership & Conflict Resolution',
    problems: '',
    time: 45,
    confidence: 8,
    notes: 'Practiced STAR stories for project management scenarios. Feeling confident about team leadership examples.'
  },
  {
    id: 'prep-3',
    date: new Date().toISOString().split('T')[0], // Today
    topic: 'Coding: Dynamic Programming',
    problems: 'LeetCode: Longest Increasing Subsequence, Edit Distance',
    time: 90,
    confidence: 6,
    notes: 'DP is still challenging. Need more practice with state transitions and optimization.'
  }
];

export const enhancedSampleStarStories: StarStory[] = [
  {
    id: 'story-1',
    title: 'Led Critical System Migration',
    situation: 'Our legacy payment system was causing frequent outages during peak traffic, affecting millions of transactions daily.',
    task: 'I was tasked to lead the migration to a new distributed architecture while maintaining zero downtime.',
    action: 'I designed a phased migration strategy, coordinated with 5 teams, implemented feature flags for gradual rollout, and established comprehensive monitoring. I also mentored junior engineers throughout the 6-month project.',
    result: 'Successfully migrated 100% of traffic with zero downtime. Reduced payment failures by 99.8% and improved system performance by 300%. The project became a template for future migrations.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: 'story-2',
    title: 'Resolved Team Conflict & Improved Delivery',
    situation: 'Two senior engineers on my team had a fundamental disagreement about architecture approach, causing delays and team tension.',
    task: 'As the team lead, I needed to resolve the conflict and get the project back on track without losing either engineer.',
    action: 'I facilitated separate one-on-ones to understand each perspective, organized a technical design review with external stakeholders, and helped the team reach a compromise solution that incorporated the best ideas from both approaches.',
    result: 'The team delivered the project 2 weeks ahead of schedule. Both engineers later mentioned improved collaboration, and we adopted the conflict resolution process for future technical disagreements.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  }
];