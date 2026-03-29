export const AUTH_REQUIRED_MESSAGE = '인증이 필요합니다. 올바른 토큰을 입력해주세요.';

export const NETWORK_UNCERTAIN_MESSAGE =
  '연결이 불안정할 수 있습니다. 저장이 반영되지 않았을 수 있으니 페이지를 다시 열어 확인해 주세요.';

export function isAuthError(error) {
  return error?.message?.includes('인증이 필요합니다');
}

export function isLikelyNetworkOrAbortError(error) {
  if (!error) return false;
  const name = String(error.name || '');
  const msg = String(error.message || '');
  if (name === 'AbortError') return true;
  if (msg.includes('Failed to fetch')) return true;
  if (msg.includes('NetworkError')) return true;
  if (msg.includes('Load failed')) return true;
  if (error instanceof TypeError && /fetch|network/i.test(msg)) return true;
  return false;
}

export function showAuthError(
  error,
  fallbackMessage = '오류가 발생했습니다.',
  networkUncertainMessage = NETWORK_UNCERTAIN_MESSAGE
) {
  if (isAuthError(error)) {
    alert(error.message);
  } else if (networkUncertainMessage && isLikelyNetworkOrAbortError(error)) {
    alert(networkUncertainMessage);
  } else {
    alert(fallbackMessage);
  }
}
