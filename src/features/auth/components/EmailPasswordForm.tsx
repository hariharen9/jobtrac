import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

const EmailPasswordForm = () => {
  const { signUpWithEmail, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in or use a different email.');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md dark:bg-slate-800">
        {error && <p className="mb-4 text-xs italic text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative mb-6">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-3 py-2 pr-10 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" style={{top: '1.8rem'}} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between">
          <button
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
          <button
            type="button"
            className="inline-block mt-4 text-sm font-bold text-indigo-600 align-baseline hover:text-indigo-800"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailPasswordForm;
