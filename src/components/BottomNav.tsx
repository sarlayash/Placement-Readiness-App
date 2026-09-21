import {
  LayoutDashboard,
  BrainCircuit,
  BarChart3,
  Compass,
  Award,
  User,
} from 'lucide-react';

export type TabType = 'dashboard' | 'assessments' | 'skills' | 'roadmap' | 'badges' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  unlockedBadgeCount: number;
}

export function BottomNav({
  currentTab,
  onChangeTab,
  unlockedBadgeCount,
}: BottomNavProps) {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'assessments', label: 'Assess', icon: BrainCircuit },
    { id: 'skills', label: 'Skills', icon: BarChart3 },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 transition-all shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-6 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 min-h-[44px] ${
                isActive
                  ? 'text-indigo-400 font-semibold bg-indigo-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-normal'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo-400' : 'text-slate-400'}`} />
                {tab.id === 'badges' && unlockedBadgeCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold leading-none min-w-[14px] text-center">
                    {unlockedBadgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-indigo-300 font-medium' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
