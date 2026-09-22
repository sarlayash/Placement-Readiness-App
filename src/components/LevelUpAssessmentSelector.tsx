import { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Zap,
  Target,
} from 'lucide-react';
import {
  DAILY_LEVEL_UP_SCHEDULE,
  DailyLevelUpAssessmentSchedule,
  LEVEL_UP_100_QUESTIONS,
  LEVEL_UP_PASSING_PERCENTAGE,
  LEVEL_UP_PASSING_COUNT,
  LevelUpQuestion,
} from '../data/levelUpQuestions';

interface LevelUpAssessmentSelectorProps {
  onStartLevelUpTest: (schedule: DailyLevelUpAssessmentSchedule, questions: LevelUpQuestion[]) => void;
  levelUpHistory: Record<string, { score: number; total: number; percentage: number; passed: boolean; completedAt: string }>;
}

export function LevelUpAssessmentSelector({
  onStartLevelUpTest,
  levelUpHistory,
}: LevelUpAssessmentSelectorProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const activeAssessment = DAILY_LEVEL_UP_SCHEDULE.find((s) => s.dayNumber === selectedDay) || DAILY_LEVEL_UP_SCHEDULE[0];
  const historyForSelected = levelUpHistory[activeAssessment.id];

  return (
    <div className="space-y-6">
      {/* Top Banner - Level Up FAANG Hard Standard */}
      <div
        id="level-up-banner"
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-rose-950/60 via-slate-900 to-amber-950/40 border-2 border-rose-500/30 shadow-2xl"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-black uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-rose-400 animate-pulse text-rose-400" />
              <span>FAANG Tier-1 Hard Level Up Track</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              100 Unique Non-Repeated MCQs
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Curated from Google, Meta, Amazon AWS, Netflix, Apple, and Microsoft engineering interviews.
              Designed for senior placement readiness with deep systems internals, distributed consensus, low-level concurrency, and algorithmic optimization.
            </p>

            {/* Crucial Passing Score & Daily Add Notice */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-bold shadow-sm">
                <Target className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Passing Score: <strong className="text-white font-black text-sm">{LEVEL_UP_PASSING_PERCENTAGE}%</strong> ({LEVEL_UP_PASSING_COUNT}/100 to Clear)
                </span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-500/20 border border-sky-400/50 text-sky-200 text-xs font-bold shadow-sm">
                <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                <span>One Very Hard Assessment Added Daily</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="shrink-0 w-full md:w-auto bg-slate-950/70 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col gap-3 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Standard</span>
              <span className="font-bold text-rose-400 uppercase">FAANG Hard</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question Count</span>
              <span className="font-bold text-white">100 MCQs (Unique)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Time Limit</span>
              <span className="font-bold text-white">100 Minutes</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Passing Threshold</span>
              <span className="font-black text-amber-300 text-sm">95% Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Hard Assessment Schedule Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-400" />
              <span>Daily Level Up Schedule (New Hard Assessment Added Daily)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Each daily challenge features 100 distinct hard MCQs across algorithmic mastery, distributed systems, and kernel architecture.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
            Daily Live Drop
          </span>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAILY_LEVEL_UP_SCHEDULE.map((schedule) => {
            const isSelected = selectedDay === schedule.dayNumber;
            const history = levelUpHistory[schedule.id];
            const isActive = schedule.status === 'active';

            return (
              <div
                key={schedule.id}
                onClick={() => setSelectedDay(schedule.dayNumber)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-900 to-rose-950/30 border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div>
                  {/* Top Status Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {isActive ? 'Live Now' : schedule.releaseDate}
                    </span>

                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{schedule.timeLimitMinutes}m • 100 Qs</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-white mb-1.5 line-clamp-2">
                    {schedule.title}
                  </h4>

                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                    {schedule.tagline}
                  </p>

                  {/* Target Company Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {schedule.targetCompanies.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row - History / Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {history ? (
                    <div className="flex items-center gap-1.5">
                      {history.passed ? (
                        <span className="flex items-center gap-1 font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared ({history.percentage}%)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-bold text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Failed ({history.percentage}%)</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500 font-medium">Not attempted</span>
                  )}

                  <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                    <span>{isSelected ? 'Selected' : 'View Details'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Selected Assessment Action Panel */}
      <div
        id="active-level-up-detail"
        className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Day {activeAssessment.dayNumber} Daily Hard Challenge
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Passing Cutoff: 95%
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              {activeAssessment.title}
            </h3>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {activeAssessment.tagline}. Composed of 100 uniquely formulated, non-repeated technical MCQs.
              Topics span advanced algorithms, distributed system architecture, kernel synchronization, and cloud networking.
            </p>

            {/* Key Domains Covered */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Core Domains in this 100-MCQ Assessment:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeAssessment.domains.map((dom) => (
                  <span
                    key={dom}
                    className="text-xs font-medium px-3 py-1 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-200"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button / Launch */}
          <div className="shrink-0 flex flex-col items-start lg:items-end gap-3">
            {historyForSelected && (
              <div
                className={`p-3 rounded-xl border text-xs font-medium w-full text-center ${
                  historyForSelected.passed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="font-bold mb-0.5">
                  Last Result: {historyForSelected.score} / {historyForSelected.total} ({historyForSelected.percentage}%)
                </div>
                <div>
                  {historyForSelected.passed
                    ? 'Status: PASSED (>= 95% Threshold Met)'
                    : 'Status: DID NOT CLEAR (Required: 95%)'}
                </div>
              </div>
            )}

            {activeAssessment.status === 'active' ? (
              <button
                type="button"
                id="start-level-up-100-btn"
                onClick={() => onStartLevelUpTest(activeAssessment, LEVEL_UP_100_QUESTIONS)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Launch Level Up Assessment (100 MCQs)</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{activeAssessment.releaseDate}</span>
              </div>
            )}

            <div className="text-[11px] text-slate-400 text-center lg:text-right">
              ⏱ 100 Minutes • 100 MCQs • Passing Cutoff: 95 Correct
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
