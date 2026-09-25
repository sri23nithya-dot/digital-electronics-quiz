import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Settings,
  LogOut,
  Upload,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  Layers,
  Award,
  Search,
  Download,
  Users,
  Eye,
  EyeOff,
  X,
  BarChart3,
  Check,
  KeyRound,
  User,
  Lock,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { Question, QuizConfig, ParticipantResult, AdminCredentials } from '../types';
import { formatTime } from '../utils/quiz';
import { getStoredAdminCredentials, setStoredAdminCredentials, resetStoredAdminCredentials } from '../utils/storage';

interface AdminDashboardProps {
  theme: 'dark' | 'light';
  config: QuizConfig;
  questions: Question[];
  results: ParticipantResult[];
  onSaveConfig: (newConfig: QuizConfig) => void;
  onUpdateQuestions: (newQuestions: Question[]) => void;
  onClearResults: () => void;
  onLogout: () => void;
  adminCredentials?: AdminCredentials;
  onUpdateCredentials?: (creds: AdminCredentials) => void;
  onResetCredentials?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  theme,
  config,
  questions,
  results,
  onSaveConfig,
  onUpdateQuestions,
  onClearResults,
  onLogout,
  adminCredentials: propAdminCredentials,
  onUpdateCredentials: propOnUpdateCredentials,
  onResetCredentials: propOnResetCredentials,
}) => {
  // Navigation tabs: 'overview' | 'results' | 'bank' | 'settings' | 'account'
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'bank' | 'settings' | 'account'>('overview');

  // Form states for Quiz Settings
  const [quizTitle, setQuizTitle] = useState(config.quizTitle);
  const [questionCount, setQuestionCount] = useState(config.questionCount);
  const [durationMinutes, setDurationMinutes] = useState(config.durationMinutes);

  // Status banners
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Results search & filter states
  const [participantSearch, setParticipantSearch] = useState('');
  const [certificateFilter, setCertificateFilter] = useState<'all' | 'eligible' | 'not-available'>('all');

  // Question search filter
  const [questionSearch, setQuestionSearch] = useState('');

  // Selected result for detail view modal
  const [selectedResult, setSelectedResult] = useState<ParticipantResult | null>(null);

  // Confirmation modal for clear results
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Admin Account Settings states
  const [currentCredentials, setCurrentCredentials] = useState<AdminCredentials>(() => {
    return propAdminCredentials || getStoredAdminCredentials();
  });
  const [currentUsernameInput, setCurrentUsernameInput] = useState(() => {
    return propAdminCredentials?.username || getStoredAdminCredentials().username;
  });
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountSuccessMsg, setAccountSuccessMsg] = useState('');
  const [accountErrorMsg, setAccountErrorMsg] = useState('');
  const [showResetCredsConfirm, setShowResetCredsConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Keep local credentials state in sync if prop changes
  useEffect(() => {
    const creds = propAdminCredentials || getStoredAdminCredentials();
    setCurrentCredentials(creds);
    setCurrentUsernameInput(creds.username);
  }, [propAdminCredentials]);

  // 1. CALCULATE SUMMARY METRICS
  const uniqueParticipantsCount = useMemo(() => {
    const uniqueNames = new Set(
      results
        .map((r) => r.studentName.trim().toLowerCase())
        .filter((name) => name.length > 0)
    );
    return uniqueNames.size;
  }, [results]);

  const totalAttemptsCount = results.length;

  const averageScorePercentage = useMemo(() => {
    if (results.length === 0) return 0;
    const totalPercentage = results.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    return Math.round(totalPercentage / results.length);
  }, [results]);

  const certificatesIssuedCount = useMemo(() => {
    return results.filter((r) => (r.percentage || 0) >= 80).length;
  }, [results]);

  // 2. FILTERED RESULTS LIST
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      // Search filter by student name
      if (participantSearch.trim()) {
        const query = participantSearch.trim().toLowerCase();
        if (!r.studentName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Certificate eligibility filter
      if (certificateFilter === 'eligible') {
        return (r.percentage || 0) >= 80;
      }
      if (certificateFilter === 'not-available') {
        return (r.percentage || 0) < 80;
      }

      return true;
    });
  }, [results, participantSearch, certificateFilter]);

  // 3. EXPORT RESULTS AS CSV
  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Student Name',
      'Quiz Title',
      'Score',
      'Percentage',
      'Correct',
      'Wrong',
      'Unanswered',
      'Time Taken',
      'Violations',
      'Certificate Status',
      'Certificate ID',
      'Date',
    ];

    const csvRows = results.map((r) => {
      const isEligible = (r.percentage || 0) >= 80;
      const certStatus = isEligible ? 'Available' : 'Not Available';
      const certId = r.certificateId || (isEligible ? 'Eligible' : 'N/A');
      const timeFormatted = r.timeTaken || formatTime(r.timeTakenSeconds);
      const scoreStr = r.finalScore || `${r.correctAnswers || r.correct || 0} / ${r.totalQuestions}`;

      return [
        `"${r.studentName.replace(/"/g, '""')}"`,
        `"${r.quizTitle.replace(/"/g, '""')}"`,
        `"${scoreStr}"`,
        `"${(r.percentage || 0).toFixed(1)}%"`,
        r.correctAnswers ?? r.correct ?? 0,
        r.wrongAnswers ?? r.wrong ?? 0,
        r.unanswered ?? 0,
        `"${timeFormatted}"`,
        r.violations ?? 0,
        `"${certStatus}"`,
        `"${certId}"`,
        `"${r.date}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ECE_Quiz_Results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 4. HANDLE SAVE QUIZ CONFIGURATION
  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: QuizConfig = {
      quizTitle: quizTitle.trim() || 'ECE Digital Electronics Quiz',
      questionCount: Math.min(questionCount, questions.length),
      durationMinutes,
    };
    onSaveConfig(updated);
    setSaveSuccessMsg('Configuration saved successfully.');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // 5. HANDLE ADMIN ACCOUNT CREDENTIALS UPDATE
  const handleUpdateAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountErrorMsg('');
    setAccountSuccessMsg('');

    // Fresh validation from stored credentials
    const freshCreds = getStoredAdminCredentials();

    // If current username is provided/edited, verify it matches
    if (currentUsernameInput.trim() && currentUsernameInput.trim() !== freshCreds.username) {
      setAccountErrorMsg('Current username is incorrect.');
      return;
    }

    const trimmedUser = newUsername.trim();

    // 1. Validate that the username is not empty
    if (!trimmedUser) {
      setAccountErrorMsg('Username cannot be empty.');
      return;
    }

    // 2. Validate that the password is not empty
    if (!newPassword) {
      setAccountErrorMsg('Password cannot be empty.');
      return;
    }

    // 3. Validate that New Password and Confirm New Password match
    if (newPassword !== confirmPassword) {
      setAccountErrorMsg('New Password and Confirm New Password do not match.');
      return;
    }

    // 4 & 5. Save the new credentials securely in localStorage using dedicated key adminCredentials
    const updatedCreds: AdminCredentials = {
      username: trimmedUser,
      password: newPassword,
    };

    setStoredAdminCredentials(updatedCreds);
    setCurrentCredentials(updatedCreds);
    setCurrentUsernameInput(updatedCreds.username);
    if (propOnUpdateCredentials) {
      propOnUpdateCredentials(updatedCreds);
    }

    // Clear password input fields after saving (never leave actual password in forms)
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setAccountSuccessMsg('Admin credentials updated successfully.');
    setTimeout(() => setAccountSuccessMsg(''), 5000);
  };

  // 6. HANDLE RESET ADMIN CREDENTIALS TO DEFAULT
  const handleConfirmResetCredentials = () => {
    const defaultCreds = resetStoredAdminCredentials();
    setCurrentCredentials(defaultCreds);
    setCurrentUsernameInput(defaultCreds.username);
    if (propOnResetCredentials) {
      propOnResetCredentials();
    }
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setAccountErrorMsg('');
    setShowResetCredsConfirm(false);
    setAccountSuccessMsg('Admin credentials reset successfully.');
    setTimeout(() => setAccountSuccessMsg(''), 5000);
  };

  // 7. HANDLE JSON QUESTION BANK UPLOAD & VALIDATION
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setUploadStatus({
        type: 'error',
        message: 'Invalid file format. Please upload a .json file.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        let rawQuestionsList: unknown[] = [];
        let extractedTitle = '';

        if (Array.isArray(parsed)) {
          rawQuestionsList = parsed;
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.questions)) {
            rawQuestionsList = parsed.questions;
          }
          if (typeof parsed.quizTitle === 'string' && parsed.quizTitle.trim()) {
            extractedTitle = parsed.quizTitle.trim();
          }
        }

        if (!Array.isArray(rawQuestionsList) || rawQuestionsList.length === 0) {
          throw new Error('JSON must contain a valid non-empty "questions" array.');
        }

        const validatedList: Question[] = [];
        for (let i = 0; i < rawQuestionsList.length; i++) {
          const item = rawQuestionsList[i] as Partial<Question>;
          if (!item || typeof item !== 'object') {
            throw new Error(`Question at index ${i} is not a valid object.`);
          }
          if (typeof item.question !== 'string' || !item.question.trim()) {
            throw new Error(`Question at index ${i} is missing question text.`);
          }
          if (!Array.isArray(item.options) || item.options.length !== 4) {
            throw new Error(`Question "${item.question.slice(0, 30)}..." must have exactly 4 options.`);
          }
          const optionsClean = item.options.map((opt) => String(opt).trim());
          if (typeof item.answer !== 'string' || !item.answer.trim()) {
            throw new Error(`Question "${item.question.slice(0, 30)}..." is missing a valid answer.`);
          }
          const answerClean = String(item.answer).trim();
          if (!optionsClean.includes(answerClean)) {
            throw new Error(
              `Question "${item.question.slice(0, 30)}...": Answer "${answerClean}" does not match any of the 4 options.`
            );
          }

          validatedList.push({
            id: typeof item.id === 'number' ? item.id : i + 1,
            question: item.question.trim(),
            options: optionsClean,
            answer: answerClean,
            topic: typeof item.topic === 'string' ? item.topic.trim() : undefined,
          });
        }

        onUpdateQuestions(validatedList);

        if (extractedTitle) {
          setQuizTitle(extractedTitle);
          onSaveConfig({
            ...config,
            quizTitle: extractedTitle,
            questionCount: Math.min(questionCount, validatedList.length),
          });
        } else {
          onSaveConfig({
            ...config,
            questionCount: Math.min(questionCount, validatedList.length),
          });
        }

        if (questionCount > validatedList.length) {
          setQuestionCount(validatedList.length);
        }

        setUploadStatus({
          type: 'success',
          message: `${validatedList.length} questions loaded successfully.`,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        setUploadStatus({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to parse JSON file.',
        });
      }
    };

    reader.readAsText(file);
  };

  // Export current question bank as JSON
  const handleExportJSON = () => {
    const data = {
      quizTitle,
      questions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_bank_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered preview questions
  const filteredQuestions = questions.filter((q) => {
    if (!questionSearch) return true;
    const qLower = questionSearch.toLowerCase();
    return (
      q.question.toLowerCase().includes(qLower) ||
      (q.topic && q.topic.toLowerCase().includes(qLower)) ||
      q.answer.toLowerCase().includes(qLower)
    );
  });

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 z-10">
      {/* Top Admin Header Bar */}
      <div
        id="admin-dashboard-header"
        className={`p-5 sm:p-6 rounded-2xl mb-6 backdrop-blur-md border flex flex-wrap items-center justify-between gap-4 shadow-xl ${
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-700/80 shadow-cyan-950/30'
            : 'bg-white/95 border-slate-200 shadow-slate-200/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 id="admin-dashboard-title" className="text-xl sm:text-2xl font-black tracking-tight">
              Quiz Admin Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              ECE Digital Electronics Management Console
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Visible Logout Button */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <div
            className={`p-1 rounded-xl border flex items-center flex-wrap gap-1 ${
              theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              id="admin-tab-overview"
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              id="admin-tab-results"
              type="button"
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Results</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/40">
                {results.length}
              </span>
            </button>
            <button
              id="admin-tab-bank"
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bank'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Question Bank</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900/40">
                {questions.length}
              </span>
            </button>
            <button
              id="admin-tab-settings"
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Quiz Settings</span>
            </button>
            {/* NEW TAB: Admin Account */}
            <button
              id="admin-tab-account"
              type="button"
              onClick={() => {
                setActiveTab('account');
                setAccountSuccessMsg('');
                setAccountErrorMsg('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'account'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Admin Account</span>
            </button>
          </div>

          {/* Visible Logout button */}
          <button
            id="admin-logout-btn"
            type="button"
            onClick={onLogout}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 border border-slate-700'
                : 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: OVERVIEW SUMMARY CARDS */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. TOTAL PARTICIPANTS (Unique students) */}
            <div
              id="metric-total-participants"
              className={`p-5 rounded-2xl border transition-all shadow-lg ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-white border-slate-200 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                  Total Participants
                </span>
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight text-cyan-400 font-mono">
                {uniqueParticipantsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Unique student names evaluated
              </p>
            </div>

            {/* 2. TOTAL ATTEMPTS */}
            <div
              id="metric-total-attempts"
              className={`p-5 rounded-2xl border transition-all shadow-lg ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-white border-slate-200 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                  Total Attempts
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight text-indigo-400 font-mono">
                {totalAttemptsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Total quiz submissions recorded
              </p>
            </div>

            {/* 3. AVERAGE SCORE */}
            <div
              id="metric-average-score"
              className={`p-5 rounded-2xl border transition-all shadow-lg ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-white border-slate-200 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                  Average Score
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight text-blue-400 font-mono">
                {averageScorePercentage}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Mean across all submissions
              </p>
            </div>

            {/* 4. CERTIFICATES ISSUED (>= 80%) */}
            <div
              id="metric-certificates-issued"
              className={`p-5 rounded-2xl border transition-all shadow-lg ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-white border-slate-200 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
                  Certificates Issued
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black tracking-tight text-emerald-400 font-mono">
                {certificatesIssuedCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Scored ≥ 80% passing threshold
              </p>
            </div>
          </div>

          {/* Quick Overview Summary & Shortcuts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <div
              className={`p-6 rounded-2xl border backdrop-blur-xl ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  id="overview-goto-results-btn"
                  type="button"
                  onClick={() => setActiveTab('results')}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800/60 border-slate-700 hover:border-cyan-500/60 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold">View Participant Results</div>
                      <div className="text-[11px] text-slate-400">{results.length} submissions recorded</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">&rarr;</span>
                </button>

                <button
                  id="overview-goto-bank-btn"
                  type="button"
                  onClick={() => setActiveTab('bank')}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800/60 border-slate-700 hover:border-purple-500/60 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-bold">Manage Question Bank</div>
                      <div className="text-[11px] text-slate-400">{questions.length} questions available</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-purple-400 font-bold">&rarr;</span>
                </button>

                <button
                  id="overview-goto-settings-btn"
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800/60 border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold">Quiz Configuration</div>
                      <div className="text-[11px] text-slate-400">{config.questionCount} Qs &bull; {config.durationMinutes} min</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">&rarr;</span>
                </button>

                <button
                  id="overview-goto-account-btn"
                  type="button"
                  onClick={() => setActiveTab('account')}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800/60 border-slate-700 hover:border-amber-500/60 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold">Admin Account Settings</div>
                      <div className="text-[11px] text-slate-400">Current: {currentCredentials.username}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">&rarr;</span>
                </button>
              </div>
            </div>

            {/* Recent Submissions List */}
            <div
              className={`lg:col-span-2 p-6 rounded-2xl border backdrop-blur-xl ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Recent Submissions
                </h3>
                {results.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('results')}
                    className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Users className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-xs font-medium">No quiz attempts submitted yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Participant attempts will populate metrics here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {results.slice(0, 4).map((r, idx) => (
                    <div
                      key={r.id || idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        theme === 'dark'
                          ? 'bg-slate-800/40 border-slate-700/50'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                            (r.percentage || 0) >= 80
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {Math.round(r.percentage || 0)}%
                        </div>
                        <div>
                          <div className="font-bold text-slate-200 dark:text-slate-100">
                            {r.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Score: {r.finalScore || `${r.correctAnswers || r.correct || 0}/${r.totalQuestions}`} &bull; {r.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(r.percentage || 0) >= 80 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Certificate
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">Not Eligible</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedResult(r)}
                          className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold text-[10px] transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PARTICIPANT RESULTS TABLE & CONTROLS */}
      {/* ============================================================ */}
      {activeTab === 'results' && (
        <div
          className={`p-6 rounded-2xl border backdrop-blur-xl shadow-xl ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-700/80'
              : 'bg-white/95 border-slate-200 shadow-slate-200/50'
          }`}
        >
          {/* Header Row: Title & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold">
                Participant Results ({results.length} total)
              </h3>
              <p className="text-xs text-slate-400">
                Independent records stored in localStorage. Search, inspect details or export to CSV.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {results.length > 0 && (
                <>
                  {/* Export Results as CSV */}
                  <button
                    id="export-results-csv-btn"
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Results (CSV)</span>
                  </button>

                  {/* Clear All Results */}
                  <button
                    id="clear-all-results-btn"
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-700/50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Results</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {/* Search participant input */}
            <div className="relative sm:col-span-2">
              <input
                id="search-participant-input"
                type="text"
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                placeholder="Search participant by name..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              {participantSearch && (
                <button
                  type="button"
                  onClick={() => setParticipantSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter dropdown */}
            <div className="relative">
              <select
                id="filter-results-select"
                value={certificateFilter}
                onChange={(e) => setCertificateFilter(e.target.value as 'all' | 'eligible' | 'not-available')}
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 border-slate-700 text-white focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                }`}
              >
                <option value="all">All Results</option>
                <option value="eligible">Certificate Eligible (≥ 80%)</option>
                <option value="not-available">Certificate Not Available (&lt; 80%)</option>
              </select>
            </div>
          </div>

          {/* Results Table */}
          {filteredResults.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed rounded-xl border-slate-700/60">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-sm font-medium">
                {results.length === 0
                  ? 'No participant attempts logged yet.'
                  : 'No results match your search and filter criteria.'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {results.length === 0
                  ? 'Completed quiz attempts will appear here automatically.'
                  : 'Try adjusting your search query or filter.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-700/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <th className="p-3 font-mono font-bold w-12 text-center">No.</th>
                    <th className="p-3 font-bold">Student Name</th>
                    <th className="p-3 font-bold">Quiz Title</th>
                    <th className="p-3 font-bold">Score</th>
                    <th className="p-3 font-bold">Percentage</th>
                    <th className="p-3 font-bold">Correct</th>
                    <th className="p-3 font-bold">Wrong</th>
                    <th className="p-3 font-bold">Unanswered</th>
                    <th className="p-3 font-bold">Time Taken</th>
                    <th className="p-3 font-bold">Violations</th>
                    <th className="p-3 font-bold">Certificate</th>
                    <th className="p-3 font-bold">Date</th>
                    <th className="p-3 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20">
                  {filteredResults.map((r, idx) => {
                    const isPassed = (r.percentage || 0) >= 80;
                    const correctCount = r.correctAnswers ?? r.correct ?? 0;
                    const wrongCount = r.wrongAnswers ?? r.wrong ?? 0;
                    const unansweredCount = r.unanswered ?? 0;
                    const timeStr = r.timeTaken || formatTime(r.timeTakenSeconds);
                    const scoreDisplay = r.finalScore || `${correctCount} / ${r.totalQuestions}`;

                    return (
                      <tr
                        key={r.id || idx}
                        className={`transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-slate-800/40 text-slate-300'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="p-3 font-mono text-center text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-bold text-slate-100 dark:text-slate-100">
                          {r.studentName}
                        </td>
                        <td className="p-3 text-slate-400 max-w-[150px] truncate" title={r.quizTitle}>
                          {r.quizTitle}
                        </td>
                        <td className="p-3 font-mono font-bold text-cyan-400">
                          {scoreDisplay}
                        </td>
                        <td className="p-3 font-mono font-bold">
                          <span className={isPassed ? 'text-emerald-400' : 'text-amber-400'}>
                            {(r.percentage || 0).toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">
                          {correctCount}
                        </td>
                        <td className="p-3 font-mono text-rose-400 font-bold">
                          {wrongCount}
                        </td>
                        <td className="p-3 font-mono text-amber-400 font-bold">
                          {unansweredCount}
                        </td>
                        <td className="p-3 font-mono text-slate-400">
                          {timeStr}
                        </td>
                        <td className="p-3 font-mono">
                          <span className={r.violations > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                            {r.violations ?? 0}
                          </span>
                        </td>
                        <td className="p-3">
                          {isPassed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <Check className="w-3 h-3" />
                              <span>Available</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800/60 text-slate-400 border border-slate-700/60">
                              <span>Not Available</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                          {r.date}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            id={`view-result-btn-${idx}`}
                            type="button"
                            onClick={() => setSelectedResult(r)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: QUESTION BANK (JSON UPLOAD & PREVIEW) */}
      {/* ============================================================ */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          {/* Question Bank Controls Banner */}
          <div
            className={`p-6 rounded-2xl border backdrop-blur-xl shadow-xl ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700/80'
                : 'bg-white/95 border-slate-200 shadow-slate-200/50'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold">
                  Question Bank ({questions.length} questions loaded)
                </h3>
                <p className="text-xs text-slate-400">
                  Import question banks via JSON. Manual question creation is strictly disabled; all questions must come from valid JSON files.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="admin-json-file-input"
                />

                {/* Upload JSON Button */}
                <button
                  id="admin-upload-json-btn"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition-all shadow-md shadow-purple-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Question JSON</span>
                </button>

                {/* Export Current Bank */}
                <button
                  id="admin-export-bank-btn"
                  type="button"
                  onClick={handleExportJSON}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Upload Status Banner */}
            {uploadStatus && (
              <div
                id="admin-upload-status-msg"
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mt-4 ${
                  uploadStatus.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                    : 'bg-rose-500/15 border border-rose-500/40 text-rose-400'
                }`}
              >
                {uploadStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{uploadStatus.message}</span>
              </div>
            )}
          </div>

          {/* Question Bank Preview Table */}
          <div
            className={`p-6 rounded-2xl border backdrop-blur-xl shadow-xl ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700/80'
                : 'bg-white/95 border-slate-200 shadow-slate-200/50'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Question Bank Preview
                </h4>
                <p className="text-xs text-slate-500">
                  Read-only inspector for all questions in the bank.
                </p>
              </div>

              {/* Search Questions */}
              <div className="relative w-full sm:w-72">
                <input
                  id="admin-search-questions-input"
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Search questions, topics, or answers..."
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-medium outline-none ${
                    theme === 'dark'
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr
                    className={`border-b ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <th className="p-3 font-mono font-bold w-12 text-center">#</th>
                    <th className="p-3 font-bold w-1/3">Question</th>
                    <th className="p-3 font-bold">Options</th>
                    <th className="p-3 font-bold w-44">Correct Answer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20">
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">
                        No questions match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((q, idx) => (
                      <tr
                        key={q.id || idx}
                        className={`transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-slate-800/40 text-slate-300'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="p-3 font-mono text-center text-slate-400">
                          {q.id || idx + 1}
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-200 dark:text-slate-200">
                            {q.question}
                          </div>
                          {q.topic && (
                            <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
                              {q.topic}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="grid grid-cols-2 gap-1.5">
                            {q.options.map((opt, optIdx) => (
                              <span
                                key={optIdx}
                                className={`px-2 py-1 rounded text-[11px] truncate ${
                                  opt === q.answer
                                    ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                                    : 'bg-slate-800/30 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}: {opt}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            <CheckCircle className="w-3 h-3" />
                            <span>{q.answer}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: QUIZ SETTINGS CONFIGURATION */}
      {/* ============================================================ */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto">
          <div
            className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-xl shadow-xl ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700/80'
                : 'bg-white/95 border-slate-200 shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-6 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">
              <Settings className="w-4 h-4" />
              <span>General Quiz Settings</span>
            </div>

            <form onSubmit={handleSaveConfiguration} className="space-y-6">
              {/* Quiz Title */}
              <div>
                <label
                  htmlFor="admin-quiz-title-input"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-90"
                >
                  Quiz Title
                </label>
                <input
                  id="admin-quiz-title-input"
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="ECE Digital Electronics Quiz"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-800/80 border-slate-700 text-white focus:border-cyan-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Number of Questions */}
              <div>
                <label
                  htmlFor="admin-question-count-select"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-90"
                >
                  Number of Questions per Quiz (Available: {questions.length})
                </label>
                <select
                  id="admin-question-count-select"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800/80 border-slate-700 text-white focus:border-cyan-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                  }`}
                >
                  {[5, 10, 15, 20, 25, 30, 50, 75, 100]
                    .filter((num) => num <= questions.length)
                    .map((num) => (
                      <option key={num} value={num}>
                        {num} Questions
                      </option>
                    ))}
                  {!([5, 10, 15, 20, 25, 30, 50, 75, 100].includes(questions.length)) && (
                    <option value={questions.length}>
                      All {questions.length} Questions
                    </option>
                  )}
                </select>
                <p className="mt-1.5 text-xs text-slate-400">
                  Select how many questions are randomly pulled for each participant attempt.
                </p>
              </div>

              {/* Quiz Duration */}
              <div>
                <label
                  htmlFor="admin-duration-select"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-90"
                >
                  Quiz Duration
                </label>
                <select
                  id="admin-duration-select"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800/80 border-slate-700 text-white focus:border-cyan-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
                  }`}
                >
                  <option value={5}>5 Minutes</option>
                  <option value={10}>10 Minutes (Default)</option>
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>

              {/* Save Success Banner */}
              {saveSuccessMsg && (
                <div
                  id="admin-save-success-msg"
                  className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Save Configuration Button */}
              <button
                id="admin-save-config-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: ADMIN ACCOUNT SETTINGS */}
      {/* ============================================================ */}
      {activeTab === 'account' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div
            className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-xl shadow-xl ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700/80'
                : 'bg-white/95 border-slate-200 shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-6 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">
              <KeyRound className="w-4 h-4" />
              <span>Admin Account &amp; Authentication</span>
            </div>

            {/* Current Username Display */}
            <div className="mb-6 p-4 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Current Username
                  </div>
                  <div
                    id="admin-current-username-display"
                    className="text-base font-bold font-mono text-cyan-400"
                  >
                    {currentCredentials.username}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                Active Session
              </span>
            </div>

            {/* Account Credentials Form */}
            <form onSubmit={handleUpdateAdminCredentials} className="space-y-5">
              {/* Current Username */}
              <div>
                <label
                  htmlFor="admin-current-username-input"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-90"
                >
                  Current Username
                </label>
                <div className="relative">
                  <input
                    id="admin-current-username-input"
                    data-testid="admin-current-username"
                    name="currentUsername"
                    type="text"
                    value={currentUsernameInput}
                    onChange={(e) => {
                      setCurrentUsernameInput(e.target.value);
                      if (accountErrorMsg) setAccountErrorMsg('');
                    }}
                    placeholder="Current username"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                    }`}
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* New Username */}
              <div>
                <label
                  htmlFor="admin-new-username-input"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-90"
                >
                  New Username
                </label>
                <div className="relative">
                  <input
                    id="admin-new-username-input"
                    data-testid="admin-new-username"
                    name="newUsername"
                    type="text"
                    value={newUsername}
                    onChange={(e) => {
                      setNewUsername(e.target.value);
                      if (accountErrorMsg) setAccountErrorMsg('');
                    }}
                    placeholder="Enter new username"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                    }`}
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="admin-new-password-input"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-90"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="admin-new-password-input"
                    data-testid="admin-new-password"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (accountErrorMsg) setAccountErrorMsg('');
                    }}
                    placeholder="Enter new password"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="admin-confirm-password-input"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-90"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="admin-confirm-password-input"
                    data-testid="admin-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (accountErrorMsg) setAccountErrorMsg('');
                    }}
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message Banner */}
              {accountErrorMsg && (
                <div
                  id="admin-account-error-msg"
                  className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{accountErrorMsg}</span>
                </div>
              )}

              {/* Success Message Banner */}
              {accountSuccessMsg && (
                <div
                  id="admin-account-success-msg"
                  className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{accountSuccessMsg}</span>
                </div>
              )}

              {/* Update Button */}
              <button
                id="admin-update-credentials-btn"
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Update Admin Credentials</span>
              </button>
            </form>

            {/* Reset to Default Section */}
            <div className="mt-8 pt-6 border-t border-slate-700/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Reset to Default Demo Credentials
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Restores username to <strong>admin</strong> and password to <strong>admin123</strong>.
                </p>
              </div>

              <button
                id="admin-reset-credentials-btn"
                data-testid="reset-to-default-btn"
                type="button"
                onClick={() => setShowResetCredsConfirm(true)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border shrink-0 ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 border-slate-700 hover:border-rose-800/50'
                    : 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border-slate-200 hover:border-rose-300'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. VIEW DETAILED RESULT MODAL */}
      {/* ============================================================ */}
      {selectedResult && (
        <div
          id="detailed-result-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`w-full max-w-lg rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all relative overflow-hidden ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-white shadow-cyan-950/50'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Participant Result Details</h3>
                  <p className="text-xs text-slate-400">Detailed submission inspector</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Content Grid */}
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                <span className="text-slate-400 font-medium">Student Name:</span>
                <span className="font-bold text-sm text-cyan-400">{selectedResult.studentName}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                <span className="text-slate-400 font-medium">Quiz Title:</span>
                <span className="font-medium text-right">{selectedResult.quizTitle}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                <span className="text-slate-400 font-medium">Final Score:</span>
                <span className="font-mono font-bold text-sm text-cyan-400">
                  {selectedResult.finalScore || `${selectedResult.correctAnswers || selectedResult.correct || 0} / ${selectedResult.totalQuestions}`}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                <span className="text-slate-400 font-medium">Percentage:</span>
                <span className={`font-mono font-bold text-sm ${(selectedResult.percentage || 0) >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {(selectedResult.percentage || 0).toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-[10px] text-emerald-400 font-semibold">Correct</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">
                    {selectedResult.correctAnswers ?? selectedResult.correct ?? 0}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                  <div className="text-[10px] text-rose-400 font-semibold">Wrong</div>
                  <div className="text-sm font-bold font-mono text-rose-400">
                    {selectedResult.wrongAnswers ?? selectedResult.wrong ?? 0}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <div className="text-[10px] text-amber-400 font-semibold">Unanswered</div>
                  <div className="text-sm font-bold font-mono text-amber-400">
                    {selectedResult.unanswered ?? 0}
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                <span className="text-slate-400 font-medium">Time Taken:</span>
                <span className="font-mono font-semibold">
                  {selectedResult.timeTaken || formatTime(selectedResult.timeTakenSeconds)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                <span className="text-slate-400 font-medium">Violations Logged:</span>
                <span className="font-mono font-semibold">
                  {selectedResult.violations ?? 0} / 3
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                <span className="text-slate-400 font-medium">Date:</span>
                <span>{selectedResult.date}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                <span className="text-slate-400 font-medium">Certificate Status:</span>
                <span>
                  {(selectedResult.percentage || 0) >= 80 ? (
                    <span className="text-emerald-400 font-bold">Available (≥ 80%)</span>
                  ) : (
                    <span className="text-slate-400">Not Available (&lt; 80%)</span>
                  )}
                </span>
              </div>

              {selectedResult.certificateId && (
                <div className="flex justify-between py-1.5 border-b border-slate-700/20">
                  <span className="text-slate-400 font-medium">Certificate ID:</span>
                  <span className="font-mono font-bold text-amber-400">{selectedResult.certificateId}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-700/30 flex justify-end">
              <button
                id="close-detailed-result-btn"
                type="button"
                onClick={() => setSelectedResult(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 8. CONFIRMATION MODAL FOR RESET ADMIN CREDENTIALS */}
      {/* ============================================================ */}
      {showResetCredsConfirm && (
        <div
          id="reset-admin-creds-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <RefreshCw className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-bold">Reset Admin Credentials</h4>
            </div>
            <p id="reset-admin-creds-confirm-prompt" className="text-sm leading-relaxed mb-6 opacity-90">
              Reset admin credentials to default?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                id="cancel-reset-creds-btn"
                type="button"
                onClick={() => setShowResetCredsConfirm(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                id="confirm-reset-creds-btn"
                type="button"
                onClick={handleConfirmResetCredentials}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 9. CONFIRMATION MODAL FOR CLEAR RESULTS */}
      {/* ============================================================ */}
      {showClearConfirm && (
        <div
          id="clear-results-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 mb-4 text-rose-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-bold">Clear All Results</h4>
            </div>
            <p className="text-sm leading-relaxed mb-6 opacity-90">
              Are you sure you want to delete all participant results?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                id="cancel-clear-results-btn"
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                id="confirm-delete-all-results-btn"
                type="button"
                onClick={() => {
                  onClearResults();
                  setShowClearConfirm(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                Delete All Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
