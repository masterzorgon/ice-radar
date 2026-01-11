'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import StatsPanel from '@/components/StatsPanel';
import ReportFeed from '@/components/ReportFeed';
import ReportModal, { ReportFormData } from '@/components/ReportModal';
import ReportDetailModal from '@/components/ReportDetailModal';
import DonateModal from '@/components/DonateModal';
import DonationPopupModal from '@/components/DonationPopupModal';
import InfoModal from '@/components/InfoModal';
import DisclaimerModal from '@/components/DisclaimerModal';
import SubscribeModal from '@/components/SubscribeModal';
import { useDonationPopup } from '@/hooks/useDonationPopup';
import { useReportsData } from '@/hooks/useReportsData';
import { Report } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamic import for map to avoid SSR issues
const USMap = dynamic(() => import('@/components/USMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background border-2 border-accent-dim">
      <div className="text-accent-dim text-[8px] tracking-wider">
        {'>'} LOADING MAP DATA<span className="cursor-blink"></span>
      </div>
    </div>
  ),
});

export default function Home() {
  const { t } = useLanguage();
  const { isPopupOpen, dismissForSession, dismissPermanently } = useDonationPopup();
  const {
    reports: dbReports,
    hotspots,
    stats,
    isLoading,
    refresh,
    lastUpdated,
  } = useReportsData();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>(dbReports);

  // Sync local reports when database reports are refreshed
  useEffect(() => {
    setReports(dbReports);
  }, [dbReports]);

  const filteredReports = useMemo(() => {
    if (!selectedState) return reports;
    return reports.filter((r) => r.location.state === selectedState);
  }, [reports, selectedState]);

  const handleSubmitReport = async (data: ReportFormData) => {
    const coordinates = data.coordinates || [-98, 39];

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: data.type,
          city: data.city,
          state: data.state,
          address: data.address,
          lat: coordinates[1],
          lng: coordinates[0],
          description: data.description,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('Failed to submit report:', result.error);
        alert('Failed to submit report. Please try again.');
        return;
      }

      // Add the new report from the API response to local state
      const newReport: Report = {
        id: result.report.id,
        type: result.report.type,
        status: result.report.status,
        location: {
          city: result.report.location.city,
          state: result.report.location.state,
          coordinates: result.report.location.coordinates,
          address: result.report.location.address,
        },
        description: result.report.description,
        timestamp: new Date(result.report.timestamp),
        verifiedCount: 0,
        reporterCount: 1,
        comments: [],
      };
      setReports([newReport, ...reports]);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleVerifyReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/verify`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('Failed to verify report:', result.error);
        alert('Failed to verify report. Please try again.');
        return;
      }

      // Update local state with the new verified count and status
      setReports(prevReports =>
        prevReports.map(report => {
          if (report.id === reportId) {
            return {
              ...report,
              verifiedCount: result.report.verifiedCount,
              status: result.report.status,
            };
          }
          return report;
        })
      );

      // Update selected report if it's the one being verified
      if (selectedReport?.id === reportId) {
        setSelectedReport(prev => prev ? {
          ...prev,
          verifiedCount: result.report.verifiedCount,
          status: result.report.status,
        } : null);
      }
    } catch (error) {
      console.error('Error verifying report:', error);
      alert('Failed to verify report. Please try again.');
    }
  };

  const handleAddComment = async (reportId: string, commentText: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('Failed to add comment:', result.error);
        alert('Failed to add comment. Please try again.');
        return;
      }

      const newComment = {
        id: result.comment.id,
        text: result.comment.text,
        authorName: result.comment.authorName,
        createdAt: new Date(result.comment.createdAt),
      };

      setReports(prevReports =>
        prevReports.map(report => {
          if (report.id === reportId) {
            return {
              ...report,
              comments: [...(report.comments || []), newComment],
            };
          }
          return report;
        })
      );

      // Update selected report to reflect the new comment
      if (selectedReport?.id === reportId) {
        setSelectedReport(prev => prev ? {
          ...prev,
          comments: [...(prev.comments || []), newComment],
        } : null);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 p-4 flex flex-col gap-4">
        <NavBar
          onInfoClick={() => setIsInfoModalOpen(true)}
          onDisclaimerClick={() => setIsDisclaimerModalOpen(true)}
          onSubscribeClick={() => setIsSubscribeModalOpen(true)}
          onDonateClick={() => setIsDonateModalOpen(true)}
          onReportClick={() => setIsReportModalOpen(true)}
        />

        {/* Main content grid */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* Left sidebar - Stats */}
          <div className="col-span-3 flex flex-col gap-4">
            <StatsPanel stats={stats} />

            {/* Quick info panel */}
            <div className="bg-background border-2 border-accent-dim p-4 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent text-[8px] tracking-wider glow-text">{t.infoPanel.title}</span>
                <span className="text-accent-dim text-[8px] tracking-wider">{t.infoPanel.subtitle}</span>
              </div>
              <p className="text-[8px] text-accent-dim tracking-wider mb-3">
                {'>'} {t.infoPanel.description}
              </p>
              <div className="space-y-3 text-[8px] tracking-wider">
                <div className="flex items-start gap-2">
                  <span className="text-accent shrink-0">[i]</span>
                  <div>
                    <span className="text-accent-dim">{t.infoPanel.whatToReport}</span>
                    <p className="text-accent-dim/50">{t.infoPanel.whatToReportDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent shrink-0">[*]</span>
                  <div>
                    <span className="text-accent-dim">{t.infoPanel.where}</span>
                    <p className="text-accent-dim/50">{t.infoPanel.whereDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent shrink-0">[#]</span>
                  <div>
                    <span className="text-accent-dim">{t.infoPanel.when}</span>
                    <p className="text-accent-dim/50">{t.infoPanel.whenDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent shrink-0">[@]</span>
                  <div>
                    <span className="text-accent-dim">{t.infoPanel.privacy}</span>
                    <p className="text-accent-dim/50">{t.infoPanel.privacyDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anonymity Notice */}
            <div className="bg-background border-2 border-accent p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent text-[8px] tracking-wider glow-text">[#] {t.anonymous.title}</span>
              </div>
              <p className="text-[8px] text-accent-dim tracking-wider">
                {t.anonymous.description}
              </p>
            </div>
          </div>

          {/* Center - Map */}
          <div className="col-span-6 relative">
            <USMap
              hotspots={hotspots}
              reports={reports}
              onSelectReport={handleSelectReport}
              selectedState={selectedState}
              onSelectState={setSelectedState}
            />
          </div>

          {/* Right sidebar - Feed */}
          <div className="col-span-3 min-h-0">
            <ReportFeed
              reports={filteredReports}
              onSelectReport={handleSelectReport}
              selectedReportId={selectedReport?.id}
              selectedState={selectedState}
              onClearState={() => setSelectedState(null)}
            />
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-background border-2 border-accent-dim text-[8px] tracking-wider">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-accent-dim">{t.statusBar.system}</span>
              <span className="text-accent glow-text">{t.statusBar.operational}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refresh}
                disabled={isLoading}
                className="px-3 py-1 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-background disabled:opacity-50 disabled:cursor-not-allowed"
              >
                [{isLoading ? 'REFRESHING...' : 'REFRESH DATA'}]
              </button>
              {lastUpdated && (
                <span className="text-accent-dim/50">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="text-accent-dim/50">
            {t.statusBar.disclaimer}
          </div>
        </div>
      </main>

      {/* Report Submission Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
        reports={reports}
        onVerifyExisting={handleVerifyReport}
      />

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={isDetailModalOpen ? selectedReport : null}
        onClose={handleCloseDetailModal}
        onVerify={handleVerifyReport}
        onAddComment={handleAddComment}
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
