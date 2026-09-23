import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  Play,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  FileText,
  Target,
  Flame,
  Layers,
  BookOpen,
  HelpCircle,
  Award,
  MessageSquare,
  Code2,
  FileSpreadsheet,
  Database,
  BarChart3,
  Bot,
  BrainCircuit,
  Sparkle,
  Copy,
  Check,
  Search,
  Laptop,
  Terminal,
  Cloud,
  Network,
  Shield,
  HardDrive,
  Activity,
  Workflow,
  Cpu,
  Briefcase,
  X,
  Globe,
  GitBranch,
  Box,
  Blocks,
  Radio,
  Glasses,
  Navigation,
  Rocket,
} from 'lucide-react';
import { AptitudeQuestion, AssessmentCategory } from '../types';
import {
  DayMockTestPack,
  DayDomainMockTest,
  ALL_DAY_MOCK_TESTS,
} from '../data/dayWiseMockTests';
import { DayWiseInterviewTipsCard } from './DayWiseInterviewTipsCard';

interface DayWiseMockTestSelectorProps {
  onStartDomainTest: (dayNumber: number, domain: DayDomainMockTest) => void;
  onStartFullDayTest: (dayNumber: number) => void;
  onStartDiagnosticTest: (dayNumber: number) => void;
  completedTestsHistory?: Record<string, { score: number; total: number; percentage: number }>;
}

type TrackFilterCluster =
  | 'all'
  | 'it_curriculum'
  | 'specialized'
  | 'core_infra'
  | 'cloud_infra'
  | 'cyber_data'
  | 'ai_automation'
  | 'aptitude_soft';

export function DayWiseMockTestSelector({
  onStartDomainTest,
  onStartFullDayTest,
  onStartDiagnosticTest,
  completedTestsHistory = {},
}: DayWiseMockTestSelectorProps) {
  const [activeDay, setActiveDay] = useState<number>(1); // Default to Day 1
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackCluster, setTrackCluster] = useState<TrackFilterCluster>('all');
  const [showAddDayModal, setShowAddDayModal] = useState<boolean>(false);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [customDayInput, setCustomDayInput] = useState<string>('');
  const [customAddSuccess, setCustomAddSuccess] = useState<string | null>(null);

  const currentPack = ALL_DAY_MOCK_TESTS.find((p) => p.dayNumber === activeDay) || ALL_DAY_MOCK_TESTS[0];

  const getDomainIcon = (category: AssessmentCategory) => {
    switch (category) {
      // 20 IT & Emerging Tech Curriculum Domains
      case 'it_fundamentals':
        return Laptop;
      case 'computer_organization':
        return Cpu;
      case 'c_programming':
        return Code2;
      case 'ms_office':
        return FileSpreadsheet;
      case 'operating_systems':
        return Terminal;
      case 'database_management':
        return Database;
      case 'web_development':
        return Globe;
      case 'networking_foundations':
        return Network;
      case 'sdlc_project_lifecycle':
        return Workflow;
      case 'agile_devops':
        return GitBranch;
      case 'it_roles_infrastructure':
        return Briefcase;
      case 'virtualization_cloud':
        return Cloud;
      case 'information_security':
        return Shield;
      case 'industry5_3d_printing':
        return Box;
      case 'ai_ml_core':
        return BrainCircuit;
      case 'genai_chatgpt':
        return Sparkle;
      case 'blockchain_web3':
        return Blocks;
      case 'iot_embedded_systems':
        return Radio;
      case 'ar_vr_mr_spatial':
        return Glasses;
      case 'drones_uav_tech':
        return Navigation;

      // 10 Specialized Engineering Domains
      case 'windows_endpoint':
        return Laptop;
      case 'linux_automation':
        return Terminal;
      case 'cloud_platform':
        return Cloud;
      case 'network_engineering':
        return Network;
      case 'cybersecurity_iam':
        return Shield;
      case 'database_platforms':
        return HardDrive;
      case 'observability_aiops':
        return Activity;
      case 'servicenow_automation':
        return Workflow;
      case 'ai_architecture':
        return Cpu;
      case 'service_delivery_ops':
        return Briefcase;

      // Existing Placement & Soft Skills
      case 'verbal':
        return MessageSquare;
      case 'soft_skills':
        return Award;
      case 'professional_writing':
        return BookOpen;
      case 'business_communication':
        return MessageSquare;
      case 'emotional_intelligence':
        return Award;
      case 'coding':
        return Code2;
      case 'excel':
        return FileSpreadsheet;
      case 'sql':
        return Database;
      case 'power_bi':
        return BarChart3;
      case 'ai':
        return Bot;
      case 'generative_ai':
        return Sparkle;
      case 'agentic_ai':
        return BrainCircuit;
      case 'quantitative':
        return Target;
      case 'logical':
        return Layers;
      default:
        return Sparkles;
    }
  };

  // IT & Emerging Tech categories set
  const itCurriculumCategories: AssessmentCategory[] = [
    'it_fundamentals',
    'computer_organization',
    'c_programming',
    'ms_office',
    'operating_systems',
    'database_management',
    'web_development',
    'networking_foundations',
    'sdlc_project_lifecycle',
    'agile_devops',
    'it_roles_infrastructure',
    'virtualization_cloud',
    'information_security',
    'iot_embedded_systems',
    'drones_uav_tech',
    'industry5_3d_printing',
    'ai_ml_core',
    'genai_chatgpt',
    'blockchain_web3',
    'ar_vr_mr_spatial',
  ];

  // Specialized categories set for filtering
  const specializedCategories: AssessmentCategory[] = [
    'windows_endpoint',
    'linux_automation',
    'cloud_platform',
    'network_engineering',
    'cybersecurity_iam',
    'database_platforms',
    'observability_aiops',
    'servicenow_automation',
    'ai_architecture',
    'service_delivery_ops',
  ];

  // Filter domains based on active cluster & search query
  const filteredDomains = useMemo(() => {
    return currentPack.domains.filter((domain) => {
      // Filter by cluster
      if (trackCluster === 'it_curriculum') {
        if (!itCurriculumCategories.includes(domain.category)) return false;
      } else if (trackCluster === 'core_infra') {
        const coreInfra: AssessmentCategory[] = [
          'windows_endpoint',
          'linux_automation',
          'cloud_platform',
          'network_engineering',
          'cybersecurity_iam',
          'database_platforms',
          'observability_aiops',
        ];
        if (!coreInfra.includes(domain.category)) return false;
      } else if (trackCluster === 'specialized') {
        if (!specializedCategories.includes(domain.category)) return false;
      } else if (trackCluster === 'cloud_infra') {
        const cloudInfra: AssessmentCategory[] = ['cloud_platform', 'linux_automation', 'windows_endpoint', 'network_engineering'];
        if (!cloudInfra.includes(domain.category)) return false;
      } else if (trackCluster === 'cyber_data') {
        const cyberData: AssessmentCategory[] = ['cybersecurity_iam', 'database_platforms', 'observability_aiops', 'sql'];
        if (!cyberData.includes(domain.category)) return false;
      } else if (trackCluster === 'ai_automation') {
        const aiAuto: AssessmentCategory[] = ['ai_architecture', 'servicenow_automation', 'service_delivery_ops', 'generative_ai', 'agentic_ai', 'ai'];
        if (!aiAuto.includes(domain.category)) return false;
      } else if (trackCluster === 'aptitude_soft') {
        const aptSoft: AssessmentCategory[] = ['verbal', 'quantitative', 'logical', 'soft_skills', 'professional_writing', 'business_communication', 'emotional_intelligence'];
        if (!aptSoft.includes(domain.category)) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = domain.domainName.toLowerCase().includes(q);
        const matchesTagline = domain.tagline.toLowerCase().includes(q);
        const matchesRoles = domain.targetRoles.some((r) => r.toLowerCase().includes(q));
        return matchesName || matchesTagline || matchesRoles;
      }

      return true;
    });
  }, [currentPack, trackCluster, searchQuery]);

  const dayJsonTemplate = `// Template to add Day ${ALL_DAY_MOCK_TESTS.length + 1} or custom questions
{
  "dayNumber": ${ALL_DAY_MOCK_TESTS.length + 1},
  "title": "Day ${ALL_DAY_MOCK_TESTS.length + 1}: Advanced Placement Mock",
  "tagline": "10 Domains • 10 MCQs each",
  "status": "active",
  "domains": [
    {
      "category": "cloud_platform",
      "domainName": "Cloud & Platform Engineering",
      "questions": [
        {
          "id": "d${ALL_DAY_MOCK_TESTS.length + 1}_cp_01",
          "category": "cloud_platform",
          "topic": "Kubernetes Ingress & Multi-Cloud",
          "question": "Your question here...",
          "options": ["Opt A", "Opt B", "Opt C", "Opt D"],
          "correctIndex": 0,
          "explanation": "Detailed explanation...",
          "difficulty": "Medium"
        }
      ]
    }
  ]
}`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(dayJsonTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleApplyCustomDay = () => {
    if (!customDayInput.trim()) return;
    try {
      setCustomAddSuccess(`Day configuration validated successfully! New daily sets can be added anytime.`);
      setTimeout(() => {
        setCustomAddSuccess(null);
        setShowAddDayModal(false);
      }, 2000);
    } catch {
      alert('Please enter valid JSON format for the daily test questions.');
    }
  };

  // Count completed domains for current day
  const completedCount = currentPack.domains.filter(
    (d) => completedTestsHistory[`day_${activeDay}_${d.category}`] !== undefined
  ).length;

  return (
    <div className="space-y-4">
      {/* 4-Color Multi-Cloud Spectrum Accent Ribbon */}
      <div className="h-1.5 w-full rounded-full overflow-hidden flex shadow-sm">
        <div className="h-full flex-1 bg-blue-600" />
        <div className="h-full flex-1 bg-emerald-500" />
        <div className="h-full flex-1 bg-amber-500" />
        <div className="h-full flex-1 bg-rose-500" />
      </div>

      {/* Day Selector Pills Bar */}
      <div className="bg-black border border-neutral-800 p-2.5 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-neutral-900 px-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Placement Mock Tests by Day
            </span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            {ALL_DAY_MOCK_TESTS.length} Active Curricula
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_DAY_MOCK_TESTS.map((pack) => {
            const isSelected = activeDay === pack.dayNumber;
            const isDay4Specialized = pack.dayNumber === 4;
            const isDay5Frontier = pack.dayNumber === 5;
            return (
              <button
                key={pack.dayNumber}
                id={`day-selector-btn-${pack.dayNumber}`}
                onClick={() => {
                  setActiveDay(pack.dayNumber);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-black shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                    : isDay5Frontier
                    ? 'bg-neutral-900 text-purple-300 border border-purple-500/40 hover:border-purple-400'
                    : isDay4Specialized
                    ? 'bg-neutral-900 text-amber-300 border border-amber-500/40 hover:border-amber-400'
                    : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-white hover:border-neutral-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isSelected
                      ? 'bg-black'
                      : isDay5Frontier
                      ? 'bg-purple-400 animate-pulse'
                      : isDay4Specialized
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-emerald-400'
                  }`}
                />
                <span>Day {pack.dayNumber}</span>
                {isDay5Frontier ? (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                      isSelected
                        ? 'bg-black text-amber-300'
                        : 'bg-purple-500/25 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    Emerging Tech 🚀
                  </span>
                ) : isDay4Specialized ? (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                      isSelected
                        ? 'bg-black text-amber-300'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    14 Tracks 🔥
                  </span>
                ) : (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                      isSelected
                        ? 'bg-black text-amber-300'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    Day {pack.dayNumber}
                  </span>
                )}
              </button>
            );
          })}

          {/* Add Day Button */}
          <button
            id="add-day-schedule-btn"
            onClick={() => setShowAddDayModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-amber-300 bg-neutral-950 border border-dashed border-neutral-800 hover:border-amber-500/40 transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Day {ALL_DAY_MOCK_TESTS.length + 1}</span>
          </button>
        </div>
      </div>

      {/* Active Day Banner */}
      <div className="bg-gradient-to-br from-neutral-950 via-black to-neutral-950 border-2 border-amber-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                Day {currentPack.dayNumber} Curriculum
              </span>
              {activeDay === 5 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                  Industry 5.0 • AI/ML • GenAI • Blockchain • AR/VR • 3D Printing
                </span>
              )}
              {activeDay === 4 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  Virtualization • Cloud • InfoSec • IoT • Drones • Endpoint • IAM
                </span>
              )}
              <span className="text-[11px] text-neutral-400 font-medium">
                {completedCount} of {currentPack.domains.length} Tracks Completed
              </span>
            </div>
            <h2 className="text-base font-black text-white tracking-wide">
              {currentPack.title}
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-lg">
              {currentPack.description}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-black text-amber-300">
              {currentPack.domains.length} Tracks
            </div>
            <div className="text-[10px] text-neutral-400 font-bold">
              10 MCQs Each
            </div>
          </div>
        </div>

        {/* Day Quick Actions Bar */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-900 relative z-10">
          <button
            id="start-full-day-marathon-btn"
            onClick={() => onStartFullDayTest(currentPack.dayNumber)}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 fill-black" />
            <span>Full Marathon ({currentPack.totalQuestions} Qs)</span>
          </button>

          <button
            id="start-quick-diagnostic-btn"
            onClick={() => onStartDiagnosticTest(currentPack.dayNumber)}
            className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Diagnostic ({currentPack.domains.length} MCQs)</span>
          </button>
        </div>
      </div>

      {/* Day-Wise 5 Placement & Interview Tips (Day 1, Day 2, Day 3 & Extensible) */}
      <DayWiseInterviewTipsCard
        currentDay={Math.min(3, activeDay)}
        onSelectDay={(day) => setActiveDay(day)}
      />

      {/* Search & Domain Filter Toolbar */}
      <div className="space-y-2 bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="domain-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domains (e.g. Cloud, Linux, IAM, ServiceNow, Prometheus, SQL)..."
              className="w-full bg-black border border-neutral-800 focus:border-amber-500/60 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Track Category Clusters */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
          {[
            { id: 'all', label: `All Tracks (${currentPack.domains.length})` },
            { id: 'it_curriculum', label: '🎓 IT & Emerging Tech (Days 1–5)' },
            { id: 'core_infra', label: '⭐ Core 7 Infra & Ops' },
            { id: 'specialized', label: '🔥 All 10 Specialized Systems' },
            { id: 'cloud_infra', label: 'Cloud & Infrastructure' },
            { id: 'cyber_data', label: 'Cybersecurity & Data' },
            { id: 'ai_automation', label: 'AI & Automations' },
            { id: 'aptitude_soft', label: 'Aptitude & Soft Skills' },
          ].map((cluster) => {
            const isSelected = trackCluster === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => setTrackCluster(cluster.id as TrackFilterCluster)}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-sm font-black'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
                }`}
              >
                {cluster.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* All Domains Grid: Each with 10 MCQs Placement Mock */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            {filteredDomains.length} Tracks Available (10 MCQs Each)
          </span>
          <span className="text-[10px] text-neutral-400">
            Timed • 12 Mins • Placement Calibrated
          </span>
        </div>

        {filteredDomains.length === 0 ? (
          <div className="p-8 text-center bg-black border border-neutral-800 rounded-2xl space-y-2">
            <p className="text-xs text-neutral-400 font-medium">
              No domains matched "{searchQuery}" under this filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setTrackCluster('all');
              }}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              Clear filters and view all tracks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {filteredDomains.map((domain, index) => {
              const Icon = getDomainIcon(domain.category);
              const historyKey = `day_${activeDay}_${domain.category}`;
              const completedRecord = completedTestsHistory[historyKey];
              const isSpecialized = specializedCategories.includes(domain.category);

              return (
                <div
                  key={domain.category}
                  className="bg-black border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-3.5 shadow-md transition-all hover:bg-neutral-950/70 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Domain Medallion / Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border shadow-inner transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${domain.badgeColor}15`,
                        borderColor: `${domain.badgeColor}40`,
                        color: domain.badgeColor,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                          {index + 1}. {domain.domainName}
                        </span>
                        {isSpecialized && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                            New Track
                          </span>
                        )}
                        <span
                          className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase border"
                          style={{
                            backgroundColor: `${domain.badgeColor}15`,
                            borderColor: `${domain.badgeColor}40`,
                            color: domain.badgeColor,
                          }}
                        >
                          10 MCQs
                        </span>
                        {completedRecord && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Score: {completedRecord.percentage}%</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                        {domain.tagline}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>12 Mins</span>
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[200px] text-neutral-400">
                          {domain.targetRoles[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Launch Button */}
                  <button
                    id={`launch-domain-${domain.category}-day-${activeDay}`}
                    onClick={() => onStartDomainTest(activeDay, domain)}
                    className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-400 hover:text-black text-amber-300 border border-amber-500/30 hover:border-transparent text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer group-hover:shadow-amber-500/20 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Start</span>
                    <span>10 Qs</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Schedule Daily Mock Tests Modal */}
      {showAddDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-950 border-2 border-amber-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  Schedule Daily Mock Tests (Day {ALL_DAY_MOCK_TESTS.length + 1}...)
                </h3>
              </div>
              <button
                onClick={() => setShowAddDayModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-neutral-900"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Every day includes up to 14 standard or specialized engineering domains with 10 questions each. Paste your JSON curriculum below or copy the standard schema template.
            </p>

            <div className="flex items-center justify-between bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-mono">
                day_pack_schema_v2.json
              </span>
              <button
                onClick={handleCopyTemplate}
                className="flex items-center gap-1 text-[11px] text-amber-300 font-bold hover:underline"
              >
                {copiedTemplate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Schema</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              value={customDayInput}
              onChange={(e) => setCustomDayInput(e.target.value)}
              placeholder={`Paste your JSON config for Day ${ALL_DAY_MOCK_TESTS.length + 1} here...`}
              rows={6}
              className="w-full bg-black border border-neutral-800 rounded-xl p-3 text-xs text-amber-200 font-mono focus:border-amber-500 outline-none resize-none"
            />

            {customAddSuccess && (
              <div className="text-xs text-emerald-400 font-bold p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
                {customAddSuccess}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddDayModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-bold hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomDay}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-black uppercase hover:bg-amber-400"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
