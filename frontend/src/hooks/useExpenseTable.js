import {useState, useEffect, useCallback, useRef} from 'react';
import {expenseAPI} from '../lib/api.js';
import {formExpenseToPayload, getEmptyExpenseRow, getNumericAmount} from '../utils/expense.js';
import {showAuthError, AUTH_REQUIRED_MESSAGE, isAuthError} from '../utils/error.js';

const DEBOUNCE_MS = 500;

export function useExpenseTable({expenses = [], onExpensesChange, month, type, isAuthenticated, canWrite = false}) {
  const [localExpenses, setLocalExpenses] = useState([]);
  const prevExpensesRef = useRef(null);
  const lastExpensesFromPropsRef = useRef(expenses);
  const isInitialMount = useRef(true);
  const updateTimeoutsRef = useRef({});
  const pendingUpdatesRef = useRef({});
  const creatingIndicesRef = useRef(new Set());

  const revertToPropsState = useCallback(() => {
    const fromProps = lastExpensesFromPropsRef.current;
    const next =
      fromProps.length > 0 ? fromProps : [getEmptyExpenseRow()];
    setLocalExpenses(next);
    onExpensesChange?.(next);
  }, [onExpensesChange]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevExpensesRef.current = expenses;
      lastExpensesFromPropsRef.current = expenses;
      setLocalExpenses(
        expenses.length > 0 ? expenses : [getEmptyExpenseRow()]
      );
      return;
    }

    const prevIds = prevExpensesRef.current?.map((e) => e.id).join(',') || '';
    const currentIds = expenses?.map((e) => e.id).join(',') || '';
    const prevLength = prevExpensesRef.current?.length || 0;
    const currentLength = expenses?.length || 0;

    if (prevIds !== currentIds || prevLength !== currentLength) {
      prevExpensesRef.current = expenses;
      lastExpensesFromPropsRef.current = expenses;
      setLocalExpenses(
        expenses.length > 0 ? expenses : [getEmptyExpenseRow()]
      );
    }
  }, [expenses]);

  useEffect(() => {
    return () => {
      Object.values(updateTimeoutsRef.current).forEach((id) => clearTimeout(id));
      updateTimeoutsRef.current = {};
      pendingUpdatesRef.current = {};
    };
  }, []);

  const scheduleDebouncedUpdate = useCallback((index, id, expenseData) => {
    if (updateTimeoutsRef.current[index] != null) {
      clearTimeout(updateTimeoutsRef.current[index]);
    }
    pendingUpdatesRef.current[index] = {id, ...expenseData};
    updateTimeoutsRef.current[index] = setTimeout(async () => {
      const payload = pendingUpdatesRef.current[index];
      delete pendingUpdatesRef.current[index];
      delete updateTimeoutsRef.current[index];
      if (!payload?.id) return;
      try {
        await expenseAPI.update(payload.id, {
          month: payload.month,
          type: payload.type,
          date: payload.date,
          amount: payload.amount,
          major_category: payload.major_category,
          minor_category: payload.minor_category,
          note: payload.note || ''
        });
      } catch (error) {
        console.error('지출 내역 수정 오류:', error);
        showAuthError(error, '지출 내역 수정 중 오류가 발생했습니다.');
        if (isAuthError(error)) {
          revertToPropsState();
        }
      }
    }, DEBOUNCE_MS);
  }, [revertToPropsState]);

  const tryCreateExpense = useCallback(
    (index, expense) => {
      if (
        !expense.date ||
        getNumericAmount(expense.amount) == null ||
        !expense.majorCategory ||
        !expense.minorCategory ||
        !month ||
        !type ||
        !canWrite ||
        expense.id
      ) {
        return;
      }
      if (creatingIndicesRef.current.has(index)) return;
      creatingIndicesRef.current.add(index);

      const expenseData = formExpenseToPayload(expense, month, type);

      (async () => {
        try {
          const result = await expenseAPI.create(expenseData);
          if (result?.data) {
            setLocalExpenses((current) => {
              const next = [...current];
              next[index] = {...expense, id: result.data.id};
              onExpensesChange?.(next);
              return next;
            });
          }
        } catch (error) {
          console.error('지출 내역 저장 오류:', error);
          showAuthError(error, '지출 내역 저장 중 오류가 발생했습니다.');
          if (isAuthError(error)) {
            revertToPropsState();
          }
        } finally {
          creatingIndicesRef.current.delete(index);
        }
      })();
    },
    [month, type, canWrite, onExpensesChange, revertToPropsState]
  );

  const handleExpenseChange = useCallback(
    (index, field, value) => {
      setLocalExpenses((prev) => {
        const updated = [...prev];
        updated[index] = {...updated[index], [field]: value};
        const expense = updated[index];
        const amountValid = getNumericAmount(expense.amount) != null;
        const isComplete =
          expense.date &&
          amountValid &&
          expense.majorCategory &&
          expense.minorCategory;
        const isNoteField = field === 'note';

        if (isComplete && !expense.id && month && type && isAuthenticated) {
          tryCreateExpense(index, expense);
        } else if (expense.id && month && type && isAuthenticated) {
          scheduleDebouncedUpdate(
            index,
            expense.id,
            formExpenseToPayload(expense, month, type)
          );
        }

        if (onExpensesChange && (!isNoteField || isComplete)) {
          onExpensesChange(updated);
        }
        return updated;
      });
    },
    [
      month,
      type,
      isAuthenticated,
      onExpensesChange,
      scheduleDebouncedUpdate,
      tryCreateExpense
    ]
  );

  const handleCategoryChange = useCallback(
    (index, {major, minor}) => {
      setLocalExpenses((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          majorCategory: major,
          minorCategory: minor
        };
        const expense = updated[index];
        const amountValid = getNumericAmount(expense.amount) != null;
        const isComplete =
          expense.date &&
          amountValid &&
          expense.majorCategory &&
          expense.minorCategory;

        if (isComplete && !expense.id && month && type && isAuthenticated) {
          tryCreateExpense(index, expense);
        } else if (expense.id && month && type && isAuthenticated) {
          scheduleDebouncedUpdate(
            index,
            expense.id,
            formExpenseToPayload(expense, month, type)
          );
        }

        if (onExpensesChange) {
          onExpensesChange(updated);
        }
        return updated;
      });
    },
    [
      month,
      type,
      isAuthenticated,
      onExpensesChange,
      scheduleDebouncedUpdate,
      tryCreateExpense
    ]
  );

  const handleAddRow = useCallback(() => {
    if (!canWrite) {
      alert(AUTH_REQUIRED_MESSAGE);
      return;
    }
    setLocalExpenses((prev) => {
      const updated = [getEmptyExpenseRow(), ...prev];
      onExpensesChange?.(updated);
      return updated;
    });
  }, [onExpensesChange, canWrite]);

  const handleDeleteRow = useCallback(
    async (index) => {
      if (!canWrite) {
        alert(AUTH_REQUIRED_MESSAGE);
        return;
      }

      const expense = localExpenses[index];
      if (expense?.id) {
        try {
          await expenseAPI.delete(expense.id);
        } catch (error) {
          console.error('지출 내역 삭제 오류:', error);
          showAuthError(error, '지출 내역 삭제 중 오류가 발생했습니다.');
          if (isAuthError(error)) {
            revertToPropsState();
          }
          return;
        }
      }

      setLocalExpenses((prev) => {
        const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        updated.push(getEmptyExpenseRow());
      }
        onExpensesChange?.(updated);
        return updated;
      });
    },
    [localExpenses, onExpensesChange, canWrite, revertToPropsState]
  );

  return {
    localExpenses,
    handleExpenseChange,
    handleCategoryChange,
    handleAddRow,
    handleDeleteRow
  };
}
