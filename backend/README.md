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
ALLOWED_TOKENS=token1,token2
```

**인증 설정 (선택사항)**:
- `ALLOWED_TOKENS`: 허용된 접근 토큰 목록 (쉼표로 구분)
- 설정하지 않으면 모든 사용자가 접근 가능
- 설정하면 해당 토큰을 가진 사용자만 데이터 조회 가능
- 비허용 사용자는 빈 데이터만 조회 가능 (추가/수정/삭제 불가)

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

### Railway 배포 

#### 1. Railway 계정 생성 및 프로젝트 생성

1. [Railway](https://railway.app)에 접속하여 계정을 생성합니다 (GitHub 계정으로 로그인 가능)
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택 (또는 "Empty Project"로 시작 후 GitHub 연동)

#### 2. 프로젝트 설정

1. GitHub 저장소를 선택하거나 연결합니다
2. **Root Directory를 `backend`로 설정**합니다:
   - Settings → Source → Root Directory → `backend` 입력
3. **Build Command** (자동 감지되지만 확인):
   - `npm install`
4. **Start Command**:
   - `npm start`

#### 3. 환경 변수 설정

Railway 대시보드 → Variables 탭에서 다음 환경 변수를 추가합니다:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
ALLOWED_TOKENS=token1,token2
```

**중요**: 
- `SUPABASE_SERVICE_ROLE_KEY`는 Supabase 대시보드 → Settings → API → **secret** 키를 사용합니다
- `FRONTEND_URL`은 Vercel에 배포된 프론트엔드 URL을 입력합니다 (CORS 설정용)

#### 4. 배포 확인

1. Railway가 자동으로 배포를 시작합니다
2. 배포가 완료되면 "Settings" → "Domains"에서 생성된 URL을 확인할 수 있습니다
3. 예: `https://your-backend.railway.app`
4. Health check: `https://your-backend.railway.app/api/health` 접속하여 `{"status":"ok","message":"Server is running"}` 응답 확인

#### 5. 프론트엔드 환경 변수 업데이트

Vercel 대시보드에서 `REACT_APP_API_URL`을 Railway 백엔드 URL로 업데이트합니다:

```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```

#### 6. CORS 설정 확인

백엔드의 `FRONTEND_URL` 환경 변수가 프론트엔드 URL과 일치하는지 확인합니다.

### 다른 플랫폼 배포

- **Render**: `backend/` 폴더를 루트로 설정, 환경 변수 동일하게 설정
- **Fly.io**: `fly.toml` 설정 파일 필요, `backend/` 폴더를 루트로 설정
