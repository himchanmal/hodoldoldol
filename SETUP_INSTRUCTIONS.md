# 환경 변수 설정 가이드

## 1단계: .env 파일 생성

프로젝트 루트 디렉토리(`/Users/jekim/Desktop/dev/hodoldoldol`)에 `.env` 파일을 생성하세요.

## 2단계: Supabase 정보 입력

`.env` 파일에 다음 내용을 입력하세요:

```
REACT_APP_SUPABASE_URL=여기에_Supabase_Project_URL_입력
REACT_APP_SUPABASE_ANON_KEY=여기에_Supabase_anon_public_키_입력
```

### Supabase 정보 확인 방법:

1. https://app.supabase.com 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 **Settings** → **API** 클릭
4. 다음 정보를 복사:
   - **Project URL** → `REACT_APP_SUPABASE_URL`에 입력
   - **anon public** 키 → `REACT_APP_SUPABASE_ANON_KEY`에 입력

### 예시:

```
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 3단계: 개발 서버 재시작

환경 변수를 설정한 후 **반드시** 개발 서버를 재시작하세요:

```bash
# 서버 중지 (Ctrl + C)
# 그 다음 다시 시작
npm start
```

⚠️ **중요**: `.env` 파일을 수정한 후에는 개발 서버를 재시작해야 변경사항이 적용됩니다!

## 문제 해결

### 여전히 오류가 발생하는 경우:

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 파일 이름이 정확히 `.env`인지 확인 (`.env.txt` 아님)
3. 환경 변수 이름이 정확한지 확인 (`REACT_APP_` 접두사 필수)
4. 개발 서버를 완전히 종료하고 다시 시작
5. 브라우저 콘솔에서 오류 메시지 확인
