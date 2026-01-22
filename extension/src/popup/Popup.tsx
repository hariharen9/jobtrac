// Main Popup Component
// Shows extracted job data and allows saving to JobTrac

import { useState, useEffect } from 'react';
import {
  ExtractedJobData,
  ApplicationPayload,
  ApplicationStatus,
  Priority,
  DEFAULT_SETTINGS,
} from '../types';
import { getSettings, addPendingApplication } from '../storage';
import { useTheme, Theme } from './hooks/useTheme';
import CompanyIcon from './components/CompanyIcon';
import './popup.css';

type ViewState = 'loading' | 'extracted' | 'form' | 'success' | 'error' | 'not-job-page';

const APPLICATION_STATUSES: ApplicationStatus[] = [
  'To Apply',
  'Applied',
  'HR Screen',
  'Tech Screen',
  'Round 1',
  'Round 2',
  'Manager Round',
  'Final Round',
  'Offer',
  'Rejected',
  'Ghosted',
];

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

function App() {
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [jobData, setJobData] = useState<ExtractedJobData | null>(null);
  const [error, setError] = useState<string>('');
  const { theme, toggleTheme } = useTheme();

  // Form state
  const [formData, setFormData] = useState<ApplicationPayload>({
    company: '',
    role: '',
    link: '',
    date: new Date().toISOString().split('T')[0],
    status: 'To Apply',
    source: 'LinkedIn',
    recruiter: '',
    referral: 'N',
    location: '',
    notes: '',
    jobDescription: '',
    salaryRange: '',
    priority: 'Medium',
  });

  const [showJobDescription, setShowJobDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Extract job data on mount
  useEffect(() => {
    extractJobData();
  }, []);

  const extractJobData = async () => {
    setViewState('loading');

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.id || !tab.url) {
        setViewState('not-job-page');
        return;
      }

      // Try to inject and run content script
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js'],
        });
      } catch {
        // Content script might already be loaded
      }

      // Wait for content script to initialize
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Request job data from content script
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_JOB_DATA' });

      if (response?.success && response.data) {
        setJobData(response.data);
        populateForm(response.data);
        setViewState('extracted');
      } else {
        setViewState('not-job-page');
      }
    } catch (err) {
      console.error('Error extracting job data:', err);
      setViewState('not-job-page');
    }
  };

  const populateForm = async (data: ExtractedJobData) => {
    const settings = await getSettings();

    setFormData({
      company: data.company,
      role: data.role,
      link: data.link,
      date: settings.autoFillDate ? new Date().toISOString().split('T')[0] : '',
      status: settings.defaultStatus,
      source: data.source,
      recruiter: '',
      referral: 'N',
      location: data.location,
      notes: '',
      jobDescription: data.jobDescription || '',
      salaryRange: data.salaryRange || '',
      priority: settings.defaultPriority,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      // For now, save to local storage (pending sync)
      await addPendingApplication(formData);

      // Also try to open JobTrac with the data
      const settings = await getSettings();
      const params = new URLSearchParams({
        action: 'add-application',
        company: formData.company,
        role: formData.role,
        link: formData.link,
        location: formData.location,
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        referral: formData.referral,
        date: formData.date,
        salary: formData.salaryRange || '',
        notes: formData.notes || '',
        jd: formData.jobDescription?.substring(0, 2000) || '', // Limit JD size for URL
      });

      // Open JobTrac in a new tab with pre-filled data
      chrome.tabs.create({
        url: `${settings.jobtracUrl}/app?${params.toString()}`,
      });

      setViewState('success');
    } catch (err) {
      console.error('Error saving application:', err);
      setError('Failed to save application. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const text = `${formData.role} at ${formData.company}\n${formData.location}\n${formData.link}`;
    await navigator.clipboard.writeText(text);
  };

  // Render based on state
  if (viewState === 'loading') {
    return (
      <div className="popup-container">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">Extracting job details...</p>
        </div>
      </div>
    );
  }

  if (viewState === 'not-job-page') {
    return (
      <div className="popup-container">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2 className="empty-state-title">No Job Posting Detected</h2>
          <p className="empty-state-text">
            Navigate to a job posting on LinkedIn, Indeed, Glassdoor, Naukri, or any company
            career page to import job details.
          </p>
          <button className="btn btn-secondary" onClick={extractJobData}>
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (viewState === 'success') {
    return (
      <div className="popup-container">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <div className="success-state">
          <div className="success-icon">✓</div>
          <h2 className="empty-state-title">Application Saved!</h2>
          <p className="empty-state-text">
            Opening JobTrac to complete the application...
          </p>
          <button className="btn btn-secondary" onClick={() => window.close()}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      {/* Job Preview */}
      <div className="card">
        <div className="job-preview">
          <div className="job-preview-header">
            <div className="job-preview-logo">
              {jobData?.companyLogo ? (
                <img src={jobData.companyLogo} alt={formData.company} />
              ) : (
                <CompanyIcon companyName={formData.company} size={32} />
              )}
            </div>
            <div className="job-preview-info">
              <h2 className="job-preview-role">{formData.role}</h2>
              <p className="job-preview-company">{formData.company}</p>
              <div className="job-preview-meta">
                {formData.location && (
                  <span className="job-preview-meta-item">📍 {formData.location}</span>
                )}
                {formData.salaryRange && (
                  <span className="job-preview-meta-item">💰 {formData.salaryRange}</span>
                )}
                <span className="status-badge info">{formData.source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Form */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Application Details</span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-select"
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="form-select"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Referral?</label>
            <select
              name="referral"
              value={formData.referral}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="N">No</option>
              <option value="Y">Yes</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Add any notes about this application..."
            rows={2}
          />
        </div>

        {/* Expandable Job Description */}
        <div className="expandable">
          <div
            className="expandable-header"
            onClick={() => setShowJobDescription(!showJobDescription)}
          >
            <span className="form-label">
              Job Description {formData.jobDescription ? '✓' : '(not captured)'}
            </span>
            <span>{showJobDescription ? '▼' : '▶'}</span>
          </div>
          {showJobDescription && (
            <div className="expandable-content">
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Job description will be saved..."
                rows={4}
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {error && (
        <div className="status-badge error" style={{ width: '100%', justifyContent: 'center' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className="btn btn-secondary"
          onClick={handleCopyToClipboard}
          title="Copy job details"
        >
          📋 Copy
        </button>
        <button
          className="btn btn-primary btn-full"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : '🚀 Save to JobTrac'}
        </button>
      </div>

      <Footer />
    </div>
  );
}

// Header Component
function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'amoled':
        return '🖤';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'amoled':
        return 'AMOLED';
    }
  };

  return (
    <header className="header">
      <div className="header-title">
        <img src="/icons/jtrac-logo.png" alt="JobTrac" className="header-logo" />
        <h1>JobTrac</h1>
      </div>
      <div className="header-actions">
        <button
          className="btn btn-ghost theme-toggle"
          onClick={onToggleTheme}
          title={`Theme: ${getThemeLabel()} (click to change)`}
        >
          <span className="theme-icon">{getThemeIcon()}</span>
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => chrome.tabs.create({ url: DEFAULT_SETTINGS.jobtracUrl })}
          title="Open JobTrac"
        >
          ↗
        </button>
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <span>
        Built by{' '}
        <a
          href="https://hariharen.site"
          onClick={(e) => {
            e.preventDefault();
            chrome.tabs.create({ url: 'https://hariharen.site' });
          }}
        >
          Hariharen
        </a>
      </span>
      <span>•</span>
      <span>v0.1.0</span>
    </footer>
  );
}

export default App;
