import { createHash } from 'crypto';
import * as XLSX from 'xlsx';

// Deportation Data Project provides downloadable datasets via GitHub
// Data files are Excel format (.xlsx)
const DATA_SOURCES = {
  // Primary: Arrests data (includes apprehension info)
  arrests: 'https://github.com/deportationdata/ice/raw/refs/heads/main/data/arrests-latest.xlsx',
  // Detention stays data
  detentionStays: 'https://github.com/deportationdata/ice/raw/refs/heads/main/data/detention-stays-latest.xlsx',
  // Detention stints (individual facility placements)
  detentionStints: 'https://github.com/deportationdata/ice/raw/refs/heads/main/data/detention-stints-latest.xlsx',
};

export interface FetchResult {
  content: string; // CSV-formatted string for compatibility
  hash: string;
  source: string;
  recordCount: number;
}

// Fetch Excel file and convert to CSV format
export async function fetchDeportationData(): Promise<FetchResult> {
  // Use custom URL if provided, otherwise use arrests data
  const url = process.env.DATA_SOURCE_URL || DATA_SOURCES.arrests;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ICE-Tracker-App/1.0 (Data aggregation for public transparency)',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Get the file as ArrayBuffer for xlsx parsing
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to CSV string
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);

    if (!csvContent || csvContent.length < 100) {
      throw new Error('Excel file appears to be empty or invalid');
    }

    const hash = createHash('md5').update(buffer).digest('hex');
    const lineCount = csvContent.split('\n').filter(line => line.trim()).length;

    return {
      content: csvContent,
      hash,
      source: url,
      recordCount: lineCount - 1, // Subtract header row
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown fetch error';
    throw new Error(`Failed to fetch data from ${url}: ${message}`);
  }
}

// Fetch multiple datasets and merge them
export async function fetchAllDatasets(): Promise<FetchResult> {
  const allRecords: string[] = [];
  let headerRow = '';
  const hashes: string[] = [];
  const sources: string[] = [];

  for (const [name, url] of Object.entries(DATA_SOURCES)) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'ICE-Tracker-App/1.0 (Data aggregation for public transparency)',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.warn(`Failed to fetch ${name}: HTTP ${response.status}`);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);

      const lines = csvContent.split('\n').filter(line => line.trim());

      if (lines.length > 0) {
        // Use first dataset's header, skip headers from subsequent datasets
        if (!headerRow) {
          headerRow = lines[0];
          allRecords.push(...lines);
        } else {
          allRecords.push(...lines.slice(1));
        }

        hashes.push(createHash('md5').update(buffer).digest('hex'));
        sources.push(url);
      }
    } catch (error) {
      console.warn(`Error fetching ${name}:`, error);
    }
  }

  if (allRecords.length === 0) {
    throw new Error('Failed to fetch any datasets');
  }

  const content = allRecords.join('\n');
  const combinedHash = createHash('md5').update(hashes.join('')).digest('hex');

  return {
    content,
    hash: combinedHash,
    source: sources.join(', '),
    recordCount: allRecords.length - 1,
  };
}

// Fetch from a local file path (for development/testing or manual uploads)
export async function fetchFromLocalFile(filePath: string): Promise<FetchResult> {
  const fs = await import('fs/promises');

  try {
    const buffer = await fs.readFile(filePath);

    // Check if it's an Excel file
    if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);

      const hash = createHash('md5').update(buffer).digest('hex');
      const lineCount = csvContent.split('\n').filter(line => line.trim()).length;

      return {
        content: csvContent,
        hash,
        source: `file://${filePath}`,
        recordCount: lineCount - 1,
      };
    }

    // Treat as CSV
    const content = buffer.toString('utf-8');
    const hash = createHash('md5').update(content).digest('hex');
    const lineCount = content.split('\n').filter(line => line.trim()).length;

    return {
      content,
      hash,
      source: `file://${filePath}`,
      recordCount: lineCount - 1,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to read local file ${filePath}: ${message}`);
  }
}

// Result with multiple CSV contents for different dataset types
export interface MultiDatasetResult extends FetchResult {
  datasets: {
    arrests?: string;
    detentionStays?: string;
  };
}

// Fetch arrests and detention data separately
export async function fetchArrestsAndDetention(): Promise<MultiDatasetResult> {
  const hashes: string[] = [];
  const sources: string[] = [];
  const datasets: { arrests?: string; detentionStays?: string } = {};
  let totalRecords = 0;

  // Fetch arrests data (primary dataset)
  try {
    console.log('Fetching arrests data...');
    const response = await fetch(DATA_SOURCES.arrests, {
      headers: { 'User-Agent': 'ICE-Tracker-App/1.0 (Data aggregation for public transparency)' },
      cache: 'no-store',
    });

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      datasets.arrests = XLSX.utils.sheet_to_csv(worksheet);
      const arrestRecords = datasets.arrests.split('\n').filter(line => line.trim()).length - 1;
      totalRecords += arrestRecords;
      hashes.push(createHash('md5').update(buffer).digest('hex'));
      sources.push('arrests');
      console.log(`Arrests: ${arrestRecords} records`);
    }
  } catch (error) {
    console.warn('Failed to fetch arrests:', error);
  }

  // NOTE: Detention stays dataset is ~178MB and too large to fetch reliably
  // The arrests dataset already contains deportation data (departed_date)
  // Detention metrics would require a separate data pipeline with streaming/chunked processing
  // For now, we skip the detention stays dataset
  console.log('Skipping detention stays dataset (too large: ~178MB). Using arrests data only.');

  if (!datasets.arrests && !datasets.detentionStays) {
    throw new Error('Failed to fetch any data from remote sources');
  }

  // For backward compatibility, return arrests as main content
  return {
    content: datasets.arrests || datasets.detentionStays || '',
    hash: createHash('md5').update(hashes.join('')).digest('hex'),
    source: sources.map(s => DATA_SOURCES[s as keyof typeof DATA_SOURCES] || s).join(', '),
    recordCount: totalRecords,
    datasets,
  };
}

// Try multiple sources in order until one succeeds
export async function fetchWithFallback(localFallbackPath?: string): Promise<FetchResult> {
  const errors: string[] = [];

  // Try fetching combined arrests + detention data
  try {
    return await fetchArrestsAndDetention();
  } catch (error) {
    errors.push(`Combined: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Fallback to just arrests data
  try {
    return await fetchDeportationData();
  } catch (error) {
    errors.push(`Arrests only: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Try local fallback if provided
  if (localFallbackPath) {
    try {
      return await fetchFromLocalFile(localFallbackPath);
    } catch (error) {
      errors.push(`Local: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  throw new Error(`All data sources failed:\n${errors.join('\n')}`);
}
