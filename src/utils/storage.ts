import { Question, QuizConfig, ParticipantResult, CertificateData, AdminCredentials } from '../types';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

export const STORAGE_KEYS = {
  QUIZ_CONFIG: 'quizConfig',
  QUESTION_BANK: 'questionBank',
  QUIZ_RESULTS: 'quizResults',
  LAST_QUIZ_RESULT: 'lastQuizResult',
  CERTIFICATE_DATA: 'certificateData',
  THEME: 'theme',
  ADMIN_CREDENTIALS: 'adminCredentials',
} as const;

export const DEFAULT_CONFIG: QuizConfig = {
  quizTitle: 'ECE Digital Electronics Quiz',
  questionCount: 10,
  durationMinutes: 10,
};

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'admin123',
};

export function getStoredAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.username === 'string' &&
        parsed.username.trim().length > 0 &&
        typeof parsed.password === 'string' &&
        parsed.password.length > 0
      ) {
        return {
          username: parsed.username.trim(),
          password: parsed.password,
        };
      }
    }
    // Only initialize default credentials if the key does not exist
    if (raw === null) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_CREDENTIALS, JSON.stringify(DEFAULT_ADMIN_CREDENTIALS));
    }
  } catch (e) {
    console.error('Failed to read admin credentials from localStorage', e);
  }
  return DEFAULT_ADMIN_CREDENTIALS;
}

export function setStoredAdminCredentials(creds: AdminCredentials): void {
  try {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_CREDENTIALS,
      JSON.stringify({
        username: creds.username.trim(),
        password: creds.password,
      })
    );
  } catch (e) {
    console.error('Failed to save admin credentials to localStorage', e);
  }
}

export function resetStoredAdminCredentials(): AdminCredentials {
  setStoredAdminCredentials(DEFAULT_ADMIN_CREDENTIALS);
  return DEFAULT_ADMIN_CREDENTIALS;
}

export function getStoredTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    console.error('Failed to read theme from localStorage', e);
  }
  return 'dark'; // Default theme
}

export function setStoredTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Failed to save theme to localStorage', e);
  }
}

export function getStoredConfig(): QuizConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        quizTitle: typeof parsed.quizTitle === 'string' && parsed.quizTitle.trim() ? parsed.quizTitle : DEFAULT_CONFIG.quizTitle,
        questionCount: typeof parsed.questionCount === 'number' && parsed.questionCount > 0 ? parsed.questionCount : DEFAULT_CONFIG.questionCount,
        durationMinutes: typeof parsed.durationMinutes === 'number' && parsed.durationMinutes > 0 ? parsed.durationMinutes : DEFAULT_CONFIG.durationMinutes,
      };
    }
  } catch (e) {
    console.error('Failed to load quiz config from localStorage', e);
  }
  return DEFAULT_CONFIG;
}

export function setStoredConfig(config: QuizConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUIZ_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save quiz config to localStorage', e);
  }
}

export function getStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTION_BANK);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load questions from localStorage', e);
  }
  // Initialize with default questions
  setStoredQuestions(DEFAULT_QUESTIONS);
  return DEFAULT_QUESTIONS;
}

export function setStoredQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTION_BANK, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save questions to localStorage', e);
  }
}

export function getStoredResults(): ParticipantResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load quiz results from localStorage', e);
  }
  return [];
}

export function addStoredResult(result: ParticipantResult): void {
  try {
    const results = getStoredResults();
    // Do not overwrite previous results; append newest at the top
    results.unshift(result);
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
    localStorage.setItem(STORAGE_KEYS.LAST_QUIZ_RESULT, JSON.stringify(result));
  } catch (e) {
    console.error('Failed to append quiz result to localStorage', e);
  }
}

export function getLastStoredResult(): ParticipantResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_QUIZ_RESULT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load last quiz result from localStorage', e);
  }
  return null;
}

export function clearStoredResults(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.LAST_QUIZ_RESULT);
    localStorage.removeItem(STORAGE_KEYS.CERTIFICATE_DATA);
  } catch (e) {
    console.error('Failed to clear results from localStorage', e);
  }
}

export function getStoredCertificateData(): CertificateData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CERTIFICATE_DATA);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load certificate data from localStorage', e);
  }
  return null;
}

export function setStoredCertificateData(data: CertificateData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATE_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save certificate data to localStorage', e);
  }
}
