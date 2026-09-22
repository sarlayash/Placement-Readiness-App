import { useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Briefcase,
  Flame,
  PlusCircle,
  Share2,
  Award,
} from 'lucide-react';
import {
  PlacementInterviewTip,
  ALL_DAY_TIPS,
  getDayTips,
} from '../data/dayWiseInterviewTips';

interface DayWiseInterviewTipsCardProps {
  currentDay: number;
  onSelectDay?: (day: number) => void;
}

export function DayWiseInterviewTipsCard({
  currentDay,
  onSelectDay,
}: DayWiseInterviewTipsCardProps) {
  const [selectedDay, setSelectedDay] = useState<number>(currentDay || 1);
  const [expandedTipId, setExpandedTipId] = useState<string | null>('d1_tip_01');
  const [copiedTipId, setCopiedTipId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [masteredTips, setMasteredTips] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddDailyTipModal, setShowAddDailyTipModal] = useState<boolean>(false);
  const [customTips, setCustomTips] = useState<PlacementInterviewTip[]>([]);
  const [newTipTitle, setNewTipTitle] = useState('');
  const [newTipRule, setNewTipRule] = useState('');
  const [newTipAdvice, setNewTipAdvice] = useState('');
  const [newTipCompany, setNewTipCompany] = useState('');

  // Keep internal selectedDay synced if external currentDay changes
  const activeDayNumber = selectedDay || currentDay || 1;
  const dayData = getDayTips(activeDayNumber);
  
  // Combine official day tips with any user-added custom tips for this day
  const allTipsForDay = [
    ...dayData.tips,
    ...customTips.filter((t) => t.dayNumber === activeDayNumber),
  ];

  const categories = [
    'all',
    ...Array.from(new Set(allTipsForDay.map((t) => t.category))),
  ];

  const filteredTips =
    selectedCategory === 'all'
      ? allTipsForDay
      : allTipsForDay.filter((t) => t.category === selectedCategory);

  const masteredCount = allTipsForDay.filter((t) => masteredTips[t.id]).length;

  const handleToggleMastered = (tipId: string) => {
    setMasteredTips((prev) => ({
      ...prev,
      [tipId]: !prev[tipId],
    }));
  };

  const handleCopySingleTip = (tip: PlacementInterviewTip) => {
    const text = `💡 [Day ${tip.dayNumber} - Tip ${tip.tipNumber}]: ${tip.title}\n🎯 Target Round: ${tip.targetRound}\n⚡ Key Rule: ${tip.keyRule}\n\n📖 Advice: ${tip.detailedAdvice}\n\n✅ Action Step: ${tip.actionableStep}\n\n🏢 Company Pattern: ${tip.companyPattern}`;
    navigator.clipboard.writeText(text);
    setCopiedTipId(tip.id);
    setTimeout(() => setCopiedTipId(null), 2000);
  };

  const handleCopyAllDayTips = () => {
    const header = `🏆 DAY ${activeDayNumber} PLACEMENT & INTERVIEW TIPS (5 GOLDEN RULES)\nTheme: ${dayData.theme}\n${dayData.tagline}\n\n`;
    const body = allTipsForDay
      .map(
        (t) =>
          `[Tip #${t.tipNumber}] ${t.title} (${t.category})\nTarget: ${t.targetRound}\nRule: ${t.keyRule}\nAdvice: ${t.detailedAdvice}\nAction: ${t.actionableStep}\nCompany: ${t.companyPattern}\n`
      )
      .join('\n---\n\n');

    navigator.clipboard.writeText(header + body);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  const handleAddDailyCustomTip = () => {
    if (!newTipTitle.trim() || !newTipRule.trim()) return;

    const newTip: PlacementInterviewTip = {
      id: `custom_d${activeDayNumber}_tip_${Date.now()}`,
      dayNumber: activeDayNumber,
      tipNumber: allTipsForDay.length + 1,
      title: newTipTitle.trim(),
      category: 'Core CS & Tech',
      targetRound: 'Technical Interview',
      keyRule: newTipRule.trim(),
      detailedAdvice: newTipAdvice.trim() || newTipRule.trim(),
      actionableStep: 'Apply this tip in today\'s mock test practice.',
      companyPattern: newTipCompany.trim() || 'Frequently tested across campus placement drives.',
      tag: 'Custom Tip',
    };

    setCustomTips((prev) => [...prev, newTip]);
    setNewTipTitle('');
    setNewTipRule('');
    setNewTipAdvice('');
    setNewTipCompany('');
    setShowAddDailyTipModal(false);
  };

  return (
    <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                Day {activeDayNumber} Placement & Interview Tips
              </h3>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-extrabold">
                5 Golden Rules
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {dayData.tagline}
            </p>
          </div>
        </div>

        {/* Day Selector Pills & Copy All */}
        <div className="flex items-center gap-1.5">
          <div className="flex bg-neutral-950 p-0.5 rounded-xl border border-neutral-800">
            {ALL_DAY_TIPS.map((day) => {
              const isSelected = activeDayNumber === day.dayNumber;
              return (
                <button
                  key={day.dayNumber}
                  id={`day-tip-tab-${day.dayNumber}`}
                  onClick={() => {
                    setSelectedDay(day.dayNumber);
                    if (onSelectDay) onSelectDay(day.dayNumber);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-black shadow-sm font-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Day {day.dayNumber}
                </button>
              );
            })}
          </div>

          <button
            id="copy-all-day-tips-btn"
            onClick={handleCopyAllDayTips}
            title="Copy all 5 tips for this day"
            className="px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{copiedAll ? 'Copied All!' : 'Copy Day'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Mastered Counter */}
        <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1 rounded-xl border border-neutral-900">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-neutral-400">Mastered:</span>
          <strong className="text-amber-300 font-bold">
            {masteredCount} / {allTipsForDay.length} Tips
          </strong>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-900'
              }`}
            >
              {cat === 'all' ? 'All Tips' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Tips List */}
      <div className="space-y-2.5">
        {filteredTips.map((tip) => {
          const isExpanded = expandedTipId === tip.id;
          const isMastered = !!masteredTips[tip.id];

          return (
            <div
              key={tip.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-neutral-950/80 border-amber-500/50 shadow-md shadow-amber-500/5'
                  : 'bg-neutral-950/40 border-neutral-900 hover:border-neutral-800'
              }`}
            >
              {/* Tip Header Row */}
              <div
                onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
                className="p-3 flex items-start justify-between gap-2 cursor-pointer select-none"
              >
                <div className="flex items-start gap-2.5">
                  {/* Tip Number Badge */}
                  <span className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    #{tip.tipNumber}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-xs font-black text-white hover:text-amber-300 transition-colors">
                        {tip.title}
                      </h4>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-neutral-900 text-amber-400 border border-neutral-800">
                        {tip.category}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-300 mt-1 flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="text-amber-200/90 font-medium">{tip.targetRound}</span>
                    </div>
                  </div>
                </div>

                {/* Right controls: Mastered, Copy, Expand */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMastered(tip.id);
                    }}
                    title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                    className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                      isMastered
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'text-neutral-500 hover:text-neutral-300 border-neutral-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySingleTip(tip);
                    }}
                    title="Copy Tip"
                    className="p-1 rounded-lg text-neutral-400 hover:text-amber-300 border border-neutral-800 hover:border-neutral-700 cursor-pointer"
                  >
                    {copiedTipId === tip.id ? (
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    className="text-neutral-400 hover:text-white p-1"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Details Body */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-neutral-900 space-y-2.5 text-xs animate-fade-in">
                  {/* Key Rule Callout */}
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 font-medium leading-relaxed">
                    ⚡ <strong className="text-amber-300 font-black uppercase text-[10px] mr-1">Golden Rule:</strong>
                    {tip.keyRule}
                  </div>

                  {/* Detailed Strategic Advice */}
                  <div className="text-neutral-300 leading-relaxed space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                      Placement Strategy & Analysis:
                    </span>
                    <p className="text-neutral-300 text-xs">
                      {tip.detailedAdvice}
                    </p>
                  </div>

                  {/* Actionable Step */}
                  <div className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-300 block">
                        Action Step for Today:
                      </span>
                      <span className="text-neutral-200 text-[11px] leading-relaxed">
                        {tip.actionableStep}
                      </span>
                    </div>
                  </div>

                  {/* Company Hiring Pattern */}
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-950 p-2 rounded-lg border border-neutral-900">
                    <Briefcase className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>
                      <strong className="text-neutral-300">Company Pattern:</strong> {tip.companyPattern}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom Daily Tip trigger bar */}
      <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-xs">
        <span className="text-neutral-400 text-[11px]">
          Adding tips daily for Day 1, 2, 3 and subsequent days.
        </span>
        <button
          id="add-daily-tip-btn"
          onClick={() => setShowAddDailyTipModal(true)}
          className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-xs font-bold transition-colors cursor-pointer bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-800"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Add Custom Tip for Day {activeDayNumber}</span>
        </button>
      </div>

      {/* Modal: Add Custom Daily Tip */}
      {showAddDailyTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-black border-2 border-amber-500/50 rounded-2xl p-5 max-w-md w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-amber-300">
                  Add Placement Tip for Day {activeDayNumber}
                </h3>
              </div>
              <button
                onClick={() => setShowAddDailyTipModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-neutral-300 block mb-1 font-bold">
                  Tip Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. The 2-Minute Resume Elevator Pitch"
                  value={newTipTitle}
                  onChange={(e) => setNewTipTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-bold">
                  Golden Rule (The Key Mantra):
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Structure your introduction in Past, Present, Future format..."
                  value={newTipRule}
                  onChange={(e) => setNewTipRule(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1 font-bold">
                  Target Company or Pattern:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amazon, TCS Digital, Infosys, Cognizant"
                  value={newTipCompany}
                  onChange={(e) => setNewTipCompany(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setShowAddDailyTipModal(false)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDailyCustomTip}
                disabled={!newTipTitle.trim() || !newTipRule.trim()}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-black uppercase tracking-wider cursor-pointer disabled:opacity-50"
              >
                Save Daily Tip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
