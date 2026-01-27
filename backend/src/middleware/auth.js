// 인증 미들웨어
// 환경 변수에서 허용된 토큰 확인

export const authMiddleware = (req, res, next) => {
  // Health check는 인증 제외
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  // 허용된 토큰 목록 (환경 변수에서 가져오기)
  const allowedTokens = process.env.ALLOWED_TOKENS
    ? process.env.ALLOWED_TOKENS.split(',').map(t => t.trim())
    : [];

  // 토큰이 없으면 빈 배열로 설정 (모든 사용자 접근 가능)
  if (allowedTokens.length === 0) {
    return next();
  }

  // Authorization 헤더에서 토큰 추출
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.query.token ||
                req.body.token;

  // 토큰이 허용된 목록에 있는지 확인
  if (token && allowedTokens.includes(token)) {
    req.user = {authenticated: true};
    return next();
  }

  // 인증 실패 시 빈 데이터 반환 (에러 대신)
  req.user = {authenticated: false};
  return next();
};
