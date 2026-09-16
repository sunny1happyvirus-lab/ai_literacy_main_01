import React from 'react';
import {
  Sparkles,
  GraduationCap,
  Award,
  BookOpen,
  UserCircle2,
  CheckCircle2,
  Shield,
  Lock,
  Unlock,
  Link2,
  Bell,
} from 'lucide-react';
import { StudentProfile, SessionProgress } from '../types';

interface NavbarProps {
  currentTab: 'student' | 'teacher';
  onTabChange: (tab: 'student' | 'teacher') => void;
  student: StudentProfile;
  onOpenProfile: () => void;
  progress: SessionProgress;
  onOpenCertificate: () => void;
  onOpenBadge: () => void;
  isTeacherAuthenticated?: boolean;
  onRequestTeacherAuth?: () => void;
  onOpenLinkEditModal?: () => void;
  onOpenNoticeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  student,
  onOpenProfile,
  progress,
  onOpenCertificate,
  onOpenBadge,
  isTeacherAuthenticated = false,
  onRequestTeacherAuth,
  onOpenLinkEditModal,
  onOpenNoticeModal,
}) => {
  const safeProgress = progress || { session1: false, session2: false, session3: false, reflections: {} };
  const completedCount = [safeProgress.session1, safeProgress.session2, safeProgress.session3].filter(Boolean).length;
  const isAllComplete = completedCount === 3;
  const reflectionsCount = [1, 2, 3].filter((id) => Boolean(safeProgress.reflections?.[id])).length;
  const isMasterBadgeReady = isAllComplete && reflectionsCount === 3;

  const handleTeacherClick = () => {
    if (isTeacherAuthenticated) {
      onTabChange('teacher');
    } else {
      onRequestTeacherAuth?.();
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => onTabChange('student')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                  중학교 AI 리터러시
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">3차시 완성 프로젝트</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 truncate tracking-tight">
                AI 윤리 & 진실 탐구 허브
              </h1>
            </div>
          </div>

          {/* Center Tabs: Student Learning ↔ Teacher Guide */}
          <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onTabChange('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'student'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>학생 학습 홈</span>
              <span className="ml-1 text-[11px] bg-black/25 px-1.5 py-0.5 rounded-full font-mono">
                {completedCount}/3
              </span>
            </button>
            <button
              onClick={handleTeacherClick}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'teacher'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={isTeacherAuthenticated ? '교사용 수업 지도안 보기' : '비밀번호 입력 후 열람 가능'}
            >
              {isTeacherAuthenticated ? (
                <GraduationCap className="w-4 h-4 text-indigo-300" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>교사용 수업 지도안</span>
              {!isTeacherAuthenticated && (
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700 font-normal">
                  잠김
                </span>
              )}
            </button>
          </div>

          {/* Right Action: Student Info & Certificate Button & Digital Badge */}
          <div className="flex items-center gap-2">
            {/* Teacher Link Management Button */}
            {onOpenLinkEditModal && (
              <button
                onClick={onOpenLinkEditModal}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isTeacherAuthenticated
                    ? 'bg-indigo-950/70 border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/80 hover:text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-slate-700'
                }`}
                title="1·2·3차시 새 창 학습 링크 수정 (교사 설정)"
              >
                <Link2 className="w-4 h-4 text-indigo-400" />
                <span className="hidden xl:inline">학습 링크 설정</span>
              </button>
            )}

            {/* Teacher Notice Manager Button */}
            {onOpenNoticeModal && (
              <button
                onClick={onOpenNoticeModal}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isTeacherAuthenticated
                    ? 'bg-indigo-950/70 border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/80 hover:text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-slate-700'
                }`}
                title="학생 대시보드 실시간 공지사항 관리 (교사 설정)"
              >
                <Bell className="w-4 h-4 text-indigo-400" />
                <span className="hidden xl:inline">공지 관리</span>
              </button>
            )}

            {/* Digital Badge Button */}
            <button
              onClick={onOpenBadge}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isMasterBadgeReady
                  ? 'bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-emerald-500/20 border-amber-400 text-amber-300 hover:scale-105 shadow-md shadow-amber-500/25'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title="AI 리터러시 마스터 디지털 배지"
            >
              <Shield className={`w-4 h-4 ${isMasterBadgeReady ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">마스터 배지</span>
              {isMasterBadgeReady ? (
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-1 rounded font-black">
                  획득
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 hidden xl:inline">
                  ({reflectionsCount}/3)
                </span>
              )}
            </button>

            {/* Master Certificate Button */}
            <button
              onClick={onOpenCertificate}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isAllComplete
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title="3차시 종합 수료증 확인"
            >
              <Award className={`w-4 h-4 ${isAllComplete ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">종합 수료증</span>
              {isAllComplete && <span className="text-[10px] bg-amber-400 text-black px-1 rounded font-black">발급</span>}
            </button>

            {/* Student Profile Chip */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition text-left"
              title="학생 정보 변경"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-sm">
                {student.avatarEmoji || '🧑‍🎓'}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-semibold text-slate-200 leading-none">
                  {student.name || '학생 등록'}
                </div>
                <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                  {student.grade ? `${student.grade} ${student.classNum} ${student.studentNo}번` : '정보 입력'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-900 gap-2">
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800/80 w-full">
            <button
              onClick={() => onTabChange('student')}
              className={`flex-1 py-1 text-xs font-medium rounded text-center transition ${
                currentTab === 'student' ? 'bg-sky-600 text-white' : 'text-slate-400'
              }`}
            >
              학생 학습 홈 ({completedCount}/3)
            </button>
            <button
              onClick={handleTeacherClick}
              className={`flex-1 py-1 text-xs font-medium rounded text-center transition flex items-center justify-center gap-1.5 ${
                currentTab === 'teacher' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {!isTeacherAuthenticated ? (
                <Lock className="w-3 h-3 text-slate-400" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              )}
              <span>교사용 수업 지도안</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
