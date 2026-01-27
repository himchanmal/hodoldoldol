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

    const updateData = {
      main_category,
      sub_category
    };

    // count가 제공된 경우에만 업데이트
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

// 카테고리 삭제
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
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

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
