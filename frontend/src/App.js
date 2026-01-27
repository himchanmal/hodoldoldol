import React, {useState, useCallback} from 'react';
import {ThemeProvider, Box, Container, CssBaseline} from '@mui/material';
import theme from './theme.js';
import {CategoryProvider} from './contexts/CategoryContext.js';
import {AuthProvider} from './contexts/AuthContext.js';
import Tabs from './components/Tabs.js';
import Header from './components/Header.js';
import CategoryPage from './pages/CategoryPage.js';
import SummaryPage from './pages/SummaryPage.js';
import MonthPage from './pages/MonthPage.js';

function App() {
  // 현재 월을 가져와서 해당 월 탭을 기본으로 선택
  const getCurrentMonth = () => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth.toString();
  };

  const [activeTab, setActiveTab] = useState(getCurrentMonth());
  const [monthlyExpenses, setMonthlyExpenses] = useState({});

  const tabs = [
    {id: 'summary', label: '총괄장'},
    {id: 'category', label: '카테고리'},
    {id: '1', label: '1월'},
    {id: '2', label: '2월'},
    {id: '3', label: '3월'},
    {id: '4', label: '4월'},
    {id: '5', label: '5월'},
    {id: '6', label: '6월'},
    {id: '7', label: '7월'},
    {id: '8', label: '8월'},
    {id: '9', label: '9월'},
    {id: '10', label: '10월'},
    {id: '11', label: '11월'},
    {id: '12', label: '12월'}
  ];

  const getMonthExpenses = useCallback((month) => {
    if (!monthlyExpenses[month]) {
      return {
        both: [],
        hodol: [],
        doldol: []
      };
    }
    return monthlyExpenses[month];
  }, [monthlyExpenses]);

  const updateMonthExpenses = useCallback((month, type, expenses) => {
    setMonthlyExpenses((prev) => ({
      ...prev,
      [month]: {
        ...(prev[month] || {both: [], hodol: [], doldol: []}),
        [type]: expenses
      }
    }));
  }, []);

  const renderTabContent = () => {
    if (activeTab === 'category') {
      return <CategoryPage />;
    }

    if (activeTab === 'summary') {
      return <SummaryPage />;
    }

    const month = activeTab;
    const monthExpenses = getMonthExpenses(month);

    return (
      <MonthPage
        month={month}
        expensesBoth={monthExpenses.both}
        expensesHodol={monthExpenses.hodol}
        expensesDoldol={monthExpenses.doldol}
        onExpensesBothChange={(expenses) => updateMonthExpenses(month, 'both', expenses)}
        onExpensesHodolChange={(expenses) => updateMonthExpenses(month, 'hodol', expenses)}
        onExpensesDoldolChange={(expenses) => updateMonthExpenses(month, 'doldol', expenses)}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CategoryProvider>
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default'}}>
          <Header />
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <Box component="main" sx={{flexGrow: 1, overflowY: 'auto'}}>
            <Container maxWidth="xl" sx={{py: 2}}>
              {renderTabContent()}
            </Container>
          </Box>
        </Box>
      </CategoryProvider>
    </ThemeProvider>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
