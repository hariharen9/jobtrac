import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Popup = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the initial auth state
    chrome.runtime.sendMessage({ name: 'get-auth-state' }, (response) => {
      if (response.user) {
        setUser(response.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const listener = (msg: any) => {
      if (msg.name === 'auth-flow-complete' && msg.user) {
        setUser(msg.user);
      }
      if (msg.name === 'logout-complete') {
        setUser(null);
      }
    };
    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const handleSignIn = () => {
    chrome.runtime.sendMessage({ name: 'start-auth' });
  };

  const handleSignOut = () => {
    chrome.runtime.sendMessage({ name: 'logout' });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-80 font-sans p-4">
      <div className="flex items-center gap-2 mb-4">
        <img src="/icons/icon48.png" alt="JobTrac Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold">JobTrac Clipper</h1>
      </div>

      {user ? (
        <div>
          <p className="text-sm">Welcome, {user.displayName || user.email}!</p>
          <button
            onClick={handleSignOut}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p className="text-sm">Sign in to save jobs and notes.</p>
          <button
            onClick={handleSignIn}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
