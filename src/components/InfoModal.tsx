'use client';

import { useLanguage } from '@/contexts/LanguageContext';

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
        className="absolute inset-0 bg-black/80 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black/95 border border-accent-dim/50 w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-accent-dim/30 bg-black/50">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span className="text-accent text-xs">{t.infoModal.title}</span>
            <span className="text-accent-dim text-xs">{t.infoModal.subtitle}</span>
          </div>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Report Statuses */}
          <div>
            <h3 className="text-accent text-xs font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent" />
              {t.infoModal.reportStatuses}
            </h3>
            <div className="space-y-3">
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-danger font-bold text-xs">{t.status.active}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.activeDesc}
                </p>
              </div>
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-warning font-bold text-xs">{t.status.unverified}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.unverifiedDesc}
                </p>
              </div>
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent-dim font-bold text-xs">{t.status.resolved}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.resolvedDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Report Types */}
          <div>
            <h3 className="text-accent text-xs font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent" />
              {t.infoModal.reportTypes}
            </h3>
            <div className="space-y-3">
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-danger font-bold text-xs">{t.reportTypes.raid}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.raidDesc}
                </p>
              </div>
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-warning font-bold text-xs">{t.reportTypes.checkpoint}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.checkpointDesc}
                </p>
              </div>
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent font-bold text-xs">{t.reportTypes.patrol}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.patrolDesc}
                </p>
              </div>
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent font-bold text-xs">{t.reportTypes.detention}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.detentionDesc}
                </p>
              </div>
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent font-bold text-xs">{t.reportTypes.surveillance}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.surveillanceDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Threat Levels */}
          <div>
            <h3 className="text-accent text-xs font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent" />
              {t.infoModal.threatLevels}
            </h3>
            <div className="space-y-3">
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-danger" />
                  <span className="text-danger font-bold text-xs">{t.infoModal.critical}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.criticalDesc}
                </p>
              </div>
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-warning font-bold text-xs">{t.infoModal.elevated}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.elevatedDesc}
                </p>
              </div>
              <div className="bg-black/50 border border-accent-dim/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-accent font-bold text-xs">{t.infoModal.normal}</span>
                </div>
                <p className="text-xs text-foreground/60">
                  {t.infoModal.normalDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div>
            <h3 className="text-accent text-xs font-bold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent" />
              {t.infoModal.verificationSystem}
            </h3>
            <div className="bg-black/50 border border-accent-dim/30 p-3">
              <p className="text-xs text-foreground/60 mb-2">
                <span className="text-accent">{t.infoModal.verifiedCount}</span> {t.infoModal.verifiedCountDesc}
              </p>
              <p className="text-xs text-foreground/60">
                {t.infoModal.verificationNote}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-accent-dim/30 bg-black/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors cursor-pointer"
          >
            {t.infoModal.close}
          </button>
        </div>
      </div>
    </div>
  );
}
