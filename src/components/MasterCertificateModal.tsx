import React from 'react';
import { X, Award, Printer, CheckCircle, Shield, Sparkles } from 'lucide-react';
import { StudentProfile, SessionProgress } from '../types';

interface MasterCertificateModalProps {
  student: StudentProfile;
  progress: SessionProgress;
  onClose: () => void;
  onOpenBadge?: () => void;
}

export const MasterCertificateModal: React.FC<MasterCertificateModalProps> = ({
  student,
  progress,
  onClose,
  onOpenBadge,
}) => {
  const completedCount = [progress.session1, progress.session2, progress.session3].filter(Boolean).length;
  const isAllComplete = completedCount === 3;
  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">중학교 AI 리터러시 종합 수료증</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Preview Body */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-slate-950">
          {!isAllComplete && (
            <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-300 flex items-center justify-between">
              <span>
                현재 <strong>{completedCount} / 3 차시</strong>를 완료했습니다. 모든 차시를 완료하면 공식 인증 스탬프가 완전하게 활성화됩니다.
              </span>
            </div>
          )}

          {/* Printable Certificate Frame */}
          <div className="relative p-7 sm:p-9 rounded-2xl border-2 border-amber-400/70 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 text-center shadow-2xl">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

            <div className="text-[11px] font-bold tracking-[0.25em] text-amber-400 uppercase mb-2">
              CERTIFICATE OF AI LITERACY COMPLETION
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest mb-4">
              수 료 증
            </h2>

            {/* Student Name and School */}
            <div className="my-5 py-2 border-y border-amber-400/20">
              <div className="text-xs text-slate-400 mb-1">
                {student.schoolName || '우리 중학교'} {student.grade || '2학년'}{' '}
                {student.classNum || '3반'} {student.studentNo || '15번'}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300">
                {student.name || '탐사대원'}
              </div>
            </div>

            {/* Certification Statement */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto mb-6">
              위 사람은 중학교 디지털윤리 및 인공지능 리터러시 3차시 마스터 과정
              (1차시: 비판적 사고 4단계 탐구, 2차시: 4컷 만화 스토리보드 창작,
              3차시: 진실 탐사대 3D 미션)을 성실히 이수하고, 가짜에 흔들리지 않는
              지혜로운 디지털 시민 역량을 함양하였기에 이 증서를 수여합니다.
            </p>

            {/* Completed Sessions Checklist Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mx-auto mb-7 text-xs">
              <div
                className={`p-2 rounded-lg border text-center ${
                  progress.session1
                    ? 'bg-sky-950/40 border-sky-500/50 text-sky-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="font-bold">1차시 탐구</div>
                <div className="text-[10px] text-slate-400">비판적 사고 4단계</div>
              </div>
              <div
                className={`p-2 rounded-lg border text-center ${
                  progress.session2
                    ? 'bg-purple-950/40 border-purple-500/50 text-purple-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="font-bold">2차시 창작</div>
                <div className="text-[10px] text-slate-400">4컷 스토리보드</div>
              </div>
              <div
                className={`p-2 rounded-lg border text-center ${
                  progress.session3
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="font-bold">3차시 실습</div>
                <div className="text-[10px] text-slate-400">진실 탐사대 미션</div>
              </div>
            </div>

            {/* Date and Official Seal */}
            <div className="flex items-center justify-between pt-4 border-t border-amber-400/20 text-left text-xs text-slate-400">
              <div>
                <div>수료 일자: {todayStr}</div>
                <div className="text-slate-300 font-semibold mt-0.5">
                  중학교 AI 리터러시 교육 연합
                </div>
              </div>

              {/* Gold Official Stamp */}
              <div className="w-16 h-16 rounded-full border-2 border-amber-400/90 flex flex-col items-center justify-center text-amber-300 -rotate-12 bg-amber-950/40 shadow-lg shadow-amber-500/20">
                <span className="text-[8px] font-black tracking-widest font-mono">AI LITERACY</span>
                <span className="text-xs font-black">인 증</span>
                <span className="text-[8px] font-mono">PASS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            닫기
          </button>
          <div className="flex items-center gap-2">
            {onOpenBadge && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBadge();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>디지털 배지 보기</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>수료증 인쇄 / PDF 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
