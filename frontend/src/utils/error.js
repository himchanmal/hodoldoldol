export const AUTH_REQUIRED_MESSAGE = '인증이 필요합니다. 올바른 토큰을 입력해주세요.';

export function isAuthError(error) {
  return error?.message?.includes('인증이 필요합니다');
}

export function showAuthError(error, fallbackMessage = '오류가 발생했습니다.') {
  if (isAuthError(error)) {
    alert(error.message);
  } else {
    alert(fallbackMessage);
  }
}
