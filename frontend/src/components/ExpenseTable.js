import React, {useState, useEffect, memo, useCallback} from 'react';
import {Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TextField, Paper} from '@mui/material';
import CategoryDropdown from './CategoryDropdown.js';

const ExpenseTable = memo(function ExpenseTable({title, expenses = [], onExpensesChange}) {
  const [localExpenses, setLocalExpenses] = useState(() => {
    if (expenses.length > 0) {
      // 기존 데이터 + 빈 행 5개 추가
      const emptyRows = Array(5).fill(null).map(() => ({
        date: '',
        amount: '',
        majorCategory: '',
        minorCategory: '',
        note: ''
      }));
      return [...expenses, ...emptyRows];
    }
    return Array(10).fill(null).map(() => ({
      date: '',
      amount: '',
      majorCategory: '',
      minorCategory: '',
      note: ''
    }));
  });

  useEffect(() => {
    if (expenses.length > 0) {
      // 기존 데이터 + 빈 행 5개 추가
      const emptyRows = Array(5).fill(null).map(() => ({
        date: '',
        amount: '',
        majorCategory: '',
        minorCategory: '',
        note: ''
      }));
      setLocalExpenses([...expenses, ...emptyRows]);
    } else {
      // 데이터가 없으면 빈 행 10개
      setLocalExpenses(Array(10).fill(null).map(() => ({
        date: '',
        amount: '',
        majorCategory: '',
        minorCategory: '',
        note: ''
      })));
    }
  }, [expenses]);

  const handleExpenseChange = useCallback((index, field, value) => {
    setLocalExpenses((prev) => {
      const updated = [...prev];
      updated[index] = {...updated[index], [field]: value};
      if (onExpensesChange) {
        onExpensesChange(updated);
      }
      return updated;
    });
  }, [onExpensesChange]);

  const handleCategoryChange = useCallback((index, {major, minor}) => {
    setLocalExpenses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        majorCategory: major,
        minorCategory: minor
      };
      if (onExpensesChange) {
        onExpensesChange(updated);
      }
      return updated;
    });
  }, [onExpensesChange]);

  return (
    <Box sx={{mb: 4}}>
      <Typography variant="h6" sx={{mb: 2, fontWeight: 600, color: 'text.primary'}}>
        {title}
      </Typography>
      <Paper elevation={1} sx={{overflow: 'hidden'}}>
        <Box sx={{overflowX: 'auto'}}>
          <Table>
            <TableHead>
              <TableRow sx={{bgcolor: 'grey.100'}}>
                <TableCell sx={{fontWeight: 600, textAlign: 'center'}}>날짜</TableCell>
                <TableCell sx={{fontWeight: 600, textAlign: 'center'}}>금액</TableCell>
                <TableCell colSpan={2} sx={{fontWeight: 600, textAlign: 'center'}}>대분류/소분류</TableCell>
                <TableCell sx={{fontWeight: 600, textAlign: 'center'}}>비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localExpenses.map((expense, index) => (
                <TableRow key={expense.id || `expense-${index}`} sx={{'&:hover': {bgcolor: 'grey.50'}}}>
                <TableCell sx={{textAlign: 'center', py: 1}}>
                  <TextField
                    type="date"
                    value={expense.date}
                    onChange={(e) => handleExpenseChange(index, 'date', e.target.value)}
                    size="small"
                    fullWidth
                    InputLabelProps={{shrink: true}}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1}}>
                  <TextField
                    type="number"
                    value={expense.amount || ''}
                    onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                    placeholder="금액"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell colSpan={2} sx={{textAlign: 'center', py: 1}}>
                  <CategoryDropdown
                    selectedMajor={expense.majorCategory}
                    selectedMinor={expense.minorCategory}
                    onCategoryChange={(categories) => handleCategoryChange(index, categories)}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1}}>
                  <TextField
                    type="text"
                    value={expense.note}
                    onChange={(e) => handleExpenseChange(index, 'note', e.target.value)}
                    placeholder="메모"
                    size="small"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
    </Box>
  );
});

export default ExpenseTable;
