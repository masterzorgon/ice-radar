import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockAnalyticsData } from '@/data/analyticsData';
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

    // No cache exists - return mock data as fallback
    return NextResponse.json({
      success: true,
      data: mockAnalyticsData,
      source: 'fallback',
      message: 'No cached data available. Using fallback mock data. Run POST /api/analytics/refresh to populate cache.',
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);

    // Always return mock data on error so the page still works
    return NextResponse.json({
      success: true,
      data: mockAnalyticsData,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Database unavailable',
      message: 'Using fallback data due to database error.',
    });
  }
}
