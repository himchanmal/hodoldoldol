import {apiDateToYmd, getTodayString} from './date.js';

export function formatAmount(amount) {
  if (amount === '' || amount == null) return '';
  return Number(amount).toLocaleString('ko-KR');
}

export function apiExpenseToForm(apiExpense) {
  if (!apiExpense) return null;
  return {
    id: apiExpense.id,
    date: apiDateToYmd(apiExpense.date),
    amount: apiExpense.amount ?? '',
    majorCategory: apiExpense.major_category ?? '',
    minorCategory: apiExpense.minor_category ?? '',
    note: apiExpense.note ?? ''
  };
}

export function formExpenseToPayload(expense, month, type) {
  return {
    month: parseInt(month, 10),
    type,
    date: expense.date,
    amount: parseInt(expense.amount, 10),
    major_category: expense.majorCategory,
    minor_category: expense.minorCategory,
    note: expense.note || ''
  };
}

export function getEmptyExpenseRow() {
  return {
    date: getTodayString(),
    amount: '',
    majorCategory: '',
    minorCategory: '',
    note: ''
  };
}
