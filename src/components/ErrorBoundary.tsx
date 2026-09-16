import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetAndReload = () => {
    try {
      // Clear potentially corrupted notice or session keys while preserving defaults
      localStorage.removeItem('ai_literacy_teacher_notices');
      localStorage.removeItem('ai_literacy_custom_session_urls');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  private handleFullReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-rose-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-5 text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              화면을 불러오는 중 오류가 발생했습니다
            </h1>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              브라우저에 저장된 이전 데이터와의 일시적인 충돌이 발생했을 수 있습니다.
              아래 복구 버튼을 누르면 정상 상태로 즉시 복원됩니다.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs font-mono text-rose-300 max-h-28 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleResetAndReload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>데이터 복구 및 새로고침</span>
              </button>

              <button
                onClick={this.handleFullReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition"
              >
                <Home className="w-4 h-4" />
                <span>초기 상태로 복원</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
