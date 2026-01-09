import {createClient} from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 API Key를 .env 파일에서 가져옵니다
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 설정 오류!');
}

// 임시 더미 클라이언트 생성 (에러 방지)
const createDummyClient = () => {
  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  );
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDummyClient();
