import { prisma } from '@/lib/prisma';
import { AnalyticsData } from '@/types/analytics';
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard';

// Revalidate every hour via ISR
export const revalidate = 3600;

async function getAnalyticsData(): Promise<{ data: AnalyticsData | null; source: string }> {
  try {
    const cached = await prisma.analyticsCache.findUnique({
      where: { dataType: 'FULL_DATASET' },
    });

    if (cached) {
      // Check cache freshness (24 hours)
      const cacheAge = Date.now() - cached.updatedAt.getTime();
      const maxAge = 24 * 60 * 60 * 1000;

      if (cacheAge < maxAge) {
        return {
          data: cached.data as unknown as AnalyticsData,
          source: 'cache',
        };
      }

      // Return stale cache but indicate it
      return {
        data: cached.data as unknown as AnalyticsData,
        source: 'stale_cache',
      };
    }
  } catch (error) {
    console.error('Failed to fetch analytics from cache:', error);
  }

  return {
    data: null,
    source: 'unavailable',
  };
}

export default async function AnalyticsPage() {
  const { data, source } = await getAnalyticsData();

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-background border-2 border-danger p-8">
          <p className="text-danger text-[10px] tracking-wider glow-danger mb-2">[!] ANALYTICS DATA UNAVAILABLE</p>
          <p className="text-accent-dim text-[8px] tracking-wider">{'>'} PLEASE TRY AGAIN LATER OR RUN POST /API/ANALYTICS/REFRESH TO POPULATE THE CACHE.</p>
        </div>
      </div>
    );
  }

  return <AnalyticsDashboard data={data} dataSource={source} />;
}
