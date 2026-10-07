import { Question } from '../../types';
import { PHYSICS_SS1_QUESTIONS } from './physics_ss1';
import { PHYSICS_SS2_QUESTIONS } from './physics_ss2';
import { PHYSICS_SS3_QUESTIONS } from './physics_ss3';

/**
 * Complete JAMB UTME Physics Question Bank
 * 530 comprehensive questions spanning SS1 (Foundations), SS2 (Core Mechanics & Waves),
 * and SS3 (Advanced Fields & Modern Physics).
 * Powered by Rila Solutions
 */
export const PHYSICS_QUESTIONS: Question[] = [
  ...PHYSICS_SS1_QUESTIONS,
  ...PHYSICS_SS2_QUESTIONS,
  ...PHYSICS_SS3_QUESTIONS,
];
