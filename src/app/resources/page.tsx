'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import ResourceTabs from '@/components/Resources/ResourceTabs';
import ResourceSection from '@/components/Resources/ResourceSection';
import { resourceCategories } from '@/data/resourcesData';
import { useLanguage } from '@/contexts/LanguageContext';
import ReportModal from '@/components/ReportModal';
import DonateModal from '@/components/DonateModal';
import DonationPopupModal from '@/components/DonationPopupModal';
import InfoModal from '@/components/InfoModal';
import DisclaimerModal from '@/components/DisclaimerModal';
import SubscribeModal from '@/components/SubscribeModal';
import { useDonationPopup } from '@/hooks/useDonationPopup';

export default function ResourcesPage() {
  const { t } = useLanguage();
  const { isPopupOpen, dismissForSession, dismissPermanently } = useDonationPopup();
  const [activeTab, setActiveTab] = useState('rights');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const activeCategory = resourceCategories.find((cat) => cat.id === activeTab) || resourceCategories[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
        }}
      />

      <Header />

      <main className="flex-1 p-4 flex flex-col gap-4">
        <NavBar
          onInfoClick={() => setIsInfoModalOpen(true)}
          onDisclaimerClick={() => setIsDisclaimerModalOpen(true)}
          onSubscribeClick={() => setIsSubscribeModalOpen(true)}
          onDonateClick={() => setIsDonateModalOpen(true)}
          onReportClick={() => setIsReportModalOpen(true)}
        />

        {/* Page header */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-accent text-sm">[RESOURCES]</span>
          <span className="text-accent-dim text-sm">{t.resources?.pageTitle || 'KNOW YOUR RIGHTS & GET HELP'}</span>
        </div>

        {/* Tab navigation */}
        <div className="px-2">
          <ResourceTabs
            categories={resourceCategories}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 px-2">
          <ResourceSection category={activeCategory} />
        </div>
        
        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/50 border border-accent-dim/30 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-accent-dim">{t.statusBar.system}</span>
              <span className="text-accent">{t.statusBar.operational}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-dim">{t.resources?.categories || 'Categories'}:</span>
              <span className="text-accent">{resourceCategories.length}</span>
            </div>
          </div>
          <div className="text-foreground/40">
            {t.resources?.footer || 'External links open in new tabs'}
          </div>
        </div>
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={() => {}}
        reports={[]}
        onVerifyExisting={() => {}}
      />

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
      />

      {/* Subscribe Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />

      {/* Donation Popup Modal */}
      <DonationPopupModal
        isOpen={isPopupOpen}
        onDismissForSession={dismissForSession}
        onDismissPermanently={dismissPermanently}
      />
    </div>
  );
}
