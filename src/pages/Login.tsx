import { useState } from 'react';
import { Brain, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TreeRing from '../components/TreeRing';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const { signIn, resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError('Invalid email or password. Please try again.');
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);

    const { error } = await resetPassword(resetEmail);

    if (error) {
      setError('Failed to send reset email. Please try again.');
    } else {
      setResetMessage('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    }

    setLoading(false);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-mint-50/20 via-warm-white to-sage-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <TreeRing
            ringCount={8}
            className="absolute top-20 -left-10 w-[300px] h-[300px] opacity-25"
          />
          <TreeRing
            ringCount={6}
            className="absolute -bottom-10 -right-10 w-[250px] h-[250px] opacity-25"
          />
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-white/90 dark:bg-gray-800 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 border-2 border-sage-100/50 dark:border-gray-700">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-mint-500 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                <Brain className="w-9 h-9 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-forest dark:text-blue-100 text-center mb-2">
              Reset Password
            </h2>
            <p className="text-soft-gray dark:text-blue-300 text-center mb-8">
              Enter your email to receive a password reset link.
            </p>

            {resetMessage && (
              <div className="mb-6 p-4 bg-mint-50 dark:bg-teal-900/20 border border-mint-200 dark:border-teal-800 rounded-xl">
                <p className="text-sage-800 dark:text-teal-200 text-sm text-center lowercase">{resetMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-soft-gray dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-sage-500 to-mint-500 hover:from-sage-600 hover:to-mint-600 text-white font-semibold rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-sage-600 dark:text-blue-400 hover:text-sage-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-mint-50/20 via-warm-white to-sage-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <TreeRing
          ringCount={8}
          className="absolute top-20 -left-10 w-[300px] h-[300px] opacity-25"
        />
        <TreeRing
          ringCount={6}
          className="absolute -bottom-10 -right-10 w-[250px] h-[250px] opacity-25"
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/90 dark:bg-gray-800 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 border-2 border-sage-100/50 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-mint-500 rounded-[1.5rem] flex items-center justify-center shadow-lg">
              <Brain className="w-9 h-9 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-forest dark:text-blue-100 text-center mb-2">
            Welcome Back to MindShift
          </h2>
          <p className="text-soft-gray dark:text-blue-300 text-center mb-8">
            Continue your journey to mental wellness.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-soft-gray dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-soft-gray dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-sage-600 dark:text-blue-400 hover:text-sage-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-sage-500 to-mint-500 hover:from-sage-600 hover:to-mint-600 text-white font-semibold rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-soft-gray dark:text-blue-300">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sage-600 dark:text-blue-400 hover:text-sage-700 dark:hover:text-blue-300 font-semibold transition-colors">
                Sign Up
              </Link>
            </p>
            <p className="text-soft-gray dark:text-blue-300">
              <Link to="/" className="text-sage-600 dark:text-blue-400 hover:text-sage-700 dark:hover:text-blue-300 font-semibold transition-colors">
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
