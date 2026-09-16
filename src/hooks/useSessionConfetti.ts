import { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { SessionProgress } from '../types';

export interface ConfettiToastInfo {
  sessionNumber: number;
  title: string;
  subtitle: string;
  badge: string;
}

const SESSION_METAS: { [key: number]: { title: string; subtitle: string; badge: string; colors: string[] } } = {
  1: {
    title: '1차시: 비판적 사고 4단계 탐구 완료!',
    subtitle: '알고리즘 추천과 필터 버블을 비판적으로 분석하는 안목을 길렀습니다.',
    badge: '비판적 분석가',
    colors: ['#38bdf8', '#0ea5e9', '#3b82f6', '#fbbf24', '#ffffff'],
  },
  2: {
    title: '2차시: 4컷 만화 스토리보드 완성!',
    subtitle: 'AI 윤리적 딜레마를 기승전결 스토리보드로 훌륭히 풀어냈습니다.',
    badge: '디지털 스토리텔러',
    colors: ['#c084fc', '#a855f7', '#ec4899', '#f472b6', '#fbbf24'],
  },
  3: {
    title: '3차시: 진실 탐사대 3D 미션 완수!',
    subtitle: '딥페이크와 가짜뉴스를 식별하고 팩트체크 교차 검증을 마쳤습니다.',
    badge: '팩트체크 수호대원',
    colors: ['#34d399', '#10b981', '#059669', '#f59e0b', '#38bdf8'],
  },
};

// Safe web audio harmonic chime
const playHarmonicChime = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    // Festive pentatonic arpeggio (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
    });
  } catch {
    // Graceful fallback if browser restricts audio
  }
};

/**
 * 학습 차시를 하나 완료할 때마다 화려한 폭죽 애니메이션과 축하 피드백을 제공하는 커스텀 훅
 */
export function useSessionConfetti(
  progress?: SessionProgress,
  options: { enableSound?: boolean; autoToast?: boolean } = { enableSound: true, autoToast: true }
) {
  const [activeToast, setActiveToast] = useState<ConfettiToastInfo | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep track of previous progress to detect newly completed sessions without firing on first load
  const isInitialMount = useRef(true);
  const prevProgressRef = useRef<{ [key: string]: boolean }>({
    session1: false,
    session2: false,
    session3: false,
  });

  const fireSessionConfetti = useCallback(
    (sessionNumber: number = 1) => {
      const meta = SESSION_METAS[sessionNumber] || {
        title: `${sessionNumber}차시 학습 완료!`,
        subtitle: '인공지능 리터러시 역량이 한 단계 더 향상되었습니다.',
        badge: '학습 마스터',
        colors: ['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#ec4899'],
      };

      if (options.enableSound !== false) {
        playHarmonicChime();
      }

      // 1단계: 좌측 하단 캐논 발사
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.7 },
        colors: meta.colors,
        zIndex: 9999,
      });

      // 1단계: 우측 하단 캐논 발사 (대칭 효과)
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.7 },
        colors: meta.colors,
        zIndex: 9999,
      });

      // 2단계: 250ms 후 중앙에서 퍼져나가는 별빛 & 원형 폭죽
      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 90,
          origin: { x: 0.5, y: 0.45 },
          scalar: 1.1,
          colors: meta.colors,
          zIndex: 9999,
        });
      }, 200);

      // 축하 토스트 알림 노출
      if (options.autoToast !== false) {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setActiveToast({
          sessionNumber,
          title: meta.title,
          subtitle: meta.subtitle,
          badge: meta.badge,
        });

        toastTimeoutRef.current = setTimeout(() => {
          setActiveToast(null);
        }, 4500);
      }
    },
    [options.enableSound, options.autoToast]
  );

  // Grand multi-burst fireworks for all sessions completion or special achievement
  const fireGrandCelebration = useCallback(() => {
    if (options.enableSound !== false) {
      playHarmonicChime();
    }

    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f472b6'];

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 40 * (timeLeft / duration);
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random() * 0.6 + 0.2,
          y: Math.random() * 0.4 + 0.2,
        },
        colors,
        zIndex: 9999,
      });
    }, 250);
  }, [options.enableSound]);

  // Dismiss toast manually
  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setActiveToast(null);
  }, []);

  // Automatic observation of progress state changes
  useEffect(() => {
    if (!progress) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevProgressRef.current = {
        session1: Boolean(progress.session1),
        session2: Boolean(progress.session2),
        session3: Boolean(progress.session3),
      };
      return;
    }

    // Detect newly completed session
    let newlyCompletedSession: number | null = null;
    if (!prevProgressRef.current.session1 && progress.session1) {
      newlyCompletedSession = 1;
    } else if (!prevProgressRef.current.session2 && progress.session2) {
      newlyCompletedSession = 2;
    } else if (!prevProgressRef.current.session3 && progress.session3) {
      newlyCompletedSession = 3;
    }

    // Update ref
    prevProgressRef.current = {
      session1: Boolean(progress.session1),
      session2: Boolean(progress.session2),
      session3: Boolean(progress.session3),
    };

    if (newlyCompletedSession !== null) {
      fireSessionConfetti(newlyCompletedSession);
    }
  }, [progress, fireSessionConfetti]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  return {
    fireSessionConfetti,
    fireGrandCelebration,
    activeToast,
    dismissToast,
  };
}
