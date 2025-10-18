
import React from 'react';
import Modal from '../../../components/shared/Modal';

export type ApplicationTrackerSettings = {
  viewMode: 'comfy' | 'compact';
  showStats: boolean;
  currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  salaryDenomination: 'K' | 'L';
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApplicationTrackerSettings;
  onSettingsChange: (newSettings: ApplicationTrackerSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const handleViewModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, viewMode: e.target.value as 'comfy' | 'compact' });
  };

  const handleShowStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, showStats: e.target.checked });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value as 'USD' | 'INR' | 'EUR' | 'GBP';
    // Auto-set denomination based on currency
    const newDenomination = newCurrency === 'INR' ? 'L' : 'K';
    onSettingsChange({ ...settings, currency: newCurrency, salaryDenomination: newDenomination });
  };

  const handleDenominationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, salaryDenomination: e.target.value as 'K' | 'L' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Application Tracker Settings">
      <div className="p-6 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">View Mode</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="viewMode"
                value="comfy"
                checked={settings.viewMode === 'comfy'}
                onChange={handleViewModeChange}
                className="form-radio h-4 w-4 text-indigo-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              />
              <span>Comfy</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="viewMode"
                value="compact"
                checked={settings.viewMode === 'compact'}
                onChange={handleViewModeChange}
                className="form-radio h-4 w-4 text-indigo-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              />
              <span>Compact</span>
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            In compact mode, only the list view is available and stats are hidden.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Display</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showStats}
              onChange={handleShowStatsChange}
              className="form-checkbox h-4 w-4 text-indigo-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              disabled={settings.viewMode === 'compact'}
            />
            <span>Show Quick Stats</span>
          </label>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Currency & Salary Format</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={handleCurrencyChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Salary Denomination
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="denomination"
                    value="K"
                    checked={settings.salaryDenomination === 'K'}
                    onChange={handleDenominationChange}
                    className="form-radio h-4 w-4 text-indigo-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                  />
                  <span>K (Thousands)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="denomination"
                    value="L"
                    checked={settings.salaryDenomination === 'L'}
                    onChange={handleDenominationChange}
                    className="form-radio h-4 w-4 text-indigo-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                  />
                  <span>L (Lakhs)</span>
                </label>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {settings.salaryDenomination === 'K'
                  ? 'Example: 100K = 100,000'
                  : 'Example: 10L = 10,00,000 (10 Lakhs)'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
