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
  photoURL?: string;
  // Rewards & UPI Payout credentials (500 XP = 100 INR)
  upiId?: string;
  mobileNumber?: string;
  earnedXp?: number;
  redeemedXp?: number;
  totalInrEarned?: number;
  welcomeBonusAwarded?: boolean;
}

export type AssessmentCategory =
  | 'verbal'
  | 'soft_skills'
  | 'professional_writing'
  | 'business_communication'
  | 'emotional_intelligence'
  | 'coding'
  | 'excel'
  | 'sql'
  | 'power_bi'
  | 'ai'
  | 'generative_ai'
  | 'agentic_ai'
  | 'quantitative'
  | 'logical'
  | 'windows_endpoint'
  | 'linux_automation'
  | 'cloud_platform'
  | 'network_engineering'
  | 'cybersecurity_iam'
  | 'database_platforms'
  | 'observability_aiops'
  | 'servicenow_automation'
  | 'ai_architecture'
  | 'service_delivery_ops';

export type AptitudeCategory = AssessmentCategory;

export interface AptitudeQuestion {
  id: string;
  category: AssessmentCategory;
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
  categoryScores: Record<string, { correct: number; total: number }>;
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
    c?: string;
  };
  solvedSolutions?: {
    c: string;
    cpp: string;
    java: string;
    python: string;
    javascript?: string;
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
  id?: string;
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

export interface PlacementReadinessIndex {
  score: number; // 1 to 100
  tier: 'Tier-1 Elite' | 'Unicorn Ready' | 'Product Competitive' | 'Placement Ready' | 'Developing Core';
  tierLabel: string;
  badgeColor: string;
  percentile: number; // e.g. 88
  breakdown: {
    dailyAssessments: number; // max 40
    profileStrength: number; // max 25
    technicalProblemSolving: number; // max 20
    streakConsistency: number; // max 15
  };
  summary: string;
}

export interface ReadinessScoreBreakdown {
  overallScore: number; // 0 - 1000
  pri: PlacementReadinessIndex; // 1 - 100 Placement Readiness Index
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

export interface LearnerActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'assessment' | 'coding' | 'spinning_wheel' | 'badge' | 'login' | 'reward_claimed';
  module: string;
  scorePercentage?: number;
  pointsDelta?: number;
  bonusEarned?: boolean;
  details: string;
  timestamp: string;
}

export interface LearnerPerformanceSummary {
  id: string;
  fullName: string;
  email: string;
  college: string;
  targetRole: string;
  targetCompanyTier: string;
  streakDays: number;
  overallScore: number;
  codingScore: number;
  aptitudeScore: number;
  coreSkillsScore: number;
  testsCompleted: number;
  lastActive: string;
  bonusesWon: number;
  badgesUnlocked: number;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  upiId: string;
  mobileNumber: string;
  xpRedeemed: number;
  inrAmount: number;
  type: 'xp_redemption' | 'welcome_bonus';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  timestamp: string;
  transactionRef: string;
  note?: string;
}

export interface RewardsSummary {
  totalXp: number;
  redeemedXp: number;
  availableXp: number;
  redeemableInr: number;
  welcomeBonusEligible: boolean;
  welcomeBonusAwarded: boolean;
  welcomeBonusProgress: number;
  totalInrEarned: number;
  totalWithdrawableInr: number;
  hasPaymentDetails: boolean;
}
