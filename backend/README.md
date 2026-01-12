# 백엔드 서버

호돌이와 돌돌이 가계부 백엔드 API 서버

## 기술 스택

- Node.js
- Express.js
- Supabase (PostgreSQL)

## 설치 및 실행

### 1. 의존성 설치

```bash
cd backend
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**중요**: `SUPABASE_SECRET_KEY`는 Supabase 대시보드 → Settings → API → **secret** 키를 사용합니다.
- ✅ **secret 키 사용 권장** (RLS를 존중하면서 서버 사이드 작업 가능)
- ❌ service_role 키는 RLS를 우회하므로 보안상 위험할 수 있습니다
- ⚠️ 이 키는 절대 프론트엔드에 노출되면 안 됩니다!

### 3. 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3001`에서 실행됩니다.

## API 엔드포인트

### 카테고리

- `GET /api/categories` - 모든 카테고리 조회
- `POST /api/categories` - 카테고리 추가
- `PUT /api/categories/:id` - 카테고리 수정
- `DELETE /api/categories/:id` - 카테고리 삭제

### 지출 내역

- `GET /api/expenses?month=1&type=both` - 지출 내역 조회
- `POST /api/expenses` - 지출 내역 추가
- `POST /api/expenses/batch` - 지출 내역 일괄 저장
- `PUT /api/expenses/:id` - 지출 내역 수정
- `DELETE /api/expenses/:id` - 지출 내역 삭제

### Health Check

- `GET /api/health` - 서버 상태 확인

## 배포

Railway, Render, Fly.io 등의 플랫폼에 배포 가능합니다.
