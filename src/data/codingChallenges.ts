import { CodingProblem } from '../types';
import { PROBLEMS_1_TO_7 } from './codingChallenges/problems1to7';
import { PROBLEMS_8_TO_14 } from './codingChallenges/problems8to14';

export const ALL_CODING_PROBLEMS: CodingProblem[] = [
  ...PROBLEMS_1_TO_7,
  ...PROBLEMS_8_TO_14,
];
