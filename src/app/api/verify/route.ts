import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/?error=invalid-token', request.url));
    }

    const subscription = await prisma.subscription.findUnique({
      where: { verificationToken: token },
    });

    if (!subscription) {
      return NextResponse.redirect(new URL('/?error=invalid-token', request.url));
    }

    if (subscription.verified) {
      return NextResponse.redirect(new URL('/?verified=already', request.url));
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { verified: true },
    });

    return NextResponse.redirect(new URL('/?verified=success', request.url));
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.redirect(new URL('/?error=verification-failed', request.url));
  }
}
