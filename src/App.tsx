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

import {
  StudentProfile,
  SkillItem,
  CodingSubmission,
  AptitudeAssessmentResult,
  Badge,
  PersonalizedRoadmap,
} from './types';

import {
  INITIAL_STUDENT_PROFILE,
  SAMPLE_PERSONAS,
  APTITUDE_QUESTION_BANK,
  CODING_PROBLEMS,
  INITIAL_SKILLS,
  INITIAL_BADGES,
  INITIAL_ROADMAP,
} from './data/initialData';

import { calculateReadinessScore } from './utils/scoreCalculator';

const STORAGE_KEY_PREFIX = 'placement_iq_v1_';

export default function App() {
  // 1. Persistent State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}skills`);
      return saved ? JSON.parse(saved) : INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  });

  const [codingSubmissions, setCodingSubmissions] = useState<CodingSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}submissions`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [aptitudeResults, setAptitudeResults] = useState<AptitudeAssessmentResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}aptitude`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}badges`);
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}roadmap`);
      return saved ? JSON.parse(saved) : INITIAL_ROADMAP;
    } catch {
      return INITIAL_ROADMAP;
    }
  });

  // 2. UI Navigation & Frame State
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [assessmentSubTab, setAssessmentSubTab] = useState<'aptitude' | 'coding'>('aptitude');
  const [isDeviceFrame, setIsDeviceFrame] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(profile));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}skills`, JSON.stringify(skills));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}submissions`, JSON.stringify(codingSubmissions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}aptitude`, JSON.stringify(aptitudeResults));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}badges`, JSON.stringify(badges));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}roadmap`, JSON.stringify(roadmap));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [profile, skills, codingSubmissions, aptitudeResults, badges, roadmap]);

  // Dynamic Placement Readiness Score
  const readiness = useMemo(() => {
    return calculateReadinessScore(profile, skills, codingSubmissions, aptitudeResults);
  }, [profile, skills, codingSubmissions, aptitudeResults]);

  // Check and unlock badges automatically based on accomplishments
  useEffect(() => {
    setBadges((prevBadges) => {
      let changed = false;
      const today = new Date().toISOString().split('T')[0];

      const updated = prevBadges.map((badge) => {
        let isNowUnlocked = badge.unlocked;
        let progress = badge.progress;

        if (badge.id === 'b_01') {
          // First Code Blood
          const accepted = codingSubmissions.filter((s) => s.status === 'Accepted');
          if (accepted.length > 0 && !badge.unlocked) {
            isNowUnlocked = true;
            progress = 1;
            changed = true;
          }
        } else if (badge.id === 'b_02') {
          // Aptitude Ace
          const hasAce = aptitudeResults.some((r) => r.scorePercentage >= 80);
          if (hasAce && !badge.unlocked) {
            isNowUnlocked = true;
            progress = 1;
            changed = true;
          }
        } else if (badge.id === 'b_04') {
          // 700 Club
          progress = readiness.overallScore;
          if (readiness.overallScore >= 700 && !badge.unlocked) {
            isNowUnlocked = true;
            changed = true;
          }
        } else if (badge.id === 'b_05') {
          // Algorithm Artisan
          const acceptedCount = new Set(
            codingSubmissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId)
          ).size;
          progress = acceptedCount;
          if (acceptedCount >= 10 && !badge.unlocked) {
            isNowUnlocked = true;
            changed = true;
          }
        } else if (badge.id === 'b_06') {
          // Tier-1 Candidate (850+)
          progress = readiness.overallScore;
          if (readiness.overallScore >= 850 && !badge.unlocked) {
            isNowUnlocked = true;
            changed = true;
          }
        } else if (badge.id === 'b_07') {
          // Complete Profile Vanguard
          if (profile.githubUrl && profile.linkedinUrl && profile.skills.length >= 5 && !badge.unlocked) {
            isNowUnlocked = true;
            progress = 1;
            changed = true;
          }
        }

        if (isNowUnlocked !== badge.unlocked || progress !== badge.progress) {
          return {
            ...badge,
            unlocked: isNowUnlocked,
            unlockedAt: isNowUnlocked && !badge.unlocked ? today : badge.unlockedAt,
            progress,
          };
        }
        return badge;
      });

      return changed ? updated : prevBadges;
    });
  }, [codingSubmissions, aptitudeResults, readiness.overallScore, profile]);

  // Handlers
  const handleCompleteAptitude = (result: AptitudeAssessmentResult) => {
    setAptitudeResults((prev) => [result, ...prev]);

    // Boost verified aptitude skills
    setSkills((prev) =>
      prev.map((s) => {
        if (s.category === 'Aptitude & Logic') {
          return {
            ...s,
            level: Math.min(100, Math.max(s.level, Math.round(result.scorePercentage * 0.95))),
            isVerified: true,
            lastAssessed: 'Today',
          };
        }
        return s;
      })
    );
  };

  const handleSubmitCoding = (submission: CodingSubmission) => {
    setCodingSubmissions((prev) => [submission, ...prev]);

    // If accepted, update DSA skill
    if (submission.status === 'Accepted') {
      setSkills((prev) =>
        prev.map((s) => {
          if (s.name.includes('Arrays') || s.name.includes('Stack')) {
            return {
              ...s,
              level: Math.min(100, s.level + 4),
              isVerified: true,
              lastAssessed: 'Today',
            };
          }
          return s;
        })
      );
    }
  };

  const handleUpdateSkillLevel = (skillId: string, newLevel: number) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, level: newLevel } : s))
    );
  };

  const handleToggleMilestone = (phaseId: string, milestoneId: string) => {
    setRoadmap((prev) => ({
      ...prev,
      phases: prev.phases.map((ph) => {
        if (ph.id === phaseId) {
          return {
            ...ph,
            milestones: ph.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            ),
          };
        }
        return ph;
      }),
    }));
  };

  const handleRegenerateRoadmap = async () => {
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

      setRoadmap({
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
      });
    } catch (e) {
      console.warn('AI roadmap generation fallback active:', e);
    }
  };

  const handleSwitchPersona = (key: string) => {
    const selected = SAMPLE_PERSONAS[key];
    if (selected) {
      setProfile(selected);
    }
  };

  // Content switcher
  const renderCurrentView = () => {
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
            onUpdateProfile={setProfile}
            onSwitchPersona={handleSwitchPersona}
          />
        );
      default:
        return null;
    }
  };

  const unlockedBadgeCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Device Frame Wrapper (Togglable for simulated smartphone or responsive view) */}
      <div
        className={`w-full mx-auto flex-1 flex flex-col transition-all duration-300 ${
          isDeviceFrame
            ? 'max-w-[430px] my-4 md:my-6 rounded-[40px] border-[8px] border-slate-800 shadow-2xl shadow-indigo-950/50 overflow-hidden relative min-h-[850px] bg-slate-950'
            : 'max-w-2xl'
        }`}
      >
        {/* Device Frame Notch (when in device frame mode) */}
        {isDeviceFrame && (
          <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto z-40 relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
          </div>
        )}

        {/* Top Navbar */}
        <Navbar
          profile={profile}
          readinessScore={readiness.overallScore}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
          onOpenProfile={() => setCurrentTab('profile')}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-4 overflow-y-auto">
          {renderCurrentView()}
        </main>

        {/* Mobile Ergonomic Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={(tab) => setCurrentTab(tab)}
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
    </div>
  );
}
