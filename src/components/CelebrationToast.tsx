import React from 'react';
import { Sparkles, CheckCircle2, Award, X } from 'lucide-react';
import { ConfettiToastInfo } from '../hooks/useSessionConfetti';

interface CelebrationToastProps {
  toast: ConfettiToastInfo | null;
  onDismiss: () => void;
}

export const CelebrationToast: React.FC<CelebrationToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 p-4 sm:p-5 flex items-start gap-4">
        {/* Glow ambient background */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-sky-400 p-[1.5px] shrink-0 shadow-lg shadow-amber-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
            🎉
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              학습 완료 보상
            </span>
            <span className="text-[11px] font-bold text-sky-400">
              {toast.badge}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
            {toast.title}
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            {toast.subtitle}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition shrink-0"
          title="닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
