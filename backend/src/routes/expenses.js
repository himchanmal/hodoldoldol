import express from 'express';
import {supabase} from '../lib/supabase.js';

const router = express.Router();

// 지출 내역 조회(월별, 타입별)
router.get('/', async (req, res) => {
  try {
    const {month, type} = req.query;

    let query = supabase
      .from('expenses')
      .select('*');

    if (month) {
      query = query.eq('month', month);
    }

    if (type) {
      query = query.eq('type', type);
    }

    query = query
      .order('date', {ascending: false})
      .order('created_at', {ascending: false});

    const {data, error} = await query;

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('지출 내역 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 지출 내역 추가
router.post('/', async (req, res) => {
  try {
    // 인증되지 않은 사용자는 접근 불가
    if (!req.user?.authenticated) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.'
      });
    }

    const {month, type, date, amount, major_category, minor_category, note} = req.body;

    if (!month || !type) {
      return res.status(400).json({
        success: false,
        error: '월과 타입을 입력해주세요.'
      });
    }

    const {data, error} = await supabase
      .from('expenses')
      .insert({
        month,
        type,
        date: date || null,
        amount: amount ? parseFloat(amount) : null,
        major_category: major_category || null,
        minor_category: minor_category || null,
        note: note || null
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('지출 내역 추가 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 지출 내역 수정
router.put('/:id', async (req, res) => {
  try {
    // 인증되지 않은 사용자는 접근 불가
    if (!req.user?.authenticated) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.'
      });
    }

    const {id} = req.params;
    const {date, amount, major_category, minor_category, note, type} = req.body;

    const updateData = {};
    if (date !== undefined) updateData.date = date;
    if (amount !== undefined) updateData.amount = amount ? parseFloat(amount) : null;
    if (major_category !== undefined) updateData.major_category = major_category;
    if (minor_category !== undefined) updateData.minor_category = minor_category;
    if (note !== undefined) updateData.note = note;
    if (type !== undefined && ['both', 'hodol', 'doldol'].includes(type)) updateData.type = type;

    const {data, error} = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('지출 내역 수정 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 지출 내역 삭제
router.delete('/:id', async (req, res) => {
  try {
    // 인증되지 않은 사용자는 접근 불가
    if (!req.user?.authenticated) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.'
      });
    }

    const {id} = req.params;

    const {error} = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: '지출 내역이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('지출 내역 삭제 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 여러 지출 내역 일괄 저장
router.post('/batch', async (req, res) => {
  try {
    // 인증되지 않은 사용자는 접근 불가
    if (!req.user?.authenticated) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.'
      });
    }

    const {expenses} = req.body; // [{month, type, date, amount, ...}, ...]

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({
        success: false,
        error: '지출 내역 배열을 입력해주세요.'
      });
    }

    // 빈 값 필터링
    const validExpenses = expenses
      .filter(exp => exp.date || exp.amount || exp.major_category || exp.note)
      .map(exp => ({
        month: exp.month,
        type: exp.type,
        date: exp.date || null,
        amount: exp.amount ? parseFloat(exp.amount) : null,
        major_category: exp.majorCategory || exp.major_category || null,
        minor_category: exp.minorCategory || exp.minor_category || null,
        note: exp.note || null
      }));

    if (validExpenses.length === 0) {
      return res.status(400).json({
        success: false,
        error: '저장할 유효한 지출 내역이 없습니다.'
      });
    }

    const {data, error} = await supabase
      .from('expenses')
      .insert(validExpenses)
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: `${validExpenses.length}개의 지출 내역이 저장되었습니다.`
    });
  } catch (error) {
    console.error('지출 내역 일괄 저장 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
