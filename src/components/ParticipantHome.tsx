import React, { useState } from 'react';
import { Cpu, Award, ArrowRight, ShieldCheck, Clock, Layers, Lock } from 'lucide-react';
import { QuizConfig } from '../types';

interface ParticipantHomeProps {
  theme: 'dark' | 'light';
  config: QuizConfig;
  availableQuestionsCount: number;
  onStartQuiz: (studentName: string) => void;
  onSecretAdminTrigger?: () => void;
}

export const ParticipantHome: React.FC<ParticipantHomeProps> = ({
  theme,
  config,
  availableQuestionsCount,
  onStartQuiz,
  onSecretAdminTrigger,
}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [tapCount, setTapCount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    onStartQuiz(trimmed);
  };

  // Optional mobile-friendly fallback for touchscreen devices (Ctrl+Shift+A can't be typed on phone keyboard)
  // Tapping the subtle micro-version 5 times opens the Admin login modal
  const handleVersionTap = () => {
    const nextCount = tapCount + 1;
    if (nextCount >= 5) {
      setTapCount(0);
      onSecretAdminTrigger?.();
    } else {
      setTapCount(nextCount);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 py-8 sm:py-12 z-10 flex flex-col items-center">
      {/* Central Glassmorphic Card */}
      <div
        id="participant-home-card"
        className={`w-full rounded-2xl p-6 sm:p-10 backdrop-blur-xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-900/70 border-slate-700/60 shadow-cyan-950/30'
            : 'bg-white/80 border-indigo-100 shadow-indigo-200/40'
        }`}
      >
        {/* Glow corner elements */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none ${
            theme === 'dark' ? 'bg-cyan-500/20' : 'bg-blue-400/20'
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none ${
            theme === 'dark' ? 'bg-purple-600/20' : 'bg-indigo-300/20'
          }`}
        />

        {/* Top Header Badge */}
        <div className="flex items-center justify-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border ${
              theme === 'dark'
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-mono uppercase tracking-wider text-[11px]">
              ECE DIGITAL ELECTRONICS
            </span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-center mb-8">
          <h1
            id="quiz-main-title"
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${
              theme === 'dark'
                ? 'text-white drop-shadow-sm'
                : 'text-slate-900'
            }`}
          >
            QUIZ SIMULATOR
          </h1>
          <p
            id="quiz-main-subtitle"
            className={`text-sm sm:text-base font-medium max-w-md mx-auto ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Test Your Knowledge &amp; Earn Your Certificate
          </p>
        </div>

        {/* Quiz Info Pills */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
          <div
            className={`p-3 rounded-xl border text-center transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center mb-1 text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Questions</div>
            <div className="text-sm sm:text-base font-bold text-cyan-500">
              {Math.min(config.questionCount, availableQuestionsCount || config.questionCount)}
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border text-center transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center mb-1 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Duration</div>
            <div className="text-sm sm:text-base font-bold text-purple-500">
              {config.durationMinutes} min
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border text-center transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300'
                : 'bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center mb-1 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-400 font-medium">Passing</div>
            <div className="text-sm sm:text-base font-bold text-emerald-500">
              ≥ 80%
            </div>
          </div>
        </div>

        {/* Student Name Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="student-name-input"
              className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Student Full Name
            </label>
            <input
              id="student-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Alex Johnson"
              maxLength={100}
              autoComplete="name"
              autoFocus
              className={`w-full px-4 py-3.5 rounded-xl border text-sm sm:text-base font-medium transition-all duration-200 outline-none ${
                error
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
            />
            {error && (
              <p id="student-name-error" className="mt-2 text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                {error}
              </p>
            )}
          </div>

          <button
            id="start-quiz-btn"
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base tracking-wide text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security / Proctored Notice */}
        <div
          className={`mt-6 pt-5 border-t flex items-center justify-between text-xs ${
            theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>Browser integrity monitoring enabled</span>
          </div>
          <span
            onClick={handleVersionTap}
            className="font-mono text-[10px] text-slate-500 select-none cursor-default"
            title="System version"
          >
            v2.6
          </span>
        </div>
      </div>

      {/* Unobtrusive Admin Login Entry at bottom of page */}
      <div className="mt-5 flex items-center justify-center">
        <button
          id="admin-login-entry-btn"
          type="button"
          onClick={onSecretAdminTrigger}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
            theme === 'dark'
              ? 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60'
              : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/70'
          }`}
        >
          <Lock className="w-3.5 h-3.5 opacity-70" />
          <span>Admin Login</span>
        </button>
      </div>
    </div>
  );
};
