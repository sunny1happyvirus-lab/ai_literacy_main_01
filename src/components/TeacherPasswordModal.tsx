import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  X,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  HelpCircle,
  Settings2,
} from 'lucide-react';

interface TeacherPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_PASSWORD = '1234';
const STORAGE_KEY_TEACHER_PWD = 'ai_literacy_teacher_custom_password';

export const TeacherPasswordModal: React.FC<TeacherPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Change password states
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [changeSuccessMsg, setChangeSuccessMsg] = useState<string | null>(null);

  const getSavedPassword = (): string => {
    try {
      return localStorage.getItem(STORAGE_KEY_TEACHER_PWD) || DEFAULT_PASSWORD;
    } catch {
      return DEFAULT_PASSWORD;
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCorrect = getSavedPassword();

    if (password === currentCorrect) {
      setErrorMsg(null);
      setPassword('');
      onSuccess();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCorrect = getSavedPassword();

    if (currentPwdInput !== currentCorrect) {
      setErrorMsg('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!newPwdInput || newPwdInput.length < 4) {
      setErrorMsg('새 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    if (newPwdInput !== confirmPwdInput) {
      setErrorMsg('새 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY_TEACHER_PWD, newPwdInput);
      setChangeSuccessMsg('교사용 비밀번호가 성공적으로 변경되었습니다!');
      setErrorMsg(null);
      setCurrentPwdInput('');
      setNewPwdInput('');
      setConfirmPwdInput('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setChangeSuccessMsg(null);
      }, 1500);
    } catch {
      setErrorMsg('비밀번호 저장 중 오류가 발생했습니다.');
    }
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_TEACHER_PWD);
      setChangeSuccessMsg('기본 비밀번호(1234)로 초기화되었습니다.');
      setErrorMsg(null);
      setTimeout(() => setChangeSuccessMsg(null), 2000);
    } catch {
      setErrorMsg('초기화 실패');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                교사용 수업 지도안 인증
              </h3>
              <p className="text-xs text-slate-400">
                교사 전용 교수·학습 자료 및 평가 루브릭
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isChangingPassword ? (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-200 leading-relaxed">
                  수업 지도안 및 평가 기준은 교사 전용 공간입니다.
                  보안을 위해 비밀번호를 입력해주세요.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  교사용 비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="비밀번호 입력 (기본: 1234)"
                    autoFocus
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-300 animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Password Hint */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>기본 비밀번호: <strong className="text-indigo-300 font-mono font-bold">1234</strong></span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setErrorMsg(null);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 flex items-center gap-1"
                >
                  <Settings2 className="w-3 h-3" />
                  <span>비밀번호 변경</span>
                </button>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-4 h-4" />
                  <span>지도안 열기</span>
                </button>
              </div>
            </form>
          ) : (
            /* Change Password Panel */
            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  <span>교사용 비밀번호 변경</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setErrorMsg(null);
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  ← 인증으로 돌아가기
                </button>
              </div>

              {changeSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{changeSuccessMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  현재 비밀번호 (기본: 1234)
                </label>
                <input
                  type="password"
                  value={currentPwdInput}
                  onChange={(e) => setCurrentPwdInput(e.target.value)}
                  placeholder="현재 비밀번호"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  새 비밀번호 (4자리 이상)
                </label>
                <input
                  type="password"
                  value={newPwdInput}
                  onChange={(e) => setNewPwdInput(e.target.value)}
                  placeholder="새 비밀번호 입력"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmPwdInput}
                  onChange={(e) => setConfirmPwdInput(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-[11px] text-slate-400 hover:text-amber-400 transition"
                >
                  기본값(1234) 초기화
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setErrorMsg(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-white"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition"
                  >
                    변경 저장
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
