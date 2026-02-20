import express from 'express';
import {supabase} from '../lib/supabase.js';

const router = express.Router();

// 모든 카테고리 조회
router.get('/', async (req, res) => {
  try {
    const {data, error} = await supabase
      .from('categories')
      .select('*')
      .order('main_category', {ascending: true});

    if (error) throw error;

    // 대분류별 count 계산
    const mainCategoryCounts = {};
    data.forEach(category => {
      if (!mainCategoryCounts[category.main_category]) {
        mainCategoryCounts[category.main_category] = 0;
      }
      mainCategoryCounts[category.main_category] += category.count || 0;
    });

    res.json({
      success: true,
      data,
      mainCategoryCounts // 대분류별 총 count
    });
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 카테고리 추가
router.post('/', async (req, res) => {
  try {
    // 인증되지 않은 사용자는 접근 불가
    if (!req.user?.authenticated) {
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.'
      });
    }

    const {main_category, sub_category, count} = req.body;

    if (!main_category || !sub_category) {
      return res.status(400).json({
        success: false,
        error: '대분류와 소분류를 모두 입력해주세요.'
      });
    }

    const {data, error} = await supabase
      .from('categories')
      .insert({
        main_category,
        sub_category,
        count: count || 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('카테고리 추가 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 카테고리 수정
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
    const {main_category, sub_category, count} = req.body;

    if (!main_category || !sub_category) {
      return res.status(400).json({
        success: false,
        error: '대분류와 소분류를 모두 입력해주세요.'
      });
    }

    // 기존 카테고리 조회 (지출 테이블 연동용)
    const {data: existing, error: fetchError} = await supabase
      .from('categories')
      .select('main_category, sub_category')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({
        success: false,
        error: '카테고리를 찾을 수 없습니다.'
      });
    }

    const oldMajor = existing.main_category;
    const oldMinor = existing.sub_category;
    const changed = oldMajor !== main_category || oldMinor !== sub_category;

    const updateData = {
      main_category,
      sub_category
    };
    if (count !== undefined) {
      updateData.count = count;
    }

    const {data, error} = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // 대/소분류가 바뀐 경우: 해당 이름을 쓰던 지출 내역도 새 이름으로 통일
    if (changed) {
      const {error: expensesError} = await supabase
        .from('expenses')
        .update({
          major_category: main_category,
          minor_category: sub_category
        })
        .eq('major_category', oldMajor)
        .eq('minor_category', oldMinor);

      if (expensesError) {
        console.error('지출 내역 카테고리 연동 업데이트 오류:', expensesError);
      } else {
        // 이름 변경 시 트리거가 새 이름 count를 지출 수만큼 또 올리므로, 실제 지출 건수로 다시 맞춤
        const {count: expenseCount} = await supabase
          .from('expenses')
          .select('*', {count: 'exact', head: true})
          .eq('major_category', main_category)
          .eq('minor_category', sub_category);
        const {error: countError} = await supabase
          .from('categories')
          .update({count: expenseCount ?? 0})
          .eq('id', id);
        if (countError) console.error('카테고리 count 보정 오류:', countError);
      }
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('카테고리 수정 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 카테고리 삭제 (해당 카테고리를 쓰는 지출은 대/소분류를 null로 변경)
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

    // 삭제 전에 대/소분류 조회 (지출 연동용)
    const {data: existing, error: fetchError} = await supabase
      .from('categories')
      .select('main_category, sub_category')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({
        success: false,
        error: '카테고리를 찾을 수 없습니다.'
      });
    }

    const {error} = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // 해당 카테고리를 쓰던 지출의 대/소분류를 null로
    const {error: expensesError} = await supabase
      .from('expenses')
      .update({
        major_category: null,
        minor_category: null
      })
      .eq('major_category', existing.main_category)
      .eq('minor_category', existing.sub_category);

    if (expensesError) {
      console.error('지출 카테고리 초기화 오류:', expensesError);
    }

    res.json({
      success: true,
      message: '카테고리가 삭제되었습니다.'
    });
  } catch (error) {
    console.error('카테고리 삭제 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
