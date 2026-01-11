export type ReportStatus = 'ACTIVE' | 'RESOLVED' | 'UNVERIFIED';

export type ReportType =
  | 'RAID'
  | 'CHECKPOINT'
  | 'PATROL'
  | 'DETENTION'
  | 'SURVEILLANCE';

export interface Comment {
  id: string;
  text: string;
  authorName?: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  type: ReportType;
  status: ReportStatus;
  location: {
    city: string;
    state: string;
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
  description: string;
  timestamp: Date;
  verifiedCount: number;
  reporterCount: number;
  comments: Comment[];
}

export interface HotspotData {
  coordinates: [number, number];
  intensity: number; // 1-10 scale
  recentReports: number;
  city: string;
  state: string;
}

export interface Stats {
  totalReports24h: number;
  activeIncidents: number;
  verifiedReports: number;
  topStates: { state: string; count: number }[];
}
