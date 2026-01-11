'use client';

import { useState, useEffect, useCallback } from 'react';
import { Report } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';

function getShareUrl(reportId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/report/${reportId}`;
  }
  return `/report/${reportId}`;
}

function getShareMessage(report: Report, t: { share: { alertPrefix: string; viewDetails: string } }): string {
  const location = report.location.address
    ? `${report.location.address}, ${report.location.city}, ${report.location.state}`
    : `${report.location.city}, ${report.location.state}`;

  return `${t.share.alertPrefix}: ${report.type} - ${location}`;
}

interface ShareButtonsProps {
  report: Report;
  t: {
    share: {
      title: string;
      sms: string;
      whatsapp: string;
      alertPrefix: string;
      viewDetails: string;
    };
  };
}

function ShareButtons({ report, t }: ShareButtonsProps) {
  const shareUrl = getShareUrl(report.id);
  const message = getShareMessage(report, t);
  const fullMessage = `${message}\n\n${t.share.viewDetails}: ${shareUrl}`;

  const handleSmsShare = useCallback(() => {
    // SMS uses sms: protocol - works on mobile devices
    const smsUrl = `sms:?body=${encodeURIComponent(fullMessage)}`;
    window.open(smsUrl, '_self');
  }, [fullMessage]);

  const handleWhatsAppShare = useCallback(() => {
    // WhatsApp uses wa.me for universal links
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [fullMessage]);

  return (
    <>
      <div className="text-[8px] text-accent-muted tracking-wider mb-2">{t.share.title}:</div>
      <div className="flex gap-2">
        <button
          onClick={handleSmsShare}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-accent-dim text-accent text-[8px] tracking-wider hover:bg-accent hover:text-background transition-none"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className='mt-1'>{t.share.sms}</span>
        </button>
        <button
          onClick={handleWhatsAppShare}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-accent-dim text-accent text-[8px] tracking-wider hover:bg-accent hover:text-background transition-none"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className='mt-1'>{t.share.whatsapp}</span>
        </button>
      </div>
    </>
  );
}

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
          <Button
            onClick={onClose}
            variant="icon"
            size="sm"
            className="text-[10px]"
          >
            [X]
          </Button>
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
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isSubmittingComment}
                  variant="primary"
                  size="sm"
                >
                  {isSubmittingComment ? t.detailModal.posting : t.detailModal.post}
                </Button>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <ShareButtons report={report} t={t} />

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              {t.detailModal.close}
            </Button>
            <Button
              onClick={handleVerify}
              disabled={hasVerified}
              variant={hasVerified ? 'secondary' : 'primary'}
              className="flex-1"
            >
              {hasVerified ? `${t.detailModal.verifiedCheck}` : `${t.detailModal.verifyReport}`}
            </Button>
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
