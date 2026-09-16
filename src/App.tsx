import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Info,
  ChevronRight,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SessionCard } from './components/SessionCard';
import { SessionDetailModal } from './components/SessionDetailModal';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { AppViewerModal } from './components/AppViewerModal';
import { TeacherGuideView } from './components/TeacherGuideView';
import { TeacherPasswordModal } from './components/TeacherPasswordModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { MasterCertificateModal } from './components/MasterCertificateModal';
import { MasterBadgeModal } from './components/MasterBadgeModal';
import { ReflectionModal } from './components/ReflectionModal';
import { CelebrationMasterBanner } from './components/CelebrationMasterBanner';
import { WeeklyActivityDashboard } from './components/WeeklyActivityDashboard';
import { CelebrationToast } from './components/CelebrationToast';
import { TeacherLinkEditModal } from './components/TeacherLinkEditModal';
import { StudentNoticeBanner } from './components/StudentNoticeBanner';
import { TeacherNoticeModal } from './components/TeacherNoticeModal';
import { useSessionConfetti } from './hooks/useSessionConfetti';
import { CURRICULUM_SESSIONS, DEFAULT_SESSION_URLS } from './data/curriculumData';
import { DEFAULT_TEACHER_NOTICES } from './data/noticeData';
import { StudentProfile, SessionProgress, SessionData, ReflectionEntry, TeacherNotice } from './types';
import {
  getUnwrittenReflectionSessions,
  sendReflectionReminderNotification,
} from './utils/notificationUtils';

const STORAGE_KEYS = {
  STUDENT: 'ai_literacy_student_profile',
  PROGRESS: 'ai_literacy_sessions_progress',
  CUSTOM_URLS: 'ai_literacy_custom_session_urls',
  NOTICES: 'ai_literacy_teacher_notices',
};

const DEFAULT_STUDENT: StudentProfile = {
  schoolName: '우리중학교',
  grade: '2학년',
  classNum: '3반',
  studentNo: '15번',
  name: '탐사대원',
  avatarEmoji: '🧑‍🚀',
};

const DEFAULT_PROGRESS: SessionProgress = {
  session1: false,
  session2: false,
  session3: false,
  reflections: {},
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'student' | 'teacher'>('student');

  // Student Profile state
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT);
      if (!saved) return DEFAULT_STUDENT;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_STUDENT, ...parsed };
      }
      return DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  });

  // Session Progress state
  const [progress, setProgress] = useState<SessionProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (!saved) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          reflections: parsed.reflections && typeof parsed.reflections === 'object' ? parsed.reflections : {},
        };
      }
      return DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  // Custom Session URLs for 1, 2, 3 차시 (Teacher editable with persistence)
  const [customUrls, setCustomUrls] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_URLS);
      if (!saved) return DEFAULT_SESSION_URLS;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const merged = { ...DEFAULT_SESSION_URLS, ...parsed };
        if (merged[3] === '/truth-explorer.html') {
          merged[3] = './truth-explorer.html';
          localStorage.setItem(STORAGE_KEYS.CUSTOM_URLS, JSON.stringify(merged));
        }
        return merged;
      }
      return DEFAULT_SESSION_URLS;
    } catch {
      return DEFAULT_SESSION_URLS;
    }
  });

  // Dynamically mapped sessions with custom URLs applied
  const sessions: SessionData[] = React.useMemo(() => {
    return CURRICULUM_SESSIONS.map((session) => {
      const customUrl = customUrls?.[session.id];
      if (typeof customUrl === 'string' && customUrl.trim() !== '') {
        return {
          ...session,
          appUrl: customUrl,
          isInternalApp: customUrl.startsWith('/') || customUrl.startsWith('./') || customUrl.includes('truth-explorer'),
        };
      }
      return session;
    });
  }, [customUrls]);

  // Modal states
  const [selectedSessionForSummary, setSelectedSessionForSummary] = useState<SessionData | null>(null);
  const [selectedSessionForGuide, setSelectedSessionForGuide] = useState<SessionData | null>(null);
  const [activeAppViewerSession, setActiveAppViewerSession] = useState<SessionData | null>(null);
  const [selectedSessionForReflection, setSelectedSessionForReflection] = useState<SessionData | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  // Teacher link editor modal state
  const [isLinkEditModalOpen, setIsLinkEditModalOpen] = useState(false);
  const [targetLinkEditSessionId, setTargetLinkEditSessionId] = useState<number | null>(null);

  // Teacher notices state (real-time synchronized with persistence)
  const [notices, setNotices] = useState<TeacherNotice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      if (!saved) return DEFAULT_TEACHER_NOTICES;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((n, idx) => ({
          id: n?.id || `notice-${idx}`,
          title: n?.title || '수업 공지',
          content: n?.content || '',
          category: n?.category || 'general',
          targetClass: n?.targetClass || '전체',
          author: n?.author || '정보 교사',
          isActive: n?.isActive ?? true,
          isPinned: Boolean(n?.isPinned),
          createdAt: n?.createdAt || new Date().toISOString(),
          updatedAt: n?.updatedAt || new Date().toISOString(),
        }));
      }
      return DEFAULT_TEACHER_NOTICES;
    } catch {
      return DEFAULT_TEACHER_NOTICES;
    }
  });
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [targetNoticeEditId, setTargetNoticeEditId] = useState<string | null>(null);

  const [pendingTeacherAction, setPendingTeacherAction] = useState<
    | { type: 'open_tab' }
    | { type: 'edit_link'; sessionId?: number }
    | { type: 'manage_notice'; noticeId?: string }
    | null
  >(null);

  // Confetti celebration hook
  const { fireSessionConfetti, fireGrandCelebration, activeToast, dismissToast } = useSessionConfetti(progress);

  // Teacher authentication state
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ai_literacy_teacher_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isTeacherPasswordModalOpen, setIsTeacherPasswordModalOpen] = useState(false);

  const handleTeacherAuthSuccess = () => {
    setIsTeacherAuthenticated(true);
    try {
      sessionStorage.setItem('ai_literacy_teacher_auth', 'true');
    } catch {}
    setIsTeacherPasswordModalOpen(false);

    if (pendingTeacherAction?.type === 'edit_link') {
      const targetId = pendingTeacherAction.sessionId ?? null;
      setPendingTeacherAction(null);
      setTargetLinkEditSessionId(targetId);
      setIsLinkEditModalOpen(true);
    } else if (pendingTeacherAction?.type === 'manage_notice') {
      const noticeId = pendingTeacherAction.noticeId ?? null;
      setPendingTeacherAction(null);
      setTargetNoticeEditId(noticeId);
      setIsNoticeModalOpen(true);
    } else {
      setPendingTeacherAction(null);
      setCurrentTab('teacher');
    }
  };

  const handleOpenLinkEditor = (sessionId?: number) => {
    if (!isTeacherAuthenticated) {
      setPendingTeacherAction({ type: 'edit_link', sessionId });
      setIsTeacherPasswordModalOpen(true);
      return;
    }
    setTargetLinkEditSessionId(sessionId ?? null);
    setIsLinkEditModalOpen(true);
  };

  const handleOpenNoticeManager = (noticeId?: string) => {
    if (!isTeacherAuthenticated) {
      setPendingTeacherAction({ type: 'manage_notice', noticeId });
      setIsTeacherPasswordModalOpen(true);
      return;
    }
    setTargetNoticeEditId(noticeId || null);
    setIsNoticeModalOpen(true);
  };

  const handleSaveNotices = (updated: TeacherNotice[]) => {
    setNotices(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist teacher notices:', e);
    }
  };

  const handleResetNotices = () => {
    setNotices(DEFAULT_TEACHER_NOTICES);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(DEFAULT_TEACHER_NOTICES));
    } catch (e) {
      console.error('Failed to reset teacher notices:', e);
    }
  };

  const handleSaveCustomUrls = (updated: Record<number, string>) => {
    setCustomUrls(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_URLS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist custom session URLs:', e);
    }
  };

  const handleResetAllUrls = () => {
    setCustomUrls(DEFAULT_SESSION_URLS);
    try {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_URLS);
    } catch (e) {
      console.error('Failed to clear custom session URLs:', e);
    }
  };

  const handleLockTeacher = () => {
    setIsTeacherAuthenticated(false);
    try {
      sessionStorage.removeItem('ai_literacy_teacher_auth');
    } catch {}
    setCurrentTab('student');
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
    } catch (e) {
      console.error(e);
    }
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error(e);
    }
  }, [progress]);

  // Master completion status calculation
  const safeProgress = progress || { session1: false, session2: false, session3: false, reflections: {} };
  const completedCount = [safeProgress.session1, safeProgress.session2, safeProgress.session3].filter(Boolean).length;
  const reflectionsCount = [1, 2, 3].filter((id) => {
    const r = safeProgress.reflections?.[id];
    return Boolean(typeof r === 'string' ? r : r?.learned || r?.felt || r?.pledge);
  }).length;
  const isMasterUnlocked = completedCount === 3 && reflectionsCount === 3;

  // Auto celebratory badge issuance when both all sessions and reflections are completed for the first time
  useEffect(() => {
    if (isMasterUnlocked && !safeProgress.badgeEarned) {
      fireGrandCelebration();
      const serial = `AIM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const issuedAt = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setProgress((prev) => ({
        ...prev,
        badgeEarned: true,
        badgeSerial: prev?.badgeSerial || serial,
        badgeIssuedAt: prev?.badgeIssuedAt || issuedAt,
      }));
      const timer = setTimeout(() => {
        setIsBadgeModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isMasterUnlocked, safeProgress.badgeEarned]);

  // Reflection reminder check when notifications enabled
  useEffect(() => {
    if (!student?.remindNotificationsEnabled) return;
    const unwritten = getUnwrittenReflectionSessions(progress);
    if (unwritten.length > 0) {
      // Gentle reminder on session status updates
      const timer = setTimeout(() => {
        sendReflectionReminderNotification(student?.name || '대원', unwritten);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [student?.remindNotificationsEnabled, progress?.session1, progress?.session2, progress?.session3]);

  // Toggle completion
  const handleToggleComplete = (sessionId: number) => {
    setProgress((prev) => {
      const key = `session${sessionId}` as 'session1' | 'session2' | 'session3';
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  // Save reflection
  const handleSaveReflection = (sessionId: number, entry: ReflectionEntry, autoComplete: boolean) => {
    setProgress((prev) => {
      const sessionKey = `session${sessionId}` as 'session1' | 'session2' | 'session3';
      return {
        ...prev,
        [sessionKey]: autoComplete ? true : prev[sessionKey],
        reflections: {
          ...prev.reflections,
          [sessionId]: entry,
        },
      };
    });
  };

  // Delete reflection
  const handleDeleteReflection = (sessionId: number) => {
    setProgress((prev) => {
      const updatedReflections = { ...prev.reflections };
      delete updatedReflections[sessionId];
      return {
        ...prev,
        reflections: updatedReflections,
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'teacher' && !isTeacherAuthenticated) {
            setPendingTeacherAction({ type: 'open_tab' });
            setIsTeacherPasswordModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        student={student}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        progress={progress}
        onOpenCertificate={() => setIsCertificateModalOpen(true)}
        onOpenBadge={() => setIsBadgeModalOpen(true)}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onRequestTeacherAuth={() => {
          setPendingTeacherAction({ type: 'open_tab' });
          setIsTeacherPasswordModalOpen(true);
        }}
        onOpenLinkEditModal={() => handleOpenLinkEditor()}
        onOpenNoticeModal={() => handleOpenNoticeManager()}
      />

      {/* Main Content */}
      <main>
        {currentTab === 'student' ? (
          <div>
            {/* Real-time Teacher Announcement Banner at the very top of Student Dashboard */}
            <StudentNoticeBanner
              notices={notices}
              student={student}
              isTeacherAuthenticated={isTeacherAuthenticated}
              onOpenNoticeManager={handleOpenNoticeManager}
            />

            {/* Hero Banner with Status Tracker */}
            <HeroSection
              student={student}
              progress={progress}
              onSelectSession={(id) => {
                const found = sessions.find((s) => s.id === id);
                if (found) setSelectedSessionForGuide(found);
              }}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenBadge={() => setIsBadgeModalOpen(true)}
            />

            {/* 3 Curriculum Sessions Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
              {/* Celebration Master Banner (unlocked when 3 sessions + 3 reflections completed) */}
              <CelebrationMasterBanner
                progress={progress}
                student={student}
                onOpenBadge={() => setIsBadgeModalOpen(true)}
                onOpenCertificate={() => setIsCertificateModalOpen(true)}
                onSelectSessionForReflection={(sessId) => {
                  const s = sessions.find((item) => item.id === sessId);
                  if (s) setSelectedSessionForReflection(s);
                }}
              />

              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>3차시 커리큘럼 로드맵</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    학습할 프로젝트를 선택하세요
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    1차시부터 3차시까지 순서대로 진행하거나, 수업 일정에 맞추어 원하는 프로젝트를 실행할 수 있습니다.
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    총 3개 중 <strong className="text-white font-bold">{completedCount}개</strong> 완료
                  </span>
                </div>
              </div>

              {/* 3 Session Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {sessions.map((session) => {
                  const isComp =
                    session.id === 1
                      ? progress.session1
                      : session.id === 2
                      ? progress.session2
                      : progress.session3;

                  return (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isCompleted={isComp}
                      hasReflection={Boolean(progress?.reflections?.[session.id])}
                      onToggleComplete={() => handleToggleComplete(session.id)}
                      onOpenGuide={() => setSelectedSessionForGuide(session)}
                      onOpenSummary={() => setSelectedSessionForSummary(session)}
                      onLaunchInApp={() => setActiveAppViewerSession(session)}
                      onOpenReflection={() => setSelectedSessionForReflection(session)}
                      onEditLink={() => handleOpenLinkEditor(session.id)}
                      isTeacherMode={isTeacherAuthenticated}
                    />
                  );
                })}
              </div>

              {/* Weekly Activity & Study Time Dashboard (학습할 프로젝트 선택 아래로 이동) */}
              <div className="mt-12 sm:mt-14">
                <WeeklyActivityDashboard
                  progress={progress}
                  student={student}
                />
              </div>

              {/* Student Study Tips & Learning Helper */}
              <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase mb-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>탐사대원을 위한 학습 꿀팁</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    더 깊이 있는 탐구를 완성하는 3가지 습관
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    1. 의심스러운 뉴스나 영상은 최소 2곳 이상의 신뢰할 수 있는 기관에서 교차 검증하세요.<br />
                    2. 4컷 만화 제작 시 기승전결 플롯을 활용하여 청중의 공감을 이끌어내세요.<br />
                    3. 3차시 진실 탐사대 게임 종료 후 반드시 성찰일기를 작성하여 나만의 다짐을 남기세요.
                  </p>
                </div>

                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/10 hover:brightness-110 transition shrink-0"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>종합 수료증 확인하기</span>
                </button>
              </div>
            </div>
          </div>
        ) : isTeacherAuthenticated ? (
          /* Teacher Guide / Curriculum Roadmap Tab (인증 성공 시) */
          <TeacherGuideView
            sessions={sessions}
            customUrls={customUrls}
            onUpdateUrls={handleSaveCustomUrls}
            onResetAllUrls={handleResetAllUrls}
            onOpenLinkEditModal={(id) => handleOpenLinkEditor(id)}
            onOpenNoticeModal={() => handleOpenNoticeManager()}
            noticeCount={notices.length}
            onBackToStudent={() => setCurrentTab('student')}
            onLock={handleLockTeacher}
            progress={progress}
            student={student}
          />
        ) : (
          /* 미인증 상태에서 지도안 탭 진입 시 잠금 안내 화면 */
          <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                교사용 수업 지도안은 잠겨있습니다
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                교수·학습 과정안 및 평가 루브릭을 확인하려면 비밀번호를 입력해주세요.
              </p>
            </div>
            <button
              onClick={() => {
                setPendingTeacherAction({ type: 'open_tab' });
                setIsTeacherPasswordModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-xs font-bold text-white transition shadow-lg shadow-indigo-500/25"
            >
              비밀번호 입력하고 잠금 해제
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">중학교 AI 리터러시 3차시 학습 포털</span>
            <span>·</span>
            <span>디지털 시민성 & 윤리 탐구</span>
          </div>
          <div className="text-slate-500">
            1차시 탐구 · 2차시 만화 스토리보드 · 3차시 진실 탐사대
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedSessionForSummary && (
        <SessionSummaryModal
          session={selectedSessionForSummary}
          onClose={() => setSelectedSessionForSummary(null)}
          onOpenDetailedGuide={() => {
            setSelectedSessionForGuide(selectedSessionForSummary);
          }}
        />
      )}

      {selectedSessionForGuide && (
        <SessionDetailModal
          session={selectedSessionForGuide}
          onClose={() => setSelectedSessionForGuide(null)}
          onLaunch={(sess) => setActiveAppViewerSession(sess)}
          isCompleted={
            selectedSessionForGuide.id === 1
              ? progress.session1
              : selectedSessionForGuide.id === 2
              ? progress.session2
              : progress.session3
          }
          onToggleComplete={() => handleToggleComplete(selectedSessionForGuide.id)}
          onEditLink={(id) => handleOpenLinkEditor(id)}
        />
      )}

      {activeAppViewerSession && (
        <AppViewerModal
          session={activeAppViewerSession}
          onClose={() => setActiveAppViewerSession(null)}
        />
      )}

      {isProfileModalOpen && (
        <StudentProfileModal
          currentProfile={student}
          progress={progress}
          onSave={setStudent}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isCertificateModalOpen && (
        <MasterCertificateModal
          student={student}
          progress={progress}
          onClose={() => setIsCertificateModalOpen(false)}
          onOpenBadge={() => setIsBadgeModalOpen(true)}
        />
      )}

      {isBadgeModalOpen && (
        <MasterBadgeModal
          student={student}
          progress={progress}
          onClose={() => setIsBadgeModalOpen(false)}
          onOpenCertificate={() => setIsCertificateModalOpen(true)}
        />
      )}

      {selectedSessionForReflection && (
        <ReflectionModal
          session={selectedSessionForReflection}
          student={student}
          initialReflection={progress?.reflections?.[selectedSessionForReflection.id]}
          allReflections={progress?.reflections || {}}
          isCompleted={
            selectedSessionForReflection.id === 1
              ? progress.session1
              : selectedSessionForReflection.id === 2
              ? progress.session2
              : progress.session3
          }
          onSave={handleSaveReflection}
          onDelete={handleDeleteReflection}
          onSelectSession={(sess) => setSelectedSessionForReflection(sess)}
          onClose={() => setSelectedSessionForReflection(null)}
        />
      )}

      {isTeacherPasswordModalOpen && (
        <TeacherPasswordModal
          isOpen={isTeacherPasswordModalOpen}
          onClose={() => {
            setIsTeacherPasswordModalOpen(false);
            setPendingTeacherAction(null);
          }}
          onSuccess={handleTeacherAuthSuccess}
        />
      )}

      {/* Teacher Link Edit Modal */}
      {isLinkEditModalOpen && (
        <TeacherLinkEditModal
          isOpen={isLinkEditModalOpen}
          onClose={() => {
            setIsLinkEditModalOpen(false);
            setTargetLinkEditSessionId(null);
          }}
          sessions={sessions}
          customUrls={customUrls}
          onSaveUrls={handleSaveCustomUrls}
          onResetAllUrls={handleResetAllUrls}
          targetSessionId={targetLinkEditSessionId}
        />
      )}

      {/* Teacher Real-time Notice Management Modal */}
      {isNoticeModalOpen && (
        <TeacherNoticeModal
          isOpen={isNoticeModalOpen}
          onClose={() => {
            setIsNoticeModalOpen(false);
            setTargetNoticeEditId(null);
          }}
          notices={notices}
          initialEditingNoticeId={targetNoticeEditId}
          onSaveNotices={handleSaveNotices}
          onResetNotices={handleResetNotices}
        />
      )}

      {/* Confetti celebration toast notification */}
      <CelebrationToast toast={activeToast} onDismiss={dismissToast} />
    </div>
  );
}
