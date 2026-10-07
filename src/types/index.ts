export type SubjectId =
  | 'english'
  | 'mathematics'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'economics'
  | 'government'
  | 'literature'
  | 'commerce'
  | 'accounts'
  | 'crs'
  | 'computer'
  | 'geography'
  | 'agriculture'
  | 'technical_drawing'
  | 'further_math';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  code: string;
  category: 'compulsory' | 'science' | 'art' | 'commercial' | 'technical';
  color: string;
  icon: string;
  defaultQuestionsCount: number; // 60 for English, 40 for electives
  description: string;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  year: number;
  topic: string;
  section?: string;
  passage?: string;
  question: string;
  diagramType?: string;
  diagramSvg?: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export type ExamMode = 'full_mock' | 'subject_practice' | 'speed_drill' | 'novel_study';

export interface ExamConfig {
  mode: ExamMode;
  selectedSubjects: SubjectId[];
  durationMinutes: number;
  questionsPerSubject: Record<SubjectId, number>;
  selectedYear?: number | 'all';
  selectedTopic?: string | 'all';
  instantFeedback: boolean; // In practice mode: show explanation immediately
  shuffleQuestions: boolean;
  strictTimer: boolean;
}

export interface UserExamResponse {
  questionId: string;
  subjectId: SubjectId;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
}

export interface SubjectResult {
  subjectId: SubjectId;
  subjectName: string;
  score: number; // out of total
  totalQuestions: number;
  scaledScore: number; // out of 100 for UTME aggregate
  percentage: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  topicBreakdown: Record<string, { correct: number; total: number }>;
}

export interface ExamResult {
  id: string;
  candidateName: string;
  registrationNumber: string;
  examDate: string;
  mode: ExamMode;
  totalScore: number; // out of 400 for standard UTME
  maxScore: number;
  percentage: number;
  timeUsedSeconds: number;
  totalAllowedSeconds: number;
  subjectResults: SubjectResult[];
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  questions: Question[];
  passedThreshold: boolean;
}

export interface CandidateProfile {
  name: string;
  registrationNumber: string;
  preferredInstitution: string;
  preferredCourse: string;
  targetScore: number;
  subjectCombination: [SubjectId, SubjectId, SubjectId, SubjectId];
}

export interface UniversityCutoff {
  university: string;
  state: string;
  type: 'Federal' | 'State' | 'Private';
  generalCutoff: number;
  competitiveCoursesCutoff: {
    course: string;
    meritCutoff: number;
  }[];
}
