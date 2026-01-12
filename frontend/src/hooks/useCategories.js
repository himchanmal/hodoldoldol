import {useState, useEffect} from 'react';
import {categoryAPI} from '../lib/api.js';

export function useCategories() {
  const [categories, setCategories] = useState({});
  const [majorCategories, setMajorCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 백엔드 API에서 카테고리 데이터 불러오기
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();

      if (!response.success) {
        throw new Error(response.error || '카테고리 불러오기 실패');
      }

      const data = response.data;

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
      const response = await categoryAPI.create(mainCategory, subCategory);

      if (!response.success) {
        throw new Error(response.error || '카테고리 추가 실패');
      }

      // 로컬 상태 업데이트
      await fetchCategories();
      return {success: true, data: response.data};
    } catch (err) {
      console.error('카테고리 추가 오류:', err);
      return {success: false, error: err.message};
    }
  };

  // 카테고리 삭제
  const deleteCategory = async (id) => {
    try {
      const response = await categoryAPI.delete(id);

      if (!response.success) {
        throw new Error(response.error || '카테고리 삭제 실패');
      }

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
      const response = await categoryAPI.update(id, mainCategory, subCategory);

      if (!response.success) {
        throw new Error(response.error || '카테고리 수정 실패');
      }

      // 로컬 상태 업데이트
      await fetchCategories();
      return {success: true, data: response.data};
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
