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
        className="absolute inset-0 bg-black/95 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border-2 border-warning w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col crt-overlay">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-warning/50 bg-warning/10">
          <div className="flex items-center gap-2">
            <span className="text-warning text-[10px]">[!]</span>
            <span className="text-warning text-[8px] tracking-wider glow-warning">{t.disclaimer.title}</span>
            <span className="text-warning/50 text-[8px] tracking-wider">{t.disclaimer.subtitle}</span>
          </div>
          <button
            onClick={onClose}
            className="text-warning/50 hover:text-warning text-[10px] px-2 py-1 border-2 border-transparent hover:border-warning"
          >
            [X]
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Main disclaimer */}
          <div className="bg-background border-2 border-warning/50 p-4">
            <p className="text-[8px] text-accent tracking-wider leading-relaxed">
              {t.disclaimer.mainText}
            </p>
          </div>

          {/* Key points */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-background border-2 border-accent-dim p-3">
              <span className="text-accent text-[10px] mt-0.5">[#]</span>
              <div>
                <span className="text-accent text-[8px] tracking-wider">{t.disclaimer.notLegalAdvice}</span>
                <p className="text-[8px] text-accent-muted tracking-wider mt-1">{t.disclaimer.notLegalAdviceDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-background border-2 border-accent-dim p-3">
              <span className="text-accent text-[10px] mt-0.5">[~]</span>
              <div>
                <span className="text-accent text-[8px] tracking-wider">{t.disclaimer.externalLinks}</span>
                <p className="text-[8px] text-accent-muted tracking-wider mt-1">{t.disclaimer.externalLinksDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-background border-2 border-accent-dim p-3">
              <span className="text-accent text-[10px] mt-0.5">[*]</span>
              <div>
                <span className="text-accent text-[8px] tracking-wider">{t.disclaimer.communityData}</span>
                <p className="text-[8px] text-accent-muted tracking-wider mt-1">{t.disclaimer.communityDataDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-background border-2 border-accent-dim p-3">
              <span className="text-accent text-[10px] mt-0.5">[?]</span>
              <div>
                <span className="text-accent text-[8px] tracking-wider">{t.disclaimer.verifyIndependently}</span>
                <p className="text-[8px] text-accent-muted tracking-wider mt-1">{t.disclaimer.verifyIndependentlyDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t-2 border-warning/50 bg-warning/10">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-transparent border-2 border-warning text-warning text-[8px] tracking-wider hover:bg-warning hover:text-background cursor-pointer"
          >
            [{t.disclaimer.close}]
          </button>
        </div>
      </div>
    </div>
  );
}
