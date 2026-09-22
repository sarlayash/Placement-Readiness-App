import { Flame, ShieldCheck, Smartphone, Monitor, Award, Sparkles, ShieldAlert, Shield, FileText } from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  profile: StudentProfile;
  readinessScore: number;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onOpenProfile: () => void;
  onOpenCertificate?: () => void;
  onOpenLOR?: () => void;
  onOpenAdmin?: () => void;
  isAdminAuthenticated?: boolean;
}

export function Navbar({
  profile,
  readinessScore,
  isDeviceFrame,
  onToggleDeviceFrame,
  onOpenProfile,
  onOpenCertificate,
  onOpenLOR,
  onOpenAdmin,
  isAdminAuthenticated,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#060b19]/90 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 px-4 py-2.5 transition-all shadow-lg shadow-black/40">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left: Brand & Accreditation */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/25 border border-sky-300/30">
            <span className="text-xs tracking-tighter font-extrabold">SYM</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase font-['Outfit',sans-serif]">
                Placement Intelligence
              </h1>
              <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/15 text-sky-300 border border-blue-400/30">
                Executive
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Certified By <strong className="text-sky-300">SarlaYash Mission</strong> • Powered By <strong className="text-amber-300">Kapil</strong>
            </p>
          </div>
        </div>

        {/* Right: Streak, PRS Score, Certificate Button, Profile */}
        <div className="flex items-center gap-2">
          {/* Daily Streak */}
          <div
            id="streak-badge"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-default shadow-sm"
            title={`${profile.streakDays} Day Practice Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Placement Readiness Score Pill */}
          <div
            id="nav-prs-pill"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-blue-500/40 text-white text-xs font-black cursor-default shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>PRS <strong className="text-sky-300">{readinessScore}</strong></span>
          </div>

          {/* Official Certificate Button (PNG download prompt) */}
          {onOpenCertificate && (
            <button
              id="nav-certificate-btn"
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/25 cursor-pointer active:scale-95"
              title="Official Placement Certificate (PNG format only)"
            >
              <Award className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
          )}

          {/* Official Letter of Recommendation (LOR) Button */}
          {onOpenLOR && (
            <button
              id="nav-lor-btn"
              onClick={onOpenLOR}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-500/30 cursor-pointer active:scale-95"
              title="Official Letter Of Recommendation (Download PDF / PNG)"
            >
              <FileText className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              <span className="hidden sm:inline">LOR</span>
            </button>
          )}

          {/* Admin Command Center Access - strictly hidden for learners */}
          {onOpenAdmin && isAdminAuthenticated && (
            <button
              id="nav-admin-portal-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all border cursor-pointer active:scale-95 bg-blue-600 text-white border-sky-400 shadow-md shadow-blue-600/30"
              title="Admin Dashboard (Executive Performance Tracking)"
            >
              <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Toggle Device Frame */}
          <button
            id="toggle-device-frame-btn"
            onClick={onToggleDeviceFrame}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors hidden md:flex items-center justify-center border border-slate-800"
            title={isDeviceFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Device Frame View'}
          >
            {isDeviceFrame ? (
              <Monitor className="w-4 h-4 text-sky-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-sky-400" />
            )}
          </button>

          {/* Student Avatar button */}
          <button
            id="profile-avatar-btn"
            onClick={onOpenProfile}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs border border-sky-400/40 shadow-sm hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none overflow-hidden cursor-pointer"
            aria-label="Open profile settings"
          >
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              profile.fullName
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('') || 'SY'
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
