import {useState, useEffect, useCallback, useRef} from 'react';
import {expenseAPI} from '../lib/api.js';
import {formExpenseToPayload, getEmptyExpenseRow, getNumericAmount} from '../utils/expense.js';
import {showAuthError, AUTH_REQUIRED_MESSAGE, isAuthError} from '../utils/error.js';

const DEBOUNCE_MS = 500;

const AMOUNT_ZERO_MESSAGE = '금액은 0보다 커야 합니다.';

export function useExpenseTable({expenses = [], onExpensesChange, month, type, isAuthenticated, canWrite = false}) {
  const [localExpenses, setLocalExpenses] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const prevExpensesRef = useRef(null);
  const lastExpensesFromPropsRef = useRef(expenses);
  const isInitialMount = useRef(true);
  const updateTimeoutsRef = useRef({});
  const pendingUpdatesRef = useRef({});
  const creatingIndicesRef = useRef(new Set());
  const [isPending, setIsPending] = useState(false);

  const updateIsPending = useCallback(() => {
    setIsPending(creatingIndicesRef.current.size > 0);
  }, []);

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

  const clearPendingUpdate = useCallback((index) => {
    if (updateTimeoutsRef.current[index] != null) {
      clearTimeout(updateTimeoutsRef.current[index]);
      delete updateTimeoutsRef.current[index];
      delete pendingUpdatesRef.current[index];
    }
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
      const numAmount = getNumericAmount(expense.amount);
      if (
        !expense.date ||
        numAmount == null ||
        !expense.majorCategory ||
        !expense.minorCategory ||
        !month ||
        !type ||
        !canWrite ||
        expense.id
      ) {
        return;
      }
      if (numAmount === 0) {
        setSnackbarMessage(AMOUNT_ZERO_MESSAGE);
        return;
      }
      if (creatingIndicesRef.current.has(index)) return;
      creatingIndicesRef.current.add(index);
      updateIsPending();

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
          updateIsPending();
        }
      })();
    },
    [month, type, canWrite, onExpensesChange, revertToPropsState, updateIsPending]
  );

  const processExpenseUpdate = useCallback(
    (index, expense) => {
      const amountValid = getNumericAmount(expense.amount) != null;
      const isComplete =
        expense.date &&
        amountValid &&
        expense.majorCategory &&
        expense.minorCategory;

      if (isComplete && !expense.id && month && type && isAuthenticated) {
        tryCreateExpense(index, expense);
      } else if (expense.id && month && type && isAuthenticated) {
        const numAmount = getNumericAmount(expense.amount);
        if (numAmount == null) {
          clearPendingUpdate(index);
        } else if (numAmount === 0) {
          clearPendingUpdate(index);
          setSnackbarMessage(AMOUNT_ZERO_MESSAGE);
        } else {
          scheduleDebouncedUpdate(index, expense.id, formExpenseToPayload(expense, month, type));
        }
      }
    },
    [
      month,
      type,
      isAuthenticated,
      tryCreateExpense,
      scheduleDebouncedUpdate,
      clearPendingUpdate
    ]
  );

  const handleExpenseChange = useCallback(
    (index, field, value) => {
      if (isPending) return;
      setLocalExpenses((prev) => {
        const updated = [...prev];
        updated[index] = {...updated[index], [field]: value};
        const expense = updated[index];
        const isNoteField = field === 'note';
        const isComplete =
          expense.date &&
          getNumericAmount(expense.amount) != null &&
          expense.majorCategory &&
          expense.minorCategory;

        processExpenseUpdate(index, expense);

        if (onExpensesChange && (!isNoteField || isComplete)) {
          onExpensesChange(updated);
        }
        return updated;
      });
    },
    [onExpensesChange, processExpenseUpdate, isPending]
  );

  const handleCategoryChange = useCallback(
    (index, {major, minor}) => {
      if (isPending) return;
      setLocalExpenses((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          majorCategory: major,
          minorCategory: minor
        };
        processExpenseUpdate(index, updated[index]);

        if (onExpensesChange) {
          onExpensesChange(updated);
        }
        return updated;
      });
    },
    [onExpensesChange, processExpenseUpdate, isPending]
  );

  const handleAddRow = useCallback(() => {
    if (!canWrite) {
      alert(AUTH_REQUIRED_MESSAGE);
      return;
    }
    if (isPending) return;
    setLocalExpenses((prev) => {
      const updated = [getEmptyExpenseRow(), ...prev];
      onExpensesChange?.(updated);
      return updated;
    });
  }, [onExpensesChange, canWrite, isPending]);

  const handleDeleteRow = useCallback(
    async (index) => {
      if (!canWrite) {
        alert(AUTH_REQUIRED_MESSAGE);
        return;
      }
      if (isPending) return;

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
    [localExpenses, onExpensesChange, canWrite, revertToPropsState, isPending]
  );

  return {
    localExpenses,
    handleExpenseChange,
    handleCategoryChange,
    handleAddRow,
    handleDeleteRow,
    snackbarMessage,
    clearSnackbar: () => setSnackbarMessage(null),
    isPending
  };
}
