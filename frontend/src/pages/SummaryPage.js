import React from 'react';
import {Box, Typography, Paper} from '@mui/material';

function SummaryPage({expensesBoth, expensesHodol, expensesDoldol}) {
  return (
    <Box>
      <Paper elevation={1} sx={{p: 3}}>
        <Typography variant="body1" sx={{color: 'text.secondary'}}>
          월별 합계 및 통계 기능이 여기에 표시됩니다.
        </Typography>
      </Paper>
    </Box>
  );
}

export default SummaryPage;
