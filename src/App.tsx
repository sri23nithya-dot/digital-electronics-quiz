import React, { useState, useEffect, useCallback } from 'react';
import {
  Question,
  QuizConfig,
  QuizQuestion,
  ParticipantResult,
  CertificateData,
  ViewMode,
  AdminCredentials,
} from './types';
import {
  getStoredTheme,
  setStoredTheme,
  getStoredConfig,
  setStoredConfig,
  getStoredQuestions,
  setStoredQuestions,
  getStoredResults,
  addStoredResult,
  getLastStoredResult,
  clearStoredResults,
  getStoredCertificateData,
  setStoredCertificateData,
  getStoredAdminCredentials,
  setStoredAdminCredentials,
  resetStoredAdminCredentials,
} from './utils/storage';
import { prepareQuizQuestions, generateCertificateId, formatTime } from './utils/quiz';

import { ThemeToggle } from './components/ThemeToggle';
import { BinaryBackground } from './components/BinaryBackground';
import { ParticipantHome } from './components/ParticipantHome';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { CertificateView } from './components/CertificateView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getStoredTheme());

  // Views: 'participant' | 'quiz' | 'result' | 'certificate' | 'adminDashboard'
  const [currentView, setCurrentView] = useState<ViewMode>('participant');

  // Admin login modal visibility
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // App Data
  const [config, setConfig] = useState<QuizConfig>(() => getStoredConfig());
  const [questions, setQuestions] = useState<Question[]>(() => getStoredQuestions());
  const [results, setResults] = useState<ParticipantResult[]>(() => getStoredResults());
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => getStoredAdminCredentials());

  // Active Quiz State
  const [studentName, setStudentName] = useState('');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentResult, setCurrentResult] = useState<ParticipantResult | null>(() => getLastStoredResult());
  const [certificateData, setCertificateData] = useState<CertificateData | null>(() => getStoredCertificateData());

  // Synchronize document theme class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Hidden keyboard shortcut: Ctrl + Shift + A (opens Admin login modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'A' || e.key === 'a')
      ) {
        e.preventDefault();
        setIsAdminLoginOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handler: Start Quiz for participant
  const handleStartQuiz = (name: string) => {
    setStudentName(name);
    // Randomly select configured questions and shuffle options
    const randomized = prepareQuizQuestions(questions, config.questionCount);
    setActiveQuizQuestions(randomized);
    setCurrentView('quiz');
  };

  // Handler: Quiz submission
  const handleQuizSubmit = useCallback(
    (resultData: Omit<ParticipantResult, 'id' | 'date' | 'certificateId'>) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const uniqueCertId = resultData.eligibleForCertificate
        ? generateCertificateId()
        : undefined;

      const fullResult: ParticipantResult = {
        ...resultData,
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        date: dateStr,
        certificateId: uniqueCertId,
        correct: resultData.correctAnswers,
        wrong: resultData.wrongAnswers,
        score: resultData.finalScore,
        timeTaken: formatTime(resultData.timeTakenSeconds),
        certificateEligible: resultData.eligibleForCertificate,
      };

      // Save result in localStorage
      addStoredResult(fullResult);
      setResults(getStoredResults());
      setCurrentResult(fullResult);

      // If eligible, prepare certificate data
      if (fullResult.eligibleForCertificate && uniqueCertId) {
        const cert: CertificateData = {
          certificateId: uniqueCertId,
          studentName: fullResult.studentName,
          quizTitle: fullResult.quizTitle,
          scoreDisplay: fullResult.finalScore,
          percentage: fullResult.percentage,
          date: dateStr,
          timeTakenFormatted: formatTime(fullResult.timeTakenSeconds),
          correctAnswers: fullResult.correctAnswers,
          totalQuestions: fullResult.totalQuestions,
        };
        setCertificateData(cert);
        setStoredCertificateData(cert);
      } else {
        setCertificateData(null);
      }

      setCurrentView('result');
    },
    []
  );

  // Handler: Generate Certificate
  const handleGenerateCertificate = () => {
    if (!currentResult || !currentResult.eligibleForCertificate) return;

    let certId = currentResult.certificateId;
    if (!certId) {
      certId = generateCertificateId();
      currentResult.certificateId = certId;
    }
    const cert: CertificateData = {
      certificateId: certId,
      studentName: currentResult.studentName,
      quizTitle: currentResult.quizTitle,
      scoreDisplay: currentResult.finalScore,
      percentage: currentResult.percentage,
      date: currentResult.date,
      timeTakenFormatted: formatTime(currentResult.timeTakenSeconds),
      correctAnswers: currentResult.correctAnswers,
      totalQuestions: currentResult.totalQuestions,
    };
    setCertificateData(cert);
    setStoredCertificateData(cert);
    setCurrentView('certificate');
  };

  // Handler: Retake Quiz
  const handleRetakeQuiz = () => {
    setCurrentView('participant');
  };

  // Admin Actions
  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setResults(getStoredResults());
    setAdminCredentials(getStoredAdminCredentials());
    setCurrentView('adminDashboard');
  };

  const handleAdminLogout = () => {
    setCurrentView('participant');
  };

  const handleUpdateCredentials = (newCreds: AdminCredentials) => {
    setStoredAdminCredentials(newCreds);
    setAdminCredentials(newCreds);
  };

  const handleResetCredentials = () => {
    const resetCreds = resetStoredAdminCredentials();
    setAdminCredentials(resetCreds);
  };

  const handleSaveConfig = (newConfig: QuizConfig) => {
    setConfig(newConfig);
    setStoredConfig(newConfig);
  };

  const handleUpdateQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setStoredQuestions(newQuestions);
  };

  const handleClearResults = () => {
    clearStoredResults();
    setResults([]);
    setCurrentResult(null);
    setCertificateData(null);
  };

  return (
    <div
      id="app-root-container"
      className={`min-h-screen relative flex flex-col font-sans transition-colors duration-500 overflow-x-hidden ${
        theme === 'dark'
          ? 'bg-[#060B18] text-slate-100'
          : 'bg-[#F0F4FA] text-slate-900'
      }`}
    >
      {/* Background with floating binary particles */}
      <BinaryBackground theme={theme} />

      {/* Persistent App Header */}
      <header
        id="app-header"
        className={`relative z-20 w-full px-4 sm:px-8 py-3.5 border-b backdrop-blur-md transition-colors duration-300 no-print ${
          theme === 'dark'
            ? 'bg-slate-950/60 border-slate-800/80'
            : 'bg-white/70 border-indigo-100/80 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => {
              if (currentView !== 'quiz') {
                setCurrentView('participant');
              }
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              Ω
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-sm sm:text-base">
                ECE QUIZ <span className="text-cyan-500">SIMULATOR</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Digital Electronics
              </span>
            </div>
          </div>

          {/* Header Controls (Theme Toggle only; NO admin button shown to participants!) */}
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col justify-center items-center relative z-10 w-full py-4">
        {/* VIEW 1: PARTICIPANT HOME SCREEN */}
        {currentView === 'participant' && (
          <ParticipantHome
            theme={theme}
            config={config}
            availableQuestionsCount={questions.length}
            onStartQuiz={handleStartQuiz}
            onSecretAdminTrigger={() => setIsAdminLoginOpen(true)}
          />
        )}

        {/* VIEW 2: QUIZ SCREEN */}
        {currentView === 'quiz' && (
          <QuizScreen
            theme={theme}
            quizTitle={config.quizTitle}
            studentName={studentName}
            questions={activeQuizQuestions}
            durationMinutes={config.durationMinutes}
            onSubmit={handleQuizSubmit}
          />
        )}

        {/* VIEW 3: RESULT SCREEN */}
        {currentView === 'result' && currentResult && (
          <ResultScreen
            theme={theme}
            result={currentResult}
            onRetakeQuiz={handleRetakeQuiz}
            onGenerateCertificate={handleGenerateCertificate}
          />
        )}

        {/* VIEW 4: CERTIFICATE VIEW */}
        {currentView === 'certificate' && certificateData && (
          <CertificateView
            theme={theme}
            certificateData={certificateData}
            onBackToResults={() => setCurrentView('result')}
            onRetakeQuiz={handleRetakeQuiz}
          />
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {currentView === 'adminDashboard' && (
          <AdminDashboard
            theme={theme}
            config={config}
            questions={questions}
            results={results}
            onSaveConfig={handleSaveConfig}
            onUpdateQuestions={handleUpdateQuestions}
            onClearResults={handleClearResults}
            onLogout={handleAdminLogout}
            adminCredentials={adminCredentials}
            onUpdateCredentials={handleUpdateCredentials}
            onResetCredentials={handleResetCredentials}
          />
        )}
      </main>

      {/* Hidden Admin Access Modal (Ctrl + Shift + A) */}
      <AdminLoginModal
        theme={theme}
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Minimal Footer */}
      <footer
        id="app-footer"
        className={`relative z-10 py-4 px-4 text-center text-[11px] transition-colors no-print ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        <p>
          ECE Digital Electronics Quiz Simulator &bull; Academic Evaluation Platform &bull; Built with React &amp; TypeScript
        </p>
      </footer>
    </div>
  );
}
