import {apiDateToYmd, getTodayString} from './date.js';

/** 금액 표시용 (숫자만 또는 빈 문자열) */
export function formatAmount(amount) {
  if (amount === '' || amount == null) return '';
  return Number(amount).toLocaleString('ko-KR');
}

/**
 * 엑셀 형식의 수식만 허용해 안전하게 계산.
 * 허용: 숫자, +, -, *, /, (, ), 공백. 반환: 계산된 숫자 또는 null.
 */
export function evaluateFormula(str) {
  if (typeof str !== 'string') return null;
  const s = str.trim().replace(/^=/, '').replace(/\s/g, '');
  if (!s.length) return null;
  if (!/^[0-9+\-*/().]+$/.test(s)) return null;
  const tokens = [];
  for (let i = 0; i < s.length; ) {
    if (/[0-9.]/.test(s[i])) {
      let num = '';
      while (i < s.length && /[0-9.]/.test(s[i])) {
        num += s[i++];
      }
      const n = parseFloat(num);
      if (Number.isNaN(n)) return null;
      tokens.push({ type: 'num', value: n });
    } else if (/[+\-*/()]/.test(s[i])) {
      tokens.push({ type: s[i], value: s[i++] });
    } else {
      return null;
    }
  }
  let pos = 0;
  function parseExpr() {
    let left = parseTerm();
    while (pos < tokens.length && (tokens[pos].type === '+' || tokens[pos].type === '-')) {
      const op = tokens[pos++].type;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }
  function parseTerm() {
    let left = parseFactor();
    while (pos < tokens.length && (tokens[pos].type === '*' || tokens[pos].type === '/')) {
      const op = tokens[pos++].type;
      const right = parseFactor();
      left = op === '*' ? left * right : right === 0 ? 0 : left / right;
    }
    return left;
  }
  function parseFactor() {
    if (pos >= tokens.length) return null;
    if (tokens[pos].type === 'num') return tokens[pos++].value;
    if (tokens[pos].type === '(') {
      pos++;
      const v = parseExpr();
      if (pos >= tokens.length || tokens[pos].type !== ')') return null;
      pos++;
      return v;
    }
    return null;
  }
  try {
    const result = parseExpr();
    return pos === tokens.length && result != null && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

/** 금액 필드 값(숫자 문자열 또는 =수식)을 API용 숫자로 변환 */
export function getNumericAmount(amount) {
  if (amount === '' || amount == null) return null;
  if (typeof amount === 'string' && amount.trim().startsWith('=')) {
    return evaluateFormula(amount);
  }
  const n = Number(String(amount).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
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
  const num = getNumericAmount(expense.amount);
  const amount = num != null && Number.isFinite(num) ? Math.round(Number(num)) : 0;
  return {
    month: parseInt(month, 10),
    type,
    date: expense.date,
    amount,
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
