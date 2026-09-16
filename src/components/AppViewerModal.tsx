import React, { useState } from 'react';
import { X, Maximize2, Minimize2, ExternalLink, RefreshCw, Info, HelpCircle } from 'lucide-react';
import { SessionData } from '../types';

interface AppViewerModalProps {
  session: SessionData | null;
  onClose: () => void;
}

export const AppViewerModal: React.FC<AppViewerModalProps> = ({ session, onClose }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full bg-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen ? 'h-full max-h-screen rounded-none border-none' : 'max-w-6xl h-[92vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded font-mono text-slate-950 shrink-0"
              style={{ backgroundColor: session.themeColor }}
            >
              {session.period}
            </span>
            <div className="truncate">
              <span className="text-xs sm:text-sm font-bold text-white truncate">
                {session.title}
              </span>
              <span className="text-[11px] text-slate-400 hidden md:inline ml-2 truncate">
                ({session.subtitle})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIframeKey((prev) => prev + 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="다시 불러오기"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <a
              href={session.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition"
              title="새 브라우저 탭에서 크게 열기"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 탭으로 열기</span>
            </a>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title={isFullScreen ? '창 축소' : '전체 화면'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white transition"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice Bar for External Apps if blocked or restricted */}
        {!session.isInternalApp && (
          <div className="px-4 py-2 bg-sky-950/40 border-b border-sky-800/40 text-[11px] sm:text-xs text-sky-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <Info className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <span className="truncate">
                AI Studio 앱 화면입니다. 브라우저 보안 정책에 따라 화면이 표시되지 않을 경우 우측 상단 "새 탭으로 열기"를 눌러주세요.
              </span>
            </div>
            <a
              href={session.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white font-semibold shrink-0 text-[11px]"
            >
              새 탭에서 즉시 열기 →
            </a>
          </div>
        )}

        {/* Main iFrame Viewer */}
        <div className="relative flex-1 w-full h-full bg-slate-950">
          <iframe
            key={iframeKey}
            src={session.appUrl}
            title={session.title}
            className="w-full h-full border-0"
            allow="camera; microphone; geolocation; clipboard-write; autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          />
        </div>
      </div>
    </div>
  );
};
