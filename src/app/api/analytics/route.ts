import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AnalyticsData } from '@/types/analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try to get cached data from database
    const cached = await prisma.analyticsCache.findUnique({
      where: { dataType: 'FULL_DATASET' },
    });

    if (cached) {
      // Check cache freshness (24 hours)
      const cacheAge = Date.now() - cached.updatedAt.getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in ms

      if (cacheAge < maxAge) {
        return NextResponse.json({
          success: true,
          data: cached.data as unknown as AnalyticsData,
          source: 'cache',
          cachedAt: cached.updatedAt.toISOString(),
          fetchedAt: cached.fetchedAt.toISOString(),
        });
      }

      // Cache exists but is stale - still return it but indicate staleness
      return NextResponse.json({
        success: true,
        data: cached.data as unknown as AnalyticsData,
        source: 'stale_cache',
        cachedAt: cached.updatedAt.toISOString(),
        fetchedAt: cached.fetchedAt.toISOString(),
        message: 'Cache is stale. Consider triggering a refresh.',
      });
    }

    // No cache exists
    return NextResponse.json({
      success: false,
      data: null,
      source: 'unavailable',
      message: 'No cached data available. Run POST /api/analytics/refresh to populate cache.',
    }, { status: 404 });
  } catch (error) {
    console.error('Analytics fetch error:', error);

    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Database unavailable',
      message: 'Failed to fetch analytics data.',
    }, { status: 500 });
  }
}
