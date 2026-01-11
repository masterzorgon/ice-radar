import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { resend, FROM_EMAIL } from '@/lib/resend';
import SubscriptionConfirmation from '@/emails/SubscriptionConfirmation';
import { randomBytes } from 'crypto';

const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  states: z.array(z.string()).min(1, 'Select at least one state'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, states } = subscribeSchema.parse(body);

    // Check if subscription already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      // Update existing subscription with new states
      const verificationToken = randomBytes(32).toString('hex');
      const unsubscribeToken = randomBytes(32).toString('hex');

      await prisma.subscription.update({
        where: { email },
        data: {
          states: states.join(','),
          verified: false,
          verificationToken,
          unsubscribeToken,
        },
      });

      // Send new verification email
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const verifyUrl = `${baseUrl}/api/verify?token=${verificationToken}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify your ICE Radar subscription',
        react: SubscriptionConfirmation({ verifyUrl, states }),
      });

      // Add contact to Resend audience (if configured)
      if (RESEND_AUDIENCE_ID) {
        await resend.contacts.create({
          email,
          audienceId: RESEND_AUDIENCE_ID,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Subscription updated. Please check your email to verify.',
      });
    }

    // Create new subscription
    const verificationToken = randomBytes(32).toString('hex');
    const unsubscribeToken = randomBytes(32).toString('hex');

    await prisma.subscription.create({
      data: {
        email,
        states: states.join(','),
        verificationToken,
        unsubscribeToken,
      },
    });

    // Send verification email
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/api/verify?token=${verificationToken}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your ICE Radar subscription',
      react: SubscriptionConfirmation({ verifyUrl, states }),
    });

    // Add contact to Resend audience (if configured)
    if (RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: RESEND_AUDIENCE_ID,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Please check your email to verify your subscription.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      return NextResponse.json(
        { success: false, error: zodError.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
