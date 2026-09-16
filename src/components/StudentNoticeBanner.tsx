import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  FileText,
  Lightbulb,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  Plus,
  Pin,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { TeacherNotice, StudentProfile, NoticeCategory } from '../types';

interface StudentNoticeBannerProps {
  notices?: TeacherNotice[];
  student?: StudentProfile;
  isTeacherAuthenticated?: boolean;
  onOpenNoticeManager: (noticeId?: string) => void;
  onToggleNoticeActive?: (noticeId: string) => void;
}

export const StudentNoticeBanner: React.FC<StudentNoticeBannerProps> = ({
  notices = [],
  student,
  isTeacherAuthenticated = false,
  onOpenNoticeManager,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const safeList = Array.isArray(notices) ? notices : [];

  // Filter active notices: either targeted to '전체' or specifically to student's classNum (e.g. '3반' or '3')
  const activeNotices = safeList.filter((n) => {
    if (!n || typeof n !== 'object') return false;
    if (!n.isActive) return false;
    const target = (n.targetClass || '전체').trim();
    if (target === '전체' || target === '') return true;
    
    // Check if student matches class
    const studentClass = student?.classNum || '';
    if (studentClass) {
      const pureNum = studentClass.replace(/[^0-9]/g, '');
      if (target.includes(studentClass) || (pureNum && target.includes(pureNum))) {
        return true;
      }
    }
    return false;
  });

  // Sort pinned first, then newest updated first
  const sortedNotices = [...activeNotices].sort((a, b) => {
    if (a?.isPinned && !b?.isPinned) return -1;
    if (!a?.isPinned && b?.isPinned) return 1;
    const timeB = b?.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    const timeA = a?.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
  });

  const total = sortedNotices.length;
  const safeIndex = (currentIndex >= 0 && currentIndex < total) ? currentIndex : 0;
  const currentNotice: TeacherNotice | undefined = sortedNotices[safeIndex] || sortedNotices[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, total - 1)));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const getCategoryConfig = (cat: NoticeCategory) => {
    switch (cat) {
      case 'urgent':
        return {
          label: '긴급 안내',
          icon: AlertTriangle,
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          border: 'border-rose-500/50',
          gradient: 'from-rose-950/40 via-slate-900 to-slate-950',
          dotColor: 'bg-rose-400',
        };
      case 'assignment':
        return {
          label: '과제 안내',
          icon: FileText,
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          border: 'border-amber-500/50',
          gradient: 'from-amber-950/30 via-slate-900 to-slate-950',
          dotColor: 'bg-amber-400',
        };
      case 'hint':
        return {
          label: '학습 팁',
          icon: Lightbulb,
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          border: 'border-sky-500/50',
          gradient: 'from-sky-950/30 via-slate-900 to-slate-950',
          dotColor: 'bg-sky-400',
        };
      case 'general':
      default:
        return {
          label: '수업 공지',
          icon: Info,
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          border: 'border-indigo-500/50',
          gradient: 'from-indigo-950/30 via-slate-900 to-slate-950',
          dotColor: 'bg-indigo-400',
        };
    }
  };

  // If no active notice is present
  if (total === 0) {
    return (
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            <span>현재 등록된 실시간 수업 공지가 없습니다.</span>
          </div>

          <button
            id="btn-teacher-open-notice-empty"
            onClick={() => onOpenNoticeManager()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>교사 실시간 공지 등록</span>
          </button>
        </div>
      </div>
    );
  }

  const catConfig = currentNotice ? getCategoryConfig(currentNotice.category) : getCategoryConfig('general');
  const CategoryIcon = catConfig.icon;

  return (
    <div
      id="student-live-notice-banner"
      className={`relative w-full border-b transition-all duration-200 bg-gradient-to-r ${catConfig.gradient} ${catConfig.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
          {/* Left: LIVE broadcast badge & category tags */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/60 text-[11px] font-black text-rose-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span>LIVE 수업 공지</span>
            </span>

            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${catConfig.badgeBg}`}>
              <CategoryIcon className="w-3 h-3 shrink-0" />
              <span>{catConfig.label}</span>
            </span>

            {currentNotice?.isPinned && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                <Pin className="w-3 h-3 text-amber-400" />
                <span>필독 고정</span>
              </span>
            )}

            <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
              <span>대상:</span>
              <strong className="text-slate-200 font-medium">
                {currentNotice?.targetClass === '전체' ? '전체 학급' : currentNotice?.targetClass}
              </strong>
            </span>
          </div>

          {/* Right: Counter, Teacher Edit Button, and Collapse Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {total > 1 && (
              <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300">
                <button
                  id="btn-notice-prev"
                  onClick={handlePrev}
                  aria-label="이전 공지"
                  className="p-0.5 hover:text-white transition rounded hover:bg-slate-800"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold px-1 text-slate-200">
                  {currentIndex + 1} / {total}
                </span>
                <button
                  id="btn-notice-next"
                  onClick={handleNext}
                  aria-label="다음 공지"
                  className="p-0.5 hover:text-white transition rounded hover:bg-slate-800"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Teacher Announcement Manager Trigger */}
            <button
              id="btn-open-teacher-notice-manager"
              onClick={() => onOpenNoticeManager(currentNotice?.id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 transition active:scale-95 shadow-sm"
              title="교사 권한으로 공지사항을 실시간 등록하거나 수정합니다"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">교사 공지 관리</span>
              <span className="sm:hidden">수정</span>
            </button>

            {/* Collapse/Expand Toggle */}
            <button
              id="btn-toggle-notice-collapse"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              aria-label={isCollapsed ? '공지 내용 펼치기' : '공지 내용 접기'}
              title={isCollapsed ? '공지 내용 펼치기' : '공지 내용 접기'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span className="truncate">{currentNotice?.title}</span>
              </h4>

              {!isCollapsed && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed whitespace-pre-line font-sans">
                  {currentNotice?.content}
                </p>
              )}
            </div>
          </div>

          {/* Footer Meta (Author & Timestamp) */}
          {!isCollapsed && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>작성자: </span>
                  <strong className="text-white font-medium">{currentNotice?.author}</strong>
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>최종 수정: {currentNotice?.updatedAt}</span>
                </span>
              </div>

              {isTeacherAuthenticated && (
                <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                  교사 인증 상태 (실시간 반영 중)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
