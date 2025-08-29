import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const EmailPasswordForm = () => {
  const { signUpWithEmail, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please sign in or use a different email.');
      } else if (firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative">
        {/* Background gradient blur effect */}
        <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-40 dark:opacity-30 amoled:opacity-20 animate-pulse"></div>
        
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="relative backdrop-blur-sm bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 border border-gray-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50 rounded-xl shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/30 amoled:shadow-black/50 px-6 py-6 space-y-4 transition-all duration-500 hover:shadow-3xl"
        >
          {/* Form Header */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-dark-text dark:to-gray-400 amoled:from-amoled-text amoled:to-gray-300 bg-clip-text text-transparent mb-1">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              {isSignUp ? 'Join JobTrac to track your career journey' : 'Sign in to continue your journey'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="relative px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 amoled:bg-red-900/10 border border-red-200 dark:border-red-700/30 amoled:border-red-600/20 text-red-700 dark:text-red-400 amoled:text-red-300 text-sm transition-all duration-300 animate-in slide-in-from-top-2">
              <p>{error}</p>
            </div>
          )}
          
          {/* Email Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={`w-5 h-5 transition-colors duration-200 ${
                emailFocused || email 
                  ? 'text-blue-500 dark:text-blue-400 amoled:text-blue-300' 
                  : 'text-gray-400 dark:text-gray-500 amoled:text-gray-400'
              }`} />
            </div>
            <input
              className="w-full pl-12 pr-4 py-3 text-gray-900 dark:text-dark-text amoled:text-amoled-text bg-gray-50/50 dark:bg-dark-bg/50 amoled:bg-black/30 border border-gray-200 dark:border-dark-border amoled:border-amoled-border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 amoled:focus:border-blue-300 transition-all duration-200 text-sm"
              id="email"
              type="email"
              value={email}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label 
              htmlFor="email"
              className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                emailFocused || email 
                  ? '-top-2 left-3 text-xs bg-white dark:bg-dark-card amoled:bg-amoled-card px-2 text-blue-600 dark:text-blue-400 amoled:text-blue-300 font-medium'
                  : 'top-3 text-sm text-gray-400 dark:text-gray-500 amoled:text-gray-400'
              }`}
            >
              Email Address
            </label>
          </div>

          {/* Password Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={`w-5 h-5 transition-colors duration-200 ${
                passwordFocused || password 
                  ? 'text-blue-500 dark:text-blue-400 amoled:text-blue-300' 
                  : 'text-gray-400 dark:text-gray-500 amoled:text-gray-400'
              }`} />
            </div>
            <input
              className="w-full pl-12 pr-12 py-3 text-gray-900 dark:text-dark-text amoled:text-amoled-text bg-gray-50/50 dark:bg-dark-bg/50 amoled:bg-black/30 border border-gray-200 dark:border-dark-border amoled:border-amoled-border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 amoled:focus:border-blue-300 transition-all duration-200 text-sm"
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label 
              htmlFor="password"
              className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                passwordFocused || password 
                  ? '-top-2 left-3 text-xs bg-white dark:bg-dark-card amoled:bg-amoled-card px-2 text-blue-600 dark:text-blue-400 amoled:text-blue-300 font-medium'
                  : 'top-3 text-sm text-gray-400 dark:text-gray-500 amoled:text-gray-400'
              }`}
            >
              Password
            </label>
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 amoled:text-gray-400 amoled:hover:text-gray-300 transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center space-x-2 group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Toggle Mode */}
          <div className="text-center pt-2">
            <button
              type="button"
              className="text-xs text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-blue-600 dark:hover:text-blue-400 amoled:hover:text-blue-300 transition-colors duration-200 font-medium"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailPasswordForm;
