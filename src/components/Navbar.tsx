import { Flame, ShieldCheck, Smartphone, Monitor } from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  profile: StudentProfile;
  readinessScore: number;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onOpenProfile: () => void;
}

export function Navbar({
  profile,
  readinessScore,
  isDeviceFrame,
  onToggleDeviceFrame,
  onOpenProfile,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left: Brand & Mobile title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-500/30">
            <span className="text-base tracking-tighter">PQ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-semibold tracking-tight text-slate-100">
                PlacementIQ
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {profile.college} • Class of {profile.graduationYear}
            </p>
          </div>
        </div>

        {/* Right: Streak, Readiness Score, View Mode, Profile Avatar */}
        <div className="flex items-center gap-2">
          {/* Daily Streak */}
          <div
            id="streak-badge"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium cursor-default"
            title={`${profile.streakDays} Day Practice Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Placement Readiness Score Pill */}
          <div
            id="nav-prs-pill"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold cursor-default"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PRS {readinessScore}</span>
          </div>

          {/* Toggle Device Frame (useful for previewing on desktop) */}
          <button
            id="toggle-device-frame-btn"
            onClick={onToggleDeviceFrame}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors hidden md:flex items-center justify-center"
            title={isDeviceFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Device Frame View'}
          >
            {isDeviceFrame ? (
              <Monitor className="w-4 h-4 text-slate-300" />
            ) : (
              <Smartphone className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Student Avatar button */}
          <button
            id="profile-avatar-btn"
            onClick={onOpenProfile}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-semibold text-xs border border-white/20 shadow-sm hover:ring-2 hover:ring-indigo-400 transition-all focus:outline-none overflow-hidden"
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
              profile.fullName.charAt(0) || 'L'
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </button>
        </div>
      </div>
    </header>
  );
}
