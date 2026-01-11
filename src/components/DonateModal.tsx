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


  const handleStripePayment = () => {
    // Open Stripe payment link in new tab
    // You can append amount as a query param if your Stripe link supports it
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
              onClick={handleStripePayment}
              variant="primary"
              size="lg"
              fullWidth
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                </svg>
              }
            >
              {t.donate.stripeButton}
            </Button>

            <div className="flex items-center gap-2 justify-center">
              <svg className="w-3 h-3 text-foreground/30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
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
