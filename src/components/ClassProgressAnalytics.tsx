import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart2,
  Users,
  CheckCircle2,
  FileText,
  Award,
  AlertCircle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Download,
  Filter,
} from 'lucide-react';
import { SessionProgress, StudentProfile, SessionData } from '../types';

interface ClassProgressAnalyticsProps {
  sessions: SessionData[];
  progress?: SessionProgress;
  student?: StudentProfile;
}

interface ClassDataScope {
  id: string;
  name: string;
  totalStudents: number;
  // Session completion counts
  s1Complete: number;
  s2Complete: number;
  s3Complete: number;
  // Reflection participation counts
  s1Reflection: number;
  s2Reflection: number;
  s3Reflection: number;
}

export const ClassProgressAnalytics: React.FC<ClassProgressAnalyticsProps> = ({
  sessions,
  progress,
  student,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('class3'); // default to current student's class (3반)
  const [displayUnit, setDisplayUnit] = useState<'count' | 'percent'>('count');

  // Base mock class distribution data (2학년 1~3반, 28 students each = 84 total)
  // We incorporate current student's real-time progress into 3반
  const classDatasets: Record<string, ClassDataScope> = useMemo(() => {
    const studentS1 = progress?.session1 ? 1 : 0;
    const studentS2 = progress?.session2 ? 1 : 0;
    const studentS3 = progress?.session3 ? 1 : 0;

    const hasRef = (id: number) => {
      if (!progress?.reflections) return 0;
      const r = progress.reflections[id];
      return r && (typeof r === 'string' ? r.length > 0 : Boolean(r.learned || r.felt || r.pledge))
        ? 1
        : 0;
    };

    const studentRef1 = hasRef(1);
    const studentRef2 = hasRef(2);
    const studentRef3 = hasRef(3);

    // Class 3 (Current class where this student logs in)
    const class3: ClassDataScope = {
      id: 'class3',
      name: `${student?.grade || '2학년'} ${student?.classNum || '3반'} (담당 학급)`,
      totalStudents: 28,
      s1Complete: 26 + studentS1 > 28 ? 28 : 26 + studentS1,
      s2Complete: 23 + studentS2 > 28 ? 28 : 23 + studentS2,
      s3Complete: 19 + studentS3 > 28 ? 28 : 19 + studentS3,
      s1Reflection: 24 + studentRef1 > 28 ? 28 : 24 + studentRef1,
      s2Reflection: 20 + studentRef2 > 28 ? 28 : 20 + studentRef2,
      s3Reflection: 17 + studentRef3 > 28 ? 28 : 17 + studentRef3,
    };

    // Class 1
    const class1: ClassDataScope = {
      id: 'class1',
      name: '2학년 1반',
      totalStudents: 28,
      s1Complete: 27,
      s2Complete: 25,
      s3Complete: 22,
      s1Reflection: 25,
      s2Reflection: 23,
      s3Reflection: 20,
    };

    // Class 2
    const class2: ClassDataScope = {
      id: 'class2',
      name: '2학년 2반',
      totalStudents: 28,
      s1Complete: 25,
      s2Complete: 22,
      s3Complete: 18,
      s1Reflection: 22,
      s2Reflection: 19,
      s3Reflection: 16,
    };

    // All combined
    const allTotal = class1.totalStudents + class2.totalStudents + class3.totalStudents;
    const all: ClassDataScope = {
      id: 'all',
      name: '2학년 전체 학급 (84명)',
      totalStudents: allTotal,
      s1Complete: class1.s1Complete + class2.s1Complete + class3.s1Complete,
      s2Complete: class1.s2Complete + class2.s2Complete + class3.s2Complete,
      s3Complete: class1.s3Complete + class2.s3Complete + class3.s3Complete,
      s1Reflection: class1.s1Reflection + class2.s1Reflection + class3.s1Reflection,
      s2Reflection: class1.s2Reflection + class2.s2Reflection + class3.s2Reflection,
      s3Reflection: class1.s3Reflection + class2.s3Reflection + class3.s3Reflection,
    };

    return {
      class3,
      all,
      class1,
      class2,
    };
  }, [progress, student]);

  const activeScope = classDatasets[selectedClassId] || classDatasets.class3;
  const total = activeScope.totalStudents;

  // Chart data calculation
  const chartData = useMemo(() => {
    const s1CompRate = Math.round((activeScope.s1Complete / total) * 100);
    const s1RefRate = Math.round((activeScope.s1Reflection / total) * 100);

    const s2CompRate = Math.round((activeScope.s2Complete / total) * 100);
    const s2RefRate = Math.round((activeScope.s2Reflection / total) * 100);

    const s3CompRate = Math.round((activeScope.s3Complete / total) * 100);
    const s3RefRate = Math.round((activeScope.s3Reflection / total) * 100);

    // Full course completion estimate (min of session 3 complete & reflection)
    const masterCount = Math.min(activeScope.s3Complete, activeScope.s3Reflection);
    const masterRate = Math.round((masterCount / total) * 100);

    if (displayUnit === 'percent') {
      return [
        {
          sessionKey: '1차시',
          title: '1차시: 비판적 사고 4단계',
          shortName: '1차시 (비판적 사고)',
          completion: s1CompRate,
          reflection: s1RefRate,
          completionRaw: activeScope.s1Complete,
          reflectionRaw: activeScope.s1Reflection,
          completionRate: s1CompRate,
          reflectionRate: s1RefRate,
          pendingReflection: activeScope.s1Complete - activeScope.s1Reflection,
          totalStudents: total,
        },
        {
          sessionKey: '2차시',
          title: '2차시: 4컷 만화 스토리보드',
          shortName: '2차시 (4컷 만화)',
          completion: s2CompRate,
          reflection: s2RefRate,
          completionRaw: activeScope.s2Complete,
          reflectionRaw: activeScope.s2Reflection,
          completionRate: s2CompRate,
          reflectionRate: s2RefRate,
          pendingReflection: activeScope.s2Complete - activeScope.s2Reflection,
          totalStudents: total,
        },
        {
          sessionKey: '3차시',
          title: '3차시: 진실 탐사대 (3D 가상 미션)',
          shortName: '3차시 (진실 탐사대)',
          completion: s3CompRate,
          reflection: s3RefRate,
          completionRaw: activeScope.s3Complete,
          reflectionRaw: activeScope.s3Reflection,
          completionRate: s3CompRate,
          reflectionRate: s3RefRate,
          pendingReflection: activeScope.s3Complete - activeScope.s3Reflection,
          totalStudents: total,
        },
        {
          sessionKey: '종합 마스터',
          title: '전체 3차시 마스터 (이수+성찰 완료)',
          shortName: '종합 마스터 이수',
          completion: masterRate,
          reflection: masterRate,
          completionRaw: masterCount,
          reflectionRaw: masterCount,
          completionRate: masterRate,
          reflectionRate: masterRate,
          pendingReflection: 0,
          totalStudents: total,
        },
      ];
    }

    return [
      {
        sessionKey: '1차시',
        title: '1차시: 비판적 사고 4단계',
        shortName: '1차시 (비판적 사고)',
        completion: activeScope.s1Complete,
        reflection: activeScope.s1Reflection,
        completionRaw: activeScope.s1Complete,
        reflectionRaw: activeScope.s1Reflection,
        completionRate: s1CompRate,
        reflectionRate: s1RefRate,
        pendingReflection: activeScope.s1Complete - activeScope.s1Reflection,
        totalStudents: total,
      },
      {
        sessionKey: '2차시',
        title: '2차시: 4컷 만화 스토리보드',
        shortName: '2차시 (4컷 만화)',
        completion: activeScope.s2Complete,
        reflection: activeScope.s2Reflection,
        completionRaw: activeScope.s2Complete,
        reflectionRaw: activeScope.s2Reflection,
        completionRate: s2CompRate,
        reflectionRate: s2RefRate,
        pendingReflection: activeScope.s2Complete - activeScope.s2Reflection,
        totalStudents: total,
      },
      {
        sessionKey: '3차시',
        title: '3차시: 진실 탐사대 (3D 가상 미션)',
        shortName: '3차시 (진실 탐사대)',
        completion: activeScope.s3Complete,
        reflection: activeScope.s3Reflection,
        completionRaw: activeScope.s3Complete,
        reflectionRaw: activeScope.s3Reflection,
        completionRate: s3CompRate,
        reflectionRate: s3RefRate,
        pendingReflection: activeScope.s3Complete - activeScope.s3Reflection,
        totalStudents: total,
      },
      {
        sessionKey: '종합 마스터',
        title: '전체 3차시 마스터 (이수+성찰 완료)',
        shortName: '종합 마스터 이수',
        completion: masterCount,
        reflection: masterCount,
        completionRaw: masterCount,
        reflectionRaw: masterCount,
        completionRate: masterRate,
        reflectionRate: masterRate,
        pendingReflection: 0,
        totalStudents: total,
      },
    ];
  }, [activeScope, total, displayUnit]);

  // Overall class averages
  const avgCompletionRate = Math.round(
    ((activeScope.s1Complete + activeScope.s2Complete + activeScope.s3Complete) / (total * 3)) * 100
  );
  const avgReflectionRate = Math.round(
    ((activeScope.s1Reflection + activeScope.s2Reflection + activeScope.s3Reflection) / (total * 3)) * 100
  );
  const totalPendingReflections =
    activeScope.s1Complete -
    activeScope.s1Reflection +
    (activeScope.s2Complete - activeScope.s2Reflection) +
    (activeScope.s3Complete - activeScope.s3Reflection);

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const compVal = displayUnit === 'percent' ? `${item.completion}% (${item.completionRaw}명)` : `${item.completion}명 (${item.completionRate}%)`;
      const refVal = displayUnit === 'percent' ? `${item.reflection}% (${item.reflectionRaw}명)` : `${item.reflection}명 (${item.reflectionRate}%)`;

      return (
        <div className="bg-slate-900/95 border border-slate-700/90 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-left z-30 min-w-56">
          <div className="border-b border-slate-800 pb-2 mb-2">
            <span className="text-xs font-bold text-white block">{item.title}</span>
            <span className="text-[11px] text-slate-400">총 정원: {total}명 기준</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-sky-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>차시 학습 완료:</span>
              </span>
              <strong className="text-white font-mono font-bold">{compVal}</strong>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>성찰일기 참여:</span>
              </span>
              <strong className="text-white font-mono font-bold">{refVal}</strong>
            </div>

            {item.pendingReflection > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-300">
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>일기 미작성 차이:</span>
                </span>
                <span className="font-mono font-bold">{item.pendingReflection}명</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-indigo-500/30 shadow-xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <BarChart2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Class Progress Analytics
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold">
              실시간 분석
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            학급 진도 및 참여 현황 분석
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            차시별 학습 완료 분포와 성찰일기 작성 참여율을 막대 그래프로 비교하여, 학습 이탈 방지 및 과정 중심 피드백을 지원합니다.
          </p>
        </div>

        {/* Controls: Class Selector & Metric Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-1.5 flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">학급:</span>
            </span>
            <button
              onClick={() => setSelectedClassId('class3')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                selectedClassId === 'class3'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3반 (담당)
            </button>
            <button
              onClick={() => setSelectedClassId('class1')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                selectedClassId === 'class1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1반
            </button>
            <button
              onClick={() => setSelectedClassId('class2')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                selectedClassId === 'class2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2반
            </button>
            <button
              onClick={() => setSelectedClassId('all')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                selectedClassId === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체 학급
            </button>
          </div>

          {/* Unit Toggle: Count vs Percent */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setDisplayUnit('count')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                displayUnit === 'count'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              인원 (명)
            </button>
            <button
              onClick={() => setDisplayUnit('percent')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                displayUnit === 'percent'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              비율 (%)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>대상 학급 정원</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {total} <span className="text-xs text-slate-400 font-sans font-normal">명</span>
          </div>
          <div className="text-[11px] text-indigo-300 mt-1 truncate">{activeScope.name}</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>평균 차시 이수율</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono">
            {avgCompletionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">1~3차시 평균 완료율</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>성찰일기 참여율</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {avgReflectionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalPendingReflections > 0 ? (
              <span className="text-amber-400">일기 미작성 {totalPendingReflections}건</span>
            ) : (
              <span className="text-emerald-400">전원 작성 완료</span>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>종합 마스터 달성</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-300 font-mono">
            {Math.min(activeScope.s3Complete, activeScope.s3Reflection)}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">명</span>
          </div>
          <div className="text-[11px] text-purple-300/80 mt-1">
            전체 3차시+성찰 완료
          </div>
        </div>
      </div>

      {/* Main Recharts Bar Chart Container */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-white">
              차시별 완료 vs 성찰 참여 분포 ({displayUnit === 'percent' ? '비율 단위: %' : '인원 단위: 명'})
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded-sm bg-sky-400" />
              <span>차시 학습 완료</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded-sm bg-emerald-400" />
              <span>성찰일기 참여</span>
            </span>
          </div>
        </div>

        {/* Recharts BarChart */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="shortName"
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={[0, displayUnit === 'percent' ? 100 : total]}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
              />
              <Bar
                name="차시 학습 완료"
                dataKey="completion"
                fill="#38bdf8"
                radius={[5, 5, 0, 0]}
                animationDuration={700}
                maxBarSize={44}
              />
              <Bar
                name="성찰일기 참여"
                dataKey="reflection"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
                animationDuration={700}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Details Table / Progress Summary */}
        <div className="mt-5 pt-4 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {chartData.map((d, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
            >
              <div className="font-semibold text-slate-200 mb-1 flex items-center justify-between">
                <span>{d.sessionKey}</span>
                {d.pendingReflection > 0 ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                    일기 미작성 {d.pendingReflection}명
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    달성 우수
                  </span>
                )}
              </div>
              <div className="space-y-0.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>학습 완료:</span>
                  <span className="text-sky-300 font-mono font-bold">
                    {displayUnit === 'percent' ? `${d.completion}%` : `${d.completion}명`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>성찰 참여:</span>
                  <span className="text-emerald-300 font-mono font-bold">
                    {displayUnit === 'percent' ? `${d.reflection}%` : `${d.reflection}명`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Guidance / Actionable Pedagogical Insights */}
      <div className="p-4 sm:p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col sm:flex-row items-start gap-3.5">
        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-indigo-200">
            교사용 지도 인사이트 & 피드백 권장 사항
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            • <strong>차시 완료 후 성찰일기 연계 지도</strong>: 차시별 학습 완료율 대비 성찰일기 작성률이 약 7~10% 낮게 나타납니다. 수업 종료 5분 전 학생들에게 홈 화면의 「성찰일기 작성하기」 버튼을 클릭하여 소감과 다짐을 작성하도록 지도해주세요.
            <br />
            • <strong>3차시 진실 탐사대 미션 지도</strong>: 3차시는 인터랙티브 탐사 단계가 포함되어 집중도가 높으나, 1인 1디바이스 네트워크 환경에 따라 미완료 학생이 발생할 수 있습니다. 미완료 학생은 2인 1조 짝 활동으로 협동 탐사를 권장합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
