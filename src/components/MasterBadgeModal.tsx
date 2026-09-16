import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Award,
  Sparkles,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Shield,
  Printer,
  Compass,
  Zap,
  BookOpen,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { StudentProfile, SessionProgress } from '../types';

interface MasterBadgeModalProps {
  student: StudentProfile;
  progress: SessionProgress;
  onClose: () => void;
  onOpenCertificate: () => void;
}

export const MasterBadgeModal: React.FC<MasterBadgeModalProps> = ({
  student,
  progress,
  onClose,
  onOpenCertificate,
}) => {
  const [copied, setCopied] = useState(false);
  const badgeCardRef = useRef<HTMLDivElement>(null);

  // Generate or use existing serial
  const badgeSerial =
    progress.badgeSerial ||
    `AIM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate =
    progress.badgeIssuedAt ||
    new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Trigger celebration confetti on mount
  useEffect(() => {
    // Blast 1: Left & Right canons
    const end = Date.now() + 1200;
    const colors = ['#38bdf8', '#a855f7', '#10b981', '#fbbf24', '#f43f5e'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.65 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.65 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors,
      });
    }, 400);
  }, []);

  const handleCopySerial = () => {
    const text = `[AI 리터러시 마스터 디지털 배지]
학생: ${student.schoolName} ${student.grade} ${student.classNum} ${student.name}
배지 인증번호: ${badgeSerial}
발급일: ${issueDate}
획득 역량:
1. 비판적 사고 4단계 탐구 마스터
2. AI 윤리 4컷 만화 스토리보드 창작 마스터
3. 가짜뉴스 & 딥페이크 팩트체크 진실 탐사대 마스터`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/20 via-sky-500/10 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL DIGITAL BADGE</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                AI 리터러시 마스터 디지털 배지
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center">
          {/* Celebratory Message Header */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs font-bold text-emerald-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>축하합니다! 3차시 전체 학습 및 성찰 완료</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {student.name} 대원은 <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                'AI 리터러시 마스터'
              </span>
              로 인증되었습니다!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
              알고리즘 비판적 탐구부터 4컷 만화 스토리텔링, 3D 가상 공간 팩트체크까지
              성실히 이수하여 성숙한 디지털 시민성을 증명했습니다.
            </p>
          </motion.div>

          {/* Interactive 3D Holographic Badge Display */}
          <div ref={badgeCardRef} className="relative flex justify-center py-2">
            <motion.div
              whileHover={{ scale: 1.03, rotateZ: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-72 sm:w-80 p-7 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 text-center overflow-hidden"
            >
              {/* Internal Holographic Glow Rings */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-amber-500/10 pointer-events-none" />

              {/* Badge Visual Icon */}
              <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
                {/* Rotating Outer Hexagon / Shield Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-sky-400 to-emerald-400 p-[3px] shadow-lg animate-spin-slow">
                  <div className="w-full h-full rounded-full bg-slate-950" />
                </div>
                {/* Glowing Core */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 flex flex-col items-center justify-center text-slate-950 shadow-inner">
                  <Shield className="w-8 h-8 fill-slate-950 text-slate-950 stroke-[1.5]" />
                  <span className="text-[9px] font-black tracking-wider uppercase font-mono">MASTER</span>
                </div>
              </div>

              {/* Badge Titles */}
              <div className="text-[10px] font-mono tracking-[0.2em] text-amber-400 font-bold uppercase mb-1">
                AI LITERACY CHAMPION
              </div>
              <div className="text-xl font-black text-white tracking-tight">
                AI 리터러시 마스터
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                지혜롭고 책임감 있는 디지털 시민
              </div>

              {/* Recipient Details */}
              <div className="my-4 py-3 border-y border-slate-800/80 bg-slate-950/60 rounded-xl">
                <div className="text-sm font-bold text-amber-300">
                  {student.avatarEmoji} {student.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {student.schoolName} · {student.grade} {student.classNum}
                </div>
              </div>

              {/* 3 Mastered Competencies Icons */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-300 mb-4">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-sky-400 font-bold">1차시</div>
                  <div className="text-[9px] text-slate-400">비판적 사고</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-purple-400 font-bold">2차시</div>
                  <div className="text-[9px] text-slate-400">스토리보드</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-emerald-400 font-bold">3차시</div>
                  <div className="text-[9px] text-slate-400">진실 탐사대</div>
                </div>
              </div>

              {/* Serial & Verified Stamp */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                <span>ID: {badgeSerial}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-sans">
                  <CheckCircle2 className="w-3 h-3" /> 인증 완료
                </span>
              </div>
            </motion.div>
          </div>

          {/* Master Competencies Summary Card */}
          <div className="text-left p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <div className="font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>마스터 획득 역량 명세</span>
            </div>
            <div className="space-y-1.5 pl-2 border-l border-slate-800 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-sky-400 font-bold">✓</span>
                <span><strong>알고리즘 편향성 검증:</strong> 4단계 탐구 기법으로 AI 편향 분석 및 대안 도출</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-purple-400 font-bold">✓</span>
                <span><strong>윤리적 서사 창작:</strong> 기승전결 4컷 스토리보드로 AI 딜레마 표현</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>가상 공간 팩트체크:</strong> 딥페이크·딥보이스 왜곡 단서 판별 및 사실 검증</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
          >
            닫기
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySerial}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
              title="배지 인증 정보 복사"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? '복사됨!' : '인증정보 복사'}</span>
            </button>

            <button
              onClick={handlePrintBadge}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
              title="배지 인쇄 / PDF 저장"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenCertificate();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
            >
              <Award className="w-4 h-4" />
              <span>종합 수료증 보기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
