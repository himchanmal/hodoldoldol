// 타입 라벨 (한 줄: 다이얼로그 제목 등)
export const TYPE_LABELS = {
  both: '호돌이와 돌돌이',
  hodol: '호돌이',
  doldol: '돌돌이',
  sum: '합계'
};

// 테이블 헤더용 (key + label, both는 줄바꿈 포함)
export const TYPES = [
  { key: 'both', label: '호돌이와\n돌돌이' },
  { key: 'hodol', label: '호돌이' },
  { key: 'doldol', label: '돌돌이' }
];

// 셀 최소 너비 (SummaryPage 메인 테이블)
export const SUMMARY_CELL_MIN_WIDTH = 100;
// 합계 열(금액+비율 표시) 최소 너비
export const SUMMARY_SUM_CELL_MIN_WIDTH = 150;

// 공통 테이블 스타일
export const summaryHeaderRowSx = { bgcolor: 'grey.100' };
export const summaryTotalRowSx = {
  bgcolor: 'grey.200',
  borderTop: 2,
  borderColor: 'divider'
};

// SummaryPage 클릭 가능 셀
export const summaryDataCellSx = (base = {}) => ({
  ...base,
  cursor: 'pointer',
  '&:hover': { bgcolor: 'action.hover' }
});
export const summaryStickyDataCellSx = (base = {}) => ({
  ...base,
  cursor: 'pointer',
  '&:hover': { bgcolor: 'grey.100' }
});

// SummaryDetailDialog 금액 셀
export const summaryDialogAmountCellSx = {
  textAlign: 'right',
  minWidth: 90
};
export const summaryDialogAmountCellSxWide = {
  textAlign: 'right',
  minWidth: 110
};
export const summaryDialogAmountCellSxNarrow = {
  textAlign: 'right',
  minWidth: 110
};

// SummaryDetailDialog 테이블 헤더 셀 (공통)
export const summaryDialogHeaderCellSx = {
  fontWeight: 600,
  textAlign: 'right'
};

/** { both, hodol, doldol } 합계 */
export function sumTypeRow(o) {
  return (o?.both ?? 0) + (o?.hodol ?? 0) + (o?.doldol ?? 0);
}
