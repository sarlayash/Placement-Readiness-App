export type RoleType =
  | 'Software Development Engineer'
  | 'Frontend Engineer'
  | 'Backend / Systems Engineer'
  | 'Full Stack Developer'
  | 'Data Analyst / Scientist'
  | 'Cloud & DevOps Engineer'
  | 'Product Analyst';

export type CompanyTier =
  | 'Tier-1 Big Tech (Google, Microsoft, Amazon)'
  | 'High-Growth Tech Unicorns (Razorpay, Swiggy, Uber)'
  | 'Mid-Size Product Companies'
  | 'Global IT & Consulting (TCS Digital, Accenture, Infosys SP)';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  targetRole: RoleType;
  targetCompanyTier: CompanyTier;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeHeadline: string;
  skills: string[];
  streakDays: number;
  avatarSeed: string;
}

export type AptitudeCategory = 'quantitative' | 'logical' | 'verbal';

export interface AptitudeQuestion {
  id: string;
  category: AptitudeCategory;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AptitudeAssessmentResult {
  id: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  categoryScores: Record<AptitudeCategory, { correct: number; total: number }>;
  readinessPointsDelta: number;
}

export interface CodingTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  category: 'Arrays & Hashing' | 'Two Pointers' | 'Stack & Queue' | 'Dynamic Programming' | 'Strings & Parsing' | 'Trees';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  testCases: CodingTestCase[];
  solutionHints: string[];
  targetTimeComplexity: string;
  targetSpaceComplexity: string;
}

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs?: number;
  error?: string;
}

export interface CodingSubmission {
  problemId: string;
  language: string;
  code: string;
  passedCount: number;
  totalCount: number;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Evaluating';
  timestamp: string;
  aiReview?: {
    timeComplexity: string;
    spaceComplexity: string;
    feedback: string;
    improvements: string[];
    interviewTips: string;
  };
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'DSA & Algorithms' | 'Aptitude & Logic' | 'Core CS Fundamentals' | 'Development & Frameworks' | 'Soft Skills & Interviews';
  level: number; // 0 to 100
  targetLevel: number;
  isVerified: boolean;
  lastAssessed?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Assessment' | 'Coding' | 'Skill' | 'Streak' | 'Readiness' | 'Milestone';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours: number;
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  goal: string;
  milestones: RoadmapMilestone[];
  recommendedTools: string[];
  completionScoreTarget: string;
}

export interface PersonalizedRoadmap {
  source: 'gemini' | 'fallback';
  lastUpdated: string;
  overview: string;
  strengths: string[];
  focusGaps: string[];
  phases: RoadmapPhase[];
}

export interface ReadinessScoreBreakdown {
  overallScore: number; // 0 - 1000
  percentile: number; // e.g. 88
  codingScore: number; // max 350
  aptitudeScore: number; // max 250
  coreSkillsScore: number; // max 200
  profileStrengthScore: number; // max 100
  practiceStreakScore: number; // max 100
  tierProbabilities: {
    tier1Tech: number;
    unicorns: number;
    midProduct: number;
    itConsulting: number;
  };
  strengths: string[];
  weaknesses: string[];
}
