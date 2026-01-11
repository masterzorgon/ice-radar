'use client';

interface StatCardProps {
  label: string;
  value: number;
  previousValue?: number;
  format?: 'number' | 'compact';
}

function formatNumber(num: number, format: 'number' | 'compact' = 'number'): string {
  if (format === 'compact') {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
  }
  return num.toLocaleString();
}

function getChangePercent(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export default function StatCard({ label, value, previousValue, format = 'number' }: StatCardProps) {
  const changePercent = previousValue !== undefined ? getChangePercent(value, previousValue) : null;
  const isIncrease = changePercent !== null && changePercent > 0;
  const isDecrease = changePercent !== null && changePercent < 0;

  return (
    <div className="bg-black/50 border border-accent-dim/30 p-3">
      <div className="text-accent-dim text-[10px] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-accent text-xl font-bold tracking-tight">
        {formatNumber(value, format)}
      </div>
      {changePercent !== null && (
        <div className={`text-[10px] mt-1 flex items-center gap-1 ${
          isIncrease ? 'text-danger' : isDecrease ? 'text-accent' : 'text-foreground/50'
        }`}>
          {isIncrease && <span>+</span>}
          {changePercent.toFixed(1)}%
          <span className="text-foreground/30">vs prev period</span>
        </div>
      )}
    </div>
  );
}
