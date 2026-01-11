'use client';

import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

interface DonationPopupModalProps {
  isOpen: boolean;
  onDismissForSession: () => void;
  onDismissPermanently: () => void;
}

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVq3cufOi9hp6sm2ko28800";

export default function DonationPopupModal({
  isOpen,
  onDismissForSession,
  onDismissPermanently,
}: DonationPopupModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleDonate = () => {
    window.open(STRIPE_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
    onDismissPermanently();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Modal */}
      <div className="relative bg-background border-2 border-accent w-full max-w-md mx-4 crt-overlay">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-accent-dim bg-accent-dim">
          <div className="flex items-center gap-2">
            <span className="text-danger text-[10px] tracking-wider">[&lt;3]</span>
            <span className="text-accent text-[10px] tracking-wider glow-text">{t.donationPopup.title}</span>
            <span className="text-accent-dim text-[8px] tracking-wider">{t.donationPopup.subtitle}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Compelling message */}
          <div className="text-[8px] tracking-wider text-accent-dim bg-background border-2 border-accent-dim p-3">
            <p className="mb-3 text-accent">
              {'>'} {t.donationPopup.mainMessage}
            </p>
            <p className="mb-2">
              {t.donationPopup.impactMessage}
            </p>
            <ul className="text-accent-dim/70 space-y-1">
              <li>[*] {t.donationPopup.impact1}</li>
              <li>[*] {t.donationPopup.impact2}</li>
              <li>[*] {t.donationPopup.impact3}</li>
            </ul>
          </div>

          {/* Stats/credibility */}
          <div className="flex items-center justify-center gap-4 text-[8px] text-accent-dim/50 tracking-wider">
            <span>{t.donationPopup.credibility}</span>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleDonate}
            variant="donate"
            size="lg"
            fullWidth
            icon={<span className="text-[10px]">[&lt;3]</span>}
          >
            {t.donationPopup.donateButton}
          </Button>

          {/* Dismiss options */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onDismissForSession}
              className="flex-1 px-4 py-2 border-2 border-accent-dim text-accent-dim text-[8px] tracking-wider hover:bg-accent-dim hover:text-background cursor-pointer"
            >
              [{t.donationPopup.maybeLater}]
            </button>
            <button
              onClick={onDismissPermanently}
              className="flex-1 px-4 py-2 border-2 border-accent-dim/50 text-accent-dim/50 text-[8px] tracking-wider hover:bg-accent-dim/50 hover:text-background cursor-pointer"
            >
              [{t.donationPopup.dontShowAgain}]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
