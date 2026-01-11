'use client';

import Button from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVq3cufOi9hp6sm2ko28800";

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;


  const handleDonate = () => {
    window.open(STRIPE_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black/95 border border-accent-dim/50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-accent-dim/30 bg-black/50">
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">$</span>
            <span className="text-accent text-xs">{t.donate.title}</span>
            <span className="text-accent-dim text-xs">{t.donate.subtitle}</span>
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
          {/* Message */}
          <div className="text-xs text-foreground/70 bg-black/50 border border-accent-dim/30 p-3">
            <p className="mb-2">
              {t.donate.message}
            </p>
            <ul className="text-foreground/50 space-y-1">
              <li>→ {t.donate.serverCosts}</li>
              <li>→ {t.donate.development}</li>
              <li>→ {t.donate.keepFree}</li>
            </ul>
          </div>

          {/* Stripe Payment Button */}
          <div className="space-y-3">
            <Button
              onClick={handleDonate}
              variant="donate"
              size="lg"
              fullWidth
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              }
            >
              {t.donationPopup.donateButton}
            </Button>

            <div className="flex items-center gap-2 justify-center">
              <svg className="w-3 h-3 text-foreground/30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
              <span className="text-xs text-foreground/30">{t.donate.securePayment}</span>
            </div>
          </div>

          {/* Security note */}
          <div className="text-xs text-foreground/40 text-center border-t border-accent-dim/20 pt-3 mt-2">
            {t.donate.securityNote}
            <br />
            <span className="text-foreground/30">{t.donate.noStorage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
