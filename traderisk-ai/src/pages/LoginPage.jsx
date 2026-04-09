import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onSuccess }) {
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password required');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-accent-green">TradeRisk</span> AI Coach
          </h1>
          <p className="text-gray-400">Discipline beats luck</p>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h2 className="text-xl font-bold mb-6 text-accent-green">Log In</h2>

          {/* Error Alert */}
          {(error || authError) && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded flex gap-2 text-sm text-red-200">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error || authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 bg-dark-accent border border-dark-border rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-dark-accent border border-dark-border rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-green text-dark-bg font-bold py-2 rounded hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-dark-border"></div>
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-dark-border"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => window.location.hash = '#/signup'}
              className="text-accent-green hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>✅ Zero API costs</p>
          <p>🔐 Your data stays private</p>
          <p>📊 Claude powers your coach</p>
        </div>
      </div>
    </div>
  );
}
