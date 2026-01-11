'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';

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
          <Button
            onClick={onClose}
            variant="icon"
            size="sm"
            className="text-[10px] text-warning/50 hover:text-warning hover:border-warning"
          >
            [X]
          </Button>
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
          <Button
            onClick={onClose}
            variant="warning"
            fullWidth
          >
            [{t.disclaimer.close}]
          </Button>
        </div>
      </div>
    </div>
  );
}
