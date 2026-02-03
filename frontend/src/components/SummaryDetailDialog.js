import React from 'react';
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
import {
  TYPE_LABELS,
  summaryHeaderRowSx,
  summaryTotalRowSx,
  summaryDialogAmountCellSx,
  summaryDialogAmountCellSxWide,
  summaryDialogAmountCellSxNarrow,
  summaryDialogHeaderCellSx
} from '../utils/summary.js';

function SummaryDetailDialog({open, onClose, detailContext, minorBreakdown, formatAmount: formatAmountProp}) {
  const format = formatAmountProp || formatAmount;

  if (!detailContext) return null;

  const title = `${detailContext.month !== null ? `${detailContext.month}월` : "누계"}  ${detailContext.major}(${TYPE_LABELS[detailContext.type]})`;
  const {rows, type} = minorBreakdown || {rows: [], type: 'sum'};

  const totalRow = rows.length
    ? rows.reduce(
        (acc, row) => ({
          both: acc.both + (row.both || 0),
          hodol: acc.hodol + (row.hodol || 0),
          doldol: acc.doldol + (row.doldol || 0),
          sum: acc.sum + (row.sum || 0)
        }),
        {both: 0, hodol: 0, doldol: 0, sum: 0}
      )
    : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '16px',
          p: "8px 16px 8px 24px",
          '&.MuiDialogTitle-root': { borderBottom: 'none' }
        }}
      >
        <span>{title}</span>
        <IconButton size="small" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{overflowX: 'auto', minWidth: 0}}>
          {type === 'sum' ? (
            <Table size="small" sx={{tableLayout: 'fixed', minWidth: 480}}>
              <colgroup>
                <col style={{width: '24%'}} />
                <col style={{width: '19%'}} />
                <col style={{width: '19%'}} />
                <col style={{width: '19%'}} />
                <col style={{width: '19%'}} />
              </colgroup>
              <TableHead>
                <TableRow sx={summaryHeaderRowSx}>
                  <TableCell sx={{fontWeight: 600, minWidth: 100}}>소분류</TableCell>
                  <TableCell sx={{...summaryDialogHeaderCellSx, minWidth: 110, whiteSpace: 'pre-line'}}>호돌이와{'\n'}돌돌이</TableCell>
                  <TableCell sx={{...summaryDialogHeaderCellSx, minWidth: 90}}>호돌이</TableCell>
                  <TableCell sx={{...summaryDialogHeaderCellSx, minWidth: 90}}>돌돌이</TableCell>
                  <TableCell sx={{...summaryDialogHeaderCellSx, minWidth: 90}}>합계</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(({minor, both, hodol, doldol, sum}) => (
                  <TableRow key={minor}>
                    <TableCell sx={{minWidth: 100}}>{minor}</TableCell>
                    <TableCell sx={summaryDialogAmountCellSxWide}>{format(both)}</TableCell>
                    <TableCell sx={summaryDialogAmountCellSx}>{format(hodol)}</TableCell>
                    <TableCell sx={summaryDialogAmountCellSx}>{format(doldol)}</TableCell>
                    <TableCell sx={{...summaryDialogAmountCellSx, fontWeight: 500}}>{format(sum)}</TableCell>
                  </TableRow>
                ))}
                {totalRow && (
                  <TableRow sx={summaryTotalRowSx}>
                    <TableCell sx={{fontWeight: 700, minWidth: 100}}>소분류 합계</TableCell>
                    <TableCell sx={{...summaryDialogAmountCellSxWide, fontWeight: 700}}>{format(totalRow.both)}</TableCell>
                    <TableCell sx={{...summaryDialogAmountCellSx, fontWeight: 700}}>{format(totalRow.hodol)}</TableCell>
                    <TableCell sx={{...summaryDialogAmountCellSx, fontWeight: 700}}>{format(totalRow.doldol)}</TableCell>
                    <TableCell sx={{...summaryDialogAmountCellSx, fontWeight: 700}}>{format(totalRow.sum)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table size="small" sx={{tableLayout: 'fixed', minWidth: 300}}>
              <colgroup>
                <col style={{width: '60%'}} />
                <col style={{width: '40%'}} />
              </colgroup>
              <TableHead>
                <TableRow sx={summaryHeaderRowSx}>
                  <TableCell sx={{fontWeight: 600, minWidth: 140}}>소분류</TableCell>
                  <TableCell sx={{...summaryDialogHeaderCellSx, minWidth: 110}}>금액</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.minor}>
                    <TableCell sx={{minWidth: 140}}>{row.minor}</TableCell>
                    <TableCell sx={{...summaryDialogAmountCellSxNarrow, fontWeight: 500}}>{format(row[detailContext.type] ?? 0)}</TableCell>
                  </TableRow>
                ))}
                {totalRow && (
                  <TableRow sx={summaryTotalRowSx}>
                    <TableCell sx={{fontWeight: 700, minWidth: 140}}>소분류 합계</TableCell>
                    <TableCell sx={{...summaryDialogAmountCellSxNarrow, fontWeight: 700}}>{format(totalRow[detailContext.type] ?? 0)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default SummaryDetailDialog;
