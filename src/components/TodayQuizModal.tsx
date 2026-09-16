import React, { useState, useMemo } from 'react';
import {
  X,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AI_LITERACY_QUIZZES } from '../data/quizData';
import { QuizQuestion, StudentProfile } from '../types';

interface TodayQuizModalProps {
  initialSessionId?: number | null;
  student: StudentProfile;
  onClose: () => void;
  onOpenReflection?: (sessionId: number) => void;
}

export const TodayQuizModal: React.FC<TodayQuizModalProps> = ({
  initialSessionId,
  student,
  onClose,
  onOpenReflection,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 1 | 2 | 3>(
    initialSessionId === 1 || initialSessionId === 2 || initialSessionId === 3
      ? (initialSessionId as 1 | 2 | 3)
      : 'all'
  );

  // Filter questions based on selected filter
  const questions: QuizQuestion[] = useMemo(() => {
    if (selectedFilter === 'all') {
      return AI_LITERACY_QUIZZES;
    }
    return AI_LITERACY_QUIZZES.filter((q) => q.sessionId === selectedFilter);
  }, [selectedFilter]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: { selected: number; isCorrect: boolean } }>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  // Reset quiz state when filter tab changes
  const handleFilterChange = (filter: 'all' | 1 | 2 | 3) => {
    setSelectedFilter(filter);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsQuizCompleted(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    const isCorrect = selectedAnswer === currentQ.correctIndex;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selected: selectedAnswer,
        isCorrect,
      },
    }));

    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#10b981', '#f59e0b'],
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      const answersList = Object.values(userAnswers) as { selected: number; isCorrect: boolean }[];
      const correctAnswersCount = answersList.filter((a) => a.isCorrect).length;
      if (correctAnswersCount >= Math.ceil(questions.length * 0.7)) {
        setTimeout(() => {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
          });
        }, 200);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setIsQuizCompleted(false);
  };

  const totalQuestions = questions.length;
  const answeredList = Object.values(userAnswers) as { selected: number; isCorrect: boolean }[];
  const correctCount = answeredList.filter((a) => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-sky-400 p-[1.5px] shadow-lg shadow-amber-500/15">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  오늘의 AI 리터러시 퀴즈
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  실력 점검
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {student.name || '탐사대원'}의 AI 비판적 사고력과 핵심 개념을 테스트해보세요.
              </p>
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

        {/* Filter Navigation Tabs */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>범위:</span>
          </span>
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            전체 (6문항)
          </button>
          <button
            onClick={() => handleFilterChange(1)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
              selectedFilter === 1
                ? 'bg-sky-400 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            1차시 (비판적 사고)
          </button>
          <button
            onClick={() => handleFilterChange(2)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
              selectedFilter === 2
                ? 'bg-purple-400 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            2차시 (4컷 만화)
          </button>
          <button
            onClick={() => handleFilterChange(3)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
              selectedFilter === 3
                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            3차시 (진실 탐사대)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {!isQuizCompleted ? (
            <div>
              {/* Question Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-semibold text-slate-300">
                  문제 {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300">
                  {currentQ.topic}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-sky-400 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
                <div className="text-xs font-bold text-sky-400 mb-1">
                  [{currentQ.sessionTitle}]
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  let borderStyle = 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      borderStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-200 shadow-sm shadow-emerald-500/20';
                    } else if (isSelected && !isCorrect) {
                      borderStyle = 'border-red-500 bg-red-950/30 text-red-200';
                    } else {
                      borderStyle = 'border-slate-800/40 bg-slate-950/20 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    borderStyle = 'border-amber-400 bg-amber-950/30 text-amber-200 shadow-sm shadow-amber-500/20';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition flex items-start gap-3 ${borderStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                          isAnswerSubmitted && isCorrect
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : isAnswerSubmitted && isSelected && !isCorrect
                            ? 'bg-red-500 text-white border-red-400'
                            : isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Banner when answered */}
              {isAnswerSubmitted && (
                <div
                  className={`mt-6 p-4 rounded-2xl border animate-in fade-in duration-200 ${
                    selectedAnswer === currentQ.correctIndex
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-amber-950/30 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {selectedAnswer === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-300">정답입니다! 👏</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">
                          아쉬워요! 정답은 {currentQ.correctIndex + 1}번입니다.
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Result Screen */
            <div className="text-center py-6 sm:py-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-sky-400 p-[2px] shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl">
                  {scorePercent >= 80 ? '🏆' : scorePercent >= 50 ? '🌟' : '💡'}
                </div>
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/40 mb-2">
                  퀴즈 테스트 완료
                </span>
                <h4 className="text-2xl font-black text-white tracking-tight">
                  {scorePercent >= 80
                    ? '완벽한 AI 리터러시 지킴이!'
                    : scorePercent >= 50
                    ? '훌륭한 탐구 실력입니다!'
                    : '조금 더 복습해보면 완벽해져요!'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                  {student.name || '탐사대원'}님은 총 {totalQuestions}문제 중{' '}
                  <strong className="text-white font-bold">{correctCount}문제</strong>를 맞혔습니다.
                </p>
              </div>

              {/* Score Metric Card */}
              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around">
                <div>
                  <div className="text-xs text-slate-500">달성 점수</div>
                  <div className="text-2xl font-black text-amber-400">{scorePercent}점</div>
                </div>
                <div className="w-[1px] h-8 bg-slate-800" />
                <div>
                  <div className="text-xs text-slate-500">정답률</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {correctCount}/{totalQuestions}
                  </div>
                </div>
              </div>

              {/* Action recommendations */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>다시 풀기</span>
                </button>

                {onOpenReflection && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReflection(selectedFilter === 'all' ? 1 : selectedFilter);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 transition"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>성찰 일기에 배운 점 기록하기 →</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isQuizCompleted && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {isAnswerSubmitted
                ? '해설을 확인한 뒤 다음 문제로 이동하세요.'
                : '가장 적절한 답안 하나를 선택하세요.'}
            </span>

            <div className="flex items-center gap-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    selectedAnswer !== null
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>정답 확인하기</span>
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 active:scale-95 transition shadow-sm shadow-sky-500/20"
                >
                  <span>{currentIndex + 1 < questions.length ? '다음 문제' : '결과 보기'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
