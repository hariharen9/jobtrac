
import React from 'react';
import { X } from 'lucide-react';
import Modal from '../../../components/shared/Modal';

export type ApplicationTrackerSettings = {
  viewMode: 'comfy' | 'compact';
  showStats: boolean;
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

        <div>
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
      </div>
    </Modal>
  );
};

export default SettingsModal;
