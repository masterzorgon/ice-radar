import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const reports = await prisma.report.findMany({
      where: {
        createdAt: { gte: twentyFourHoursAgo },
        status: { in: ['ACTIVE', 'UNVERIFIED'] },
      },
      select: {
        city: true,
        state: true,
        lat: true,
        lng: true,
      },
    });

    // Aggregate by city/state
    const hotspotMap = new Map<
      string,
      {
        city: string;
        state: string;
        lat: number;
        lng: number;
        count: number;
      }
    >();

    for (const report of reports) {
      const key = `${report.city}-${report.state}`;
      const existing = hotspotMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        hotspotMap.set(key, {
          city: report.city,
          state: report.state,
          lat: report.lat,
          lng: report.lng,
          count: 1,
        });
      }
    }

    // Transform to HotspotData format
    const hotspots = Array.from(hotspotMap.values()).map((h) => ({
      coordinates: [h.lng, h.lat] as [number, number],
      intensity: Math.min(10, Math.ceil(h.count / 5)),
      recentReports: h.count,
      city: h.city,
      state: h.state,
    }));

    return NextResponse.json({ success: true, hotspots });
  } catch (error) {
    console.error('Failed to compute hotspots:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compute hotspots' },
      { status: 500 }
    );
  }
}
