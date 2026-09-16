import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Sparkles,
  School,
  Bell,
  BellRing,
  BellOff,
  CheckCircle2,
  AlertCircle,
  Send,
  Info,
} from 'lucide-react';
import { StudentProfile, SessionProgress } from '../types';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  getUnwrittenReflectionSessions,
  sendReflectionReminderNotification,
  sendTestNotification,
} from '../utils/notificationUtils';

interface StudentProfileModalProps {
  currentProfile: StudentProfile;
  progress?: SessionProgress;
  onSave: (profile: StudentProfile) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = ['🧑‍🚀', '👩‍🚀', '🧑‍🎓', '👩‍🎓', '🕵️‍♂️', '🕵️‍♀️', '🤖', '🦊', '🦉', '⚡'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  currentProfile,
  progress,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({
    ...currentProfile,
    remindNotificationsEnabled: currentProfile.remindNotificationsEnabled ?? false,
  });

  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>(
    'default'
  );
  const [testSent, setTestSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setPermissionStatus(getNotificationPermission());
  }, []);

  const unwrittenSessions = getUnwrittenReflectionSessions(progress);

  const handleToggleNotification = async (checked: boolean) => {
    if (!checked) {
      setFormData((prev) => ({ ...prev, remindNotificationsEnabled: false }));
      setStatusMessage('성찰 일기 알림이 해제되었습니다.');
      return;
    }

    if (!isNotificationSupported()) {
      setStatusMessage('현재 브라우저 환경에서는 알림 API를 지원하지 않습니다.');
      return;
    }

    const permission = await requestNotificationPermission();
    setPermissionStatus(permission);

    if (permission === 'granted') {
      setFormData((prev) => ({ ...prev, remindNotificationsEnabled: true }));
      setStatusMessage('알림 권한이 허용되었습니다! 미작성 성찰 일기가 있을 때 리마인드됩니다.');

      // If there are unwritten reflections, trigger an initial reminder
      if (unwrittenSessions.length > 0) {
        setTimeout(() => {
          sendReflectionReminderNotification(formData.name || '대원', unwrittenSessions);
        }, 500);
      }
    } else if (permission === 'denied') {
      setFormData((prev) => ({ ...prev, remindNotificationsEnabled: false }));
      setStatusMessage(
        '브라우저에서 알림이 차단되었습니다. 브라우저 주소창 설정에서 알림을 허용해주세요.'
      );
    } else {
      setFormData((prev) => ({ ...prev, remindNotificationsEnabled: false }));
    }
  };

  const handleSendTest = () => {
    const success = sendTestNotification(formData.name || '학습자');
    if (success) {
      setTestSent(true);
      setStatusMessage('테스트 알림을 발송했습니다! (우측 상단/하단 브라우저 알림 확인)');
      setTimeout(() => setTestSent(false), 3000);
    } else {
      setStatusMessage('알림을 표시하지 못했습니다. 브라우저 알림 권한을 확인해주세요.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">학습자 프로필 및 알림 설정</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              아바타 선택
            </label>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setFormData({ ...formData, avatarEmoji: emoji })}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition border shrink-0 ${
                    formData.avatarEmoji === emoji
                      ? 'bg-sky-500/20 border-sky-400 scale-110 shadow-sm shadow-sky-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* School Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              학교 이름
            </label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              placeholder="예: 서울중학교"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-400 transition"
              required
            />
          </div>

          {/* Grade, Class, No */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">학년</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="2학년"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-400 text-center"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">반</label>
              <input
                type="text"
                value={formData.classNum}
                onChange={(e) => setFormData({ ...formData, classNum: e.target.value })}
                placeholder="3반"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-400 text-center"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">번호</label>
              <input
                type="text"
                value={formData.studentNo}
                onChange={(e) => setFormData({ ...formData, studentNo: e.target.value })}
                placeholder="15번"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-400 text-center"
                required
              />
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">학생 이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="홍길동"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-400"
              required
            />
          </div>

          {/* Browser Local Notification Settings Toggle Section */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-2 rounded-xl border mt-0.5 ${
                      formData.remindNotificationsEnabled
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {formData.remindNotificationsEnabled ? (
                      <BellRing className="w-4 h-4 animate-bounce" />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        성찰 일기 리마인더 알림
                      </span>
                      {permissionStatus === 'granted' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                          브라우저 허용됨
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      아직 완료하지 않은 차시의 성찰 일기가 있을 때, 브라우저 로컬 알림을 통해 작성할 수 있도록 리마인드합니다.
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.remindNotificationsEnabled)}
                    onChange={(e) => handleToggleNotification(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Status or Details inside notification card */}
              {formData.remindNotificationsEnabled && (
                <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      {unwrittenSessions.length > 0 ? (
                        <>
                          현재 <strong>{unwrittenSessions.join(', ')}차시</strong> 성찰 일기가 미작성 상태입니다.
                        </>
                      ) : (
                        <>모든 차시의 성찰 일기가 작성되었습니다! 🎉</>
                      )}
                    </span>
                  </div>

                  {permissionStatus === 'granted' && (
                    <button
                      type="button"
                      onClick={handleSendTest}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      title="브라우저 알림이 뜨는지 테스트합니다"
                    >
                      <Send className="w-3 h-3 text-amber-400" />
                      <span>{testSent ? '발송 완료!' : '테스트 알림'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Status Message / Hint */}
              {statusMessage && (
                <div className="text-[11px] text-sky-300 bg-sky-950/40 p-2 rounded-lg border border-sky-800/50 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            * 입력하신 정보는 종합 수료증 발급 및 차시별 활동 기록에 반영되며, 외부 서버로 전송되지 않고 본 브라우저에 안전하게 보관됩니다.
          </p>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition hover:scale-[1.02]"
            >
              <UserCheck className="w-4 h-4" />
              <span>저장하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
