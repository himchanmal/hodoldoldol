import React, {memo, useMemo, useState} from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  IconButton,
  Snackbar
} from '@mui/material';
import {Add, Delete, Sort, ArrowDownward, ArrowUpward} from '@mui/icons-material';
import CategoryDropdown from './CategoryDropdown.js';
import {useAuth} from '../contexts/AuthContext.js';
import {useExpenseTable} from '../hooks/useExpenseTable.js';
import {formatAmount, evaluateFormula, sortExpensesByAmountWithIndex} from '../utils/expense.js';

const SORT_CYCLE = ['date', 'amount_desc', 'amount_asc'];

const ExpenseTable = memo(function ExpenseTable({
  expenses = [],
  onExpensesChange,
  month,
  type
}) {
  const {isAuthenticated, canWrite} = useAuth();
  const [editingAmountIndex, setEditingAmountIndex] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const {
    localExpenses,
    handleExpenseChange,
    handleCategoryChange,
    handleAddRow,
    handleDeleteRow,
    snackbarMessage,
    clearSnackbar,
    isPending
  } = useExpenseTable({
    expenses,
    onExpensesChange,
    month,
    type,
    isAuthenticated,
    canWrite
  });

  const displayedRows = useMemo(() => {
    if (sortBy === 'date') {
      return localExpenses.map((expense, i) => ({ expense, originalIndex: i }));
    }
    return sortExpensesByAmountWithIndex(
      localExpenses,
      sortBy === 'amount_asc' ? 'asc' : 'desc'
    );
  }, [localExpenses, sortBy]);

  const cycleSortBy = () => {
    const idx = SORT_CYCLE.indexOf(sortBy);
    setSortBy(SORT_CYCLE[(idx + 1) % SORT_CYCLE.length]);
  };

  const SortIcon = sortBy === 'amount_desc' ? ArrowDownward : sortBy === 'amount_asc' ? ArrowUpward : Sort;

  return (
    <>
    <Box sx={{overflow: 'hidden'}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<Add />}
          onClick={handleAddRow}
          disabled={!canWrite || isPending}
        >
          추가
        </Button>
      </Box>
      <Box sx={{overflowX: 'auto'}}>
        <Table>
          <TableHead>
            <TableRow sx={{bgcolor: 'grey.100'}}>
              <TableCell sx={{fontWeight: 600, textAlign: 'center'}}>날짜</TableCell>
              <TableCell
                sx={{fontWeight: 600, textAlign: 'center', minWidth: 120}}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  금액
                  <IconButton
                    size="small"
                    onClick={cycleSortBy}
                    sx={{ p: 0.25 }}
                    aria-label={
                      sortBy === 'date'
                        ? '날짜순 (클릭 시 금액 내림차순)'
                        : sortBy === 'amount_desc'
                        ? '금액 내림차순 (클릭 시 오름차순)'
                        : '금액 오름차순 (클릭 시 날짜순)'
                    }
                  >
                    <SortIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell
                colSpan={2}
                sx={{fontWeight: 600, textAlign: 'center'}}
              >
                대분류/소분류
              </TableCell>
              <TableCell
                sx={{fontWeight: 600, textAlign: 'center', minWidth: 150}}
              >
                메모
              </TableCell>
              <TableCell
                sx={{fontWeight: 600, textAlign: 'center', width: 50}}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map(({ expense, originalIndex }) => (
              <TableRow
                key={expense.id || `expense-${originalIndex}`}
                sx={{'&:hover': {bgcolor: 'grey.50'}}}
              >
                <TableCell sx={{textAlign: 'center', py: 1}}>
                  <TextField
                    type="date"
                    value={expense.date}
                    onChange={(e) =>
                      handleExpenseChange(originalIndex, 'date', e.target.value)
                    }
                    size="small"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                    disabled={!isAuthenticated || isPending}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, minWidth: 120}}>
                  <TextField
                    type="text"
                    value={
                      editingAmountIndex === originalIndex
                        ? (typeof expense.amount === 'string' &&
                          expense.amount.trim().startsWith('=')
                            ? expense.amount
                            : String(expense.amount ?? '').replace(/,/g, ''))
                        : typeof expense.amount === 'string' &&
                          expense.amount.trim().startsWith('=')
                          ? (evaluateFormula(expense.amount) != null
                            ? formatAmount(evaluateFormula(expense.amount))
                            : expense.amount)
                          : formatAmount(expense.amount)
                    }
                    onFocus={() => setEditingAmountIndex(originalIndex)}
                    onBlur={() => setEditingAmountIndex(null)}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const numericOnly = raw.replace(/,/g, '');
                      const isFormula = raw.trim().startsWith('=');
                      const formulaOk =
                        isFormula && /^=[0-9+\-*/().\s]*$/.test(raw.trim());
                      if (
                        raw === '' ||
                        /^\d+$/.test(numericOnly) ||
                        formulaOk
                      ) {
                        handleExpenseChange(
                          originalIndex,
                          'amount',
                          isFormula ? raw : numericOnly
                        );
                      }
                    }}
                    placeholder="금액 또는 수식"
                    size="small"
                    fullWidth
                    disabled={!isAuthenticated || isPending}
                  />
                </TableCell>
                <TableCell colSpan={2} sx={{textAlign: 'center', py: 1, px: 1}}>
                  <CategoryDropdown
                    selectedMajor={expense.majorCategory}
                    selectedMinor={expense.minorCategory}
                    onCategoryChange={(categories) =>
                      handleCategoryChange(originalIndex, categories)
                    }
                    disabled={!isAuthenticated || isPending}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, minWidth: 150}}>
                  <TextField
                    type="text"
                    value={expense.note}
                    onChange={(e) =>
                      handleExpenseChange(originalIndex, 'note', e.target.value)
                    }
                    placeholder="메모"
                    size="small"
                    fullWidth
                    disabled={!isAuthenticated}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, width: 50}}>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteRow(originalIndex)}
                    disabled={!canWrite || isPending}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
    <Snackbar
      open={Boolean(snackbarMessage)}
      autoHideDuration={3000}
      onClose={clearSnackbar}
      message={snackbarMessage}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
    </>
  );
});

export default ExpenseTable;
