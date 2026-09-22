import {
  StudentProfile,
  SkillItem,
  CodingSubmission,
  AptitudeAssessmentResult,
  RewardsSummary,
} from '../types';

export const XP_PER_INR_BLOCK = 500;
export const INR_PER_BLOCK = 100;
export const WELCOME_BONUS_THRESHOLD_XP = 500;
export const WELCOME_BONUS_INR = 200;

/**
 * Computes total cumulative XP earned by a student across all activities:
 * - Mock Tests & Assessments: Earned pointsDelta or accuracy-calibrated XP (10-50 XP per test)
 * - Coding & DSA Challenges: 100 XP per solved problem + passed test points
 * - Verified Skills: 50 XP per verified domain competency
 * - Practice Discipline: 25 XP per consecutive streak day
 * - Profile Completeness: up to 150 XP (including UPI ID and Mobile number)
 * - Plus explicit profile.earnedXp
 */
export function computeLearnerXP(
  profile: StudentProfile,
  skills: SkillItem[] = [],
  submissions: CodingSubmission[] = [],
  aptitudeResults: AptitudeAssessmentResult[] = []
): number {
  let xp = 0;

  // 1. Mock Tests / Assessments
  if (aptitudeResults && aptitudeResults.length > 0) {
    aptitudeResults.forEach((res) => {
      const delta = res.readinessPointsDelta ?? Math.round(res.scorePercentage * 0.4) + (res.correctAnswers * 5);
      xp += Math.max(15, delta);
    });
  } else {
    // New learner default starter XP if they've registered
    xp += 50;
  }

  // 2. Coding Challenges
  const accepted = submissions.filter((s) => s.status === 'Accepted');
  const distinctProblems = new Set(accepted.map((s) => s.problemId)).size;
  xp += distinctProblems * 100;

  const totalPassedCases = submissions.reduce((acc, cur) => acc + (cur.passedCount || 0), 0);
  xp += Math.min(150, totalPassedCases * 10);

  // 3. Verified Skills
  const verifiedCount = skills.filter((s) => s.isVerified).length;
  xp += verifiedCount * 50;

  // Non-zero skills progress contribution
  const activeSkillsCount = skills.filter((s) => (s.level || 0) > 0).length;
  xp += activeSkillsCount * 15;

  // 4. Streak Days (Discipline)
  if (profile.streakDays > 0) {
    xp += profile.streakDays * 25;
  }

  // 5. Profile Completeness XP
  let profileBonus = 0;
  if (profile.fullName && profile.fullName.trim().length > 2) profileBonus += 15;
  if (profile.college && profile.college.trim().length > 2) profileBonus += 25;
  if (profile.degree && profile.degree.trim().length > 1) profileBonus += 15;
  if (profile.cgpa > 0) profileBonus += 20;
  if (profile.targetRole) profileBonus += 20;
  if (profile.githubUrl && profile.githubUrl.length > 5) profileBonus += 20;
  if (profile.linkedinUrl && profile.linkedinUrl.length > 5) profileBonus += 15;
  if (profile.upiId && profile.upiId.trim().length > 3) profileBonus += 20; // Incentive to add UPI!
  if (profile.mobileNumber && profile.mobileNumber.trim().length >= 10) profileBonus += 20; // Incentive to add mobile!

  xp += Math.min(150, profileBonus);

  // 6. Explicitly stored bonus XP
  if (profile.earnedXp && profile.earnedXp > 0) {
    xp += profile.earnedXp;
  }

  return Math.round(xp);
}

/**
 * Calculates a structured Rewards summary for a learner.
 * - 500 XP = 100 INR
 * - Sign up + score 500 XP = 200 INR Welcome Bonus
 */
export function computeRewardsSummary(
  totalXp: number,
  profile: StudentProfile
): RewardsSummary {
  const redeemedXp = profile.redeemedXp || 0;
  const availableXp = Math.max(0, totalXp - redeemedXp);
  const redeemableInr = Math.floor(availableXp / XP_PER_INR_BLOCK) * INR_PER_BLOCK;

  const welcomeBonusEligible = totalXp >= WELCOME_BONUS_THRESHOLD_XP;
  const welcomeBonusAwarded = Boolean(profile.welcomeBonusAwarded);
  const welcomeBonusProgress = Math.min(100, Math.round((totalXp / WELCOME_BONUS_THRESHOLD_XP) * 100));

  const totalInrEarned = profile.totalInrEarned || 0;

  // If welcome bonus is eligible and not yet awarded, it can be claimed
  const unclaimedWelcomeBonus = welcomeBonusEligible && !welcomeBonusAwarded ? WELCOME_BONUS_INR : 0;
  const totalWithdrawableInr = redeemableInr + unclaimedWelcomeBonus;

  const hasPaymentDetails = Boolean(
    profile.upiId &&
    profile.upiId.trim().length > 3 &&
    profile.mobileNumber &&
    profile.mobileNumber.trim().length >= 10
  );

  return {
    totalXp,
    redeemedXp,
    availableXp,
    redeemableInr,
    welcomeBonusEligible,
    welcomeBonusAwarded,
    welcomeBonusProgress,
    totalInrEarned,
    totalWithdrawableInr,
    hasPaymentDetails,
  };
}

/**
 * Validates Indian UPI ID format (e.g. username@okhdfcbank, 9876543210@paytm)
 */
export function isValidUpiId(upi: string): boolean {
  if (!upi || typeof upi !== 'string') return false;
  const trimmed = upi.trim();
  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  return upiRegex.test(trimmed) && trimmed.length >= 5 && trimmed.length <= 50;
}

/**
 * Validates Indian 10-digit mobile number
 */
export function isValidIndianMobile(mobile: string): boolean {
  if (!mobile || typeof mobile !== 'string') return false;
  const clean = mobile.replace(/[\s\-+]/g, '');
  const tenDigit = clean.startsWith('91') && clean.length === 12 ? clean.slice(2) : clean;
  return /^[6-9]\d{9}$/.test(tenDigit);
}

/**
 * Format INR with symbol
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
