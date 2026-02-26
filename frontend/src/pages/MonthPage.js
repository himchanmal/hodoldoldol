import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Alert, Container} from '@mui/material';
import ExpenseTable from '../components/ExpenseTable.js';
import Tabs from '../components/Tabs.js';
import {expenseAPI} from '../lib/api.js';
import {groupExpensesByType, sortExpensesByDate} from '../utils/expense.js';
import {EXPENSE_TYPE_TABS} from '../constants/expenseTypes.js';

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

  const tabs = EXPENSE_TYPE_TABS;
  const activeTabId = tabs[activeTab]?.id || 'both';

  const handleTabChange = (tabId) => {
    const index = tabs.findIndex((tab) => tab.id === tabId);
    setActiveTab(index >= 0 ? index : 0);
  };

  const handleMoveToType = (expense, targetType) => {
    const newBoth = expensesBoth.filter((e) => e.id !== expense.id);
    const newHodol = expensesHodol.filter((e) => e.id !== expense.id);
    const newDoldol = expensesDoldol.filter((e) => e.id !== expense.id);
    if (targetType === 'both') newBoth.push(expense);
    else if (targetType === 'hodol') newHodol.push(expense);
    else newDoldol.push(expense);

    onExpensesBothChange(targetType === 'both' ? sortExpensesByDate(newBoth) : newBoth);
    onExpensesHodolChange(targetType === 'hodol' ? sortExpensesByDate(newHodol) : newHodol);
    onExpensesDoldolChange(targetType === 'doldol' ? sortExpensesByDate(newDoldol) : newDoldol);
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
          onMoveToType={handleMoveToType}
        />
      )}
      {activeTab === 1 && (
        <ExpenseTable
          expenses={expensesHodol}
          onExpensesChange={onExpensesHodolChange}
          month={month}
          type="hodol"
          onMoveToType={handleMoveToType}
        />
      )}
      {activeTab === 2 && (
        <ExpenseTable
          expenses={expensesDoldol}
          onExpensesChange={onExpensesDoldolChange}
          month={month}
          type="doldol"
          onMoveToType={handleMoveToType}
        />
      )}
      </Container>
    </>
  );
}

export default MonthPage;
