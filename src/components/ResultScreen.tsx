import React, { useEffect } from 'react';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  User,
  Layers,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ParticipantResult } from '../types';
import { formatTime } from '../utils/quiz';

interface ResultScreenProps {
  theme: 'dark' | 'light';
  result: ParticipantResult;
  onRetakeQuiz: () => void;
  onGenerateCertificate: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  theme,
  result,
  onRetakeQuiz,
  onGenerateCertificate,
}) => {
  const isPassed = result.percentage >= 80;

  useEffect(() => {
    if (isPassed) {
      // Fire festive fireworks confetti for achievement
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38BDF8', '#818CF8', '#34D399', '#FBBF24'],
        });
      } catch (e) {
        console.error('Confetti trigger ignored', e);
      }
    }
  }, [isPassed]);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 py-8 z-10">
      {/* Result Card */}
      <div
        id="result-screen-card"
        className={`rounded-2xl p-6 sm:p-10 backdrop-blur-xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700/80 shadow-cyan-950/30'
            : 'bg-white/95 border-slate-200 shadow-slate-200/50'
        }`}
      >
        {/* Subtle decorative glow */}
        <div
          className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 ${
            isPassed
              ? 'bg-emerald-500/15'
              : 'bg-rose-500/15'
          }`}
        />

        {/* Reason banner if auto-submitted */}
        {result.submittedReason === 'timer' && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Time is up. Your quiz has been submitted automatically.</span>
          </div>
        )}

        {result.submittedReason === 'violations' && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Maximum violations reached. Your quiz has been submitted.</span>
          </div>
        )}

        {/* Header Badge & Title */}
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border mb-4 ${
              isPassed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {isPassed ? <Sparkles className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span className="uppercase font-mono tracking-wider">
              {isPassed ? 'Distinction Certified' : 'Quiz Completed'}
            </span>
          </div>

          <h2
            id="result-title"
            className={`text-3xl sm:text-4xl font-black tracking-tight mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Quiz Completed
          </h2>

          {/* Prominent Participant Name */}
          <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-bold text-cyan-400">
            <User className="w-4 h-4" />
            <span id="result-student-name" className="underline decoration-cyan-500/40 underline-offset-4">
              {result.studentName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{result.quizTitle}</p>
        </div>

        {/* Score Hero Block */}
        <div
          id="score-hero-block"
          className={`p-6 rounded-2xl border text-center mb-8 relative overflow-hidden ${
            theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/60'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold mb-1">
            Final Score
          </div>
          <div
            id="final-score-display"
            className="text-4xl sm:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
          >
            {result.finalScore}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <span>{result.percentage.toFixed(1)}%</span>
            <span className="text-xs font-normal text-slate-400">
              ({result.correctAnswers} of {result.totalQuestions} correct)
            </span>
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {/* Correct */}
          <div
            className={`p-3.5 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-800/40 border-slate-700/50'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Correct</span>
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {result.correctAnswers}
            </div>
          </div>

          {/* Wrong */}
          <div
            className={`p-3.5 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-800/40 border-slate-700/50'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium mb-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>Wrong</span>
            </div>
            <div className="text-lg font-bold text-rose-400 font-mono">
              {result.wrongAnswers}
            </div>
          </div>

          {/* Unanswered */}
          <div
            className={`p-3.5 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-800/40 border-slate-700/50'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Unanswered</span>
            </div>
            <div className="text-lg font-bold text-amber-400 font-mono">
              {result.unanswered}
            </div>
          </div>

          {/* Time Taken */}
          <div
            className={`p-3.5 rounded-xl border ${
              theme === 'dark'
                ? 'bg-slate-800/40 border-slate-700/50'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-cyan-500 font-medium mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Taken</span>
            </div>
            <div className="text-lg font-bold text-cyan-400 font-mono">
              {formatTime(result.timeTakenSeconds)}
            </div>
          </div>
        </div>

        {/* Violations notice */}
        <div
          className={`flex items-center justify-between p-3 rounded-xl border text-xs mb-8 ${
            result.violations > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : theme === 'dark'
              ? 'bg-slate-800/30 border-slate-800 text-slate-400'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Integrity Violations Logged</span>
          </div>
          <span className="font-mono font-bold text-sm">
            {result.violations} / 3
          </span>
        </div>

        {/* Certificate Eligibility Banner & Action Buttons */}
        {isPassed ? (
          <div
            id="certificate-eligible-section"
            className="p-5 rounded-2xl border bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border-emerald-500/40 space-y-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-emerald-300">
                  Certificate Available
                </h4>
                <p className="text-xs text-emerald-200/80">
                  Congratulations! You achieved {result.percentage.toFixed(0)}% (threshold: ≥ 80%). You are eligible for an official ECE Achievement Certificate.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                id="generate-certificate-btn"
                type="button"
                onClick={onGenerateCertificate}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Generate Certificate</span>
              </button>

              <button
                id="retake-quiz-btn"
                type="button"
                onClick={onRetakeQuiz}
                className={`w-full sm:w-auto py-3 px-5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            id="certificate-ineligible-section"
            className="p-5 rounded-2xl border bg-slate-800/30 border-slate-700/50 space-y-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-amber-300">
                  Certificate Not Available
                </h4>
                <p className="text-xs text-slate-400">
                  A minimum score of 80% is required to earn a certificate. You scored {result.percentage.toFixed(1)}%. Please retake the quiz for certificate.
                </p>
              </div>
            </div>

            <button
              id="retake-quiz-btn"
              type="button"
              onClick={onRetakeQuiz}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] transition-all shadow-md shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
