import {
  TrendingUp,
  BrainCircuit,
  Code2,
  Compass,
  ArrowRight,
  Target,
  Sparkles,
  Building2,
  CheckCircle,
  AlertCircle,
  Award,
} from 'lucide-react';
import {
  StudentProfile,
  ReadinessScoreBreakdown,
  Badge,
} from '../types';
import { COMPANY_BENCHMARKS } from '../data/initialData';

interface DashboardViewProps {
  profile: StudentProfile;
  readiness: ReadinessScoreBreakdown;
  badges: Badge[];
  onNavigateToTab: (tab: 'assessments' | 'skills' | 'roadmap' | 'badges' | 'profile') => void;
  onStartAptitude: () => void;
  onStartCoding: () => void;
  onOpenCompanyModal: () => void;
  onOpenCertificate?: () => void;
}

export function DashboardView({
  profile,
  readiness,
  badges,
  onNavigateToTab,
  onStartAptitude,
  onStartCoding,
  onOpenCompanyModal,
  onOpenCertificate,
}: DashboardViewProps) {
  const earnedBadges = badges.filter((b) => b.unlocked);

  // Status color based on score
  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-emerald-400';
    if (score >= 700) return 'text-indigo-400';
    if (score >= 600) return 'text-amber-400';
    return 'text-rose-400';
  };

  const scoreColorClass = getScoreColor(readiness.overallScore);

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Student Greeting & Target Role Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Target: {profile.targetRole}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1.5">
              Welcome back, {profile.fullName.split(' ')[0]}!
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aiming for <strong className="text-slate-300">{profile.targetCompanyTier}</strong>
            </p>
          </div>
          <button
            id="edit-profile-quick-btn"
            onClick={() => onNavigateToTab('profile')}
            className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
          >
            Edit Goals
          </button>
        </div>
      </div>

      {/* Hero: Placement Readiness Score (PRS) */}
      <div
        id="placement-readiness-hero-card"
        className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Placement Readiness Score™
            </span>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Top {100 - readiness.percentile}% Campus Cohort
          </span>
        </div>

        {/* Score Dial & Metrics */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-extrabold tracking-tight ${scoreColorClass}`}>
                {readiness.overallScore}
              </span>
              <span className="text-sm font-medium text-slate-400">/ 1000</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{readiness.percentile}th percentile placement benchmark</span>
            </p>
          </div>

          {/* Readiness Status Pill */}
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
              {readiness.overallScore >= 800
                ? 'Super Ready (Tier-1)'
                : readiness.overallScore >= 700
                ? 'Placement Competitive'
                : readiness.overallScore >= 600
                ? 'Developing Core'
                : 'Needs Acceleration'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Next tier at <strong className="text-slate-200">800 pts</strong>
            </p>
          </div>
        </div>

        {/* 5-Dimension Component Breakdown Bars */}
        <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Evaluation Matrix Breakdown
          </div>

          {/* Coding */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Code2 className="w-3 h-3 text-indigo-400" />
                <span>Coding & Problem Solving</span>
              </span>
              <span className="font-semibold text-slate-200">{readiness.codingScore} / 350</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.codingScore / 350) * 100}%` }}
              />
            </div>
          </div>

          {/* Aptitude */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <BrainCircuit className="w-3 h-3 text-amber-400" />
                <span>Aptitude & Logical Reasoning</span>
              </span>
              <span className="font-semibold text-slate-200">{readiness.aptitudeScore} / 250</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.aptitudeScore / 250) * 100}%` }}
              />
            </div>
          </div>

          {/* Core Skills */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>CS Fundamentals & System Concepts</span>
              </span>
              <span className="font-semibold text-slate-200">{readiness.coreSkillsScore} / 200</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.coreSkillsScore / 200) * 100}%` }}
              />
            </div>
          </div>

          {/* Profile & Projects + Streak */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Profile & Academics</span>
              <span className="text-xs font-semibold text-slate-200">
                {readiness.profileStrengthScore} / 100
              </span>
            </div>
            <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Consistency Streak</span>
              <span className="text-xs font-semibold text-slate-200">
                {readiness.practiceStreakScore} / 100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Placement Certificate Showcase Banner */}
      <div
        id="official-certificate-banner"
        className="relative overflow-hidden bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-950/40 border-2 border-amber-500/40 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
            <Award className="w-6 h-6 text-slate-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-300 tracking-wide uppercase">
                Placement Readiness Certificate
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                Official
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Certified By <strong className="text-amber-200">SarlaYash Mission</strong> • Powered By <strong className="text-amber-200">Kapil</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCertificate}
          id="view-certificate-btn"
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>View</span>
        </button>
      </div>

      {/* Today's High-Yield Recommendation Banner */}
      <div
        id="daily-recommendation-card"
        className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Recommended Next High-Yield Action
          </span>
        </div>
        <h3 className="text-sm font-semibold text-white mt-1.5">
          {readiness.weaknesses[0] || 'Dynamic Programming & Recursion Drills'}
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          Improving your lowest scoring topic yields up to <strong className="text-emerald-300">+35 readiness points</strong> for upcoming campus hiring rounds.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            id="start-recommended-assessment-btn"
            onClick={onStartCoding}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Solve Coding Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            id="start-recommended-aptitude-btn"
            onClick={onStartAptitude}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Aptitude Test</span>
          </button>
        </div>
      </div>

      {/* Company Placement Probability Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Placement Match Probability
            </h3>
          </div>
          <button
            id="view-company-intelligence-btn"
            onClick={onOpenCompanyModal}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View Cutoffs
          </button>
        </div>

        <div className="space-y-3">
          {/* Unicorns */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-300">Tech Unicorns (Swiggy, Razorpay)</span>
              <span className="font-bold text-indigo-300">{readiness.tierProbabilities.unicorns}% Match</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full"
                style={{ width: `${readiness.tierProbabilities.unicorns}%` }}
              />
            </div>
          </div>

          {/* Tier-1 Big Tech */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-300">Tier-1 Tech (Google, Amazon, MS)</span>
              <span className="font-bold text-amber-300">{readiness.tierProbabilities.tier1Tech}% Match</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${readiness.tierProbabilities.tier1Tech}%` }}
              />
            </div>
          </div>

          {/* Mid Product */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-300">Mid-Size Product Companies</span>
              <span className="font-bold text-emerald-300">{readiness.tierProbabilities.midProduct}% Match</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${readiness.tierProbabilities.midProduct}%` }}
              />
            </div>
          </div>

          {/* IT Consulting */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-300">Global IT & Consulting (TCS Digital, Infosys SP)</span>
              <span className="font-bold text-emerald-400">{readiness.tierProbabilities.itConsulting}% Match</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${readiness.tierProbabilities.itConsulting}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Intelligence */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Top Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {readiness.strengths.slice(0, 3).map((s, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-emerald-400">•</span>
                <span className="truncate">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-rose-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Focus Gaps</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {readiness.weaknesses.slice(0, 3).map((w, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-rose-400">•</span>
                <span className="truncate">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          id="dashboard-take-aptitude-card"
          onClick={onStartAptitude}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-3.5 text-left transition-all group shadow-sm flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-100">Take Aptitude Test</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Quant, Logic & Verbal</p>
          </div>
          <span className="mt-2 text-[10px] font-semibold text-amber-400 flex items-center gap-1">
            Start Drill <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        <button
          id="dashboard-take-coding-card"
          onClick={onStartCoding}
          className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-3.5 text-left transition-all group shadow-sm flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-100">Coding Arena</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">DSA Challenges & AI Eval</p>
          </div>
          <span className="mt-2 text-[10px] font-semibold text-indigo-400 flex items-center gap-1">
            Solve Challenges <ArrowRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* Badges Preview Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Earned Badges ({earnedBadges.length}/{badges.length})
            </h3>
          </div>
          <button
            id="view-all-badges-btn"
            onClick={() => onNavigateToTab('badges')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View All
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold">
                🏆
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 truncate max-w-[110px]">
                  {badge.title}
                </div>
                <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  {badge.rarity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
