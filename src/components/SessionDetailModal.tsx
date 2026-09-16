import React from 'react';
import { X, Play, ExternalLink, BookOpen, CheckCircle, CheckCircle2, Target, HelpCircle, Award, ListChecks, FileText, Link2 } from 'lucide-react';
import { SessionData } from '../types';

interface SessionDetailModalProps {
  session: SessionData | null;
  onClose: () => void;
  onLaunch: (session: SessionData) => void;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  onOpenQuiz?: () => void;
  onEditLink?: (sessionId: number) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  onClose,
  onLaunch,
  isCompleted = false,
  onToggleComplete,
  onOpenQuiz,
  onEditLink,
}) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div
          className="p-6 border-b border-slate-800 flex items-start justify-between gap-4"
          style={{
            background: `linear-gradient(to right, ${session.themeColor}15, rgba(15, 23, 42, 0.9))`,
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded font-mono text-slate-950"
                style={{ backgroundColor: session.themeColor }}
              >
                {session.period}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-sky-500/25 border border-sky-400/50 text-sky-300 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                활동 가이드 & 지도안
              </span>
              {isCompleted ? (
                <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-emerald-400 text-slate-950 flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  학습 완료됨
                </span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                  미완료
                </span>
              )}
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{session.timeMinutes}분 수업</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{session.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{session.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* Key Question Highlight */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                차시 핵심 질문
              </div>
              <div className="text-base font-semibold text-white mt-0.5">
                {session.keyQuestion}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              차시 개요
            </h4>
            <p className="text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
              {session.overview}
            </p>
          </div>

          {/* Learning Objectives */}
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-400" />
              학습 목표
            </h4>
            <ul className="space-y-2">
              {session.learningObjectives.map((obj, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs sm:text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4-Step Learning Flow */}
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <ListChecks className="w-4 h-4 text-purple-400" />
              차시 진행 흐름 및 지도 팁
            </h4>
            <div className="space-y-3">
              {session.detailedGuide.flowStages.map((flow, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="font-bold text-slate-100 text-sm mb-1">{flow.title}</div>
                  <p className="text-xs sm:text-sm text-slate-300 mb-2">{flow.desc}</p>
                  <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-[11px] font-semibold text-sky-300">💡 활동 팁:</div>
                    {flow.guideTips.map((tip, ti) => (
                      <div key={ti} className="text-xs text-slate-400 pl-2 border-l border-sky-500/30">
                        • {tip}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Worksheet Discussion Prompts */}
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              활동지 & 성찰 토의 질문
            </h4>
            <div className="space-y-2">
              {session.detailedGuide.worksheetPrompts.map((prompt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-amber-200/90 flex items-start gap-2"
                >
                  <span className="font-bold font-mono text-amber-400">Q{i + 1}.</span>
                  <span>{prompt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Criteria */}
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-rose-400" />
              평가 기준 (과정 중심 평가)
            </h4>
            <div className="space-y-2">
              {session.detailedGuide.assessmentCriteria.map((crit, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs sm:text-sm"
                >
                  <span className="text-slate-300">{crit.standard}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs font-bold shrink-0 ml-2">
                    {crit.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
            >
              닫기
            </button>

            {onToggleComplete && (
              <button
                onClick={onToggleComplete}
                className={`group/comp flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border-2 active:scale-95 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 border-emerald-300 shadow-md shadow-emerald-500/25'
                    : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 hover:text-white border-emerald-500/60 hover:border-emerald-400 shadow-sm'
                }`}
                title={isCompleted ? '클릭 시 완료 상태 취소' : '클릭하여 학습 완료로 표시'}
              >
                {isCompleted ? (
                  <span className="w-4 h-4 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400 text-slate-950 stroke-[2.5]" />
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-emerald-400/80 bg-emerald-950/80 flex items-center justify-center text-emerald-300 group-hover/comp:scale-110 transition shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
                  </span>
                )}
                <span className={isCompleted ? 'font-black' : 'font-bold'}>
                  {isCompleted ? '이 차시 완료됨 ✓' : '이 차시 완료 표시하기'}
                </span>
              </button>
            )}

            {onOpenQuiz && (
              <button
                onClick={() => {
                  onClose();
                  onOpenQuiz();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition active:scale-95"
                title="이 차시 핵심 퀴즈 풀기"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>차시 퀴즈</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEditLink && (
              <button
                onClick={() => {
                  onClose();
                  onEditLink(session.id);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-white border border-indigo-700/60 transition"
                title="[교사 전용] 이 차시 새 창 학습 링크 수정하기"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">교사용 링크 수정</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onLaunch(session);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="포털 내부에서 미리보기"
            >
              <span>포털 내 미리보기</span>
            </button>

            <a
              href={session.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: session.themeColor }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>새 창으로 학습 시작</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
