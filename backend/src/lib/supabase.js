import {createClient} from '@supabase/supabase-js';

// server.js에서 이미 dotenv.config()가 호출되었으므로
// 여기서는 환경 변수를 직접 사용
const supabaseUrl = process.env.SUPABASE_URL;
// SUPABASE_SECRET_KEY 또는 SUPABASE_SERVICE_ROLE_KEY 둘 다 지원
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('❌ Supabase 설정 오류!');
  process.exit(1);
}

// 백엔드에서는 secret 키를 사용 (RLS를 존중하면서 서버 사이드 작업 가능)
// 주의: 이 키는 절대 프론트엔드에 노출되면 안 됩니다!
export const supabase = createClient(supabaseUrl, supabaseSecretKey);
