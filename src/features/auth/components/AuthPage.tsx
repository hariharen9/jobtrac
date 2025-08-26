// JUST FOR EXTENSION AUTHENTICATION FLOW
import React, { useEffect } from 'react';
import { auth, googleProvider } from '../../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

const AuthPage: React.FC = () => {
  useEffect(() => {
    const handleSignIn = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        // Send a message to the extension with the user data.
        window.parent.postMessage({ name: 'auth-complete', user }, '*');
      } catch (error) {
        console.error('Error during sign-in:', error);
        // Send an error message to the extension.
        window.parent.postMessage({ name: 'auth-complete', error }, '*');
      }
    };

    handleSignIn();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating with JobTrac...</h1>
        <p className="text-slate-600">Please complete the sign-in process in the popup window.</p>
        <div className="w-16 h-16 border-4 border-indigo-600 border-dashed rounded-full animate-spin mx-auto mt-8"></div>
      </div>
    </div>
  );
};

export default AuthPage;
