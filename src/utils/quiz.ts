import { Question, QuizQuestion } from '../types';

/**
 * Fisher-Yates shuffle implementation
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Prepares a random selection of questions with shuffled options
 */
export function prepareQuizQuestions(
  allQuestions: Question[],
  count: number
): QuizQuestion[] {
  if (!allQuestions || allQuestions.length === 0) {
    return [];
  }

  // Shuffle all questions and take the requested count
  const shuffledQuestions = shuffleArray(allQuestions);
  const selected = shuffledQuestions.slice(0, Math.min(count, allQuestions.length));

  // For each question, shuffle its options while retaining the original question and answer
  return selected.map((q) => {
    // Ensure all 4 options are preserved
    const shuffledOptions = shuffleArray(q.options);
    return {
      ...q,
      shuffledOptions,
    };
  });
}

/**
 * Format seconds into MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.floor(Math.max(0, seconds) % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate unique certificate ID in the format QS-2026-XXXXXX
 */
export function generateCertificateId(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `QS-2026-${randomPart}`;
}

/**
 * Sanitize student name for filenames and safe display
 */
export function sanitizeName(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Student';
}
