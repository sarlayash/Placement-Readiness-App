import {
  db,
  doc,
  collection,
  setDoc,
  updateDoc,
  onSnapshot,
  getDocFromServer,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  StudentProfile,
  SkillItem,
  Badge,
  CodingSubmission,
  AptitudeAssessmentResult,
  PersonalizedRoadmap,
} from '../types';
import {
  INITIAL_SKILLS,
  INITIAL_BADGES,
  INITIAL_ROADMAP,
  createDefaultProfile,
} from '../data/initialData';
import { User } from 'firebase/auth';

/**
 * Initializes a new student profile in Firestore if it doesn't already exist.
 */
export async function initializeUserAccount(user: User): Promise<StudentProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDocFromServer(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: user.uid,
        fullName: data.fullName || user.displayName || 'Learner',
        email: data.email || user.email || '',
        college: data.college || '',
        degree: data.degree || '',
        branch: data.branch || '',
        graduationYear: data.graduationYear || new Date().getFullYear() + 1,
        cgpa: data.cgpa || 0,
        targetRole: data.targetRole || 'Software Development Engineer',
        targetCompanyTier: data.targetCompanyTier || 'Tier-1 Big Tech (Google, Microsoft, Amazon)',
        githubUrl: data.githubUrl || '',
        linkedinUrl: data.linkedinUrl || '',
        resumeHeadline: data.resumeHeadline || '',
        skills: data.skills || [],
        streakDays: data.streakDays || 1,
        avatarSeed: data.avatarSeed || user.displayName || 'Learner',
        photoURL: data.photoURL || user.photoURL || undefined,
      };
    }

    // Create fresh initial profile from Google account
    const freshProfile = createDefaultProfile({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });

    await setDoc(userRef, {
      ...freshProfile,
      uid: user.uid,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Seed initial syllabus skills (all level: 0, isVerified: false)
    for (const skill of INITIAL_SKILLS) {
      const skillRef = doc(db, 'users', user.uid, 'skills', skill.id);
      await setDoc(skillRef, { ...skill, userId: user.uid });
    }

    // Seed initial badges (all locked, progress: 0)
    for (const badge of INITIAL_BADGES) {
      const badgeRef = doc(db, 'users', user.uid, 'badges', badge.id);
      await setDoc(badgeRef, { ...badge, userId: user.uid });
    }

    // Seed initial roadmap
    const roadmapRef = doc(db, 'users', user.uid, 'roadmap', 'current');
    await setDoc(roadmapRef, { ...INITIAL_ROADMAP, userId: user.uid });

    return freshProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

/**
 * Subscribes to real-time updates for a student's profile.
 */
export function subscribeToUserProfile(
  userId: string,
  onData: (profile: StudentProfile) => void
) {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onData({
          id: userId,
          fullName: data.fullName || 'Learner',
          email: data.email || '',
          college: data.college || '',
          degree: data.degree || '',
          branch: data.branch || '',
          graduationYear: data.graduationYear || new Date().getFullYear() + 1,
          cgpa: data.cgpa || 0,
          targetRole: data.targetRole || 'Software Development Engineer',
          targetCompanyTier: data.targetCompanyTier || 'Tier-1 Big Tech (Google, Microsoft, Amazon)',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          resumeHeadline: data.resumeHeadline || '',
          skills: data.skills || [],
          streakDays: data.streakDays || 1,
          avatarSeed: data.avatarSeed || 'Learner',
          photoURL: data.photoURL,
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    }
  );
}

/**
 * Saves profile updates to Firestore.
 */
export async function saveUserProfile(userId: string, profile: Partial<StudentProfile>) {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      ...profile,
      userId,
      uid: userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
}

/**
 * Subscribes to the user's skills subcollection.
 */
export function subscribeToSkills(
  userId: string,
  onData: (skills: SkillItem[]) => void
) {
  const skillsCol = collection(db, 'users', userId, 'skills');
  return onSnapshot(
    skillsCol,
    (snapshot) => {
      const skillsList: SkillItem[] = [];
      snapshot.forEach((docSnap) => {
        skillsList.push(docSnap.data() as SkillItem);
      });
      if (skillsList.length > 0) {
        onData(skillsList);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/skills`);
    }
  );
}

/**
 * Updates a specific skill in Firestore.
 */
export async function saveSkillToFirestore(userId: string, skill: SkillItem) {
  const skillRef = doc(db, 'users', userId, 'skills', skill.id);
  try {
    await setDoc(skillRef, { ...skill, userId }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/skills/${skill.id}`);
  }
}

/**
 * Subscribes to the user's badges subcollection.
 */
export function subscribeToBadges(
  userId: string,
  onData: (badges: Badge[]) => void
) {
  const badgesCol = collection(db, 'users', userId, 'badges');
  return onSnapshot(
    badgesCol,
    (snapshot) => {
      const badgesList: Badge[] = [];
      snapshot.forEach((docSnap) => {
        badgesList.push(docSnap.data() as Badge);
      });
      if (badgesList.length > 0) {
        onData(badgesList);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/badges`);
    }
  );
}

/**
 * Updates an unlocked badge in Firestore.
 */
export async function saveBadgeToFirestore(userId: string, badge: Badge) {
  const badgeRef = doc(db, 'users', userId, 'badges', badge.id);
  try {
    await setDoc(badgeRef, { ...badge, userId }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/badges/${badge.id}`);
  }
}

/**
 * Subscribes to the user's aptitude test results subcollection.
 */
export function subscribeToAptitudeResults(
  userId: string,
  onData: (results: AptitudeAssessmentResult[]) => void
) {
  const aptCol = collection(db, 'users', userId, 'aptitudeResults');
  return onSnapshot(
    aptCol,
    (snapshot) => {
      const list: AptitudeAssessmentResult[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as AptitudeAssessmentResult);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/aptitudeResults`);
    }
  );
}

/**
 * Saves a new aptitude result to Firestore.
 */
export async function saveAptitudeResultToFirestore(
  userId: string,
  result: AptitudeAssessmentResult
) {
  const resultRef = doc(db, 'users', userId, 'aptitudeResults', result.id);
  try {
    await setDoc(resultRef, { ...result, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${userId}/aptitudeResults/${result.id}`);
  }
}

/**
 * Subscribes to coding submissions subcollection.
 */
export function subscribeToCodingSubmissions(
  userId: string,
  onData: (submissions: CodingSubmission[]) => void
) {
  const subsCol = collection(db, 'users', userId, 'codingSubmissions');
  return onSnapshot(
    subsCol,
    (snapshot) => {
      const list: CodingSubmission[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as CodingSubmission);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userId}/codingSubmissions`);
    }
  );
}

/**
 * Saves a coding challenge submission to Firestore.
 */
export async function saveCodingSubmissionToFirestore(
  userId: string,
  submission: CodingSubmission
) {
  const subId = submission.id || `sub_${Date.now()}_${submission.problemId}`;
  const subRef = doc(db, 'users', userId, 'codingSubmissions', subId);
  try {
    await setDoc(subRef, { ...submission, id: subId, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${userId}/codingSubmissions/${subId}`);
  }
}

/**
 * Subscribes to the personalized roadmap.
 */
export function subscribeToRoadmap(
  userId: string,
  onData: (roadmap: PersonalizedRoadmap) => void
) {
  const roadmapRef = doc(db, 'users', userId, 'roadmap', 'current');
  return onSnapshot(
    roadmapRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onData({
          source: data.source || 'gemini',
          lastUpdated: data.lastUpdated || 'Current',
          overview: data.overview || '',
          strengths: data.strengths || [],
          focusGaps: data.focusGaps || [],
          phases: data.phases || [],
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${userId}/roadmap/current`);
    }
  );
}

/**
 * Saves the roadmap to Firestore.
 */
export async function saveRoadmapToFirestore(
  userId: string,
  roadmap: PersonalizedRoadmap
) {
  const roadmapRef = doc(db, 'users', userId, 'roadmap', 'current');
  try {
    await setDoc(roadmapRef, { ...roadmap, userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/roadmap/current`);
  }
}
