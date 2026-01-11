import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const commentSchema = z.object({
  text: z.string().min(1, 'Comment text is required').max(2000, 'Comment is too long'),
  authorName: z.string().max(100, 'Name is too long').optional(),
});

// GET /api/reports/[id]/comments - Fetch all comments for a report
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { reportId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      comments: comments.map((c: { id: string; text: string; authorName: string | null; createdAt: Date }) => ({
        id: c.id,
        text: c.text,
        authorName: c.authorName,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/reports/[id]/comments - Add a comment to a report
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = commentSchema.parse(body);

    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        text: data.text,
        authorName: data.authorName || null,
        reportId: id,
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        text: comment.text,
        authorName: comment.authorName,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to add comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
