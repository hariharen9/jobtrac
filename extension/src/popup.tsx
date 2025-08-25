import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Popup = () => {
  const [currentTab, setCurrentTab] = useState<{ title: string; url: string }>({ title: '', url: '' });
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.title && tab.url) {
        setCurrentTab({ title: tab.title, url: tab.url });
      }
    });
  }, []);

  const handleClip = () => {
    setStatus('Clipping...');
    // In the future, this will trigger the content script
    setTimeout(() => setStatus('Clipped!'), 1000);
  };

  return (
    <div className="w-80 font-sans p-4">
      <div className="flex items-center gap-2 mb-4">
        <img src="/icons/icon48.png" alt="JobTrac Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold">JobTrac Clipper</h1>
      </div>

      <div className="bg-slate-800 p-3 rounded-lg mb-4">
        <p className="text-sm font-medium text-slate-400 mb-1">Clipping from:</p>
        <p className="text-base font-semibold truncate" title={currentTab.title}>
          {currentTab.title || 'No active tab found'}
        </p>
      </div>

      <button
        onClick={handleClip}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Clip Job Posting
      </button>

      <div className="text-center mt-3 text-sm text-slate-500">
        {status}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
