import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lightbulb,
  Info,
  Pin,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Clock,
  Send,
} from 'lucide-react';
import { TeacherNotice, NoticeCategory } from '../types';
import { NOTICE_PRESET_TEMPLATES } from '../data/noticeData';

interface TeacherNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: TeacherNotice[];
  initialEditingNoticeId?: string | null;
  onSaveNotices: (updatedNotices: TeacherNotice[]) => void;
  onResetNotices: () => void;
}

export const TeacherNoticeModal: React.FC<TeacherNoticeModalProps> = ({
  isOpen,
  onClose,
  notices,
  initialEditingNoticeId,
  onSaveNotices,
  onResetNotices,
}) => {
  const [localNotices, setLocalNotices] = useState<TeacherNotice[]>(notices);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Form states for editing / creating
  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    content: string;
    category: NoticeCategory;
    targetClass: string;
    author: string;
    isActive: boolean;
    isPinned: boolean;
  }>({
    id: '',
    title: '',
    content: '',
    category: 'general',
    targetClass: '전체',
    author: '정보 교사',
    isActive: true,
    isPinned: false,
  });

  const [formErrors, setFormErrors] = useState<{ title?: string; content?: string }>({});

  const selectNoticeForEdit = (id: string, list: TeacherNotice[] = localNotices) => {
    const target = list.find((n) => n.id === id);
    if (!target) return;
    setSelectedNoticeId(target.id);
    setIsCreatingNew(false);
    setFormData({
      id: target.id,
      title: target.title,
      content: target.content,
      category: target.category,
      targetClass: target.targetClass,
      author: target.author,
      isActive: target.isActive,
      isPinned: Boolean(target.isPinned),
    });
    setFormErrors({});
  };

  const handleStartNewNotice = () => {
    setIsCreatingNew(true);
    setSelectedNoticeId(null);
    setFormData({
      id: `notice-${Date.now()}`,
      title: '',
      content: '',
      category: 'general',
      targetClass: '전체',
      author: '정보 교사',
      isActive: true,
      isPinned: false,
    });
    setFormErrors({});
  };

  // Sync with notices prop when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const list = Array.isArray(notices) ? notices : [];
    setLocalNotices(list);
    if (initialEditingNoticeId && list.some((n) => n?.id === initialEditingNoticeId)) {
      selectNoticeForEdit(initialEditingNoticeId, list);
    } else if (list.length > 0 && list[0]?.id) {
      selectNoticeForEdit(list[0].id, list);
    } else {
      handleStartNewNotice();
    }
  }, [isOpen, initialEditingNoticeId, notices]);

  const handleApplyPresetTemplate = (template: (typeof NOTICE_PRESET_TEMPLATES)[0]) => {
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      content: template.content,
      category: template.category,
      targetClass: template.targetClass,
    }));
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: { title?: string; content?: string } = {};
    if (!formData.title.trim()) {
      errors.title = '공지 제목을 입력해주세요.';
    }
    if (!formData.content.trim()) {
      errors.content = '공지 내용을 입력해주세요.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCurrentNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const nowStr = new Date().toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    let updatedList: TeacherNotice[];

    if (isCreatingNew) {
      const newNotice: TeacherNotice = {
        ...formData,
        createdAt: nowStr,
        updatedAt: nowStr,
      };
      updatedList = [newNotice, ...localNotices];
      setSelectedNoticeId(newNotice.id);
      setIsCreatingNew(false);
    } else {
      updatedList = localNotices.map((n) =>
        n.id === formData.id
          ? {
              ...n,
              ...formData,
              updatedAt: nowStr,
            }
          : n
      );
    }

    setLocalNotices(updatedList);
    onSaveNotices(updatedList);
    setSaveSuccessNotice('공지사항이 학생 대시보드에 즉시 반영되었습니다!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleToggleActiveQuick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = localNotices.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n));
    setLocalNotices(updated);
    onSaveNotices(updated);

    if (formData.id === id) {
      setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    }
  };

  const handleTogglePinQuick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = localNotices.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    setLocalNotices(updated);
    onSaveNotices(updated);

    if (formData.id === id) {
      setFormData((prev) => ({ ...prev, isPinned: !prev.isPinned }));
    }
  };

  const handleDeleteNotice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('이 공지사항을 삭제하시겠습니까?')) return;

    const filtered = localNotices.filter((n) => n.id !== id);
    setLocalNotices(filtered);
    onSaveNotices(filtered);

    if (selectedNoticeId === id) {
      if (filtered.length > 0) {
        selectNoticeForEdit(filtered[0].id, filtered);
      } else {
        handleStartNewNotice();
      }
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('기본 예시 공지 목록으로 초기화하시겠습니까?')) {
      onResetNotices();
      setSaveSuccessNotice('기본 공지사항 목록으로 초기화되었습니다.');
      setTimeout(() => setSaveSuccessNotice(null), 2500);
    }
  };

  const getCategoryBadge = (cat: NoticeCategory) => {
    switch (cat) {
      case 'urgent':
        return <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">🚨 긴급</span>;
      case 'assignment':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">📝 과제</span>;
      case 'hint':
        return <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold">💡 팁</span>;
      case 'general':
      default:
        return <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">📢 일반</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  교사 권한 관리 모드
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  실시간 학생 화면 동기화
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                학생 대시보드 실시간 공지사항 관리
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success toast notification inside modal */}
        {saveSuccessNotice && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/60 px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
        )}

        {/* Main Body: Two Columns (Left: Notice List, Right: Edit/Create Form) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: Registered Notices List (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-slate-950/50">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span>등록된 공지 목록</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    {localNotices.length}건
                  </span>
                </h3>

                <button
                  id="btn-add-new-notice"
                  type="button"
                  onClick={handleStartNewNotice}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 공지 작성</span>
                </button>
              </div>

              {localNotices.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl my-4 text-xs text-slate-400">
                  등록된 공지사항이 없습니다.
                  <br />
                  상단의 [새 공지 작성]을 눌러 첫 공지를 등록해 보세요.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                  {localNotices.map((n) => {
                    const isSelected = !isCreatingNew && selectedNoticeId === n.id;
                    return (
                      <div
                        key={n.id}
                        onClick={() => selectNoticeForEdit(n.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {getCategoryBadge(n.category)}
                              {n.isPinned && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-0.5">
                                  <Pin className="w-2.5 h-2.5" /> 고정
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">[{n.targetClass}]</span>
                            </div>

                            {/* Active Toggle Switch */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleActiveQuick(n.id, e)}
                              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                                n.isActive
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                              }`}
                              title={n.isActive ? '공개 중 (클릭 시 비공개 전환)' : '비공개 중 (클릭 시 공개 전환)'}
                            >
                              {n.isActive ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>학생 공개</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span>숨김</span>
                                </>
                              )}
                            </button>
                          </div>

                          <h4 className="text-xs font-bold text-white line-clamp-1">{n.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {n.content}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{n.updatedAt}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleTogglePinQuick(n.id, e)}
                              className={`p-1 rounded hover:text-amber-400 transition ${
                                n.isPinned ? 'text-amber-400' : 'text-slate-500'
                              }`}
                              title="상단 고정 토글"
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteNotice(n.id, e)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                              title="공지 삭제"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 underline transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>기본 예시 공지로 복원</span>
              </button>
            </div>
          </div>

          {/* Right Column: Edit / Create Form (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 bg-slate-900">
            <form onSubmit={handleSaveCurrentNotice} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isCreatingNew ? '새 실시간 공지 작성' : '공지사항 내용 수정'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      저장 즉시 학생 대시보드 상단 배너에 실시간으로 반영됩니다.
                    </p>
                  </div>
                </div>

                {isCreatingNew && (
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-xs font-bold">
                    신규 작성
                  </span>
                )}
              </div>

              {/* Quick Template Presets for Teacher convenience */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>수업 맞춤 빠른 템플릿 불러오기</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {NOTICE_PRESET_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPresetTemplate(tmpl)}
                      className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-left transition"
                    >
                      <div className="text-[11px] font-bold text-slate-200 truncate">{tmpl.title}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{tmpl.content}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Target Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">공지 분류</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value as NoticeCategory }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="urgent">🚨 긴급 안내 (Rose)</option>
                    <option value="assignment">📝 과제 및 성찰일기 안내 (Amber)</option>
                    <option value="hint">💡 힌트 및 탐사 팁 (Sky)</option>
                    <option value="general">📢 일반 수업 공지 (Indigo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">대상 학급</label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData((prev) => ({ ...prev, targetClass: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="전체">전체 학급</option>
                    <option value="1반">1반</option>
                    <option value="2반">2반</option>
                    <option value="3반">3반</option>
                    <option value="4반">4반</option>
                    <option value="5반">5반</option>
                    <option value="6반">6반</option>
                  </select>
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>공지 제목</span>
                  <span className="text-[10px] text-slate-400">{formData.title.length}/60자</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  maxLength={60}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="예: 🚨 [필독] 3차시 개인 이어폰 착용 후 진실 탐사대 입장"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                    formErrors.title
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Content textarea */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>공지 내용</span>
                  <span className="text-[10px] text-slate-400">{formData.content.length}/300자</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  maxLength={300}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, content: e.target.value }));
                    if (formErrors.content) setFormErrors((prev) => ({ ...prev, content: undefined }));
                  }}
                  placeholder="학생들이 숙지해야 할 핵심 안내 사항이나 과제 제출 마감 시간을 상세히 작성해 주세요."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs leading-relaxed text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                    formErrors.content
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
                {formErrors.content && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.content}</p>
                )}
              </div>

              {/* Author & Switches */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">작성자 표기</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    placeholder="정보 교사"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="chk-notice-active"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-indigo-500"
                  />
                  <label htmlFor="chk-notice-active" className="text-xs font-bold text-slate-200 cursor-pointer">
                    학생 대시보드에 즉시 공개
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="chk-notice-pin"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPinned: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500"
                  />
                  <label htmlFor="chk-notice-pin" className="text-xs font-bold text-amber-300 cursor-pointer flex items-center gap-1">
                    <Pin className="w-3 h-3" /> 최상단 고정
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  닫기
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreatingNew ? '공지 등록 및 실시간 발행' : '수정사항 저장 및 발행'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
