// Test setup file for Vitest + React Testing Library
import '@testing-library/jest-dom';

// Mock Firebase to prevent actual API calls during testing
const mockFirebase = {
  initializeApp: vi.fn(),
  getFirestore: vi.fn(() => ({})),
  getAuth: vi.fn(() => ({
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  })),
  GoogleAuthProvider: vi.fn(),
  getAnalytics: vi.fn(() => ({})),
};

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: mockFirebase.initializeApp,
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: mockFirebase.getFirestore,
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ seconds: 1640995200, nanoseconds: 0 })),
  },
}));

vi.mock('firebase/auth', () => ({
  getAuth: mockFirebase.getAuth,
  GoogleAuthProvider: mockFirebase.GoogleAuthProvider,
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInAnonymously: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: mockFirebase.getAnalytics,
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null })),
    Link: vi.fn(({ children }) => children),
  };
});

// Mock Framer Motion to prevent animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children }) => children),
    button: vi.fn(({ children }) => children),
    nav: vi.fn(({ children }) => children),
    section: vi.fn(({ children }) => children),
    h1: vi.fn(({ children }) => children),
    p: vi.fn(({ children }) => children),
    ul: vi.fn(({ children }) => children),
    li: vi.fn(({ children }) => children),
    a: vi.fn(({ children }) => children),
  },
  AnimatePresence: vi.fn(({ children }) => children),
  useScroll: vi.fn(() => ({ scrollYProgress: { get: () => 0 } })),
  useTransform: vi.fn(() => ({ get: () => 0 })),
  useInView: vi.fn(() => true),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock react-confetti
vi.mock('react-confetti', () => ({
  __esModule: true,
  default: () => null,
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});