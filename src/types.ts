export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  topic?: string;
}

export interface QuizQuestion extends Question {
  shuffledOptions: string[];
}

export interface QuizConfig {
  quizTitle: string;
  questionCount: number;
  durationMinutes: number;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface ParticipantResult {
  id: string;
  studentName: string;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  percentage: number;
  finalScore: string;
  timeTakenSeconds: number;
  violations: number;
  date: string;
  eligibleForCertificate: boolean;
  certificateId?: string;
  submittedReason?: 'manual' | 'timer' | 'violations';
  // Additional aliases for prompt specification compatibility
  correct?: number;
  wrong?: number;
  score?: string;
  timeTaken?: string;
  certificateEligible?: boolean;
}

export interface CertificateData {
  certificateId: string;
  studentName: string;
  quizTitle: string;
  scoreDisplay: string;
  percentage: number;
  date: string;
  timeTakenFormatted: string;
  correctAnswers?: number;
  totalQuestions?: number;
}

export type ViewMode =
  | 'participant'
  | 'quiz'
  | 'result'
  | 'certificate'
  | 'adminDashboard';
