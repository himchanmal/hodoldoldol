export function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export function apiDateToYmd(dateString) {
  if (!dateString) return '';
  return typeof dateString === 'string' && dateString.includes('T')
    ? dateString.split('T')[0]
    : dateString;
}
