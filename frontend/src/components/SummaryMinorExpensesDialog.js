import React, {useMemo} from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {formatAmount} from '../utils/expense.js';
import {apiDateToYmd} from '../utils/date.js';
import {TYPE_LABELS, summaryHeaderRowSx, summaryDialogHeaderCellSx} from '../utils/summary.js';

const TYPE_KEY = (e) => (e.type || 'both').toLowerCase();

const thCompact = {minWidth: 0, width: 'auto', maxWidth: 'none', whiteSpace: 'nowrap'};
const tdCompact = {minWidth: 0, width: 'auto', maxWidth: 'none', whiteSpace: 'nowrap', py: 0.75};

function sortExpenseItems(items) {
  return [...items].sort((a, b) => {
    const da = apiDateToYmd(a.date) || '';
    const db = apiDateToYmd(b.date) || '';
    if (da !== db) return db.localeCompare(da);
    return (b.id || 0) - (a.id || 0);
  });
}

function SummaryMinorExpensesDialog({
  open,
  onClose,
  majorCategory,
  minorCategory,
  items = [],
  showMonthCol,
  formatAmount: formatAmountProp
}) {
  const format = formatAmountProp || formatAmount;
  const sortedItems = useMemo(() => sortExpenseItems(items), [items]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" disableScrollLock>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '15px',
          py: 1,
          px: 2
        }}
      >
        <span>
          {majorCategory} · {minorCategory} 지출 내역
        </span>
        <IconButton size="small" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{pt: 0, pb: 2, px: {xs: 1, sm: 2}}}>
        <Box
          sx={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            mx: {xs: -1, sm: -2},
            px: {xs: 1, sm: 2}
          }}
        >
          <Table
            size="small"
            sx={{
              tableLayout: 'auto',
              width: 'max-content'
            }}
          >
            <TableHead>
              <TableRow sx={summaryHeaderRowSx}>
                {showMonthCol && (
                  <TableCell sx={{fontWeight: 600, ...thCompact}}>월</TableCell>
                )}
                <TableCell sx={{fontWeight: 600, ...thCompact}}>날짜</TableCell>
                <TableCell sx={{fontWeight: 600, ...thCompact}}>구분</TableCell>
                <TableCell sx={{...summaryDialogHeaderCellSx, ...thCompact}}>금액</TableCell>
                <TableCell sx={{fontWeight: 600, minWidth: 0}}>메모</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((e) => (
                <TableRow key={e.id ?? `${e.date}-${e.amount}-${TYPE_KEY(e)}`}>
                  {showMonthCol && (
                    <TableCell sx={tdCompact}>{e.month != null ? `${e.month}월` : ''}</TableCell>
                  )}
                  <TableCell sx={tdCompact}>{apiDateToYmd(e.date) || '—'}</TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.8125rem',
                      whiteSpace: 'nowrap',
                      ...tdCompact
                    }}
                  >
                    {TYPE_LABELS[TYPE_KEY(e)] ?? TYPE_KEY(e)}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      fontWeight: 500,
                      fontVariantNumeric: 'tabular-nums',
                      ...tdCompact
                    }}
                  >
                    {format(Number(e.amount) || 0)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.8125rem',
                      color: 'text.secondary',
                      minWidth: 0,
                      maxWidth: 280
                    }}
                  >
                    {e.note != null && e.note !== '' ? String(e.note) : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default SummaryMinorExpensesDialog;
