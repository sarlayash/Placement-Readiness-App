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
  Download,
} from 'lucide-react';
import { Badge, StudentProfile } from '../types';
import { downloadBadgeAsPNG } from '../utils/pngExporter';

interface BadgesViewProps {
  badges: Badge[];
  profile: StudentProfile;
}

export function BadgesView({ badges, profile }: BadgesViewProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const getRarityBadge = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-amber-300 bg-amber-500/20 border-amber-400 font-black shadow-sm shadow-amber-500/20';
      case 'Epic':
        return 'text-amber-200 bg-amber-500/15 border-amber-500/50 font-bold';
      case 'Rare':
        return 'text-white bg-neutral-900 border-amber-500/40 font-semibold';
      default:
        return 'text-neutral-300 bg-black border-neutral-700 font-medium';
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400 fill-amber-400/30" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-amber-300" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-amber-300" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-300 fill-amber-400/30" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <Terminal className="w-5 h-5 text-amber-300" />;
    }
  };

  const handleDownloadPNG = async (badge: Badge, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setDownloadingId(badge.id);
      await downloadBadgeAsPNG(badge, profile.fullName || 'Learner');
    } catch (err) {
      console.error('Failed to download badge PNG:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  const handleShareBadge = (badge: Badge) => {
    const text = `🏆 I earned the "${badge.title}" (${badge.rarity}) badge on Placement Intelligence Platform! Certified By SarlaYash Mission • Powered By Kapil.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto text-white">
      {/* Executive Header Card (Fortune 500 Suite) */}
      <div className="f500-card bg-[#060c1d]/90 border border-blue-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        {/* Subtle Blue Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-400 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25 border border-sky-400/30">
              <Award className="w-5 h-5 text-white stroke-[2.2]" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black text-white tracking-wide uppercase font-['Outfit',sans-serif]">
                  Assessment Badges
                </h2>
                <span className="text-[9px] bg-sky-500/20 text-sky-300 font-extrabold px-1.5 py-0.5 rounded border border-sky-500/30">
                  PNG ONLY
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Certified By <strong className="text-sky-300">SarlaYash Mission</strong> • Powered By <strong className="text-amber-300">Kapil</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-500/15 text-sky-300 border border-blue-500/40 shrink-0">
            {unlockedCount} / {badges.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5 font-medium">
            <span>Overall Badge Completion</span>
            <span className="text-sky-300 font-bold">{Math.round((unlockedCount / badges.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-blue-500/50"
              style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-400 shrink-0" />
            <span>Click any badge below to inspect credentials and download in <strong>PNG format only</strong>.</span>
          </p>
        </div>
      </div>

      {/* Badges Grid (Fortune 500 Executive Cards) */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => {
          const rarityStyle = getRarityBadge(badge.rarity);
          const isDownloading = downloadingId === badge.id;
          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden group flex flex-col justify-between cursor-pointer ${
                badge.unlocked
                  ? 'bg-[#060c1e]/90 border-blue-500/25 hover:border-blue-400 shadow-lg shadow-black hover:shadow-blue-500/10'
                  : 'bg-[#040816]/70 border-slate-800/60 opacity-60 hover:opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-blue-500/30 flex items-center justify-center">
                    {badge.unlocked ? (
                      getBadgeIcon(badge.icon)
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${rarityStyle}`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                  {badge.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Status / PNG Download Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px]">
                {badge.unlocked ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Unlocked</span>
                      </span>
                      <span className="text-[9px] text-slate-400">{badge.unlockedAt || 'Verified'}</span>
                    </div>

                    <button
                      onClick={(e) => handleDownloadPNG(badge, e)}
                      disabled={isDownloading}
                      className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-sm shadow-amber-500/20 active:scale-95 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="text-sky-400 font-semibold">
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden border border-slate-800">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal (Fortune 500 Executive Dossier) */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02050e]/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#060c1d] border border-blue-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center relative overflow-hidden f500-glow">
            {/* Ambient blue glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="w-18 h-18 rounded-2xl bg-slate-900/90 border-2 border-blue-400/60 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 relative z-10">
              {getBadgeIcon(selectedBadge.icon)}
            </div>

            <div className="relative z-10">
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase border ${getRarityBadge(
                  selectedBadge.rarity
                )}`}
              >
                {selectedBadge.rarity} Badge • {selectedBadge.category}
              </span>
              <h3 className="text-lg font-black text-white mt-2 font-['Outfit',sans-serif]">
                {selectedBadge.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            {/* Official Accreditation Box */}
            <div className="bg-[#040816] p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300 text-left relative z-10">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Awarded To:</span>
                <span className="text-sky-300 font-bold">{profile.fullName || 'Learner'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Accredited By:</span>
                <span className="text-white font-medium">SarlaYash Mission</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Chief Mentor:</span>
                <span className="text-white font-medium">Powered By Kapil</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-slate-400">Format:</span>
                <span className="text-amber-400 font-extrabold">PNG Format Only</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-1 relative z-10">
              {/* Mandatory Download PNG Only */}
              <button
                onClick={() => handleDownloadPNG(selectedBadge)}
                disabled={downloadingId === selectedBadge.id}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>{downloadingId === selectedBadge.id ? 'Generating PNG...' : 'Download Badge (PNG Only)'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => handleShareBadge(selectedBadge)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-blue-500/40 text-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
