import { useState, useRef, useMemo } from 'react';
import {
  X,
  Download,
  FileText,
  Printer,
  Share2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Check,
  Building,
  GraduationCap,
  Calendar,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
  Cpu,
  Flame,
  UserCheck,
} from 'lucide-react';
import {
  StudentProfile,
  ReadinessScoreBreakdown,
  SkillItem,
  CodingSubmission,
  AptitudeAssessmentResult,
} from '../types';
import {
  generateLetterOfRecommendationData,
  LetterOfRecommendationData,
  DomainXPItem,
} from '../utils/lorGenerator';
import {
  exportElementAsPDF,
  exportElementAsPNG,
  printDocumentNative,
} from '../utils/documentExporter';

interface LetterOfRecommendationModalProps {
  profile: StudentProfile;
  readiness: ReadinessScoreBreakdown;
  skills?: SkillItem[];
  submissions?: CodingSubmission[];
  aptitudeResults?: AptitudeAssessmentResult[];
  onClose: () => void;
}

export function LetterOfRecommendationModal({
  profile,
  readiness,
  skills = [],
  submissions = [],
  aptitudeResults = [],
  onClose,
}: LetterOfRecommendationModalProps) {
  const [docTheme, setDocTheme] = useState<'light' | 'dark'>('light');
  const [pageMode, setPageMode] = useState<'single' | 'comprehensive'>('single');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // DOM Refs for multi-page / single-page export
  const singlePageRef = useRef<HTMLDivElement | null>(null);
  const page1Ref = useRef<HTMLDivElement | null>(null);
  const page2Ref = useRef<HTMLDivElement | null>(null);

  // Generate verified data from student profile (immutable for learners)
  const lorData: LetterOfRecommendationData = useMemo(() => {
    return generateLetterOfRecommendationData(
      profile,
      readiness,
      skills,
      submissions,
      aptitudeResults
    );
  }, [profile, readiness, skills, submissions, aptitudeResults]);

  // Clean filename generator
  const getExportFileName = (extension: 'pdf' | 'png') => {
    const sanitizedName = (profile.fullName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
    return `SarlaYash_Mission_Letter_Of_Recommendation_${sanitizedName}_${pageMode}_${docTheme}.${extension}`;
  };

  // PDF Export handler
  const handleDownloadPDF = async () => {
    try {
      setIsExportingPDF(true);
      if (pageMode === 'single') {
        if (!singlePageRef.current) return;
        await exportElementAsPDF(singlePageRef.current, getExportFileName('pdf'));
      } else {
        if (!page1Ref.current || !page2Ref.current) return;
        await exportElementAsPDF([page1Ref.current, page2Ref.current], getExportFileName('pdf'));
      }
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // PNG Export handler
  const handleDownloadPNG = async () => {
    try {
      setIsExportingPNG(true);
      if (pageMode === 'single') {
        if (!singlePageRef.current) return;
        await exportElementAsPNG(singlePageRef.current, getExportFileName('png'), 2.5);
      } else {
        // In comprehensive mode, export Page 1 first, then Page 2
        if (page1Ref.current) {
          await exportElementAsPNG(page1Ref.current, getExportFileName('png').replace('.png', '_Page1.png'), 2.5);
        }
        if (page2Ref.current) {
          await exportElementAsPNG(page2Ref.current, getExportFileName('png').replace('.png', '_Page2.png'), 2.5);
        }
      }
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsExportingPNG(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText?.(`${url}#lor=${lorData.referenceId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const isLight = docTheme === 'light';

  return (
    <div className="fixed inset-0 z-50 bg-[#02050e]/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-5xl bg-[#080d1e] border border-blue-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[96vh]">
        {/* Modal Header & Executive Controls */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-[#050816] shrink-0 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-400 text-white border border-sky-400/30 flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText className="w-4 h-4 text-white stroke-[2.2]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">
                  Official Letter Of Recommendation (LOR)
                </h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30 font-extrabold">
                  Verified Academic Endorsement
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Accredited By <strong className="text-sky-300">SarlaYash Mission</strong> • Directed By <strong className="text-amber-300">Kapil Narula</strong>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Format Selector: Single Page vs Comprehensive 2-Page */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5 text-[11px]">
              <button
                onClick={() => setPageMode('single')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  pageMode === 'single'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Single Page Executive Summary (Fits on 1 A4 Page)"
              >
                Executive (1 Page)
              </button>
              <button
                onClick={() => setPageMode('comprehensive')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  pageMode === 'comprehensive'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Comprehensive 2-Page Dossier (Full 11 Domain Breakdown)"
              >
                Comprehensive (2 Pages)
              </button>
            </div>

            {/* Theme Selector: Parchment Light vs Tech Obsidian */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5">
              <button
                onClick={() => setDocTheme('light')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  docTheme === 'light'
                    ? 'bg-white text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Executive Parchment White Edition"
              >
                <Sun className="w-3 h-3" />
                <span className="hidden sm:inline">Parchment</span>
              </button>
              <button
                onClick={() => setDocTheme('dark')}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  docTheme === 'dark'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Obsidian Tech Navy Edition"
              >
                <Moon className="w-3 h-3" />
                <span className="hidden sm:inline">Obsidian</span>
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              id="download-lor-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/30 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Download Letter as High-Quality A4 PDF"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isExportingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            {/* Download PNG Button */}
            <button
              id="download-lor-png-btn"
              onClick={handleDownloadPNG}
              disabled={isExportingPNG}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/30 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Download Letter as High-Resolution PNG Image"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isExportingPNG ? 'Exporting PNG...' : 'Download PNG'}</span>
            </button>

            {/* Print / Native PDF Fallback */}
            <button
              onClick={() => printDocumentNative()}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 cursor-pointer"
              title="Print Document or Save using Native System PDF"
            >
              <Printer className="w-4 h-4 text-sky-400" />
            </button>

            {/* Share / Copy Reference */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 cursor-pointer"
              title="Copy LOR Verification Reference"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-sky-400" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close LOR Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Letter Preview Workspace */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#030612] flex flex-col items-center gap-6">
          {pageMode === 'single' ? (
            /* ========================================================= */
            /* SINGLE-PAGE EXECUTIVE LOR (Fixed 794px Width for exact A4) */
            /* ========================================================= */
            <div
              ref={singlePageRef}
              id="lor-single-page-export-container"
              style={{ width: '794px', minHeight: '1123px', boxSizing: 'border-box' }}
              className={`p-10 transition-colors shadow-2xl relative flex flex-col justify-between ${
                isLight
                  ? 'bg-[#ffffff] text-slate-900 border border-slate-200'
                  : 'bg-[#060b1b] text-slate-100 border border-blue-500/40'
              }`}
            >
              {/* Watermark Crest */}
              <div
                className={`absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none ${
                  isLight ? 'text-slate-900' : 'text-sky-300'
                }`}
              >
                <div className="w-[500px] h-[500px] rounded-full border-[20px] border-current flex items-center justify-center font-black text-6xl tracking-widest uppercase text-center p-8">
                  SARLAYASH MISSION • SYM VERIFIED • 2026
                </div>
              </div>

              {/* Page 1 Top: Institutional Letterhead */}
              <div>
                <div className="flex items-start justify-between border-b-2 pb-4 border-sky-600/40">
                  <div className="flex items-center gap-3.5">
                    {/* SYM Official Seal Crest */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-lg border border-sky-300/40 shrink-0">
                      SYM
                    </div>
                    <div>
                      <h1 className="text-xl font-black uppercase tracking-tight text-blue-900 font-serif leading-none" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                        SarlaYash Mission
                      </h1>
                      <div className="text-[11px] font-bold tracking-wider uppercase text-blue-600 mt-1" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                        Placement Intelligence & Campus Competency Directorate
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Higher Engineering Accreditation • Directed by <strong>Kapil Narula</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] space-y-0.5">
                    <div className="font-mono font-bold text-slate-700" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
                      REF: <strong className="text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>{lorData.referenceId}</strong>
                    </div>
                    <div className="text-slate-500">
                      Issue Date: <strong className="text-slate-700" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>{lorData.issueDate}</strong>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-[9px] font-black uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Authenticated Record</span>
                    </div>
                  </div>
                </div>

                {/* Formal Addressee & Subject */}
                <div className="mt-4 text-xs space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    To Whomsoever It May Concern / Campus Technical Selection Panels
                  </div>
                  <div className="text-sm font-black uppercase tracking-wide text-blue-900 font-serif" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    Subject: Letter Of Recommendation & Verified Technical Competency Endorsement
                  </div>
                </div>

                {/* Executive Recommendation Body Paragraph */}
                <div className="mt-3 text-[12px] leading-relaxed text-slate-700 text-justify" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                  <p>
                    It is with great pleasure and distinct confidence that I provide this official Letter of Recommendation for{' '}
                    <strong className="text-blue-900 font-black text-[13px]" style={{ color: isLight ? '#0f172a' : '#38bdf8' }}>
                      {lorData.student.fullName}
                    </strong>{' '}
                    ({lorData.student.degree} in {lorData.student.branch}, {lorData.student.college}, CGPA:{' '}
                    <strong>{lorData.student.cgpa}</strong>), evaluated for the specialized role of{' '}
                    <strong className="text-blue-900" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{lorData.student.targetRole}</strong>.
                  </p>
                  <p className="mt-2">
                    Under the standardized evaluation methodology of the <strong>SarlaYash Mission Placement Intelligence Program</strong>, the candidate underwent continuous algorithmic, quantitative, behavioral, and architectural assessments. They achieved a distinguished Placement Readiness Score of{' '}
                    <strong className="text-blue-900 font-bold" style={{ color: isLight ? '#0f172a' : '#38bdf8' }}>
                      {lorData.overallReadiness.score} / 1000
                    </strong>{' '}
                    (placing in the <strong>{lorData.overallReadiness.percentile}th national percentile</strong> standing) with a cumulative practice streak of{' '}
                    <strong>{lorData.student.streakDays} consecutive days</strong>.
                  </p>
                </div>

                {/* Evaluated Domain XP Matrix (All 11 Domains in clean 2-column tabular grid) */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-blue-900" style={{ color: isLight ? '#1e3a8a' : '#7dd3fc' }}>
                      Verified Domain XP & Competency Assessment Breakdown
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500">
                      Total Evaluated XP: <strong className="text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>{lorData.overallReadiness.totalEarnedXP} XP</strong> across 14 Competency Domains
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {lorData.domainXPList.map((domain) => (
                      <div
                        key={domain.id}
                        className={`p-2 rounded-lg border flex items-center justify-between ${
                          isLight
                            ? 'bg-slate-50/90 border-slate-200'
                            : 'bg-[#080f24] border-slate-800'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-slate-900 truncate" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            {domain.name}
                          </div>
                          <div className="text-[9px] text-slate-500 truncate">
                            {domain.strengthRemark}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                            {domain.earnedXP} XP
                          </div>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border ${
                            domain.masteryTier === 'Tier-1 Elite'
                              ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-700 border-blue-500/30'
                          }`}>
                            {domain.masteryTier}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Candidate Core Strengths Pillars */}
                <div className="mt-4">
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-blue-900 mb-1.5" style={{ color: isLight ? '#1e3a8a' : '#7dd3fc' }}>
                    Demonstrated Engineering & Behavioral Strengths
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {lorData.strengthPillars.map((pillar, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border ${
                          isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#080f24]/70 border-slate-800'
                        }`}
                      >
                        <div className="font-black text-slate-900 flex items-center gap-1" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{pillar.title}</span>
                        </div>
                        <p className="text-[9px] text-slate-600 mt-0.5 leading-tight" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
                          {pillar.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Recommendation Statement */}
                <div className="mt-3 p-2.5 rounded-lg border text-[10px] leading-relaxed text-slate-700" style={{
                  backgroundColor: isLight ? '#f8fafc' : '#080e22',
                  borderColor: isLight ? '#e2e8f0' : '#1e293b',
                  color: isLight ? '#334155' : '#cbd5e1',
                }}>
                  <strong className="text-blue-900 uppercase font-black mr-1" style={{ color: isLight ? '#0f172a' : '#38bdf8' }}>
                    Institutional Endorsement:
                  </strong>
                  Based on objective performance across algorithmic assessments, quantitative problem solving, and modern AI architectures, I give <strong>{lorData.student.fullName}</strong> my highest recommendation for campus placement, technical leadership tracks, and software engineering roles without reservation.
                </div>
              </div>

              {/* Page 1 Bottom: Signatures & Hologram Seal */}
              <div className="pt-4 border-t-2 border-slate-200 flex items-end justify-between mt-4">
                {/* Left Signature: Kapil Narula */}
                <div className="text-left space-y-1">
                  {/* Handwritten-style digital signature path */}
                  <div className="h-9 flex items-center">
                    <svg viewBox="0 0 200 45" className="h-8 text-blue-900 stroke-current fill-none" style={{ color: isLight ? '#1e3a8a' : '#38bdf8' }}>
                      <path
                        d="M 10 32 Q 35 8 50 25 T 85 18 T 120 30 T 150 12 T 185 28"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 30 20 L 70 38"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <circle cx="160" cy="14" r="2" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="text-[11px] font-black text-slate-900 leading-none" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                    {lorData.institutionalSignatories.leadSignatory.name}
                  </div>
                  <div className="text-[9px] font-bold text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                    {lorData.institutionalSignatories.leadSignatory.title}
                  </div>
                  <div className="text-[8px] text-slate-500">
                    {lorData.institutionalSignatories.leadSignatory.organization}
                  </div>
                </div>

                {/* Center / Right: Official Institutional Crest Seal & Reference */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-700" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
                      Certified & Endorsed
                    </div>
                    <div className="text-[10px] font-black text-amber-600">
                      SarlaYash Mission Directorate
                    </div>
                    <div className="text-[7px] text-slate-400 font-mono font-bold mt-0.5">
                      REF ID: {lorData.referenceId}
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-full border-2 border-amber-500/70 p-1 flex items-center justify-center bg-amber-500/5 shadow-inner">
                    <div className="w-full h-full rounded-full border border-dashed border-amber-500 flex flex-col items-center justify-center text-center p-1">
                      <Award className="w-4 h-4 text-amber-600 mb-0.5" />
                      <span className="text-[6px] font-black uppercase tracking-tighter text-amber-700 leading-tight">
                        SARLAYASH MISSION
                      </span>
                      <span className="text-[5px] font-bold text-amber-600 leading-none">
                        OFFICIAL SEAL
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* COMPREHENSIVE 2-PAGE DOSSIER (Page 1 + Page 2)            */
            /* ========================================================= */
            <div className="flex flex-col gap-6">
              {/* PAGE 1: Formal Recommendation Letter & Core Pillars */}
              <div
                ref={page1Ref}
                id="lor-page-1"
                style={{ width: '794px', minHeight: '1123px', boxSizing: 'border-box' }}
                className={`p-10 transition-colors shadow-2xl relative flex flex-col justify-between ${
                  isLight
                    ? 'bg-[#ffffff] text-slate-900 border border-slate-200'
                    : 'bg-[#060b1b] text-slate-100 border border-blue-500/40'
                }`}
              >
                <div>
                  {/* Institutional Letterhead */}
                  <div className="flex items-start justify-between border-b-2 pb-4 border-sky-600/40">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-sky-500 flex items-center justify-center text-white font-black text-xl shadow-lg border border-sky-300/40 shrink-0">
                        SYM
                      </div>
                      <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-blue-900 font-serif leading-none" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          SarlaYash Mission
                        </h1>
                        <div className="text-[11px] font-bold tracking-wider uppercase text-blue-600 mt-1" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                          Placement Intelligence & Campus Competency Directorate
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Higher Engineering Accreditation • Directed by <strong>Kapil Narula</strong>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[10px] space-y-0.5">
                      <div className="font-mono font-bold text-slate-700" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
                        REF: <strong className="text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>{lorData.referenceId}</strong>
                      </div>
                      <div className="text-slate-500">
                        Date: <strong className="text-slate-700" style={{ color: isLight ? '#1e293b' : '#cbd5e1' }}>{lorData.issueDate}</strong>
                      </div>
                      <div className="text-slate-400 text-[9px] font-bold uppercase">
                        Page 1 of 2 • Official Recommendation
                      </div>
                    </div>
                  </div>

                  {/* Addressee & Subject */}
                  <div className="mt-6 text-xs space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      To Whomsoever It May Concern / Campus Technical Hiring Panels
                    </div>
                    <div className="text-base font-black uppercase tracking-wide text-blue-900 font-serif" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                      Subject: Official Letter Of Recommendation For Campus Placement & Employment
                    </div>
                  </div>

                  {/* Formal Narrative Endorsement */}
                  <div className="mt-5 text-[13px] leading-relaxed text-slate-700 space-y-4 text-justify" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                    <p>
                      It gives me immense professional pride to present this official recommendation for{' '}
                      <strong className="text-blue-900 font-black" style={{ color: isLight ? '#0f172a' : '#38bdf8' }}>
                        {lorData.student.fullName}
                      </strong>
                      , a student of {lorData.student.degree} in {lorData.student.branch} from {lorData.student.college} (Cumulative CGPA:{' '}
                      <strong>{lorData.student.cgpa}</strong>), targeting placement as a{' '}
                      <strong className="text-blue-900" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{lorData.student.targetRole}</strong>.
                    </p>

                    <p>
                      Throughout our structured placement intelligence modules, {lorData.student.fullName} has exhibited outstanding technical tenacity, analytical depth, and an unwavering commitment to engineering craftsmanship. On our benchmarked examinations, they secured an overall Placement Readiness Score (PRS) of{' '}
                      <strong className="text-blue-900 font-bold" style={{ color: isLight ? '#0f172a' : '#38bdf8' }}>
                        {lorData.overallReadiness.score} / 1000
                      </strong>
                      , ranking in the top <strong>{lorData.overallReadiness.percentile}th national percentile</strong> with an active practice streak of{' '}
                      <strong>{lorData.student.streakDays} days</strong>.
                    </p>

                    <p>
                      The candidate has mastered both fundamental and advanced computer science domains, excelling in time-complexity optimization, robust defensive edge-case tracing, relational schema design, and vanguard AI orchestration (including Generative AI prompt pipelines and Agentic AI multi-agent workflows).
                    </p>
                  </div>

                  {/* 4 Core Pillars of Excellence */}
                  <div className="mt-6 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-900" style={{ color: isLight ? '#1e3a8a' : '#7dd3fc' }}>
                      Key Pillars of Evaluated Excellence
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {lorData.strengthPillars.map((pillar, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl border ${
                            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#080f24] border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                            <span>{pillar.title}</span>
                          </div>
                          <div className="text-[10px] font-bold text-blue-700 mt-0.5" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                            {pillar.highlight}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug" style={{ color: isLight ? '#475569' : '#94a3b8' }}>
                            {pillar.description}
                          </p>
                          <div className="text-[9px] font-mono font-bold text-slate-500 mt-2">
                            {pillar.metrics}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Page 1 Footer Signature */}
                <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-black text-slate-900" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                      {lorData.institutionalSignatories.leadSignatory.name}
                    </div>
                    <div className="text-[9px] font-bold text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                      {lorData.institutionalSignatories.leadSignatory.title}
                    </div>
                    <div className="text-[8px] text-slate-500">
                      {lorData.institutionalSignatories.leadSignatory.organization}
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-400 font-bold">
                    [Page 1 of 2 • Detailed Domain XP Register On Next Page]
                  </div>
                </div>
              </div>

              {/* PAGE 2: Comprehensive 11-Domain XP Register & Official Seal */}
              <div
                ref={page2Ref}
                id="lor-page-2"
                style={{ width: '794px', minHeight: '1123px', boxSizing: 'border-box' }}
                className={`p-10 transition-colors shadow-2xl relative flex flex-col justify-between ${
                  isLight
                    ? 'bg-[#ffffff] text-slate-900 border border-slate-200'
                    : 'bg-[#060b1b] text-slate-100 border border-blue-500/40'
                }`}
              >
                <div>
                  {/* Page 2 Header */}
                  <div className="flex items-center justify-between border-b-2 pb-3 border-sky-600/40">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black text-xs">
                        SYM
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase text-blue-900 font-serif" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                          SarlaYash Mission Placement Directorate
                        </div>
                        <div className="text-[9px] text-slate-500">
                          Candidate Assessment Register & Domain XP Dossier
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[10px]">
                      <span className="font-mono font-bold text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                        {lorData.referenceId}
                      </span>
                      <span className="text-slate-400 block text-[9px]">Page 2 of 2</span>
                    </div>
                  </div>

                  {/* Section Title */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-wider text-blue-900 font-serif" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                        Comprehensive 14-Domain XP & Competency Breakdown
                      </h2>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Detailed granular evaluation across all assessed technical and analytical sections
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-blue-700 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                        Total XP: {lorData.overallReadiness.totalEarnedXP} Points
                      </span>
                    </div>
                  </div>

                  {/* Comprehensive Domain Cards */}
                  <div className="mt-4 space-y-2.5">
                    {lorData.domainXPList.map((domain) => (
                      <div
                        key={domain.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#080f24] border-slate-800'
                        }`}
                      >
                        <div className="w-1/3 min-w-0 pr-2">
                          <div className="text-xs font-black text-slate-900 truncate" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            {domain.name}
                          </div>
                          <div className="text-[9px] text-slate-500">
                            {domain.category}
                          </div>
                        </div>

                        <div className="w-1/2 pr-3">
                          <div className="text-[10px] text-slate-600 leading-snug" style={{ color: isLight ? '#334155' : '#cbd5e1' }}>
                            {domain.strengthRemark}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {domain.skillsIncluded.map((s, idx) => (
                              <span key={idx} className="text-[8px] px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700 font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="w-1/6 text-right shrink-0">
                          <div className="text-xs font-mono font-black text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                            {domain.earnedXP} XP
                          </div>
                          <div className="text-[9px] text-slate-500">
                            {domain.accuracyRate}% Accuracy
                          </div>
                          <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30 inline-block mt-0.5">
                            {domain.masteryTier}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Final Recommendation Summary Box */}
                  <div className="mt-5 p-3 rounded-xl border text-[11px] leading-relaxed text-slate-700" style={{
                    backgroundColor: isLight ? '#f8fafc' : '#080e22',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                    color: isLight ? '#334155' : '#cbd5e1',
                  }}>
                    <strong className="text-blue-900 font-black uppercase mr-1" style={{ color: isLight ? '#0f172a' : '#38bdf8' }}>
                      Final Concurrence:
                    </strong>
                    Based on verified performance analytics, {lorData.student.fullName} has met all rigorous criteria for campus recruitment recommendation. We endorse their candidacy with the highest merit rating.
                  </div>
                </div>

                {/* Page 2 Footer with Hologram Seal & Signatures */}
                <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-black text-slate-900" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                      {lorData.institutionalSignatories.leadSignatory.name}
                    </div>
                    <div className="text-[9px] font-bold text-blue-700" style={{ color: isLight ? '#1d4ed8' : '#38bdf8' }}>
                      {lorData.institutionalSignatories.leadSignatory.title}
                    </div>
                    <div className="text-[8px] text-slate-500">
                      {lorData.institutionalSignatories.leadSignatory.organization}
                    </div>
                  </div>

                  {/* Right Official Gold Seal & Secured Reference */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[9px] font-black uppercase tracking-wider text-slate-700" style={{ color: isLight ? '#334155' : '#94a3b8' }}>
                        Accredited Placement Credential
                      </div>
                      <div className="text-[10px] font-black text-amber-600">
                        SarlaYash Mission Placement Directorate
                      </div>
                      <div className="text-[7px] text-slate-400 font-mono font-bold mt-0.5">
                        SECURED ID: {lorData.referenceId}
                      </div>
                    </div>

                    <div className="w-16 h-16 rounded-full border-2 border-amber-500/80 p-1 flex items-center justify-center bg-amber-500/5">
                      <div className="w-full h-full rounded-full border border-dashed border-amber-600 flex flex-col items-center justify-center text-center p-1">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span className="text-[6px] font-black uppercase tracking-tighter text-amber-700">
                          SYM ACCREDITED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
