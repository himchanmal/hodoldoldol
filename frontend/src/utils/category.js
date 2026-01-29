export function sortByCountThenKo(a, b, getCount, getLabel) {
  const countA = getCount(a);
  const countB = getCount(b);
  if (countB !== countA) return countB - countA;
  return (getLabel(a) || '').localeCompare(getLabel(b) || '', 'ko');
}
