import {AUTH_REQUIRED_MESSAGE} from '../utils/error.js';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getToken = () => {
  return localStorage.getItem('auth_token');
};

// fetch 헤더는 ISO-8859-1만 허용. 비-ASCII 토큰은 헤더에 넣지 않음
function isTokenSafeForHeader(token) {
  if (!token || typeof token !== 'string') return false;
  for (let i = 0; i < token.length; i++) {
    if (token.charCodeAt(i) > 255) return false;
  }
  return true;
}

// 인증 실패 콜백 (전역 설정)
let onAuthFailure = null;

export const setAuthFailureCallback = (callback) => {
  onAuthFailure = callback;
};

// API 호출 헬퍼 함수
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && isTokenSafeForHeader(token) && {Authorization: `Bearer ${token}`}),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // 401 에러 시 인증 실패 처리
      if (response.status === 401) {
        if (onAuthFailure) {
          onAuthFailure();
        }
        // 조회(GET)가 아닌 경우에만 에러 throw
        if (options.method && options.method !== 'GET') {
          throw new Error(AUTH_REQUIRED_MESSAGE);
        }
        // GET 요청은 빈 데이터 반환
        return {success: true, data: []};
      }
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API 호출 오류 (${endpoint}):`, error);
    throw error;
  }
}

// 카테고리 API
export const categoryAPI = {
  // 모든 카테고리 조회
  getAll: () => apiCall('/categories'),

  // 카테고리 추가
  create: (mainCategory, subCategory) =>
    apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify({main_category: mainCategory, sub_category: subCategory})
    }),

  // 카테고리 수정
  update: (id, mainCategory, subCategory) =>
    apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({main_category: mainCategory, sub_category: subCategory})
    }),

  // 카테고리 삭제
  delete: (id) =>
    apiCall(`/categories/${id}`, {
      method: 'DELETE'
    })
};

// 지출 내역 API
export const expenseAPI = {
  // 지출 내역 조회
  getAll: (month, type) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (type) params.append('type', type);
    return apiCall(`/expenses?${params.toString()}`);
  },

  // 지출 내역 추가
  create: (expense) =>
    apiCall('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense)
    }),

  // 지출 내역 일괄 저장
  batch: (expenses) =>
    apiCall('/expenses/batch', {
      method: 'POST',
      body: JSON.stringify({expenses})
    }),

  // 지출 내역 수정
  update: (id, expense) =>
    apiCall(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense)
    }),

  // 지출 내역 삭제
  delete: (id) =>
    apiCall(`/expenses/${id}`, {
      method: 'DELETE'
    })
};
