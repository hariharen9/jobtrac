import { Application, PrepEntry, CompanyResearch, NetworkingContact, StarStory } from '../types';

export const initialApplications: Application[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 1,
    date: '2025-07-21',
    topic: 'DSA: Arrays & Hashing',
    problems: 'https://leetcode.com/problems/two-sum/',
    time: 2,
    confidence: 3,
    notes: 'Two-pointer technique is very useful for sorted arrays.'
  },
  {
    id: 2,
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
    id: 1,
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
    id: 1,
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
    id: 1,
    title: 'K8s Test Automation',
    situation: 'Manual testing for K8s deployments was slow, error-prone, and inconsistent across multiple teams.',
    task: 'My task was to create a unified solution to automate the entire resource management and testing process.',
    action: 'I led the development of a Python-based automation framework that handled resource creation, test execution, and cleanup. I documented the tool and onboarded other teams to use it.',
    result: 'This reduced testing times by a massive 90% and eliminated manual configuration errors, significantly improving developer productivity and release velocity.'
  },
  {
    id: 2,
    title: 'Orphaned Object Cleanup',
    situation: 'Legacy cleanup scripts were unreliable and frequently failed, leaving orphaned network resources in our production and staging cloud environments, causing resource leakage.',
    task: 'I needed to build a robust, native solution to handle the resource lifecycle automatically and reliably.',
    action: 'I designed and developed a garbage collection system from scratch using GoLang, implementing the controller/operator pattern. This controller watched for specific resources and ensured their entire lifecycle was managed correctly.',
    result: 'This new system completely eliminated all orphaned objects, ensuring 100% resource compliance and improving the high availability and stability of our core infrastructure.'
  }
];