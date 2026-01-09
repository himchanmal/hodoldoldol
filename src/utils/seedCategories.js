// 기존 카테고리 데이터를 Supabase에 넣는 스크립트
import {supabase} from '../lib/supabase.js';
import {categories} from '../data/categories.js';

export async function seedCategories() {
  try {
    const dataToInsert = [];
    
    // 기존 카테고리 데이터를 Supabase 형식으로 변환
    for (const [mainCategory, subCategories] of Object.entries(categories)) {
      for (const subCategory of subCategories) {
        dataToInsert.push({
          main_category: mainCategory,
          sub_category: subCategory
        });
      }
    }
    
    // Supabase에 데이터 삽입
    const {data, error} = await supabase
      .from('categories')
      .insert(dataToInsert);
    
    if (error) {
      console.error('카테고리 데이터 삽입 오류:', error);
      return {success: false, error};
    }
    
    console.log('카테고리 데이터가 성공적으로 삽입되었습니다!', data);
    return {success: true, data};
  } catch (error) {
    console.error('오류 발생:', error);
    return {success: false, error};
  }
}

// 브라우저 콘솔에서 실행할 수 있도록 전역 함수로도 제공
if (typeof window !== 'undefined') {
  window.seedCategories = seedCategories;
}
