# Supabase 설정 가이드

## 1단계: Supabase 프로젝트 생성

1. **Supabase 가입 및 로그인**
   - https://supabase.com 접속
   - GitHub 계정으로 가입/로그인 (무료)

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - 프로젝트 이름: `hodoldoldol` (또는 원하는 이름)
   - 데이터베이스 비밀번호 설정 (기억해두세요!)
   - Region 선택 (가장 가까운 지역)
   - "Create new project" 클릭
   - 프로젝트 생성 완료까지 1-2분 소요

## 2단계: API 키 확인

1. 프로젝트가 생성되면 좌측 메뉴에서 **Settings** → **API** 클릭
2. 다음 정보를 복사해두세요:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키 (API Keys 섹션에서 확인)

## 3단계: 환경 변수 설정

1. 프로젝트 루트에 `.env` 파일 생성
2. `.env.example` 파일을 참고하여 다음 내용 입력:

```
REACT_APP_SUPABASE_URL=여기에_Project_URL_입력
REACT_APP_SUPABASE_ANON_KEY=여기에_anon_public_키_입력
```

예시:
```
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4단계: 데이터베이스 테이블 생성

Supabase 대시보드에서 다음 테이블들을 생성해야 합니다.

### 테이블 1: categories (카테고리)

1. 좌측 메뉴에서 **Table Editor** 클릭
2. "New table" 클릭
3. 테이블 이름: `categories`
4. 다음 컬럼 추가:

| Column Name | Type | Default Value | Nullable |
|------------|------|---------------|----------|
| id | int8 | auto increment | ❌ |
| major_category | text | - | ❌ |
| minor_category | text | - | ❌ |
| created_at | timestamptz | now() | ❌ |

5. "Save" 클릭

### 테이블 2: expenses (지출 내역)

1. "New table" 클릭
2. 테이블 이름: `expenses`
3. 다음 컬럼 추가:

| Column Name | Type | Default Value | Nullable |
|------------|------|---------------|----------|
| id | int8 | auto increment | ❌ |
| month | text | - | ❌ |
| type | text | - | ❌ (both/hodol/doldol) |
| date | date | - | ✅ |
| amount | numeric | - | ✅ |
| major_category | text | - | ✅ |
| minor_category | text | - | ✅ |
| note | text | - | ✅ |
| created_at | timestamptz | now() | ❌ |

4. "Save" 클릭

## 5단계: Row Level Security (RLS) 설정

1. 각 테이블의 **Settings** → **RLS** 메뉴에서
2. "Enable RLS" 체크 해제 (개인 프로젝트이므로)
   - 또는 필요시 RLS 정책 설정

## 완료!

이제 React 앱에서 Supabase를 사용할 수 있습니다.
