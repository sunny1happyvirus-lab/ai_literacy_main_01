export interface SessionStep {
  step: number;
  title: string;
  desc: string;
  iconName: string;
}

export type CustomSessionUrls = Record<number, string>;

export interface UploadedHtmlMeta {
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  uploadedAt: string;
  sessionId: number;
}

export interface SessionData {
  id: number;
  period: string; // "1차시", "2차시", "3차시"
  title: string;
  subtitle: string;
  badge: string;
  themeColor: string; // tailwind color token or hex
  accentColor: string;
  bgGradient: string;
  borderAccent: string;
  appUrl: string;
  isInternalApp?: boolean;
  timeMinutes: number;
  keyQuestion: string;
  overview: string;
  learningObjectives: string[];
  materials?: string[];
  keywords: string[];
  steps: SessionStep[];
  detailedGuide: {
    introText: string;
    flowStages: { title: string; desc: string; guideTips: string[] }[];
    worksheetPrompts: string[];
    assessmentCriteria: { standard: string; points: string }[];
    teacherNotes: string;
  };
}

export interface StudentProfile {
  schoolName: string;
  grade: string;
  classNum: string;
  studentNo: string;
  name: string;
  avatarEmoji: string;
  remindNotificationsEnabled?: boolean;
}

export interface ReflectionEntry {
  learned: string;
  felt: string;
  pledge: string;
  rating: number;
  mood: string;
  updatedAt: string;
}

export interface WeeklyDayActivity {
  day: string;
  shortDay: string;
  minutes: number;
  activityCount: number;
  sessionTitle?: string;
  isToday?: boolean;
}

export interface SessionProgress {
  session1: boolean;
  session2: boolean;
  session3: boolean;
  reflections: {
    [key: number]: ReflectionEntry | string;
  };
  badgeEarned?: boolean;
  badgeIssuedAt?: string;
  badgeSerial?: string;
  customWeeklyActivity?: WeeklyDayActivity[];
}

export interface QuizQuestion {
  id: number;
  sessionId: number; // 1, 2, or 3
  sessionTitle: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  badge: string;
}

export type NoticeCategory = 'urgent' | 'assignment' | 'hint' | 'general';

export interface TeacherNotice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  targetClass: string; // '전체' | '1반' | '2반' | '3반' etc.
  author: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isPinned?: boolean;
}

