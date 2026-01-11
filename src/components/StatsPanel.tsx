'use client';

import { Stats } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsPanelProps {
  stats: Stats | null;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const { t } = useLanguage();

  if (!stats) {
    return (
      <div className="bg-background border-2 border-accent-dim p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-accent text-[8px] tracking-wider glow-text">{t.stats.title}</span>
          <span className="text-accent-muted text-[8px] tracking-wider">{t.stats.subtitle}</span>
        </div>
        <div className="text-center text-accent-muted text-[8px] tracking-wider py-4">
          {'>'} NO STATISTICS AVAILABLE
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border-2 border-accent-dim p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-[8px] tracking-wider glow-text">{t.stats.title}</span>
        <span className="text-accent-muted text-[8px] tracking-wider">{t.stats.subtitle}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center border-2 border-accent-dim p-3">
          <div className="text-[16px] text-warning tracking-wider glow-warning">
            {stats.totalReports24h}
          </div>
          <div className="text-[8px] text-accent-muted tracking-wider mt-1">{t.stats.reports}</div>
        </div>
        <div className="text-center border-2 border-danger p-3">
          <div className="text-[16px] text-danger tracking-wider glow-danger">
            {stats.activeIncidents}
          </div>
          <div className="text-[8px] text-accent-muted tracking-wider mt-1">{t.stats.active}</div>
        </div>
        <div className="text-center border-2 border-accent p-3">
          <div className="text-[16px] text-accent tracking-wider glow-text">
            {stats.verifiedReports}
          </div>
          <div className="text-[8px] text-accent-muted tracking-wider mt-1">{t.stats.verified}</div>
        </div>
      </div>

      {/* Top States */}
      <div className="border-t-2 border-accent-dim pt-3">
        <div className="text-[8px] text-accent-muted tracking-wider mb-2">{'>'} {t.stats.topStates}</div>
        <div className="space-y-2">
          {stats.topStates.map((item, index) => (
            <div key={item.state} className="flex items-center gap-2 text-[8px] tracking-wider">
              <span className="text-accent-muted w-4">{index + 1}.</span>
              <span className="text-accent w-8">[{item.state}]</span>
              <div className="flex-1 h-2 bg-accent-dim/20 overflow-hidden border border-accent-dim/50">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${(item.count / stats.topStates[0].count) * 100}%` }}
                />
              </div>
              <span className="text-warning w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
