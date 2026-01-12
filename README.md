# 호돌이와 돌돌이 가계부

호돌이와 돌돌이를 위한 가계부 애플리케이션입니다.

## 프로젝트 구조

```
hodoldoldol/
├── frontend/          # React 프론트엔드
├── backend/           # Node.js + Express 백엔드
└── README.md          # 이 파일
```

## 기술 스택

### 프론트엔드
- React
- Material-UI (MUI)
- Supabase Client

### 백엔드
- Node.js
- Express.js
- Supabase (PostgreSQL)

## 시작하기

### 1. 프론트엔드 설정

```bash
cd frontend
npm install
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 2. 백엔드 설정

```bash
cd backend
npm install
npm run dev
```

백엔드는 `http://localhost:3001`에서 실행됩니다.

자세한 설정은 각 폴더의 README를 참고하세요:
- [프론트엔드 README](./frontend/README.md)
- [백엔드 README](./backend/README.md)

## 환경 변수

### 프론트엔드 (`frontend/.env`)
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:3001/api
```

### 백엔드 (`backend/.env`)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 기능

- ✅ 카테고리 관리 (대분류/소분류)
- ✅ 월별 지출 내역 기록
- ✅ 호돌이와 돌돌이, 호돌이, 돌돌이 각각의 지출 관리
- ✅ 실시간 데이터 동기화 (Supabase)
- ✅ 다중 기기 지원

## 배포

프론트엔드와 백엔드를 각각 배포해야 합니다:

### 프론트엔드 (Vercel)

1. Vercel에 프로젝트를 연결합니다
2. **Root Directory를 `frontend`로 설정**합니다
3. 환경 변수를 설정합니다:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_API_URL` (백엔드 API URL, 예: `https://your-backend.railway.app/api`)

### 백엔드

Railway, Render, Fly.io 등의 플랫폼에 배포합니다:
- Railway: `backend/` 폴더를 루트로 설정
- Render: `backend/` 폴더를 루트로 설정
- Fly.io: `backend/` 폴더를 루트로 설정

환경 변수:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` 또는 `SUPABASE_SECRET_KEY`
- `PORT` (선택사항, 기본값: 3001)
- `FRONTEND_URL` (CORS 설정용)
