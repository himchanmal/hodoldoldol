import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';
import {readFileSync} from 'fs';

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 경로 명시적으로 지정
const envPath = resolve(__dirname, '../../.env');

// .env 파일 로드 (가장 먼저 실행되어야 함)
const result = dotenv.config({path: envPath});

if (result.error) {
  console.error('❌ .env 파일 로드 오류:', result.error);
}

// SUPABASE_SECRET_KEY의 따옴표 제거 처리
try {
  const envContent = readFileSync(envPath, 'utf-8');
  const secretKeyMatch = envContent.match(/SUPABASE_SECRET_KEY\s*=\s*(.+)/);
  if (secretKeyMatch) {
    let secretKeyValue = secretKeyMatch[1].trim();
    secretKeyValue = secretKeyValue.split('\n')[0].split('\r')[0];
    
    // 따옴표가 있으면 제거한 후 다시 설정
    if ((secretKeyValue.startsWith('"') && secretKeyValue.endsWith('"')) ||
        (secretKeyValue.startsWith("'") && secretKeyValue.endsWith("'"))) {
      secretKeyValue = secretKeyValue.slice(1, -1);
      process.env.SUPABASE_SECRET_KEY = secretKeyValue;
    }
  }
} catch (error) {
  // .env 파일이 없거나 읽을 수 없는 경우 무시
}

export default process.env;
