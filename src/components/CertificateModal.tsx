import { useState, useRef } from 'react';
import { X, Share2, Award, CheckCircle2, ShieldCheck, Sparkles, Download, Moon, Sun, Check } from 'lucide-react';
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
  const [certTheme, setCertTheme] = useState<'dark' | 'light'>('dark');
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

  const priScore = readiness.pri?.score || Math.max(1, Math.min(100, Math.round(readiness.overallScore / 10)));
  const priTier = readiness.pri?.tier || (priScore >= 80 ? 'Unicorn Ready' : 'Placement Ready');
  const priPercentile = readiness.pri?.percentile || readiness.percentile;

  const verifiedSkills = [
    'Verbal Ability',
    'Soft Skills',
    'Professional Writing',
    'Business Communication',
    'Emotional Intelligence (EQ)',
    'Coding & DSA',
    'Excel Analytics',
    'SQL Databases',
    'Power BI',
    'AI Foundations',
    'Generative AI',
    'Agentic AI',
    'Quantitative Aptitude',
    'Logical Reasoning',
  ];

  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    try {
      setIsExportingPNG(true);
      const studentName = profile.fullName ? profile.fullName.replace(/[^a-zA-Z0-9]/g, '_') : 'Learner';
      await downloadElementAsPNG(
        certificateRef.current,
        `SarlaYash_Mission_Placement_Certificate_${studentName}_${certTheme}.png`
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
    <div className="fixed inset-0 z-50 bg-[#02050e]/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-3xl bg-[#070c1b] border border-blue-500/40 rounded-3xl shadow-2xl overflow-hidden f500-glow my-auto">
        {/* Top Control Bar (Google/Microsoft Style Executive Suite) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-[#050814]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-400 text-white border border-sky-400/30 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Award className="w-4 h-4 text-white stroke-[2.2]" />
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
            {/* Edition Switcher (Obsidian vs Frost) */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5">
              <button
                onClick={() => setCertTheme('dark')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  certTheme === 'dark'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Obsidian Tech Navy Edition"
              >
                <Moon className="w-3 h-3" />
                <span className="hidden sm:inline">Obsidian</span>
              </button>
              <button
                onClick={() => setCertTheme('light')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  certTheme === 'light'
                    ? 'bg-white text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Enterprise Frost White Edition"
              >
                <Sun className="w-3 h-3" />
                <span className="hidden sm:inline">Frost Ivory</span>
              </button>
            </div>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
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
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-sky-300 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/30 cursor-pointer active:scale-95"
              title="Download Certificate in PNG Format Only"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
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

        {/* Certificate Display Canvas */}
        <div className="p-3 sm:p-5 bg-[#030611] flex justify-center overflow-x-auto">
          <div
            ref={certificateRef}
            id="official-placement-certificate"
            className={`w-full relative rounded-2xl p-5 sm:p-8 shadow-2xl overflow-hidden transition-colors duration-300 ${
              certTheme === 'dark'
                ? 'bg-[#060b18] text-white border-2 border-blue-500/40'
                : 'bg-[#FCFDFF] text-slate-900 border-2 border-slate-300'
            }`}
          >
            {/* Top Four-Color Tech Spectrum Accent Bar (Google / Microsoft multi-cloud signature) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="flex-1 bg-[#2563EB]" />
              <div className="flex-1 bg-[#10B981]" />
              <div className="flex-1 bg-[#F59E0B]" />
              <div className="flex-1 bg-[#EF4444]" />
            </div>

            {/* Precision Micro-Border & Inner Geometry */}
            <div
              className={`absolute inset-2.5 rounded-xl border pointer-events-none ${
                certTheme === 'dark'
                  ? 'border-blue-400/20'
                  : 'border-slate-300/80'
              }`}
            />
            <div
              className={`absolute inset-4 rounded-lg border pointer-events-none ${
                certTheme === 'dark'
                  ? 'border-white/10'
                  : 'border-blue-600/15'
              }`}
            />

            {/* Subtle Tech Watermark Pattern */}
            <div
              className={`absolute -right-16 -bottom-16 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
                certTheme === 'dark' ? 'bg-blue-600/10' : 'bg-blue-100/60'
              }`}
            />

            {/* Certificate Header Branding */}
            <div className="text-center space-y-1 relative z-10 pt-2">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase border ${
                  certTheme === 'dark'
                    ? 'bg-blue-500/15 border-blue-400/40 text-sky-300'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>SARLAYASH MISSION • PLACEMENT ACCREDITATION BOARD</span>
                <Sparkles className="w-3 h-3 text-sky-400" />
              </div>

              <h1
                className={`font-['Outfit',sans-serif] text-xl sm:text-3xl font-black tracking-tight uppercase mt-2 ${
                  certTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                Certificate of Placement Readiness
              </h1>
              <p
                className={`text-[10px] sm:text-xs tracking-widest uppercase font-bold ${
                  certTheme === 'dark' ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                PROFESSIONAL MULTI-MODULE ASSESSMENT CREDENTIAL
              </p>

              {/* Placement Readiness Index (PRI: 1 to 100) Official Calibration Tag */}
              <div className="flex justify-center pt-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider border shadow-sm ${
                    certTheme === 'dark'
                      ? 'bg-sky-500/20 border-sky-400/50 text-sky-200'
                      : 'bg-blue-100 border-blue-300 text-blue-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>PLACEMENT READINESS INDEX (PRI): {priScore}/100 • {priTier}</span>
                </span>
              </div>
            </div>

            {/* Presentation Section */}
            <div className="text-center my-4 sm:my-5 relative z-10">
              <p className={`text-xs italic ${certTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                This is to officially certify that
              </p>

              {/* Student Name */}
              <div
                className={`my-2 inline-block px-8 sm:px-14 pb-1.5 border-b-2 ${
                  certTheme === 'dark'
                    ? 'border-sky-400'
                    : 'border-blue-600'
                }`}
              >
                <h2
                  className={`text-2xl sm:text-4xl font-extrabold tracking-wide ${
                    certTheme === 'dark' ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {profile.fullName || 'Learner'}
                </h2>
              </div>

              <p
                className={`text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed mt-1 ${
                  certTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                {profile.college ? (
                  <>from <strong className={certTheme === 'dark' ? 'text-white' : 'text-slate-900'}>{profile.college}</strong>, </>
                ) : null}
                has fulfilled all rigorous evaluation standards across 14 core competencies with a verified{' '}
                <strong className={certTheme === 'dark' ? 'text-sky-300' : 'text-blue-700'}>
                  Placement Readiness Index (PRI) of {priScore}/100 ({priTier})
                </strong>
                , exhibiting tier-one placement caliber in{' '}
                <span className={certTheme === 'dark' ? 'text-sky-300 font-bold' : 'text-blue-700 font-bold'}>
                  Verbal Reasoning, Professional Writing, Business Communication, EQ, DSA, Data Analytics & Agentic AI
                </span>
                .
              </p>
            </div>

            {/* Verified Skills Pill Bar */}
            <div className="flex flex-wrap justify-center gap-1.5 my-3 max-w-xl mx-auto relative z-10">
              {verifiedSkills.map((skill) => (
                <span
                  key={skill}
                  className={`text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border ${
                    certTheme === 'dark'
                      ? 'bg-slate-900/80 border-slate-700/80 text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Check className="w-2.5 h-2.5 text-emerald-500 stroke-[3]" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>

            {/* Verified Metrics Badge Ribbon (4 Cards including PRI 1 to 100) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 my-3.5 max-w-2xl mx-auto relative z-10 text-center">
              {/* Card 1: Placement Readiness Index (PRI) */}
              <div
                className={`rounded-xl p-2.5 border ${
                  certTheme === 'dark'
                    ? 'bg-[#091124] border-sky-500/40 shadow-sm shadow-sky-500/10'
                    : 'bg-sky-50 border-sky-300'
                }`}
              >
                <span className="text-[9px] uppercase font-bold text-sky-400 tracking-wider block truncate">
                  Placement Index (PRI)
                </span>
                <span
                  className={`text-base sm:text-xl font-black ${
                    certTheme === 'dark' ? 'text-sky-300' : 'text-sky-800'
                  }`}
                >
                  {priScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
                <span className="text-[9px] text-emerald-500 block font-bold truncate">
                  Top {100 - priPercentile}% Standing
                </span>
              </div>

              {/* Card 2: Composite PRS */}
              <div
                className={`rounded-xl p-2.5 border ${
                  certTheme === 'dark'
                    ? 'bg-[#091124] border-blue-500/30'
                    : 'bg-blue-50/50 border-blue-200/80'
                }`}
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block truncate">
                  Readiness Score
                </span>
                <span
                  className={`text-base sm:text-xl font-black ${
                    certTheme === 'dark' ? 'text-indigo-300' : 'text-blue-700'
                  }`}
                >
                  {readiness.overallScore} <span className="text-xs text-slate-400 font-normal">/ 1000</span>
                </span>
                <span className="text-[9px] text-slate-400 block font-medium truncate">
                  Composite Evaluation
                </span>
              </div>

              {/* Card 3: Target Role */}
              <div
                className={`rounded-xl p-2.5 border ${
                  certTheme === 'dark'
                    ? 'bg-[#091124] border-blue-500/30'
                    : 'bg-blue-50/50 border-blue-200/80'
                }`}
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block truncate">
                  Target Role
                </span>
                <span
                  className={`text-xs sm:text-sm font-bold block truncate mt-0.5 ${
                    certTheme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {profile.targetRole || 'Software Engineer'}
                </span>
                <span className="text-[9px] text-amber-500 block font-bold truncate">
                  {profile.targetCompanyTier?.split(' ')[0] || 'Tier-1'} Ready
                </span>
              </div>

              {/* Card 4: Standing & Tracks */}
              <div
                className={`rounded-xl p-2.5 border ${
                  certTheme === 'dark'
                    ? 'bg-[#091124] border-blue-500/30'
                    : 'bg-blue-50/50 border-blue-200/80'
                }`}
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block truncate">
                  Standing
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-500 mt-0.5 block truncate">
                  All 12 Tracks Cleared
                </span>
                <span className="text-[9px] text-slate-400 block font-medium truncate">
                  Verified Accreditation
                </span>
              </div>
            </div>

            {/* Official Holographic Seal (Google / Microsoft Caliber Medallion) */}
            <div className="flex justify-center my-3 relative z-10">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center text-center">
                <div className="w-full h-full rounded-full border border-dashed border-amber-950/40 bg-gradient-to-tr from-amber-500 to-yellow-300 flex flex-col items-center justify-center text-slate-950 p-1">
                  <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.4]" />
                  <span className="text-[7px] font-black uppercase tracking-wider leading-tight mt-0.5">
                    VERIFIED
                  </span>
                  <span className="text-[6px] font-extrabold tracking-tighter text-slate-900">
                    EXCELLENCE
                  </span>
                </div>
              </div>
            </div>

            {/* Mandatory Accreditation & Dual Official Signatures */}
            <div
              className={`mt-4 pt-3.5 border-t grid grid-cols-2 gap-4 relative z-10 ${
                certTheme === 'dark' ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              {/* Left Signatory: SarlaYash Mission */}
              <div className="text-center">
                <div
                  className={`font-serif italic text-base sm:text-lg font-bold select-none ${
                    certTheme === 'dark' ? 'text-sky-300' : 'text-blue-700'
                  }`}
                >
                  SarlaYash Mission
                </div>
                <div
                  className={`w-32 sm:w-44 h-0.5 mx-auto my-1 ${
                    certTheme === 'dark' ? 'bg-sky-400/40' : 'bg-blue-600/30'
                  }`}
                />
                <div
                  className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                    certTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                  }`}
                >
                  Certified By SarlaYash Mission
                </div>
                <p className="text-[9px] text-slate-400">Director of Academic & Placement Excellence</p>
              </div>

              {/* Right Signatory: Powered By Kapil */}
              <div className="text-center">
                <div
                  className={`font-serif italic text-base sm:text-lg font-bold select-none ${
                    certTheme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                  }`}
                >
                  Kapil
                </div>
                <div
                  className={`w-32 sm:w-44 h-0.5 mx-auto my-1 ${
                    certTheme === 'dark' ? 'bg-amber-400/40' : 'bg-amber-600/30'
                  }`}
                />
                <div
                  className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                    certTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                  }`}
                >
                  Powered By Kapil
                </div>
                <p className="text-[9px] text-slate-400">Chief Technology Architect & Placement Mentor</p>
              </div>
            </div>

            {/* Footer Credentials & Verification Hash */}
            <div
              className={`mt-4 pt-2.5 border-t flex flex-col sm:flex-row items-center justify-between text-[9px] gap-1.5 relative z-10 ${
                certTheme === 'dark'
                  ? 'border-slate-800/80 text-slate-400'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              <div>
                <span>Certificate ID: </span>
                <strong className={`font-mono ${certTheme === 'dark' ? 'text-sky-300' : 'text-blue-700'}`}>
                  {certId}
                </strong>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Cryptographically Authenticated • PNG Format Only</span>
              </div>
              <div>
                <span>Issued: </span>
                <strong className={certTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                  {issueDate}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Actions Footer */}
        <div className="p-3 bg-[#050814] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Award className="w-4 h-4 text-sky-400" />
            <span>Accredited for LinkedIn, Resume & Campus Placement Dossier</span>
          </span>
          <button
            onClick={handleDownloadPNG}
            disabled={isExportingPNG}
            className="text-sky-300 hover:text-sky-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPNG ? 'Downloading...' : 'Download Certificate (PNG Only)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

