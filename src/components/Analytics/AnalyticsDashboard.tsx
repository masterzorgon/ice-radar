'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import StatCard from '@/components/Analytics/StatCard';
import EnforcementChart from '@/components/Analytics/EnforcementChart';
import { CountriesChart, AgeChart, FamilyChart } from '@/components/Analytics/DemographicsChart';
import { useLanguage } from '@/contexts/LanguageContext';
import ReportModal from '@/components/ReportModal';
import DonateModal from '@/components/DonateModal';
import DonationPopupModal from '@/components/DonationPopupModal';
import InfoModal from '@/components/InfoModal';
import DisclaimerModal from '@/components/DisclaimerModal';
import SubscribeModal from '@/components/SubscribeModal';
import { useDonationPopup } from '@/hooks/useDonationPopup';
import { AnalyticsData } from '@/types/analytics';

// Dynamic import for map to avoid SSR issues
const StateHeatmap = dynamic(() => import('@/components/Analytics/StateHeatmap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/50 border border-accent-dim/30">
      <div className="text-accent-dim text-xs">
        LOADING MAP DATA<span className="animate-pulse">_</span>
      </div>
    </div>
  ),
});

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  dataSource?: string;
}

export default function AnalyticsDashboard({ data, dataSource }: AnalyticsDashboardProps) {
  const { t } = useLanguage();
  const { isPopupOpen, dismissForSession, dismissPermanently } = useDonationPopup();
  const { summary, monthlyTrends, countriesOfOrigin, ageGroups, familyStatus, stateEnforcement, lastUpdated, dataSources } = data;
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

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
          <span className="text-accent text-sm">[ANALYTICS]</span>
          <span className="text-accent-dim text-sm">{t.analytics?.pageTitle || 'ENFORCEMENT & DEMOGRAPHIC DATA'}</span>
          {dataSource && dataSource !== 'cache' && (
            <span className="text-xs text-yellow-500/70 ml-2">({dataSource})</span>
          )}
        </div>

        {/* Main content grid */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Left column - Stats */}
          <div className="col-span-2 flex flex-col gap-3">
            <StatCard
              label={t.analytics?.totalDeportations || 'Total Deportations'}
              value={summary.totalDeportations}
              previousValue={summary.totalDeportationsPrevPeriod}
              format="compact"
            />
            <StatCard
              label={t.analytics?.totalArrests || 'Total Arrests'}
              value={summary.totalArrests}
              previousValue={summary.totalArrestsPrevPeriod}
              format="compact"
            />
            <StatCard
              label={t.analytics?.avgDailyDetentions || 'Avg Daily Detentions'}
              value={summary.avgDailyDetentions}
              previousValue={summary.avgDailyDetentionsPrevPeriod}
              format="compact"
            />
            <StatCard
              label={t.analytics?.activeCases || 'Active Cases'}
              value={summary.activeCases}
              previousValue={summary.activeCasesPrevPeriod}
              format="compact"
            />

            {/* Data sources */}
            <div className="bg-black/50 border border-accent-dim/30 p-3 flex-1">
              <div className="text-accent-dim text-[10px] uppercase tracking-wider mb-2">
                {t.analytics?.dataSources || 'Data Sources'}
              </div>
              <div className="space-y-1.5">
                {dataSources.map((source, index) => (
                  <div key={index} className="text-[10px] text-foreground/50 flex items-start gap-1.5">
                    <span className="text-accent">-</span>
                    <span>{source}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-accent-dim/20 text-[10px] text-foreground/30">
                {t.analytics?.disclaimer || 'Data is aggregated from public sources and may not reflect real-time figures.'}
              </div>
            </div>
          </div>

          {/* Center column - Charts */}
          <div className="col-span-7 flex flex-col gap-4">
            {/* Enforcement trend chart */}
            <div className="h-64">
              <EnforcementChart
                data={monthlyTrends}
                title={t.analytics?.trendsTitle}
                subtitle={t.analytics?.trendsSubtitle}
              />
            </div>

            {/* Map and Countries side by side */}
            <div className="flex-1 grid grid-cols-2 gap-4 min-h-[300px]">
              <StateHeatmap
                data={stateEnforcement}
                title={t.analytics?.mapTitle}
                subtitle={t.analytics?.mapSubtitle}
              />
              <CountriesChart
                data={countriesOfOrigin}
                title={t.analytics?.originTitle}
                subtitle={t.analytics?.originSubtitle}
              />
            </div>
          </div>

          {/* Right column - Demographics */}
          <div className="col-span-3 flex flex-col gap-4">
            <div className="h-56">
              <AgeChart
                data={ageGroups}
                title={t.analytics?.ageTitle}
                subtitle={t.analytics?.ageSubtitle}
              />
            </div>
            <div className="flex-1">
              <FamilyChart
                data={familyStatus}
                title={t.analytics?.statusTitle}
                subtitle={t.analytics?.statusSubtitle}
              />
            </div>

            {/* Info box */}
            <div className="bg-accent/5 border border-accent/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent text-xs font-bold">{t.analytics?.aboutData || 'About This Data'}</span>
              </div>
              <p className="text-[10px] text-foreground/50">
                {t.analytics?.aboutDataDesc || 'This dashboard displays aggregated immigration enforcement statistics compiled from government agencies and research institutions. Data is updated periodically and represents cumulative figures for the selected time period.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/50 border border-accent-dim/30 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-accent-dim">{t.statusBar.system}</span>
              <span className="text-accent">{t.statusBar.operational}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-dim">{t.analytics?.period || 'Period'}:</span>
              <span className="text-accent">FY 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-dim">Updated:</span>
              <span className="text-accent">{formattedDate}</span>
            </div>
          </div>
          <div className="text-foreground/40">
            {t.analytics?.footerDisclaimer || 'Statistics are for informational purposes only'}
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
