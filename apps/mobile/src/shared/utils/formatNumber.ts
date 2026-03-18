export default function formatNumber(value: string): string {
  const num = Number(value);
  const precision = num < 1 ? 6 : 2;
  const fixed = num.toFixed(precision);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}
