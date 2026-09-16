import React from 'react';
import { Shield, Sparkles, CheckCircle2, ArrowRight, Compass, HelpCircle, Award } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { StudentProfile, SessionProgress } from '../types';

interface HeroSectionProps {
  student: StudentProfile;
  progress: SessionProgress;
  onSelectSession: (id: number) => void;
  onOpenProfile: () => void;
  onOpenBadge: () => void;
  onOpenQuiz?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  student,
  progress,
  onSelectSession,
  onOpenProfile,
  onOpenBadge,
  onOpenQuiz,
}) => {
  const safeProgress = progress || { session1: false, session2: false, session3: false, reflections: {} };
  const completedCount = [safeProgress.session1, safeProgress.session2, safeProgress.session3].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);
  const reflectionsCount = [1, 2, 3].filter((id) => Boolean(safeProgress.reflections?.[id])).length;
  const isMasterBadgeReady = completedCount === 3 && reflectionsCount === 3;

  // Radial chart data for Recharts
  const chartColor =
    progressPercent === 100
      ? '#10b981' // emerald
      : progressPercent >= 66
      ? '#a855f7' // purple
      : progressPercent >= 33
      ? '#38bdf8' // sky
      : '#64748b'; // slate

  const chartData = [
    {
      name: '달성률',
      value: progressPercent,
      fill: chartColor,
    },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Main Title & Description */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-medium text-sky-300 mb-4 shadow-inner">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>미래를 여는 중학교 인공지능 윤리 프로젝트</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-slate-400">총 3차시 완성 코스</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
              가짜에 흔들리지 않는 <br />
              <span className="bg-gradient-to-r from-sky-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                지혜로운 디지털 시민
              </span>
              이 되다
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              알고리즘의 이면을 꿰뚫어보는 <strong className="text-sky-300 font-semibold">비판적 사고 4단계 탐구</strong>부터,
              일상의 고민을 풀어내는 <strong className="text-purple-300 font-semibold">4컷 만화 창작</strong>,
              그리고 3D 가상 공간에서 가짜뉴스와 딥페이크를 가려내는 <strong className="text-emerald-300 font-semibold">진실 탐사대</strong>까지!
              3번의 수업으로 완성하는 AI 리터러시 마스터 여정에 오신 것을 환영합니다.
            </p>

            {/* Quick Competency Badges */}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
                # 알고리즘 편향 검증
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
                # 4컷 스토리보드 웹툰
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
                # 딥페이크 & 딥보이스 판별
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-400">
                # 팩트체크 실천
              </span>
            </div>

            {/* Today Quiz Quick Launch */}
            {onOpenQuiz && (
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={onOpenQuiz}
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-sky-500/15 to-emerald-500/15 hover:from-amber-500/25 hover:to-emerald-500/25 border border-amber-400/50 hover:border-amber-400 text-amber-200 hover:text-white text-xs font-bold transition-all shadow-md shadow-amber-950/40 active:scale-95"
                >
                  <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40 group-hover:scale-110 transition">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                  </span>
                  <span>오늘의 AI 리터러시 퀴즈로 실력 점검</span>
                  <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-sm">
                    도전하기
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Student Status Card & Radial Progress Tracker with Recharts */}
          <div className="w-full lg:w-96 shrink-0 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-xl shadow-black/40 backdrop-blur-sm">
            {/* Student Info Row */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-2xl shadow-inner">
                  {student.avatarEmoji || '🧑‍🚀'}
                </div>
                <div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span>{student.schoolName || '우리 중학교'}</span>
                    <span>·</span>
                    <span>{student.grade || '2학년'}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    <span>{student.name || '탐사대원'}</span>
                    <button
                      onClick={onOpenProfile}
                      className="text-[11px] font-normal text-sky-400 hover:underline"
                    >
                      (수정)
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <button
                  onClick={onOpenBadge}
                  className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold transition border ${
                    isMasterBadgeReady
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 hover:bg-amber-400/30 shadow-sm shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="디지털 배지 확인"
                >
                  <Award className={`w-3 h-3 ${isMasterBadgeReady ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                  <span>{isMasterBadgeReady ? '마스터 배지 발급' : `${completedCount}/3 완료`}</span>
                </button>
                <span className="text-[10px] text-slate-400">
                  일기: {reflectionsCount}/3
                </span>
              </div>
            </div>

            {/* Visual Recharts Radial Progress Section */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3">
              {/* RadialBar Chart Container */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="72%"
                    outerRadius="100%"
                    barSize={9}
                    data={chartData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      background={{ fill: 'rgba(255, 255, 255, 0.07)' }}
                      dataKey="value"
                      cornerRadius={6}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>

                {/* Inner Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black font-mono text-white leading-none">
                    {progressPercent}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">달성률</span>
                </div>
              </div>

              {/* Chart Legend & Session Check Status */}
              <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 text-[11px]">학습 진도율</span>
                  <span className="font-bold text-white font-mono">{completedCount} of 3</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${progress.session1 ? 'bg-sky-400' : 'bg-slate-700'}`} />
                    <span className={progress.session1 ? 'text-sky-300 font-medium' : 'text-slate-500'}>
                      1차시: 비판적 사고
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${progress.session2 ? 'bg-purple-400' : 'bg-slate-700'}`} />
                    <span className={progress.session2 ? 'text-purple-300 font-medium' : 'text-slate-500'}>
                      2차시: 4컷 만화
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${progress.session3 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                    <span className={progress.session3 ? 'text-emerald-300 font-medium' : 'text-slate-500'}>
                      3차시: 진실 탐사대
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 3-Step Interactive Jump List */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => onSelectSession(1)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition ${
                  progress.session1
                    ? 'bg-sky-950/30 border-sky-600/40 text-sky-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    progress.session1 ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    1
                  </span>
                  <span className="truncate font-medium">1차시: 비판적 사고 4단계 탐구</span>
                </div>
                {progress.session1 ? (
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
              </button>

              <button
                onClick={() => onSelectSession(2)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition ${
                  progress.session2
                    ? 'bg-purple-950/30 border-purple-600/40 text-purple-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    progress.session2 ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    2
                  </span>
                  <span className="truncate font-medium">2차시: 4컷 만화 스토리보드</span>
                </div>
                {progress.session2 ? (
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
              </button>

              <button
                onClick={() => onSelectSession(3)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition ${
                  progress.session3
                    ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    progress.session3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    3
                  </span>
                  <span className="truncate font-medium">3차시: 진실 탐사대 3D 미션</span>
                </div>
                {progress.session3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
