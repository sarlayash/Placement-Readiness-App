import { useState } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Wrench,
  RotateCcw,
  Check,
} from 'lucide-react';
import { PersonalizedRoadmap, StudentProfile } from '../types';

interface RoadmapViewProps {
  roadmap: PersonalizedRoadmap;
  profile: StudentProfile;
  readinessScore: number;
  onToggleMilestone: (phaseId: string, milestoneId: string) => void;
  onRegenerateRoadmap: () => Promise<void>;
}

export function RoadmapView({
  roadmap,
  profile,
  readinessScore,
  onToggleMilestone,
  onRegenerateRoadmap,
}: RoadmapViewProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateRoadmap();
      setToastMessage('Personalized roadmap synchronized with latest assessment metrics!');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Calculate overall milestones completed
  const totalMilestones = roadmap.phases.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = roadmap.phases.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.completed).length,
    0
  );
  const roadmapProgressPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto p-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-lg flex items-center justify-between animate-fade-in">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Roadmap Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Personalized Placement Roadmap
              </h2>
              <p className="text-xs text-slate-400">
                Customized for {profile.targetRole}
              </p>
            </div>
          </div>

          <button
            id="regenerate-ai-roadmap-btn"
            disabled={isRegenerating}
            onClick={handleRegenerate}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRegenerating ? 'Generating...' : 'AI Refine'}</span>
          </button>
        </div>

        {/* Strategy Overview */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-slate-800">
          {roadmap.overview}
        </p>

        {/* Progress Metric */}
        <div className="pt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Roadmap Milestone Progress</span>
            <span className="font-bold text-indigo-400">
              {completedMilestones} of {totalMilestones} Completed ({roadmapProgressPct}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${roadmapProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Identified Strengths & Focus Areas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">
            Key Strengths Identified
          </span>
          <ul className="text-xs text-slate-300 space-y-1">
            {roadmap.strengths.slice(0, 3).map((s, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-emerald-400">•</span>
                <span className="truncate">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1.5">
            Critical Focus Gaps
          </span>
          <ul className="text-xs text-slate-300 space-y-1">
            {roadmap.focusGaps.slice(0, 3).map((g, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-rose-400">•</span>
                <span className="truncate">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4-Phase Chronological Steps */}
      <div className="space-y-3">
        {roadmap.phases.map((phase, pIdx) => {
          const phaseCompleted = phase.milestones.every((m) => m.completed);
          const phaseDoneCount = phase.milestones.filter((m) => m.completed).length;

          return (
            <div
              key={phase.id || pIdx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
            >
              {/* Phase Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center justify-center">
                      {pIdx + 1}
                    </span>
                    <h3 className="text-xs font-bold text-slate-100">
                      {phase.phase}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 pl-7">
                    {phase.goal}
                  </p>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                  {phase.completionScoreTarget}
                </span>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 pl-7 pt-1">
                {phase.milestones.map((milestone) => (
                  <button
                    key={milestone.id}
                    onClick={() => onToggleMilestone(phase.id, milestone.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                      milestone.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {milestone.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={milestone.completed ? 'line-through text-slate-400' : 'font-medium'}>
                        {milestone.title}
                      </span>
                      {milestone.estimatedHours && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>~{milestone.estimatedHours} hrs practice</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Recommended Tools/Resources Chips */}
              {phase.recommendedTools && phase.recommendedTools.length > 0 && (
                <div className="pl-7 pt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-indigo-400" /> Recommended:
                  </span>
                  {phase.recommendedTools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-indigo-300 border border-slate-700 font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
