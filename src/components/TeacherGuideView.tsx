import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  FileCheck,
  Download,
  Printer,
  Sparkles,
  Layers,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Link2,
  RotateCcw,
  Save,
  Info,
  Settings,
  AlertCircle,
  FileCode,
  Upload,
  Bell,
} from 'lucide-react';
import { TEACHER_CURRICULUM_OVERVIEW, DEFAULT_SESSION_URLS } from '../data/curriculumData';
import { SessionData, UploadedHtmlMeta, SessionProgress, StudentProfile } from '../types';
import { getAllUploadedHtmlMetas } from '../utils/htmlStorage';
import { ClassProgressAnalytics } from './ClassProgressAnalytics';

interface TeacherGuideViewProps {
  sessions: SessionData[];
  customUrls: Record<number, string>;
  onUpdateUrls: (updated: Record<number, string>) => void;
  onResetAllUrls: () => void;
  onOpenLinkEditModal?: (sessionId?: number) => void;
  onOpenNoticeModal?: () => void;
  noticeCount?: number;
  onBackToStudent?: () => void;
  onLock?: () => void;
  progress?: SessionProgress;
  student?: StudentProfile;
}

export const TeacherGuideView: React.FC<TeacherGuideViewProps> = ({
  sessions,
  customUrls,
  onUpdateUrls,
  onResetAllUrls,
  onOpenLinkEditModal,
  onOpenNoticeModal,
  noticeCount,
  onBackToStudent,
  onLock,
  progress,
  student,
}) => {
  const [inlineUrls, setInlineUrls] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    sessions.forEach((s) => {
      initial[s.id] = customUrls[s.id] || DEFAULT_SESSION_URLS[s.id] || s.appUrl;
    });
    return initial;
  });
  const [inlineSaveSuccess, setInlineSaveSuccess] = useState<boolean>(false);
  const [urlErrors, setUrlErrors] = useState<Record<number, string | null>>({});
  const [uploadedMetas, setUploadedMetas] = useState<Record<number, UploadedHtmlMeta>>({});

  useEffect(() => {
    setUploadedMetas(getAllUploadedHtmlMetas());
  }, [customUrls]);

  const handlePrint = () => {
    window.print();
  };

  const handleUrlInputChange = (id: number, val: string) => {
    setInlineUrls((prev) => ({
      ...prev,
      [id]: val,
    }));
    if (urlErrors[id]) {
      setUrlErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validateUrl = (url: string): boolean => {
    const trimmed = url.trim();
    return trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('http://') || trimmed.startsWith('https://');
  };

  const handleSaveAllInline = () => {
    const newErrors: Record<number, string | null> = {};
    let hasError = false;

    [1, 2, 3].forEach((id) => {
      const url = (inlineUrls[id] || '').trim();
      if (!url) {
        newErrors[id] = '링크를 입력해주세요.';
        hasError = true;
      } else if (!validateUrl(url)) {
        newErrors[id] = '올바른 링크 형식(https:// 또는 ./경로)을 입력해주세요.';
        hasError = true;
      }
    });

    if (hasError) {
      setUrlErrors(newErrors);
      return;
    }

    onUpdateUrls(inlineUrls);
    setInlineSaveSuccess(true);
    setTimeout(() => {
      setInlineSaveSuccess(false);
    }, 2500);
  };

  const handleResetSingleInline = (id: number) => {
    const defaultUrl = DEFAULT_SESSION_URLS[id] || '';
    setInlineUrls((prev) => ({
      ...prev,
      [id]: defaultUrl,
    }));
    setUrlErrors((prev) => ({ ...prev, [id]: null }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Teacher Session Top Navigation Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-300">교사 인증 완료 모드</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">교사용 수업 자료 및 차시별 평가 기준이 활성화되었습니다.</span>
        </div>

        <div className="flex items-center gap-2">
          {onBackToStudent && (
            <button
              onClick={onBackToStudent}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>학생 화면으로</span>
            </button>
          )}
          {onLock && (
            <button
              onClick={onLock}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/60 font-medium transition"
              title="교사 모드 종료 및 비밀번호 잠금"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>지도안 다시 잠그기</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-7 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-xs font-semibold text-indigo-300 mb-3">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>중학교 교사용 교수·학습 지도 자료</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {TEACHER_CURRICULUM_OVERVIEW.courseTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            인공지능 시대를 주체적으로 살아갈 중학생들을 위해 비판적 사고, 창의적 표현, 가상 게임 기반 사실검증의 3단계로 유기적으로 연계된 통합 디지털 윤리 수업 모델입니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onOpenNoticeModal && (
            <button
              onClick={onOpenNoticeModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-xs font-bold text-indigo-200 border border-indigo-700/60 shadow transition hover:scale-[1.02]"
              title="학생 대시보드 상단 실시간 공지사항 등록 및 관리"
            >
              <Bell className="w-4 h-4 text-indigo-400" />
              <span>실시간 학생 공지 관리</span>
              {typeof noticeCount === 'number' && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[10px]">
                  {noticeCount}건
                </span>
              )}
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>지도안 인쇄 / PDF</span>
          </button>
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 text-xs font-bold text-white shadow-lg transition hover:scale-[1.02]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>교사 대시보드 바로가기</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-1.5 flex flex-col gap-1">
                {sessions.map((s) => (
                  <a
                    key={s.id}
                    href={s.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.themeColor }} />
                    {s.period} 대시보드
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Dashboard & Class Management Info for 3rd Session */}
      <div className="p-7 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              3차시 진실 탐사대 특화
            </span>
            <h3 className="text-xl font-black text-white mt-1.5">
              교사 대시보드 & 학급 관리 안내
            </h3>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-xs text-emerald-300">
            <span className="text-slate-400">대시보드 기본 비밀번호: </span>
            <strong className="font-mono text-white text-sm">teacher2026</strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mb-4">
          3차시 3D 미션 게임인 「진실 탐사대」는 별도의 복잡한 회원가입 없이 학급코드(예: 2학년 3반)와 학번, 이름만으로 학생 결과를 실시간 취합합니다. 교사 대시보드에서는 다음과 같은 고급 관리 기능을 지원합니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="font-bold text-emerald-400 mb-1">1. 학급코드 생성</div>
            <div className="text-slate-400">1반부터 12반까지 한 번에 자동 생성하여 학생들에게 배부할 수 있습니다.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="font-bold text-emerald-400 mb-1">2. 오답률 통계 시각화</div>
            <div className="text-slate-400">학생들이 가장 어려워한 문항(예: 딥페이크 눈 깜빡임)을 차트로 분석합니다.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="font-bold text-emerald-400 mb-1">3. AI 피드백 전송</div>
            <div className="text-slate-400">학생 개별 성찰일기와 점수에 맞춘 격려 피드백을 실시간 발송합니다.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="font-bold text-emerald-400 mb-1">4. NEIS 세특 문구 생성</div>
            <div className="text-slate-400">학교생활기록부 교과 세부능력 및 특기사항에 입력할 400자 문장을 추출합니다.</div>
          </div>
          <div
            onClick={onOpenNoticeModal}
            className="p-3.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-500/40 text-xs cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="font-bold text-indigo-300 mb-1 flex items-center justify-between">
                <span>5. 실시간 학생 공지</span>
                <span className="text-[10px] text-indigo-400 underline">관리 열기 →</span>
              </div>
              <div className="text-slate-400">학생 대시보드 상단 배너에 긴급 안내, 과제 제출, 힌트를 실시간 게시합니다.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Meta Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            수업 대상 및 교과 연계
          </div>
          <div className="text-base font-bold text-white">중학교 1~3학년</div>
          <div className="text-xs text-slate-400 mt-1">정보과 · 도덕과 · 국어과 (미디어 리터러시)</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
            총 이수 시간 및 형태
          </div>
          <div className="text-base font-bold text-white">총 3차시 (차시당 45분)</div>
          <div className="text-xs text-slate-400 mt-1">블록타임제 또는 주간 연속 차시 운영 권장</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            준비 환경
          </div>
          <div className="text-base font-bold text-white">1인 1디바이스 or 2인 1조</div>
          <div className="text-xs text-slate-400 mt-1">크롬 브라우저 탑재 크롬북, 태블릿, PC실</div>
        </div>
      </div>

      {/* 2022 Revised Curriculum Standards */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          2022 개정 교육과정 성취기준 연계
        </h3>
        <div className="space-y-2.5">
          {TEACHER_CURRICULUM_OVERVIEW.educationStandardLinks.map((standard, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>{standard}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Period Detailed Lesson Plan Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            차시별 교수·학습 과정안 (3차시 구조)
          </h3>
          <span className="text-xs text-slate-400">도입(10분) - 전개(25분) - 정리(10분)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="text-xs font-black px-2.5 py-1 rounded text-slate-950 font-mono"
                    style={{ backgroundColor: session.themeColor }}
                  >
                    {session.period}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">45분 수업</span>
                </div>

                <h4 className="text-lg font-black text-white">{session.title}</h4>
                <p className="text-xs text-slate-300 mt-1 mb-4">{session.subtitle}</p>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 mb-4">
                  <span className="font-bold text-amber-300">핵심 발문: </span>
                  {session.keyQuestion}
                </div>

                {/* Stage Steps */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">수업 단계별 주요 활동</div>
                  {session.detailedGuide.flowStages.map((flow, fi) => (
                    <div key={fi} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
                      <div className="font-semibold text-slate-200">{flow.title}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">{flow.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Rubric */}
                <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200 mb-4">
                  <div className="font-bold text-indigo-300 mb-1">평가 주안점 (과정 중심):</div>
                  <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-300">
                    {session.detailedGuide.assessmentCriteria.map((c, ci) => (
                      <li key={ci}>{c.standard}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="truncate max-w-[200px]" title={session.appUrl}>
                    🔗 {session.appUrl}
                  </span>
                  {onOpenLinkEditModal && (
                    <button
                      onClick={() => onOpenLinkEditModal(session.id)}
                      className="text-indigo-400 hover:text-indigo-300 underline font-medium"
                    >
                      링크 수정
                    </button>
                  )}
                </div>
                <a
                  href={session.appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>새 창에서 수업 도구 열기</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Progress Analytics Section using Recharts (학급 진도 및 참여 현황 분석) */}
      <ClassProgressAnalytics
        sessions={sessions}
        progress={progress}
        student={student}
      />

      {/* School Life Records (생활기록부 세특 작성 예시문) */}
      <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <FileCheck className="w-5 h-5 text-purple-400" />
          학교생활기록부 교과 세특(세부능력 및 특기사항) 서술 예시
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          3차시 과정을 모두 이수한 학생에 대해 교과 세특에 기록할 수 있는 예시 문안입니다.
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
            <strong className="text-purple-300 block mb-1 font-sans">예시 1 (도덕 / 정보과 연계)</strong>
            "인공지능 리터러시 3차시 프로젝트에 주도적으로 참여하여, 알고리즘 편향 사례를 4단계 비판적 사고 기법으로 심층 분석함. AI 과제 대필 및 딥페이크 문제를 다룬 4컷 만화 스토리보드를 독창적으로 창작하며 기술의 윤리적 실천 의지를 드러냄. 3D 가상 탐사 미션에서 팩트체크와 딥보이스 판별 단서를 신속히 포착하여 우수한 성취를 거두었으며, 디지털 정보를 주체적이고 책임감 있게 판별하는 성숙한 디지털 시민성을 보임."
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
            <strong className="text-purple-300 block mb-1 font-sans">예시 2 (국어과 미디어 리터러시 연계)</strong>
            "다양한 매체에서 생성되는 디지털 콘텐츠의 신뢰성을 비판적으로 검증하는 탐구 역량이 뛰어남. AI 윤리 쟁점을 일상 대화와 4컷 웹툰 플롯으로 구조화하여 대중의 공감을 이끌어내는 표현력을 발휘함. 딥페이크 합성 영상의 미세 왜곡 신호를 능동적으로 밝혀내고 성찰일기에 정보 분별의 다짐을 명확히 진술하여 정보 사회에서의 올바른 미디어 수용 태도를 확립함."
          </div>
        </div>
      </div>

      {/* Dedicated Section: 차시별 새 창 학습 링크 관리 (교사 수정 가능) */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Link2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                교사 권한 링크 설정
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              1·2·3차시 새 창을 열어서 학습하기 링크 관리
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              학생 홈 화면 및 활동 안내창에서 학생이 「새 창에서 앱 실행/탐사」를 클릭했을 때 열릴 웹페이지 주소를 직접 수정할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenLinkEditModal && (
              <button
                onClick={() => onOpenLinkEditModal()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 text-xs font-bold transition"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>모달로 편집</span>
              </button>
            )}
            <button
              onClick={handleSaveAllInline}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>수정사항 저장</span>
            </button>
          </div>
        </div>

        {/* Success toast / notice */}
        {inlineSaveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 flex items-center gap-2 text-xs font-bold text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>차시별 새 창 학습 링크가 성공적으로 반영되었습니다! 학생 화면에 즉시 적용됩니다.</span>
          </div>
        )}

        {/* 3 Sessions Editable Link Cards Grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {sessions.map((session) => {
            const currentVal = inlineUrls[session.id] ?? session.appUrl;
            const defaultVal = DEFAULT_SESSION_URLS[session.id];
            const isCustom = currentVal.trim() !== defaultVal;
            const err = urlErrors[session.id];

            return (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded text-slate-950 font-mono"
                      style={{ backgroundColor: session.themeColor }}
                    >
                      {session.period}
                    </span>
                    {isCustom ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        맞춤 링크 적용 중
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        기본 링크
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">{session.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 mb-2.5">{session.subtitle}</p>

                  {/* For Session 3: Highlight HTML file status */}
                  {session.id === 3 && (
                    <div className="mb-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCode className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-[11px] text-slate-300 truncate">
                          {uploadedMetas[3]
                            ? `HTML: ${uploadedMetas[3].fileName} (${uploadedMetas[3].fileSize})`
                            : '기본 게임: truth-explorer.html'}
                        </span>
                      </div>
                      {onOpenLinkEditModal && (
                        <button
                          type="button"
                          onClick={() => onOpenLinkEditModal(3)}
                          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-[10px] font-bold text-amber-300 border border-amber-500/40 shrink-0 transition flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{uploadedMetas[3] ? '파일 교체' : 'HTML 업로드'}</span>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                      <span>새 창 연결 URL</span>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => handleResetSingleInline(session.id)}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>기본값</span>
                        </button>
                      )}
                    </label>

                    <input
                      type="text"
                      value={currentVal}
                      onChange={(e) => handleUrlInputChange(session.id, e.target.value)}
                      placeholder={`예: ${defaultVal}`}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                        err
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                          : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />

                    {err && (
                      <div className="flex items-center gap-1 text-[10px] text-rose-400">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{err}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={validateUrl(currentVal) ? currentVal : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!validateUrl(currentVal)) {
                        e.preventDefault();
                        alert('올바른 URL(https:// 또는 ./경로)을 입력해주세요.');
                      }
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition ${
                      validateUrl(currentVal)
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
                        : 'bg-slate-900 text-slate-600 border-slate-800 pointer-events-none'
                    }`}
                    title="새 창에서 입력한 링크 열어서 테스트"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>새 창 테스트</span>
                  </a>

                  {onOpenLinkEditModal && (
                    <button
                      type="button"
                      onClick={() => onOpenLinkEditModal(session.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition"
                      title="상세 수정 모달 열기"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Reset Tip Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>학교 전산망 차단 정책(예: AI Studio 접근 제한) 발생 시 구글 설문지, 패들렛, 학교 LMS 링크로 대체할 수 있습니다.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('모든 차시 링크를 초기 기본값으로 되돌리시겠습니까?')) {
                onResetAllUrls();
                setInlineUrls({ ...DEFAULT_SESSION_URLS });
                setInlineSaveSuccess(true);
                setTimeout(() => setInlineSaveSuccess(false), 2000);
              }
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition shrink-0 underline text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>전체 기본 링크로 복원</span>
          </button>
        </div>
      </div>
    </div>
  );
};

