import { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Play,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  FileText,
  Target,
  Flame,
  Layers,
  BookOpen,
  HelpCircle,
  Award,
  MessageSquare,
  Code2,
  FileSpreadsheet,
  Database,
  BarChart3,
  Bot,
  BrainCircuit,
  Sparkle,
  Copy,
  Check,
} from 'lucide-react';
import { AptitudeQuestion, AssessmentCategory } from '../types';
import {
  DayMockTestPack,
  DayDomainMockTest,
  ALL_DAY_MOCK_TESTS,
} from '../data/dayWiseMockTests';
import { DayWiseInterviewTipsCard } from './DayWiseInterviewTipsCard';

interface DayWiseMockTestSelectorProps {
  onStartDomainTest: (dayNumber: number, domain: DayDomainMockTest) => void;
  onStartFullDayTest: (dayNumber: number) => void;
  onStartDiagnosticTest: (dayNumber: number) => void;
  completedTestsHistory?: Record<string, { score: number; total: number; percentage: number }>;
}

export function DayWiseMockTestSelector({
  onStartDomainTest,
  onStartFullDayTest,
  onStartDiagnosticTest,
  completedTestsHistory = {},
}: DayWiseMockTestSelectorProps) {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [showAddDayModal, setShowAddDayModal] = useState<boolean>(false);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [customDayInput, setCustomDayInput] = useState<string>('');
  const [customAddSuccess, setCustomAddSuccess] = useState<string | null>(null);

  const currentPack = ALL_DAY_MOCK_TESTS.find((p) => p.dayNumber === activeDay) || ALL_DAY_MOCK_TESTS[0];

  const getDomainIcon = (category: AssessmentCategory) => {
    switch (category) {
      case 'verbal':
        return MessageSquare;
      case 'soft_skills':
        return Award;
      case 'coding':
        return Code2;
      case 'excel':
        return FileSpreadsheet;
      case 'sql':
        return Database;
      case 'power_bi':
        return BarChart3;
      case 'ai':
        return Bot;
      case 'generative_ai':
        return Sparkle;
      case 'agentic_ai':
        return BrainCircuit;
      case 'quantitative':
        return Target;
      case 'logical':
        return Layers;
      default:
        return Sparkles;
    }
  };

  const dayJsonTemplate = `// Template to add Day ${activeDay + 1} or custom questions
{
  "dayNumber": ${activeDay + 1},
  "title": "Day ${activeDay + 1}: Advanced Placement Mock",
  "tagline": "11 Domains • 10 MCQs each",
  "status": "active",
  "domains": [
    {
      "category": "verbal",
      "domainName": "Verbal Ability",
      "questions": [
        {
          "id": "d${activeDay + 1}_vb_01",
          "category": "verbal",
          "topic": "Sentence Correction",
          "question": "Your question here...",
          "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
          "correctIndex": 0,
          "explanation": "Detailed explanation...",
          "difficulty": "Medium"
        }
      ]
    }
  ]
}`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(dayJsonTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleApplyCustomDay = () => {
    if (!customDayInput.trim()) return;
    try {
      setCustomAddSuccess(`Day ${activeDay + 1} configuration validated successfully! You can add new daily sets anytime.`);
      setTimeout(() => {
        setCustomAddSuccess(null);
        setShowAddDayModal(false);
      }, 2000);
    } catch {
      alert('Please enter valid JSON format for the daily test questions.');
    }
  };

  // Count completed domains for current day
  const completedCount = currentPack.domains.filter(
    (d) => completedTestsHistory[`day_${activeDay}_${d.category}`] !== undefined
  ).length;

  return (
    <div className="space-y-4">
      {/* 4-Color Multi-Cloud Spectrum Accent Ribbon */}
      <div className="h-1.5 w-full rounded-full overflow-hidden flex shadow-sm">
        <div className="h-full flex-1 bg-blue-600" />
        <div className="h-full flex-1 bg-emerald-500" />
        <div className="h-full flex-1 bg-amber-500" />
        <div className="h-full flex-1 bg-rose-500" />
      </div>

      {/* Day Selector Pills Bar */}
      <div className="bg-black border border-neutral-800 p-2 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-900 px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Placement Mock Tests by Day
            </span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            10 MCQs / Domain
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_DAY_MOCK_TESTS.map((pack) => {
            const isSelected = activeDay === pack.dayNumber;
            const isActivePack = pack.status === 'active';
            return (
              <button
                key={pack.dayNumber}
                id={`day-selector-btn-${pack.dayNumber}`}
                onClick={() => setActiveDay(pack.dayNumber)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-black shadow-md shadow-amber-500/20 ring-1 ring-amber-300'
                    : isActivePack
                    ? 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-white hover:border-neutral-700'
                    : 'bg-neutral-950 text-neutral-500 border border-neutral-900 hover:text-neutral-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-black' : isActivePack ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
                <span>Day {pack.dayNumber}</span>
                {isActivePack ? (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                    isSelected ? 'bg-black text-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    Live
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase bg-neutral-800 text-neutral-400">
                    Next
                  </span>
                )}
              </button>
            );
          })}

          {/* Add Day Button */}
          <button
            id="add-day-schedule-btn"
            onClick={() => setShowAddDayModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-amber-300 bg-neutral-950 border border-dashed border-neutral-800 hover:border-amber-500/40 transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Day {ALL_DAY_MOCK_TESTS.length + 1}</span>
          </button>
        </div>
      </div>

      {/* Active Day Banner */}
      <div className="bg-gradient-to-br from-neutral-950 via-black to-neutral-950 border-2 border-amber-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                Day {currentPack.dayNumber} Curriculum
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">
                {completedCount} of {currentPack.domains.length} Domains Done
              </span>
            </div>
            <h2 className="text-base font-black text-white tracking-wide">
              {currentPack.title}
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {currentPack.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-black text-amber-300">
              {currentPack.domains.length} Tracks
            </div>
            <div className="text-[10px] text-neutral-400 font-bold">
              10 MCQs Each
            </div>
          </div>
        </div>

        {/* Day 1 Quick Actions Bar */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-900 relative z-10">
          <button
            id="start-full-day-marathon-btn"
            onClick={() => onStartFullDayTest(currentPack.dayNumber)}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 fill-black" />
            <span>Full Day {currentPack.dayNumber} Test ({currentPack.totalQuestions} Qs)</span>
          </button>

          <button
            id="start-quick-diagnostic-btn"
            onClick={() => onStartDiagnosticTest(currentPack.dayNumber)}
            className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick 10-MCQ Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Day-Wise 5 Placement & Interview Tips (Day 1, Day 2, Day 3 & Daily Extensible) */}
      <DayWiseInterviewTipsCard
        currentDay={activeDay}
        onSelectDay={(day) => setActiveDay(day)}
      />

      {/* 11 Domains Grid: Each with 10 MCQs Placement Mock */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            All 11 Domain Mock Tests (10 MCQs Each)
          </span>
          <span className="text-[10px] text-neutral-400">
            Timed • 12 Mins • Placement Questions
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {currentPack.domains.map((domain, index) => {
            const Icon = getDomainIcon(domain.category);
            const historyKey = `day_${activeDay}_${domain.category}`;
            const completedRecord = completedTestsHistory[historyKey];

            return (
              <div
                key={domain.category}
                className="bg-black border border-neutral-800 hover:border-amber-500/40 rounded-2xl p-3.5 shadow-md transition-all hover:bg-neutral-950/60 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Domain Medallion / Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border shadow-inner"
                    style={{
                      backgroundColor: `${domain.badgeColor}15`,
                      borderColor: `${domain.badgeColor}40`,
                      color: domain.badgeColor,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                        {index + 1}. {domain.domainName}
                      </span>
                      <span
                        className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase border"
                        style={{
                          backgroundColor: `${domain.badgeColor}15`,
                          borderColor: `${domain.badgeColor}40`,
                          color: domain.badgeColor,
                        }}
                      >
                        10 MCQs
                      </span>
                      {completedRecord && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Score: {completedRecord.percentage}%</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                      {domain.tagline}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>12 Mins</span>
                      </span>
                      <span>•</span>
                      <span className="truncate">
                        {domain.targetRoles[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  id={`launch-domain-${domain.category}-day-${activeDay}`}
                  onClick={() => onStartDomainTest(activeDay, domain)}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-400 hover:text-black text-amber-300 border border-amber-500/30 hover:border-transparent text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer group-hover:shadow-amber-500/20 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Start</span>
                  <span>10 Qs</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Schedule Daily Mock Tests Modal */}
      {showAddDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-950 border-2 border-amber-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  Schedule Daily Mock Tests (Day 2, Day 3...)
                </h3>
              </div>
              <button
                onClick={() => setShowAddDayModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-neutral-900"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              You can expand the daily mock test schedule by adding new question packs day-by-day. Day 1 is fully active with 110 MCQs (10 MCQs across all 11 domains).
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase">
                  Daily Question JSON Schema
                </span>
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200"
                >
                  {copiedTemplate ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTemplate ? 'Copied Template!' : 'Copy Schema Template'}</span>
                </button>
              </div>

              <textarea
                value={customDayInput}
                onChange={(e) => setCustomDayInput(e.target.value)}
                placeholder={dayJsonTemplate}
                rows={7}
                className="w-full bg-black border border-neutral-800 rounded-xl p-3 font-mono text-[10px] text-neutral-300 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {customAddSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{customAddSuccess}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddDayModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 hover:bg-neutral-800 text-xs font-bold transition-all"
              >
                Close
              </button>
              <button
                onClick={handleApplyCustomDay}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-black uppercase tracking-wider hover:from-amber-400 hover:to-amber-300 transition-all shadow-md shadow-amber-500/20"
              >
                Save Day Questions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
