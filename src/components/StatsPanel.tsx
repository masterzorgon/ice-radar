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
      <div className="bg-black/50 border border-accent-dim/30 p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-accent text-xs">{t.stats.title}</span>
          <span className="text-accent-dim text-xs">{t.stats.subtitle}</span>
        </div>
        <div className="text-center text-foreground/50 text-xs py-4">
          No statistics available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/50 border border-accent-dim/30 p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent text-xs">{t.stats.title}</span>
        <span className="text-accent-dim text-xs">{t.stats.subtitle}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl text-warning font-bold">
            {stats.totalReports24h}
          </div>
          <div className="text-xs text-foreground/50">{t.stats.reports}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-danger font-bold glow-danger">
            {stats.activeIncidents}
          </div>
          <div className="text-xs text-foreground/50">{t.stats.active}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl text-accent font-bold">
            {stats.verifiedReports}
          </div>
          <div className="text-xs text-foreground/50">{t.stats.verified}</div>
        </div>
      </div>

      <div className="border-t border-accent-dim/20 pt-3">
        <div className="text-xs text-accent-dim mb-2">{t.stats.topStates}</div>
        <div className="space-y-1">
          {stats.topStates.map((item, index) => (
            <div key={item.state} className="flex items-center gap-2 text-xs">
              <span className="text-accent-dim w-4">{index + 1}.</span>
              <span className="text-foreground w-8">{item.state}</span>
              <div className="flex-1 h-2 bg-muted/30 overflow-hidden">
                <div
                  className="h-full bg-accent-dim"
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
