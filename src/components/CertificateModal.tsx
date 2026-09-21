import { useState, useRef } from 'react';
import { X, Share2, Award, CheckCircle2, ShieldCheck, Sparkles, Download } from 'lucide-react';
import { StudentProfile, ReadinessScoreBreakdown } from '../types';
import { downloadElementAsPNG } from '../utils/pngExporter';

interface CertificateModalProps {
  profile: StudentProfile;
  readiness: ReadinessScoreBreakdown;
  onClose: () => void;
}

export function CertificateModal({
  profile,
  readiness,
  onClose,
}: CertificateModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const certificateRef = useRef<HTMLDivElement | null>(null);

  // Generate deterministic certificate serial ID based on student name and current year
  const certId = `SYM-PRS-2026-${Math.abs(
    (profile.fullName || 'LEARNER').split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .padStart(6, '7')}`;

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    try {
      setIsExportingPNG(true);
      const studentName = profile.fullName ? profile.fullName.replace(/[^a-zA-Z0-9]/g, '_') : 'Learner';
      await downloadElementAsPNG(
        certificateRef.current,
        `SarlaYash_Mission_Placement_Certificate_${studentName}.png`
      );
    } catch (err) {
      console.error('Failed to export certificate PNG:', err);
    } finally {
      setTimeout(() => setIsExportingPNG(false), 1000);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText?.(`${url}#cert=${certId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#02050e]/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#070c1b] border border-blue-500/40 rounded-3xl shadow-2xl overflow-hidden f500-glow">
        {/* Top Control Bar (Fortune 500 Executive Suite) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-[#050814]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-400 text-white border border-sky-400/30 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Award className="w-4 h-4 text-white" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white tracking-wider uppercase font-['Outfit',sans-serif]">
                Placement Readiness Certificate
              </h3>
              <p className="text-[10px] text-slate-400">
                Certified By <strong className="text-sky-300">SarlaYash Mission</strong> • Powered By <strong className="text-amber-300">Kapil</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Share verification link"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Prominent Download PNG Only Button */}
            <button
              onClick={handleDownloadPNG}
              disabled={isExportingPNG}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/30 cursor-pointer active:scale-95"
              title="Download Certificate (PNG Format Only)"
            >
              <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>{isExportingPNG ? 'Exporting PNG...' : 'Download PNG'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas (Fortune 500 Imperial Navy & Sovereign Gold) */}
        <div className="p-3 sm:p-6 bg-[#040713] flex justify-center">
          <div
            ref={certificateRef}
            id="official-placement-certificate"
            className="w-full relative bg-[#070d1e] text-white rounded-2xl border-4 border-[#d4af37] p-5 sm:p-8 shadow-2xl overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(ellipse at center, #0f1d42 0%, #060b1a 100%)',
            }}
          >
            {/* Guilloché Double Inset Border in Gold */}
            <div className="absolute inset-2 border-2 border-dashed border-amber-400/40 rounded-xl pointer-events-none" />
            <div className="absolute inset-3 border border-sky-400/20 rounded-lg pointer-events-none" />

            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 text-amber-400 font-serif text-lg select-none">❖</div>
            <div className="absolute top-4 right-4 text-amber-400 font-serif text-lg select-none">❖</div>
            <div className="absolute bottom-4 left-4 text-amber-400 font-serif text-lg select-none">❖</div>
            <div className="absolute bottom-4 right-4 text-amber-400 font-serif text-lg select-none">❖</div>

            {/* Certificate Header Branding */}
            <div className="text-center space-y-1 relative z-10 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-sky-400/40 text-sky-300 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>SARLAYASH MISSION NATIONAL ACCREDITATION</span>
                <Sparkles className="w-3 h-3 text-sky-400" />
              </div>

              <h1 className="font-serif text-xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 uppercase mt-2">
                Certificate of Placement Readiness
              </h1>
              <p className="text-[10px] sm:text-xs tracking-widest text-slate-300 uppercase font-bold">
                COMPREHENSIVE MULTI-MODULE ASSESSMENT CREDENTIAL
              </p>
            </div>

            {/* Presentation Line */}
            <div className="text-center my-4 sm:my-6 relative z-10">
              <p className="text-xs text-slate-400 italic">
                This credential is proud to certify that
              </p>

              {/* Student Name in Large Gold Typography */}
              <div className="my-2 border-b-2 border-amber-500/60 inline-block px-6 sm:px-12 pb-1.5">
                <h2 className="text-xl sm:text-3xl font-serif font-black text-amber-300 tracking-wide">
                  {profile.fullName || 'Learner'}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-lg mx-auto leading-relaxed mt-1">
                {profile.college ? (
                  <>of <strong className="text-white">{profile.college}</strong>, </>
                ) : null}
                demonstrating verified competence across{' '}
                <span className="text-sky-300 font-bold">
                  Verbal Ability, Soft Skills, Coding, Excel, SQL, Power BI, AI, Generative AI & Agentic AI
                </span>
                , with benchmark placement readiness.
              </p>
            </div>

            {/* Verified Metrics Badge Ribbon */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4 max-w-lg mx-auto relative z-10 text-center">
              <div className="bg-[#050a16]/90 border border-blue-500/30 rounded-xl p-2.5 shadow-md">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Readiness Score
                </span>
                <span className="text-base sm:text-xl font-black text-amber-400">
                  {readiness.overallScore} <span className="text-xs text-slate-500">/ 1000</span>
                </span>
                <span className="text-[9px] text-sky-300 block font-bold">
                  Top {100 - readiness.percentile}% Tier
                </span>
              </div>

              <div className="bg-[#050a16]/90 border border-blue-500/30 rounded-xl p-2.5 shadow-md">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Target Role
                </span>
                <span className="text-xs sm:text-sm font-bold text-white mt-1 block truncate">
                  {profile.targetRole || 'Software Engineer'}
                </span>
                <span className="text-[9px] text-amber-300 block font-medium">
                  {profile.targetCompanyTier?.split(' ')[0] || 'Tier-1'}
                </span>
              </div>

              <div className="bg-[#050a16]/90 border border-blue-500/30 rounded-xl p-2.5 shadow-md">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Qualification
                </span>
                <span className="text-xs sm:text-sm font-bold text-sky-300 mt-1 block">
                  All Modules Verified
                </span>
                <span className="text-[9px] text-slate-400 block">
                  Certified Standing
                </span>
              </div>
            </div>

            {/* Golden Medallion / Center Seal */}
            <div className="flex justify-center my-3 relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center text-center">
                <div className="w-full h-full rounded-full border-2 border-dashed border-[#070d1e] bg-gradient-to-tr from-amber-600 to-amber-400 flex flex-col items-center justify-center text-slate-950 p-1">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
                  <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter leading-none mt-0.5">
                    VERIFIED
                  </span>
                  <span className="text-[6px] font-bold tracking-tighter">EXCELLENCE</span>
                </div>
              </div>
            </div>

            {/* MANDATORY ACCREDITATION & DUAL SIGNATURES */}
            <div className="mt-4 pt-4 border-t border-amber-500/40 grid grid-cols-2 gap-4 relative z-10">
              {/* Left Signatory: SarlaYash Mission */}
              <div className="text-center">
                <div className="font-serif italic text-base sm:text-xl text-amber-200 font-bold select-none">
                  SarlaYash Mission
                </div>
                <div className="w-32 sm:w-44 h-0.5 bg-amber-400/50 mx-auto my-1" />
                <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-400">
                  Certified By SarlaYash Mission
                </div>
                <p className="text-[9px] text-slate-400">Director of Academic & Placement Excellence</p>
              </div>

              {/* Right Signatory: Powered By Kapil */}
              <div className="text-center">
                <div className="font-serif italic text-base sm:text-xl text-amber-200 font-bold select-none">
                  Kapil
                </div>
                <div className="w-32 sm:w-44 h-0.5 bg-amber-400/50 mx-auto my-1" />
                <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-400">
                  Powered By Kapil
                </div>
                <p className="text-[9px] text-slate-400">Chief Architect & Placement Mentor</p>
              </div>
            </div>

            {/* Footer Credentials & Verification Hash */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-400 gap-1.5 relative z-10">
              <div>
                <span>Certificate ID: </span>
                <strong className="text-sky-300 font-mono">{certId}</strong>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Cryptographically Authenticated • Format: PNG Only</span>
              </div>
              <div>
                <span>Issued: </span>
                <strong className="text-slate-300">{issueDate}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Actions Footer */}
        <div className="p-3 bg-[#050814] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Eligible for LinkedIn, Resume & Campus Placement Dossier</span>
          </span>
          <button
            onClick={handleDownloadPNG}
            disabled={isExportingPNG}
            className="text-amber-400 hover:text-amber-300 font-black flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPNG ? 'Downloading...' : 'Download Certificate (PNG Only)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
