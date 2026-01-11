import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchArrestsAndDetention, parseCSV, transformToAnalytics, analyzeCSVColumns } from '@/lib/data-pipeline';

// Optional API key protection
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Verify admin access if API key is configured
  if (ADMIN_API_KEY) {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Provide valid x-api-key header.' },
        { status: 401 }
      );
    }
  }

  // Determine trigger source
  const triggeredBy = request.headers.get('x-api-key') ? 'ADMIN' : 'CRON';

  // Create refresh log entry
  let logEntry;
  try {
    logEntry = await prisma.dataRefreshLog.create({
      data: {
        status: 'IN_PROGRESS',
        triggeredBy,
      },
    });
  } catch (dbError) {
    console.error('Failed to create log entry:', dbError);
    // Continue without logging if DB is unavailable
  }

  try {
    // Fetch both arrests and detention data
    const { hash, source, recordCount, datasets } = await fetchArrestsAndDetention();

    // Check if data has changed since last fetch
    const existingCache = await prisma.analyticsCache.findUnique({
      where: { dataType: 'FULL_DATASET' },
    });

    if (existingCache?.sourceHash === hash) {
      // Data unchanged - update log and return early
      if (logEntry) {
        await prisma.dataRefreshLog.update({
          where: { id: logEntry.id },
          data: {
            status: 'SUCCESS',
            recordCount: 0,
            duration: Date.now() - startTime,
            completedAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Data unchanged since last fetch. Cache remains valid.',
        hash,
        source,
      });
    }

    // Parse arrests data
    const arrestRecords = datasets.arrests ? parseCSV(datasets.arrests) : [];
    console.log(`Parsed ${arrestRecords.length} arrest records`);

    // Parse detention data separately
    const detentionRecords = datasets.detentionStays ? parseCSV(datasets.detentionStays) : [];
    console.log(`Parsed ${detentionRecords.length} detention records`);

    // Analyze columns for debugging (from arrests dataset)
    const columnAnalysis = datasets.arrests ? analyzeCSVColumns(datasets.arrests) : { detectedColumns: [], mappedColumns: [], unmappedColumns: [] };
    const detentionColumnAnalysis = datasets.detentionStays ? analyzeCSVColumns(datasets.detentionStays) : null;

    if (detentionColumnAnalysis) {
      console.log('Detention columns:', {
        detected: detentionColumnAnalysis.detectedColumns.slice(0, 15),
        mapped: detentionColumnAnalysis.mappedColumns,
      });
    }

    // Combine records - detention records will contribute book_in/book_out data
    const allRecords = [...arrestRecords, ...detentionRecords];

    if (allRecords.length === 0) {
      throw new Error('No records parsed from any dataset');
    }

    // Transform to analytics format
    const analyticsData = transformToAnalytics(allRecords);

    // Validate transformed data has content
    if (analyticsData.monthlyTrends.length === 0 && analyticsData.stateEnforcement.length === 0) {
      console.warn('Transformed data appears incomplete - check CSV column mappings');
    }

    // Update or create cache
    await prisma.analyticsCache.upsert({
      where: { dataType: 'FULL_DATASET' },
      create: {
        dataType: 'FULL_DATASET',
        data: analyticsData as object,
        sourceHash: hash,
        fetchedAt: new Date(),
      },
      update: {
        data: analyticsData as object,
        sourceHash: hash,
        fetchedAt: new Date(),
      },
    });

    // Update success log
    const duration = Date.now() - startTime;
    if (logEntry) {
      await prisma.dataRefreshLog.update({
        where: { id: logEntry.id },
        data: {
          status: 'SUCCESS',
          recordCount: allRecords.length,
          duration,
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Analytics cache refreshed successfully.',
      recordCount: allRecords.length,
      datasets: {
        arrests: arrestRecords.length,
        detentionStays: detentionRecords.length,
      },
      transformedRecords: {
        monthlyTrends: analyticsData.monthlyTrends.length,
        states: analyticsData.stateEnforcement.length,
        countries: analyticsData.countriesOfOrigin.length,
      },
      columnAnalysis: {
        arrests: {
          mapped: columnAnalysis.mappedColumns.length,
          sample: columnAnalysis.detectedColumns.slice(0, 10),
        },
        detention: detentionColumnAnalysis ? {
          mapped: detentionColumnAnalysis.mappedColumns.length,
          sample: detentionColumnAnalysis.detectedColumns.slice(0, 10),
        } : null,
      },
      duration: `${duration}ms`,
      source,
      hash,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Analytics refresh failed:', errorMessage);

    // Update failure log
    if (logEntry) {
      try {
        await prisma.dataRefreshLog.update({
          where: { id: logEntry.id },
          data: {
            status: 'FAILED',
            errorMessage,
            duration: Date.now() - startTime,
            completedAt: new Date(),
          },
        });
      } catch {
        console.error('Failed to update log entry');
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        duration: `${Date.now() - startTime}ms`,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check refresh status/history
export async function GET() {
  try {
    const recentLogs = await prisma.dataRefreshLog.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    const cache = await prisma.analyticsCache.findUnique({
      where: { dataType: 'FULL_DATASET' },
      select: {
        fetchedAt: true,
        updatedAt: true,
        sourceHash: true,
      },
    });

    return NextResponse.json({
      success: true,
      cache: cache
        ? {
            lastFetched: cache.fetchedAt.toISOString(),
            lastUpdated: cache.updatedAt.toISOString(),
            sourceHash: cache.sourceHash,
          }
        : null,
      recentRefreshes: recentLogs.map(log => ({
        id: log.id,
        status: log.status,
        recordCount: log.recordCount,
        duration: log.duration,
        triggeredBy: log.triggeredBy,
        startedAt: log.startedAt.toISOString(),
        completedAt: log.completedAt?.toISOString(),
        error: log.errorMessage,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch refresh status',
      },
      { status: 500 }
    );
  }
}
