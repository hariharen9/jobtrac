import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/shared/ErrorBoundary.tsx';
import AuthPage from './features/auth/components/AuthPage.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);

if (window.location.pathname === '/auth') {
  root.render(
    <StrictMode>
      <AuthPage />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
