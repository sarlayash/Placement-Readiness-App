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
  FileText,
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
  onOpenLOR?: () => void;
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
  onOpenLOR,
}: DashboardViewProps) {
  const earnedBadges = badges.filter((b) => b.unlocked);

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto text-slate-100">
      {/* Student Greeting & Target Role Card (Fortune 500 Executive Suite) */}
      <div className="bg-gradient-to-r from-slate-900/90 via-[#0b1329] to-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-sky-400" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/15 text-sky-300 border border-blue-400/30">
                Target: {profile.targetRole}
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1.5 font-['Outfit',sans-serif] tracking-tight">
              Welcome back, {profile.fullName.split(' ')[0]}!
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Certified By <strong className="text-sky-300">SarlaYash Mission</strong> • Powered By <strong className="text-amber-300">Kapil</strong>
            </p>
          </div>
          <button
            id="edit-profile-quick-btn"
            onClick={() => onNavigateToTab('profile')}
            className="text-xs text-sky-400 hover:text-sky-300 hover:underline font-bold cursor-pointer"
          >
            Edit Goals
          </button>
        </div>
      </div>

      {/* Hero: Placement Readiness Score (PRS) (Fortune 500 Sovereign Blue Card) */}
      <div
        id="placement-readiness-hero-card"
        className="relative overflow-hidden bg-gradient-to-br from-[#0b1329] via-[#080e22] to-[#040816] border border-blue-500/30 rounded-2xl p-5 shadow-2xl f500-glow"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-black uppercase tracking-wider text-sky-300 font-['Outfit',sans-serif]">
              Placement Readiness Score™
            </span>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/40">
            Top {100 - readiness.percentile}% Benchmark
          </span>
        </div>

        {/* Score Dial & Metrics */}
        <div className="mt-4 flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight text-white font-['Outfit',sans-serif]">
                {readiness.overallScore}
              </span>
              <span className="text-sm font-bold text-slate-400">/ 1000</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{readiness.percentile}th percentile campus placement standing</span>
            </p>
          </div>

          {/* Readiness Status Pill */}
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm">
              {readiness.overallScore >= 800
                ? 'Super Ready (Tier-1)'
                : readiness.overallScore >= 700
                ? 'Placement Competitive'
                : readiness.overallScore >= 600
                ? 'Developing Core'
                : 'Needs Acceleration'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Next tier at <strong className="text-white">800 pts</strong>
            </p>
          </div>
        </div>

        {/* Evaluation Matrix Breakdown */}
        <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-800/80 relative z-10">
          <div className="text-[11px] font-black text-sky-300 uppercase tracking-wider font-['Outfit',sans-serif]">
            Evaluation Matrix Breakdown
          </div>

          {/* Coding & DSA */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Code2 className="w-3 h-3 text-sky-400" />
                <span>Coding & Problem Solving</span>
              </span>
              <span className="font-bold text-white">{readiness.codingScore} / 350</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.codingScore / 350) * 100}%` }}
              />
            </div>
          </div>

          {/* Aptitude & Multi-Module */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <BrainCircuit className="w-3 h-3 text-indigo-400" />
                <span>Aptitude, AI & Analytical Modules</span>
              </span>
              <span className="font-bold text-white">{readiness.aptitudeScore} / 250</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.aptitudeScore / 250) * 100}%` }}
              />
            </div>
          </div>

          {/* Core Skills */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>SQL, Power BI & Excel Fundamentals</span>
              </span>
              <span className="font-bold text-white">{readiness.coreSkillsScore} / 200</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(readiness.coreSkillsScore / 200) * 100}%` }}
              />
            </div>
          </div>

          {/* Profile & Streak */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Profile Strength</span>
              <span className="text-xs font-black text-white">
                {readiness.profileStrengthScore} / 100
              </span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">Practice Streak</span>
              <span className="text-xs font-black text-amber-400">
                {readiness.practiceStreakScore} / 100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Placement Certificate Showcase Banner (Fortune 500 Executive Edition) */}
      <div
        id="official-certificate-banner"
        className="relative overflow-hidden bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/50 border border-amber-500/40 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 f500-gold-glow"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30 shrink-0">
            <Award className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-300 tracking-wide uppercase font-['Outfit',sans-serif]">
                Placement Readiness Certificate
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-500/40">
                PNG ONLY
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Certified By <strong className="text-sky-300">SarlaYash Mission</strong> • Powered By <strong className="text-amber-300">Kapil</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCertificate}
          id="view-certificate-btn"
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/25 transition-all shrink-0 cursor-pointer active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
          <span>View / PNG</span>
        </button>
      </div>

      {/* Official Letter of Recommendation (LOR) Showcase Banner */}
      {onOpenLOR && (
        <div
          id="official-lor-banner"
          className="relative overflow-hidden bg-gradient-to-r from-blue-950/60 via-[#071126] to-slate-900 border border-blue-500/50 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 f500-glow"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30 shrink-0 border border-sky-300/40">
              <FileText className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-sky-300 tracking-wide uppercase font-['Outfit',sans-serif]">
                  Letter Of Recommendation (LOR)
                </span>
                <span className="text-[9px] bg-blue-500/20 text-sky-300 font-extrabold px-1.5 py-0.5 rounded-full border border-blue-400/40 shrink-0">
                  PDF & PNG
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                Endorsement with 11-Domain XP breakdown • Directed by <strong className="text-amber-300">Kapil Narula</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenLOR}
            id="view-lor-btn"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-all shrink-0 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Get LOR</span>
          </button>
        </div>
      )}

      {/* Assessment Portal Scope Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-sky-300 uppercase tracking-wider font-['Outfit',sans-serif]">
            Assessment Tracks (All 10 Modules)
          </span>
          <span className="text-[10px] text-slate-400">Timed & Verified</span>
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
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 hover:border-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
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
          className="bg-gradient-to-br from-[#0c1328] to-[#070d1d] hover:border-sky-400/60 border border-blue-500/30 rounded-2xl p-3.5 text-left transition-all group shadow-sm flex flex-col justify-between cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sky-400 mb-2 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white font-['Outfit',sans-serif]">Start Assessment</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Verbal, Soft Skills, AI & More</p>
          </div>
          <span className="mt-2 text-[10px] font-black text-sky-400 uppercase tracking-wider flex items-center gap-1">
            Launch Test <ArrowRight className="w-3 h-3" />
          </span>
        </button>

        <button
          id="dashboard-take-coding-card"
          onClick={onStartCoding}
          className="bg-gradient-to-br from-[#0c1328] to-[#070d1d] hover:border-indigo-400/60 border border-indigo-500/30 rounded-2xl p-3.5 text-left transition-all group shadow-sm flex flex-col justify-between cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2 group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white font-['Outfit',sans-serif]">Coding Arena</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">DSA Challenges & AI Review</p>
          </div>
          <span className="mt-2 text-[10px] font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            Solve DSA <ArrowRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* Strengths & Focus Areas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/80 border border-emerald-500/25 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300 font-['Outfit',sans-serif]">Top Strengths</span>
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

        <div className="bg-slate-900/80 border border-amber-500/25 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-amber-400 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit',sans-serif]">Focus Gaps</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
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
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit',sans-serif]">
              Earned Badges ({earnedBadges.length}/{badges.length})
            </h3>
          </div>
          <button
            id="view-all-badges-btn"
            onClick={() => onNavigateToTab('badges')}
            className="text-xs text-sky-400 hover:text-sky-300 font-bold cursor-pointer"
          >
            Download Badges (PNG) →
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => onNavigateToTab('badges')}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-colors"
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
