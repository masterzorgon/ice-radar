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
        className="absolute inset-0 bg-black/95 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border-2 border-pink-400 w-full max-w-md mx-4 crt-overlay">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-pink-400/50 bg-pink-400/10">
          <div className="flex items-center gap-2">
            <span className="text-pink-400 text-[10px]">{'<3'}</span>
            <span className="text-pink-400 text-[8px] tracking-wider">{t.donate.title}</span>
            <span className="text-pink-400/50 text-[8px] tracking-wider">{t.donate.subtitle}</span>
          </div>
          <Button
            onClick={onClose}
            variant="icon"
            size="sm"
            className="text-[10px] text-pink-400/50 hover:text-pink-400 hover:border-pink-400"
          >
            [X]
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Message */}
          <div className="text-[8px] text-accent tracking-wider bg-background border-2 border-accent-dim p-3">
            <p className="mb-2">
              {t.donate.message}
            </p>
            <ul className="text-accent-muted space-y-1">
              <li>{'>'} {t.donate.serverCosts}</li>
              <li>{'>'} {t.donate.development}</li>
              <li>{'>'} {t.donate.keepFree}</li>
            </ul>
          </div>

          {/* Stripe Payment Button */}
          <div className="space-y-3">
            <Button
              onClick={handleDonate}
              variant="donate"
              size="lg"
              fullWidth
              icon={<span>{'<3'}</span>}
            >
              {t.donationPopup.donateButton}
            </Button>

            <div className="flex items-center gap-2 justify-center">
              <span className="text-[8px] text-accent-muted tracking-wider">[#] {t.donate.securePayment}</span>
            </div>
          </div>

          {/* Security note */}
          <div className="text-[8px] text-accent-muted text-center border-t-2 border-accent-dim pt-3 mt-2 tracking-wider">
            {t.donate.securityNote}
            <br />
            <span className="text-accent-muted/50">{t.donate.noStorage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
