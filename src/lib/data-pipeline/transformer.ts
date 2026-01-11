import {
  AnalyticsData,
  AnalyticsSummary,
  MonthlyEnforcementData,
  StateEnforcementData,
  CountryOfOriginData,
  AgeGroupData,
  ApprehensionMethodData,
} from '@/types/analytics';
import { RawImmigrationRecord } from './csv-parser';
import { US_STATES } from '@/data/states';
import detentionAggregates from '@/data/detention-aggregates.json';

// Build lookup maps
const stateCodeToName = new Map(US_STATES.map(s => [s.code, s.name]));
const stateNameToCode = new Map(US_STATES.map(s => [s.name.toUpperCase(), s.code]));

// Country name normalization
const COUNTRY_MAPPINGS: Record<string, string> = {
  'MEXICO': 'Mexico',
  'MEX': 'Mexico',
  'MX': 'Mexico',
  'GUATEMALA': 'Guatemala',
  'GUA': 'Guatemala',
  'GT': 'Guatemala',
  'HONDURAS': 'Honduras',
  'HON': 'Honduras',
  'HN': 'Honduras',
  'EL SALVADOR': 'El Salvador',
  'SALVADOR': 'El Salvador',
  'SLV': 'El Salvador',
  'SV': 'El Salvador',
  'VENEZUELA': 'Venezuela',
  'VEN': 'Venezuela',
  'VE': 'Venezuela',
  'COLOMBIA': 'Colombia',
  'COL': 'Colombia',
  'CO': 'Colombia',
  'ECUADOR': 'Ecuador',
  'ECU': 'Ecuador',
  'EC': 'Ecuador',
  'NICARAGUA': 'Nicaragua',
  'NIC': 'Nicaragua',
  'NI': 'Nicaragua',
  'BRAZIL': 'Brazil',
  'BRA': 'Brazil',
  'BR': 'Brazil',
  'CUBA': 'Cuba',
  'CUB': 'Cuba',
  'CU': 'Cuba',
  'HAITI': 'Haiti',
  'HTI': 'Haiti',
  'HT': 'Haiti',
  'DOMINICAN REPUBLIC': 'Dominican Republic',
  'DOM': 'Dominican Republic',
  'DO': 'Dominican Republic',
  'PERU': 'Peru',
  'PER': 'Peru',
  'PE': 'Peru',
  'CHINA': 'China',
  'CHN': 'China',
  'CN': 'China',
  'INDIA': 'India',
  'IND': 'India',
  'IN': 'India',
};

export function transformToAnalytics(
  records: RawImmigrationRecord[],
  previousPeriodRecords?: RawImmigrationRecord[]
): AnalyticsData {
  // Filter out records with no meaningful data
  const validRecords = records.filter(r =>
    r.apprehension_date || r.removal_date || r.book_in_date
  );

  const prevRecords = previousPeriodRecords?.filter(r =>
    r.apprehension_date || r.removal_date || r.book_in_date
  ) || [];

  return {
    summary: computeSummary(validRecords, prevRecords),
    monthlyTrends: computeMonthlyTrends(validRecords),
    countriesOfOrigin: computeCountriesOfOrigin(validRecords),
    ageGroups: computeAgeGroups(validRecords),
    apprehensionMethods: computeApprehensionMethods(validRecords),
    stateEnforcement: computeStateEnforcement(validRecords),
    lastUpdated: new Date().toISOString(),
    dataSources: [
      'Deportation Data Project (deportationdata.org)',
      'TRAC Immigration (Syracuse University)',
      'ICE Enforcement and Removal Operations (ERO)',
    ],
  };
}

function computeSummary(
  current: RawImmigrationRecord[],
  previous: RawImmigrationRecord[]
): AnalyticsSummary {
  // Count deportations (records with removal date)
  const deportations = current.filter(r => r.removal_date).length;
  const deportationsPrev = previous.filter(r => r.removal_date).length;

  // Count arrests (records with apprehension date)
  const arrests = current.filter(r => r.apprehension_date).length;
  const arrestsPrev = previous.filter(r => r.apprehension_date).length;

  // Use pre-aggregated detention data from GitHub Action
  // The 178MB detention file is too large for serverless, so we pre-process it
  return {
    totalDeportations: deportations,
    totalDeportationsPrevPeriod: deportationsPrev,
    totalArrests: arrests,
    totalArrestsPrevPeriod: arrestsPrev,
    avgDailyDetentions: detentionAggregates.summary.avgDailyDetentions,
    avgDailyDetentionsPrevPeriod: detentionAggregates.summary.avgDailyDetentionsPrevPeriod,
    activeCases: detentionAggregates.summary.activeCases,
    activeCasesPrevPeriod: detentionAggregates.summary.activeCasesPrevPeriod,
  };
}

function computeMonthlyTrends(records: RawImmigrationRecord[]): MonthlyEnforcementData[] {
  const monthlyData = new Map<string, { deportations: number; arrests: number; detentions: number }>();

  // Get current month key to exclude incomplete data
  const now = new Date();
  const currentMonthKey = formatMonthKey(now);

  // Define valid date range (2020 to current year)
  const minYear = 2020;
  const maxYear = now.getFullYear();

  for (const record of records) {
    // Use removal date first, then apprehension date, then book_in_date
    const dateStr = record.removal_date || record.apprehension_date || record.book_in_date;
    const date = parseDate(dateStr);
    if (!date) continue;

    // Filter out invalid dates (too old or in the future)
    const year = date.getFullYear();
    if (year < minYear || year > maxYear) continue;

    const monthKey = formatMonthKey(date);

    // Skip current month (incomplete data)
    if (monthKey === currentMonthKey) continue;

    const existing = monthlyData.get(monthKey) || { deportations: 0, arrests: 0, detentions: 0 };

    if (record.removal_date) existing.deportations++;
    if (record.apprehension_date) existing.arrests++;
    if (record.book_in_date) existing.detentions++;

    monthlyData.set(monthKey, existing);
  }

  // Convert to array and sort chronologically
  const entries = Array.from(monthlyData.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => parseMonthKey(a.month).getTime() - parseMonthKey(b.month).getTime());

  // Remove the most recent month in the data (likely incomplete from upstream source)
  // Only do this if the most recent month is within the last 3 months (recent data)
  if (entries.length > 0) {
    const lastEntry = entries[entries.length - 1];
    const lastMonthDate = parseMonthKey(lastEntry.month);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    if (lastMonthDate > threeMonthsAgo) {
      entries.pop(); // Remove the incomplete most recent month
    }
  }

  // Return last 12 complete months
  return entries.slice(-12);
}

function computeStateEnforcement(records: RawImmigrationRecord[]): StateEnforcementData[] {
  const stateData = new Map<string, { actions: number; deportations: number }>();

  for (const record of records) {
    const stateCode = normalizeState(record.apprehension_state);
    if (!stateCode) continue;

    const existing = stateData.get(stateCode) || { actions: 0, deportations: 0 };
    existing.actions++;
    if (record.removal_date) existing.deportations++;
    stateData.set(stateCode, existing);
  }

  // Calculate intensity (1-10 scale based on max)
  const values = Array.from(stateData.values());
  const maxActions = Math.max(...values.map(d => d.actions), 1);

  return Array.from(stateData.entries())
    .map(([stateCode, data]) => ({
      state: stateCodeToName.get(stateCode) || stateCode,
      stateCode,
      enforcementActions: data.actions,
      deportations: data.deportations,
      intensity: Math.max(1, Math.ceil((data.actions / maxActions) * 10)),
    }))
    .sort((a, b) => b.enforcementActions - a.enforcementActions);
}

function computeCountriesOfOrigin(records: RawImmigrationRecord[]): CountryOfOriginData[] {
  const countryCounts = new Map<string, number>();

  for (const record of records) {
    const country = normalizeCountry(record.citizenship || record.birth_country);
    countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
  }

  const total = records.length || 1;

  // Get top 10 and group rest as "Other"
  const sorted = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  const top10 = sorted.slice(0, 10);
  const otherCount = sorted.slice(10).reduce((sum, [, count]) => sum + count, 0);

  const result: CountryOfOriginData[] = top10.map(([country, count]) => ({
    country,
    count,
    percentage: Math.round((count / total) * 1000) / 10,
  }));

  if (otherCount > 0) {
    result.push({
      country: 'Other',
      count: otherCount,
      percentage: Math.round((otherCount / total) * 1000) / 10,
    });
  }

  return result;
}

function computeAgeGroups(records: RawImmigrationRecord[]): AgeGroupData[] {
  const groups = {
    '0-17': 0,
    '18-29': 0,
    '30-44': 0,
    '45-59': 0,
    '60+': 0,
  };

  const currentYear = new Date().getFullYear();

  for (const record of records) {
    if (!record.birth_year) continue;

    const birthYear = parseInt(record.birth_year, 10);
    if (isNaN(birthYear)) continue;

    // Calculate age at time of record (use apprehension date or current year)
    let recordYear = currentYear;
    const dateStr = record.apprehension_date || record.removal_date;
    if (dateStr) {
      const date = parseDate(dateStr);
      if (date) recordYear = date.getFullYear();
    }

    const age = recordYear - birthYear;

    if (age < 18) groups['0-17']++;
    else if (age < 30) groups['18-29']++;
    else if (age < 45) groups['30-44']++;
    else if (age < 60) groups['45-59']++;
    else groups['60+']++;
  }

  const total = Object.values(groups).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(groups).map(([group, count]) => ({
    group,
    count,
    percentage: Math.round((count / total) * 1000) / 10,
  }));
}

function computeApprehensionMethods(records: RawImmigrationRecord[]): ApprehensionMethodData[] {
  const methodCounts = new Map<string, number>();

  for (const record of records) {
    const method = record.apprehension_method?.trim() || 'Unknown';
    methodCounts.set(method, (methodCounts.get(method) || 0) + 1);
  }

  const total = records.length || 1;

  // Sort by count, take top methods, group rest as "Other"
  const sorted = Array.from(methodCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  const top5 = sorted.slice(0, 5);
  const otherCount = sorted.slice(5).reduce((sum, [, count]) => sum + count, 0);

  const result: ApprehensionMethodData[] = top5.map(([method, count]) => ({
    method: titleCase(method),
    count,
    percentage: Math.round((count / total) * 1000) / 10,
  }));

  if (otherCount > 0) {
    result.push({
      method: 'Other',
      count: otherCount,
      percentage: Math.round((otherCount / total) * 1000) / 10,
    });
  }

  return result;
}

// Utility functions
function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;

  // Try various date formats
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;

  // Try MM/DD/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts.map(Number);
    const parsed = new Date(year, month - 1, day);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

function daysBetween(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function formatMonthKey(date: Date): string {
  const month = date.toLocaleString('en', { month: 'short' });
  const year = String(date.getFullYear()).slice(-2);
  return `${month} ${year}`;
}

function parseMonthKey(key: string): Date {
  const [month, year] = key.split(' ');
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
  const fullYear = 2000 + parseInt(year, 10);
  return new Date(fullYear, monthIndex, 1);
}

function normalizeState(state: string | undefined): string | null {
  if (!state) return null;

  const trimmed = state.trim().toUpperCase();

  // Check if it's already a valid state code
  if (stateCodeToName.has(trimmed)) return trimmed;

  // Try to find by name
  const code = stateNameToCode.get(trimmed);
  if (code) return code;

  // Handle some common abbreviations or variations
  const variations: Record<string, string> = {
    'CALIF': 'CA',
    'CALIFORNIA': 'CA',
    'TEX': 'TX',
    'FLA': 'FL',
    'ARIZ': 'AZ',
    'N.Y.': 'NY',
    'N.J.': 'NJ',
    'N.C.': 'NC',
    'N.M.': 'NM',
  };

  return variations[trimmed] || null;
}

function normalizeCountry(country: string | undefined): string {
  if (!country) return 'Unknown';

  const trimmed = country.trim().toUpperCase();
  return COUNTRY_MAPPINGS[trimmed] || titleCase(country);
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
