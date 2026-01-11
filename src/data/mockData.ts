import { Report, HotspotData, Stats } from '@/types';

export const mockReports: Report[] = [
  {
    id: '1',
    type: 'RAID',
    status: 'ACTIVE',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      coordinates: [-118.2437, 34.0522],
      address: 'Downtown LA',
    },
    description: 'Multiple vehicles spotted near factory district',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    verifiedCount: 12,
    reporterCount: 8,
    comments: [
      { id: 'c1', text: 'Still active as of now. Avoid the area.', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
      { id: 'c2', text: 'At least 4 vehicles seen.', timestamp: new Date(Date.now() - 1000 * 60 * 8) },
    ],
  },
  {
    id: '2',
    type: 'CHECKPOINT',
    status: 'ACTIVE',
    location: {
      city: 'Phoenix',
      state: 'AZ',
      coordinates: [-112.074, 33.4484],
      address: 'I-10 Westbound',
    },
    description: 'Checkpoint set up on interstate',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    verifiedCount: 24,
    reporterCount: 15,
    comments: [
      { id: 'c3', text: 'Use alternate route via US-60', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    ],
  },
  {
    id: '3',
    type: 'PATROL',
    status: 'UNVERIFIED',
    location: {
      city: 'Houston',
      state: 'TX',
      coordinates: [-95.3698, 29.7604],
    },
    description: 'Unmarked vehicles circling neighborhood',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    verifiedCount: 2,
    reporterCount: 1,
    comments: [],
  },
  {
    id: '4',
    type: 'RAID',
    status: 'RESOLVED',
    location: {
      city: 'Chicago',
      state: 'IL',
      coordinates: [-87.6298, 41.8781],
      address: 'West Side',
    },
    description: 'Workplace raid at manufacturing plant',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    verifiedCount: 45,
    reporterCount: 23,
    comments: [
      { id: 'c4', text: 'Activity has ended. Area is clear.', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
    ],
  },
  {
    id: '5',
    type: 'SURVEILLANCE',
    status: 'ACTIVE',
    location: {
      city: 'Miami',
      state: 'FL',
      coordinates: [-80.1918, 25.7617],
    },
    description: 'Agents observed near transit station',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    verifiedCount: 8,
    reporterCount: 5,
    comments: [],
  },
  {
    id: '6',
    type: 'DETENTION',
    status: 'ACTIVE',
    location: {
      city: 'New York',
      state: 'NY',
      coordinates: [-74.006, 40.7128],
      address: 'Queens',
    },
    description: 'Reports of detention near courthouse',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
    verifiedCount: 18,
    reporterCount: 12,
    comments: [
      { id: 'c5', text: 'Multiple people being held.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    ],
  },
  {
    id: '7',
    type: 'PATROL',
    status: 'ACTIVE',
    location: {
      city: 'San Diego',
      state: 'CA',
      coordinates: [-117.1611, 32.7157],
    },
    description: 'Increased patrol activity near border',
    timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 mins ago
    verifiedCount: 15,
    reporterCount: 9,
    comments: [],
  },
  {
    id: '8',
    type: 'CHECKPOINT',
    status: 'ACTIVE',
    location: {
      city: 'El Paso',
      state: 'TX',
      coordinates: [-106.485, 31.7619],
    },
    description: 'Interior checkpoint on US-54',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    verifiedCount: 32,
    reporterCount: 20,
    comments: [
      { id: 'c6', text: 'Checkpoint still active. Long delays.', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
      { id: 'c7', text: 'Taking US-62 as alternate.', timestamp: new Date(Date.now() - 1000 * 60 * 40) },
    ],
  },
];

export const mockHotspots: HotspotData[] = [
  { coordinates: [-118.2437, 34.0522], intensity: 9, recentReports: 47, city: 'Los Angeles', state: 'CA' },
  { coordinates: [-117.1611, 32.7157], intensity: 8, recentReports: 38, city: 'San Diego', state: 'CA' },
  { coordinates: [-112.074, 33.4484], intensity: 7, recentReports: 29, city: 'Phoenix', state: 'AZ' },
  { coordinates: [-95.3698, 29.7604], intensity: 8, recentReports: 41, city: 'Houston', state: 'TX' },
  { coordinates: [-106.485, 31.7619], intensity: 9, recentReports: 52, city: 'El Paso', state: 'TX' },
  { coordinates: [-97.7431, 30.2672], intensity: 5, recentReports: 18, city: 'Austin', state: 'TX' },
  { coordinates: [-80.1918, 25.7617], intensity: 6, recentReports: 23, city: 'Miami', state: 'FL' },
  { coordinates: [-74.006, 40.7128], intensity: 7, recentReports: 31, city: 'New York', state: 'NY' },
  { coordinates: [-87.6298, 41.8781], intensity: 6, recentReports: 25, city: 'Chicago', state: 'IL' },
  { coordinates: [-122.4194, 37.7749], intensity: 4, recentReports: 12, city: 'San Francisco', state: 'CA' },
  { coordinates: [-121.8863, 37.3382], intensity: 5, recentReports: 16, city: 'San Jose', state: 'CA' },
  { coordinates: [-104.9903, 39.7392], intensity: 4, recentReports: 14, city: 'Denver', state: 'CO' },
];

export const mockStats: Stats = {
  totalReports24h: 342,
  activeIncidents: 28,
  verifiedReports: 187,
  topStates: [
    { state: 'TX', count: 89 },
    { state: 'CA', count: 76 },
    { state: 'AZ', count: 45 },
    { state: 'FL', count: 38 },
    { state: 'NY', count: 31 },
  ],
};
