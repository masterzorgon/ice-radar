'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import StatCard from '@/components/Analytics/StatCard';
import EnforcementChart from '@/components/Analytics/EnforcementChart';
import { CountriesChart, AgeChart, ApprehensionMethodChart } from '@/components/Analytics/DemographicsChart';
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
    <div className="w-full h-full flex items-center justify-center bg-background border-2 border-accent-dim">
      <div className="text-accent-muted text-[8px] tracking-wider">
        {'>'} LOADING MAP DATA<span className="cursor-blink"></span>
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
  const { summary, monthlyTrends, countriesOfOrigin, ageGroups, apprehensionMethods, stateEnforcement, lastUpdated, dataSources } = data;
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
      <Header />

      <main className="flex-1 p-2 sm:p-4 flex flex-col gap-3 sm:gap-4">
        <NavBar
          onInfoClick={() => setIsInfoModalOpen(true)}
          onDisclaimerClick={() => setIsDisclaimerModalOpen(true)}
          onSubscribeClick={() => setIsSubscribeModalOpen(true)}
          onDonateClick={() => setIsDonateModalOpen(true)}
          onReportClick={() => setIsReportModalOpen(true)}
        />

        {/* Page header */}
        <div className="flex flex-wrap items-center gap-2 px-2 border-b-2 border-accent-dim pb-2">
          <span className="text-accent text-[10px] tracking-wider glow-text">[ANALYTICS]</span>
          <span className="text-accent-muted text-[8px] tracking-wider hidden sm:inline">{t.analytics?.pageTitle || 'ENFORCEMENT & DEMOGRAPHIC DATA'}</span>
          {dataSource && dataSource !== 'cache' && (
            <span className="text-[8px] text-warning tracking-wider ml-2">({dataSource})</span>
          )}
        </div>

        {/* Main content - flex column on mobile, grid on desktop */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 min-h-0">
          {/* Stats row - horizontal scroll on mobile, vertical column on desktop */}
          <div className="lg:col-span-2 lg:order-1 order-1">
            <div className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none">
              <div className="flex-shrink-0 w-[140px] sm:w-auto lg:w-full snap-start">
                <StatCard
                  label={t.analytics?.totalDeportations || 'Total Deportations'}
                  value={summary.totalDeportations}
                  previousValue={summary.totalDeportationsPrevPeriod}
                  format="compact"
                />
              </div>
              <div className="flex-shrink-0 w-[140px] sm:w-auto lg:w-full snap-start">
                <StatCard
                  label={t.analytics?.totalArrests || 'Total Arrests'}
                  value={summary.totalArrests}
                  previousValue={summary.totalArrestsPrevPeriod}
                  format="compact"
                />
              </div>
              <div className="flex-shrink-0 w-[140px] sm:w-auto lg:w-full snap-start">
                <StatCard
                  label={t.analytics?.avgDailyDetentions || 'Avg Daily Detentions'}
                  value={summary.avgDailyDetentions}
                  previousValue={summary.avgDailyDetentionsPrevPeriod}
                  format="compact"
                />
              </div>
              <div className="flex-shrink-0 w-[140px] sm:w-auto lg:w-full snap-start">
                <StatCard
                  label={t.analytics?.activeCases || 'Active Cases'}
                  value={summary.activeCases}
                  previousValue={summary.activeCasesPrevPeriod}
                  format="compact"
                />
              </div>
            </div>

            {/* Data sources - hidden on mobile, visible on desktop */}
            <div className="hidden lg:block bg-background border-2 border-accent-dim p-3 flex-1 mt-3">
              <div className="text-accent-muted text-[8px] uppercase tracking-wider mb-2">
                {'>'} {t.analytics?.dataSources || 'Data Sources'}
              </div>
              <div className="space-y-1.5">
                {dataSources.map((source, index) => (
                  <div key={index} className="text-[8px] tracking-wider text-accent-muted flex items-start gap-1.5">
                    <span className="text-accent">-</span>
                    <span>{source}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t-2 border-accent-dim text-[8px] text-accent-muted/50 tracking-wider">
                {t.analytics?.disclaimer || 'Data is aggregated from public sources and may not reflect real-time figures.'}
              </div>
            </div>
          </div>

          {/* Center column - Charts */}
          <div className="lg:col-span-7 lg:order-2 order-2 flex flex-col gap-3 sm:gap-4">
            {/* Enforcement trend chart */}
            <div className="h-48 sm:h-56 md:h-64">
              <EnforcementChart
                data={monthlyTrends}
                title={t.analytics?.trendsTitle}
                subtitle={t.analytics?.trendsSubtitle}
              />
            </div>

            {/* Map and Countries - stack on mobile, side by side on desktop */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 min-h-[250px] sm:min-h-[300px]">
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
          <div className="lg:col-span-3 lg:order-3 order-3 flex flex-col gap-3 sm:gap-4">
            <div className="h-48 sm:h-56">
              <AgeChart
                data={ageGroups}
                title={t.analytics?.ageTitle}
                subtitle={t.analytics?.ageSubtitle}
              />
            </div>
            <div className="flex-1 min-h-[200px]">
              <ApprehensionMethodChart
                data={apprehensionMethods}
                title={t.analytics?.methodTitle}
                subtitle={t.analytics?.methodSubtitle}
              />
            </div>

            {/* Info box */}
            <div className="bg-background border-2 border-accent p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent text-[8px] tracking-wider glow-text">[i] {t.analytics?.aboutData || 'About This Data'}</span>
              </div>
              <p className="text-[8px] text-accent-muted tracking-wider">
                {t.analytics?.aboutDataDesc || 'This dashboard displays aggregated immigration enforcement statistics compiled from government agencies and research institutions. Data is updated periodically and represents cumulative figures for the selected time period.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 px-3 sm:px-4 py-2 bg-background border-2 border-accent-dim text-[8px] tracking-wider">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-accent-muted">{t.statusBar.system}</span>
              <span className="text-accent glow-text">{t.statusBar.operational}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-muted">{t.analytics?.period || 'Period'}:</span>
              <span className="text-accent">FY 2024</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <span className="text-accent-muted">Updated:</span>
              <span className="text-accent">{formattedDate}</span>
            </div>
          </div>
          <div className="text-accent-muted/50 hidden md:block">
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
