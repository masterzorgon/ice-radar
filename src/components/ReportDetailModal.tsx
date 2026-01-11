'use client';

import { useState, useEffect } from 'react';
import { Report } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import ShareButtons from '@/components/ui/ShareButtons';

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
        return 'text-accent-muted';
    }
  };

  const getStatusBorder = (status: Report['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'border-danger';
      case 'UNVERIFIED':
        return 'border-warning';
      case 'RESOLVED':
        return 'border-accent-dim';
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
        className="absolute inset-0 bg-black/95 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border-2 border-accent w-full max-w-lg mx-4 crt-overlay">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-accent-dim bg-accent-dim">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] ${report.status === 'ACTIVE' ? 'text-danger glow-danger' : 'text-warning glow-warning'}`}>
              {getTypeIcon(report.type)}
            </span>
            <span className="text-accent text-[8px] tracking-wider glow-text">{t.detailModal.title}</span>
            <span className="text-accent-muted text-[8px] tracking-wider">{t.detailModal.report} #{report.id}</span>
          </div>
          <button
            onClick={onClose}
            className="text-accent-muted hover:text-accent text-[10px] px-2 py-1 border-2 border-transparent hover:border-accent"
          >
            [X]
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status & Type */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-[8px] tracking-wider border-2 ${getStatusBorder(report.status)} ${getStatusColor(report.status)}`}>
              [{report.status}]
            </span>
            <span className="px-3 py-1 text-[8px] tracking-wider bg-transparent border-2 border-accent-dim text-accent">
              [{report.type}]
            </span>
          </div>

          {/* Type Description */}
          <div className="text-[8px] text-accent-muted tracking-wider italic">
            {'>'} {getTypeDescription(report.type)}
          </div>

          {/* Location */}
          <div className="bg-background border-2 border-accent-dim p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[8px] text-accent-muted tracking-wider">{t.detailModal.location}</div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${report.location.coordinates[1]},${report.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[8px] text-accent tracking-wider hover:text-accent/80 flex items-center gap-1"
              >
                <span>[MAP]</span>
                <span>{t.detailModal.viewOnMaps}</span>
              </a>
            </div>
            <div className="text-[10px] text-accent tracking-wider">
              {report.location.city}, {report.location.state}
            </div>
            {report.location.address && (
              <div className="text-[8px] text-accent-muted tracking-wider mt-1">
                {report.location.address}
              </div>
            )}
            <div className="text-[8px] text-accent-muted/50 tracking-wider mt-2">
              {t.detailModal.coordinates} {report.location.coordinates[1].toFixed(4)}, {report.location.coordinates[0].toFixed(4)}
            </div>
          </div>

          {/* Description */}
          <div className="bg-background border-2 border-accent-dim p-3">
            <div className="text-[8px] text-accent-muted tracking-wider mb-1">{t.detailModal.descriptionLabel}</div>
            <div className="text-[10px] text-accent tracking-wider leading-relaxed">
              {report.description}
            </div>
          </div>

          {/* Timestamp & Verification */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background border-2 border-accent-dim p-3">
              <div className="text-[8px] text-accent-muted tracking-wider mb-1">{t.detailModal.reported}</div>
              <div className="text-[10px] text-accent tracking-wider">
                {formatDistanceToNow(report.timestamp, { addSuffix: true })}
              </div>
              <div className="text-[8px] text-accent-muted/50 tracking-wider mt-1">
                {format(report.timestamp, 'MMM d, yyyy HH:mm')}
              </div>
            </div>
            <div className="bg-background border-2 border-accent-dim p-3">
              <div className="text-[8px] text-accent-muted tracking-wider mb-1">{t.detailModal.verification}</div>
              <div className="text-[10px] text-accent tracking-wider glow-text">
                {report.verifiedCount} {t.detailModal.verified}
              </div>
              <div className="text-[8px] text-accent-muted/50 tracking-wider mt-1">
                {report.reporterCount} {report.reporterCount !== 1 ? t.detailModal.reporters : t.detailModal.reporter}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-background border-2 border-accent-dim p-3">
            <div className="text-[8px] text-accent-muted tracking-wider mb-2">{t.detailModal.comments} ({report.comments?.length || 0}):</div>

            {/* Existing Comments */}
            {report.comments && report.comments.length > 0 && (
              <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                {report.comments.map((comment) => (
                  <div key={comment.id} className="bg-background border-2 border-accent-dim/50 p-2">
                    <div className="text-[8px] text-accent tracking-wider">{comment.text}</div>
                    <div className="text-[8px] text-accent-muted/50 tracking-wider mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
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
                className="w-full bg-background border-2 border-accent-dim/50 px-2 py-1.5 text-[8px] text-accent tracking-wider placeholder:text-accent-muted/50 focus:border-accent focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between">
                <span className={`text-[8px] tracking-wider ${commentText.length >= 180 ? 'text-warning' : 'text-accent-muted/50'}`}>
                  {commentText.length}/200
                </span>
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="px-3 py-1 bg-transparent border-2 border-accent text-accent text-[8px] tracking-wider hover:bg-accent hover:text-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  [{isSubmittingComment ? t.detailModal.posting : t.detailModal.post}]
                </button>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="pt-2">
            <div className="text-[8px] text-accent-muted tracking-wider mb-2">{t.share.title}:</div>
            <ShareButtons report={report} variant="full" />
          </div>


          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-accent-dim text-accent-muted text-[8px] tracking-wider hover:border-accent hover:text-accent cursor-pointer"
            >
              {t.detailModal.close}
            </button>
            <button
              onClick={handleVerify}
              disabled={hasVerified}
              className={`flex-1 px-4 py-2 text-[8px] tracking-wider cursor-pointer border-2 ${hasVerified
                  ? 'border-accent-dim text-accent-muted cursor-not-allowed'
                  : 'border-accent text-accent hover:bg-accent hover:text-background'
                }`}
            >
              {hasVerified ? `${t.detailModal.verifiedCheck}` : `${t.detailModal.verifyReport}`}
            </button>
          </div>

          {/* Anonymous note */}
          <div className="text-[8px] text-accent-muted/50 text-center pt-2 tracking-wider">
            {t.detailModal.anonymousNote}
          </div>
        </div>
      </div>
    </div>
  );
}
