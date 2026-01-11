import { useState, useEffect, useCallback } from 'react';
import { Report, HotspotData, Stats } from '@/types';

interface UseReportsDataReturn {
  reports: Report[];
  hotspots: HotspotData[];
  stats: Stats | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useReportsData(): UseReportsDataReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [hotspots, setHotspots] = useState<HotspotData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [reportsRes, hotspotsRes, statsRes] = await Promise.all([
        fetch('/api/reports'),
        fetch('/api/hotspots'),
        fetch('/api/stats'),
      ]);

      const [reportsData, hotspotsData, statsData] = await Promise.all([
        reportsRes.json(),
        hotspotsRes.json(),
        statsRes.json(),
      ]);

      if (reportsData.success && reportsData.reports.length > 0) {
        setReports(
          reportsData.reports.map((r: Report) => ({
            ...r,
            timestamp: new Date(r.timestamp),
          }))
        );
      }
      if (hotspotsData.success && hotspotsData.hotspots.length > 0) {
        setHotspots(hotspotsData.hotspots);
      }
      if (statsData.success) {
        setStats(statsData.stats);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    reports,
    hotspots,
    stats,
    isLoading,
    error,
    refresh: fetchData,
    lastUpdated,
  };
}
