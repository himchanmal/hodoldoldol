import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Alert, Container} from '@mui/material';
import ExpenseTable from '../components/ExpenseTable.js';
import Tabs from '../components/Tabs.js';
import {expenseAPI} from '../lib/api.js';
import {apiExpenseToForm} from '../utils/expense.js';

function MonthPage({month, expensesBoth, expensesHodol, expensesDoldol, onExpensesBothChange, onExpensesHodolChange, onExpensesDoldolChange}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // 데이터 로드(month가 변경될 때만)
  useEffect(() => {
    if (!month) return;
    setLoading(true);
    setError(null);

    const loadExpenses = async () => {
      try {
        const monthNum = parseInt(month);
        const res = await expenseAPI.getAll(monthNum);
        const list = res?.data ?? [];

        const byType = { both: [], hodol: [], doldol: [] };
        list.forEach((e) => {
          const t = (e.type || 'both').toLowerCase();
          if (byType[t]) byType[t].push(e);
        });

        const bothData = (byType.both || []).map((expense) => apiExpenseToForm(expense)).filter(Boolean);
        const hodolData = (byType.hodol || []).map((expense) => apiExpenseToForm(expense)).filter(Boolean);
        const doldolData = (byType.doldol || []).map((expense) => apiExpenseToForm(expense)).filter(Boolean);

        onExpensesBothChange(bothData);
        onExpensesHodolChange(hodolData);
        onExpensesDoldolChange(doldolData);
      } catch (err) {
        console.error('지출 내역 로드 오류:', err);
        setError(err.message || '지출 내역을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]); // month만 dependency로 사용

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
