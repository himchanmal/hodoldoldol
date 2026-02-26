/** 지출 타입 탭 목록 (월별 지출 페이지용) */
export const EXPENSE_TYPE_TABS = [
  { id: 'both', label: '호돌이와 돌돌이' },
  { id: 'hodol', label: '호돌이' },
  { id: 'doldol', label: '돌돌이' }
];

/** 타입별 "다른 탭으로 이동" 시 선택 가능한 대상 (현재 타입 제외) */
export const MOVE_TARGETS = EXPENSE_TYPE_TABS.reduce((acc, tab) => {
  acc[tab.id] = EXPENSE_TYPE_TABS.filter((t) => t.id !== tab.id);
  return acc;
}, {});
