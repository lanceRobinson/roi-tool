export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return formatCurrency(value);
}

export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatPercentInput(value: number): string {
  return `${(value * 100).toFixed(1)}`;
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDays(value: number): string {
  return `${value.toFixed(1)} days`;
}

export function formatRoi(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}
