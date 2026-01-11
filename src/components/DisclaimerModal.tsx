'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
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
            <svg className="w-4 h-4 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-warning text-xs">{t.disclaimer.title}</span>
            <span className="text-accent-dim text-xs">{t.disclaimer.subtitle}</span>
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
          {/* Main disclaimer */}
          <div className="bg-black/50 border border-warning/30 p-4">
            <p className="text-xs text-foreground/70 leading-relaxed">
              {t.disclaimer.mainText}
            </p>
          </div>

          {/* Key points */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-accent mt-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <span className="text-accent text-xs font-bold">{t.disclaimer.notLegalAdvice}</span>
                <p className="text-xs text-foreground/50 mt-1">{t.disclaimer.notLegalAdviceDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-accent mt-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <div>
                <span className="text-accent text-xs font-bold">{t.disclaimer.externalLinks}</span>
                <p className="text-xs text-foreground/50 mt-1">{t.disclaimer.externalLinksDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-accent mt-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <div>
                <span className="text-accent text-xs font-bold">{t.disclaimer.communityData}</span>
                <p className="text-xs text-foreground/50 mt-1">{t.disclaimer.communityDataDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-accent mt-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <span className="text-accent text-xs font-bold">{t.disclaimer.verifyIndependently}</span>
                <p className="text-xs text-foreground/50 mt-1">{t.disclaimer.verifyIndependentlyDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-accent-dim/30 bg-black/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-accent/10 border border-accent/30 text-accent text-xs hover:bg-accent/20 transition-colors cursor-pointer"
          >
            {t.disclaimer.close}
          </button>
        </div>
      </div>
    </div>
  );
}
