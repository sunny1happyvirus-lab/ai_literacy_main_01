import React from 'react';
import {
  ExternalLink,
  Play,
  FileText,
  CheckCircle2,
  Clock,
  HelpCircle,
  Search,
  Users,
  Scale,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  PenTool,
  MessageSquareShare,
  Camera,
  PhoneCall,
  Gamepad2,
  ChevronRight,
  Link2,
} from 'lucide-react';
import { SessionData } from '../types';

interface SessionCardProps {
  session: SessionData;
  isCompleted: boolean;
  hasReflection: boolean;
  onToggleComplete: () => void;
  onOpenGuide: () => void;
  onOpenSummary: () => void;
  onLaunchInApp: () => void;
  onOpenReflection: () => void;
  onOpenQuiz?: () => void;
  onEditLink?: () => void;
  isTeacherMode?: boolean;
}

// Icon helper
const renderIcon = (name: string, className = 'w-4 h-4') => {
  switch (name) {
    case 'Search':
      return <Search className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Scale':
      return <Scale className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'LayoutGrid':
      return <LayoutGrid className={className} />;
    case 'PenTool':
      return <PenTool className={className} />;
    case 'MessageSquareShare':
      return <MessageSquareShare className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'PhoneCall':
      return <PhoneCall className={className} />;
    default:
      return <Search className={className} />;
  }
};

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isCompleted,
  hasReflection,
  onToggleComplete,
  onOpenGuide,
  onOpenSummary,
  onLaunchInApp,
  onOpenReflection,
  onOpenQuiz,
  onEditLink,
  isTeacherMode = false,
}) => {
  const isInternal = session.isInternalApp;

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-gradient-to-b ${session.bgGradient} ${
        isCompleted
          ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
          : session.borderAccent
      }`}
    >
      {/* Top ambient highlight on card */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: session.themeColor }}
      />

      <div
        onClick={onOpenSummary}
        className="p-6 sm:p-7 cursor-pointer group/summary hover:bg-white/5 transition-colors h-full flex flex-col"
        title="요약 정보 보기"
      >
        {/* Header Tags & Period */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-black uppercase px-2.5 py-1 rounded-md text-slate-950 font-mono"
              style={{ backgroundColor: session.themeColor }}
            >
              {session.period}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700/60">
              {session.badge}
            </span>
            {isCompleted ? (
              <span className="text-xs font-black px-2 py-1 rounded-md bg-emerald-400 text-slate-950 flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>완료됨</span>
              </span>
            ) : (
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60">
                미완료
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            <Clock className="w-3.5 h-3.5" />
            <span>{session.timeMinutes}분</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-slate-100 transition">
          {session.title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-300 line-clamp-1">
          {session.subtitle}
        </p>

        {/* Key Question Callout */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 mr-1.5">핵심 질문:</span>
            <span className="text-slate-200">{session.keyQuestion}</span>
          </div>
        </div>

        {/* 4 Steps Timeline / Structure */}
        <div className="mt-5">
          <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2.5">
            학습 단계 (4단계 프로세스)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {session.steps.map((st) => (
              <div
                key={st.step}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs text-slate-300 hover:border-slate-700 transition"
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${session.themeColor}20`,
                    color: session.themeColor,
                  }}
                >
                  {renderIcon(st.iconName, 'w-3.5 h-3.5')}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-200 truncate text-[11px] sm:text-xs">
                    {st.step}. {st.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {session.keywords.slice(0, 3).map((kw, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-800"
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-6 sm:p-7 pt-0 border-t border-slate-800/60 bg-slate-950/40 mt-auto">
        {/* Reflection Diary Trigger Bar */}
        <div className="pt-3.5 pb-2 space-y-1.5">
          <button
            onClick={onOpenReflection}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
              hasReflection
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-300 hover:bg-amber-950/40'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">📝</span>
              <span>
                {hasReflection ? (
                  <strong className="font-bold text-amber-200">성찰 일기 작성 완료</strong>
                ) : (
                  '학습 후 성찰 일기 작성'
                )}
              </span>
            </div>
            <span className="text-[11px] font-normal underline text-slate-400 group-hover:text-slate-200">
              {hasReflection ? '내용 확인·수정 →' : '배운 점 기록하기 →'}
            </span>
          </button>

          {/* Quick Quiz Trigger Button */}
          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
                isCompleted
                  ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 hover:bg-amber-500/25 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:text-amber-300 hover:border-amber-500/40'
              }`}
              title={`${session.period} 핵심 퀴즈로 실력 점검`}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isCompleted ? (
                    <strong className="font-bold text-amber-200">
                      {session.period} 완료! 오늘의 퀴즈로 실력 점검
                    </strong>
                  ) : (
                    `${session.period} 핵심 개념 퀴즈 풀기`
                  )}
                </span>
              </div>
              <span className="text-[11px] text-amber-400/90 font-medium">퀴즈 도전 →</span>
            </button>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Complete Toggle Checkbox Button (Distinct Emerald Green Circular Theme) */}
          <button
            onClick={onToggleComplete}
            className={`group/comp flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 active:scale-95 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/25'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 hover:text-white border-emerald-500/60 hover:border-emerald-400 shadow-sm shadow-emerald-950/30'
            }`}
            title={isCompleted ? '클릭 시 완료 상태를 취소합니다' : '클릭하여 학습 완료 상태로 표시합니다'}
          >
            {isCompleted ? (
              <span className="w-5 h-5 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400 text-slate-950 stroke-[2.5]" />
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full border-2 border-emerald-400/80 bg-emerald-950/80 flex items-center justify-center text-emerald-300 group-hover/comp:border-emerald-300 group-hover/comp:scale-110 transition shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80" />
              </span>
            )}
            <span className={isCompleted ? 'font-black tracking-tight' : 'font-bold'}>
              {isCompleted ? '학습 완료됨 ✓' : '완료 표시하기'}
            </span>
          </button>

          {/* Guide & Launch Buttons */}
          <div className="flex items-center gap-2">
            {/* Detailed Guide Modal Trigger (Distinct Sky Blue Rounded-Rectangle Theme) */}
            <button
              onClick={onOpenGuide}
              className="group/guide flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-sky-950/40 hover:bg-sky-900/60 text-sky-100 hover:text-white border-2 border-sky-500/60 hover:border-sky-400 transition-all shadow-sm shadow-sky-950/30 active:scale-95"
              title="활동 안내 & 활동지 보기"
            >
              <span className="w-5 h-5 rounded-lg bg-sky-500/25 border border-sky-400/60 flex items-center justify-center text-sky-300 group-hover/guide:scale-110 transition shrink-0">
                <FileText className="w-3.5 h-3.5 text-sky-300" />
              </span>
              <span>활동 가이드</span>
            </button>

            {/* Launch Direct in New Window */}
            <a
              href={session.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: session.themeColor }}
              title="새 창으로 열어서 학습 시작하기"
            >
              {isInternal ? (
                <>
                  <Gamepad2 className="w-4 h-4" />
                  <span>새 창에서 탐사 시작</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>새 창에서 앱 실행</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </a>

            {/* In-App Viewer Modal Trigger */}
            <button
              onClick={onLaunchInApp}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 transition"
              title="포털 안에서 미리보기"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Teacher Edit Link Quick Trigger */}
            {onEditLink && (
              <button
                onClick={onEditLink}
                className="p-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-indigo-100 border border-indigo-700/60 transition"
                title="[교사 전용] 새 창 학습 링크 수정"
              >
                <Link2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
