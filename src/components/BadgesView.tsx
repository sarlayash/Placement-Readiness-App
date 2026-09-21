import { useState } from 'react';
import {
  Award,
  Lock,
  CheckCircle2,
  Share2,
  Sparkles,
  Trophy,
  Flame,
  Terminal,
  BrainCircuit,
  ShieldCheck,
  Cpu,
  Zap,
} from 'lucide-react';
import { Badge, StudentProfile } from '../types';

interface BadgesViewProps {
  badges: Badge[];
  profile: StudentProfile;
}

export function BadgesView({ badges, profile }: BadgesViewProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const getRarityBadge = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/40';
      case 'Epic':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/40';
      case 'Rare':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/40';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-indigo-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-300 fill-amber-400/20" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <Terminal className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleShareBadge = (badge: Badge) => {
    const text = `🏆 I earned the "${badge.title}" (${badge.rarity}) badge on PlacementIQ Intelligence Platform! #CampusPlacement #${profile.targetRole.replace(/\s+/g, '')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Placement Achievement Badges
              </h2>
              <p className="text-xs text-slate-400">
                Unlock badges through assessments, streaks, and scoring milestones
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {unlockedCount} / {badges.length} Unlocked
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => {
          const rarityStyle = getRarityBadge(badge.rarity);
          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden group flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm'
                  : 'bg-slate-950/60 border-slate-900 opacity-60 hover:opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                    {badge.unlocked ? (
                      getBadgeIcon(badge.icon)
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${rarityStyle}`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-100 truncate">
                  {badge.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Status / Progress */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px]">
                {badge.unlocked ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked {badge.unlockedAt ? `(${badge.unlockedAt})` : ''}</span>
                  </span>
                ) : (
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-900 to-violet-900 border border-indigo-500/40 flex items-center justify-center mx-auto shadow-md">
              {getBadgeIcon(selectedBadge.icon)}
            </div>

            <div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getRarityBadge(
                  selectedBadge.rarity
                )}`}
              >
                {selectedBadge.rarity} Badge
              </span>
              <h3 className="text-base font-bold text-slate-100 mt-2">
                {selectedBadge.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-slate-200 font-medium">{selectedBadge.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={selectedBadge.unlocked ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                  {selectedBadge.unlocked ? 'Earned & Verified' : 'Locked'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedBadge(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
              {selectedBadge.unlocked && (
                <button
                  onClick={() => handleShareBadge(selectedBadge)}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShare ? 'Copied Link!' : 'Share Badge'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
