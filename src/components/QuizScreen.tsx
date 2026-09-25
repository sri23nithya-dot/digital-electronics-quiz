import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { QuizQuestion, ParticipantResult } from '../types';
import { formatTime } from '../utils/quiz';

interface QuizScreenProps {
  theme: 'dark' | 'light';
  quizTitle: string;
  studentName: string;
  questions: QuizQuestion[];
  durationMinutes: number;
  onSubmit: (result: Omit<ParticipantResult, 'id' | 'date' | 'certificateId'>) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  theme,
  quizTitle,
  studentName,
  questions,
  durationMinutes,
  onSubmit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Store user's selected answers by question index: { [index]: selectedOptionString }
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [validationError, setValidationError] = useState('');
  const [showUnansweredConfirm, setShowUnansweredConfirm] = useState(false);

  // Timer state (seconds)
  const totalSeconds = durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const startTimeRef = useRef<number>(Date.now());
  const submittedRef = useRef(false);

  // Violations state
  const [violations, setViolations] = useState(0);
  const [violationAlert, setViolationAlert] = useState<{ message: string; type: 'warning' | 'danger' } | null>(null);
  const lastViolationTimeRef = useRef<number>(0);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  // Final submission handler
  const handleFinalSubmit = useCallback(
    (reason: 'manual' | 'timer' | 'violations' = 'manual') => {
      if (submittedRef.current) return;
      submittedRef.current = true;

      // Calculate score
      let correct = 0;
      let wrong = 0;
      let unanswered = 0;

      questions.forEach((q, idx) => {
        const selected = userAnswers[idx];
        if (!selected) {
          unanswered++;
        } else if (selected === q.answer) {
          correct++;
        } else {
          wrong++;
        }
      });

      const percentage = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;
      const finalScore = `${correct} / ${totalQuestions}`;
      const timeTaken = Math.min(totalSeconds, Math.floor((Date.now() - startTimeRef.current) / 1000));
      const eligibleForCertificate = percentage >= 80;

      onSubmit({
        studentName,
        quizTitle,
        totalQuestions,
        correctAnswers: correct,
        wrongAnswers: wrong,
        unanswered,
        percentage,
        finalScore,
        timeTakenSeconds: Math.max(1, timeTaken),
        violations,
        eligibleForCertificate,
        submittedReason: reason,
      });
    },
    [questions, userAnswers, totalQuestions, totalSeconds, studentName, quizTitle, violations, onSubmit]
  );

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when timer reaches zero
          handleFinalSubmit('timer');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleFinalSubmit]);

  // Violation detection with debounce/cooldown to prevent duplicate triggers
  useEffect(() => {
    const recordViolation = () => {
      if (submittedRef.current) return;

      const now = Date.now();
      // Cooldown of 1800ms
      if (now - lastViolationTimeRef.current < 1800) {
        return;
      }
      lastViolationTimeRef.current = now;

      setViolations((prev) => {
        const next = prev + 1;
        if (next === 1) {
          setViolationAlert({
            message: 'Warning: Please stay on the quiz screen.',
            type: 'warning',
          });
        } else if (next === 2) {
          setViolationAlert({
            message: 'Warning: One more violation will submit the quiz.',
            type: 'danger',
          });
        } else if (next >= 3) {
          setViolationAlert({
            message: 'Maximum violations reached. Your quiz has been submitted.',
            type: 'danger',
          });
          // Auto submit at 3 violations
          setTimeout(() => {
            handleFinalSubmit('violations');
          }, 800);
        }
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        recordViolation();
      }
    };

    const handleWindowBlur = () => {
      recordViolation();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [handleFinalSubmit]);

  // Handle option selection
  const handleSelectOption = (option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: option,
    }));
    if (validationError) {
      setValidationError('');
    }
  };

  // Navigate Previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setValidationError('');
    }
  };

  // Navigate Next
  const handleNext = () => {
    if (!userAnswers[currentIndex]) {
      setValidationError('Please select an answer before continuing.');
      return;
    }
    setValidationError('');
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Click Submit (from final question or direct submit)
  const handleSubmitClick = () => {
    // Check if current question is unanswered
    if (!userAnswers[currentIndex]) {
      setValidationError('Please select an answer before continuing.');
      return;
    }

    // Check if any question across the entire quiz is unanswered
    let unansweredCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (!userAnswers[i]) {
        unansweredCount++;
      }
    }

    if (unansweredCount > 0) {
      setShowUnansweredConfirm(true);
    } else {
      handleFinalSubmit('manual');
    }
  };

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const isTimeCritical = remainingSeconds <= 60;

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 py-6 z-10">
      {/* Top Header Stats Bar */}
      <div
        id="quiz-stats-header"
        className={`rounded-2xl p-4 sm:p-5 mb-5 backdrop-blur-md border transition-all duration-300 shadow-lg ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700/70 shadow-cyan-950/20'
            : 'bg-white/90 border-slate-200/80 shadow-slate-200/40'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Quiz Title & Participant */}
          <div className="flex flex-col">
            <h2
              className={`text-base sm:text-lg font-bold truncate max-w-xs sm:max-w-md ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {quizTitle}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium text-slate-300 dark:text-slate-300">
                {studentName}
              </span>
            </div>
          </div>

          {/* Timer & Violations Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Timer Badge */}
            <div
              id="quiz-timer-badge"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm transition-all ${
                isTimeCritical
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700 text-cyan-400'
                  : 'bg-slate-100 border-slate-300 text-indigo-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>

            {/* Violations Counter */}
            <div
              id="quiz-violations-badge"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold tracking-wide ${
                violations === 0
                  ? theme === 'dark'
                    ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                  : violations === 1
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'bg-rose-500/20 border-rose-500/50 text-rose-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Violations: <strong className="font-mono">{violations}</strong> / 3
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Question Count */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>
              Question <strong className="text-cyan-400">{currentIndex + 1}</strong> of{' '}
              {totalQuestions}
            </span>
            <span>{Math.round(progressPercent)}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-700/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Real-time Violation Toast / Alert */}
      {violationAlert && (
        <div
          id="violation-alert-banner"
          className={`mb-4 p-3.5 rounded-xl border flex items-center justify-between gap-3 text-sm animate-bounce-short shadow-md ${
            violationAlert.type === 'danger'
              ? 'bg-rose-950/80 border-rose-500 text-rose-200'
              : 'bg-amber-950/80 border-amber-500 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{violationAlert.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setViolationAlert(null)}
            className="text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Question Card */}
      <div
        id="question-card"
        className={`rounded-2xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 shadow-2xl relative ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700/80 shadow-cyan-950/30'
            : 'bg-white/95 border-slate-200 shadow-slate-200/50'
        }`}
      >
        {/* Topic Tag if present */}
        {currentQ.topic && (
          <div className="inline-block mb-3">
            <span
              className={`text-[11px] uppercase tracking-wider font-mono font-semibold px-2.5 py-1 rounded-md border ${
                theme === 'dark'
                  ? 'bg-slate-800/80 border-slate-700 text-cyan-400'
                  : 'bg-slate-100 border-slate-300 text-indigo-700'
              }`}
            >
              {currentQ.topic}
            </span>
          </div>
        )}

        {/* Question Text */}
        <h3
          id="question-text"
          className={`text-lg sm:text-xl font-bold leading-snug mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          {currentQ.question}
        </h3>

        {/* 4 Answer Options */}
        <div className="space-y-3 mb-6" role="radiogroup" aria-label="Answer options">
          {currentQ.shuffledOptions.map((option, idx) => {
            const isSelected = userAnswers[currentIndex] === option;
            const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <button
                key={`${currentQ.id}-${option}-${idx}`}
                id={`option-${idx}`}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group select-none ${
                  isSelected
                    ? theme === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/50'
                      : 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                    : theme === 'dark'
                    ? 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950'
                        : theme === 'dark'
                        ? 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                        : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className="text-sm sm:text-base font-medium leading-relaxed">
                    {option}
                  </span>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full border shrink-0 ${
                      theme === 'dark' ? 'border-slate-600' : 'border-slate-300'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Validation Warning when clicking Next/Submit without selecting */}
        {validationError && (
          <div
            id="validation-error-msg"
            className="mb-6 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Navigation Buttons: Previous, Next / Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
          <button
            id="previous-question-btn"
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex === totalQuestions - 1 ? (
            <button
              id="submit-quiz-btn"
              type="button"
              onClick={handleSubmitClick}
              className="px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.98] transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Quiz</span>
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="next-question-btn"
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition-all shadow-md shadow-cyan-900/30 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Unanswered Questions */}
      {showUnansweredConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div
            id="unanswered-confirm-modal"
            className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <HelpCircle className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-bold">Unanswered Questions</h4>
            </div>
            <p className="text-sm leading-relaxed mb-6 opacity-90">
              You have unanswered questions. Are you sure you want to submit?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                id="cancel-submit-btn"
                type="button"
                onClick={() => setShowUnansweredConfirm(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                id="confirm-submit-anyway-btn"
                type="button"
                onClick={() => {
                  setShowUnansweredConfirm(false);
                  handleFinalSubmit('manual');
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
