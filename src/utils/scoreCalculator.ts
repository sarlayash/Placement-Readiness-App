import {
  StudentProfile,
  SkillItem,
  CodingSubmission,
  AptitudeAssessmentResult,
  ReadinessScoreBreakdown,
  PlacementReadinessIndex,
} from '../types';

/**
 * Computes the PLACEMENT READINESS INDEX (PRI) on a scale of 1 to 100
 * based on daily assessments, academic & profile completeness, technical DSA rigor, and streak discipline.
 */
export function computePlacementReadinessIndex(
  profile: StudentProfile,
  skills: SkillItem[],
  submissions: CodingSubmission[],
  aptitudeResults: AptitudeAssessmentResult[]
): PlacementReadinessIndex {
  // 1. Daily Assessment Performance (Max 40 points)
  let dailyAssessments = 0;
  if (aptitudeResults && aptitudeResults.length > 0) {
    const avgScorePct =
      aptitudeResults.reduce((acc, cur) => acc + cur.scorePercentage, 0) / aptitudeResults.length;
    // Accuracy contribution: max 25 points
    const accuracyPts = (avgScorePct / 100) * 25;

    // Assessment Volume & Engagement: max 10 points (up to 4+ tests completed)
    const volumePts = Math.min(10, aptitudeResults.length * 2.5);

    // Domain Breadth Coverage: check unique domains tested (max 5 points)
    const assessedCategories = new Set<string>();
    aptitudeResults.forEach((r) => {
      if (r.categoryScores) {
        Object.keys(r.categoryScores).forEach((cat) => assessedCategories.add(cat));
      }
    });
    const breadthPts = Math.min(5, Math.max(1, assessedCategories.size * 0.7));

    dailyAssessments = Math.min(40, accuracyPts + volumePts + breadthPts);
  } else {
    // Calibrated baseline for students with an active profile who are about to take their first daily assessment
    dailyAssessments = profile.streakDays > 0 ? 12 : 5;
  }

  // 2. Profile & Academic Rigor (Max 25 points)
  let profileStrength = 0;
  // CGPA (Max 9 points)
  if (profile.cgpa >= 9.0) profileStrength += 9;
  else if (profile.cgpa >= 8.0) profileStrength += 7.5;
  else if (profile.cgpa >= 7.0) profileStrength += 6;
  else if (profile.cgpa >= 6.0) profileStrength += 4.5;
  else if (profile.cgpa > 0) profileStrength += 3;

  // Profile Completeness (Max 9 points)
  if (profile.fullName && profile.fullName.trim().length > 2) profileStrength += 1.5;
  if (profile.college && profile.college.trim().length > 2) profileStrength += 2.5;
  if (profile.degree && profile.degree.trim().length > 1) profileStrength += 1.5;
  if (profile.targetRole) profileStrength += 2;
  if (profile.resumeHeadline && profile.resumeHeadline.length > 10) profileStrength += 1.5;

  // Professional Footprint & Verification (Max 7 points)
  if (profile.githubUrl && profile.githubUrl.trim().length > 5) profileStrength += 3.5;
  if (profile.linkedinUrl && profile.linkedinUrl.trim().length > 5) profileStrength += 3.5;
  profileStrength = Math.min(25, profileStrength);

  // 3. Technical Problem Solving & DSA (Max 20 points)
  let technicalProblemSolving = 0;
  const acceptedSubmissions = submissions.filter((s) => s.status === 'Accepted');
  const distinctAccepted = new Set(acceptedSubmissions.map((s) => s.problemId)).size;
  // Problem solves: up to 12 points
  technicalProblemSolving += Math.min(12, distinctAccepted * 4);

  // Test case pass rate: up to 4 points
  if (submissions.length > 0) {
    const totalPassed = submissions.reduce((acc, cur) => acc + cur.passedCount, 0);
    const totalCases = submissions.reduce((acc, cur) => acc + cur.totalCount, 0);
    if (totalCases > 0) {
      technicalProblemSolving += (totalPassed / totalCases) * 4;
    }
  }

  // Verified skill competencies: up to 4 points
  const verifiedCount = skills.filter((s) => s.isVerified).length;
  technicalProblemSolving += Math.min(4, verifiedCount * 0.5);
  technicalProblemSolving = Math.min(20, technicalProblemSolving);

  // 4. Streak Consistency & Discipline (Max 15 points)
  let streakConsistency = 0;
  if (profile.streakDays > 0) {
    streakConsistency = Math.min(15, 3 + profile.streakDays * 2);
  }
  streakConsistency = Math.min(15, streakConsistency);

  // Total raw score clamped strictly from 1 to 100
  const rawTotal = dailyAssessments + profileStrength + technicalProblemSolving + streakConsistency;
  const score = Math.max(1, Math.min(100, Math.round(rawTotal)));

  // Tier classification & percentile
  let tier: PlacementReadinessIndex['tier'];
  let tierLabel: string;
  let badgeColor: string;
  let percentile: number;
  let summary: string;

  if (score >= 90) {
    tier = 'Tier-1 Elite';
    tierLabel = 'Tier-1 Big Tech & Global Quant Caliber';
    badgeColor = '#10B981';
    percentile = Math.min(99, 92 + Math.round(((score - 90) / 10) * 7));
    summary =
      'Candidate displays benchmark placement readiness across algorithmic, analytical, and professional communication tracks. Prime candidate for Tier-1 Big Tech (Google, Microsoft, Amazon) and marquee fintech engineering teams.';
  } else if (score >= 80) {
    tier = 'Unicorn Ready';
    tierLabel = 'High-Growth Tech Unicorn & Product Ready';
    badgeColor = '#0EA5E9';
    percentile = Math.min(92, 82 + Math.round(((score - 80) / 10) * 9));
    summary =
      'Outstanding placement readiness. High interview clearance probability for competitive technical rounds at tech unicorns (Razorpay, Swiggy, Uber) and mid-to-large product engineering teams.';
  } else if (score >= 70) {
    tier = 'Product Competitive';
    tierLabel = 'Product Engineering & Systems Competitive';
    badgeColor = '#8B5CF6';
    percentile = Math.min(81, 70 + Math.round(((score - 70) / 10) * 10));
    summary =
      'Solid placement baseline with competitive technical and soft skills competency. Prepared for core product development and scalable software engineering interviews.';
  } else if (score >= 60) {
    tier = 'Placement Ready';
    tierLabel = 'Global IT & Technology Consulting Ready';
    badgeColor = '#F59E0B';
    percentile = Math.min(69, 50 + Math.round(((score - 60) / 10) * 18));
    summary =
      'Fulfills placement qualification thresholds for Global IT leaders (TCS Digital, Accenture, Infosys SP). Recommended to focus on advanced DSA and timed mock test speed.';
  } else {
    tier = 'Developing Core';
    tierLabel = 'Foundational Competency Acceleration Phase';
    badgeColor = '#94A3B8';
    percentile = Math.max(15, Math.round((score / 60) * 48));
    summary =
      'Active acceleration phase. Continue daily assessment tests and complete core DSA challenges to elevate your Placement Readiness Index into competitive placement tiers.';
  }

  return {
    score,
    tier,
    tierLabel,
    badgeColor,
    percentile,
    breakdown: {
      dailyAssessments: Math.round(dailyAssessments),
      profileStrength: Math.round(profileStrength),
      technicalProblemSolving: Math.round(technicalProblemSolving),
      streakConsistency: Math.round(streakConsistency),
    },
    summary,
  };
}

export function calculateReadinessScore(
  profile: StudentProfile,
  skills: SkillItem[],
  submissions: CodingSubmission[],
  aptitudeResults: AptitudeAssessmentResult[]
): ReadinessScoreBreakdown {
  // Compute the standardized 1-100 Placement Readiness Index (PRI)
  const pri = computePlacementReadinessIndex(profile, skills, submissions, aptitudeResults);

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
  let percentile = pri.percentile;

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
    pri,
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

