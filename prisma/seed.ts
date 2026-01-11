import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  accelerateUrl: process.env.ACCELERATE_URL,
});

// Location data for generating realistic reports
const locations = [
  { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  { city: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611 },
  { city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194 },
  { city: 'San Jose', state: 'CA', lat: 37.3382, lng: -121.8863 },
  { city: 'Fresno', state: 'CA', lat: 36.7378, lng: -119.7871 },
  { city: 'Sacramento', state: 'CA', lat: 38.5816, lng: -121.4944 },
  { city: 'Oakland', state: 'CA', lat: 37.8044, lng: -122.2712 },
  { city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
  { city: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936 },
  { city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.797 },
  { city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
  { city: 'El Paso', state: 'TX', lat: 31.7619, lng: -106.485 },
  { city: 'Fort Worth', state: 'TX', lat: 32.7555, lng: -97.3308 },
  { city: 'McAllen', state: 'TX', lat: 26.2034, lng: -98.2300 },
  { city: 'Laredo', state: 'TX', lat: 27.5036, lng: -99.5075 },
  { city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.074 },
  { city: 'Tucson', state: 'AZ', lat: 32.2226, lng: -110.9747 },
  { city: 'Mesa', state: 'AZ', lat: 33.4152, lng: -111.8315 },
  { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
  { city: 'Orlando', state: 'FL', lat: 28.5383, lng: -81.3792 },
  { city: 'Tampa', state: 'FL', lat: 27.9506, lng: -82.4572 },
  { city: 'Jacksonville', state: 'FL', lat: 30.3322, lng: -81.6557 },
  { city: 'New York', state: 'NY', lat: 40.7128, lng: -74.006 },
  { city: 'Buffalo', state: 'NY', lat: 42.8864, lng: -78.8784 },
  { city: 'Rochester', state: 'NY', lat: 43.1566, lng: -77.6088 },
  { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  { city: 'Aurora', state: 'IL', lat: 41.7606, lng: -88.3201 },
  { city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903 },
  { city: 'Colorado Springs', state: 'CO', lat: 38.8339, lng: -104.8214 },
  { city: 'Atlanta', state: 'GA', lat: 33.749, lng: -84.388 },
  { city: 'Savannah', state: 'GA', lat: 32.0809, lng: -81.0912 },
  { city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
  { city: 'Spokane', state: 'WA', lat: 47.6588, lng: -117.426 },
  { city: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784 },
  { city: 'Las Vegas', state: 'NV', lat: 36.1699, lng: -115.1398 },
  { city: 'Reno', state: 'NV', lat: 39.5296, lng: -119.8138 },
  { city: 'Albuquerque', state: 'NM', lat: 35.0844, lng: -106.6504 },
  { city: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589 },
  { city: 'Philadelphia', state: 'PA', lat: 39.9526, lng: -75.1652 },
  { city: 'Detroit', state: 'MI', lat: 42.3314, lng: -83.0458 },
  { city: 'Minneapolis', state: 'MN', lat: 44.9778, lng: -93.265 },
  { city: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431 },
  { city: 'Raleigh', state: 'NC', lat: 35.7796, lng: -78.6382 },
  { city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816 },
  { city: 'Memphis', state: 'TN', lat: 35.1495, lng: -90.049 },
  { city: 'New Orleans', state: 'LA', lat: 29.9511, lng: -90.0715 },
  { city: 'Oklahoma City', state: 'OK', lat: 35.4676, lng: -97.5164 },
  { city: 'Kansas City', state: 'MO', lat: 39.0997, lng: -94.5786 },
  { city: 'Indianapolis', state: 'IN', lat: 39.7684, lng: -86.1581 },
  { city: 'Salt Lake City', state: 'UT', lat: 40.7608, lng: -111.891 },
];

const types = ['RAID', 'CHECKPOINT', 'PATROL', 'DETENTION', 'SURVEILLANCE'] as const;
const statuses = ['ACTIVE', 'RESOLVED', 'UNVERIFIED'] as const;

const descriptions = {
  RAID: [
    'Multiple ICE vehicles spotted at workplace',
    'Agents entering residential building',
    'Workplace raid in progress at warehouse',
    'Multiple agents seen at construction site',
    'ICE activity reported at restaurant',
    'Agents conducting operation at factory',
    'Multiple vehicles blocking entrance to business',
    'Workplace enforcement action underway',
    'Agents seen entering apartment complex',
    'ICE vehicles surrounding commercial building',
  ],
  CHECKPOINT: [
    'Checkpoint set up on interstate',
    'Traffic checkpoint on highway exit',
    'Vehicle checkpoint near border',
    'Interior checkpoint on main road',
    'Checkpoint causing traffic delays',
    'Mobile checkpoint spotted on freeway',
    'Document check at highway checkpoint',
    'Checkpoint at intersection',
    'Traffic stop checkpoint active',
    'Vehicle inspection checkpoint ahead',
  ],
  PATROL: [
    'Unmarked vehicles circling neighborhood',
    'Patrol vehicles in residential area',
    'Increased patrol activity observed',
    'Multiple patrol cars in the area',
    'Agents patrolling near school',
    'Patrol activity near transit station',
    'Vehicles patrolling commercial district',
    'Patrol presence near community center',
    'Agents walking through neighborhood',
    'Increased foot patrol activity',
  ],
  DETENTION: [
    'Reports of detention near courthouse',
    'Individual detained at bus stop',
    'Detention reported outside workplace',
    'Person taken into custody near home',
    'Detention at traffic stop',
    'Individual detained leaving store',
    'Custody reported near school',
    'Detention at public transit station',
    'Person detained during routine stop',
    'Custody reported in parking lot',
  ],
  SURVEILLANCE: [
    'Agents observed near transit station',
    'Surveillance vehicle parked in neighborhood',
    'Agents photographing residents',
    'Unmarked car conducting surveillance',
    'Agents watching building entrance',
    'Surveillance activity near workplace',
    'Agents monitoring public area',
    'Vehicle surveillance reported',
    'Agents observing from parked car',
    'Surveillance near community gathering',
  ],
};

const addresses = [
  'Main St',
  'Oak Ave',
  'First St',
  'Broadway',
  'Park Ave',
  'Industrial Blvd',
  'Commerce Dr',
  'Market St',
  'Central Ave',
  'Washington Blvd',
  null,
  null,
  null, // Some reports won't have specific addresses
];

function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomOffset(): number {
  // Small random offset for coordinate variation (roughly within a few miles)
  return (Math.random() - 0.5) * 0.1;
}

function generateReport(index: number) {
  const location = randomElement(locations);
  const type = randomElement(types);
  const status = randomElement(statuses);
  const description = randomElement(descriptions[type]);
  const address = randomElement(addresses);

  // Spread reports over the last 48 hours
  const hoursAgo = Math.random() * 48;
  const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

  return {
    type,
    status,
    city: location.city,
    state: location.state,
    lat: location.lat + randomOffset(),
    lng: location.lng + randomOffset(),
    address: address ? `${Math.floor(Math.random() * 9000) + 1000} ${address}` : null,
    description,
    createdAt,
  };
}

async function main() {
  console.log('Clearing existing reports...');
  await prisma.report.deleteMany();

  console.log('Seeding database with 346 reports...');

  const reports = Array.from({ length: 346 }, (_, i) => generateReport(i));

  // Use createMany for better performance
  await prisma.report.createMany({
    data: reports,
  });

  console.log('Created 346 reports');

  // Show distribution
  const byState = reports.reduce((acc, r) => {
    acc[r.state] = (acc[r.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\nReports by state:');
  Object.entries(byState)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([state, count]) => console.log(`  ${state}: ${count}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
