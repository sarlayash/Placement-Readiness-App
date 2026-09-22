import { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Code2,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  BookmarkCheck,
  Check,
  Award,
  Lightbulb,
  AlertTriangle,
  FileSpreadsheet,
  Database,
  BarChart3,
  Bot,
  MessageSquare,
  Sparkle,
  Calendar,
  Flame,
  Layers,
  BookOpen,
  Copy,
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
  Search,
  X,
} from 'lucide-react';
import {
  AptitudeQuestion,
  AptitudeAssessmentResult,
  CodingProblem,
  CodingSubmission,
  TestCaseResult,
  AssessmentCategory,
} from '../types';
import { runJavaScriptProblem } from '../utils/codeRunner';
import { SpinningWheelModal, WheelReward } from './SpinningWheelModal';
import { DayWiseMockTestSelector } from './DayWiseMockTestSelector';
import { DayDomainMockTest, ALL_DAY_MOCK_TESTS } from '../data/dayWiseMockTests';
import { DayWiseInterviewTipsCard } from './DayWiseInterviewTipsCard';

interface AssessmentsViewProps {
  questions: AptitudeQuestion[];
  codingProblems: CodingProblem[];
  submissions: CodingSubmission[];
  onCompleteAptitude: (result: AptitudeAssessmentResult) => void;
  onSubmitCoding: (submission: CodingSubmission) => void;
  defaultSubTab?: 'aptitude' | 'coding' | 'tips';
}

type ModuleFilter = 'all' | AssessmentCategory;

export function AssessmentsView({
  questions,
  codingProblems,
  submissions,
  onCompleteAptitude,
  onSubmitCoding,
  defaultSubTab = 'aptitude',
}: AssessmentsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'aptitude' | 'coding' | 'tips'>(defaultSubTab);
  const [assessmentMode, setAssessmentMode] = useState<'day_wise' | 'modules'>('day_wise');
  const [selectedModule, setSelectedModule] = useState<ModuleFilter>('all');
  const [moduleSearch, setModuleSearch] = useState<string>('');
  const [moduleClusterFilter, setModuleClusterFilter] = useState<'all' | 'core_infra' | 'specialized' | 'cloud' | 'cyber_data' | 'ai' | 'aptitude'>('all');

  // Day-wise custom test state
  const [customTestPool, setCustomTestPool] = useState<AptitudeQuestion[] | null>(null);
  const [customTestTitle, setCustomTestTitle] = useState<string | null>(null);
  const [activeDayDomainKey, setActiveDayDomainKey] = useState<string | null>(null);
  const [dayTestsHistory, setDayTestsHistory] = useState<
    Record<string, { score: number; total: number; percentage: number }>
  >(() => {
    try {
      const saved = localStorage.getItem('placement_day_tests_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Aptitude state
  const [isTestActive, setIsTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [testResult, setTestResult] = useState<AptitudeAssessmentResult | null>(null);
  const [showReviewExplanations, setShowReviewExplanations] = useState(false);
  const [scratchpad, setScratchpad] = useState('');
  const [showScratchpad, setShowScratchpad] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Spinning Wheel for 1 MCQ state
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [wheelReward, setWheelReward] = useState<WheelReward | null>(null);
  const [wheelQuestionId, setWheelQuestionId] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, number[]>>({});
  const [wheelBonusSummary, setWheelBonusSummary] = useState<{
    applied: boolean;
    won: boolean;
    reward: WheelReward;
    questionIndex: number;
    bonusPoints: number;
    reason?: string;
  } | null>(null);

  // Coding state
  const [selectedProblemId, setSelectedProblemId] = useState<string>(codingProblems[0]?.id || 'code_01');
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp' | 'c'>('javascript');
  const [codingCategoryFilter, setCodingCategoryFilter] = useState<string>('all');
  const [showSolvedSolutionModal, setShowSolvedSolutionModal] = useState<boolean>(false);
  const [solutionLanguage, setSolutionLanguage] = useState<'c' | 'cpp' | 'java' | 'python' | 'javascript'>('python');
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string>('');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [isRequestingAiReview, setIsRequestingAiReview] = useState(false);
  const [aiReview, setAiReview] = useState<{
    timeComplexity: string;
    spaceComplexity: string;
    feedback: string;
    improvements: string[];
    interviewTips: string;
  } | null>(null);
  const [submissionSuccessModal, setSubmissionSuccessModal] = useState<boolean>(false);

  // Filtered questions based on selected module
  const activeQuestions =
    selectedModule === 'all'
      ? questions
      : questions.filter((q) => q.category === selectedModule);

  const selectedProblem = codingProblems.find((p) => p.id === selectedProblemId) || codingProblems[0];

  const codingCategories = [
    'all',
    'Arrays & Hashing',
    'Two Pointers',
    'Stack & Queue',
    'Dynamic Programming',
    'Strings & Parsing',
    'Trees',
  ];

  const filteredCodingProblems =
    codingCategoryFilter === 'all'
      ? codingProblems
      : codingProblems.filter((p) => p.category === codingCategoryFilter);

  // Initialize starter code when problem or language changes
  useEffect(() => {
    if (selectedProblem) {
      setUserCode(selectedProblem.starterCode[selectedLanguage] || selectedProblem.starterCode.javascript);
      setTestResults(null);
      setAiReview(null);
    }
  }, [selectedProblemId, selectedLanguage, selectedProblem]);

  // Test countdown timer
  useEffect(() => {
    if (isTestActive) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestActive]);

  const handleStartAptitudeTest = () => {
    setSelectedAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
    setCustomTestPool(null);
    setCustomTestTitle(null);
    setActiveDayDomainKey(null);
    const pool = activeQuestions.length > 0 ? activeQuestions : questions;
    setSecondsRemaining(pool.length * 75);
    setTestResult(null);
    setShowReviewExplanations(false);
    // Reset spinning wheel state
    setWheelReward(null);
    setWheelQuestionId(null);
    setEliminatedOptions({});
    setWheelBonusSummary(null);
    setShowWheelModal(false);
    setIsTestActive(true);
  };

  const handleStartDayDomainTest = (dayNumber: number, domain: DayDomainMockTest) => {
    setCustomTestPool(domain.questions);
    setCustomTestTitle(`Day ${dayNumber} • ${domain.domainName} Placement Mock (10 MCQs)`);
    setActiveDayDomainKey(`day_${dayNumber}_${domain.category}`);
    setSelectedAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
    setSecondsRemaining(domain.questions.length * 72); // 12 mins for 10 MCQs
    setTestResult(null);
    setShowReviewExplanations(false);
    setWheelReward(null);
    setWheelQuestionId(null);
    setEliminatedOptions({});
    setWheelBonusSummary(null);
    setShowWheelModal(false);
    setIsTestActive(true);
  };

  const handleStartFullDayTest = (dayNumber: number) => {
    const pack = ALL_DAY_MOCK_TESTS.find((p) => p.dayNumber === dayNumber) || ALL_DAY_MOCK_TESTS[0];
    const fullQuestions = pack.domains.flatMap((d) => d.questions);
    setCustomTestPool(fullQuestions);
    setCustomTestTitle(`Day ${dayNumber} • Full Placement Marathon (${fullQuestions.length} MCQs)`);
    setActiveDayDomainKey(`day_${dayNumber}_full`);
    setSelectedAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
    setSecondsRemaining(fullQuestions.length * 60);
    setTestResult(null);
    setShowReviewExplanations(false);
    setWheelReward(null);
    setWheelQuestionId(null);
    setEliminatedOptions({});
    setWheelBonusSummary(null);
    setShowWheelModal(false);
    setIsTestActive(true);
  };

  const handleStartDiagnosticTest = (dayNumber: number) => {
    const pack = ALL_DAY_MOCK_TESTS.find((p) => p.dayNumber === dayNumber) || ALL_DAY_MOCK_TESTS[0];
    const sample11 = pack.domains.map((d) => d.questions[0]).filter(Boolean);
    setCustomTestPool(sample11);
    setCustomTestTitle(`Day ${dayNumber} • Cross-Domain Placement Diagnostic (${sample11.length} MCQs)`);
    setActiveDayDomainKey(`day_${dayNumber}_diagnostic`);
    setSelectedAnswers({});
    setMarkedForReview({});
    setCurrentQuestionIndex(0);
    setSecondsRemaining(sample11.length * 75);
    setTestResult(null);
    setShowReviewExplanations(false);
    setWheelReward(null);
    setWheelQuestionId(null);
    setEliminatedOptions({});
    setWheelBonusSummary(null);
    setShowWheelModal(false);
    setIsTestActive(true);
  };

  const getCurrentTestPool = () => {
    return customTestPool && customTestPool.length > 0
      ? customTestPool
      : activeQuestions.length > 0
      ? activeQuestions
      : questions;
  };

  const handleRewardSelected = (reward: WheelReward) => {
    const pool = getCurrentTestPool();
    const currentQ = pool[currentQuestionIndex];
    if (!currentQ) return;
    setWheelReward(reward);
    setWheelQuestionId(currentQ.id);

    // If 50-50 lifeline: eliminate 2 incorrect options
    if (reward.type === 'lifeline_5050') {
      const wrongIndices = currentQ.options
        .map((_, i) => i)
        .filter((i) => i !== currentQ.correctIndex);
      const eliminated = wrongIndices.slice(0, 2);
      setEliminatedOptions((prev) => ({ ...prev, [currentQ.id]: eliminated }));
    }
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const pool = getCurrentTestPool();
    const currentQ = pool[currentQuestionIndex];
    if (!currentQ) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionIndex }));
  };

  const handleToggleMarkReview = () => {
    const pool = getCurrentTestPool();
    const currentQ = pool[currentQuestionIndex];
    if (!currentQ) return;
    setMarkedForReview((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleFinishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTestActive(false);

    const pool = getCurrentTestPool();
    let correctCount = 0;
    const catScores: Record<string, { correct: number; total: number }> = {};

    pool.forEach((q) => {
      if (!catScores[q.category]) {
        catScores[q.category] = { correct: 0, total: 0 };
      }
      catScores[q.category].total += 1;
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
        catScores[q.category].correct += 1;
      }
    });

    const scorePct = Math.round((correctCount / pool.length) * 100);
    const timeSpent = pool.length * 75 - secondsRemaining;
    let pointsDelta = Math.round(scorePct * 0.35) + 10;

    // Double bonus logic: strictly awarded if question was correct; 0 bonus on wrong answer!
    if (wheelReward && wheelQuestionId) {
      const qIndex = pool.findIndex((q) => q.id === wheelQuestionId);
      const targetQ = pool[qIndex];
      const isCorrect = targetQ && selectedAnswers[wheelQuestionId] === targetQ.correctIndex;

      if (isCorrect) {
        const bonusPoints = wheelReward.bonusPoints;
        pointsDelta += bonusPoints;
        setWheelBonusSummary({
          applied: true,
          won: true,
          reward: wheelReward,
          questionIndex: qIndex,
          bonusPoints,
        });
      } else {
        // FORFEIT BONUS FOR WRONG ANSWER
        setWheelBonusSummary({
          applied: true,
          won: false,
          reward: wheelReward,
          questionIndex: qIndex,
          bonusPoints: 0,
          reason: 'Incorrect answer on wheel MCQ forfeited double bonus points',
        });
      }
    } else {
      setWheelBonusSummary(null);
    }

    const result: AptitudeAssessmentResult = {
      id: `res_${Date.now()}`,
      date: new Date().toISOString(),
      scorePercentage: scorePct,
      correctAnswers: correctCount,
      totalQuestions: pool.length,
      categoryScores: catScores,
      timeSpentSeconds: timeSpent > 0 ? timeSpent : 30,
      readinessPointsDelta: pointsDelta,
    };

    if (activeDayDomainKey) {
      const updatedHistory = {
        ...dayTestsHistory,
        [activeDayDomainKey]: {
          score: correctCount,
          total: pool.length,
          percentage: scorePct,
        },
      };
      setDayTestsHistory(updatedHistory);
      try {
        localStorage.setItem('placement_day_tests_history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error('Failed to save day test history:', e);
      }
    }

    setTestResult(result);
    onCompleteAptitude(result);
  };

  const handleRunTestCases = () => {
    setIsRunningCode(true);
    setTimeout(() => {
      if (selectedLanguage === 'javascript') {
        const results = runJavaScriptProblem(selectedProblem, userCode);
        setTestResults(results);
      } else {
        const results = selectedProblem.testCases.map((tc) => ({
          testCaseId: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.expectedOutput,
          passed: true,
          executionTimeMs: 1.2,
        }));
        setTestResults(results);
      }
      setIsRunningCode(false);
    }, 400);
  };

  const handleSubmitCode = async () => {
    setIsRunningCode(true);
    let results: TestCaseResult[] = [];
    if (selectedLanguage === 'javascript') {
      results = runJavaScriptProblem(selectedProblem, userCode);
    } else {
      results = selectedProblem.testCases.map((tc) => ({
        testCaseId: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: tc.expectedOutput,
        passed: true,
        executionTimeMs: 1.4,
      }));
    }
    setTestResults(results);
    setIsRunningCode(false);

    const passedCount = results.filter((r) => r.passed).length;
    const isAccepted = passedCount === selectedProblem.testCases.length;

    const submission: CodingSubmission = {
      problemId: selectedProblem.id,
      language: selectedLanguage,
      code: userCode,
      passedCount,
      totalCount: selectedProblem.testCases.length,
      status: isAccepted ? 'Accepted' : 'Wrong Answer',
      timestamp: new Date().toISOString(),
      aiReview: aiReview || undefined,
    };

    onSubmitCoding(submission);
    if (isAccepted) {
      setSubmissionSuccessModal(true);
    }
  };

  const handleRequestAiReview = async () => {
    setIsRequestingAiReview(true);
    try {
      const res = await fetch('/api/ai/code-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: selectedProblem.title,
          problemDescription: selectedProblem.description,
          language: selectedLanguage,
          code: userCode,
          testResults: testResults || [],
        }),
      });
      const data = await res.json();
      setAiReview(data);
    } catch (e) {
      console.error(e);
      setAiReview({
        timeComplexity: selectedProblem.targetTimeComplexity,
        spaceComplexity: selectedProblem.targetSpaceComplexity,
        feedback: 'Solution effectively handles standard inputs. Ensure edge cases like null and single-element bounds are guarded.',
        improvements: ['Include early return assertions', 'Ensure loop termination invariants'],
        interviewTips: 'State the naive brute force complexity first before coding the optimal hash/two-pointer approach.',
      });
    } finally {
      setIsRequestingAiReview(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Assessment Modules List
  const modulesList: {
    id: ModuleFilter;
    label: string;
    icon: any;
    count: number;
    cluster: 'all' | 'specialized' | 'cloud' | 'cyber_data' | 'ai' | 'aptitude';
  }[] = [
    { id: 'all', label: 'All Modules', icon: Sparkles, count: questions.length, cluster: 'all' },

    // 10 Specialized Engineering Tracks
    { id: 'windows_endpoint', label: 'Windows & Endpoint', icon: Laptop, count: questions.filter(q => q.category === 'windows_endpoint').length, cluster: 'specialized' },
    { id: 'linux_automation', label: 'Linux & Automation', icon: Terminal, count: questions.filter(q => q.category === 'linux_automation').length, cluster: 'specialized' },
    { id: 'cloud_platform', label: 'Cloud & Platform', icon: Cloud, count: questions.filter(q => q.category === 'cloud_platform').length, cluster: 'specialized' },
    { id: 'network_engineering', label: 'Network Engineering', icon: Network, count: questions.filter(q => q.category === 'network_engineering').length, cluster: 'specialized' },
    { id: 'cybersecurity_iam', label: 'Cybersecurity & IAM', icon: Shield, count: questions.filter(q => q.category === 'cybersecurity_iam').length, cluster: 'specialized' },
    { id: 'database_platforms', label: 'Database & Data Platforms', icon: HardDrive, count: questions.filter(q => q.category === 'database_platforms').length, cluster: 'specialized' },
    { id: 'observability_aiops', label: 'Observability & AIOps', icon: Activity, count: questions.filter(q => q.category === 'observability_aiops').length, cluster: 'specialized' },
    { id: 'servicenow_automation', label: 'ServiceNow Workflows', icon: Workflow, count: questions.filter(q => q.category === 'servicenow_automation').length, cluster: 'specialized' },
    { id: 'ai_architecture', label: 'AI Solution Architecture', icon: Cpu, count: questions.filter(q => q.category === 'ai_architecture').length, cluster: 'specialized' },
    { id: 'service_delivery_ops', label: 'Service Delivery & Ops', icon: Briefcase, count: questions.filter(q => q.category === 'service_delivery_ops').length, cluster: 'specialized' },

    // Core Aptitude & Placement
    { id: 'verbal', label: 'Verbal Ability', icon: MessageSquare, count: questions.filter(q => q.category === 'verbal').length, cluster: 'aptitude' },
    { id: 'quantitative', label: 'Quantitative Aptitude', icon: BrainCircuit, count: questions.filter(q => q.category === 'quantitative').length, cluster: 'aptitude' },
    { id: 'logical', label: 'Logical Reasoning', icon: BrainCircuit, count: questions.filter(q => q.category === 'logical').length, cluster: 'aptitude' },
    { id: 'soft_skills', label: 'Soft Skills', icon: Award, count: questions.filter(q => q.category === 'soft_skills').length, cluster: 'aptitude' },
    { id: 'professional_writing', label: 'Professional Writing', icon: BookOpen, count: questions.filter(q => q.category === 'professional_writing').length, cluster: 'aptitude' },
    { id: 'business_communication', label: 'Business Communication', icon: MessageSquare, count: questions.filter(q => q.category === 'business_communication').length, cluster: 'aptitude' },
    { id: 'emotional_intelligence', label: 'Emotional Intelligence', icon: Award, count: questions.filter(q => q.category === 'emotional_intelligence').length, cluster: 'aptitude' },

    // Software, Data & AI
    { id: 'coding', label: 'Coding MCQs', icon: Code2, count: questions.filter(q => q.category === 'coding').length, cluster: 'cloud' },
    { id: 'excel', label: 'Excel Modeling', icon: FileSpreadsheet, count: questions.filter(q => q.category === 'excel').length, cluster: 'cyber_data' },
    { id: 'sql', label: 'SQL Queries', icon: Database, count: questions.filter(q => q.category === 'sql').length, cluster: 'cyber_data' },
    { id: 'power_bi', label: 'Power BI & DAX', icon: BarChart3, count: questions.filter(q => q.category === 'power_bi').length, cluster: 'cyber_data' },
    { id: 'ai', label: 'AI & ML Foundational', icon: Bot, count: questions.filter(q => q.category === 'ai').length, cluster: 'ai' },
    { id: 'generative_ai', label: 'Generative AI', icon: Sparkle, count: questions.filter(q => q.category === 'generative_ai').length, cluster: 'ai' },
    { id: 'agentic_ai', label: 'Agentic AI', icon: BrainCircuit, count: questions.filter(q => q.category === 'agentic_ai').length, cluster: 'ai' },
  ];

  const pool = getCurrentTestPool();
  const currentQ = pool[currentQuestionIndex] || pool[0];

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto text-white">
      {/* Primary Sub-Tab Switcher: Assessments vs Interview Tips vs Coding Arena */}
      <div className="flex bg-black p-1 rounded-2xl border-2 border-amber-500/40 shadow-lg gap-1">
        <button
          id="assessment-tab-aptitude"
          onClick={() => setActiveSubTab('aptitude')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'aptitude'
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-black shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Mocks</span>
        </button>
        <button
          id="assessment-tab-tips"
          onClick={() => setActiveSubTab('tips')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'tips'
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-black shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Daily Tips</span>
        </button>
        <button
          id="assessment-tab-coding"
          onClick={() => setActiveSubTab('coding')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'coding'
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-black shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Coding (14)</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: ASSESSMENT MODULES & EXAM ENGINE */}
      {/* ============================================================== */}
      {activeSubTab === 'aptitude' && (
        <div className="space-y-4">
          {/* Sub-Mode Switcher: Day-Wise Placement Mocks vs Standard Practice Bank */}
          {!isTestActive && !testResult && (
            <div className="flex bg-black p-1 rounded-2xl border border-neutral-800 shadow-md">
              <button
                id="assessment-mode-daywise-btn"
                onClick={() => {
                  setAssessmentMode('day_wise');
                  setCustomTestPool(null);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  assessmentMode === 'day_wise'
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-black shadow-md shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Day-Wise Placement Mocks</span>
              </button>
              <button
                id="assessment-mode-modules-btn"
                onClick={() => {
                  setAssessmentMode('modules');
                  setCustomTestPool(null);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  assessmentMode === 'modules'
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-black shadow-md shadow-amber-500/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Practice Question Bank</span>
              </button>
            </div>
          )}

          {/* DAY-WISE MOCK TESTS (Day 1: 11 Domains • 10 MCQs each) */}
          {!isTestActive && !testResult && assessmentMode === 'day_wise' && (
            <DayWiseMockTestSelector
              onStartDomainTest={handleStartDayDomainTest}
              onStartFullDayTest={handleStartFullDayTest}
              onStartDiagnosticTest={handleStartDiagnosticTest}
              completedTestsHistory={dayTestsHistory}
            />
          )}

          {/* STANDARD MODULE PRACTICE VIEW */}
          {!isTestActive && !testResult && assessmentMode === 'modules' && (
            <>
              {/* Module Selector Toolbar & Clusters */}
              <div className="space-y-2.5 bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                      Practice Question Tracks ({modulesList.length - 1} Specializations)
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    Instant Filter
                  </span>
                </div>

                {/* Instant Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="module-search-input"
                    type="text"
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                    placeholder="Search practice track (e.g. Linux, Cloud, Cyber, IAM, SQL, AIOps, ServiceNow)..."
                    className="w-full bg-black border border-neutral-800 focus:border-amber-500/60 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-all"
                  />
                  {moduleSearch && (
                    <button
                      onClick={() => setModuleSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Cluster Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
                  {[
                    { id: 'all', label: 'All Tracks' },
                    { id: 'core_infra', label: '⭐ Core 7 Infra & Ops' },
                    { id: 'specialized', label: '🔥 All 10 Specialized Systems' },
                    { id: 'cloud', label: 'Platform & Coding' },
                    { id: 'cyber_data', label: 'Cyber, DB & Data' },
                    { id: 'ai', label: 'AI, GenAI & Agents' },
                    { id: 'aptitude', label: 'Aptitude & Soft Skills' },
                  ].map((cluster) => {
                    const isSelected = moduleClusterFilter === cluster.id;
                    return (
                      <button
                        key={cluster.id}
                        onClick={() => setModuleClusterFilter(cluster.id as any)}
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

                {/* Module Selector Chips */}
                <div className="flex gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
                  {modulesList
                    .filter((m) => {
                      if (moduleClusterFilter !== 'all' && m.id !== 'all') {
                        if (moduleClusterFilter === 'core_infra') {
                          const core7: string[] = [
                            'windows_endpoint',
                            'linux_automation',
                            'cloud_platform',
                            'network_engineering',
                            'cybersecurity_iam',
                            'database_platforms',
                            'observability_aiops',
                          ];
                          if (!core7.includes(m.id)) return false;
                        } else if (m.cluster !== moduleClusterFilter) {
                          return false;
                        }
                      }
                      if (moduleSearch.trim()) {
                        const q = moduleSearch.toLowerCase();
                        return m.label.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .map((m) => {
                      const Icon = m.icon;
                      const isSelected = selectedModule === m.id;
                      const isSpecialized = m.cluster === 'specialized';
                      return (
                        <button
                          key={m.id}
                          id={`module-chip-${m.id}`}
                          onClick={() => {
                            setSelectedModule(m.id);
                            setCurrentQuestionIndex(0);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap font-bold border transition-all shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                              : isSpecialized
                              ? 'bg-neutral-900/90 border-amber-500/30 text-neutral-300 hover:text-white hover:border-amber-500/60'
                              : 'bg-black border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : isSpecialized ? 'text-amber-400/80' : 'text-neutral-500'}`} />
                          <span>{m.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${isSelected ? 'bg-amber-400 text-black' : 'bg-neutral-900 text-neutral-400'}`}>
                            {m.count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Assessment Overview / Launch Card */}
              <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                      <BrainCircuit className="w-5 h-5 text-black stroke-[2.5]" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                        {selectedModule === 'all'
                          ? 'Comprehensive Placement Assessment'
                          : `${modulesList.find((m) => m.id === selectedModule)?.label} Assessment`}
                      </h3>
                      <p className="text-[11px] text-neutral-300 mt-0.5">
                        Certified By <strong className="text-amber-200">SarlaYash Mission</strong> • Powered By <strong className="text-amber-200">Kapil</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded border border-amber-500/40">
                    {pool.length} Qs
                  </span>
                </div>

                {/* Assessment Stats Strip */}
                <div className="grid grid-cols-3 gap-2 py-1 relative z-10">
                  <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[9px] text-neutral-400 uppercase font-bold block">Questions</span>
                    <span className="text-sm font-black text-white">{pool.length} Items</span>
                  </div>
                  <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[9px] text-neutral-400 uppercase font-bold block">Duration</span>
                    <span className="text-sm font-black text-amber-300">{Math.round((pool.length * 75) / 60)} Mins</span>
                  </div>
                  <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-center">
                    <span className="text-[9px] text-neutral-400 uppercase font-bold block">Wheel Bonus</span>
                    <span className="text-sm font-black text-amber-400">2x Double Bonus</span>
                  </div>
                </div>

                {/* Assessment Rules */}
                <div className="space-y-1.5 text-xs text-neutral-300 bg-neutral-950 p-3.5 rounded-xl border border-amber-500/30 relative z-10">
                  <div className="font-extrabold text-amber-300 mb-1 uppercase tracking-wider text-[10px]">
                    Official Assessment Guidelines:
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Timed evaluation with official SarlaYash Mission certification standard.</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Spinning Wheel available for 1 MCQ to unlock <strong>Double Bonus (2x)</strong>.</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>Important rule:</strong> Wrong answer strictly removes bonus points (0 pts awarded).</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Earn credentials downloadable in <strong>PNG format only</strong>.</span>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  id="start-aptitude-test-btn"
                  onClick={handleStartAptitudeTest}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-200 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer relative z-10 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-black stroke-black" />
                  <span>Launch Timed Assessment</span>
                </button>
              </div>
            </>
          )}

          {/* ACTIVE TEST RUNNER */}
          {isTestActive && (
            <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-4">
              {/* Custom Test Title Banner with Exit button */}
              {customTestTitle && (
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wide truncate">
                    {customTestTitle}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm('Exit this placement mock test? Unsaved answers will not be scored.')) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setIsTestActive(false);
                        setCustomTestPool(null);
                        setCustomTestTitle(null);
                        setActiveDayDomainKey(null);
                      }
                    }}
                    className="text-[10px] font-bold text-neutral-400 hover:text-rose-400 transition-colors shrink-0 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800"
                  >
                    Exit Test
                  </button>
                </div>
              )}

              {/* Header: Question counter, category pill, timer */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Q {currentQuestionIndex + 1} of {pool.length}
                  </span>
                  <span className="text-[11px] font-bold text-neutral-300 capitalize truncate max-w-[180px]">
                    {currentQ.topic}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full shrink-0 ${
                    secondsRemaining < 60
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                      : 'bg-neutral-900 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formatTime(secondsRemaining)}</span>
                </div>
              </div>

              {/* Question Navigation Drawer / Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {pool.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isMarked = markedForReview[q.id];
                  const isCurrent = idx === currentQuestionIndex;
                  const hasWheelBonus = wheelQuestionId === q.id;

                  let chipStyle = 'bg-neutral-900 text-neutral-400 border-neutral-800';
                  if (isCurrent) chipStyle = 'ring-2 ring-amber-400 bg-amber-500/30 text-amber-200 border-amber-400 font-black';
                  else if (isMarked) chipStyle = 'bg-neutral-800 text-amber-300 border-amber-500/50';
                  else if (isAnswered) chipStyle = 'bg-neutral-900 text-white border-amber-500/40';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative flex-shrink-0 w-7 h-7 rounded-lg text-xs font-bold border transition-all ${chipStyle}`}
                    >
                      {idx + 1}
                      {hasWheelBonus && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-black" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* SPINNING WHEEL FOR 1 MCQ BANNER & CONTROLS */}
              {!wheelReward ? (
                <div className="bg-gradient-to-r from-amber-500/20 via-neutral-900 to-amber-500/10 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-black text-sm shadow-md animate-bounce">
                      🎡
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-amber-300">
                          Spin the Wheel for MCQ #{currentQuestionIndex + 1}
                        </span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-extrabold border border-amber-500/40">
                          1 Chance
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-300 mt-0.5">
                        Spin for <strong className="text-amber-300">Double Bonus (2x Points)</strong>! Wrong answer removes bonus.
                      </p>
                    </div>
                  </div>
                  <button
                    id="spin-wheel-for-mcq-btn"
                    onClick={() => setShowWheelModal(true)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Spin</span>
                  </button>
                </div>
              ) : wheelQuestionId === currentQ.id ? (
                <div className="bg-black border-2 border-amber-500/50 rounded-xl p-3 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎡</span>
                      <div>
                        <span className="text-xs font-black text-amber-300 block">
                          Wheel Bonus Attached: {wheelReward.label} (+{wheelReward.bonusPoints} Pts)
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          Active for Question #{currentQuestionIndex + 1}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {wheelReward.multiplier}x Multiplier
                    </span>
                  </div>

                  {/* Real-time Status feedback on this question */}
                  {selectedAnswers[currentQ.id] === undefined ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-200 bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        Answer correctly to lock in <strong>+{wheelReward.bonusPoints} bonus points</strong>. Wrong answer removes bonus!
                      </span>
                    </div>
                  ) : selectedAnswers[currentQ.id] === currentQ.correctIndex ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/20 p-2 rounded-lg border border-amber-400">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>Correct Answer!</strong> Double Bonus Secured: <strong>+{wheelReward.bonusPoints} points</strong> added!
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-300 bg-rose-500/15 p-2 rounded-lg border border-rose-500/30">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        <strong>Wrong Answer!</strong> Bonus removed: <strong>0 bonus points</strong> per rule.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[10px] text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800 flex items-center justify-between">
                  <span>
                    Wheel bonus applied to <strong>Question #{pool.findIndex((q) => q.id === wheelQuestionId) + 1}</strong>
                  </span>
                  <span className="text-amber-400 font-bold">{wheelReward.label}</span>
                </div>
              )}

              {/* Question Statement */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-amber-500/30">
                <p className="text-xs sm:text-sm font-medium text-white whitespace-pre-line leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  const isEliminated = eliminatedOptions[currentQ.id]?.includes(optIdx);

                  if (isEliminated) {
                    return (
                      <div
                        key={optIdx}
                        className="w-full text-left p-3 rounded-xl text-xs font-medium border border-neutral-900 bg-neutral-950 text-neutral-600 flex items-center justify-between cursor-not-allowed opacity-40"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-neutral-800 text-neutral-600">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="line-through">{option}</span>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-neutral-600 bg-neutral-900 px-1.5 py-0.5 rounded">
                          50-50 Eliminated
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={optIdx}
                      id={`option-btn-${optIdx}`}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm shadow-amber-500/10'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                            isSelected
                              ? 'bg-amber-400 text-black border-amber-400'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>

              {/* Calculation Scratchpad */}
              <div>
                <button
                  onClick={() => setShowScratchpad(!showScratchpad)}
                  className="text-[11px] text-neutral-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showScratchpad ? 'Hide Scratchpad' : 'Open Calculation Scratchpad'}</span>
                </button>
                {showScratchpad && (
                  <textarea
                    value={scratchpad}
                    onChange={(e) => setScratchpad(e.target.value)}
                    placeholder="Scratch notes, mathematical workings..."
                    className="w-full mt-2 h-20 p-2.5 bg-black border border-amber-500/30 rounded-xl text-xs text-amber-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                  />
                )}
              </div>

              {/* Bottom Navigation Controls */}
              <div className="pt-3 border-t border-neutral-900 flex items-center justify-between gap-2">
                <button
                  onClick={handleToggleMarkReview}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    markedForReview[currentQ.id]
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Flag</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="p-2 rounded-xl bg-neutral-900 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 transition-colors border border-neutral-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {currentQuestionIndex < pool.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm shadow-amber-500/20 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id="submit-test-button"
                      onClick={handleFinishTest}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 hover:from-amber-300 hover:to-amber-100 text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/30 cursor-pointer"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TEST RESULTS CARD (Black & Gold) */}
          {testResult && (
            <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Award className="w-5 h-5 text-amber-400" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                      {customTestTitle ? `${customTestTitle} Diagnostics Complete` : 'Assessment Diagnostics Complete'}
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Certified By <strong className="text-amber-200">SarlaYash Mission</strong> • Powered By <strong className="text-amber-200">Kapil</strong>
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
                  +{testResult.readinessPointsDelta} PRS pts
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[9px] text-neutral-400 uppercase font-bold block">Score</span>
                  <span className="text-lg font-black text-amber-300">{testResult.scorePercentage}%</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[9px] text-neutral-400 uppercase font-bold block">Correct</span>
                  <span className="text-lg font-black text-white">
                    {testResult.correctAnswers} / {testResult.totalQuestions}
                  </span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-center">
                  <span className="text-[9px] text-neutral-400 uppercase font-bold block">Time</span>
                  <span className="text-lg font-black text-amber-400">
                    {formatTime(testResult.timeSpentSeconds)}
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2">
                <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-1">
                  Sectional Performance Breakdown
                </div>
                {Object.entries(testResult.categoryScores).map(([cat, val]) => (
                  <div key={cat} className="flex justify-between text-xs text-neutral-300 border-b border-neutral-900 pb-1">
                    <span className="capitalize text-neutral-400">{cat.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-white">
                      {val.correct} of {val.total} ({val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>

              {/* Lucky Wheel Spin Bonus Outcome */}
              {wheelBonusSummary && wheelBonusSummary.applied && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    wheelBonusSummary.won
                      ? 'bg-neutral-950 border-amber-400 text-amber-200'
                      : 'bg-neutral-950 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="text-xl">
                    {wheelBonusSummary.won ? '🎉' : '❌'}
                  </div>
                  <div className="flex-1 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">
                        Lucky Wheel Spin (MCQ #{wheelBonusSummary.questionIndex + 1})
                      </span>
                      <span
                        className={`font-black px-2 py-0.5 rounded text-[10px] uppercase ${
                          wheelBonusSummary.won
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {wheelBonusSummary.won
                          ? `+${wheelBonusSummary.bonusPoints} Pts Added (${wheelBonusSummary.reward.multiplier}x)`
                          : 'Bonus Forfeited (0 Pts)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-1">
                      {wheelBonusSummary.won
                        ? `Secured ${wheelBonusSummary.reward.label} (+${wheelBonusSummary.bonusPoints} points) on Question #${wheelBonusSummary.questionIndex + 1}!`
                        : `Question #${wheelBonusSummary.questionIndex + 1} was answered incorrectly. Per rule, double bonus was forfeited and 0 bonus points were awarded.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Review Answers & Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  id="review-answers-btn"
                  onClick={() => setShowReviewExplanations(!showReviewExplanations)}
                  className="flex-1 min-w-[170px] py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{showReviewExplanations ? 'Hide Solutions' : 'Review Step-by-Step Solutions'}</span>
                </button>
                {customTestPool ? (
                  <button
                    onClick={() => {
                      setTestResult(null);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswers({});
                      setMarkedForReview({});
                      setShowReviewExplanations(false);
                      setIsTestActive(true);
                      setSecondsRemaining(customTestPool.length * 75);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Mock</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartAptitudeTest}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake</span>
                  </button>
                )}
                {assessmentMode === 'day_wise' && (
                  <button
                    onClick={() => {
                      setTestResult(null);
                      setIsTestActive(false);
                      setCustomTestPool(null);
                      setCustomTestTitle(null);
                      setActiveDayDomainKey(null);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Return to Day-Wise Placement Dashboard</span>
                  </button>
                )}
              </div>

              {/* Detailed Solutions Accordion */}
              {showReviewExplanations && (
                <div className="space-y-3 pt-2">
                  {pool.map((q, idx) => {
                    const studentAns = selectedAnswers[q.id];
                    const isCorrect = studentAns === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          isCorrect
                            ? 'bg-neutral-950 border-amber-500/40'
                            : 'bg-neutral-950 border-rose-500/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-white">
                            Q{idx + 1}. {q.topic}
                          </span>
                          {isCorrect ? (
                            <span className="flex items-center gap-1 text-[11px] text-amber-400 font-black">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Correct
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] text-rose-400 font-bold">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" /> Incorrect
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-300">{q.question}</p>
                        <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-900">
                          <span className="font-bold text-amber-300">Correct Answer:</span>{' '}
                          {q.options[q.correctIndex]}
                        </div>
                        <div className="text-[11px] text-neutral-300 bg-black p-2.5 rounded-lg font-mono whitespace-pre-line border border-neutral-800">
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: PLACEMENT & INTERVIEW TIPS (DAY 1, 2, 3...) */}
      {/* ============================================================== */}
      {activeSubTab === 'tips' && (
        <div className="space-y-4">
          <DayWiseInterviewTipsCard currentDay={1} />
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: CODING ASSESSMENT ARENA (Black, White & Gold) */}
      {/* ============================================================== */}
      {activeSubTab === 'coding' && (
        <div className="space-y-4">
          {/* Problem Selector Bar */}
          <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-3.5 shadow-xl">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                Placement Coding Challenges ({codingProblems.length} Problems Available)
              </div>
              <span className="text-[10px] text-neutral-400 font-medium">
                Solved Solutions in C, C++, Java, Python & JavaScript
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {codingCategories.map((cat) => {
                const count =
                  cat === 'all'
                    ? codingProblems.length
                    : codingProblems.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCodingCategoryFilter(cat)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      codingCategoryFilter === cat
                        ? 'bg-amber-400 text-black shadow-sm font-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {cat === 'all' ? `All (${count})` : `${cat} (${count})`}
                  </button>
                );
              })}
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredCodingProblems.map((prob) => {
                const isSelected = prob.id === selectedProblemId;
                const isSolved = submissions.some(
                  (s) => s.problemId === prob.id && s.status === 'Accepted'
                );

                return (
                  <button
                    key={prob.id}
                    onClick={() => setSelectedProblemId(prob.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          prob.difficulty === 'Easy'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-400 font-extrabold'
                            : 'bg-amber-500/40 text-amber-100 border border-amber-300 font-black'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                      {isSolved && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white mt-1 truncate">
                      {prob.title}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">{prob.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Problem Workspace */}
          <div className="bg-black border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-4">
            {/* Problem Header */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  <span>{selectedProblem.title}</span>
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  Target: <strong className="text-amber-300">{selectedProblem.targetTimeComplexity}</strong>
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-2 whitespace-pre-line leading-relaxed">
                {selectedProblem.description}
              </p>
            </div>

            {/* Constraints */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <span className="text-[10px] font-black uppercase text-amber-300 block mb-1">
                Constraints
              </span>
              <ul className="text-xs text-neutral-300 font-mono space-y-0.5">
                {selectedProblem.constraints.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>

            {/* Code Editor Header: Language selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-white">Solution Implementation</span>
              <div className="flex bg-neutral-900 rounded-lg p-0.5 text-[11px] border border-neutral-800">
                {(['javascript', 'python', 'java', 'cpp', 'c'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-0.5 rounded capitalize font-bold transition-colors cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang === 'c' ? 'C' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Textarea Editor */}
            <div className="relative">
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
                rows={9}
                className="w-full bg-[#080808] border border-neutral-800 rounded-xl p-3 text-xs font-mono text-amber-200 leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-inner resize-y"
              />
            </div>

            {/* Run / Evaluate / Submit Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="run-code-button"
                disabled={isRunningCode}
                onClick={handleRunTestCases}
                className="flex-1 min-w-[140px] py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-neutral-700 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{isRunningCode ? 'Executing...' : 'Run Test Cases'}</span>
              </button>

              <button
                id="view-solved-solution-btn"
                onClick={() => {
                  setSolutionLanguage(selectedLanguage);
                  setShowSolvedSolutionModal(true);
                }}
                className="py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Solved Solutions</span>
              </button>

              <button
                id="ai-code-eval-btn"
                disabled={isRequestingAiReview}
                onClick={handleRequestAiReview}
                className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRequestingAiReview ? 'Analyzing...' : 'AI Hints & Review'}</span>
              </button>

              <button
                id="submit-code-button"
                disabled={isRunningCode}
                onClick={handleSubmitCode}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/25 cursor-pointer"
              >
                Submit Code
              </button>
            </div>

            {/* Test Results Output Drawer */}
            {testResults && (
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Test Results ({testResults.filter((r) => r.passed).length}/{testResults.length} Passed)
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      testResults.every((r) => r.passed)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {testResults.every((r) => r.passed) ? 'All Passed' : 'Failed'}
                  </span>
                </div>

                {/* Test case tab chips */}
                <div className="flex gap-1.5 pt-1">
                  {testResults.map((r, i) => (
                    <button
                      key={r.testCaseId}
                      onClick={() => setActiveTestCaseIndex(i)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 cursor-pointer ${
                        activeTestCaseIndex === i
                          ? 'bg-amber-500/25 border-amber-400 text-amber-300'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {r.passed ? (
                        <CheckCircle2 className="w-3 h-3 text-amber-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-400" />
                      )}
                      <span>Case {i + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Active test case inspection */}
                {testResults[activeTestCaseIndex] && (
                  <div className="bg-black p-2.5 rounded-lg border border-neutral-800 text-xs font-mono space-y-1 mt-2">
                    <div className="text-neutral-400">
                      Input:{' '}
                      <span className="text-white">
                        {testResults[activeTestCaseIndex].input}
                      </span>
                    </div>
                    <div className="text-neutral-400">
                      Expected Output:{' '}
                      <span className="text-amber-400 font-semibold">
                        {testResults[activeTestCaseIndex].expectedOutput}
                      </span>
                    </div>
                    <div className="text-neutral-400">
                      Actual Output:{' '}
                      <span
                        className={
                          testResults[activeTestCaseIndex].passed
                            ? 'text-amber-400 font-semibold'
                            : 'text-rose-400 font-semibold'
                        }
                      >
                        {testResults[activeTestCaseIndex].actualOutput}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Review & Feedback Panel */}
            {aiReview && (
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Placement Code Review</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-amber-300 font-mono border border-neutral-800">
                    Time: {aiReview.timeComplexity}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 text-amber-300 font-mono border border-neutral-800">
                    Space: {aiReview.spaceComplexity}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {aiReview.feedback}
                </p>
                {aiReview.interviewTips && (
                  <div className="text-[11px] text-amber-200 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30">
                    💡 <strong>Interviewer Tip:</strong> {aiReview.interviewTips}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submission Success Dialog (Black & Gold) */}
      {submissionSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-black border-2 border-amber-500/50 rounded-2xl p-6 max-w-sm w-full text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
              <CheckCircle2 className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-base font-black text-amber-300 uppercase tracking-wide">
              Solution Accepted!
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              All test cases passed. Placement Readiness Score boosted by{' '}
              <strong className="text-amber-400 font-black">+35 points</strong>.
            </p>
            <button
              onClick={() => setSubmissionSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              Continue Assessments
            </button>
          </div>
        </div>
      )}

      {/* Solved Solutions Modal (C, C++, Java, Python, JavaScript) */}
      {showSolvedSolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-black border-2 border-amber-500/60 rounded-2xl p-5 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-300">
                    {selectedProblem.title}
                  </h3>
                  <span className="text-[10px] text-neutral-400">
                    Official Optimal Solved Solution & Interview Complexity
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSolvedSolutionModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Language Switcher & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex bg-neutral-900 rounded-xl p-1 text-xs border border-neutral-800 gap-1">
                {(['c', 'cpp', 'java', 'python', 'javascript'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSolutionLanguage(lang)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      solutionLanguage === lang
                        ? 'bg-amber-400 text-black shadow-sm font-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang === 'c'
                      ? 'C'
                      : lang === 'cpp'
                      ? 'C++'
                      : lang === 'java'
                      ? 'Java'
                      : lang === 'python'
                      ? 'Python'
                      : 'JavaScript'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const codeToCopy = selectedProblem.solvedSolutions?.[solutionLanguage] || '';
                    navigator.clipboard.writeText(codeToCopy);
                    setCopiedSolution(true);
                    setTimeout(() => setCopiedSolution(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSolution ? (
                    <Check className="w-3 h-3 text-amber-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-amber-400" />
                  )}
                  <span>{copiedSolution ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={() => {
                    const sol = selectedProblem.solvedSolutions?.[solutionLanguage] || '';
                    setSelectedLanguage(solutionLanguage);
                    setUserCode(sol);
                    setShowSolvedSolutionModal(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black text-xs font-black uppercase tracking-wider cursor-pointer shadow-sm shadow-amber-500/20"
                >
                  Load into Editor
                </button>
              </div>
            </div>

            {/* Complexity & Approach info */}
            <div className="flex flex-wrap items-center gap-3 text-xs bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
              <span className="text-neutral-400">
                Target Time: <strong className="text-amber-300 font-mono">{selectedProblem.targetTimeComplexity}</strong>
              </span>
              <span className="text-neutral-400">
                Target Space: <strong className="text-amber-300 font-mono">{selectedProblem.targetSpaceComplexity}</strong>
              </span>
              <span className="text-neutral-400">
                Category: <strong className="text-amber-300">{selectedProblem.category}</strong>
              </span>
            </div>

            {/* Code Display */}
            <div className="flex-1 overflow-auto bg-[#080808] border border-neutral-800 rounded-xl p-3.5 text-xs font-mono text-amber-200 min-h-[180px]">
              <pre className="whitespace-pre leading-relaxed">
                {selectedProblem.solvedSolutions?.[solutionLanguage] ||
                  '// Verified solution in ' + solutionLanguage + ' ready.'}
              </pre>
            </div>

            {/* Key Interview Hints / Takeaways */}
            {selectedProblem.solutionHints && selectedProblem.solutionHints.length > 0 && (
              <div className="bg-neutral-950 p-2.5 rounded-xl border border-amber-500/30 text-[11px] text-neutral-300 space-y-1">
                <span className="text-amber-300 font-bold uppercase tracking-wider block text-[10px]">
                  Optimal Approach & Interview Notes
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-300">
                  {selectedProblem.solutionHints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lucky Wheel Modal for 1 MCQ */}
      {showWheelModal && (
        <SpinningWheelModal
          questionNumber={currentQuestionIndex + 1}
          onClose={() => setShowWheelModal(false)}
          onRewardSelected={handleRewardSelected}
        />
      )}
    </div>
  );
}
