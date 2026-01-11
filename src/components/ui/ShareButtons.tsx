'use client';

import { Report } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShareButtonsProps {
  report: Report;
  variant?: 'full' | 'compact';
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-radar-q731.vercel.app';

export default function ShareButtons({ report, variant = 'full' }: ShareButtonsProps) {
  const { t } = useLanguage();

  const generateShareMessage = () => {
    const truncatedDescription = report.description.length > 100
      ? report.description.substring(0, 100) + '...'
      : report.description;

    const shareUrl = `${SITE_URL}/report/${report.id}`;

    return `${t.share.alertPrefix}: ${report.type} in ${report.location.city}, ${report.location.state}\n${truncatedDescription}\n${t.share.viewDetails}: ${shareUrl}`;
  };

  const handleSmsShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(generateShareMessage());
    window.open(`sms:?body=${message}`, '_blank');
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(generateShareMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleSmsShare}
          className="px-2 py-1 border-2 border-accent-dim text-accent-muted text-[8px] tracking-wider hover:border-accent hover:text-accent cursor-pointer"
          title={t.share.sms}
        >
          [SMS]
        </button>
        <button
          onClick={handleWhatsAppShare}
          className="px-2 py-1 border-2 border-accent-dim text-accent-muted text-[8px] tracking-wider hover:border-accent hover:text-accent cursor-pointer"
          title={t.share.whatsapp}
        >
          [WA]
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={handleSmsShare}
        className="flex-1 px-4 py-2 border-2 border-accent text-accent text-[8px] tracking-wider hover:bg-accent hover:text-background cursor-pointer"
      >
        [{t.share.sms}]
      </button>
      <button
        onClick={handleWhatsAppShare}
        className="flex-1 px-4 py-2 border-2 border-accent text-accent text-[8px] tracking-wider hover:bg-accent hover:text-background cursor-pointer"
      >
        [{t.share.whatsapp}]
      </button>
    </div>
  );
}
