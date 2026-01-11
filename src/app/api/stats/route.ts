import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalReports, activeIncidents, verifiedReports, stateCounts] =
      await Promise.all([
        prisma.report.count({
          where: { createdAt: { gte: oneMonthAgo } },
        }),
        prisma.report.count({
          where: { status: 'ACTIVE', createdAt: { gte: oneMonthAgo } },
        }),
        prisma.report.count({
          where: { status: { not: 'UNVERIFIED' }, createdAt: { gte: oneMonthAgo } },
        }),
        prisma.report.groupBy({
          by: ['state'],
          where: { createdAt: { gte: oneMonthAgo } },
          _count: { state: true },
          orderBy: { _count: { state: 'desc' } },
          take: 5,
        }),
      ]);

    const stats = {
      totalReports24h: totalReports,
      activeIncidents,
      verifiedReports,
      topStates: stateCounts.map((s) => ({
        state: s.state,
        count: s._count.state,
      })),
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Failed to compute stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compute stats' },
      { status: 500 }
    );
  }
}
