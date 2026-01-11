'use client';

import { Report } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportFeedProps {
  reports: Report[];
  onSelectReport?: (report: Report) => void;
  selectedReportId?: string;
  selectedState?: string | null;
  onClearState?: () => void;
}

export default function ReportFeed({
  reports,
  onSelectReport,
  selectedReportId,
  selectedState,
  onClearState,
}: ReportFeedProps) {
  const { t } = useLanguage();

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-danger';
      case 'UNVERIFIED':
        return 'text-warning';
      case 'RESOLVED':
        return 'text-accent-dim';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'RAID':
        return '▲';
      case 'CHECKPOINT':
        return '◆';
      case 'PATROL':
        return '●';
      case 'DETENTION':
        return '■';
      case 'SURVEILLANCE':
        return '◎';
    }
  };

  return (
    <div className="bg-black/50 border border-accent-dim/30 flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-accent-dim/30 bg-black/50">
        <span className="text-accent text-xs">{t.feed.title}</span>
        <span className="text-accent-dim text-xs">{t.feed.subtitle}</span>
        <span className="ml-auto text-xs text-foreground/50">
          {reports.length} {t.feed.entries}
        </span>
      </div>

      {/* State filter indicator */}
      {selectedState && (
        <div className="flex items-center justify-between px-4 py-2 bg-accent/10 border-b border-accent-dim/30">
          <span className="text-xs text-foreground/60">
            {t.feed.filtering} <span className="text-accent font-bold">{selectedState}</span>
          </span>
          <button
            onClick={onClearState}
            className="text-xs text-foreground/40 hover:text-foreground transition-colors"
          >
            {t.feed.clear}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {reports.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-foreground/30 text-xs">
            {t.feed.noReports}
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport?.(report)}
              className={`
                px-4 py-3 border-b border-accent-dim/10 cursor-pointer
                hover:bg-accent/5 transition-colors
                ${selectedReportId === report.id ? 'bg-accent/10 border-l-2 border-l-accent' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-lg ${report.status === 'ACTIVE' ? 'text-danger' : 'text-warning'}`}
                >
                  {getTypeIcon(report.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-foreground">
                      {report.type}
                    </span>
                    <span className={`text-xs ${getStatusColor(report.status)}`}>
                      [{report.status}]
                    </span>
                  </div>
                  <div className="text-xs text-foreground/70 mb-1">
                    {report.location.city}, {report.location.state}
                    {report.location.address && ` - ${report.location.address}`}
                  </div>
                  <div className="text-xs text-foreground/50 truncate">
                    {report.description}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-foreground/40">
                      {formatDistanceToNow(report.timestamp, { addSuffix: true })}
                    </span>
                    <span className="text-accent-dim">
                      ✓ {report.verifiedCount} {t.feed.verified}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
