import { Question, SubjectId } from '../../types';
import { ENGLISH_QUESTIONS } from './english';
import { MATHEMATICS_QUESTIONS } from './mathematics';
import { PHYSICS_QUESTIONS } from './physics';
import { CHEMISTRY_QUESTIONS } from './chemistry';
import { BIOLOGY_QUESTIONS } from './biology';
import { ECONOMICS_QUESTIONS } from './economics';
import { GOVERNMENT_QUESTIONS } from './government';
import { LITERATURE_QUESTIONS } from './literature';
import { COMMERCE_QUESTIONS } from './commerce';
import { ACCOUNTS_QUESTIONS } from './accounts';
import { CRS_QUESTIONS } from './crs';
import { COMPUTER_QUESTIONS } from './computer';
import { GEOGRAPHY_QUESTIONS } from './geography';
import { AGRICULTURE_QUESTIONS } from './agriculture';
import { TECHNICAL_DRAWING_QUESTIONS } from './technical_drawing';
import { FURTHER_MATH_QUESTIONS } from './further_math';

export const ALL_QUESTIONS: Question[] = [
  ...ENGLISH_QUESTIONS,
  ...MATHEMATICS_QUESTIONS,
  ...PHYSICS_QUESTIONS,
  ...CHEMISTRY_QUESTIONS,
  ...BIOLOGY_QUESTIONS,
  ...ECONOMICS_QUESTIONS,
  ...GOVERNMENT_QUESTIONS,
  ...LITERATURE_QUESTIONS,
  ...COMMERCE_QUESTIONS,
  ...ACCOUNTS_QUESTIONS,
  ...CRS_QUESTIONS,
  ...COMPUTER_QUESTIONS,
  ...GEOGRAPHY_QUESTIONS,
  ...AGRICULTURE_QUESTIONS,
  ...TECHNICAL_DRAWING_QUESTIONS,
  ...FURTHER_MATH_QUESTIONS,
];

export function getQuestionsBySubject(subjectId: SubjectId): Question[] {
  return ALL_QUESTIONS.filter((q) => q.subjectId === subjectId);
}

export function getTopicsForSubject(subjectId: SubjectId): string[] {
  const questions = getQuestionsBySubject(subjectId);
  const topics = new Set<string>();
  questions.forEach((q) => topics.add(q.topic));
  return Array.from(topics);
}

export function getYearsForSubject(subjectId: SubjectId): number[] {
  const questions = getQuestionsBySubject(subjectId);
  const years = new Set<number>();
  questions.forEach((q) => years.add(q.year));
  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Normalizes question text for robust deduplication.
 * Strips HTML tags, punctuation, whitespace, and lowercases text so semantically
 * identical questions are detected even if whitespace or casing varies.
 */
export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // remove HTML tags like <ins> or <b>
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// Generate questions for an exam configuration with STRICT NO-DUPLICATION GUARANTEE
export function generateExamQuestions(
  subjectIds: SubjectId[],
  countPerSubject: Record<SubjectId, number>,
  options?: {
    year?: number | 'all';
    topic?: string | 'all';
    shuffle?: boolean;
  }
): Question[] {
  const result: Question[] = [];
  const globalSeenIds = new Set<string>();
  const globalSeenTexts = new Set<string>();

  subjectIds.forEach((subId) => {
    let pool = getQuestionsBySubject(subId);

    if (options?.year && options.year !== 'all') {
      pool = pool.filter((q) => q.year === options.year);
    }

    if (options?.topic && options.topic !== 'all') {
      pool = pool.filter((q) => q.topic === options.topic);
    }

    let subjectList = [...pool];
    if (options?.shuffle !== false) {
      subjectList = shuffleArray(subjectList);
    }

    const targetCount = countPerSubject[subId] || (subId === 'english' ? 60 : 40);
    const selectedForSubject: Question[] = [];

    // Pass 1: Select non-duplicate questions from filtered pool
    for (const q of subjectList) {
      const normText = normalizeQuestionText(q.question);
      if (!globalSeenIds.has(q.id) && !globalSeenTexts.has(normText)) {
        globalSeenIds.add(q.id);
        globalSeenTexts.add(normText);
        selectedForSubject.push(q);
        if (selectedForSubject.length >= targetCount) break;
      }
    }

    // Pass 2: If target count not yet reached (e.g. topic filter had fewer than target),
    // fill remaining from the general subject pool, still enforcing strict non-duplication
    if (selectedForSubject.length < targetCount) {
      const remainingPool = shuffleArray(
        getQuestionsBySubject(subId).filter(
          (q) => !globalSeenIds.has(q.id) && !globalSeenTexts.has(normalizeQuestionText(q.question))
        )
      );

      for (const q of remainingPool) {
        const normText = normalizeQuestionText(q.question);
        if (!globalSeenIds.has(q.id) && !globalSeenTexts.has(normText)) {
          globalSeenIds.add(q.id);
          globalSeenTexts.add(normText);
          selectedForSubject.push(q);
          if (selectedForSubject.length >= targetCount) break;
        }
      }
    }

    result.push(...selectedForSubject);
  });

  return result;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
