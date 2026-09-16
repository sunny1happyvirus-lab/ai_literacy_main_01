import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Link2,
  ShieldCheck,
  Save,
  Info,
  HelpCircle,
  Upload,
  FileCode,
  Trash2,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { SessionData, UploadedHtmlMeta } from '../types';
import { DEFAULT_SESSION_URLS } from '../data/curriculumData';
import {
  saveUploadedHtml,
  getAllUploadedHtmlMetas,
  deleteUploadedHtml,
} from '../utils/htmlStorage';

interface TeacherLinkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionData[];
  customUrls: Record<number, string>;
  onSaveUrls: (updated: Record<number, string>) => void;
  onResetAllUrls: () => void;
  targetSessionId?: number | null;
}

export const TeacherLinkEditModal: React.FC<TeacherLinkEditModalProps> = ({
  isOpen,
  onClose,
  sessions,
  customUrls,
  onSaveUrls,
  onResetAllUrls,
  targetSessionId,
}) => {
  const [formData, setFormData] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string | null>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [uploadedMetas, setUploadedMetas] = useState<Record<number, UploadedHtmlMeta>>({});
  const [session3Mode, setSession3Mode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize or reset form data whenever modal opens or customUrls change
  useEffect(() => {
    if (isOpen) {
      const initial: Record<number, string> = {};
      sessions.forEach((s) => {
        initial[s.id] = customUrls[s.id] || DEFAULT_SESSION_URLS[s.id] || s.appUrl;
      });
      setFormData(initial);
      setErrors({});
      setSaveSuccessMsg(null);

      const metas = getAllUploadedHtmlMetas();
      setUploadedMetas(metas);
      if (metas[3] || (initial[3] && initial[3].includes('session-runner.html'))) {
        setSession3Mode('upload');
      }
    }
  }, [isOpen, sessions, customUrls]);

  const handleUrlChange = (id: number, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: val,
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleResetSingle = (id: number) => {
    const defaultUrl = DEFAULT_SESSION_URLS[id] || '';
    setFormData((prev) => ({
      ...prev,
      [id]: defaultUrl,
    }));
    setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const validateUrl = (url: string): boolean => {
    const trimmed = url.trim();
    if (!trimmed) return false;
    // Allow relative paths like ./truth-explorer.html or /session-runner.html or http/https URLs
    if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return true;
    }
    return false;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const isHtml = file.name.endsWith('.html') || file.name.endsWith('.htm') || file.type.includes('html');
    if (!isHtml) {
      alert('.html 또는 .htm 형식의 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setIsUploading(true);
      const { meta, runnerUrl } = await saveUploadedHtml(3, file);
      setUploadedMetas((prev) => ({ ...prev, 3: meta }));
      setFormData((prev) => ({ ...prev, 3: runnerUrl }));
      onSaveUrls({ ...formData, 3: runnerUrl });
      setSaveSuccessMsg(`3차시 학습용 HTML 파일("${file.name}")이 성공적으로 업로드되었습니다!`);
      setTimeout(() => {
        setSaveSuccessMsg(null);
      }, 3500);
    } catch (err: any) {
      console.error(err);
      alert('HTML 파일 업로드 중 오류가 발생했습니다: ' + (err.message || '다시 시도해주세요.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteUploadedFile = async (sessionId: number) => {
    if (window.confirm('업로드된 HTML 파일을 삭제하고 기본 파일(truth-explorer.html)로 복원하시겠습니까?')) {
      await deleteUploadedHtml(sessionId);
      setUploadedMetas((prev) => {
        const copy = { ...prev };
        delete copy[sessionId];
        return copy;
      });
      const defaultUrl = DEFAULT_SESSION_URLS[sessionId] || '/truth-explorer.html';
      setFormData((prev) => ({ ...prev, [sessionId]: defaultUrl }));
      onSaveUrls({ ...formData, [sessionId]: defaultUrl });
      setSaveSuccessMsg('업로드 파일이 삭제되고 기본값으로 복원되었습니다.');
      setTimeout(() => setSaveSuccessMsg(null), 2500);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: Record<number, string | null> = {};
    let hasError = false;

    [1, 2, 3].forEach((id) => {
      const url = (formData[id] || '').trim();
      if (!url) {
        newErrors[id] = '링크 주소를 입력해주세요.';
        hasError = true;
      } else if (!validateUrl(url)) {
        newErrors[id] = '올바른 링크 형식(https://... 또는 ./경로)을 입력해주세요.';
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    onSaveUrls(formData);
    setSaveSuccessMsg('차시별 새 창 학습 링크가 성공적으로 저장되었습니다!');
    setTimeout(() => {
      setSaveSuccessMsg(null);
      onClose();
    }, 1200);
  };

  const handleResetAll = async () => {
    if (window.confirm('모든 차시의 학습 링크와 업로드 파일을 기본값으로 되돌리시겠습니까?')) {
      await deleteUploadedHtml(3);
      setUploadedMetas({});
      onResetAllUrls();
      const defaults: Record<number, string> = { ...DEFAULT_SESSION_URLS };
      setFormData(defaults);
      setSaveSuccessMsg('모든 링크와 파일이 기본값으로 복원되었습니다.');
      setTimeout(() => {
        setSaveSuccessMsg(null);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  교사 전용 설정
                </span>
                <span className="text-xs text-slate-400">학습 링크 관리</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                1·2·3차시 새 창 학습 링크 수정
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Guidance Notice */}
        <div className="px-6 py-3 bg-indigo-950/30 border-b border-indigo-900/40 text-xs text-indigo-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            학생 화면의 <strong>「새 창에서 앱 실행」</strong> 및 <strong>「새 창으로 학습 시작」</strong> 버튼을 클릭했을 때 연결되는 URL을 교사가 자유롭게 지정할 수 있습니다. (구글 클래스룸, 패들렛, 학교 LMS, 자체 제작 앱 등)
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs font-semibold text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {sessions.map((session) => {
            const currentVal = formData[session.id] ?? '';
            const defaultVal = DEFAULT_SESSION_URLS[session.id];
            const isCustom = currentVal.trim() !== defaultVal;
            const error = errors[session.id];
            const isTarget = targetSessionId === session.id;

            return (
              <div
                key={session.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isTarget
                    ? 'bg-slate-950/80 border-indigo-500/70 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Session Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-black px-2.5 py-0.5 rounded font-mono text-slate-950"
                      style={{ backgroundColor: session.themeColor }}
                    >
                      {session.period}
                    </span>
                    <span className="text-sm font-bold text-white truncate">
                      {session.title}
                    </span>
                  </div>

                  {isCustom ? (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300">
                      수정된 링크 적용 중
                    </span>
                  ) : (
                    <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                      기본 링크
                    </span>
                  )}
                </div>

                {/* Session 3 Dedicated HTML Upload / URL Switcher */}
                {session.id === 3 ? (
                  <div className="space-y-3">
                    {/* Mode Toggle Buttons */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSession3Mode('upload')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                          session3Mode === 'upload'
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>HTML 파일 업로드 {uploadedMetas[3] ? '(업로드됨 ✓)' : ''}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSession3Mode('url')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                          session3Mode === 'url'
                            ? 'bg-slate-800 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>외부 웹 URL 직접 입력</span>
                      </button>
                    </div>

                    {/* Hidden HTML File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".html,.htm"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />

                    {session3Mode === 'upload' ? (
                      <div>
                        {uploadedMetas[3] ? (
                          /* Active Uploaded File Card */
                          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                                  <FileCode className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm font-bold text-white truncate">
                                      {uploadedMetas[3].fileName}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-500/40 shrink-0">
                                      현재 적용 중
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    파일 크기: <strong className="text-slate-300">{uploadedMetas[3].fileSize}</strong> · 업로드 일시: {uploadedMetas[3].uploadedAt}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteUploadedFile(3)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-700/60 text-slate-400 hover:text-rose-300 transition shrink-0"
                                title="업로드 파일 삭제 및 기본 게임(/truth-explorer.html)으로 복원"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              💡 학생이 3차시 카드에서 <strong>「새 창에서 탐사 시작」</strong>을 클릭하면 위 업로드된 HTML 파일이 새 창에서 즉시 실행됩니다.
                            </p>

                            {/* Action Buttons: Test and Replace */}
                            <div className="flex items-center gap-2 pt-1">
                              <a
                                href={currentVal}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition"
                                title="업로드한 HTML 파일을 새 창에서 실행해봅니다"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>새 창에서 실행 테스트</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>다른 파일로 교체</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Drag & Drop Upload Zone */
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragOver(true);
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragOver(false);
                              const dropped = e.dataTransfer.files?.[0];
                              if (dropped) handleFileUpload(dropped);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-6 border-2 border-dashed rounded-2xl cursor-pointer transition text-center ${
                              isDragOver
                                ? 'border-amber-400 bg-amber-500/15 scale-[1.01]'
                                : 'border-slate-700 hover:border-amber-500/60 hover:bg-slate-900/70 bg-slate-900/30'
                            }`}
                          >
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                              {isUploading ? (
                                <RefreshCw className="w-6 h-6 animate-spin" />
                              ) : (
                                <Upload className="w-6 h-6" />
                              )}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-white">
                              {isUploading
                                ? 'HTML 파일을 읽고 저장하는 중입니다...'
                                : '이곳에 3차시 학습용 .html 파일을 끌어다 놓거나 클릭하여 선택'}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                              교사가 직접 제작하거나 수정한 웹앱/게임 HTML 단일 파일을 업로드하세요. 업로드 즉시 3차시 새 창 실행 링크로 자동 연결됩니다.
                            </p>
                            <div className="mt-3 flex items-center justify-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] text-amber-300 font-medium border border-slate-700">
                                지원 파일: .html, .htm
                              </span>
                              <span className="text-[11px] text-slate-500">
                                (현재 기본값: /truth-explorer.html)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* URL Direct Input Mode for Session 3 */
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-300">
                          새 창 연결 URL (외부 웹사이트 또는 상대 경로)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => handleUrlChange(session.id, e.target.value)}
                            placeholder="예: https://... 또는 /truth-explorer.html"
                            className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                              error
                                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                                : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                            }`}
                          />
                          <a
                            href={validateUrl(currentVal) ? currentVal : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (!validateUrl(currentVal)) {
                                e.preventDefault();
                                alert('올바른 URL 형식(https:// 또는 ./경로)을 먼저 입력해주세요.');
                              }
                            }}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                              validateUrl(currentVal)
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
                                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                            }`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">새 창 테스트</span>
                          </a>
                        </div>
                        {error && (
                          <div className="flex items-center gap-1 text-[11px] text-rose-400 pt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{error}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>기본 URL: <code className="text-slate-400">{defaultVal}</code></span>
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleResetSingle(session.id)}
                              className="text-amber-400 hover:underline shrink-0 ml-2"
                            >
                              기본값으로 되돌리기
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Input for Sessions 1 and 2 */
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      새 창 연결 URL (웹사이트 주소)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => handleUrlChange(session.id, e.target.value)}
                          placeholder="예: https://... 또는 /truth-explorer.html"
                          className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                            error
                              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                              : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                          }`}
                        />
                      </div>

                      {/* Test in New Window */}
                      <a
                        href={validateUrl(currentVal) ? currentVal : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!validateUrl(currentVal)) {
                            e.preventDefault();
                            alert('올바른 URL 형식(https:// 또는 ./경로)을 먼저 입력해주세요.');
                          }
                        }}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                          validateUrl(currentVal)
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white'
                            : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                        }`}
                        title="입력한 링크가 정상 작동하는지 새 창에서 미리 열어봅니다"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">새 창 테스트</span>
                      </a>

                      {/* Restore Single Default */}
                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => handleResetSingle(session.id)}
                          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-amber-300 transition shrink-0"
                          title="이 차시 링크를 기본값으로 되돌리기"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Error display */}
                    {error && (
                      <div className="flex items-center gap-1 text-[11px] text-rose-400 pt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Default link helper info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="truncate">
                        기본 URL: <code className="text-slate-400">{defaultVal}</code>
                      </span>
                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => handleResetSingle(session.id)}
                          className="text-amber-400 hover:underline shrink-0 ml-2"
                        >
                          기본값으로 되돌리기
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/60 hover:bg-rose-950/20 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>전체 기본 링크로 초기화</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>링크 저장하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
