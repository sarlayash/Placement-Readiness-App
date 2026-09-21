import {
  TrendingUp,
  BrainCircuit,
  Code2,
  ArrowRight,
  Target,
  Sparkles,
  Building2,
  CheckCircle,
  AlertCircle,
  Award,
  Download,
} from 'lucide-react';
import {
  StudentProfile,
  ReadinessScoreBreakdown,
  Badge,
} from '../types';

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

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto text-white">
      {/* Student Greeting & Target Role Card (Black & Gold) */}
      <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Target: {profile.targetRole}
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1.5">
              Welcome back, {profile.fullName.split(' ')[0]}!
            </h2>
            <p className="text-xs text-neutral-300 mt-0.5">
              Certified By <strong className="text-amber-300">SarlaYash Mission</strong> • Powered By <strong className="text-amber-300">Kapil</strong>
            </p>
          </div>
          <button
            id="edit-profile-quick-btn"
            onClick={() => onNavigateToTab('profile')}
            className="text-xs text-amber-400 hover:text-amber-300 hover:underline font-bold cursor-pointer"
          >
            Edit Goals
          </button>
        </div>
      </div>

      {/* Hero: Placement Readiness Score (PRS) (Pure Black with Gold Dial) */}
      <div
        id="placement-readiness-hero-card"
        className="relative overflow-hidden bg-black border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              Placement Readiness Score™
            </span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Top {100 - readiness.percentile}% Benchmark
          </span>
        </div>

        {/* Score Dial & Metrics */}
        <div className="mt-4 flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight text-amber-400">
                {readiness.overallScore}
              </span>
              <span className="text-sm font-bold text-neutral-400">/ 1000</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{readiness.percentile}th percentile campus placement standing</span>
            </p>
          </div>

          {/* Readiness Status Pill */}
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400">
              {readiness.overallScore >= 800
                ? 'Super Ready (Tier-1)'
                : readiness.overallScore >= 700
                ? 'Placement Competitive'
                : readiness.overallScore >= 600
                ? 'Developing Core'
                : 'Needs Acceleration'}
            </span>
            <p className="text-[11px] text-neutral-400 mt-1">
              Next tier at <strong className="text-white">800 pts</strong>
            </p>
          </div>
        </div>

        {/* Evaluation Matrix Breakdown */}
        <div className="mt-5 space-y-2.5 pt-4 border-t border-neutral-900 relative z-10">
          <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
            Evaluation Matrix Breakdown
          </div>

          {/* Coding & DSA */}
          <div>
            <div className="flex justify-between text-xs text-neutral-300 mb-1">
              <span className="flex items-center gap-1">
                <Code2 className="w-3 h-3 text-amber-400" />
                <span>Coding & Problem Solving</span>
              </span>
              <span className="font-bold text-white">{readiness.codingScore} / 350</span>
            </div>
            <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.codingScore / 350) * 100}%` }}
              />
            </div>
          </div>

          {/* Aptitude & Multi-Module */}
          <div>
            <div className="flex justify-between text-xs text-neutral-300 mb-1">
              <span className="flex items-center gap-1">
                <BrainCircuit className="w-3 h-3 text-amber-400" />
                <span>Aptitude, AI & Analytical Modules</span>
              </span>
              <span className="font-bold text-white">{readiness.aptitudeScore} / 250</span>
            </div>
            <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.aptitudeScore / 250) * 100}%` }}
              />
            </div>
          </div>

          {/* Core Skills */}
          <div>
            <div className="flex justify-between text-xs text-neutral-300 mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>SQL, Power BI & Excel Fundamentals</span>
              </span>
              <span className="font-bold text-white">{readiness.coreSkillsScore} / 200</span>
            </div>
            <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.coreSkillsScore / 200) * 100}%` }}
              />
            </div>
          </div>

          {/* Profile & Streak */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 block font-bold">Profile Strength</span>
              <span className="text-xs font-black text-white">
                {readiness.profileStrengthScore} / 100
              </span>
            </div>
            <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 block font-bold">Practice Streak</span>
              <span className="text-xs font-black text-amber-400">
                {readiness.practiceStreakScore} / 100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Placement Certificate Showcase Banner (Black & Gold Master) */}
      <div
        id="official-certificate-banner"
        className="relative overflow-hidden bg-black border-2 border-amber-500/50 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center font-bold shadow-md shadow-amber-500/30 shrink-0">
            <Award className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-300 tracking-wide uppercase">
                Placement Readiness Certificate
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30">
                PNG ONLY
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              Certified By <strong className="text-amber-200">SarlaYash Mission</strong> • Powered By <strong className="text-amber-200">Kapil</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCertificate}
          id="view-certificate-btn"
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span>View / PNG</span>
        </button>
      </div>

      {/* Assessment Portal Scope Banner */}
      <div className="bg-neutral-950 border border-amber-500/30 rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
            Assessment Tracks (All 10 Modules)
          </span>
          <span className="text-[10px] text-neutral-400">Timed & Verified</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            'Verbal Ability',
            'Soft Skills',
            'Coding',
            'Excel',
            'SQL',
            'Power BI',
            'AI',
            'Generative AI',
            'Agentic AI',
            'Aptitude',
          ].map((mod) => (
            <span
              key={mod}
              onClick={onStartAptitude}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black text-neutral-200 border border-neutral-800 hover:border-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              {mod}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          id="dashboard-take-aptitude-card"
          onClick={onStartAptitude}
          className="bg-black hover:bg-neutral-950 border-2 border-amber-500/30 hover:border-amber-400 rounded-2xl p-3.5 text-left transition-all group shadow-sm flex flex-col justify-between cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Start Assessment</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">Verbal, Soft Skills, AI & More</p>
          </div>
          <span className="mt-2 text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
            Launch Test <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        <button
          id="dashboard-take-coding-card"
          onClick={onStartCoding}
          className="bg-black hover:bg-neutral-950 border-2 border-amber-500/30 hover:border-amber-400 rounded-2xl p-3.5 text-left transition-all group shadow-sm flex flex-col justify-between cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white">Coding Arena</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">DSA Challenges & AI Review</p>
          </div>
          <span className="mt-2 text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
            Solve DSA <ArrowRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* Strengths & Focus Areas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black border border-neutral-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-amber-400 mb-2">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">Top Strengths</span>
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {readiness.strengths.slice(0, 3).map((s, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-amber-400">•</span>
                <span className="truncate">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-black border border-neutral-800 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-neutral-400 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-300">Focus Gaps</span>
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {readiness.weaknesses.slice(0, 3).map((w, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-amber-400">•</span>
                <span className="truncate">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Badges Preview Strip (With PNG Download Note) */}
      <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Earned Badges ({earnedBadges.length}/{badges.length})
            </h3>
          </div>
          <button
            id="view-all-badges-btn"
            onClick={() => onNavigateToTab('badges')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
          >
            Download Badges (PNG) →
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => onNavigateToTab('badges')}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-950 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-black">
                🏆
              </div>
              <div>
                <div className="text-xs font-bold text-white truncate max-w-[120px]">
                  {badge.title}
                </div>
                <div className="text-[9px] text-amber-400 uppercase font-black tracking-wider">
                  {badge.rarity} • PNG
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
