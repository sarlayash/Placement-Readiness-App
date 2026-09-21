import {
  StudentProfile,
  SkillItem,
  CodingSubmission,
  AptitudeAssessmentResult,
  ReadinessScoreBreakdown,
} from '../types';

export function calculateReadinessScore(
  profile: StudentProfile,
  skills: SkillItem[],
  submissions: CodingSubmission[],
  aptitudeResults: AptitudeAssessmentResult[]
): ReadinessScoreBreakdown {
  // 1. Coding Score (Max 350)
  let codingScore = 180; // Baseline
  const acceptedSubmissions = submissions.filter((s) => s.status === 'Accepted');
  const distinctAcceptedProblems = new Set(acceptedSubmissions.map((s) => s.problemId)).size;
  codingScore += distinctAcceptedProblems * 35;
  // Factor in test cases passed ratio
  if (submissions.length > 0) {
    const totalPassed = submissions.reduce((acc, cur) => acc + cur.passedCount, 0);
    const totalCases = submissions.reduce((acc, cur) => acc + cur.totalCount, 0);
    if (totalCases > 0) {
      codingScore += Math.round((totalPassed / totalCases) * 35);
    }
  }
  codingScore = Math.min(350, Math.max(80, codingScore));

  // 2. Aptitude Score (Max 250)
  let aptitudeScore = 140; // Baseline
  if (aptitudeResults.length > 0) {
    const latestAptitude = aptitudeResults[aptitudeResults.length - 1];
    const avgScorePct =
      aptitudeResults.reduce((acc, cur) => acc + cur.scorePercentage, 0) /
      aptitudeResults.length;
    aptitudeScore = Math.round((avgScorePct / 100) * 210) + (latestAptitude.correctAnswers > 4 ? 40 : 20);
  }
  aptitudeScore = Math.min(250, Math.max(50, aptitudeScore));

  // 3. Core Skills Score (Max 200)
  let coreSkillsScore = 120;
  if (skills.length > 0) {
    const avgLevel = skills.reduce((acc, cur) => acc + cur.level, 0) / skills.length;
    const verifiedBonus = skills.filter((s) => s.isVerified).length * 6;
    coreSkillsScore = Math.round((avgLevel / 100) * 160) + Math.min(40, verifiedBonus);
  }
  coreSkillsScore = Math.min(200, Math.max(60, coreSkillsScore));

  // 4. Profile & Academic Strength (Max 100)
  let profileScore = 40;
  if (profile.cgpa >= 8.5) profileScore += 25;
  else if (profile.cgpa >= 7.5) profileScore += 18;
  else if (profile.cgpa >= 6.5) profileScore += 10;

  if (profile.githubUrl && profile.githubUrl.trim().length > 5) profileScore += 15;
  if (profile.linkedinUrl && profile.linkedinUrl.trim().length > 5) profileScore += 10;
  if (profile.resumeHeadline && profile.resumeHeadline.length > 20) profileScore += 10;
  profileScore = Math.min(100, profileScore);

  // 5. Practice Streak Score (Max 100)
  const streakScore = Math.min(100, Math.max(20, profile.streakDays * 14));

  // Total
  const overallScore = Math.min(
    1000,
    Math.max(250, codingScore + aptitudeScore + coreSkillsScore + profileScore + streakScore)
  );

  // Percentile calculation against campus benchmark
  let percentile = 50;
  if (overallScore >= 900) percentile = 98;
  else if (overallScore >= 820) percentile = 92;
  else if (overallScore >= 750) percentile = 84;
  else if (overallScore >= 680) percentile = 74;
  else if (overallScore >= 600) percentile = 61;
  else percentile = Math.max(25, Math.round((overallScore / 1000) * 80));

  // Company tier probabilities
  const tier1Tech = Math.min(96, Math.max(15, Math.round(((overallScore - 400) / 450) * 90)));
  const unicorns = Math.min(98, Math.max(25, Math.round(((overallScore - 350) / 420) * 94)));
  const midProduct = Math.min(99, Math.max(35, Math.round(((overallScore - 300) / 380) * 98)));
  const itConsulting = Math.min(99, Math.max(50, Math.round(((overallScore - 200) / 350) * 100)));

  // Identify strengths & gaps
  const sortedSkills = [...skills].sort((a, b) => b.level - a.level);
  const strengths = sortedSkills.slice(0, 3).map((s) => `${s.name} (${s.level}%)`);
  const weaknesses = sortedSkills.slice(-3).reverse().map((s) => `${s.name} (${s.level}%)`);

  return {
    overallScore,
    percentile,
    codingScore,
    aptitudeScore,
    coreSkillsScore,
    profileStrengthScore: profileScore,
    practiceStreakScore: streakScore,
    tierProbabilities: {
      tier1Tech,
      unicorns,
      midProduct,
      itConsulting,
    },
    strengths,
    weaknesses,
  };
}
