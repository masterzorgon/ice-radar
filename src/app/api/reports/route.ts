import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { resend, FROM_EMAIL } from '@/lib/resend';
import AlertNotification from '@/emails/AlertNotification';

const reportSchema = z.object({
  type: z.enum(['RAID', 'CHECKPOINT', 'PATROL', 'DETENTION', 'SURVEILLANCE']),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  address: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  description: z.string().min(1, 'Description is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = reportSchema.parse(body);

    // Create the report
    const report = await prisma.report.create({
      data: {
        type: data.type,
        status: 'UNVERIFIED',
        city: data.city,
        state: data.state,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        description: data.description,
      },
    });

    // Find all verified subscriptions for this state
    const subscriptions = await prisma.subscription.findMany({
      where: {
        verified: true,
        states: {
          contains: data.state,
        },
      },
    });

    // Send notification emails
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const viewUrl = `${baseUrl}/?report=${report.id}`;

    const emailPromises = subscriptions.map(async (subscription) => {
      const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${subscription.unsubscribeToken}`;

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: subscription.email,
          subject: `ICE Radar Alert: ${data.type} reported in ${data.state}`,
          react: AlertNotification({
            reportType: data.type,
            city: data.city,
            state: data.state,
            address: data.address,
            description: data.description,
            timestamp: new Date().toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            viewUrl,
            unsubscribeUrl,
          }),
        });
      } catch (error) {
        console.error(`Failed to send email to ${subscription.email}:`, error);
      }
    });

    // Send emails in parallel but don't block the response
    Promise.all(emailPromises).catch(console.error);

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        type: report.type,
        status: report.status,
        location: {
          city: report.city,
          state: report.state,
          address: report.address,
          coordinates: [report.lng, report.lat],
        },
        description: report.description,
        timestamp: report.createdAt,
      },
      notificationsSent: subscriptions.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      return NextResponse.json(
        { success: false, error: zodError.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Report submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
