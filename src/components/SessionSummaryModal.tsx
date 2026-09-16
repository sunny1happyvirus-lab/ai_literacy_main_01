import React from 'react';
import { X, Target, Package, ChevronRight, BookOpen } from 'lucide-react';
import { SessionData } from '../types';

interface SessionSummaryModalProps {
  session: SessionData;
  onClose: () => void;
  onOpenDetailedGuide: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({ session, onClose, onOpenDetailedGuide }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-black uppercase px-2 py-0.5 rounded text-slate-950"
              style={{ backgroundColor: session.themeColor }}
            >
              {session.period}
            </span>
            <h2 className="text-sm font-bold text-white tracking-tight">학습 요약</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">
          {/* Learning Objectives */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Target className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-sky-300">핵심 학습 목표</h3>
            </div>
            <ul className="space-y-2.5 pl-1">
              {session.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-sky-950 text-sky-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Package className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-300">준비물</h3>
            </div>
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3.5">
              <ul className="space-y-2">
                {session.materials?.map((mat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
          >
            닫기
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenDetailedGuide();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: session.themeColor }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>상세 활동 가이드 보기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
