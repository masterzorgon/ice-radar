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
        return 'text-danger glow-danger';
      case 'UNVERIFIED':
        return 'text-warning glow-warning';
      case 'RESOLVED':
        return 'text-accent-muted';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'RAID':
        return '[!]';
      case 'CHECKPOINT':
        return '[#]';
      case 'PATROL':
        return '[*]';
      case 'DETENTION':
        return '[@]';
      case 'SURVEILLANCE':
        return '[?]';
    }
  };

  return (
    <div className="bg-background border-2 border-accent-dim flex flex-col h-full max-h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-accent-dim bg-accent-dim">
        <span className="text-accent text-[8px] tracking-wider glow-text">{t.feed.title}</span>
        <span className="text-accent-muted text-[8px] tracking-wider">{t.feed.subtitle}</span>
        <span className="ml-auto text-[8px] text-accent-muted tracking-wider">
          [{reports.length}] {t.feed.entries}
        </span>
      </div>

      {/* State filter indicator */}
      {selectedState && (
        <div className="flex items-center justify-between px-4 py-2 bg-accent/10 border-b-2 border-accent-dim">
          <span className="text-[8px] text-accent-muted tracking-wider">
            {'>'} {t.feed.filtering} <span className="text-accent glow-text">[{selectedState}]</span>
          </span>
          <button
            onClick={onClearState}
            className="text-[8px] text-accent-muted tracking-wider hover:text-accent px-2 py-1 border-2 border-transparent hover:border-accent-dim"
          >
            {t.feed.clear}
          </button>
        </div>
      )}

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto">
        {reports.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-accent-muted text-[8px] tracking-wider">
            {'>'} {t.feed.noReports}
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport?.(report)}
              className={`
                px-4 py-3 border-b-2 border-accent-dim/30 cursor-pointer
                hover:bg-accent/10
                ${selectedReportId === report.id ? 'bg-accent/10 border-l-4 border-l-accent' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`text-[10px] tracking-wider ${report.status === 'ACTIVE' ? 'text-danger glow-danger' : 'text-warning glow-warning'}`}
                >
                  {getTypeIcon(report.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] tracking-wider text-accent">
                      [{report.type}]
                    </span>
                    <span className={`text-[8px] tracking-wider ${getStatusColor(report.status)}`}>
                      [{report.status}]
                    </span>
                  </div>
                  <div className="text-[8px] text-accent tracking-wider mb-1">
                    {report.location.city}, {report.location.state}
                    {report.location.address && ` - ${report.location.address}`}
                  </div>
                  <div className="text-[8px] text-accent-muted tracking-wider truncate">
                    {'>'} {report.description}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[8px] tracking-wider">
                    <span className="text-accent-muted/50">
                      {formatDistanceToNow(report.timestamp, { addSuffix: true })}
                    </span>
                    <span className="text-accent-muted">
                      [OK] {report.verifiedCount} {t.feed.verified}
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
