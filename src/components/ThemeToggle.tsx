import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={onToggle}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 shadow-sm cursor-pointer select-none ${
        theme === 'dark'
          ? 'bg-slate-800/80 hover:bg-slate-700/90 text-cyan-400 border border-slate-700/80 shadow-cyan-950/20'
          : 'bg-white/80 hover:bg-white text-indigo-900 border border-indigo-200/80 shadow-indigo-100/50'
      }`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="text-[11px] uppercase tracking-wider font-mono">Dark Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[11px] uppercase tracking-wider font-mono">Light Mode</span>
        </>
      )}
    </button>
  );
};
