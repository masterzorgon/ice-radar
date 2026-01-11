'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border-2 border-accent w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col crt-overlay">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-accent-dim bg-accent-dim">
          <div className="flex items-center gap-2">
            <span className="text-accent text-[10px]">[i]</span>
            <span className="text-accent text-[8px] tracking-wider glow-text">{t.infoModal.title}</span>
            <span className="text-accent-muted text-[8px] tracking-wider">{t.infoModal.subtitle}</span>
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
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Report Statuses */}
          <div>
            <h3 className="text-accent text-[8px] tracking-wider mb-3 flex items-center gap-2 glow-text">
              <span>{'>'}</span>
              {t.infoModal.reportStatuses}
            </h3>
            <div className="space-y-3">
              <div className="bg-background border-2 border-accent-dim p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-danger text-[8px] tracking-wider glow-danger">[{t.status.active}]</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.activeDesc}
                </p>
              </div>
              <div className="bg-background border-2 border-accent-dim p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-warning text-[8px] tracking-wider glow-warning">[{t.status.unverified}]</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.unverifiedDesc}
                </p>
              </div>
              <div className="bg-background border-2 border-accent-dim p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent-muted text-[8px] tracking-wider">[{t.status.resolved}]</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.resolvedDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Report Types */}
          <div>
            <h3 className="text-accent text-[8px] tracking-wider mb-3 flex items-center gap-2 glow-text">
              <span>{'>'}</span>
              {t.infoModal.reportTypes}
            </h3>
            <div className="space-y-3">
              <div className="bg-background border-2 border-accent-dim p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-danger text-[8px] tracking-wider">[{t.reportTypes.raid}]</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.raidDesc}
                </p>
              </div>
              <div className="bg-background border-2 border-accent-dim p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-warning text-[8px] tracking-wider">[{t.reportTypes.checkpoint}]</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.checkpointDesc}
                </p>
              </div>
              <div className="bg-background border-2 border-accent-dim p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent text-[8px] tracking-wider">[{t.reportTypes.patrol}]</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.patrolDesc}
                </p>
              </div>
              <div className="bg-background border-2 border-accent-dim p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent text-[8px] tracking-wider">[{t.reportTypes.detention}]</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.detentionDesc}
                </p>
              </div>
              <div className="bg-background border-2 border-accent-dim p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent text-[8px] tracking-wider">[{t.reportTypes.surveillance}]</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.surveillanceDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Threat Levels */}
          <div>
            <h3 className="text-accent text-[8px] tracking-wider mb-3 flex items-center gap-2 glow-text">
              <span>{'>'}</span>
              {t.infoModal.threatLevels}
            </h3>
            <div className="space-y-3">
              <div className="bg-background border-2 border-danger p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-danger" />
                  <span className="text-danger text-[8px] tracking-wider glow-danger">{t.infoModal.critical}</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.criticalDesc}
                </p>
              </div>
              <div className="bg-background border-2 border-warning p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-warning" />
                  <span className="text-warning text-[8px] tracking-wider glow-warning">{t.infoModal.elevated}</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.elevatedDesc}
                </p>
              </div>
              <div className="bg-background border-2 border-accent p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-accent" />
                  <span className="text-accent text-[8px] tracking-wider glow-text">{t.infoModal.normal}</span>
                </div>
                <p className="text-[8px] text-accent-muted tracking-wider">
                  {t.infoModal.normalDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div>
            <h3 className="text-accent text-[8px] tracking-wider mb-3 flex items-center gap-2 glow-text">
              <span>{'>'}</span>
              {t.infoModal.verificationSystem}
            </h3>
            <div className="bg-background border-2 border-accent-dim p-3">
              <p className="text-[8px] text-accent-muted tracking-wider mb-2">
                <span className="text-accent">{t.infoModal.verifiedCount}</span> {t.infoModal.verifiedCountDesc}
              </p>
              <p className="text-[8px] text-accent-muted tracking-wider">
                {t.infoModal.verificationNote}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t-2 border-accent-dim bg-accent-dim">
          <Button
            onClick={onClose}
            variant="primary"
            fullWidth
          >
            [{t.infoModal.close}]
          </Button>
        </div>
      </div>
    </div>
  );
}
