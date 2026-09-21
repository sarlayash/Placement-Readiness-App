/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { AssessmentsView } from './components/AssessmentsView';
import { SkillsTrackerView } from './components/SkillsTrackerView';
import { RoadmapView } from './components/RoadmapView';
import { BadgesView } from './components/BadgesView';
import { ProfileView } from './components/ProfileView';
import { CompanyIntelligenceModal } from './components/CompanyIntelligenceModal';
import { GoogleAuthScreen } from './components/GoogleAuthScreen';
import { CertificateModal } from './components/CertificateModal';
import { AdminDashboardView } from './components/AdminDashboardView';

import {
  StudentProfile,
  SkillItem,
  CodingSubmission,
  AptitudeAssessmentResult,
  Badge,
  PersonalizedRoadmap,
} from './types';

import {
  APTITUDE_QUESTION_BANK,
  CODING_PROBLEMS,
  INITIAL_SKILLS,
  INITIAL_BADGES,
  INITIAL_ROADMAP,
  createDefaultProfile,
} from './data/initialData';

import { calculateReadinessScore } from './utils/scoreCalculator';
import { auth, onAuthStateChanged, logOut, type User } from './lib/firebase';
import {
  initializeUserAccount,
  subscribeToUserProfile,
  saveUserProfile,
  subscribeToSkills,
  saveSkillToFirestore,
  subscribeToBadges,
  saveBadgeToFirestore,
  subscribeToAptitudeResults,
  saveAptitudeResultToFirestore,
  subscribeToCodingSubmissions,
  saveCodingSubmissionToFirestore,
  subscribeToRoadmap,
  saveRoadmapToFirestore,
  recordLearnerActivity,
} from './lib/firestoreService';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Admin Dashboard State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('isAdminAuth') === 'true';
  });
  const [selectedInspectionProfile, setSelectedInspectionProfile] = useState<StudentProfile | null>(null);

  // Firestore Synced State
  const [profile, setProfile] = useState<StudentProfile>(() =>
    createDefaultProfile({ uid: 'guest', displayName: 'Learner', email: '' })
  );
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [codingSubmissions, setCodingSubmissions] = useState<CodingSubmission[]>([]);
  const [aptitudeResults, setAptitudeResults] = useState<AptitudeAssessmentResult[]>([]);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap>(INITIAL_ROADMAP);

  // UI Navigation & Layout
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [assessmentSubTab, setAssessmentSubTab] = useState<'aptitude' | 'coding'>('aptitude');
  const [isDeviceFrame, setIsDeviceFrame] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // 1. Listen to Firebase Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const initialProf = await initializeUserAccount(user);
          if (initialProf) {
            setProfile(initialProf);
          }
        } catch (err) {
          console.error('Error initializing user account in Firestore:', err);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Listeners for Signed-In User
  useEffect(() => {
    if (!currentUser) return;

    const unsubProfile = subscribeToUserProfile(currentUser.uid, (data) => {
      setProfile(data);
    });

    const unsubSkills = subscribeToSkills(currentUser.uid, (data) => {
      setSkills(data);
    });

    const unsubBadges = subscribeToBadges(currentUser.uid, (data) => {
      setBadges(data);
    });

    const unsubAptitude = subscribeToAptitudeResults(currentUser.uid, (data) => {
      setAptitudeResults(data);
    });

    const unsubCoding = subscribeToCodingSubmissions(currentUser.uid, (data) => {
      setCodingSubmissions(data);
    });

    const unsubRoadmap = subscribeToRoadmap(currentUser.uid, (data) => {
      setRoadmap(data);
    });

    return () => {
      unsubProfile();
      unsubSkills();
      unsubBadges();
      unsubAptitude();
      unsubCoding();
      unsubRoadmap();
    };
  }, [currentUser]);

  // 3. Dynamic Placement Readiness Score (Earned calculation)
  const readiness = useMemo(() => {
    return calculateReadinessScore(profile, skills, codingSubmissions, aptitudeResults);
  }, [profile, skills, codingSubmissions, aptitudeResults]);

  // 4. Genuine Badge Unlocking with Firestore Synchronization
  useEffect(() => {
    if (!currentUser) return;

    const today = new Date().toISOString().split('T')[0];

    badges.forEach((badge) => {
      let shouldUnlock = badge.unlocked;
      let newProgress = badge.progress;

      if (badge.id === 'b_01') {
        // First Code Blood: solve at least 1 problem
        const accepted = codingSubmissions.filter((s) => s.status === 'Accepted');
        if (accepted.length > 0) {
          newProgress = 1;
          if (!badge.unlocked) shouldUnlock = true;
        }
      } else if (badge.id === 'b_02') {
        // Aptitude Ace: score >= 80% on a test
        const hasAce = aptitudeResults.some((r) => r.scorePercentage >= 80);
        if (hasAce) {
          newProgress = 1;
          if (!badge.unlocked) shouldUnlock = true;
        }
      } else if (badge.id === 'b_04') {
        // 700 Club: cross 700 PRS
        newProgress = readiness.overallScore;
        if (readiness.overallScore >= 700 && !badge.unlocked) {
          shouldUnlock = true;
        }
      } else if (badge.id === 'b_05') {
        // Algorithm Artisan: solve 10 problems
        const acceptedCount = new Set(
          codingSubmissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId)
        ).size;
        newProgress = acceptedCount;
        if (acceptedCount >= 10 && !badge.unlocked) {
          shouldUnlock = true;
        }
      } else if (badge.id === 'b_06') {
        // Tier-1 Candidate: 850+ PRS
        newProgress = readiness.overallScore;
        if (readiness.overallScore >= 850 && !badge.unlocked) {
          shouldUnlock = true;
        }
      } else if (badge.id === 'b_07') {
        // Complete Profile Vanguard
        if (profile.college && profile.degree && profile.targetRole && profile.skills.length >= 3) {
          newProgress = 1;
          if (!badge.unlocked) shouldUnlock = true;
        }
      }

      if (shouldUnlock !== badge.unlocked || newProgress !== badge.progress) {
        saveBadgeToFirestore(currentUser.uid, {
          ...badge,
          unlocked: shouldUnlock,
          unlockedAt: shouldUnlock && !badge.unlocked ? today : badge.unlockedAt,
          progress: newProgress,
        });
      }
    });
  }, [codingSubmissions, aptitudeResults, readiness.overallScore, profile, currentUser, badges]);

  // Handlers for Assessments & Mutations
  const handleCompleteAptitude = async (result: AptitudeAssessmentResult) => {
    if (!currentUser) return;
    await saveAptitudeResultToFirestore(currentUser.uid, result);

    // Record live event for Admin Dashboard tracking
    recordLearnerActivity({
      userId: currentUser.uid,
      userName: profile.fullName || 'Learner',
      userEmail: profile.email || '',
      type: 'assessment',
      module: 'Assessments',
      scorePercentage: result.scorePercentage,
      pointsDelta: result.readinessPointsDelta,
      details: `Completed assessment: ${result.scorePercentage}% score (${result.correctAnswers}/${result.totalQuestions} correct)`,
      timestamp: new Date().toISOString(),
    });

    // Update verified aptitude skills in Firestore
    for (const skill of skills) {
      if (skill.category === 'Aptitude & Logic') {
        const updatedLevel = Math.min(100, Math.max(skill.level, Math.round(result.scorePercentage * 0.95)));
        await saveSkillToFirestore(currentUser.uid, {
          ...skill,
          level: updatedLevel,
          isVerified: true,
          lastAssessed: 'Today',
        });
      }
    }
  };

  const handleSubmitCoding = async (submission: CodingSubmission) => {
    if (!currentUser) return;
    await saveCodingSubmissionToFirestore(currentUser.uid, submission);

    // Record live event for Admin Dashboard tracking
    recordLearnerActivity({
      userId: currentUser.uid,
      userName: profile.fullName || 'Learner',
      userEmail: profile.email || '',
      type: 'coding',
      module: 'Coding & DSA',
      details: `Submitted code challenge: ${submission.status} (${submission.passedCount}/${submission.totalCount} tests passed)`,
      timestamp: new Date().toISOString(),
    });

    // If accepted, update DSA skill level in Firestore
    if (submission.status === 'Accepted') {
      for (const skill of skills) {
        if (skill.name.includes('Arrays') || skill.name.includes('Stack')) {
          const updatedLevel = Math.min(100, skill.level + 15);
          await saveSkillToFirestore(currentUser.uid, {
            ...skill,
            level: updatedLevel,
            isVerified: true,
            lastAssessed: 'Today',
          });
        }
      }
    }
  };

  const handleUpdateSkillLevel = async (skillId: string, newLevel: number) => {
    if (!currentUser) return;
    const targetSkill = skills.find((s) => s.id === skillId);
    if (targetSkill) {
      await saveSkillToFirestore(currentUser.uid, { ...targetSkill, level: newLevel });
    }
  };

  const handleUpdateProfile = async (updated: StudentProfile) => {
    if (!currentUser) return;
    await saveUserProfile(currentUser.uid, updated);
  };

  const handleToggleMilestone = async (phaseId: string, milestoneId: string) => {
    if (!currentUser) return;
    const updatedPhases = roadmap.phases.map((ph) => {
      if (ph.id === phaseId) {
        return {
          ...ph,
          milestones: ph.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      }
      return ph;
    });

    const updatedRoadmap = {
      ...roadmap,
      phases: updatedPhases,
    };
    await saveRoadmapToFirestore(currentUser.uid, updatedRoadmap);
  };

  const handleRegenerateRoadmap = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/ai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: profile,
          readinessScore: readiness.overallScore,
          weakAreas: readiness.weaknesses,
          strongAreas: readiness.strengths,
          targetRole: profile.targetRole,
        }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();

      const newRoadmap: PersonalizedRoadmap = {
        source: data.source || 'gemini',
        lastUpdated: 'Just now',
        overview: data.overview || INITIAL_ROADMAP.overview,
        strengths: data.strengths || readiness.strengths,
        focusGaps: data.focusGaps || readiness.weaknesses,
        phases: (data.phases || INITIAL_ROADMAP.phases).map((p: any, idx: number) => ({
          id: `ph_${idx + 1}`,
          phase: p.phase || `Phase ${idx + 1}`,
          goal: p.goal || 'Accelerate placement readiness',
          milestones: (p.milestones || []).map((m: any, mIdx: number) => ({
            id: `m_${idx}_${mIdx}`,
            title: typeof m === 'string' ? m : m.title,
            completed: false,
            estimatedHours: 4,
          })),
          recommendedTools: p.recommendedTools || ['Curated Pattern Drills'],
          completionScoreTarget: p.completionScoreTarget || '+40 pts',
        })),
      };

      await saveRoadmapToFirestore(currentUser.uid, newRoadmap);
    } catch (e) {
      console.warn('AI roadmap generation fallback active:', e);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Auth Loading View
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-xs text-slate-400 font-medium">Verifying Google Learner Session...</p>
      </div>
    );
  }

  // Google Authentication Gate: Strictly Google Sign-In for learners
  if (!currentUser) {
    return <GoogleAuthScreen onSignedIn={() => {}} />;
  }

  // Content switcher
  const renderCurrentView = () => {
    if (isAdminMode) {
      return (
        <AdminDashboardView
          isAdminAuthenticated={isAdminAuthenticated}
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('isAdminAuth', 'true');
            }
          }}
          onExitAdmin={() => setIsAdminMode(false)}
          onOpenCertificateModalForUser={(inspectProfile) => {
            setSelectedInspectionProfile(inspectProfile);
            setShowCertificateModal(true);
          }}
        />
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            profile={profile}
            readiness={readiness}
            badges={badges}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onStartAptitude={() => {
              setAssessmentSubTab('aptitude');
              setCurrentTab('assessments');
            }}
            onStartCoding={() => {
              setAssessmentSubTab('coding');
              setCurrentTab('assessments');
            }}
            onOpenCompanyModal={() => setShowCompanyModal(true)}
            onOpenCertificate={() => {
              setSelectedInspectionProfile(null);
              setShowCertificateModal(true);
            }}
          />
        );
      case 'assessments':
        return (
          <AssessmentsView
            questions={APTITUDE_QUESTION_BANK}
            codingProblems={CODING_PROBLEMS}
            submissions={codingSubmissions}
            onCompleteAptitude={handleCompleteAptitude}
            onSubmitCoding={handleSubmitCoding}
            defaultSubTab={assessmentSubTab}
          />
        );
      case 'skills':
        return (
          <SkillsTrackerView
            skills={skills}
            onUpdateSkillLevel={handleUpdateSkillLevel}
            onNavigateToAssessment={() => {
              setAssessmentSubTab('aptitude');
              setCurrentTab('assessments');
            }}
          />
        );
      case 'roadmap':
        return (
          <RoadmapView
            roadmap={roadmap}
            profile={profile}
            readinessScore={readiness.overallScore}
            onToggleMilestone={handleToggleMilestone}
            onRegenerateRoadmap={handleRegenerateRoadmap}
          />
        );
      case 'badges':
        return <BadgesView badges={badges} profile={profile} />;
      case 'profile':
        return (
          <ProfileView
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onSignOut={handleSignOut}
            onOpenAdmin={() => setIsAdminMode(true)}
          />
        );
      default:
        return null;
    }
  };

  const unlockedBadgeCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Fortune 500 Ambient Lighting Radial Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Device Frame Wrapper (Togglable for simulated smartphone or responsive view) */}
      <div
        className={`w-full mx-auto flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          isDeviceFrame
            ? 'max-w-[430px] my-4 md:my-6 rounded-[40px] border-[8px] border-slate-800 shadow-2xl shadow-blue-950/40 overflow-hidden relative min-h-[850px] bg-[#080d1e]'
            : isAdminMode
            ? 'max-w-5xl'
            : 'max-w-2xl'
        }`}
      >
        {/* Device Frame Notch (when in device frame mode) */}
        {isDeviceFrame && (
          <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto z-40 relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#050814] border border-slate-700" />
          </div>
        )}

        {/* Top Navbar */}
        <Navbar
          profile={profile}
          readinessScore={readiness.overallScore}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
          onOpenProfile={() => {
            setIsAdminMode(false);
            setCurrentTab('profile');
          }}
          onOpenCertificate={() => {
            setSelectedInspectionProfile(null);
            setShowCertificateModal(true);
          }}
          onOpenAdmin={() => setIsAdminMode(!isAdminMode)}
          isAdminAuthenticated={isAdminAuthenticated}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-4 overflow-y-auto">
          {renderCurrentView()}
        </main>

        {/* Mobile Ergonomic Bottom Navigation */}
        <BottomNav
          currentTab={isAdminMode ? ('none' as TabType) : currentTab}
          onChangeTab={(tab) => {
            setIsAdminMode(false);
            setCurrentTab(tab);
          }}
          unlockedBadgeCount={unlockedBadgeCount}
        />
      </div>

      {/* Company Cutoffs Intelligence Modal */}
      {showCompanyModal && (
        <CompanyIntelligenceModal
          currentScore={readiness.overallScore}
          onClose={() => setShowCompanyModal(false)}
          onTargetRoleClick={() => {
            setShowCompanyModal(false);
            setCurrentTab('profile');
          }}
        />
      )}

      {/* Official Placement Readiness Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          profile={selectedInspectionProfile || profile}
          readiness={readiness}
          onClose={() => {
            setShowCertificateModal(false);
            setSelectedInspectionProfile(null);
          }}
        />
      )}
    </div>
  );
}
