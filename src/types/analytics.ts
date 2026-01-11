export interface MonthlyEnforcementData {
  month: string;
  deportations: number;
  arrests: number;
  detentions: number;
}

export interface CountryOfOriginData {
  country: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

export interface AgeGroupData {
  group: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

export interface FamilyStatusData {
  status: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

export interface ApprehensionMethodData {
  method: string;
  count: number;
  percentage: number;
  [key: string]: string | number;
}

export interface StateEnforcementData {
  state: string;
  stateCode: string;
  enforcementActions: number;
  deportations: number;
  intensity: number; // 1-10 scale for heatmap
}

export interface AnalyticsSummary {
  totalDeportations: number;
  totalDeportationsPrevPeriod: number;
  totalArrests: number;
  totalArrestsPrevPeriod: number;
  avgDailyDetentions: number;
  avgDailyDetentionsPrevPeriod: number;
  activeCases: number;
  activeCasesPrevPeriod: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  monthlyTrends: MonthlyEnforcementData[];
  countriesOfOrigin: CountryOfOriginData[];
  ageGroups: AgeGroupData[];
  apprehensionMethods: ApprehensionMethodData[];
  stateEnforcement: StateEnforcementData[];
  lastUpdated: string;
  dataSources: string[];
}
