import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getReport(id: string) {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!report) return null;

  return {
    id: report.id,
    type: report.type,
    status: report.status,
    location: {
      city: report.city,
      state: report.state,
      coordinates: [report.lng, report.lat] as [number, number],
      address: report.address ?? undefined,
    },
    description: report.description,
    timestamp: report.createdAt,
    verifiedCount: report.verifiedCount,
    reporterCount: 1,
    comments: report.comments.map((c) => ({
      id: c.id,
      text: c.text,
      authorName: c.authorName,
      createdAt: c.createdAt,
    })),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    return {
      title: 'Report Not Found | ICE Radar',
    };
  }

  const title = `ICE ALERT: ${report.type} in ${report.location.city}, ${report.location.state}`;
  const description = report.description.length > 150
    ? report.description.substring(0, 150) + '...'
    : report.description;

  const ogImageUrl = `/api/og/report/${id}`;

  return {
    title: `${title} | ICE Radar`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'ICE Radar',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  // Redirect to home page with report ID as query param
  // This opens the report in the modal on the main page
  redirect(`/?report=${id}`);
}
