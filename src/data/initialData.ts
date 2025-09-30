import { Timestamp } from 'firebase/firestore';
import { Application, PrepEntry, CompanyResearch, NetworkingContact, StarStory, Subject, UserOnboarding, QuickStartTask, TooltipConfig } from '../types';

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    description: 'Practice problems related to data structures and algorithms.',
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
    name: 'Behavioral Interview Prep',
    description: 'Preparing for behavioral interview questions using STAR method.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'JavaScript Fundamentals',
    description: 'Core JavaScript concepts, ES6+ features, and best practices.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'React & Frontend',
    description: 'React patterns, state management, and frontend architecture.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const enhancedSamplePrepEntries: PrepEntry[] = [
  // Data Structures & Algorithms - High confidence
  {
    id: '1',
    date: '2025-09-25',
    resources: [
      { title: 'NeetCode video on Arrays', url: 'https://www.youtube.com/watch?v=1', completed: true },
      { title: 'LeetCode Problem Set', url: 'https://leetcode.com/problemset/all/', completed: false },
    ],
    time: 2.5,
    confidence: 5,
    notes: 'Practiced two-pointer techniques and sliding window problems. Feeling very confident with these patterns now.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '1',
    srsStage: 3,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
  },
  {
    id: '2',
    date: '2025-09-23',
    resources: [
      { title: 'Binary Search Patterns', url: 'https://example.com/binary-search', completed: true },
    ],
    time: 1.5,
    confidence: 4,
    notes: 'Reviewed binary search implementations. Need to practice more rotated array problems.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '1',
    srsStage: 2,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
  },
  {
    id: '3',
    date: '2025-09-20',
    resources: [],
    time: 2,
    confidence: 3,
    notes: 'Struggled with dynamic programming problems. Need to review basic patterns.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '1',
    srsStage: 1,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  },
  
  // System Design - Medium confidence
  {
    id: '4',
    date: '2025-09-24',
    resources: [
      { title: 'Grokking the System Design Interview', url: 'https://www.educative.io/courses/grokking-the-system-design-interview', completed: false },
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', completed: false },
    ],
    time: 1.5,
    confidence: 3,
    notes: 'Read about load balancers and CDNs. Need to understand trade-offs better.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '2',
    srsStage: 1,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
  },
  {
    id: '5',
    date: '2025-09-21',
    resources: [
      { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net', completed: false },
    ],
    time: 2,
    confidence: 4,
    notes: 'Studied database scaling techniques. Feeling more confident about sharding concepts.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '2',
    srsStage: 2,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0],
  },
  
  // Behavioral Interview Prep - Lower confidence
  {
    id: '6',
    date: '2025-09-22',
    resources: [],
    time: 1,
    confidence: 2,
    notes: 'Mock interview for behavioral questions. Need to be more concise and use STAR method properly.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '3',
    srsStage: 0,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  },
  
  // JavaScript Fundamentals - High confidence
  {
    id: '7',
    date: '2025-09-24',
    resources: [
      { title: 'ES6 Features Cheatsheet', url: 'https://example.com/es6', completed: true },
    ],
    time: 1.5,
    confidence: 5,
    notes: 'Reviewed promises, async/await, and destructuring. Very comfortable with modern JS features.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '4',
    srsStage: 3,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
  },
  
  // React & Frontend - Medium confidence
  {
    id: '8',
    date: '2025-09-23',
    resources: [
      { title: 'React Hooks Documentation', url: 'https://reactjs.org/docs/hooks-intro.html', completed: true },
      { title: 'State Management Patterns', url: 'https://example.com/state-mgmt', completed: false },
    ],
    time: 2,
    confidence: 3,
    notes: 'Practiced useEffect and custom hooks. Need to work on context and reducer patterns.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '5',
    srsStage: 1,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
  },
  {
    id: '9',
    date: '2025-09-20',
    resources: [
      { title: 'Performance Optimization Techniques', url: 'https://example.com/performance', completed: false },
    ],
    time: 1.5,
    confidence: 4,
    notes: 'Learned about memoization and lazy loading. Applied some optimizations to personal project.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '5',
    srsStage: 2,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
  },
  
  // Additional entries for better analytics
  {
    id: '10',
    date: '2025-09-18',
    resources: [],
    time: 3,
    confidence: 2,
    notes: 'Spent time on graph algorithms but still struggling with advanced problems.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '1',
    srsStage: 0,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  },
  {
    id: '11',
    date: '2025-09-19',
    resources: [
      { title: 'Microservices Architecture', url: 'https://example.com/microservices', completed: false },
    ],
    time: 2,
    confidence: 3,
    notes: 'Studied microservices vs monolith trade-offs. Need to understand service discovery better.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '2',
    srsStage: 1,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
  },
];

// Updated Applications with realistic data and varied completion
export const enhancedSampleApplications: Application[] = [
  // Fully completed application with all fields - Popular tech company
  {
    id: 'app1',
    company: 'Google',
    role: 'Senior Frontend Engineer',
    link: 'https://careers.google.com/jobs/Senior-Frontend-Engineer',
    date: '2025-09-22',
    status: 'Offer',
    source: 'Company Website',
    sourceOther: '',
    recruiter: 'Sarah Johnson',
    referral: 'N',
    location: 'Mountain View, CA',
    notes: 'Received offer with competitive salary and stock options. Accepted position starting November 2025.',
    jobDescription: 'Build scalable frontend applications using React and TypeScript. Collaborate with design and backend teams to deliver exceptional user experiences.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    salaryRange: '140-170',
    priority: 'High',
    interviewDate: '2025-09-20',
  },
  // Partially completed application - Popular tech company
  {
    id: 'app2',
    company: 'Microsoft',
    role: 'Data Scientist',
    link: 'https://careers.microsoft.com/us/en/job/123456/Data-Scientist',
    date: '2025-09-20',
    status: 'Final Round',
    source: 'LinkedIn',
    recruiter: 'Michael Chen',
    referral: 'Y',
    location: 'Redmond, WA',
    notes: 'Preparing for final round interview. Need to review machine learning algorithms and case studies.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    salaryRange: '120-150',
    priority: 'Medium',
    interviewDate: '2025-09-24',
  },
  // Minimal application data - Popular tech company
  {
    id: 'app3',
    company: 'Amazon',
    role: 'Backend Developer',
    link: '', // Required field
    date: '2025-09-18',
    status: 'Applied',
    source: 'Indeed',
    recruiter: '', // Required field
    referral: 'N',
    location: 'Seattle, WA',
    notes: 'Applied through job board. Waiting for response.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    salaryRange: '110-130',
    priority: 'Low',
    interviewDate: '2025-09-22',
  },
  // Another fully completed application - Popular tech company
  {
    id: 'app4',
    company: 'Apple',
    role: 'Full Stack Developer',
    link: 'https://jobs.apple.com/en-us/details/123456/full-stack-developer',
    date: '2025-09-15',
    status: 'Rejected',
    source: 'Referral',
    sourceOther: 'University alumni network',
    recruiter: 'Emma Rodriguez',
    referral: 'Y',
    location: 'Cupertino, CA',
    notes: 'Technical interview went well but cultural fit was not ideal. Received constructive feedback.',
    jobDescription: 'Develop and maintain full-stack applications using Node.js, React, and PostgreSQL. Participate in agile development processes.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    salaryRange: '130-160',
    priority: 'Medium',
    interviewDate: '2025-09-18',
  },
  // Application with ghosted status - Popular tech company
  {
    id: 'app5',
    company: 'Meta',
    role: 'Software Engineer',
    link: 'https://www.metacareers.com/jobs/Software-Engineer',
    date: '2025-09-10',
    status: 'Ghosted',
    source: 'Company Website',
    recruiter: 'David Kim',
    referral: 'N',
    location: 'Menlo Park, CA',
    notes: 'Had initial phone screen but no follow-up after submitting take-home assignment. Likely ghosted.',
    jobDescription: 'Work on cutting-edge web applications using modern JavaScript frameworks. Opportunity to work in a fast-paced startup environment.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    salaryRange: '150-180',
    priority: 'High',
    interviewDate: '2025-09-12',
  },
  // Recent application - Popular tech company
  {
    id: 'app6',
    company: 'Netflix',
    role: 'React Developer',
    link: 'https://jobs.netflix.com/jobs/123456',
    date: '2025-09-24',
    status: 'HR Screen',
    source: 'Naukri',
    sourceOther: '',
    recruiter: 'Priya Sharma',
    referral: 'N',
    location: 'Los Gatos, CA',
    notes: 'Scheduled phone interview for next week. Preparing portfolio and GitHub projects.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    salaryRange: '140-170',
    priority: 'High',
    interviewDate: '2025-09-26',
  },
];

// Updated Company Research with realistic data
export const initialCompanyResearch: CompanyResearch[] = [
  // Fully detailed company research
  {
    id: 'cr1',
    company: 'TechFlow Inc.',
    whatTheyDo: 'Enterprise SaaS platform for workflow automation and team collaboration.',
    values: 'Innovation, transparency, customer-first approach, and continuous learning.',
    why: 'Their mission to simplify complex workflows aligns with my passion for creating intuitive user experiences. Excited about their remote-first culture.',
    questions: 'How do they maintain work-life balance in a fast-paced startup environment? What are their growth plans for the next 3 years?',
    news: 'Recently raised $50M in Series C funding and expanded to European markets.',
    date: '2025-09-23',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Partially completed research (with empty strings for missing fields)
  {
    id: 'cr2',
    company: 'DataSphere Analytics',
    whatTheyDo: 'Big data analytics and business intelligence solutions for Fortune 500 companies.',
    values: 'Data-driven decision making and customer success.',
    why: 'Interested in their approach to solving complex data challenges at scale.',
    questions: '', // Required field
    news: '', // Required field
    date: '2025-09-21',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Minimal research data (with empty strings for missing fields)
  {
    id: 'cr3',
    company: 'InnovateLab',
    whatTheyDo: 'AI-powered product development and innovation consulting.',
    values: '', // Required field
    why: '', // Required field
    questions: '', // Required field
    news: '', // Required field
    date: '2025-09-19',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Recent research
  {
    id: 'cr4',
    company: 'CloudNet Solutions',
    whatTheyDo: 'Cloud infrastructure and DevOps services for enterprise clients.',
    values: 'Reliability, security, and innovation.',
    why: 'Their focus on cloud-native technologies matches my career interests.',
    questions: 'What training opportunities do they provide for new cloud technologies?',
    news: 'Partnered with AWS to deliver enhanced cloud migration services.',
    date: '2025-09-24',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

// Updated Networking Contacts with realistic data
export const initialNetworkingContacts: NetworkingContact[] = [
  // Fully detailed contact
  {
    id: 'nc1',
    name: 'Alex Morgan',
    company: 'TechFlow Inc.',
    role: 'Engineering Manager',
    date: '2025-09-22',
    status: 'Connected',
    referral: 'Y',
    notes: 'Connected through LinkedIn. Provided valuable insights about the engineering culture at TechFlow. Offered to refer for the Senior Frontend Engineer position.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Partially completed contact
  {
    id: 'nc2',
    name: 'Jamie Smith',
    company: 'DataSphere Analytics',
    role: 'Lead Data Scientist',
    date: '2025-09-20',
    status: 'Contacted',
    referral: 'N',
    notes: 'Sent connection request with personalized message about shared interest in machine learning.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Minimal contact data (with empty string for missing notes)
  {
    id: 'nc3',
    name: 'Taylor Kim',
    company: 'StartupXYZ',
    role: 'CTO',
    date: '2025-09-15',
    status: 'Meeting Scheduled',
    referral: 'N',
    notes: '', // Required field
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Recent contact
  {
    id: 'nc4',
    name: 'Jordan Williams',
    company: 'GlobalTech',
    role: 'Senior Developer',
    date: '2025-09-24',
    status: 'Initial Contact',
    referral: 'N',
    notes: 'Met at local tech meetup. Exchanged contact information and discussed career paths in frontend development.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Follow-up contact
  {
    id: 'nc5',
    name: 'Casey Johnson',
    company: 'InnovateLab',
    role: 'Product Manager',
    date: '2025-09-18',
    status: 'Follow-up Sent',
    referral: 'N',
    notes: 'Following up on previous conversation about product development methodologies.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

// Updated STAR Stories with realistic data
export const enhancedSampleStarStories: StarStory[] = [
  // Fully detailed STAR story
  {
    id: 'star1',
    title: 'Led Performance Optimization Initiative',
    situation: 'Our web application was experiencing slow load times, leading to increased bounce rates and user complaints.',
    task: 'I was tasked with identifying performance bottlenecks and implementing optimizations to reduce page load time by at least 40%.',
    action: 'Conducted performance audits using Lighthouse and WebPageTest. Implemented code splitting, lazy loading, and image optimization. Migrated to a more efficient state management solution.',
    result: 'Reduced page load time from 4.2s to 1.8s (57% improvement). Bounce rate decreased by 25% and user engagement increased by 40%.',
    date: '2025-09-21',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Partially completed STAR story
  {
    id: 'star2',
    title: 'Resolved Critical Production Bug',
    situation: 'A critical authentication bug was preventing users from logging in, affecting 100% of our user base.',
    task: 'As the on-call engineer, I needed to quickly identify and resolve the issue to restore service.',
    action: 'Used logs and monitoring tools to trace the error to a failed API dependency. Implemented a temporary workaround while coordinating with the third-party service provider.',
    result: 'Resolved the issue within 2 hours, minimizing user impact. Implemented a more robust error handling solution to prevent future occurrences.',
    date: '2025-09-19',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Minimal STAR story
  {
    id: 'star3',
    title: 'Mentored Junior Developer',
    situation: 'A new team member was struggling to meet project deadlines and understand complex codebase patterns.',
    task: 'I was asked to mentor this junior developer and help them become more productive.',
    action: 'Created a structured learning plan focusing on core technologies. Conducted weekly code reviews and pair programming sessions. Provided guidance on best practices and debugging techniques.',
    result: 'Junior developer became fully productive within 6 weeks. Now contributes to complex features independently and has mentored other new hires.',
    date: '2025-09-16',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Recent STAR story
  {
    id: 'star4',
    title: 'Implemented New Feature Under Tight Deadline',
    situation: 'Client requested a critical new feature with only one week before product launch, requiring integration with multiple existing systems.',
    task: 'Lead the development of this feature while coordinating with backend and design teams to meet the aggressive timeline.',
    action: 'Created a detailed project plan with daily standups. Implemented a modular approach to allow parallel development. Worked evenings and weekends to ensure quality and timely delivery.',
    result: 'Successfully delivered the feature on time with zero bugs in production. Client was extremely satisfied, leading to a contract extension worth $200K.',
    date: '2025-09-24',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Additional STAR story
  {
    id: 'star5',
    title: 'Improved Team Collaboration Process',
    situation: 'Our development team was experiencing communication breakdowns leading to missed deadlines and duplicated work.',
    task: 'As team lead, I was responsible for implementing a more effective collaboration process.',
    action: 'Introduced daily standups, sprint planning sessions, and a shared project management board. Established clear communication channels and escalation procedures.',
    result: 'Team velocity increased by 35% and project delivery time improved by 20%. Team satisfaction scores increased in the next quarterly review.',
    date: '2025-09-12',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

export const defaultQuickStartTasks: QuickStartTask[] = [
  {
    id: '1',
    title: 'Add your first job application',
    description: 'Track your job search progress with our Kanban board',
    icon: 'Briefcase',
    completed: false,
    actionText: 'Add Application',
    feature: 'applications',
  },
  {
    id: '2',
    title: 'Log an interview prep session',
    description: 'Record what you studied and how confident you feel',
    icon: 'BookOpen',
    completed: false,
    actionText: 'Add Prep Entry',
    feature: 'prep',
  },
  {
    id: '3',
    title: 'Create your first STAR story',
    description: 'Prepare compelling behavioral interview answers',
    icon: 'Star',
    completed: false,
    actionText: 'Add STAR Story',
    feature: 'star',
  },
  {
    id: '4',
    title: 'Research a company',
    description: 'Organize insights about companies you\'re interested in',
    icon: 'Building',
    completed: false,
    actionText: 'Add Research',
    feature: 'research',
  },
  {
    id: '5',
    title: 'Add a networking contact',
    description: 'Build and maintain your professional network',
    icon: 'Users',
    completed: false,
    actionText: 'Add Contact',
    feature: 'networking',
  },
];

export const defaultOnboarding: UserOnboarding = {
  hasCompletedWelcome: false,
  hasSeenTooltips: false,
  completedSteps: [],
  quickStartTasks: defaultQuickStartTasks,
  demoMode: false,
  createdAt: new Date().toISOString(),
};

// Note: The tooltipConfig structure in the original file doesn't match the interface definition.
// Since the interface requires specific fields, I'll provide a minimal valid configuration.
export const tooltipConfigs: TooltipConfig[] = [
  {
    id: '1',
    targetSelector: '.prep-confidence',
    title: 'Confidence Level',
    content: 'Rate your confidence level from 1-5 (1 = beginner, 5 = expert)',
    placement: 'top',
    feature: 'prep',
    priority: 1,
  },
  {
    id: '2',
    targetSelector: '.application-status',
    title: 'Application Status',
    content: 'Track your application progress through different stages',
    placement: 'top',
    feature: 'applications',
    priority: 1,
  }
];