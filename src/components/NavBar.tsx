'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavBarProps {
  onDonateClick?: () => void;
  onReportClick?: () => void;
  onInfoClick?: () => void;
  onDisclaimerClick?: () => void;
  onSubscribeClick?: () => void;
  rightContent?: React.ReactNode;
}

export default function NavBar({ onDonateClick, onReportClick, onInfoClick, onDisclaimerClick, onSubscribeClick, rightContent }: NavBarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Retro terminal nav link styles - chunky borders, instant hover
  const navLinkClass = (path: string) =>
    isActive(path)
      ? 'px-4 py-2 text-[8px] tracking-wider text-accent border-2 border-accent bg-accent/20 cursor-pointer'
      : 'px-4 py-2 text-[8px] tracking-wider text-accent-muted border-2 border-transparent hover:border-accent-dim hover:text-accent cursor-pointer';

  // Icon button style for secondary actions
  const iconButtonClass = 'flex items-center gap-2 px-3 py-2 text-[8px] tracking-wider text-accent-muted border-2 border-transparent hover:border-accent-dim hover:text-accent cursor-pointer';

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-background border-2 border-accent-dim">
      {/* Left side navigation */}
      <div className="flex items-center gap-1">
        <Link href="/" className={navLinkClass('/')}>
          {t.nav.home}
        </Link>
        <Link href="/resources" className={navLinkClass('/resources')}>
          {t.nav.resources}
        </Link>
        <Link href="/analytics" className={navLinkClass('/analytics')}>
          {t.nav.analytics}
        </Link>

        {/* Pixel divider */}
        <div className="w-px h-4 mx-2 bg-accent-dim" />

        {onInfoClick && (
          <button onClick={onInfoClick} className={iconButtonClass}>
            <span className="text-[10px]">[i]</span>
            <span>{t.nav.info}</span>
          </button>
        )}
        {onDisclaimerClick && (
          <button onClick={onDisclaimerClick} className={iconButtonClass}>
            <span className="text-[10px]">[!]</span>
            <span>{t.nav.disclaimer}</span>
          </button>
        )}
        {onSubscribeClick && (
          <button onClick={onSubscribeClick} className={iconButtonClass}>
            <span className="text-[10px]">[*]</span>
            <span>{t.nav.alerts || '[ALERTS]'}</span>
          </button>
        )}
      </div>

      {/* Right side action buttons */}
      <div className="flex items-center gap-2">
        {rightContent}
        {onDonateClick && (
          <button
            onClick={onDonateClick}
            className="px-4 py-2 text-[8px] tracking-wider text-pink-400 border-2 border-pink-400 hover:bg-pink-400 hover:text-background cursor-pointer pixel-pulse"
          >
            {'<3'} {t.nav.donate}
          </button>
        )}
        {onReportClick && (
          <button
            onClick={onReportClick}
            className="px-4 py-2 text-[8px] tracking-wider text-danger border-2 border-danger hover:bg-danger hover:text-background cursor-pointer"
          >
            [!] {t.nav.submitReport}
          </button>
        )}
      </div>
    </div>
  );
}
