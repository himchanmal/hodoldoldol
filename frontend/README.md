# 프론트엔드

호돌이와 돌돌이 가계부 React 애플리케이션

## 설치

```bash
npm install
```

## 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:3001/api
```

## 실행

```bash
npm start
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

## 빌드

```bash
npm run build
```

빌드된 파일은 `build/` 폴더에 생성됩니다.

## Vercel 배포

1. Vercel에 프로젝트를 연결합니다
2. **Root Directory를 `frontend`로 설정**합니다
3. 환경 변수를 설정합니다:
   - `REACT_APP_API_URL` (백엔드 API URL, 예: `https://your-backend.railway.app/api`)
   - `REACT_APP_SUPABASE_URL` (선택사항)
   - `REACT_APP_SUPABASE_ANON_KEY` (선택사항)
