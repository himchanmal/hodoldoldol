import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Alert, Container} from '@mui/material';
import ExpenseTable from '../components/ExpenseTable.js';
import Tabs from '../components/Tabs.js';
import {expenseAPI} from '../lib/api.js';
import {groupExpensesByType} from '../utils/expense.js';

function MonthPage({month, expensesRefreshTrigger, expensesBoth, expensesHodol, expensesDoldol, onExpensesBothChange, onExpensesHodolChange, onExpensesDoldolChange}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // 데이터 로드(month 또는 카테고리 수정 후 새로고침 트리거 변경 시)
  useEffect(() => {
    if (!month) return;
    setLoading(true);
    setError(null);

    const loadExpenses = async () => {
      try {
        const monthNum = parseInt(month);
        const res = await expenseAPI.getAll(monthNum);
        const {both, hodol, doldol} = groupExpensesByType(res?.data ?? []);
        onExpensesBothChange(both);
        onExpensesHodolChange(hodol);
        onExpensesDoldolChange(doldol);
      } catch (err) {
        console.error('지출 내역 로드 오류:', err);
        setError(err.message || '지출 내역을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, expensesRefreshTrigger]);

  if (loading) {
    return (
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{mb: 2}}>
          {error}
        </Alert>
      </Box>
    );
  }

  const tabs = [
    {id: 'both', label: '호돌이와 돌돌이'},
    {id: 'hodol', label: '호돌이'},
    {id: 'doldol', label: '돌돌이'}
  ];

  const activeTabId = tabs[activeTab]?.id || 'both';

  const handleTabChange = (tabId) => {
    const index = tabs.findIndex(tab => tab.id === tabId);
    setActiveTab(index >= 0 ? index : 0);
  };

  return (
    <>
      <Tabs tabs={tabs} activeTab={activeTabId} onTabChange={handleTabChange} />
      <Container maxWidth="xl" sx={{py: 1}}>
      {activeTab === 0 && (
        <ExpenseTable
          expenses={expensesBoth}
          onExpensesChange={onExpensesBothChange}
          month={month}
          type="both"
        />
      )}
      {activeTab === 1 && (
        <ExpenseTable
          expenses={expensesHodol}
          onExpensesChange={onExpensesHodolChange}
          month={month}
          type="hodol"
        />
      )}
      {activeTab === 2 && (
        <ExpenseTable
          expenses={expensesDoldol}
          onExpensesChange={onExpensesDoldolChange}
          month={month}
          type="doldol"
        />
      )}
      </Container>
    </>
  );
}

export default MonthPage;
