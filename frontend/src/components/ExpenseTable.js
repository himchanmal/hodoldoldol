import React, {useState, useEffect, memo, useCallback, useRef} from 'react';
import {Box, Table, TableHead, TableBody, TableRow, TableCell, TextField, Paper, Button, IconButton} from '@mui/material';
import {Add, Delete} from '@mui/icons-material';
import CategoryDropdown from './CategoryDropdown.js';
import {expenseAPI} from '../lib/api.js';

const ExpenseTable = memo(function ExpenseTable({expenses = [], onExpensesChange, month, type}) {
  const [localExpenses, setLocalExpenses] = useState([]);
  const prevExpensesRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // 초기 마운트 시에는 무조건 업데이트
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevExpensesRef.current = expenses;
      
      if (expenses.length > 0) {
        setLocalExpenses(expenses);
      } else {
        // 데이터가 없으면 빈 행 하나만
        setLocalExpenses([{
          date: '',
          amount: '',
          majorCategory: '',
          minorCategory: '',
          note: ''
        }]);
      }
      return;
    }

    // expenses가 실제로 변경되었을 때만 업데이트(무한 루프 방지)
    const prevIds = prevExpensesRef.current?.map(e => e.id).join(',') || '';
    const currentIds = expenses?.map(e => e.id).join(',') || '';
    const prevLength = prevExpensesRef.current?.length || 0;
    const currentLength = expenses?.length || 0;
    
    if (prevIds !== currentIds || prevLength !== currentLength) {
      prevExpensesRef.current = expenses;
      
      if (expenses.length > 0) {
        setLocalExpenses(expenses);
      } else {
        // 데이터가 없으면 빈 행 하나만
        setLocalExpenses([{
          date: '',
          amount: '',
          majorCategory: '',
          minorCategory: '',
          note: ''
        }]);
      }
    }
  }, [expenses]);

  const handleExpenseChange = useCallback((index, field, value) => {
    setLocalExpenses((prev) => {
      const updated = [...prev];
      updated[index] = {...updated[index], [field]: value};
      
      // 필수 필드가 모두 채워졌는지 확인(날짜, 금액, 대분류, 소분류)
      const expense = updated[index];
      const isComplete = expense.date && expense.amount && expense.majorCategory && expense.minorCategory;
      
      // 메모 필드 수정 시에는 API만 업데이트하고 부모 상태는 업데이트하지 않음(무한 루프 방지)
      const isNoteField = field === 'note';
      
      // 필수 필드가 모두 채워졌고, id가 없으면 새로 저장
      if (isComplete && !expense.id && month && type) {
        const saveExpense = async () => {
          try {
            const expenseData = {
              month: parseInt(month),
              type: type,
              date: expense.date,
              amount: parseInt(expense.amount),
              major_category: expense.majorCategory,
              minor_category: expense.minorCategory,
              note: expense.note || ''
            };
            
            const result = await expenseAPI.create(expenseData);
            if (result && result.data) {
              // 저장된 데이터로 업데이트
              setLocalExpenses((current) => {
                const newUpdated = [...current];
                newUpdated[index] = {
                  ...expense,
                  id: result.data.id
                };
                if (onExpensesChange) {
                  onExpensesChange(newUpdated);
                }
                return newUpdated;
              });
            }
          } catch (error) {
            console.error('지출 내역 저장 오류:', error);
            alert('지출 내역 저장 중 오류가 발생했습니다.');
          }
        };
        saveExpense();
      } else if (expense.id && month && type) {
        // 기존 데이터 수정
        const updateExpense = async () => {
          try {
            const expenseData = {
              month: parseInt(month),
              type: type,
              date: expense.date,
              amount: parseInt(expense.amount),
              major_category: expense.majorCategory,
              minor_category: expense.minorCategory,
              note: expense.note || ''
            };
            await expenseAPI.update(expense.id, expenseData);
          } catch (error) {
            console.error('지출 내역 수정 오류:', error);
            alert('지출 내역 수정 중 오류가 발생했습니다.');
          }
        };
        updateExpense();
      }
      
      // 메모 필드가 아니거나, 필수 필드가 모두 채워진 경우에만 부모 상태 업데이트
      if (onExpensesChange && (!isNoteField || isComplete)) {
        onExpensesChange(updated);
      }
      return updated;
    });
  }, [onExpensesChange, month, type]);

  const handleCategoryChange = useCallback((index, {major, minor}) => {
    setLocalExpenses((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        majorCategory: major,
        minorCategory: minor
      };
      
      // 필수 필드가 모두 채워졌는지 확인(날짜, 금액, 대분류, 소분류)
      const expense = updated[index];
      const isComplete = expense.date && expense.amount && expense.majorCategory && expense.minorCategory;
      
      // 필수 필드가 모두 채워졌고, id가 없으면 새로 저장
      if (isComplete && !expense.id && month && type) {
        const saveExpense = async () => {
          try {
            const expenseData = {
              month: parseInt(month),
              type: type,
              date: expense.date,
              amount: parseInt(expense.amount),
              major_category: expense.majorCategory,
              minor_category: expense.minorCategory,
              note: expense.note || ''
            };
            
            const result = await expenseAPI.create(expenseData);
            if (result && result.data) {
              // 저장된 데이터로 업데이트
              setLocalExpenses((current) => {
                const newUpdated = [...current];
                newUpdated[index] = {
                  ...expense,
                  id: result.data.id
                };
                if (onExpensesChange) {
                  onExpensesChange(newUpdated);
                }
                return newUpdated;
              });
            }
          } catch (error) {
            console.error('지출 내역 저장 오류:', error);
            alert('지출 내역 저장 중 오류가 발생했습니다.');
          }
        };
        saveExpense();
      } else if (expense.id && month && type) {
        // 기존 데이터 수정
        const updateExpense = async () => {
          try {
            const expenseData = {
              month: parseInt(month),
              type: type,
              date: expense.date,
              amount: parseInt(expense.amount),
              major_category: expense.majorCategory,
              minor_category: expense.minorCategory,
              note: expense.note || ''
            };
            await expenseAPI.update(expense.id, expenseData);
          } catch (error) {
            console.error('지출 내역 수정 오류:', error);
            alert('지출 내역 수정 중 오류가 발생했습니다.');
          }
        };
        updateExpense();
      }
      
      if (onExpensesChange) {
        onExpensesChange(updated);
      }
      return updated;
    });
  }, [onExpensesChange, month, type]);

  const handleAddRow = useCallback(() => {
    const newRow = {
      date: '',
      amount: '',
      majorCategory: '',
      minorCategory: '',
      note: ''
    };
    setLocalExpenses((prev) => {
      const updated = [newRow, ...prev];
      if (onExpensesChange) {
        onExpensesChange(updated);
      }
      return updated;
    });
  }, [onExpensesChange]);

  const handleDeleteRow = useCallback(async (index) => {
    const expense = localExpenses[index];
    
    // 서버에 저장된 데이터면 서버에서도 삭제
    if (expense.id) {
      try {
        await expenseAPI.delete(expense.id);
      } catch (error) {
        console.error('지출 내역 삭제 오류:', error);
        alert('지출 내역 삭제 중 오류가 발생했습니다.');
        return;
      }
    }
    
    setLocalExpenses((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // 모든 행이 삭제되면 빈 행 하나 추가
      if (updated.length === 0) {
        updated.push({
          date: '',
          amount: '',
          majorCategory: '',
          minorCategory: '',
          note: ''
        });
      }
      if (onExpensesChange) {
        onExpensesChange(updated);
      }
      return updated;
    });
  }, [localExpenses, onExpensesChange]);

  return (
      <Paper elevation={1} sx={{overflow: 'hidden'}}>
        <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 1, borderBottom: 1, borderColor: 'divider'}}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={handleAddRow}
          >
            추가
          </Button>
        </Box>
        <Box sx={{overflowX: 'auto'}}>
          <Table>
            <TableHead>
              <TableRow sx={{bgcolor: 'grey.100'}}>
                <TableCell sx={{fontWeight: 600, textAlign: 'center'}}>날짜</TableCell>
                <TableCell sx={{fontWeight: 600, textAlign: 'center', minWidth: 120}}>금액</TableCell>
                <TableCell colSpan={2} sx={{fontWeight: 600, textAlign: 'center'}}>대분류/소분류</TableCell>
                <TableCell sx={{fontWeight: 600, textAlign: 'center', minWidth: 150}}>메모</TableCell>
                <TableCell sx={{fontWeight: 600, textAlign: 'center', width: 50}}></TableCell>
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
                <TableCell sx={{textAlign: 'center', py: 1, minWidth: 120}}>
                  <TextField
                    type="number"
                    value={expense.amount || ''}
                    onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                    placeholder="금액"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell colSpan={2} sx={{textAlign: 'center', py: 1, px: 1}}>
                  <CategoryDropdown
                    selectedMajor={expense.majorCategory}
                    selectedMinor={expense.minorCategory}
                    onCategoryChange={(categories) => handleCategoryChange(index, categories)}
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, minWidth: 150}}>
                  <TextField
                    type="text"
                    value={expense.note}
                    onChange={(e) => handleExpenseChange(index, 'note', e.target.value)}
                    placeholder="메모"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{textAlign: 'center', py: 1, width: 50}}>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteRow(index)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
});

export default ExpenseTable;
