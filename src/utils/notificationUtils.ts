import { SessionProgress } from '../types';

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    return Notification.permission;
  } catch {
    return 'unsupported';
  }
};

export const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Browser notification permission request failed or restricted in iframe:', err);
    return 'denied';
  }
};

export const getUnwrittenReflectionSessions = (progress?: SessionProgress): number[] => {
  if (!progress) return [1, 2, 3];
  const unwritten: number[] = [];
  [1, 2, 3].forEach((sessId) => {
    const r = progress.reflections?.[sessId];
    const isWritten = Boolean(typeof r === 'string' ? r.trim() : r?.learned || r?.felt || r?.pledge);
    if (!isWritten) {
      unwritten.push(sessId);
    }
  });
  return unwritten;
};

export const sendReflectionReminderNotification = (
  studentName: string,
  missingSessionIds: number[]
): boolean => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const sessionNames = missingSessionIds.length > 0
      ? `${missingSessionIds.join(', ')}차시`
      : '아직 완료하지 않은 차시';

    const title = '📝 AI 리터러시 성찰 일기 작성 알림';
    const body = `${studentName} 대원님, ${sessionNames} 성찰 일기가 아직 작성되지 않았습니다! 배운 점과 느낀 점을 기록하고 'AI 리터러시 마스터' 배지를 획득하세요! ✨`;

    const n = new Notification(title, {
      body,
      tag: 'ai-literacy-reflection-reminder',
      badge: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    });

    n.onclick = () => {
      window.focus();
      n.close();
    };

    return true;
  } catch (err) {
    console.warn('Failed to dispatch notification:', err);
    return false;
  }
};

export const sendTestNotification = (studentName: string): boolean => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const n = new Notification('🔔 알림 설정 테스트 완료', {
      body: `${studentName} 대원님, 브라우저 로컬 알림이 정상적으로 등록되었습니다. 미완료된 성찰 일기 알림을 제때 받아보실 수 있습니다!`,
      tag: 'ai-literacy-test-notification',
    });

    n.onclick = () => {
      window.focus();
      n.close();
    };

    return true;
  } catch (err) {
    console.warn('Failed to send test notification:', err);
    return false;
  }
};
