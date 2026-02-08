import React, {memo} from 'react';
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
import {Add, Delete} from '@mui/icons-material';
import CategoryDropdown from './CategoryDropdown.js';
import {useAuth} from '../contexts/AuthContext.js';
import {useExpenseTable} from '../hooks/useExpenseTable.js';
import {formatAmount, evaluateFormula} from '../utils/expense.js';

const ExpenseTable = memo(function ExpenseTable({
  expenses = [],
  onExpensesChange,
  month,
  type
}) {
  const {isAuthenticated, canWrite} = useAuth();
  const [editingAmountIndex, setEditingAmountIndex] = React.useState(null);
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
                금액
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
            {localExpenses.map((expense, index) => (
              <TableRow
                key={expense.id || `expense-${index}`}
                sx={{'&:hover': {bgcolor: 'grey.50'}}}
              >
                <TableCell sx={{textAlign: 'center', py: 1}}>
                  <TextField
                    type="date"
                    value={expense.date}
                    onChange={(e) =>
                      handleExpenseChange(index, 'date', e.target.value)
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
                      editingAmountIndex === index
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
                    onFocus={() => setEditingAmountIndex(index)}
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
                          index,
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
                      handleCategoryChange(index, categories)
                    }
                    disabled={!isAuthenticated || isPending}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, minWidth: 150}}>
                  <TextField
                    type="text"
                    value={expense.note}
                    onChange={(e) =>
                      handleExpenseChange(index, 'note', e.target.value)
                    }
                    placeholder="메모"
                    size="small"
                    fullWidth
                    disabled={!isAuthenticated || isPending}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, width: 50}}>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteRow(index)}
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
