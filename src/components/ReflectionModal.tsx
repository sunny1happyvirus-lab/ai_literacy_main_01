import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Save,
  CheckCircle2,
  Trash2,
  Copy,
  Star,
  Printer,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Smile,
  Lightbulb,
} from 'lucide-react';
import { SessionData, StudentProfile, ReflectionEntry } from '../types';
import { CURRICULUM_SESSIONS } from '../data/curriculumData';

interface ReflectionModalProps {
  session: SessionData;
  student: StudentProfile;
  initialReflection?: ReflectionEntry | string;
  allReflections: { [key: number]: ReflectionEntry | string };
  isCompleted: boolean;
  onSave: (sessionId: number, entry: ReflectionEntry, autoComplete: boolean) => void;
  onDelete: (sessionId: number) => void;
  onSelectSession: (session: SessionData) => void;
  onClose: () => void;
}

const MOODS = [
  { emoji: '💡', label: '새로운 깨달음' },
  { emoji: '🚀', label: '자신감 뿜뿜' },
  { emoji: '🤔', label: '깊은 고민' },
  { emoji: '🛡️', label: '디지털 수호대' },
  { emoji: '🎯', label: '목표 달성' },
];

const SUGGESTIONS: { [key: number]: { learned: string[]; felt: string[]; pledge: string[] } } = {
  1: {
    learned: [
      '인공지능의 알고리즘 추천 이면에 편향성이 존재할 수 있음을 알게 되었다.',
      '비판적 사고 4단계(문제인식-관점분석-기준적용-결론)를 통해 문제를 체계적으로 검토했다.',
      'AI가 생성한 답변을 맹신하지 않고 근거를 확인하는 습관의 중요성을 배웠다.',
    ],
    felt: [
      '평소 알고리즘이 보여주는 것만 보며 내 생각이 갇혀 있었던 것 같아 놀라웠다.',
      '기술이 발전할수록 질문하고 검증하는 인간의 주체적 판단이 더 중요함을 느꼈다.',
    ],
    pledge: [
      '앞으로 생성형 AI를 사용할 때 출처와 진위를 한 번 더 의심하고 검증하겠다.',
      '기술의 편리함만 누리지 않고 윤리적 영향까지 고려하는 학생이 되겠다.',
    ],
  },
  2: {
    learned: [
      '기승전결 4컷 구조를 활용하여 AI 윤리 딜레마를 스토리보드로 시각화했다.',
      '과제 대필, 저작권, 사생활 침해 등 일상에서 마주할 수 있는 AI 윤리 쟁점을 정리했다.',
      '웹툰 형식을 통해 복잡한 기술 문제를 쉽고 공감대 있게 표현하는 법을 익혔다.',
    ],
    felt: [
      '친구들과 각자의 스토리를 나누며 서로 다른 윤리적 가치관을 비교해볼 수 있어 흥미로웠다.',
      '만화 주인공의 입장에서 고민해보니 현실에서도 비슷한 유혹을 이겨낼 자신감이 생겼다.',
    ],
    pledge: [
      '생성형 AI로 제작한 콘텐츠는 출처를 정직하게 밝히고 남의 저작권을 침해하지 않겠다.',
      '기술을 이기적으로 악용하지 않고 친구들과 함께 올바르게 쓰도록 돕겠다.',
    ],
  },
  3: {
    learned: [
      '딥페이크 영상의 부자연스러운 눈 깜빡임, 입 모양 불일치, 피부 경계면 왜곡 단서를 확인했다.',
      'AI 합성 음성(딥보이스)의 기계적 호흡 및 배경 잡음 분석법을 실습했다.',
      '가짜뉴스의 자극적 낚시성 제목과 허위 출처를 판별하는 팩트체크 기법을 익혔다.',
    ],
    felt: [
      '진짜 같은 가짜 정보가 생각보다 정교해서 무의식적으로 속을 뻔했다는 사실에 경각심이 들었다.',
      '3D 가상 공간에서 직접 단서를 수집하고 검증해보니 탐사대원으로서 보람찼다.',
    ],
    pledge: [
      'SNS나 메신저로 받은 자극적인 소식은 최소 2곳 이상의 신뢰 기관에서 교차 검증하겠다.',
      '확인되지 않은 루머나 합성 미디어를 주변에 퍼뜨리지 않고 진실을 지키는 파수꾼이 되겠다.',
    ],
  },
};

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  session,
  student,
  initialReflection,
  allReflections,
  isCompleted,
  onSave,
  onDelete,
  onSelectSession,
  onClose,
}) => {
  // Parse initial
  const parseEntry = (raw?: ReflectionEntry | string): ReflectionEntry => {
    if (!raw) {
      return {
        learned: '',
        felt: '',
        pledge: '',
        rating: 5,
        mood: '💡',
        updatedAt: '',
      };
    }
    if (typeof raw === 'string') {
      return {
        learned: raw,
        felt: '',
        pledge: '',
        rating: 5,
        mood: '💡',
        updatedAt: '',
      };
    }
    return raw;
  };

  const [activeTab, setActiveTab] = useState<'editor' | 'all'>('editor');
  const [formData, setFormData] = useState<ReflectionEntry>(() => parseEntry(initialReflection));
  const [autoComplete, setAutoComplete] = useState(!isCompleted);
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Sync if session prop changes
  useEffect(() => {
    const raw = allReflections[session.id];
    setFormData(parseEntry(raw));
    setAutoComplete(!isCompleted);
  }, [session.id, allReflections, isCompleted]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entryToSave: ReflectionEntry = {
      ...formData,
      updatedAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onSave(session.id, entryToSave, autoComplete);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleCopyText = () => {
    const text = `[${session.period} ${session.title} - 성찰 일기]
작성자: ${student.schoolName} ${student.grade} ${student.classNum} ${student.name}
만족도: ${'⭐'.repeat(formData.rating)} (${formData.mood})

1. 이번 차시에서 새로 배운 점:
${formData.learned || '(미작성)'}

2. 활동하며 느낀 점 및 생각의 변화:
${formData.felt || '(미작성)'}

3. 나의 디지털 시민 실천 다짐:
${formData.pledge || '(미작성)'}
작성일: ${formData.updatedAt || '방금 전'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplySuggestion = (field: 'learned' | 'felt' | 'pledge', text: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}\n• ${text}` : text,
    }));
  };

  const currentSuggestions = SUGGESTIONS[session.id] || SUGGESTIONS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div
          className="p-5 border-b border-slate-800 flex items-center justify-between gap-4"
          style={{
            background: `linear-gradient(to right, ${session.themeColor}15, rgba(15, 23, 42, 0.95))`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0"
              style={{ backgroundColor: `${session.themeColor}25`, color: session.themeColor }}
            >
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-black px-2 py-0.5 rounded font-mono text-slate-950"
                  style={{ backgroundColor: session.themeColor }}
                >
                  {session.period}
                </span>
                <span className="text-xs text-slate-400 font-medium">성찰 일기장</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5 truncate">
                {session.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Current Session Edit vs View All Reflections */}
        <div className="px-5 pt-3 pb-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{session.period} 작성하기</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>전체 성찰 일기 모아보기</span>
            </button>
          </div>

          {/* Quick Session Selector */}
          <div className="flex items-center gap-1">
            {CURRICULUM_SESSIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSession(s)}
                className={`w-6 h-6 rounded-md text-[11px] font-bold font-mono transition flex items-center justify-center ${
                  s.id === session.id
                    ? 'text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                style={s.id === session.id ? { backgroundColor: s.themeColor } : {}}
                title={`${s.period}: ${s.title}`}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-sm text-slate-200">
          {activeTab === 'editor' ? (
            <form id="reflection-form" onSubmit={handleSave} className="space-y-6">
              {/* Student Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-base">{student.avatarEmoji}</span>
                  <span className="font-bold text-white">{student.name} 대원</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">
                    {student.schoolName} {student.grade} {student.classNum}
                  </span>
                </div>
                {formData.updatedAt && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>최종 저장: {formData.updatedAt}</span>
                  </div>
                )}
              </div>

              {/* Mood & Star Rating Row */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-amber-400" />
                    <span>오늘의 학습 기분 (무드 이모지)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {MOODS.map((m) => (
                      <button
                        type="button"
                        key={m.emoji}
                        onClick={() => setFormData({ ...formData, mood: m.emoji })}
                        className={`px-2.5 py-1.5 rounded-lg text-sm transition border flex items-center gap-1 ${
                          formData.mood === m.emoji
                            ? 'bg-slate-800 border-amber-400/80 text-white scale-105 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                        title={m.label}
                      >
                        <span>{m.emoji}</span>
                        <span className="text-[10px] hidden md:inline">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-300 mb-2">학습 만족도</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 text-slate-600 hover:text-amber-400 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= formData.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-1.5 text-xs font-mono font-bold text-amber-300">
                      {formData.rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Question 1: What I Learned */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs flex items-center justify-center font-mono font-bold">
                      1
                    </span>
                    <span>이번 차시에서 가장 기억에 남거나 새롭게 배운 점은 무엇인가요?</span>
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={formData.learned}
                  onChange={(e) => setFormData({ ...formData, learned: e.target.value })}
                  placeholder="예: AI가 추천해주는 정보에도 개발자의 관점이나 데이터 편향이 들어갈 수 있다는 점을 알게 되었습니다."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 transition leading-relaxed resize-none"
                  required
                />
                {/* Helpful Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-sky-400" /> 추천 문구:
                  </span>
                  {currentSuggestions.learned.map((tip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleApplySuggestion('learned', tip)}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-sky-300 border border-slate-800 transition truncate max-w-xs"
                      title={tip}
                    >
                      + {tip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Feelings & Shift in Perspective */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono font-bold">
                      2
                    </span>
                    <span>활동하면서 느낀 점이나 생각의 변화는 어떤 것이 있나요?</span>
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={formData.felt}
                  onChange={(e) => setFormData({ ...formData, felt: e.target.value })}
                  placeholder="예: 이전에는 AI가 주는 답변을 그대로 믿었지만, 앞으로는 다른 출처와 교차 검증해야겠다는 경각심을 느꼈습니다."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400 transition leading-relaxed resize-none"
                  required
                />
                {/* Helpful Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-purple-400" /> 추천 문구:
                  </span>
                  {currentSuggestions.felt.map((tip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleApplySuggestion('felt', tip)}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-purple-300 border border-slate-800 transition truncate max-w-xs"
                      title={tip}
                    >
                      + {tip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Action Pledge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono font-bold">
                      3
                    </span>
                    <span>디지털 시민으로서 앞으로 실천하고 싶은 나만의 다짐을 적어보세요!</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={formData.pledge}
                  onChange={(e) => setFormData({ ...formData, pledge: e.target.value })}
                  placeholder="예: 출처가 불분명한 뉴스나 합성 영상은 절대 SNS에 공유하지 않고, 팩트체크 단계를 먼저 거치겠습니다."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400 transition leading-relaxed resize-none"
                  required
                />
                {/* Helpful Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-emerald-400" /> 추천 다짐:
                  </span>
                  {currentSuggestions.pledge.map((tip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleApplySuggestion('pledge', tip)}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 transition truncate max-w-xs"
                      title={tip}
                    >
                      + {tip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Complete Option Checkbox */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoComplete}
                    onChange={(e) => setAutoComplete(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <span>성찰 일기 저장 시 이 차시를 <strong>'학습 완료'</strong> 상태로 함께 변경</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition"
                    title="클립보드에 복사"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? '복사됨!' : '내용 복사'}</span>
                  </button>
                  {initialReflection && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`${session.period} 성찰 일기를 삭제하시겠습니까?`)) {
                          onDelete(session.id);
                          setFormData(parseEntry(undefined));
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                      title="성찰 일기 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          ) : (
            /* View All 3 Reflections Hub */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>총 3차시 성찰 일기 기록장</span>
                <span>
                  작성 현황:{' '}
                  {[1, 2, 3].filter((id) => Boolean(allReflections[id])).length} / 3 작성됨
                </span>
              </div>

              {CURRICULUM_SESSIONS.map((sess) => {
                const entryRaw = allReflections[sess.id];
                const entry = parseEntry(entryRaw);
                const hasWritten = Boolean(
                  typeof entryRaw === 'string'
                    ? entryRaw
                    : entryRaw?.learned || entryRaw?.felt || entryRaw?.pledge
                );

                return (
                  <div
                    key={sess.id}
                    className={`p-4 rounded-xl border transition ${
                      sess.id === session.id
                        ? 'border-slate-700 bg-slate-950/80 shadow-md'
                        : 'border-slate-800 bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded font-mono text-slate-950"
                          style={{ backgroundColor: sess.themeColor }}
                        >
                          {sess.period}
                        </span>
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {sess.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasWritten ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <span>{entry.mood}</span>
                            <span>작성 완료</span>
                          </span>
                        ) : (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-500">
                            미작성
                          </span>
                        )}
                        <button
                          onClick={() => {
                            onSelectSession(sess);
                            setActiveTab('editor');
                          }}
                          className="text-xs text-sky-400 hover:underline ml-1"
                        >
                          {hasWritten ? '수정' : '작성하기'}
                        </button>
                      </div>
                    </div>

                    {hasWritten ? (
                      <div className="space-y-2 text-xs text-slate-300 leading-relaxed mt-2">
                        {entry.learned && (
                          <div>
                            <span className="text-sky-300 font-bold mr-1">배운 점:</span>
                            <span className="whitespace-pre-line text-slate-200">
                              {entry.learned}
                            </span>
                          </div>
                        )}
                        {entry.felt && (
                          <div>
                            <span className="text-purple-300 font-bold mr-1">느낀 점:</span>
                            <span className="whitespace-pre-line text-slate-200">
                              {entry.felt}
                            </span>
                          </div>
                        )}
                        {entry.pledge && (
                          <div>
                            <span className="text-emerald-300 font-bold mr-1">실천 다짐:</span>
                            <span className="whitespace-pre-line text-slate-200">
                              {entry.pledge}
                            </span>
                          </div>
                        )}
                        {entry.updatedAt && (
                          <div className="text-[10px] text-slate-500 pt-1">
                            기록 시간: {entry.updatedAt}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 py-1">
                        아직 기록된 성찰 일기가 없습니다. 수업 후 배운 점을 남겨보세요.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
            >
              닫기
            </button>
            {savedNotice && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                성찰 일기가 성공적으로 저장되었습니다!
              </span>
            )}
          </div>

          {activeTab === 'editor' && (
            <button
              type="submit"
              form="reflection-form"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: session.themeColor }}
            >
              <Save className="w-4 h-4" />
              <span>성찰 일기 저장하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
