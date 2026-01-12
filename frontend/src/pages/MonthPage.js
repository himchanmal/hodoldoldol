import React from 'react';
import {Box, Typography} from '@mui/material';
import ExpenseTable from '../components/ExpenseTable.js';

function MonthPage({month, expensesBoth, expensesHodol, expensesDoldol, onExpensesBothChange, onExpensesHodolChange, onExpensesDoldolChange}) {
  return (
    <Box>
      <Typography variant="h5" sx={{mb: 3, fontWeight: 600, color: 'text.primary'}}>
        {month}월 지출 내역
      </Typography>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
        <ExpenseTable
          title="호돌이와 돌돌이"
          expenses={expensesBoth}
          onExpensesChange={onExpensesBothChange}
        />
        <ExpenseTable
          title="호돌이"
          expenses={expensesHodol}
          onExpensesChange={onExpensesHodolChange}
        />
        <ExpenseTable
          title="돌돌이"
          expenses={expensesDoldol}
          onExpensesChange={onExpensesDoldolChange}
        />
      </Box>
    </Box>
  );
}

export default MonthPage;
