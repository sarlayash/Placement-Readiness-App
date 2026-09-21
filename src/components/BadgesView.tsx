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
      {/* Executive Header Card (Black, White & Gold) */}
      <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        {/* Subtle Gold Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Award className="w-5 h-5 text-black stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black text-amber-300 tracking-wide uppercase">
                  Assessment Badges
                </h2>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30">
                  PNG ONLY
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 mt-0.5">
                Certified By <strong className="text-amber-200">SarlaYash Mission</strong> • Powered By <strong className="text-amber-200">Kapil</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 shrink-0">
            {unlockedCount} / {badges.length}
          </span>
        </div>

        {/* Gold Metallic Progress bar */}
        <div className="mt-4 pt-3 border-t border-neutral-900">
          <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-1.5 font-medium">
            <span>Overall Badge Completion</span>
            <span className="text-amber-400 font-bold">{Math.round((unlockedCount / badges.length) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-900 border border-neutral-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
              style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Click any badge below to inspect credentials and download in <strong>PNG format only</strong>.</span>
          </p>
        </div>
      </div>

      {/* Badges Grid (Black & Gold Cards) */}
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
                  ? 'bg-neutral-950 border-amber-500/30 hover:border-amber-400 shadow-md shadow-black hover:shadow-amber-500/10'
                  : 'bg-black border-neutral-900 opacity-60 hover:opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-amber-500/30 flex items-center justify-center">
                    {badge.unlocked ? (
                      getBadgeIcon(badge.icon)
                    ) : (
                      <Lock className="w-4 h-4 text-neutral-500" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${rarityStyle}`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                  {badge.title}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Status / PNG Download Button */}
              <div className="mt-3 pt-2.5 border-t border-neutral-900 text-[10px]">
                {badge.unlocked ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-400" />
                        <span>Unlocked</span>
                      </span>
                      <span className="text-[9px] text-neutral-400">{badge.unlockedAt || 'Verified'}</span>
                    </div>

                    <button
                      onClick={(e) => handleDownloadPNG(badge, e)}
                      disabled={isDownloading}
                      className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-sm shadow-amber-500/20 active:scale-95"
                    >
                      <Download className="w-3 h-3" />
                      <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-neutral-400 mb-1">
                      <span>Progress</span>
                      <span className="text-amber-400 font-semibold">
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-900 rounded-full h-1 overflow-hidden border border-neutral-800">
                      <div
                        className="bg-amber-400 h-full rounded-full"
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

      {/* Badge Detail Modal (Black & Gold Master Dossier) */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-black border-2 border-amber-500/50 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="w-18 h-18 rounded-2xl bg-neutral-900 border-2 border-amber-400/60 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 relative z-10">
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
              <h3 className="text-lg font-black text-white mt-2">
                {selectedBadge.title}
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            {/* Official Accreditation Box */}
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-amber-500/30 text-xs space-y-1.5 text-neutral-300 text-left relative z-10">
              <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                <span className="text-neutral-400">Awarded To:</span>
                <span className="text-amber-300 font-bold">{profile.fullName || 'Learner'}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                <span className="text-neutral-400">Accredited By:</span>
                <span className="text-white font-medium">SarlaYash Mission</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                <span className="text-neutral-400">Chief Mentor:</span>
                <span className="text-white font-medium">Powered By Kapil</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-neutral-400">Format:</span>
                <span className="text-amber-400 font-extrabold">PNG Format Only</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-1 relative z-10">
              {/* Mandatory Download PNG Only */}
              <button
                onClick={() => handleDownloadPNG(selectedBadge)}
                disabled={downloadingId === selectedBadge.id}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-black stroke-[2.5]" />
                <span>{downloadingId === selectedBadge.id ? 'Generating PNG...' : 'Download Badge (PNG Only)'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold border border-neutral-800"
                >
                  Close
                </button>
                <button
                  onClick={() => handleShareBadge(selectedBadge)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
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
