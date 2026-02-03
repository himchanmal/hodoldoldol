import {useState, useEffect, useMemo} from 'react';
import {useCategoryContext} from '../contexts/CategoryContext.js';
import {expenseAPI} from '../lib/api.js';
import {TYPES} from '../utils/summary.js';

export {TYPES};

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function useSummaryData() {
  const {majorCategories} = useCategoryContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expensesByMonth, setExpensesByMonth] = useState({});

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await expenseAPI.getAll();
        const list = res?.data ?? [];
        const byMonth = {};
        MONTHS.forEach((m) => {
          byMonth[m] = {both: [], hodol: [], doldol: []};
        });
        list.forEach((e) => {
          const month = e.month;
          const type = (e.type || 'both').toLowerCase();
          if (month >= 1 && month <= 12 && byMonth[month]?.[type]) {
            byMonth[month][type].push(e);
          }
        });
        setExpensesByMonth(byMonth);
      } catch (err) {
        console.error('총괄장 데이터 로드 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const {sumsByCategoryAndMonth, totalsByMonth, categoryTotals, grandTotals, usedMonths} = useMemo(() => {
    const sums = {};
    const totals = {};
    const catTotals = {};
    MONTHS.forEach((m) => {
      totals[m] = {both: 0, hodol: 0, doldol: 0};
    });

    majorCategories.forEach((major) => {
      sums[major] = {};
      catTotals[major] = {both: 0, hodol: 0, doldol: 0};
      MONTHS.forEach((month) => {
        sums[major][month] = {both: 0, hodol: 0, doldol: 0};
        TYPES.forEach(({key}) => {
          const list = expensesByMonth[month]?.[key] || [];
          const amount = list
            .filter((e) => (e.major_category || e.majorCategory) === major)
            .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
          sums[major][month][key] = amount;
          totals[month][key] = (totals[month][key] || 0) + amount;
          catTotals[major][key] += amount;
        });
      });
    });

    const grand = {both: 0, hodol: 0, doldol: 0};
    MONTHS.forEach((m) => {
      TYPES.forEach(({key}) => {
        grand[key] += totals[m][key] || 0;
      });
    });

    const usedMonths = MONTHS.filter((m) => {
      const t = totals[m] || {};
      return ((t.both || 0) + (t.hodol || 0) + (t.doldol || 0)) > 0;
    });

    return {
      sumsByCategoryAndMonth: sums,
      totalsByMonth: totals,
      categoryTotals: catTotals,
      grandTotals: grand,
      usedMonths
    };
  }, [majorCategories, expensesByMonth]);

  return {
    loading,
    error,
    expensesByMonth,
    sumsByCategoryAndMonth,
    totalsByMonth,
    categoryTotals,
    grandTotals,
    usedMonths
  };
}
