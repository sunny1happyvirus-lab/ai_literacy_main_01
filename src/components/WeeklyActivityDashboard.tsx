import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Flame,
  CheckCircle2,
  TrendingUp,
  Award,
  BookOpen,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { SessionProgress, StudentProfile, WeeklyDayActivity } from '../types';

interface WeeklyActivityDashboardProps {
  progress: SessionProgress;
  student: StudentProfile;
}

export const WeeklyActivityDashboard: React.FC<WeeklyActivityDashboardProps> = ({
  progress,
  student,
}) => {
  const [metricType, setMetricType] = useState<'minutes' | 'activities'>('minutes');

  const safeProgress = progress || { session1: false, session2: false, session3: false, reflections: {} };
  const safeReflections = safeProgress.reflections || {};

  // Completed sessions and reflections calculation
  const completedSessionsCount = [
    safeProgress.session1,
    safeProgress.session2,
    safeProgress.session3,
  ].filter(Boolean).length;

  const reflectionsCount = [1, 2, 3].filter((id) => {
    const r = safeReflections[id];
    return Boolean(typeof r === 'string' ? r : r?.learned || r?.felt || r?.pledge);
  }).length;

  // Calculate dynamic weekly activity data based on student progress
  const weeklyData: WeeklyDayActivity[] = useMemo(() => {
    const refs = progress?.reflections || {};
    // 1차시: 월요일 배분 (완료 시 40분, 성찰 시 +15분)
    const monMinutes = (progress?.session1 ? 40 : 10) + (refs[1] ? 15 : 0);
    const monActs = (progress?.session1 ? 2 : 1) + (refs[1] ? 1 : 0);

    // 화요일: 복습 및 사전 탐색 (기본 활동)
    const tueMinutes = progress?.session1 ? 25 : 5;
    const tueActs = progress?.session1 ? 1 : 0;

    // 2차시: 수요일 배분 (완료 시 45분, 성찰 시 +15분)
    const wedMinutes = (progress?.session2 ? 45 : 0) + (refs[2] ? 15 : 0);
    const wedActs = (progress?.session2 ? 2 : 0) + (refs[2] ? 1 : 0);

    // 목요일: 4컷 웹툰 보완 및 친구 피드백
    const thuMinutes = progress?.session2 ? 30 : 0;
    const thuActs = progress?.session2 ? 1 : 0;

    // 3차시: 금요일 배분 (완료 시 50분, 성찰 시 +15분)
    const friMinutes = (progress?.session3 ? 50 : 0) + (refs[3] ? 15 : 0);
    const friActs = (progress?.session3 ? 3 : 0) + (refs[3] ? 1 : 0);

    // 주말 (토/일)
    const satMinutes = progress.session3 ? 20 : 0;
    const satActs = progress.session3 ? 1 : 0;
    const sunMinutes = 0;
    const sunActs = 0;

    return [
      {
        day: '월요일',
        shortDay: '월',
        minutes: monMinutes,
        activityCount: monActs,
        sessionTitle: '1차시: 비판적 사고 4단계',
      },
      {
        day: '화요일',
        shortDay: '화',
        minutes: tueMinutes,
        activityCount: tueActs,
        sessionTitle: 'AI 편향 사례 자료 조사',
      },
      {
        day: '수요일',
        shortDay: '수',
        minutes: wedMinutes,
        activityCount: wedActs,
        sessionTitle: '2차시: 4컷 만화 스토리보드',
      },
      {
        day: '목요일',
        shortDay: '목',
        minutes: thuMinutes,
        activityCount: thuActs,
        sessionTitle: '웹툰 콘티 수정 및 대사 작성',
      },
      {
        day: '금요일',
        shortDay: '금',
        minutes: friMinutes,
        activityCount: friActs,
        sessionTitle: '3차시: 진실 탐사대 3D 미션',
        isToday: true,
      },
      {
        day: '토요일',
        shortDay: '토',
        minutes: satMinutes,
        activityCount: satActs,
        sessionTitle: '가상공간 단서 팩트체크 복습',
      },
      {
        day: '일요일',
        shortDay: '일',
        minutes: sunMinutes,
        activityCount: sunActs,
        sessionTitle: '자유 휴식',
      },
    ];
  }, [progress]);

  // Total calculations
  const totalMinutes = weeklyData.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalActivities = weeklyData.reduce((acc, curr) => acc + curr.activityCount, 0);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const targetMinutes = 150; // Weekly goal: 150 minutes (2.5 hours)
  const goalPercent = Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));

  // Mock data for overall class participation trend
  const classWeeklyData = [
    { day: '월요일', shortDay: '월', participants: 28 },
    { day: '화요일', shortDay: '화', participants: 24 },
    { day: '수요일', shortDay: '수', participants: 26 },
    { day: '목요일', shortDay: '목', participants: 20 },
    { day: '금요일', shortDay: '금', participants: 30 },
    { day: '토요일', shortDay: '토', participants: 12 },
    { day: '일요일', shortDay: '일', participants: 8 },
  ];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: WeeklyDayActivity = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md text-left z-20 min-w-44">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>{data.day}</span>
            </span>
            {data.isToday && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-bold">
                오늘
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">학습 시간:</span>
              <strong className="text-amber-300 font-mono font-bold">
                {data.minutes}분
              </strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">활동 수행:</span>
              <strong className="text-sky-300 font-mono font-bold">
                {data.activityCount}건
              </strong>
            </div>
            <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-400">주요 활동:</span> {data.sessionTitle}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-10 p-5 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl shadow-black/30 backdrop-blur-sm">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>학습 활동 및 시간 분석 대시보드</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {student.name} 대원의 주간 AI 리터러시 활동량
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            차시별 탐구, 웹툰 창작, 3D 진실 탐사 및 성찰 일기 작성 활동이 실시간으로 누적됩니다.
          </p>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start lg:self-auto">
          <button
            onClick={() => setMetricType('minutes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              metricType === 'minutes'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            학습 시간 (분)
          </button>
          <button
            onClick={() => setMetricType('activities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              metricType === 'activities'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            활동 횟수 (건)
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 my-6">
        {/* Total Time */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>총 학습 시간</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            {hours > 0 ? `${hours}시간 ${remainingMinutes}분` : `${totalMinutes}분`}
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">주간 목표</span>
            <span>대비 {goalPercent}% 달성</span>
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>이수 프로젝트</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            {completedSessionsCount} <span className="text-xs text-slate-400 font-sans font-normal">/ 3 차시</span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400">
            {completedSessionsCount === 3 ? (
              <span className="text-emerald-400 font-bold">✓ 전체 차시 이수 완료</span>
            ) : (
              `${3 - completedSessionsCount}개 차시 진행 대기`
            )}
          </div>
        </div>

        {/* Reflection Diary Entries */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>성찰 일기 작성</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            {reflectionsCount} <span className="text-xs text-slate-400 font-sans font-normal">/ 3 건</span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400">
            {reflectionsCount === 3 ? (
              <span className="text-purple-300 font-bold">✓ 성찰 일기 작성 완수</span>
            ) : (
              `${3 - reflectionsCount}개 일기 작성 필요`
            )}
          </div>
        </div>

        {/* Study Streak & Activity Count */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>총 활동 참여</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            {totalActivities} <span className="text-xs text-slate-400 font-sans font-normal">회 수행</span>
          </div>
          <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
            <span>🔥 4일 연속 활동</span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">
              {metricType === 'minutes' ? '요일별 학습 시간 (단위: 분)' : '요일별 세부 활동 수 (단위: 건)'}
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (그래프 막대에 마우스를 올리면 상세 활동을 볼 수 있습니다)
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-sky-500" />
            <span className="text-[11px]">완료 활동</span>
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-slate-700 ml-2" />
            <span className="text-[11px]">미달성/휴식</span>
          </div>
        </div>

        {/* Recharts BarChart */}
        <div className="h-60 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 12, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="shortDay"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                domain={[0, metricType === 'minutes' ? 70 : 5]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
              <Bar
                dataKey={metricType === 'minutes' ? 'minutes' : 'activityCount'}
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              >
                {weeklyData.map((entry, index) => {
                  const val = metricType === 'minutes' ? entry.minutes : entry.activityCount;
                  const isZero = val === 0;

                  // Color gradient scheme per day
                  let fillColor = '#38bdf8'; // sky
                  if (isZero) {
                    fillColor = '#334155'; // slate-700
                  } else if (entry.day === '월요일') {
                    fillColor = '#38bdf8'; // sky (1차시)
                  } else if (entry.day === '수요일' || entry.day === '목요일') {
                    fillColor = '#a855f7'; // purple (2차시)
                  } else if (entry.day === '금요일') {
                    fillColor = '#10b981'; // emerald (3차시)
                  } else {
                    fillColor = '#f59e0b'; // amber
                  }

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fillColor}
                      fillOpacity={isZero ? 0.3 : 0.85}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Footer with Session Legend */}
        <div className="mt-4 pt-3.5 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>1차시 탐구</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>2차시 웹툰</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>3차시 진실탐사</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>자료조사/복습</span>
            </span>
          </div>

          <div className="text-slate-500">
            총 {weeklyData.filter((d) => d.minutes > 0).length}일 학습 참여 기록
          </div>
        </div>
      </div>
      {/* Class Participation Trend Section */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">
              전체 학생 주간 학습 참여도 추이 (단위: 명)
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-indigo-500" />
            <span className="text-[11px]">참여 인원</span>
          </div>
        </div>

        <div className="h-48 sm:h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={classWeeklyData}
              margin={{ top: 12, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="shortDay"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                domain={[0, 'dataMax + 5']}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md text-left z-20 min-w-32">
                        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-2">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-xs font-bold text-white">{data.day}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-slate-400">참여 인원:</span>
                          <strong className="text-indigo-300 font-mono font-bold">
                            {data.participants}명
                          </strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="participants"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
                fill="#6366f1" // indigo-500
              >
                {classWeeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={entry.participants > 20 ? 0.9 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
