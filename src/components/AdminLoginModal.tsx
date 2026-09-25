import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, ArrowLeft, KeyRound, User, Eye, EyeOff } from 'lucide-react';
import { getStoredAdminCredentials } from '../utils/storage';

interface AdminLoginModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  theme,
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setUsername('');
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Read the CURRENT credentials from localStorage every time Login is clicked
    let storedCredentials = { username: 'admin', password: 'admin123' };
    try {
      const raw = localStorage.getItem('adminCredentials');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed.username === 'string' &&
          typeof parsed.password === 'string'
        ) {
          storedCredentials = {
            username: parsed.username.trim(),
            password: parsed.password,
          };
        }
      } else {
        localStorage.setItem('adminCredentials', JSON.stringify(storedCredentials));
      }
    } catch (err) {
      console.error('Failed to read adminCredentials from localStorage', err);
    }

    const enteredUsername = username.trim();
    const enteredPassword = password;

    // Login must work only when:
    // enteredUsername === storedCredentials.username
    // AND
    // enteredPassword === storedCredentials.password
    if (
      enteredUsername === storedCredentials.username &&
      enteredPassword === storedCredentials.password
    ) {
      setErrorMessage('');
      setUsername('');
      setPassword('');
      onLoginSuccess();
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <div
      id="admin-login-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-700 text-white shadow-cyan-950/50'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
        }`}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl bg-indigo-500/15 pointer-events-none -mr-10 -mt-10" />

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 id="admin-login-title" className="text-xl font-bold tracking-tight">
              Admin Login
            </h3>
            <p className="text-xs text-slate-400">
              Restricted management console access
            </p>
          </div>
        </div>

        {/* Security Indicator Pill */}
        <div
          className={`p-3 rounded-xl mb-5 text-xs flex items-center justify-between border ${
            theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/80 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Administrator Verification Required</span>
          </div>
          <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
            Secure
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-username-input"
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80"
            >
              Username
            </label>
            <div className="relative">
              <input
                id="admin-username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                autoFocus
                placeholder="Enter admin username"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Enter password"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              id="admin-login-error"
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-semibold flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              id="back-to-quiz-btn"
              type="button"
              onClick={() => {
                setErrorMessage('');
                onClose();
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Quiz</span>
            </button>

            <button
              id="admin-submit-login-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
