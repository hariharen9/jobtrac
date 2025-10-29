import { Timestamp } from 'firebase/firestore';
import { Application, PrepEntry, CompanyResearch, NetworkingContact, StarStory, Subject, UserOnboarding, QuickStartTask, TooltipConfig } from '../types';

// Utility function to generate dynamic dates within the last week
const generateDynamicDate = (daysAgo: number): string => {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - daysAgo);
  return targetDate.toISOString().split('T')[0];
};

// Generate dates for the last 7 days (0 = today, 1 = yesterday, etc.)
const getDynamicDates = () => ({
  today: generateDynamicDate(0),
  day1: generateDynamicDate(1),
  day2: generateDynamicDate(2),
  day3: generateDynamicDate(3),
  day4: generateDynamicDate(4),
  day5: generateDynamicDate(5),
  day6: generateDynamicDate(6),
  day7: generateDynamicDate(7),
});

const dynamicDates = getDynamicDates();

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
    name: 'React & Frontend',
    description: 'React patterns, state management, and frontend architecture.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const enhancedSamplePrepEntries: PrepEntry[] = [
  // Data Structures & Algorithms - 3 entries with varied confidence levels
  {
    id: '1',
    date: dynamicDates.day1,
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
    date: dynamicDates.day3,
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
    date: dynamicDates.day7,
    resources: [],
    time: 3,
    confidence: 2,
    notes: 'Spent time on graph algorithms but still struggling with advanced problems. Need to review BFS/DFS fundamentals.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '1',
    srsStage: 0,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  },

  // System Design - 2 entries with progressive learning
  {
    id: '4',
    date: dynamicDates.day2,
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
    date: dynamicDates.day5,
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

  // React & Frontend - 2 entries covering different aspects
  {
    id: '6',
    date: dynamicDates.day4,
    resources: [
      { title: 'React Hooks Documentation', url: 'https://reactjs.org/docs/hooks-intro.html', completed: true },
      { title: 'State Management Patterns', url: 'https://example.com/state-mgmt', completed: false },
    ],
    time: 2,
    confidence: 3,
    notes: 'Practiced useEffect and custom hooks. Need to work on context and reducer patterns.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '3',
    srsStage: 1,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
  },
  {
    id: '7',
    date: dynamicDates.day6,
    resources: [
      { title: 'Performance Optimization Techniques', url: 'https://example.com/performance', completed: false },
    ],
    time: 1.5,
    confidence: 4,
    notes: 'Learned about memoization and lazy loading. Applied some optimizations to personal project.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    subjectId: '3',
    srsStage: 2,
    nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
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
    date: dynamicDates.day4,
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
    interviewDate: dynamicDates.day6,
  },
  // Partially completed application - Popular tech company
  {
    id: 'app2',
    company: 'Microsoft',
    role: 'Data Scientist',
    link: 'https://careers.microsoft.com/us/en/job/123456/Data-Scientist',
    date: dynamicDates.day6,
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
    interviewDate: dynamicDates.day2,
  },
  // Minimal application data - Popular tech company
  {
    id: 'app3',
    company: 'Amazon',
    role: 'Backend Developer',
    link: '', // Required field
    date: dynamicDates.day7,
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
    interviewDate: dynamicDates.day4,
  },
  // Another fully completed application - Popular tech company
  {
    id: 'app4',
    company: 'Apple',
    role: 'Full Stack Developer',
    link: 'https://jobs.apple.com/en-us/details/123456/full-stack-developer',
    date: dynamicDates.day7,
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
    interviewDate: dynamicDates.day7,
  },
  // Application with ghosted status - Popular tech company
  {
    id: 'app5',
    company: 'Meta',
    role: 'Software Engineer',
    link: 'https://www.metacareers.com/jobs/Software-Engineer',
    date: dynamicDates.day7,
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
    interviewDate: dynamicDates.day7,
  },
  // Recent application - Popular tech company
  {
    id: 'app6',
    company: 'Netflix',
    role: 'React Developer',
    link: 'https://jobs.netflix.com/jobs/123456',
    date: dynamicDates.day2,
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
    interviewDate: dynamicDates.today,
  },
];

// Updated Company Research - 3 detailed entries for major tech companies
export const initialCompanyResearch: CompanyResearch[] = [
  // Google - Comprehensive research
  {
    id: 'cr1',
    company: 'Google',
    whatTheyDo: 'Global technology leader specializing in internet-related services and products including search, cloud computing, advertising technologies, and consumer electronics. Known for innovative products like Chrome, Android, YouTube, and Google Cloud Platform.',
    values: 'Focus the user, democracy on the web, fast is better than slow, great just isn\'t good enough. Emphasis on innovation, collaboration, and making information universally accessible. Strong commitment to diversity, sustainability, and ethical AI development.',
    why: 'Google\'s mission to organize the world\'s information aligns perfectly with my passion for creating accessible, high-performance web experiences. I\'m particularly excited about their work in web standards, Chrome development, and cloud infrastructure. The opportunity to impact billions of users while working with cutting-edge technologies like WebAssembly and Progressive Web Apps is incredibly appealing.',
    questions: 'How does Google balance innovation with maintaining backward compatibility across their web platforms? What opportunities exist for contributing to open-source projects like Chromium? How does the team approach performance optimization for global-scale applications? What\'s the career progression path for senior frontend engineers?',
    news: 'Recently announced major investments in AI infrastructure with Bard integration across products. Launched new sustainability initiatives aiming for carbon-neutral operations by 2030. Chrome team released significant performance improvements with the latest V8 engine updates.',
    date: dynamicDates.day3,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Meta - Detailed research
  {
    id: 'cr2',
    company: 'Meta',
    whatTheyDo: 'Social technology company building the next evolution of social connection through VR, AR, and metaverse technologies. Operates Facebook, Instagram, WhatsApp, and Reality Labs. Leading development in virtual and augmented reality experiences.',
    values: 'Move fast, be bold, focus on impact, be open, and build social value. Strong emphasis on connecting people globally and building immersive experiences. Commitment to privacy, safety, and responsible innovation in emerging technologies.',
    why: 'Meta\'s vision for the metaverse represents the future of human interaction and digital experiences. My background in 3D graphics, WebXR, and React aligns perfectly with their technical stack. The opportunity to work on Reality Labs projects and shape the future of virtual collaboration is incredibly exciting. Their investment in React and open-source contributions shows commitment to advancing web technologies.',
    questions: 'How is Meta approaching the technical challenges of building cross-platform metaverse experiences? What role does web technology play in Meta\'s VR/AR strategy? How does the company balance innovation speed with user privacy and safety? What opportunities exist for frontend engineers to contribute to Reality Labs projects?',
    news: 'Launched Quest 3 with mixed reality capabilities and improved performance. Announced significant cost reductions while maintaining R&D investment in metaverse technologies. Released Llama 2 AI model as open source, demonstrating commitment to open innovation.',
    date: dynamicDates.day5,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Amazon - Strategic research
  {
    id: 'cr3',
    company: 'Amazon',
    whatTheyDo: 'Global e-commerce and cloud computing giant operating Amazon.com marketplace, Amazon Web Services (AWS), Prime Video, Alexa, and logistics networks. Leading provider of cloud infrastructure services and AI/ML platforms.',
    values: 'Customer obsession, ownership, invent and simplify, are right a lot, learn and be curious, hire and develop the best, insist on the highest standards, think big, bias for action, frugality, earn trust, dive deep, have backbone; disagree and commit, deliver results. Strong focus on long-term thinking and operational excellence.',
    why: 'Amazon\'s scale and technical challenges in e-commerce and cloud computing offer unparalleled learning opportunities. Their leadership in AWS aligns with my cloud infrastructure experience, and the chance to work on systems serving millions of customers daily is compelling. The culture of innovation and customer obsession resonates with my approach to building user-centric applications.',
    questions: 'How does Amazon approach frontend architecture for applications serving millions of concurrent users? What opportunities exist for cross-team collaboration between AWS Console and e-commerce platforms? How does the company balance rapid feature development with system reliability? What\'s the onboarding process for senior engineers joining AWS teams?',
    news: 'AWS continues to lead cloud market share with new AI/ML services and infrastructure improvements. Amazon announced major sustainability commitments including The Climate Pledge. Significant investments in logistics automation and drone delivery technology.',
    date: dynamicDates.day2,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

// Updated Networking Contacts - 3 contacts from well-known companies
export const initialNetworkingContacts: NetworkingContact[] = [
  // Google contact - Strong connection with referral potential
  {
    id: 'nc1',
    name: 'Sarah Chen',
    company: 'Google',
    role: 'Senior Engineering Manager',
    date: dynamicDates.day4,
    status: 'Connected',
    referral: 'Y',
    notes: 'Met Sarah at the React Conference 2024. She was impressed by my presentation on performance optimization techniques. We discussed Google\'s engineering culture and she offered to refer me for senior frontend positions. She mentioned they\'re actively hiring for the Chrome team and Google Cloud Console. Planning to send her my updated resume this week.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Meta contact - Recent connection through mutual contact
  {
    id: 'nc2',
    name: 'Michael Rodriguez',
    company: 'Meta',
    role: 'Staff Software Engineer',
    date: dynamicDates.day6,
    status: 'Meeting Scheduled',
    referral: 'N',
    notes: 'Connected through my former colleague at Amazon. Michael leads the React Native infrastructure team at Meta. We have a coffee chat scheduled for next week to discuss opportunities in the Reality Labs division. He\'s particularly interested in my experience with WebXR and 3D graphics. Shared some insights about Meta\'s remote work culture and growth opportunities.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Amazon contact - Alumni network connection
  {
    id: 'nc3',
    name: 'Jennifer Park',
    company: 'Amazon',
    role: 'Principal Engineer',
    date: dynamicDates.day2,
    status: 'Follow-up Sent',
    referral: 'Y',
    notes: 'Jennifer is a Stanford alumni from my computer science program. She currently leads the AWS Console frontend architecture team. We reconnected at the university alumni event last month. She provided valuable insights about Amazon\'s leadership principles and mentioned several open positions in AWS that align with my cloud infrastructure experience. Sent follow-up email with my portfolio showcasing AWS projects.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

// Updated STAR Stories with realistic data - Reduced to 2 detailed stories
export const enhancedSampleStarStories: StarStory[] = [
  // Detailed STAR story #1 - Technical Leadership
  {
    id: 'star1',
    title: 'Led Performance Optimization Initiative',
    situation: 'Our e-commerce web application was experiencing slow load times (4.2s average), leading to a 35% bounce rate and declining user engagement. Customer complaints were increasing, and we were losing potential sales during peak shopping periods.',
    task: 'As the senior frontend engineer, I was tasked with identifying performance bottlenecks and implementing comprehensive optimizations to reduce page load time by at least 40% within 6 weeks, while maintaining all existing functionality.',
    action: 'I conducted thorough performance audits using Lighthouse, WebPageTest, and Chrome DevTools to identify bottlenecks. Implemented code splitting for route-based lazy loading, optimized images with WebP format and responsive sizing, migrated from Redux to Zustand for more efficient state management, and introduced service workers for caching. I also collaborated with the backend team to optimize API responses and implemented skeleton loading screens for better perceived performance.',
    result: 'Reduced page load time from 4.2s to 1.8s (57% improvement), exceeding the target. Bounce rate decreased by 25%, user engagement increased by 40%, and conversion rate improved by 18%. The optimizations resulted in an estimated $2.3M additional annual revenue. The performance improvements became a template for other teams in the organization.',
    date: dynamicDates.day5,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Detailed STAR story #2 - Crisis Management & Problem Solving
  {
    id: 'star2',
    title: 'Resolved Critical Production Outage Under Pressure',
    situation: 'During Black Friday peak traffic, a critical authentication service failure prevented 100% of users from logging in to our platform. The outage occurred at 2 AM EST, affecting millions of users across multiple time zones, with potential revenue loss of $50K per hour.',
    task: 'As the on-call senior engineer, I needed to quickly diagnose the root cause, implement a solution, and restore full service while coordinating with multiple teams (DevOps, Backend, Product) and providing regular updates to leadership during this high-stakes situation.',
    action: 'I immediately initiated the incident response protocol and assembled a war room. Using distributed tracing and log analysis, I identified that a third-party OAuth provider had silently changed their API response format. I implemented an emergency backward-compatible adapter while coordinating with the vendor for a permanent fix. Simultaneously, I set up enhanced monitoring and created a fallback authentication mechanism to prevent future similar outages.',
    result: 'Restored full service within 2 hours, minimizing customer impact during the critical shopping period. Prevented an estimated $100K in lost revenue. Implemented robust error handling and monitoring that caught 3 similar issues before they reached production. Received recognition from the CTO and the incident response became a case study for the engineering organization.',
    date: dynamicDates.day3,
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
  {
    id: '6',
    title: 'Add a resource to your vault',
    description: 'Store important links like your resume, portfolio, or certifications',
    icon: 'Archive',
    completed: false,
    actionText: 'Add Resource',
    feature: 'vault',
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