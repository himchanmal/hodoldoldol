import React from 'react';
import {Box, Typography} from '@mui/material';

function SummaryPage({expensesBoth, expensesHodol, expensesDoldol}) {
  return (
    <Box>
      <Typography variant="body1" sx={{color: 'text.secondary'}}>
        월별 합계 및 통계 기능이 여기에 표시됩니다.
      </Typography>
    </Box>
  );
}

export default SummaryPage;
