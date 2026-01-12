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

    res.json({
      success: true,
      data
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
    const {main_category, sub_category} = req.body;

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
        sub_category
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
    const {id} = req.params;
    const {main_category, sub_category} = req.body;

    if (!main_category || !sub_category) {
      return res.status(400).json({
        success: false,
        error: '대분류와 소분류를 모두 입력해주세요.'
      });
    }

    const {data, error} = await supabase
      .from('categories')
      .update({
        main_category,
        sub_category
      })
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
