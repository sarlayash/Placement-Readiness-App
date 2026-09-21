import { Building2, CheckCircle2, ChevronRight, Award, Zap } from 'lucide-react';
import { COMPANY_BENCHMARKS } from '../data/initialData';

interface CompanyIntelligenceModalProps {
  currentScore: number;
  onClose: () => void;
  onTargetRoleClick: () => void;
}

export function CompanyIntelligenceModal({
  currentScore,
  onClose,
  onTargetRoleClick,
}: CompanyIntelligenceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Placement Tier Cutoffs & Intelligence
              </h3>
              <p className="text-xs text-slate-400">
                Your Current Placement Score:{' '}
                <strong className="text-emerald-400">{currentScore} / 1000</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {COMPANY_BENCHMARKS.map((comp, idx) => {
            const isQualified = currentScore >= comp.cutoffScore;
            return (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{comp.name}</h4>
                    <span className="text-[11px] text-indigo-300 font-semibold">
                      Compensation: {comp.packageRange}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isQualified
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {isQualified ? 'Target Cutoff Met' : `Needs +${comp.cutoffScore - currentScore} pts`}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-300 font-medium">Recruitment Rounds:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {comp.rounds.map((rnd, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                      >
                        {rnd}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 leading-relaxed">
                  <strong className="text-slate-300">Hiring Focus:</strong> {comp.hiringFocus}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
