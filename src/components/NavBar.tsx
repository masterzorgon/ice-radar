'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavBarProps {
  onDonateClick?: () => void;
  onReportClick?: () => void;
  onInfoClick?: () => void;
  rightContent?: React.ReactNode;
}

export default function NavBar({ onDonateClick, onReportClick, onInfoClick, rightContent }: NavBarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) =>
    isActive(path)
      ? 'px-4 py-1.5 text-xs text-accent border border-accent/30 bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer'
      : 'px-4 py-1.5 text-xs text-foreground/70 border border-transparent hover:border-accent-dim/30 hover:text-foreground transition-colors cursor-pointer';

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/50 border border-accent-dim/30">
      <div className="flex items-center gap-1">
        <Link href="/" className={navLinkClass('/')}>
          {t.nav.home}
        </Link>
        <button className="px-4 py-1.5 text-xs text-foreground/70 border border-transparent hover:border-accent-dim/30 hover:text-foreground transition-colors cursor-pointer">
          {t.nav.resources}
        </button>
        <button className="px-4 py-1.5 text-xs text-foreground/70 border border-transparent hover:border-accent-dim/30 hover:text-foreground transition-colors cursor-pointer">
          {t.nav.blog}
        </button>
        <Link href="/analytics" className={navLinkClass('/analytics')}>
          {t.nav.analytics}
        </Link>
        <div className="w-px h-4 bg-accent-dim/30 mx-2" />
        {onInfoClick && (
          <button
            onClick={onInfoClick}
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-foreground/70 border border-transparent hover:border-accent-dim/30 hover:text-foreground transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>{t.nav.info}</span>
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {rightContent}
        {onDonateClick && (
          <button
            onClick={onDonateClick}
            className="px-4 py-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/50 text-pink-400 text-xs hover:from-pink-500/30 hover:to-purple-500/30 transition-all cursor-pointer animate-pulse hover:animate-none"
          >
            ♥ {t.nav.donate}
          </button>
        )}
        {onReportClick && (
          <button
            onClick={onReportClick}
            className="px-4 py-1.5 bg-danger/20 border border-danger/50 text-danger text-xs hover:bg-danger/30 transition-colors cursor-pointer"
          >
            {t.nav.submitReport}
          </button>
        )}
      </div>
    </div>
  );
}
