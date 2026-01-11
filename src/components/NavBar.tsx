'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Button from '@/components/ui/Button';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Retro terminal nav link styles - chunky borders, instant hover
  const navLinkClass = (path: string) =>
    isActive(path)
      ? 'px-4 py-2 text-[8px] tracking-wider text-accent border-2 border-accent bg-accent/20 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center'
      : 'px-4 py-2 text-[8px] tracking-wider text-accent-muted border-2 border-transparent hover:border-accent-dim hover:text-accent cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center';

  // Mobile nav link style (full width)
  const mobileNavLinkClass = (path: string) =>
    isActive(path)
      ? 'px-4 py-3 text-[10px] tracking-wider text-accent border-2 border-accent bg-accent/20 cursor-pointer block w-full'
      : 'px-4 py-3 text-[10px] tracking-wider text-accent-muted border-2 border-transparent hover:border-accent-dim hover:text-accent cursor-pointer block w-full';

  // Icon button style for secondary actions
  const iconButtonClass = 'flex items-center gap-2 px-3 py-2 text-[8px] tracking-wider text-accent-muted border-2 border-transparent hover:border-accent-dim hover:text-accent cursor-pointer min-h-[44px]';

  // Mobile icon button style
  const mobileIconButtonClass = 'flex items-center gap-2 px-4 py-3 text-[10px] tracking-wider text-accent-muted border-2 border-transparent hover:border-accent-dim hover:text-accent cursor-pointer w-full';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 py-2 bg-background border-2 border-accent-dim">
        {/* Mobile hamburger menu button */}
        <Button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          variant="secondary"
          className="md:hidden min-h-[44px] min-w-[44px] text-[12px]"
          aria-label={t.nav.menu || 'Menu'}
        >
          {isMobileMenuOpen ? '[X]' : '[=]'}
        </Button>

        {/* Left side navigation - hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
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
            <Button onClick={onInfoClick} variant="ghost" className="min-h-[44px]">
              <span className="text-[10px]">[i]</span>
              <span>{t.nav.info}</span>
            </Button>
          )}
          {onDisclaimerClick && (
            <Button onClick={onDisclaimerClick} variant="ghost" className="min-h-[44px]">
              <span className="text-[10px]">[!]</span>
              <span>{t.nav.disclaimer}</span>
            </Button>
          )}
          {onSubscribeClick && (
            <Button onClick={onSubscribeClick} variant="ghost" className="min-h-[44px]">
              <span className="text-[10px]">[*]</span>
              <span>{t.nav.alerts || '[ALERTS]'}</span>
            </Button>
          )}
        </div>

        {/* Right side action buttons */}
        <div className="flex items-center gap-2">
          {rightContent}
          {onDonateClick && (
            <Button
              onClick={onDonateClick}
              variant="donate"
              pulse
              className="hidden sm:flex min-h-[44px]"
            >
              {'<3'} {t.nav.donate}
            </Button>
          )}
          {onReportClick && (
            <Button
              onClick={onReportClick}
              variant="danger"
              className="min-h-[44px]"
            >
              <span className="hidden sm:inline">[!] {t.nav.submitReport}</span>
              <span className="sm:hidden">[!] {t.nav.reportShort || 'REPORT'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-background border-2 border-t-0 border-accent-dim">
          <nav className="flex flex-col">
            <Link href="/" className={mobileNavLinkClass('/')} onClick={closeMobileMenu}>
              {t.nav.home}
            </Link>
            <Link href="/resources" className={mobileNavLinkClass('/resources')} onClick={closeMobileMenu}>
              {t.nav.resources}
            </Link>
            <Link href="/analytics" className={mobileNavLinkClass('/analytics')} onClick={closeMobileMenu}>
              {t.nav.analytics}
            </Link>

            {/* Pixel divider */}
            <div className="h-px mx-4 my-2 bg-accent-dim" />

            {onInfoClick && (
              <Button onClick={() => { onInfoClick(); closeMobileMenu(); }} variant="ghost" className="w-full justify-start px-4 py-3 text-[10px]">
                <span className="text-[12px]">[i]</span>
                <span>{t.nav.info}</span>
              </Button>
            )}
            {onDisclaimerClick && (
              <Button onClick={() => { onDisclaimerClick(); closeMobileMenu(); }} variant="ghost" className="w-full justify-start px-4 py-3 text-[10px]">
                <span className="text-[12px]">[!]</span>
                <span>{t.nav.disclaimer}</span>
              </Button>
            )}
            {onSubscribeClick && (
              <Button onClick={() => { onSubscribeClick(); closeMobileMenu(); }} variant="ghost" className="w-full justify-start px-4 py-3 text-[10px]">
                <span className="text-[12px]">[*]</span>
                <span>{t.nav.alerts || '[ALERTS]'}</span>
              </Button>
            )}

            {/* Donate button for mobile (hidden on larger screens in main nav) */}
            {onDonateClick && (
              <>
                <div className="h-px mx-4 my-2 bg-accent-dim sm:hidden" />
                <Button
                  onClick={() => { onDonateClick(); closeMobileMenu(); }}
                  variant="donate"
                  className="sm:hidden mx-4 mb-3 text-[10px] py-3"
                >
                  {'<3'} {t.nav.donate}
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
