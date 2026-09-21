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

  /**
   * Google & Microsoft Certification Tier Design System
   * - Fundamental (Common): Azure & Sky Blue
   * - Associate (Rare): Emerald & Cyber Mint
   * - Expert (Epic): Vibrant Violet & Royal Indigo
   * - Master (Legendary): Sovereign Gold & Amber
   */
  const getTierTheme = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return {
          tierName: 'Master Credential',
          tagClass: 'text-amber-300 bg-amber-500/15 border-amber-400/50',
          cardBorder: 'border-amber-500/30 hover:border-amber-400',
          glowClass: 'from-amber-500/20 via-yellow-500/10 to-transparent',
          iconBg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-400/40 text-amber-300 shadow-amber-500/20',
          accentColor: '#F59E0B',
          barGradient: 'from-amber-500 via-yellow-400 to-amber-300',
          btnGradient: 'from-amber-500 via-yellow-400 to-amber-300 text-slate-950',
          iconColor: 'text-amber-400',
        };
      case 'Epic':
        return {
          tierName: 'Expert Level',
          tagClass: 'text-purple-300 bg-purple-500/15 border-purple-400/50',
          cardBorder: 'border-purple-500/30 hover:border-purple-400',
          glowClass: 'from-purple-500/20 via-indigo-500/10 to-transparent',
          iconBg: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border-purple-400/40 text-purple-300 shadow-purple-500/20',
          accentColor: '#8B5CF6',
          barGradient: 'from-indigo-500 via-purple-500 to-pink-400',
          btnGradient: 'from-purple-500 via-indigo-500 to-purple-400 text-white',
          iconColor: 'text-purple-400',
        };
      case 'Rare':
        return {
          tierName: 'Associate Tier',
          tagClass: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/50',
          cardBorder: 'border-emerald-500/30 hover:border-emerald-400',
          glowClass: 'from-emerald-500/20 via-teal-500/10 to-transparent',
          iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-400/40 text-emerald-300 shadow-emerald-500/20',
          accentColor: '#10B981',
          barGradient: 'from-emerald-500 via-teal-400 to-cyan-400',
          btnGradient: 'from-emerald-500 via-teal-400 to-emerald-400 text-slate-950',
          iconColor: 'text-emerald-400',
        };
      default:
        return {
          tierName: 'Fundamental',
          tagClass: 'text-sky-300 bg-sky-500/15 border-sky-400/50',
          cardBorder: 'border-sky-500/30 hover:border-sky-400',
          glowClass: 'from-sky-500/20 via-blue-500/10 to-transparent',
          iconBg: 'bg-gradient-to-br from-sky-500/20 to-blue-500/10 border-sky-400/40 text-sky-300 shadow-sky-500/20',
          accentColor: '#0284C7',
          barGradient: 'from-blue-600 via-sky-500 to-cyan-400',
          btnGradient: 'from-sky-500 via-blue-500 to-indigo-500 text-white',
          iconColor: 'text-sky-400',
        };
    }
  };

  const getBadgeIcon = (iconName: string, colorClass: string = 'text-sky-400') => {
    switch (iconName) {
      case 'Flame':
        return <Flame className={`w-5 h-5 ${colorClass}`} />;
      case 'BrainCircuit':
        return <BrainCircuit className={`w-5 h-5 ${colorClass}`} />;
      case 'ShieldCheck':
        return <ShieldCheck className={`w-5 h-5 ${colorClass}`} />;
      case 'Cpu':
        return <Cpu className={`w-5 h-5 ${colorClass}`} />;
      case 'Trophy':
        return <Trophy className={`w-5 h-5 ${colorClass}`} />;
      case 'Zap':
        return <Zap className={`w-5 h-5 ${colorClass}`} />;
      case 'Sparkles':
        return <Sparkles className={`w-5 h-5 ${colorClass}`} />;
      case 'Award':
        return <Award className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Terminal className={`w-5 h-5 ${colorClass}`} />;
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
    const text = `🏆 I verified the "${badge.title}" (${badge.rarity}) competency badge on Placement Intelligence Platform! Certified By SarlaYash Mission • Powered By Kapil.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Executive Header Card with 4-Color Tech Spectrum Bar */}
      <div className="bg-[#070c1d] border border-blue-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        {/* Four-Color Tech Accent Spectrum Bar (Google/Microsoft style) */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#2563EB]" />
          <div className="flex-1 bg-[#10B981]" />
          <div className="flex-1 bg-[#F59E0B]" />
          <div className="flex-1 bg-[#EF4444]" />
        </div>

        {/* Ambient Tech Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10 pt-1">
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

        {/* Overall Progress bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5 font-medium">
            <span>Certification Track Completion</span>
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
            <span>Faceted Google & Microsoft style credentials • Export in <strong>PNG format only</strong>.</span>
          </p>
        </div>
      </div>

      {/* Badges Grid (Faceted Microsoft/Google Credential Cards) */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => {
          const tier = getTierTheme(badge.rarity);
          const isDownloading = downloadingId === badge.id;

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden group flex flex-col justify-between cursor-pointer ${
                badge.unlocked
                  ? `bg-[#070d1e] ${tier.cardBorder} shadow-lg shadow-black/60 hover:shadow-xl`
                  : 'bg-[#040816]/70 border-slate-800/60 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Subtle tier ambient glow */}
              {badge.unlocked && (
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tier.glowClass} rounded-full blur-xl pointer-events-none`} />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  {/* Faceted Shield / Hexagon Shape Icon Container */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-md ${
                    badge.unlocked ? tier.iconBg : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    {badge.unlocked ? (
                      getBadgeIcon(badge.icon, tier.iconColor)
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <span
                    className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${tier.tagClass}`}
                  >
                    {badge.rarity}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors font-['Outfit',sans-serif]">
                  {badge.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Status & PNG Download Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] relative z-10">
                {badge.unlocked ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Verified</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">{badge.unlockedAt || 'Accredited'}</span>
                    </div>

                    <button
                      onClick={(e) => handleDownloadPNG(badge, e)}
                      disabled={isDownloading}
                      className={`w-full py-1.5 px-2 rounded-lg bg-gradient-to-r ${tier.btnGradient} font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer`}
                      title="Export Badge as PNG Only"
                    >
                      <Download className="w-3 h-3 stroke-[2.5]" />
                      <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Requirement</span>
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

      {/* Badge Detail Modal (Google/Microsoft Style Credential Showcase) */}
      {selectedBadge && (() => {
        const tier = getTierTheme(selectedBadge.rarity);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02050e]/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-[#070d1e] border border-blue-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center relative overflow-hidden f500-glow">
              {/* Four-color micro accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="flex-1 bg-[#2563EB]" />
                <div className="flex-1 bg-[#10B981]" />
                <div className="flex-1 bg-[#F59E0B]" />
                <div className="flex-1 bg-[#EF4444]" />
              </div>

              {/* Ambient tier glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Central Faceted Medallion */}
              <div className="pt-2">
                <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center mx-auto shadow-xl relative z-10 ${tier.iconBg}`}>
                  {getBadgeIcon(selectedBadge.icon, `${tier.iconColor} w-8 h-8`)}
                </div>
              </div>

              <div className="relative z-10">
                <span
                  className={`text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-widest border ${tier.tagClass}`}
                >
                  {tier.tierName} • {selectedBadge.category}
                </span>
                <h3 className="text-xl font-black text-white mt-2.5 font-['Outfit',sans-serif]">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>

              {/* Official Accreditation Dossier */}
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
                  <span className="text-slate-400">Export Format:</span>
                  <span className="text-amber-400 font-extrabold">PNG Format Only</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="space-y-2 pt-1 relative z-10">
                {/* Mandatory Download PNG Only */}
                <button
                  onClick={() => handleDownloadPNG(selectedBadge)}
                  disabled={downloadingId === selectedBadge.id}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${tier.btnGradient} text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95`}
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{downloadingId === selectedBadge.id ? 'Generating PNG...' : 'Download Badge (PNG Only)'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors"
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
        );
      })()}
    </div>
  );
}

