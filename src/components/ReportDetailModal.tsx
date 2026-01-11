'use client';

import { useState, useEffect } from 'react';
import { Report } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onVerify?: (reportId: string) => void;
  onAddComment?: (reportId: string, comment: string) => void;
}

const VERIFIED_REPORTS_KEY = 'ice-tracker-verified-reports';

export default function ReportDetailModal({ report, onClose, onVerify, onAddComment }: ReportDetailModalProps) {
  const { t } = useLanguage();
  const [hasVerified, setHasVerified] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (report) {
      const verified = localStorage.getItem(VERIFIED_REPORTS_KEY);
      const verifiedIds: string[] = verified ? JSON.parse(verified) : [];
      setHasVerified(verifiedIds.includes(report.id));
    }
  }, [report]);

  if (!report) return null;

  const handleVerify = () => {
    if (hasVerified || !onVerify) return;

    const verified = localStorage.getItem(VERIFIED_REPORTS_KEY);
    const verifiedIds: string[] = verified ? JSON.parse(verified) : [];
    verifiedIds.push(report.id);
    localStorage.setItem(VERIFIED_REPORTS_KEY, JSON.stringify(verifiedIds));

    setHasVerified(true);
    onVerify(report.id);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !onAddComment) return;

    setIsSubmittingComment(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onAddComment(report.id, commentText.trim());
    setCommentText('');
    setIsSubmittingComment(false);
  };

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

  const getStatusBg = (status: Report['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-danger/20 border-danger/50';
      case 'UNVERIFIED':
        return 'bg-warning/20 border-warning/50';
      case 'RESOLVED':
        return 'bg-accent-dim/20 border-accent-dim/50';
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

  const getTypeDescription = (type: Report['type']) => {
    switch (type) {
      case 'RAID':
        return t.detailModal.typeDescriptions.raid;
      case 'CHECKPOINT':
        return t.detailModal.typeDescriptions.checkpoint;
      case 'PATROL':
        return t.detailModal.typeDescriptions.patrol;
      case 'DETENTION':
        return t.detailModal.typeDescriptions.detention;
      case 'SURVEILLANCE':
        return t.detailModal.typeDescriptions.surveillance;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black/95 border border-accent-dim/50 w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-accent-dim/30 bg-black/50">
          <div className="flex items-center gap-2">
            <span className={`text-lg ${report.status === 'ACTIVE' ? 'text-danger' : 'text-warning'}`}>
              {getTypeIcon(report.type)}
            </span>
            <span className="text-accent text-xs">{t.detailModal.title}</span>
            <span className="text-accent-dim text-xs">{t.detailModal.report} #{report.id}</span>
          </div>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status & Type */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs border ${getStatusBg(report.status)} ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
            <span className="px-3 py-1 text-xs bg-black/50 border border-accent-dim/30 text-foreground">
              {report.type}
            </span>
          </div>

          {/* Type Description */}
          <div className="text-xs text-foreground/50 italic">
            {getTypeDescription(report.type)}
          </div>

          {/* Location */}
          <div className="bg-black/50 border border-accent-dim/30 p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-accent-dim">{t.detailModal.location}</div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${report.location.coordinates[1]},${report.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline flex items-center gap-1"
              >
                <span>📍</span>
                <span>{t.detailModal.viewOnMaps}</span>
              </a>
            </div>
            <div className="text-sm text-foreground">
              {report.location.city}, {report.location.state}
            </div>
            {report.location.address && (
              <div className="text-xs text-foreground/60 mt-1">
                {report.location.address}
              </div>
            )}
            <div className="text-xs text-foreground/40 mt-2">
              {t.detailModal.coordinates} {report.location.coordinates[1].toFixed(4)}, {report.location.coordinates[0].toFixed(4)}
            </div>
          </div>

          {/* Description */}
          <div className="bg-black/50 border border-accent-dim/30 p-3">
            <div className="text-xs text-accent-dim mb-1">{t.detailModal.descriptionLabel}</div>
            <div className="text-sm text-foreground/80 leading-relaxed">
              {report.description}
            </div>
          </div>

          {/* Timestamp & Verification */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/50 border border-accent-dim/30 p-3">
              <div className="text-xs text-accent-dim mb-1">{t.detailModal.reported}</div>
              <div className="text-sm text-foreground">
                {formatDistanceToNow(report.timestamp, { addSuffix: true })}
              </div>
              <div className="text-xs text-foreground/40 mt-1">
                {format(report.timestamp, 'MMM d, yyyy HH:mm')}
              </div>
            </div>
            <div className="bg-black/50 border border-accent-dim/30 p-3">
              <div className="text-xs text-accent-dim mb-1">{t.detailModal.verification}</div>
              <div className="text-sm text-accent">
                {report.verifiedCount} {t.detailModal.verified}
              </div>
              <div className="text-xs text-foreground/40 mt-1">
                {report.reporterCount} {report.reporterCount !== 1 ? t.detailModal.reporters : t.detailModal.reporter}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-black/50 border border-accent-dim/30 p-3">
            <div className="text-xs text-accent-dim mb-2">{t.detailModal.comments} ({report.comments?.length || 0}):</div>

            {/* Existing Comments */}
            {report.comments && report.comments.length > 0 && (
              <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                {report.comments.map((comment) => (
                  <div key={comment.id} className="bg-black/30 border border-accent-dim/20 p-2">
                    <div className="text-xs text-foreground/70">{comment.text}</div>
                    <div className="text-xs text-foreground/30 mt-1">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value.slice(0, 200))}
                placeholder={t.detailModal.addComment}
                rows={2}
                className="w-full bg-black/30 border border-accent-dim/20 px-2 py-1.5 text-xs text-foreground placeholder:text-foreground/30 focus:border-accent/50 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between">
                <span className={`text-xs ${commentText.length >= 180 ? 'text-warning' : 'text-foreground/30'}`}>
                  {commentText.length}/200
                </span>
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="px-3 py-1 bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmittingComment ? t.detailModal.posting : t.detailModal.post}
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-accent-dim/30 text-foreground/50 text-xs hover:bg-accent/10 hover:text-foreground transition-colors cursor-pointer"
            >
              {t.detailModal.close}
            </button>
            <button
              onClick={handleVerify}
              disabled={hasVerified}
              className={`flex-1 px-4 py-2 text-xs transition-colors cursor-pointer ${
                hasVerified
                  ? 'bg-accent/10 border border-accent/30 text-accent/70 cursor-not-allowed'
                  : 'bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30'
              }`}
            >
              {hasVerified ? `${t.detailModal.verifiedCheck} ✓` : t.detailModal.verifyReport}
            </button>
          </div>

          {/* Anonymous note */}
          <div className="text-xs text-foreground/30 text-center pt-2">
            {t.detailModal.anonymousNote}
          </div>
        </div>
      </div>
    </div>
  );
}
