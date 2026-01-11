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
      {/* Backdrop - NO onClick handler for dismissal */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Modal */}
      <div className="relative bg-black/95 border border-accent-dim/50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-accent-dim/30 bg-black/50">
          <div className="flex items-center gap-2">
            <span className="text-pink-500 text-lg">&#9829;</span>
            <span className="text-accent text-xs">{t.donationPopup.title}</span>
            <span className="text-accent-dim text-xs">{t.donationPopup.subtitle}</span>
          </div>
          {/* NO X button - require explicit action */}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Compelling message */}
          <div className="text-xs text-foreground/70 bg-black/50 border border-accent-dim/30 p-3">
            <p className="mb-3 text-foreground/90">
              {t.donationPopup.mainMessage}
            </p>
            <p className="mb-2">
              {t.donationPopup.impactMessage}
            </p>
            <ul className="text-foreground/50 space-y-1">
              <li>&rarr; {t.donationPopup.impact1}</li>
              <li>&rarr; {t.donationPopup.impact2}</li>
              <li>&rarr; {t.donationPopup.impact3}</li>
            </ul>
          </div>

          {/* Stats/credibility */}
          <div className="flex items-center justify-center gap-4 text-xs text-foreground/40">
            <span>{t.donationPopup.credibility}</span>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleDonate}
            variant="donate"
            size="lg"
            fullWidth
            icon={
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            }
          >
            {t.donationPopup.donateButton}
          </Button>

          {/* Dismiss options */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onDismissForSession}
              className="flex-1 px-4 py-2 border border-accent-dim/30 text-foreground/50 text-xs hover:bg-accent/10 hover:text-foreground transition-colors cursor-pointer"
            >
              {t.donationPopup.maybeLater}
            </button>
            <button
              onClick={onDismissPermanently}
              className="flex-1 px-4 py-2 border border-accent-dim/30 text-foreground/30 text-xs hover:bg-accent/10 hover:text-foreground/50 transition-colors cursor-pointer"
            >
              {t.donationPopup.dontShowAgain}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
