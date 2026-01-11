import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/reports/[id]/verify - Verify a report
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the report
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Increment verified count
    const newVerifiedCount = report.verifiedCount + 1;

    // Update status to ACTIVE if verified count reaches 3
    const newStatus = report.status === 'UNVERIFIED' && newVerifiedCount >= 3
      ? 'ACTIVE'
      : report.status;

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        verifiedCount: newVerifiedCount,
        status: newStatus,
      },
    });

    return NextResponse.json({
      success: true,
      report: {
        id: updatedReport.id,
        verifiedCount: updatedReport.verifiedCount,
        status: updatedReport.status,
      },
    });
  } catch (error) {
    console.error('Failed to verify report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify report' },
      { status: 500 }
    );
  }
}
