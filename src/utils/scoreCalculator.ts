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
  // 1. Coding Score (Max 350) - purely earned
  let codingScore = 0;
  const acceptedSubmissions = submissions.filter((s) => s.status === 'Accepted');
  const distinctAcceptedProblems = new Set(acceptedSubmissions.map((s) => s.problemId)).size;
  codingScore += distinctAcceptedProblems * 65;

  if (submissions.length > 0) {
    const totalPassed = submissions.reduce((acc, cur) => acc + cur.passedCount, 0);
    const totalCases = submissions.reduce((acc, cur) => acc + cur.totalCount, 0);
    if (totalCases > 0) {
      codingScore += Math.round((totalPassed / totalCases) * 45);
    }
  }
  codingScore = Math.min(350, codingScore);

  // 2. Aptitude Score (Max 250) - purely earned from real tests
  let aptitudeScore = 0;
  if (aptitudeResults.length > 0) {
    const avgScorePct =
      aptitudeResults.reduce((acc, cur) => acc + cur.scorePercentage, 0) /
      aptitudeResults.length;
    const latestAptitude = aptitudeResults[aptitudeResults.length - 1];
    aptitudeScore = Math.round((avgScorePct / 100) * 190) + (latestAptitude.correctAnswers >= 4 ? 40 : latestAptitude.correctAnswers * 8);
  }
  aptitudeScore = Math.min(250, aptitudeScore);

  // 3. Core Skills Score (Max 200) - based on real learner skills & verification
  let coreSkillsScore = 0;
  const nonZeroSkills = skills.filter((s) => s.level > 0);
  if (nonZeroSkills.length > 0) {
    const avgLevel = nonZeroSkills.reduce((acc, cur) => acc + cur.level, 0) / nonZeroSkills.length;
    const verifiedBonus = skills.filter((s) => s.isVerified).length * 12;
    coreSkillsScore = Math.round((avgLevel / 100) * 120) + Math.min(80, verifiedBonus);
  }
  coreSkillsScore = Math.min(200, coreSkillsScore);

  // 4. Profile & Academic Strength (Max 100) - earned from completed profile fields
  let profileScore = 0;
  if (profile.college && profile.college.trim().length > 2) profileScore += 15;
  if (profile.degree && profile.degree.trim().length > 2) profileScore += 10;
  if (profile.targetRole) profileScore += 15;
  if (profile.cgpa >= 8.5) profileScore += 20;
  else if (profile.cgpa >= 7.5) profileScore += 14;
  else if (profile.cgpa >= 6.0) profileScore += 8;

  if (profile.githubUrl && profile.githubUrl.trim().length > 5) profileScore += 15;
  if (profile.linkedinUrl && profile.linkedinUrl.trim().length > 5) profileScore += 10;
  if (profile.resumeHeadline && profile.resumeHeadline.length > 15) profileScore += 10;
  if (profile.skills && profile.skills.length >= 3) profileScore += 5;
  profileScore = Math.min(100, profileScore);

  // 5. Practice Streak Score (Max 100)
  const streakScore = profile.streakDays > 0 ? Math.min(100, profile.streakDays * 14) : 0;

  // Total
  const overallScore = Math.min(
    1000,
    codingScore + aptitudeScore + coreSkillsScore + profileScore + streakScore
  );

  // Percentile calculation
  let percentile = 0;
  if (overallScore >= 900) percentile = 98;
  else if (overallScore >= 820) percentile = 92;
  else if (overallScore >= 750) percentile = 84;
  else if (overallScore >= 680) percentile = 74;
  else if (overallScore >= 550) percentile = 60;
  else if (overallScore >= 350) percentile = 40;
  else if (overallScore > 0) percentile = Math.max(5, Math.round((overallScore / 1000) * 70));

  // Company tier probabilities
  const tier1Tech = Math.min(96, Math.max(0, Math.round(((overallScore - 400) / 450) * 90)));
  const unicorns = Math.min(98, Math.max(0, Math.round(((overallScore - 350) / 420) * 94)));
  const midProduct = Math.min(99, Math.max(0, Math.round(((overallScore - 250) / 380) * 98)));
  const itConsulting = Math.min(99, Math.max(0, Math.round(((overallScore - 150) / 350) * 100)));

  // Identify strengths & gaps
  const sortedSkills = [...skills].filter((s) => s.level > 0).sort((a, b) => b.level - a.level);
  const strengths = sortedSkills.slice(0, 3).map((s) => `${s.name} (${s.level}%)`);
  const weaknesses = [...skills].filter((s) => s.level < 60).slice(0, 3).map((s) => `${s.name} (${s.level}%)`);

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
