import React, {useState, useMemo} from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {useCategoryContext} from '../contexts/CategoryContext.js';
import {formatAmount} from '../utils/expense.js';
import {useSummaryData, TYPES} from '../hooks/useSummaryData.js';
import SummaryDetailDialog from '../components/SummaryDetailDialog.js';
import {
  SUMMARY_CELL_MIN_WIDTH,
  summaryHeaderRowSx,
  summaryTotalRowSx,
  summaryDataCellSx,
  summaryStickyDataCellSx
} from '../utils/summary.js';

function SummaryPage() {
  const theme = useTheme();
  const isStickyCategory = useMediaQuery(theme.breakpoints.up('md'));
  const {majorCategories} = useCategoryContext();
  const {
    loading,
    error,
    expensesByMonth,
    sumsByCategoryAndMonth,
    totalsByMonth,
    categoryTotals,
    grandTotals,
    usedMonths
  } = useSummaryData();
  const [detailContext, setDetailContext] = useState(null);

  const minorBreakdown = useMemo(() => {
    if (!detailContext) return {rows: [], type: 'sum'};
    const {major, month, type} = detailContext;
    const byMinor = {};
    const monthsToUse = month !== null ? [month] : usedMonths;
    const typesToUse = type === 'sum' ? TYPES.map((t) => t.key) : [type];

    monthsToUse.forEach((m) => {
      typesToUse.forEach((key) => {
        const list = expensesByMonth[m]?.[key] || [];
        list.forEach((e) => {
          const maj = e.major_category || e.majorCategory;
          const minor = e.minor_category || e.minorCategory || '(미분류)';
          if (maj !== major) return;
          if (!byMinor[minor]) byMinor[minor] = {both: 0, hodol: 0, doldol: 0};
          byMinor[minor][key] += Number(e.amount) || 0;
        });
      });
    });

    const rows = Object.entries(byMinor)
      .map(([minor, amounts]) => ({
        minor,
        ...amounts,
        sum: (amounts.both || 0) + (amounts.hodol || 0) + (amounts.doldol || 0)
      }))
      .sort((a, b) => b.sum - a.sum);
    return {rows, type};
  }, [detailContext, expensesByMonth, usedMonths]);

  if (loading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200}}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error">총괄장 데이터를 불러오는 중 오류가 발생했습니다: {error}</Alert>
      </Box>
    );
  }

  if (usedMonths.length === 0) {
    return (
      <Box sx={{py: 4, textAlign: 'center', color: 'text.secondary'}}>
        이번 해에 지출 데이터가 없습니다.
      </Box>
    );
  }

  const stickyCategoryStyle = isStickyCategory
    ? {
        position: 'sticky',
        right: 0,
        zIndex: 1,
        minWidth: SUMMARY_CELL_MIN_WIDTH,
        width: SUMMARY_CELL_MIN_WIDTH,
        boxSizing: 'border-box',
        bgcolor: 'grey.50'
      }
    : {minWidth: SUMMARY_CELL_MIN_WIDTH, width: SUMMARY_CELL_MIN_WIDTH, boxSizing: 'border-box', bgcolor: 'grey.50'};
  const stickyCategoryLeftEdge = isStickyCategory
    ? {
        ...stickyCategoryStyle,
        borderLeft: 1,
        borderColor: 'divider',
        boxShadow: 'inset 6px 0 10px -4px rgba(0,0,0,0.06)'
      }
    : {...stickyCategoryStyle, borderLeft: 1, borderColor: 'divider'};

  const tableWidth = Math.max(800, 100 + usedMonths.length * 4 * SUMMARY_CELL_MIN_WIDTH + 4 * SUMMARY_CELL_MIN_WIDTH);

  return (
    <Box sx={{overflowX: 'auto'}}>
      <Table size="small" sx={{width: tableWidth, tableLayout: 'fixed'}}>
        <colgroup>
          <col style={{width: 100}} />
          {usedMonths.flatMap((month) =>
            [0, 1, 2, 3].map((i) => (
              <col key={`m${month}-${i}`} style={{width: SUMMARY_CELL_MIN_WIDTH}} />
            ))
          )}
          <col style={{width: SUMMARY_CELL_MIN_WIDTH}} />
          <col style={{width: SUMMARY_CELL_MIN_WIDTH}} />
          <col style={{width: SUMMARY_CELL_MIN_WIDTH}} />
          <col style={{width: SUMMARY_CELL_MIN_WIDTH}} />
        </colgroup>
        <TableHead>
          <TableRow sx={summaryHeaderRowSx}>
            <TableCell sx={{fontWeight: 600, minWidth: 100, position: 'sticky', left: 0, bgcolor: 'grey.100', zIndex: 1}}>
              대분류
            </TableCell>
            {usedMonths.map((month, monthIdx) => (
              <TableCell
                key={month}
                colSpan={4}
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  p: 0,
                  borderRight: monthIdx < usedMonths.length - 1 ? 1 : 0,
                  borderColor: 'divider'
                }}
              >
                {month}월
              </TableCell>
            ))}
            <TableCell
              colSpan={4}
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                p: 0,
                bgcolor: 'grey.200',
                borderLeft: 1,
                borderColor: 'divider',
                ...(isStickyCategory && {
                  position: 'sticky',
                  right: 0,
                  zIndex: 1,
                  boxShadow: 'inset 6px 0 10px -4px rgba(0,0,0,0.06)'
                })
              }}
            >
              카테고리별 누계
            </TableCell>
          </TableRow>
          <TableRow sx={{bgcolor: 'grey.50'}}>
            <TableCell sx={{position: 'sticky', left: 0, bgcolor: 'grey.50', zIndex: 1}} />
            {usedMonths.map((month, monthIdx) =>
              TYPES.concat({key: 'sum', label: '합계'}).map(({key, label}, typeIdx) => (
                <TableCell
                  key={`${month}-${key}`}
                  sx={{
                    fontWeight: 600,
                    textAlign: 'right',
                    minWidth: SUMMARY_CELL_MIN_WIDTH,
                    whiteSpace: key === 'both' ? 'pre-line' : undefined,
                    borderRight: monthIdx < usedMonths.length - 1 && typeIdx === 3 ? 1 : 0,
                    borderColor: 'divider'
                  }}
                >
                  {label}
                </TableCell>
              ))
            )}
            {TYPES.concat({key: 'sum', label: '합계'}).map(({key, label}, i) => (
              <TableCell
                key={`cat-${key}`}
                sx={{
                  ...(i === 0 ? stickyCategoryLeftEdge : stickyCategoryStyle),
                  fontWeight: 600,
                  textAlign: 'right',
                  bgcolor: 'grey.100',
                  whiteSpace: key === 'both' ? 'pre-line' : undefined,
                  ...(isStickyCategory && {right: SUMMARY_CELL_MIN_WIDTH * (3 - i)})
                }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {majorCategories.map((major) => (
            <TableRow key={major} sx={{'&:hover': {bgcolor: 'grey.50'}}}>
              <TableCell sx={{fontWeight: 500, position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 0}}>
                {major}
              </TableCell>
              {usedMonths.map((month, monthIdx) => {
                const row = sumsByCategoryAndMonth[major]?.[month] || {both: 0, hodol: 0, doldol: 0};
                const sum = row.both + row.hodol + row.doldol;
                const borderRight = monthIdx < usedMonths.length - 1 ? {borderRight: 1, borderColor: 'divider'} : {};
                return (
                  <React.Fragment key={month}>
                    <TableCell sx={summaryDataCellSx({textAlign: 'right', minWidth: SUMMARY_CELL_MIN_WIDTH})} onClick={() => Number(row.both) !== 0 && setDetailContext({major, month, type: 'both'})}>{formatAmount(row.both)}</TableCell>
                    <TableCell sx={summaryDataCellSx({textAlign: 'right', minWidth: SUMMARY_CELL_MIN_WIDTH})} onClick={() => Number(row.hodol) !== 0 && setDetailContext({major, month, type: 'hodol'})}>{formatAmount(row.hodol)}</TableCell>
                    <TableCell sx={summaryDataCellSx({textAlign: 'right', minWidth: SUMMARY_CELL_MIN_WIDTH})} onClick={() => Number(row.doldol) !== 0 && setDetailContext({major, month, type: 'doldol'})}>{formatAmount(row.doldol)}</TableCell>
                    <TableCell sx={summaryDataCellSx({textAlign: 'right', fontWeight: 500, minWidth: SUMMARY_CELL_MIN_WIDTH, ...borderRight})} onClick={() => Number(sum) !== 0 && setDetailContext({major, month, type: 'sum'})}>{formatAmount(sum)}</TableCell>
                  </React.Fragment>
                );
              })}
              {(() => {
                const ct = categoryTotals[major] || {both: 0, hodol: 0, doldol: 0};
                const catSum = ct.both + ct.hodol + ct.doldol;
                const baseRight = {
                  minWidth: SUMMARY_CELL_MIN_WIDTH,
                  width: SUMMARY_CELL_MIN_WIDTH,
                  boxSizing: 'border-box',
                  bgcolor: 'grey.50'
                };
                const stickyRight = isStickyCategory
                  ? { ...baseRight, position: 'sticky', right: 0, zIndex: 2, isolation: 'isolate' }
                  : baseRight;
                const stickyRightFirst = isStickyCategory
                  ? { ...stickyRight, borderLeft: 1, borderColor: 'divider', boxShadow: 'inset 6px 0 10px -4px rgba(0,0,0,0.06)' }
                  : { ...stickyRight, borderLeft: 1, borderColor: 'divider' };
                const rightOffsets = isStickyCategory
                  ? [SUMMARY_CELL_MIN_WIDTH * 3, SUMMARY_CELL_MIN_WIDTH * 2, SUMMARY_CELL_MIN_WIDTH, 0]
                  : [null, null, null, null];
                return (
                  <>
                    <TableCell sx={{...stickyRightFirst, ...summaryStickyDataCellSx({textAlign: 'right', fontWeight: 500, ...(rightOffsets[0] != null && {right: rightOffsets[0]})})}} onClick={() => Number(ct.both) !== 0 && setDetailContext({major, month: null, type: 'both'})}>{formatAmount(ct.both)}</TableCell>
                    <TableCell sx={{...stickyRight, ...summaryStickyDataCellSx({textAlign: 'right', fontWeight: 500, ...(rightOffsets[1] != null && {right: rightOffsets[1]})})}} onClick={() => Number(ct.hodol) !== 0 && setDetailContext({major, month: null, type: 'hodol'})}>{formatAmount(ct.hodol)}</TableCell>
                    <TableCell sx={{...stickyRight, ...summaryStickyDataCellSx({textAlign: 'right', fontWeight: 500, ...(rightOffsets[2] != null && {right: rightOffsets[2]})})}} onClick={() => Number(ct.doldol) !== 0 && setDetailContext({major, month: null, type: 'doldol'})}>{formatAmount(ct.doldol)}</TableCell>
                    <TableCell sx={{...stickyRight, ...summaryStickyDataCellSx({textAlign: 'right', fontWeight: 600, ...(rightOffsets[3] != null && {right: rightOffsets[3]})})}} onClick={() => Number(catSum) !== 0 && setDetailContext({major, month: null, type: 'sum'})}>{formatAmount(catSum)}</TableCell>
                  </>
                );
              })()}
            </TableRow>
          ))}
          <TableRow sx={summaryTotalRowSx}>
            <TableCell sx={{fontWeight: 700, position: 'sticky', left: 0, bgcolor: 'grey.200', zIndex: 0}}>
              월별 누계
            </TableCell>
            {usedMonths.map((month, monthIdx) => {
              const t = totalsByMonth[month] || {both: 0, hodol: 0, doldol: 0};
              const totalSum = t.both + t.hodol + t.doldol;
              const borderRight = monthIdx < usedMonths.length - 1 ? {borderRight: 1, borderColor: 'divider'} : {};
              return (
                <React.Fragment key={month}>
                  <TableCell sx={{textAlign: 'right', fontWeight: 600, minWidth: SUMMARY_CELL_MIN_WIDTH}}>{formatAmount(t.both)}</TableCell>
                  <TableCell sx={{textAlign: 'right', fontWeight: 600, minWidth: SUMMARY_CELL_MIN_WIDTH}}>{formatAmount(t.hodol)}</TableCell>
                  <TableCell sx={{textAlign: 'right', fontWeight: 600, minWidth: SUMMARY_CELL_MIN_WIDTH}}>{formatAmount(t.doldol)}</TableCell>
                  <TableCell sx={{textAlign: 'right', fontWeight: 700, minWidth: SUMMARY_CELL_MIN_WIDTH, ...borderRight}}>{formatAmount(totalSum)}</TableCell>
                </React.Fragment>
              );
            })}
            {(() => {
              const g = grandTotals;
              const grandSum = g.both + g.hodol + g.doldol;
              const baseRight = {
                minWidth: SUMMARY_CELL_MIN_WIDTH,
                width: SUMMARY_CELL_MIN_WIDTH,
                boxSizing: 'border-box',
                bgcolor: 'grey.200'
              };
              const stickyRight = isStickyCategory
                ? { ...baseRight, position: 'sticky', right: 0, zIndex: 0 }
                : baseRight;
              const stickyRightFirst = isStickyCategory
                ? { ...stickyRight, borderLeft: 1, borderColor: 'divider', boxShadow: 'inset 6px 0 10px -4px rgba(0,0,0,0.06)' }
                : { ...stickyRight, borderLeft: 1, borderColor: 'divider' };
              const rightOffsets = isStickyCategory
                ? [SUMMARY_CELL_MIN_WIDTH * 3, SUMMARY_CELL_MIN_WIDTH * 2, SUMMARY_CELL_MIN_WIDTH, 0]
                : [null, null, null, null];
              return (
                <>
                  <TableCell sx={{...stickyRightFirst, textAlign: 'right', fontWeight: 700, ...(rightOffsets[0] != null && {right: rightOffsets[0]})}}>{formatAmount(g.both)}</TableCell>
                  <TableCell sx={{...stickyRight, textAlign: 'right', fontWeight: 700, ...(rightOffsets[1] != null && {right: rightOffsets[1]})}}>{formatAmount(g.hodol)}</TableCell>
                  <TableCell sx={{...stickyRight, textAlign: 'right', fontWeight: 700, ...(rightOffsets[2] != null && {right: rightOffsets[2]})}}>{formatAmount(g.doldol)}</TableCell>
                  <TableCell sx={{...stickyRight, textAlign: 'right', fontWeight: 700, ...(rightOffsets[3] != null && {right: rightOffsets[3]})}}>{formatAmount(grandSum)}</TableCell>
                </>
              );
            })()}
          </TableRow>
        </TableBody>
      </Table>

      <SummaryDetailDialog
        open={Boolean(detailContext)}
        onClose={() => setDetailContext(null)}
        detailContext={detailContext}
        minorBreakdown={minorBreakdown}
        formatAmount={formatAmount}
      />
    </Box>
  );
}

export default SummaryPage;
