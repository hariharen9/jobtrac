import React, { Component, ReactNode } from 'react';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const issueUrl = `https://github.com/hariharen9/jobtrac/issues/new?title=Crash+Report&body=**Error:**%0A%60%60%60%0A${this.state.error?.message}%0A%60%60%60%0A%0A**Stack+Trace:**%0A%60%60%60%0A${this.state.error?.stack}%0A%60%60%60%0A%0A`;

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg flex items-center justify-center p-4 font-sans">
          <div className="max-w-2xl w-full bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-2xl shadow-xl border dark:border-dark-border amoled:border-amoled-border p-8 m-4">
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500 flex-shrink-0" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                  Unexpected Application Error!
                </h1>
                <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mt-1">
                  Something went wrong. Please help us fix it!
                </p>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">Error Details:</p>
              <code className="block text-sm text-red-600 dark:text-red-400 mt-2 whitespace-pre-wrap break-words">
                {this.state.error?.toString()}
              </code>
            </div>

            <div className="space-y-4">
              <p className="text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                You can help us resolve this issue faster by creating a bug report on GitHub. This allows us to track, investigate, and fix the problem.
              </p>
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-md hover:bg-slate-900 dark:hover:bg-slate-300 transition-colors font-semibold text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Create GitHub Issue
              </a>
            </div>

            <div className="border-t dark:border-dark-border amoled:border-amoled-border my-6"></div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Page
                </button>
                <p className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-center sm:text-left">
                    P.S. If you speak \'developer\', the console might have some juicy gossip for you. 😉
                </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;