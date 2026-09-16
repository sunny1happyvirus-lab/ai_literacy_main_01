import { TeacherNotice } from '../types';

export const DEFAULT_TEACHER_NOTICES: TeacherNotice[] = [
  {
    id: 'notice-1',
    title: '🚨 [필독] 3차시 가상 탐사 미션 실행 전 개인 이어폰 준비 안내',
    content: '3차시 3D 미션 게임인 「진실 탐사대」는 딥보이스 음성 판별 단서가 포함되어 있으므로 개인 이어폰을 착용한 후 탐사를 시작해주세요. 본인 학급(예: 3반)을 선택하여 입장합니다.',
    category: 'urgent',
    targetClass: '전체',
    author: '정보 교사',
    createdAt: '2026-09-15 09:00',
    updatedAt: '2026-09-15 09:00',
    isActive: true,
    isPinned: true,
  },
  {
    id: 'notice-2',
    title: '📝 2차시 4컷 만화 스토리보드 완성 후 성찰일기 작성 안내',
    content: '2차시 AI 윤리 쟁점(과제 대필, 딥페이크) 4컷 만화 구상을 마친 대원은 [성찰일기 작성하기]를 통해 배운 점과 실천 다짐을 오늘 수업 종료 전까지 제출해주세요.',
    category: 'assignment',
    targetClass: '전체',
    author: '교과 협력팀',
    createdAt: '2026-09-15 10:15',
    updatedAt: '2026-09-15 10:15',
    isActive: true,
    isPinned: false,
  },
  {
    id: 'notice-3',
    title: '💡 3차시 팩트체크 미션 팁: 딥페이크 미세 단서 찾기',
    content: '합성 영상은 눈 깜빡임 주기, 입술 싱크의 부자연스러움, 귀걸이나 안경 테두리 경계면의 일그러짐을 유심히 관찰하면 판별할 수 있습니다!',
    category: 'hint',
    targetClass: '전체',
    author: '정보 교사',
    createdAt: '2026-09-15 11:20',
    updatedAt: '2026-09-15 11:20',
    isActive: false,
    isPinned: false,
  },
];

export const NOTICE_PRESET_TEMPLATES = [
  {
    title: '🚨 [필독] 개인 이어폰 준비 및 착용 안내',
    content: '3차시 3D 미션 게임 「진실 탐사대」의 딥보이스 판별 단서 청취를 위해 개인 이어폰을 착용한 상태로 진행해 주시기 바랍니다.',
    category: 'urgent' as const,
    targetClass: '전체',
  },
  {
    title: '📝 차시별 성찰일기 작성 및 마감 안내',
    content: '오늘 수업 활동을 모두 마친 대원은 각 차시별 [성찰일기 작성] 버튼을 눌러 오늘 배운 점, 느낀 점, 앞으로의 다짐을 성실히 기록해 주세요. (생활기록부 교과 세특 연계)',
    category: 'assignment' as const,
    targetClass: '전체',
  },
  {
    title: '🔑 3차시 진실 탐사대 학급코드 선택 안내',
    content: '3차시 탐사대 시작 시 학급코드 선택 창에서 본인의 소속 학급(예: 2학년 3반)을 정확히 선택한 후 학번과 이름을 입력해야 실시간 점수가 교사 대시보드에 정상 집계됩니다.',
    category: 'general' as const,
    targetClass: '전체',
  },
  {
    title: '💡 팩트체크 단서 분석 힌트',
    content: '뉴스 기사의 보도 일자, 작성 기자 바이라인 유무, 출처 기관의 공식 웹사이트 주소(도메인 확인)를 교차 검증해 보세요.',
    category: 'hint' as const,
    targetClass: '전체',
  },
];
