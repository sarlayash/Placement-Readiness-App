import { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Target,
  Github,
  Linkedin,
  Sparkles,
  Save,
  CheckCircle2,
  Download,
  Plus,
  X,
  LogOut,
  ShieldCheck,
  CloudCheck,
  FileText,
  Award,
  TrendingUp,
} from 'lucide-react';
import {
  StudentProfile,
  RoleType,
  CompanyTier,
  ReadinessScoreBreakdown,
} from '../types';

interface ProfileViewProps {
  profile: StudentProfile;
  readiness?: ReadinessScoreBreakdown;
  onUpdateProfile: (updated: StudentProfile) => void;
  onSignOut?: () => void;
  onOpenLOR?: () => void;
  onOpenCertificate?: () => void;
  isSaving?: boolean;
}

export function ProfileView({
  profile,
  readiness,
  onUpdateProfile,
  onSignOut,
  onOpenLOR,
  onOpenCertificate,
  isSaving = false,
}: ProfileViewProps) {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const roleOptions: RoleType[] = [
    'Software Development Engineer',
    'Frontend Engineer',
    'Backend / Systems Engineer',
    'Full Stack Developer',
    'Data Analyst / Scientist',
    'Cloud & DevOps Engineer',
    'Product Analyst',
  ];

  const tierOptions: CompanyTier[] = [
    'Tier-1 Big Tech (Google, Microsoft, Amazon)',
    'High-Growth Tech Unicorns (Razorpay, Swiggy, Uber)',
    'Mid-Size Product Companies',
    'Global IT & Consulting (TCS Digital, Accenture, Infosys SP)',
  ];

  // Calculate profile completion score
  const calculateCompletion = () => {
    let pts = 0;
    if (formData.fullName.trim()) pts += 15;
    if (formData.college.trim()) pts += 15;
    if (formData.degree.trim()) pts += 10;
    if (formData.cgpa > 0) pts += 10;
    if (formData.targetRole) pts += 15;
    if (formData.targetCompanyTier) pts += 10;
    if (formData.githubUrl && formData.githubUrl.length > 5) pts += 10;
    if (formData.linkedinUrl && formData.linkedinUrl.length > 5) pts += 5;
    if (formData.skills.length >= 5) pts += 10;
    return pts;
  };

  const completionPct = calculateCompletion();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !formData.skills.includes(newSkillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkillInput.trim()],
      });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${formData.fullName.replace(/\s+/g, '_')}_placement_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Profile Header & Completion Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {formData.photoURL ? (
              <img
                src={formData.photoURL}
                alt={formData.fullName}
                className="w-11 h-11 rounded-full object-cover border border-indigo-500/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                {formData.fullName.charAt(0) || 'L'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-100">{formData.fullName}</h2>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400">
                {formData.email}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {completionPct}% Profile
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {completionPct >= 80
                ? 'Profile verified and optimized for campus placement drives!'
                : 'Fill in your academic and target company details to earn readiness score points.'}
            </span>
          </p>
        </div>
      </div>

      {/* Google Learner Account & Cloud Sync Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CloudCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Google Verified Learner</div>
            <div className="text-[10px] text-slate-400">Firestore Cloud Sync • Live DB</div>
          </div>
        </div>
        {onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* Placement Readiness Index (PRI: 1 to 100) Executive Profile Card */}
      {readiness && (
        <div
          id="profile-pri-card"
          className="relative overflow-hidden bg-gradient-to-br from-[#0c1635] via-[#091129] to-[#040816] border border-sky-500/40 rounded-2xl p-4 shadow-xl space-y-3.5"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                <ShieldCheck className="w-4 h-4 text-sky-300" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-['Outfit',sans-serif]">
                    Placement Readiness Index (PRI)
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                    Scale 1 – 100
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Campus recruitment readiness index derived from daily assessments and profile metrics
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Top {100 - (readiness.pri?.percentile || readiness.percentile)}% National Standing
            </span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white font-['Outfit',sans-serif]">
                  {readiness.pri?.score || Math.max(1, Math.min(100, Math.round(readiness.overallScore / 10)))}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{readiness.pri?.tierLabel || 'High-Growth Tech Unicorn & Product Ready'}</span>
              </p>
            </div>

            <div className="text-right">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border"
                style={{
                  backgroundColor: `${readiness.pri?.badgeColor || '#0EA5E9'}22`,
                  borderColor: `${readiness.pri?.badgeColor || '#0EA5E9'}55`,
                  color: readiness.pri?.badgeColor || '#38BDF8',
                }}
              >
                {readiness.pri?.tier || 'Unicorn Ready'}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                PRS: {readiness.overallScore}/1000 pts
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${readiness.pri?.score || Math.round(readiness.overallScore / 10)}%` }}
            />
          </div>

          {/* 4 factors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 text-center">
              <span className="block text-[10px] text-slate-400 font-semibold truncate">Daily Tests</span>
              <span className="text-xs font-black text-sky-300">
                {readiness.pri?.breakdown.dailyAssessments ?? 36} <span className="text-[10px] text-slate-500">/40</span>
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 text-center">
              <span className="block text-[10px] text-slate-400 font-semibold truncate">Profile Rigor</span>
              <span className="text-xs font-black text-indigo-300">
                {readiness.pri?.breakdown.profileStrength ?? 22} <span className="text-[10px] text-slate-500">/25</span>
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 text-center">
              <span className="block text-[10px] text-slate-400 font-semibold truncate">Technical DSA</span>
              <span className="text-xs font-black text-emerald-300">
                {readiness.pri?.breakdown.technicalProblemSolving ?? 18} <span className="text-[10px] text-slate-500">/20</span>
              </span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 text-center">
              <span className="block text-[10px] text-slate-400 font-semibold truncate">Streak Discipline</span>
              <span className="text-xs font-black text-amber-300">
                {readiness.pri?.breakdown.streakConsistency ?? 14} <span className="text-[10px] text-slate-500">/15</span>
              </span>
            </div>
          </div>

          {/* Direct Credential Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
            {onOpenCertificate && (
              <button
                type="button"
                onClick={onOpenCertificate}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Certificate (PNG)</span>
              </button>
            )}
            {onOpenLOR && (
              <button
                type="button"
                onClick={onOpenLOR}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 text-sky-300 text-xs font-bold transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-sky-300" />
                <span>Official LOR</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Academic Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Academic Background</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">College / University</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Degree & Branch</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">CGPA / Percentage</label>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="10.0"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Graduation Year</label>
                <input
                  type="number"
                  min="2024"
                  max="2030"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Placement Targets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800">
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Placement Career Targets</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Target Placement Role</label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value as RoleType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Target Dream Company Tier</label>
              <select
                value={formData.targetCompanyTier}
                onChange={(e) => setFormData({ ...formData, targetCompanyTier: e.target.value as CompanyTier })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {tierOptions.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Resume Professional Headline</label>
              <textarea
                rows={2}
                value={formData.resumeHeadline}
                onChange={(e) => setFormData({ ...formData, resumeHeadline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Brief summary of strengths and technical interests..."
              />
            </div>
          </div>
        </div>

        {/* Links & Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Profile Links & Skills Tags</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span>GitHub Profile URL</span>
              </label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            {/* Skill Tags */}
            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Key Technical Skills</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-indigo-400 hover:text-rose-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add skill (e.g. Docker, Python, AWS)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Save, Export, Import */}
        <div className="space-y-2">
          <button
            id="save-profile-btn"
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved & Intelligence Updated!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Profile Backup (JSON)</span>
          </button>

          {/* Official Academic Credentials: LOR & Certificate */}
          {(onOpenLOR || onOpenCertificate) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {onOpenLOR && (
                <button
                  type="button"
                  id="profile-download-lor-btn"
                  onClick={onOpenLOR}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download LOR (PDF/PNG)</span>
                </button>
              )}
              {onOpenCertificate && (
                <button
                  type="button"
                  id="profile-download-cert-btn"
                  onClick={onOpenCertificate}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
                >
                  <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Certificate (PNG)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
