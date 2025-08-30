import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock user data for tests
export const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  isAnonymous: false,
  metadata: {
    creationTime: 'Wed, 01 Jan 2025 00:00:00 GMT',
    lastSignInTime: 'Wed, 01 Jan 2025 00:00:00 GMT',
  },
};

export const mockApplications = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineer',
    status: 'Applied' as const,
    date: '2025-01-01',
    link: 'https://google.com/jobs',
    nextStep: 'Wait for response',
    recruiter: 'Jane Smith',
    referral: 'N' as const,
    location: 'Mountain View, CA',
    notes: 'Applied through website',
    createdAt: { seconds: 1640995200, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1640995200, nanoseconds: 0 } as any,
  },
  {
    id: '2',
    company: 'Microsoft',
    role: 'Senior Developer',
    status: 'HR Screen' as const,
    date: '2025-01-02',
    link: 'https://microsoft.com/jobs',
    nextStep: 'Technical interview',
    recruiter: 'John Doe',
    referral: 'Y' as const,
    location: 'Seattle, WA',
    notes: 'Referred by friend',
    createdAt: { seconds: 1640995200, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1640995200, nanoseconds: 0 } as any,
  },
];

export const mockPrepEntries = [
  {
    id: '1',
    date: '2025-01-01',
    topic: 'System Design',
    problems: 'Design a URL shortener',
    time: 120,
    confidence: 8,
    notes: 'Covered scalability aspects',
    createdAt: { seconds: 1640995200, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1640995200, nanoseconds: 0 } as any,
  },
];

export const mockCompanies = [
  {
    id: '1',
    company: 'Google',
    whatTheyDo: 'Search engine and cloud services',
    values: 'Innovation, user focus, excellence',
    why: 'Great engineering culture',
    questions: 'Tell me about your team structure',
    news: 'Recently launched new AI features',
    createdAt: { seconds: 1640995200, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1640995200, nanoseconds: 0 } as any,
  },
];

export const mockContacts = [
  {
    id: '1',
    name: 'Alice Johnson',
    company: 'Google',
    role: 'Engineering Manager',
    date: '2025-01-01',
    status: 'Connected',
    referral: 'Y' as const,
    notes: 'Met at tech conference',
    createdAt: { seconds: 1640995200, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1640995200, nanoseconds: 0 } as any,
  },
];

export const mockStories = [
  {
    id: '1',
    title: 'Led team project successfully',
    situation: 'Our team was behind on a critical project deadline',
    task: 'I needed to reorganize the team and improve efficiency',
    action: 'I implemented daily standups and pair programming',
    result: 'We delivered the project 2 days early with high quality',
    createdAt: { seconds: 1640995200, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1640995200, nanoseconds: 0 } as any,
  },
];

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Helper functions for testing
export const waitForLoadingToFinish = async () => {
  // Wait for any loading states to complete
  await new Promise(resolve => setTimeout(resolve, 100));
};

export const mockFirestoreHook = (data: any[], loading = false, error: string | null = null) => {
  return {
    data,
    loading,
    error,
    addItem: vi.fn().mockResolvedValue('new-id'),
    updateItem: vi.fn().mockResolvedValue(undefined),
    deleteItem: vi.fn().mockResolvedValue(undefined),
  };
};

export const mockAuthHook = (user = mockUser, loading = false) => {
  return {
    user,
    loading,
    needsProfileSetup: false,
    signInWithGoogle: vi.fn(),
    signInAnonymous: vi.fn(),
    signUpWithEmail: vi.fn(),
    signInWithEmail: vi.fn(),
    logout: vi.fn(),
    deleteAccount: vi.fn(),
    saveUserProfile: vi.fn(),
    skipProfileSetup: vi.fn(),
  };
};