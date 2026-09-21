import { Flame, ShieldCheck, Smartphone, Monitor, Award, Sparkles, ShieldAlert, Shield } from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  profile: StudentProfile;
  readinessScore: number;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onOpenProfile: () => void;
  onOpenCertificate?: () => void;
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
  onOpenAdmin,
  isAdminAuthenticated,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-amber-500/30 text-white px-4 py-2.5 transition-all shadow-md shadow-black">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left: Brand & Accreditation */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center font-black text-black shadow-md shadow-amber-500/20">
            <span className="text-sm tracking-tighter">SYM</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black tracking-wide text-white uppercase">
                Assessment Portal
              </h1>
              <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Gold Standard
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">
              Certified By <strong className="text-amber-200">SarlaYash Mission</strong> • Powered By <strong className="text-amber-200">Kapil</strong>
            </p>
          </div>
        </div>

        {/* Right: Streak, PRS Score, Certificate Button, Profile */}
        <div className="flex items-center gap-2">
          {/* Daily Streak in Gold */}
          <div
            id="streak-badge"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 border border-amber-500/40 text-amber-300 text-xs font-bold cursor-default shadow-sm"
            title={`${profile.streakDays} Day Practice Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Placement Readiness Score Pill */}
          <div
            id="nav-prs-pill"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-amber-500/50 text-white text-xs font-black cursor-default shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>PRS <strong className="text-amber-300">{readinessScore}</strong></span>
          </div>

          {/* Official Certificate Button (PNG download prompt) */}
          {onOpenCertificate && (
            <button
              id="nav-certificate-btn"
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
              title="Official Placement Certificate (PNG format only)"
            >
              <Award className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
          )}

          {/* Admin Command Center Access */}
          {onOpenAdmin && (
            <button
              id="nav-admin-portal-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider transition-all border cursor-pointer active:scale-95 ${
                isAdminAuthenticated
                  ? 'bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-amber-400 border-amber-500/40'
              }`}
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
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors hidden md:flex items-center justify-center border border-neutral-800"
            title={isDeviceFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Device Frame View'}
          >
            {isDeviceFrame ? (
              <Monitor className="w-4 h-4 text-amber-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Student Avatar button */}
          <button
            id="profile-avatar-btn"
            onClick={onOpenProfile}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-xs border border-amber-300 shadow-sm hover:ring-2 hover:ring-amber-400 transition-all focus:outline-none overflow-hidden cursor-pointer"
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
