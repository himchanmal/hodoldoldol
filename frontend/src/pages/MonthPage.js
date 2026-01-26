import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Alert} from '@mui/material';
import ExpenseTable from '../components/ExpenseTable.js';
import Tabs from '../components/Tabs.js';
import {expenseAPI} from '../lib/api.js';

function MonthPage({month, expensesBoth, expensesHodol, expensesDoldol, onExpensesBothChange, onExpensesHodolChange, onExpensesDoldolChange}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // API 데이터를 ExpenseTable 형식으로 변환
  const transformExpenseData = (apiData) => {
    if (!apiData || !apiData.data) return [];
    return apiData.data.map(expense => ({
      id: expense.id,
      date: expense.date ? expense.date.split('T')[0] : '', // YYYY-MM-DD 형식으로 변환
      amount: expense.amount || '',
      majorCategory: expense.major_category || '',
      minorCategory: expense.minor_category || '',
      note: expense.note || ''
    }));
  };

  // 데이터 로드(month가 변경될 때만)
  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const monthNum = parseInt(month);
        
        // 세 가지 타입의 데이터를 병렬로 가져오기
        const [bothRes, hodolRes, doldolRes] = await Promise.all([
          expenseAPI.getAll(monthNum, 'both'),
          expenseAPI.getAll(monthNum, 'hodol'),
          expenseAPI.getAll(monthNum, 'doldol')
        ]);

        // 데이터 변환 및 부모 컴포넌트에 전달
        const bothData = transformExpenseData(bothRes);
        const hodolData = transformExpenseData(hodolRes);
        const doldolData = transformExpenseData(doldolRes);

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

    if (month) {
      loadExpenses();
    }
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
      <Box sx={{mx: {xs: -2, sm: -3}, mt: -2}}>
        <Tabs tabs={tabs} activeTab={activeTabId} onTabChange={handleTabChange} />
      </Box>
      <Box sx={{mt: 2}}>
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
      </Box>
    </>
  );
}

export default MonthPage;
