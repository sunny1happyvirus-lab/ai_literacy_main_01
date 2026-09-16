import React from 'react';
import { Award, Sparkles, CheckCircle2, Shield, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { SessionProgress, StudentProfile } from '../types';

interface CelebrationMasterBannerProps {
  progress: SessionProgress;
  student: StudentProfile;
  onOpenBadge: () => void;
  onOpenCertificate: () => void;
  onSelectSessionForReflection: (sessionId: number) => void;
}

export const CelebrationMasterBanner: React.FC<CelebrationMasterBannerProps> = ({
  progress,
  student,
  onOpenBadge,
  onOpenCertificate,
  onSelectSessionForReflection,
}) => {
  const safeProgress = progress || { session1: false, session2: false, session3: false, reflections: {} };
  const completedSessionsCount = [
    safeProgress.session1,
    safeProgress.session2,
    safeProgress.session3,
  ].filter(Boolean).length;

  const reflectionsCount = [1, 2, 3].filter((id) => {
    const r = safeProgress.reflections?.[id];
    return Boolean(
      typeof r === 'string' ? r : r?.learned || r?.felt || r?.pledge
    );
  }).length;

  const isAllSessionsDone = completedSessionsCount === 3;
  const isAllReflectionsDone = reflectionsCount === 3;
  const isMasterReady = isAllSessionsDone && isAllReflectionsDone;

  if (isMasterReady) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-emerald-950/70 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 overflow-hidden"
      >
        {/* Glow & Sparkle Overlays */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Left Badge Preview & Info */}
          <div className="flex items-center gap-4 text-left">
            <div
              onClick={onOpenBadge}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-sky-400 to-emerald-400 p-[2px] shadow-lg shadow-amber-500/30 cursor-pointer hover:scale-105 transition shrink-0 group"
            >
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-center">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 group-hover:rotate-6 transition" />
                <span className="text-[8px] font-black font-mono text-amber-300 tracking-wider mt-0.5">
                  MASTER
                </span>
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center text-[10px] text-slate-950 font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-[11px] font-bold text-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
                  <span>마스터 배지 발급 완료</span>
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  3차시 이수 & 성찰 일기 작성 완료
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                축하합니다!{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300">
                  {student.name}
                </span>{' '}
                대원의 'AI 리터러시 마스터' 디지털 배지가 발급되었습니다!
              </h2>

              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                비판적 사고, 4컷 만화 스토리텔링, 가상 공간 팩트체크를 모두 마쳤습니다.
                발급된 공식 디지털 배지와 수료증을 확인하고 보관해보세요.
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenCertificate}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition shadow"
            >
              종합 수료증 보기
            </button>
            <button
              onClick={onOpenBadge}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition hover:scale-105 active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>디지털 배지 열기</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Not yet complete: Show progress guidance banner
  return (
    <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
          <Award className="w-5 h-5 text-amber-400/60" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">
              'AI 리터러시 마스터' 디지털 배지 획득 퀘스트
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-mono">
              진행 중
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            3개 차시 학습 완료 및 각 차시별 성찰 일기를 모두 작성하면 공식 디지털 배지가 자동 발급됩니다.
          </p>
        </div>
      </div>

      {/* Checklist Stats */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">차시 완료:</span>
          <strong className={`font-mono ${isAllSessionsDone ? 'text-emerald-400' : 'text-amber-400'}`}>
            {completedSessionsCount} / 3
          </strong>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">성찰 일기:</span>
          <strong className={`font-mono ${isAllReflectionsDone ? 'text-emerald-400' : 'text-purple-400'}`}>
            {reflectionsCount} / 3
          </strong>
        </div>

        {/* Quick action to write reflection if incomplete */}
        {!isAllReflectionsDone && (
          <button
            onClick={() => {
              const nextSess = [1, 2, 3].find((id) => !safeProgress.reflections?.[id]) || 1;
              onSelectSessionForReflection(nextSess);
            }}
            className="hidden sm:flex items-center gap-1 text-[11px] text-sky-400 hover:underline shrink-0"
          >
            <span>미작성 일기 쓰기</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
