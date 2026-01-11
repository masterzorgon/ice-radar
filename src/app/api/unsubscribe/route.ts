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
      where: { unsubscribeToken: token },
    });

    if (!subscription) {
      return NextResponse.redirect(new URL('/?error=invalid-token', request.url));
    }

    await prisma.subscription.delete({
      where: { id: subscription.id },
    });

    return NextResponse.redirect(new URL('/?unsubscribed=success', request.url));
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.redirect(new URL('/?error=unsubscribe-failed', request.url));
  }
}
