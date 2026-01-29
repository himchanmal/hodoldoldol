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
  IconButton
} from '@mui/material';
import {Add, Delete} from '@mui/icons-material';
import CategoryDropdown from './CategoryDropdown.js';
import {useAuth} from '../contexts/AuthContext.js';
import {useExpenseTable} from '../hooks/useExpenseTable.js';
import {formatAmount} from '../utils/expense.js';

const ExpenseTable = memo(function ExpenseTable({
  expenses = [],
  onExpensesChange,
  month,
  type
}) {
  const {isAuthenticated, canWrite} = useAuth();
  const {
    localExpenses,
    handleExpenseChange,
    handleCategoryChange,
    handleAddRow,
    handleDeleteRow
  } = useExpenseTable({
    expenses,
    onExpensesChange,
    month,
    type,
    isAuthenticated,
    canWrite
  });

  return (
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
          disabled={!canWrite}
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
                    disabled={!isAuthenticated}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, minWidth: 120}}>
                  <TextField
                    type="text"
                    value={formatAmount(expense.amount)}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/,/g, '');
                      if (
                        numericValue === '' ||
                        /^\d+$/.test(numericValue)
                      ) {
                        handleExpenseChange(index, 'amount', numericValue);
                      }
                    }}
                    placeholder="금액"
                    size="small"
                    fullWidth
                    disabled={!isAuthenticated}
                  />
                </TableCell>
                <TableCell colSpan={2} sx={{textAlign: 'center', py: 1, px: 1}}>
                  <CategoryDropdown
                    selectedMajor={expense.majorCategory}
                    selectedMinor={expense.minorCategory}
                    onCategoryChange={(categories) =>
                      handleCategoryChange(index, categories)
                    }
                    disabled={!isAuthenticated}
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
                    disabled={!isAuthenticated}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, width: 50}}>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteRow(index)}
                    disabled={!canWrite}
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
  );
});

export default ExpenseTable;
