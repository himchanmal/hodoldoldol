import {useState, useEffect} from 'react';
import {supabase} from '../lib/supabase.js';

export function useCategories() {
  const [categories, setCategories] = useState({});
  const [majorCategories, setMajorCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Supabase에서 카테고리 데이터 불러오기
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const {data, error} = await supabase
        .from('categories')
        .select('*')
        .order('main_category', {ascending: true});

      if (error) throw error;

      // 데이터를 {대분류: [{id, sub_category}]} 형태로 변환
      const categoriesMap = {};
      const majors = [];

      data.forEach((item) => {
        if (!categoriesMap[item.main_category]) {
          categoriesMap[item.main_category] = [];
          majors.push(item.main_category);
        }
        categoriesMap[item.main_category].push({
          id: item.id,
          sub_category: item.sub_category
        });
      });

      setCategories(categoriesMap);
      setMajorCategories(majors);
      setError(null);
    } catch (err) {
      console.error('카테고리 불러오기 오류:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 추가
  const addCategory = async (mainCategory, subCategory) => {
    try {
      const {data, error} = await supabase
        .from('categories')
        .insert({
          main_category: mainCategory,
          sub_category: subCategory
        })
        .select()
        .single();

      if (error) throw error;

      // 로컬 상태 업데이트
      await fetchCategories();
      return {success: true, data};
    } catch (err) {
      console.error('카테고리 추가 오류:', err);
      return {success: false, error: err.message};
    }
  };

  // 카테고리 삭제
  const deleteCategory = async (id) => {
    try {
      const {error} = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 로컬 상태 업데이트
      await fetchCategories();
      return {success: true};
    } catch (err) {
      console.error('카테고리 삭제 오류:', err);
      return {success: false, error: err.message};
    }
  };

  // 카테고리 수정
  const updateCategory = async (id, mainCategory, subCategory) => {
    try {
      const {data, error} = await supabase
        .from('categories')
        .update({
          main_category: mainCategory,
          sub_category: subCategory
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // 로컬 상태 업데이트
      await fetchCategories();
      return {success: true, data};
    } catch (err) {
      console.error('카테고리 수정 오류:', err);
      return {success: false, error: err.message};
    }
  };

  // 전체 카테고리 데이터를 원래 형태로 변환 (CategoryDropdown 등에서 사용)
  const getCategoriesForDropdown = () => {
    const result = {};
    majorCategories.forEach((major) => {
      result[major] = categories[major].map((item) => item.sub_category);
    });
    return result;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    majorCategories,
    loading,
    error,
    addCategory,
    deleteCategory,
    updateCategory,
    refreshCategories: fetchCategories,
    getCategoriesForDropdown
  };
}
