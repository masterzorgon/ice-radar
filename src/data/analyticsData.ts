import { AnalyticsData } from '@/types/analytics';

// Mock data based on publicly available statistics patterns
// In production, this would be fetched from APIs (TRAC, CBP, ICE ERO)
export const mockAnalyticsData: AnalyticsData = {
  summary: {
    totalDeportations: 142847,
    totalDeportationsPrevPeriod: 128392,
    totalArrests: 89234,
    totalArrestsPrevPeriod: 76891,
    avgDailyDetentions: 38420,
    avgDailyDetentionsPrevPeriod: 34180,
    activeCases: 3247891,
    activeCasesPrevPeriod: 2981456,
  },

  monthlyTrends: [
    { month: 'Jan 24', deportations: 8234, arrests: 5621, detentions: 34200 },
    { month: 'Feb 24', deportations: 7891, arrests: 5234, detentions: 33800 },
    { month: 'Mar 24', deportations: 9123, arrests: 6102, detentions: 35100 },
    { month: 'Apr 24', deportations: 10234, arrests: 6891, detentions: 36400 },
    { month: 'May 24', deportations: 11567, arrests: 7234, detentions: 37200 },
    { month: 'Jun 24', deportations: 12891, arrests: 7891, detentions: 38100 },
    { month: 'Jul 24', deportations: 13234, arrests: 8234, detentions: 38900 },
    { month: 'Aug 24', deportations: 12567, arrests: 7891, detentions: 38600 },
    { month: 'Sep 24', deportations: 11891, arrests: 7456, detentions: 38200 },
    { month: 'Oct 24', deportations: 12234, arrests: 7678, detentions: 38400 },
    { month: 'Nov 24', deportations: 13456, arrests: 8102, detentions: 39100 },
    { month: 'Dec 24', deportations: 14525, arrests: 8900, detentions: 39420 },
  ],

  countriesOfOrigin: [
    { country: 'Mexico', count: 52341, percentage: 36.6 },
    { country: 'Guatemala', count: 24891, percentage: 17.4 },
    { country: 'Honduras', count: 18234, percentage: 12.8 },
    { country: 'El Salvador', count: 12567, percentage: 8.8 },
    { country: 'Venezuela', count: 9891, percentage: 6.9 },
    { country: 'Colombia', count: 6234, percentage: 4.4 },
    { country: 'Ecuador', count: 5123, percentage: 3.6 },
    { country: 'Nicaragua', count: 4567, percentage: 3.2 },
    { country: 'Brazil', count: 3891, percentage: 2.7 },
    { country: 'Cuba', count: 3234, percentage: 2.3 },
    { country: 'Other', count: 1874, percentage: 1.3 },
  ],

  ageGroups: [
    { group: '0-17', count: 18567, percentage: 13.0 },
    { group: '18-29', count: 48234, percentage: 33.8 },
    { group: '30-44', count: 52891, percentage: 37.0 },
    { group: '45-59', count: 18234, percentage: 12.8 },
    { group: '60+', count: 4921, percentage: 3.4 },
  ],

  familyStatus: [
    { status: 'Single Adults', count: 89234, percentage: 62.5 },
    { status: 'Family Units', count: 38567, percentage: 27.0 },
    { status: 'Unaccompanied Minors', count: 15046, percentage: 10.5 },
  ],

  stateEnforcement: [
    { state: 'Texas', stateCode: 'TX', enforcementActions: 28934, deportations: 42341, intensity: 10 },
    { state: 'California', stateCode: 'CA', enforcementActions: 21234, deportations: 28567, intensity: 9 },
    { state: 'Arizona', stateCode: 'AZ', enforcementActions: 18567, deportations: 24891, intensity: 9 },
    { state: 'Florida', stateCode: 'FL', enforcementActions: 12891, deportations: 15234, intensity: 7 },
    { state: 'New York', stateCode: 'NY', enforcementActions: 8234, deportations: 9891, intensity: 6 },
    { state: 'Illinois', stateCode: 'IL', enforcementActions: 6891, deportations: 8234, intensity: 5 },
    { state: 'Georgia', stateCode: 'GA', enforcementActions: 5234, deportations: 6567, intensity: 5 },
    { state: 'North Carolina', stateCode: 'NC', enforcementActions: 4891, deportations: 5891, intensity: 4 },
    { state: 'New Jersey', stateCode: 'NJ', enforcementActions: 4234, deportations: 5234, intensity: 4 },
    { state: 'Colorado', stateCode: 'CO', enforcementActions: 3567, deportations: 4567, intensity: 3 },
    { state: 'Nevada', stateCode: 'NV', enforcementActions: 3234, deportations: 4234, intensity: 3 },
    { state: 'New Mexico', stateCode: 'NM', enforcementActions: 2891, deportations: 3891, intensity: 3 },
    { state: 'Washington', stateCode: 'WA', enforcementActions: 2567, deportations: 3234, intensity: 2 },
    { state: 'Virginia', stateCode: 'VA', enforcementActions: 2234, deportations: 2891, intensity: 2 },
    { state: 'Maryland', stateCode: 'MD', enforcementActions: 1891, deportations: 2567, intensity: 2 },
  ],

  lastUpdated: '2024-12-31T23:59:59Z',
  dataSources: [
    'TRAC Immigration (Syracuse University)',
    'U.S. Customs and Border Protection (CBP)',
    'ICE Enforcement and Removal Operations (ERO)',
  ],
};
