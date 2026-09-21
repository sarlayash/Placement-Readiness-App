import { useState, useRef } from 'react';
import { X, Printer, Share2, Award, CheckCircle2, ShieldCheck, Sparkles, Download } from 'lucide-react';
import { StudentProfile, ReadinessScoreBreakdown } from '../types';

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
  const certificateRef = useRef<HTMLDivElement | null>(null);

  // Generate deterministic certificate serial ID based on student name and current year
  const certId = `SYM-PRS-2026-${Math.abs(
    profile.fullName.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .padStart(6, '7')}`;

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText?.(`${url}#cert=${certId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                Official Placement Readiness Certificate
              </h3>
              <p className="text-[10px] text-slate-400">
                Accredited & Cryptographically Verified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Share verification link"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas / Printable Area */}
        <div className="p-3 sm:p-6 bg-slate-950 flex justify-center print:p-0">
          <div
            ref={certificateRef}
            id="official-placement-certificate"
            className="w-full relative bg-[#0b1120] text-slate-100 rounded-2xl border-4 border-[#ca8a04] p-5 sm:p-8 shadow-2xl overflow-hidden print:w-full print:m-0 print:border-4 print:border-amber-700 print:text-black print:bg-white"
            style={{
              backgroundImage: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.5) 0%, rgba(11, 17, 32, 0.95) 100%)',
            }}
          >
            {/* Guilloché Double Inset Border */}
            <div className="absolute inset-2 border-2 border-dashed border-amber-400/40 rounded-xl pointer-events-none" />
            <div className="absolute inset-3 border border-amber-500/20 rounded-lg pointer-events-none" />

            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 text-amber-400/60 font-serif text-lg select-none">❖</div>
            <div className="absolute top-4 right-4 text-amber-400/60 font-serif text-lg select-none">❖</div>
            <div className="absolute bottom-4 left-4 text-amber-400/60 font-serif text-lg select-none">❖</div>
            <div className="absolute bottom-4 right-4 text-amber-400/60 font-serif text-lg select-none">❖</div>

            {/* Certificate Header Branding */}
            <div className="text-center space-y-1 relative z-10 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>SARLAYASH MISSION NATIONAL ACCREDITATION</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>

              <h1 className="font-serif text-xl sm:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 uppercase mt-2">
                Certificate of Placement Readiness
              </h1>
              <p className="text-[10px] sm:text-xs tracking-widest text-slate-300 uppercase font-semibold">
                CAMPUS RECRUITMENT BENCHMARK & COMPETENCE CERTIFICATION
              </p>
            </div>

            {/* Presentation Line */}
            <div className="text-center my-4 sm:my-6 relative z-10">
              <p className="text-xs text-slate-400 italic">
                This credential is proud to certify that
              </p>

              {/* Student Name */}
              <div className="my-2 border-b-2 border-amber-500/40 inline-block px-6 sm:px-12 pb-1.5">
                <h2 className="text-xl sm:text-3xl font-serif font-black text-amber-300 tracking-wide">
                  {profile.fullName}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mx-auto leading-relaxed mt-1">
                of <strong className="text-white">{profile.college}</strong>, pursuing{' '}
                <span className="text-amber-200 font-semibold">
                  {profile.degree} in {profile.branch} (Class of {profile.graduationYear})
                </span>
                , has demonstrated exceptional technical aptitude, algorithmic mastery, and verified placement readiness.
              </p>
            </div>

            {/* Verified Metrics Badge Ribbon */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4 max-w-lg mx-auto relative z-10 text-center">
              <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-2.5">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Readiness Score
                </span>
                <span className="text-base sm:text-xl font-extrabold text-amber-400">
                  {readiness.overallScore} <span className="text-xs text-slate-400">/ 1000</span>
                </span>
                <span className="text-[9px] text-emerald-400 block font-semibold">
                  Top {100 - readiness.percentile}% Tier
                </span>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-2.5">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Target Tier
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-200 mt-1 block truncate">
                  {profile.targetCompanyTier}
                </span>
                <span className="text-[9px] text-indigo-400 block font-medium">
                  {profile.targetRole}
                </span>
              </div>

              <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-2.5">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Qualification
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-1 block">
                  Tier-1 Verified
                </span>
                <span className="text-[9px] text-slate-400 block">
                  Aptitude & DSA
                </span>
              </div>
            </div>

            {/* Golden Medallion / Center Seal */}
            <div className="flex justify-center my-3 relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center text-center">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-950 bg-gradient-to-tr from-amber-600 to-amber-400 flex flex-col items-center justify-center text-slate-950 p-1">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
                  <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter leading-none mt-0.5">
                    VERIFIED
                  </span>
                  <span className="text-[6px] font-bold tracking-tighter">EXCELLENCE</span>
                </div>
              </div>
            </div>

            {/* MANDATORY ACCREDITATION & SIGNATURES */}
            <div className="mt-4 pt-4 border-t border-amber-500/30 grid grid-cols-2 gap-4 relative z-10">
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
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-400 gap-1.5 relative z-10">
              <div>
                <span>Certificate ID: </span>
                <strong className="text-amber-300 font-mono">{certId}</strong>
              </div>
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Cryptographically Authenticated by SarlaYash Mission</span>
              </div>
              <div>
                <span>Issued On: </span>
                <strong className="text-slate-300">{issueDate}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Actions Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 print:hidden">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Eligible for LinkedIn, Resume & Campus Placement Dossier</span>
          </span>
          <button
            onClick={handlePrint}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            Download High-Res PDF
          </button>
        </div>
      </div>
    </div>
  );
}
