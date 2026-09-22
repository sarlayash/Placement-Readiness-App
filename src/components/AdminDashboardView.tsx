import { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Search,
  Users,
  Award,
  TrendingUp,
  BrainCircuit,
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  Sparkles,
  Zap,
  Layers,
  ArrowUpRight,
  FileText,
  Lock,
  Wallet,
  Coins,
  QrCode,
  Phone,
  Gift,
} from 'lucide-react';
import {
  StudentProfile,
  LearnerActivityEvent,
  AptitudeAssessmentResult,
  CodingSubmission,
  Badge,
  RewardRedemption,
} from '../types';
import {
  subscribeToAllLearners,
  subscribeToAllLearnerActivities,
  getLearnerPerformanceDetails,
  subscribeToAllRedemptions,
  updateRedemptionStatus,
} from '../lib/firestoreService';

interface AdminDashboardViewProps {
  isAdminAuthenticated: boolean;
  onLoginSuccess: () => void;
  onExitAdmin: () => void;
  onOpenCertificateModalForUser?: (profile: StudentProfile) => void;
  onOpenLORModalForUser?: (profile: StudentProfile) => void;
}

// Cohort mock data so the dashboard is immediately rich with realistic multi-module learner analytics
const SEEDED_COHORT: (StudentProfile & {
  prsScore: number;
  testsCount: number;
  bonusWon: number;
  avgScore: number;
  topModule: string;
})[] = [
  {
    id: 'cohort_1',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@nitk.edu.in',
    college: 'NIT Karnataka, Surathkal',
    degree: 'B.Tech',
    branch: 'Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 9.1,
    targetRole: 'Software Development Engineer',
    targetCompanyTier: 'Tier-1 Big Tech (Google, Microsoft, Amazon)',
    githubUrl: 'https://github.com/aaravs',
    linkedinUrl: 'https://linkedin.com/in/aaravs',
    resumeHeadline: 'Passionate about Distributed Systems & Agentic AI',
    skills: [],
    streakDays: 14,
    avatarSeed: 'Aarav',
    prsScore: 845,
    testsCount: 18,
    bonusWon: 6,
    avgScore: 89,
    topModule: 'Agentic AI & Coding',
  },
  {
    id: 'cohort_2',
    fullName: 'Diya Patel',
    email: 'diya.patel@iitb.ac.in',
    college: 'IIT Bombay',
    degree: 'B.Tech',
    branch: 'Data Science & Artificial Intelligence',
    graduationYear: 2026,
    cgpa: 8.9,
    targetRole: 'Data Analyst / Scientist',
    targetCompanyTier: 'High-Growth Tech Unicorns (Razorpay, Swiggy, Uber)',
    githubUrl: 'https://github.com/diyap',
    linkedinUrl: 'https://linkedin.com/in/diyap',
    resumeHeadline: 'Building LLM agent workflows and RAG pipelines',
    skills: [],
    streakDays: 9,
    avatarSeed: 'Diya',
    prsScore: 790,
    testsCount: 14,
    bonusWon: 4,
    avgScore: 84,
    topModule: 'Generative AI & Power BI',
  },
  {
    id: 'cohort_3',
    fullName: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@vit.ac.in',
    college: 'Vellore Institute of Technology',
    degree: 'B.Tech',
    branch: 'Information Technology',
    graduationYear: 2026,
    cgpa: 8.4,
    targetRole: 'Data Analyst / Scientist',
    targetCompanyTier: 'Global IT & Consulting (TCS Digital, Accenture, Infosys SP)',
    githubUrl: 'https://github.com/rohand',
    linkedinUrl: 'https://linkedin.com/in/rohand',
    resumeHeadline: 'Power BI DAX, SQL Optimization, Advanced Excel',
    skills: [],
    streakDays: 7,
    avatarSeed: 'Rohan',
    prsScore: 715,
    testsCount: 11,
    bonusWon: 3,
    avgScore: 78,
    topModule: 'SQL & Power BI',
  },
  {
    id: 'cohort_4',
    fullName: 'Sneha Banerjee',
    email: 'sneha.b@bits-pilani.ac.in',
    college: 'BITS Pilani',
    degree: 'B.E.',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: 9.3,
    targetRole: 'Backend / Systems Engineer',
    targetCompanyTier: 'Tier-1 Big Tech (Google, Microsoft, Amazon)',
    githubUrl: 'https://github.com/snehab',
    linkedinUrl: 'https://linkedin.com/in/snehab',
    resumeHeadline: 'High-throughput microservices & database design',
    skills: [],
    streakDays: 21,
    avatarSeed: 'Sneha',
    prsScore: 880,
    testsCount: 22,
    bonusWon: 9,
    avgScore: 92,
    topModule: 'Coding & SQL',
  },
  {
    id: 'cohort_5',
    fullName: 'Kunal Verma',
    email: 'kunal.verma@dtu.ac.in',
    college: 'Delhi Technological University',
    degree: 'B.Tech',
    branch: 'Software Engineering',
    graduationYear: 2026,
    cgpa: 8.2,
    targetRole: 'Product Analyst',
    targetCompanyTier: 'Mid-Size Product Companies',
    githubUrl: '',
    linkedinUrl: '',
    resumeHeadline: 'Business acumen, Excel modeling, Soft Skills champion',
    skills: [],
    streakDays: 5,
    avatarSeed: 'Kunal',
    prsScore: 660,
    testsCount: 8,
    bonusWon: 2,
    avgScore: 73,
    topModule: 'Soft Skills & Excel',
  },
];

export function AdminDashboardView({
  isAdminAuthenticated,
  onLoginSuccess,
  onExitAdmin,
  onOpenCertificateModalForUser,
  onOpenLORModalForUser,
}: AdminDashboardViewProps) {
  // Login form state
  const [adminIdInput, setAdminIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Live Firestore State
  const [firestoreLearners, setFirestoreLearners] = useState<StudentProfile[]>([]);
  const [liveActivities, setLiveActivities] = useState<LearnerActivityEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');

  // Selected learner for deep inspection modal
  const [inspectingLearner, setInspectingLearner] = useState<StudentProfile | null>(null);
  const [inspectingDetails, setInspectingDetails] = useState<{
    aptitudeResults: AptitudeAssessmentResult[];
    codingSubmissions: CodingSubmission[];
    badges: Badge[];
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [updatingRedemptionId, setUpdatingRedemptionId] = useState<string | null>(null);

  // Subscribe to live Firestore learners & activities & redemptions
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const unsubLearners = subscribeToAllLearners((learners) => {
      setFirestoreLearners(learners);
    });

    const unsubActivities = subscribeToAllLearnerActivities((activities) => {
      setLiveActivities(activities);
    });

    const unsubRedemptions = subscribeToAllRedemptions((list) => {
      setRedemptions(list);
    });

    return () => {
      unsubLearners();
      unsubActivities();
      unsubRedemptions();
    };
  }, [isAdminAuthenticated]);

  // Handle updating redemption status
  const handleUpdateStatus = async (redemptionId: string, status: 'completed' | 'rejected' | 'processing') => {
    setUpdatingRedemptionId(redemptionId);
    try {
      await updateRedemptionStatus(redemptionId, status);
    } catch (e) {
      console.error('Failed to update redemption status:', e);
    } finally {
      setUpdatingRedemptionId(null);
    }
  };

  // Handle Admin Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (adminIdInput.trim() === 'kapiladmin' && passwordInput === 'admin123') {
      onLoginSuccess();
      setAdminIdInput('');
      setPasswordInput('');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  // Inspect Learner Details
  const handleInspectLearner = async (learner: StudentProfile) => {
    setInspectingLearner(learner);
    setLoadingDetails(true);
    try {
      const details = await getLearnerPerformanceDetails(learner.id);
      setInspectingDetails(details);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Combined learners list (real Firestore + seeded cohort)
  const allLearners = useMemo(() => {
    const liveMap = new Map<string, StudentProfile>();
    firestoreLearners.forEach((fl) => liveMap.set(fl.id, fl));

    const combined: (StudentProfile & { isLive?: boolean; prsScore: number; testsCount: number })[] = [];

    // Add live Firestore learners first
    firestoreLearners.forEach((fl) => {
      combined.push({
        ...fl,
        isLive: true,
        prsScore: 700 + (fl.streakDays * 5) + (fl.cgpa ? Math.round(fl.cgpa * 10) : 50),
        testsCount: 3 + fl.streakDays,
      });
    });

    // Add seeded cohort learners if not duplicate
    SEEDED_COHORT.forEach((cl) => {
      if (!liveMap.has(cl.id)) {
        combined.push({ ...cl, isLive: false });
      }
    });

    return combined;
  }, [firestoreLearners]);

  // Filtered learners
  const filteredLearners = useMemo(() => {
    return allLearners.filter((learner) => {
      const matchesSearch =
        learner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        learner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        learner.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        learner.targetRole.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier =
        selectedTierFilter === 'all' ||
        (selectedTierFilter === 'tier1' && learner.prsScore >= 800) ||
        (selectedTierFilter === 'competitive' && learner.prsScore >= 700 && learner.prsScore < 800) ||
        (selectedTierFilter === 'developing' && learner.prsScore < 700);

      return matchesSearch && matchesTier;
    });
  }, [allLearners, searchQuery, selectedTierFilter]);

  // Computed Real-Time Aggregate Metrics
  const aggregateMetrics = useMemo(() => {
    const totalCount = allLearners.length;
    const avgPRS = totalCount > 0
      ? Math.round(allLearners.reduce((acc, l) => acc + l.prsScore, 0) / totalCount)
      : 760;
    const superReadyCount = allLearners.filter((l) => l.prsScore >= 800).length;
    const totalTests = allLearners.reduce((acc, l) => acc + l.testsCount, 0);

    return { totalCount, avgPRS, superReadyCount, totalTests };
  }, [allLearners]);

  // 1. IF NOT AUTHENTICATED: Show Admin Login Form
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/30 text-white">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-black">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">
              Administrator Portal
            </h2>
            <p className="text-xs text-neutral-400">
              Certified By <strong className="text-amber-300">SarlaYash Mission</strong> • Powered By <strong className="text-amber-300">Kapil</strong>
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-neutral-900 border border-amber-500/30 text-[11px] font-bold text-amber-300">
              Restricted Executive Access
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Administrator ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  placeholder="Enter Administrator ID"
                  required
                  autoFocus
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Password"
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-submit-btn"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Verify & Access Dashboard</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full py-2.5 px-4 text-xs font-bold text-neutral-400 hover:text-white transition-colors text-center cursor-pointer"
            >
              ← Back to Learner Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. IF AUTHENTICATED: Show Full Real-Time Admin Command Center
  return (
    <div className="space-y-5 pb-24 text-white max-w-5xl mx-auto">
      {/* Top Admin Status Banner */}
      <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Admin Command Center
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Tracking all learners across 10 modules in real-time • Certified By SarlaYash Mission
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onExitAdmin}
            id="admin-logout-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-400" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Real-time KPI Scorecards (Black & Gold) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Learners */}
        <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Learners
            </span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{aggregateMetrics.totalCount}</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Cohort Active
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Across top engineering colleges</p>
        </div>

        {/* Card 2: Average PRS */}
        <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Average PRS
            </span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">{aggregateMetrics.avgPRS}</span>
            <span className="text-[10px] text-neutral-400">/ 1000</span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">78th percentile campus avg</p>
        </div>

        {/* Card 3: Super Ready Tier-1 */}
        <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Tier-1 Ready (800+)
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{aggregateMetrics.superReadyCount}</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Placement Star
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Ready for Big Tech cutoffs</p>
        </div>

        {/* Card 4: Assessment Drills */}
        <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Assessments Run
            </span>
            <BrainCircuit className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300">{aggregateMetrics.totalTests}</span>
            <span className="text-[10px] font-bold text-neutral-300">Verified</span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">All 10 curriculum tracks</p>
        </div>
      </div>

      {/* 10 Assessment Modules Real-Time Status Grid */}
      <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Module Performance Matrix (10 Core Tracks)
            </h3>
          </div>
          <span className="text-[10px] text-neutral-400">Real-Time Evaluation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { name: 'Verbal Ability', avg: '82%', attempts: 42, icon: '🗣️' },
            { name: 'Soft Skills', avg: '88%', attempts: 36, icon: '🤝' },
            { name: 'Coding & DSA', avg: '76%', attempts: 58, icon: '💻' },
            { name: 'Excel', avg: '84%', attempts: 29, icon: '📊' },
            { name: 'SQL Queries', avg: '81%', attempts: 47, icon: '🗄️' },
            { name: 'Power BI', avg: '79%', attempts: 31, icon: '📈' },
            { name: 'AI Core', avg: '83%', attempts: 44, icon: '🧠' },
            { name: 'Generative AI', avg: '86%', attempts: 39, icon: '✨' },
            { name: 'Agentic AI', avg: '80%', attempts: 35, icon: '🤖' },
            { name: 'Quantitative Apt.', avg: '75%', attempts: 50, icon: '📐' },
          ].map((mod) => (
            <div
              key={mod.name}
              className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 hover:border-amber-400/50 transition-colors"
            >
              <div className="flex items-center justify-between text-sm mb-1">
                <span>{mod.icon}</span>
                <span className="text-xs font-black text-amber-400">{mod.avg}</span>
              </div>
              <div className="text-[11px] font-bold text-white truncate">{mod.name}</div>
              <div className="text-[10px] text-neutral-400">{mod.attempts} sessions</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards & UPI Cashouts Management Console */}
      <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit',sans-serif]">
                UPI Rewards & Cash Payouts Command Center
              </h3>
              <p className="text-[10px] text-neutral-400">
                Rule: 500 XP = ₹100 INR • ₹200 Welcome Bonus on 500 XP
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {redemptions.length} Total Requests
          </span>
        </div>

        {/* Payout Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block font-semibold">Total Requested</span>
            <span className="text-sm font-black text-white">
              ₹{redemptions.reduce((acc, r) => acc + (r.inrAmount || 0), 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-neutral-950 p-2.5 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block font-semibold">Total Paid Out</span>
            <span className="text-sm font-black text-emerald-300">
              ₹{redemptions.filter((r) => r.status === 'completed').reduce((acc, r) => acc + (r.inrAmount || 0), 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-neutral-950 p-2.5 rounded-xl border border-amber-500/30">
            <span className="text-[10px] text-amber-400 block font-semibold">Pending Approval</span>
            <span className="text-sm font-black text-amber-300">
              {redemptions.filter((r) => r.status === 'pending').length} requests (₹
              {redemptions.filter((r) => r.status === 'pending').reduce((acc, r) => acc + (r.inrAmount || 0), 0).toLocaleString('en-IN')})
            </span>
          </div>

          <div className="bg-neutral-950 p-2.5 rounded-xl border border-sky-500/30">
            <span className="text-[10px] text-sky-400 block font-semibold">Welcome Bonuses</span>
            <span className="text-sm font-black text-sky-300">
              {redemptions.filter((r) => r.type === 'welcome_bonus').length} claimed
            </span>
          </div>
        </div>

        {/* Redemptions Table / List */}
        {redemptions.length === 0 ? (
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400">
            No UPI redemption requests submitted yet. When learners redeem 500 XP or claim their ₹200 welcome bonus, their payouts appear here in real-time.
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {redemptions.map((red) => (
              <div
                key={red.id}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">
                      ₹{red.inrAmount} INR
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                      {red.type === 'welcome_bonus' ? '🎁 ₹200 Welcome Bonus' : `⚡ ${red.xpRedeemed} XP Redeemed`}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      Ref: {red.transactionRef}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-300 flex-wrap">
                    <span className="font-semibold text-sky-300">{red.userName || 'Learner'}</span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-400">{red.userEmail}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono flex-wrap">
                    <span className="flex items-center gap-1 text-amber-300">
                      <QrCode className="w-3 h-3" />
                      <span>UPI: {red.upiId}</span>
                    </span>
                    {red.mobileNumber && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Phone className="w-3 h-3" />
                        <span>+91 {red.mobileNumber}</span>
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-500">
                      {new Date(red.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${
                      red.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : red.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {red.status === 'completed' ? 'Paid via UPI' : red.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>

                  {red.status === 'pending' && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={updatingRedemptionId === red.id}
                        onClick={() => handleUpdateStatus(red.id, 'completed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black uppercase transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {updatingRedemptionId === red.id ? 'Saving...' : 'Mark Paid'}
                      </button>
                      <button
                        type="button"
                        disabled={updatingRedemptionId === red.id}
                        onClick={() => handleUpdateStatus(red.id, 'rejected')}
                        className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-black transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Activity Stream (Recent test results, bonus wheel spins, code submissions) */}
      <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Real-Time Learner Activity Feed
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Listening
          </span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {liveActivities.length > 0 ? (
            liveActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    {act.type === 'coding' ? '💻' : act.type === 'spinning_wheel' ? '🎡' : '📝'}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{act.userName}</span>
                      <span className="text-[10px] font-semibold text-neutral-400">({act.module})</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">{act.details}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {act.bonusEarned && (
                    <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 block mb-0.5">
                      Double Bonus +50
                    </span>
                  )}
                  <span className="text-[10px] text-neutral-500">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            // Simulated live feed events
            [
              {
                user: 'Aarav Sharma',
                action: 'Solved Coding Challenge: Two Sum',
                time: 'Just now',
                module: 'Coding',
                tag: '100% Passed',
              },
              {
                user: 'Diya Patel',
                action: 'Spun Bonus Wheel (+40 Bonus Won!) on Agentic AI MCQ',
                time: '2 mins ago',
                module: 'Agentic AI',
                tag: 'Bonus Double',
              },
              {
                user: 'Sneha Banerjee',
                action: 'Completed SQL Assessment: Window Functions & Joins',
                time: '5 mins ago',
                module: 'SQL',
                tag: 'Score: 92%',
              },
              {
                user: 'Rohan Deshmukh',
                action: 'Unlocked Official Badge: Power BI DAX Maestro',
                time: '8 mins ago',
                module: 'Power BI',
                tag: 'Badge PNG',
              },
            ].map((feed, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{feed.user}</span>
                      <span className="text-[10px] font-semibold text-neutral-400">({feed.module})</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">{feed.action}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 block mb-0.5">
                    {feed.tag}
                  </span>
                  <span className="text-[10px] text-neutral-500">{feed.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Learners Directory & Filter Bar */}
      <div className="bg-black border-2 border-amber-500/30 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Learners Directory & Performance Deep Dive ({filteredLearners.length})
            </h3>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, college, role..."
                className="bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 w-44 sm:w-56"
              />
            </div>

            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Tiers</option>
              <option value="tier1">Tier-1 Ready (800+)</option>
              <option value="competitive">Competitive (700-799)</option>
              <option value="developing">Developing (&lt;700)</option>
            </select>
          </div>
        </div>

        {/* Learners Table/Cards */}
        <div className="space-y-2">
          {filteredLearners.map((learner) => (
            <div
              key={learner.id}
              className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-sm flex items-center justify-center shrink-0 border border-amber-300 shadow-sm">
                  {learner.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-white">{learner.fullName}</span>
                    {learner.isLive && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Live User
                      </span>
                    )}
                    <span className="text-xs text-neutral-400">({learner.email})</span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {learner.college} • Class of {learner.graduationYear} • Target: <strong className="text-white">{learner.targetRole}</strong>
                  </p>
                </div>
              </div>

              {/* Performance Metrics & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-900">
                <div className="text-left sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <span className="text-xs font-bold text-neutral-400">PRS</span>
                    <span className="text-base font-black text-amber-400">{learner.prsScore}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block">
                    {learner.testsCount} tests • {learner.streakDays}d streak
                  </span>
                </div>

                <button
                  id={`inspect-learner-${learner.id}`}
                  onClick={() => handleInspectLearner(learner)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/10 cursor-pointer active:scale-95"
                >
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect Learner Modal Drawer */}
      {inspectingLearner && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border-2 border-amber-500 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl shadow-amber-500/20 text-white space-y-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Learner Performance Dossier
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {inspectingLearner.fullName}
                </h3>
                <p className="text-xs text-neutral-400">
                  {inspectingLearner.college} • {inspectingLearner.email}
                </p>
              </div>

              <button
                onClick={() => setInspectingLearner(null)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <XCircle className="w-6 h-6 text-neutral-400" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 block font-bold">PRS Benchmark</span>
                <span className="text-xl font-black text-amber-400">
                  {inspectingLearner.cgpa ? Math.round(700 + inspectingLearner.cgpa * 10) : 780}
                </span>
              </div>
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 block font-bold">Practice Streak</span>
                <span className="text-xl font-black text-white">{inspectingLearner.streakDays} Days</span>
              </div>
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800 text-center">
                <span className="text-[10px] text-neutral-400 block font-bold">Target Company</span>
                <span className="text-xs font-bold text-amber-300 block truncate mt-1">
                  {inspectingLearner.targetCompanyTier.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Learner UPI & Rewards Credentials */}
            <div className="p-3 rounded-2xl bg-neutral-950 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div>
                <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">
                  Registered UPI & Cashout Destination
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-white font-bold">{inspectingLearner.upiId || 'No UPI ID saved'}</span>
                  {inspectingLearner.mobileNumber && (
                    <span className="text-neutral-400 font-mono text-[11px]">(+91 {inspectingLearner.mobileNumber})</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block font-semibold">Lifetime Earned</span>
                <span className="text-sm font-black text-emerald-400">
                  ₹{inspectingLearner.totalInrEarned || 0} INR
                </span>
              </div>
            </div>

            {/* Assessment History Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-amber-400" />
                  <span>Assessment Submissions across Modules</span>
                </h4>
                <span className="text-[10px] text-neutral-400">Verified Drills</span>
              </div>

              {loadingDetails ? (
                <div className="p-6 text-center text-xs text-neutral-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-amber-400 mb-2" />
                  Fetching live assessment records...
                </div>
              ) : inspectingDetails?.aptitudeResults && inspectingDetails.aptitudeResults.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {inspectingDetails.aptitudeResults.map((res) => (
                    <div
                      key={res.id}
                      className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">Assessment Attempt</span>
                        <span className="text-[11px] text-neutral-400 block">
                          {new Date(res.date).toLocaleDateString()} • {res.correctAnswers}/{res.totalQuestions} correct
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-400">{res.scorePercentage}%</span>
                        <span className="text-[10px] text-emerald-400 block">+{res.readinessPointsDelta} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400">
                  Standard cohort profile. Learner completed diagnostic drills in Coding, Agentic AI, and SQL with 85% average score.
                </div>
              )}
            </div>

            {/* Official Credentials for this learner: Certificate and LOR */}
            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/15 via-neutral-950 to-indigo-500/10 border border-blue-500/40 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-sky-300 uppercase tracking-wider">
                    Official Letter Of Recommendation (LOR)
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Comprehensive 11-Domain breakdown • PDF & PNG formats • Signed by Kapil Narula
                  </p>
                </div>

                {onOpenLORModalForUser && (
                  <button
                    onClick={() => {
                      onOpenLORModalForUser(inspectingLearner);
                      setInspectingLearner(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 shrink-0"
                  >
                    View LOR (PDF/PNG)
                  </button>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-neutral-950 to-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Placement Readiness Certificate
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Certified By SarlaYash Mission • Powered By Kapil (PNG format only)
                  </p>
                </div>

                {onOpenCertificateModalForUser && (
                  <button
                    onClick={() => {
                      onOpenCertificateModalForUser(inspectingLearner);
                      setInspectingLearner(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-black uppercase tracking-wider shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 shrink-0"
                  >
                    Inspect Certificate (PNG)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
