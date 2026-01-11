/**
 * Map constants and configuration
 */

// TopoJSON data source
export const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Zoom constraints
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 8;
export const ZOOM_FACTOR = 1.5;

// Default map position (centered on continental US)
export const DEFAULT_CENTER: [number, number] = [-96, 38];
export const DEFAULT_ZOOM = 1;

// Map bounds (continental US approximate)
export const MAP_BOUNDS = {
  minLng: -130,
  maxLng: -65,
  minLat: 22,
  maxLat: 50,
};

// Design system colors matching globals.css
export const COLORS = {
  background: '#000000',
  foreground: '#33FF00',
  accent: '#33FF00',
  accentDim: '#0A3300',
  accentMuted: '#66BB55',
  danger: '#FF0000',
  dangerDim: '#660000',
  warning: '#FFCC00',
  muted: '#1A1A1A',

  // State colors
  stateFill: '#1a1a1a',
  stateSelectedFill: '#0a2a0a',
  stateHoverFill: '#0a2a0a',
  stateBorder: '#00aa00',
  stateSelectedBorder: '#00ff00',

  // Glow effect
  glowColor: '#33FF00',
};

// Intensity color thresholds
export const INTENSITY_COLORS = {
  critical: '#ff3333',   // 8+
  elevated: '#ff6633',   // 6-8
  high: '#ffaa00',       // 4-6
  normal: '#00ff00',     // <4
};

/**
 * Get color based on hotspot intensity (1-10 scale)
 */
export function getIntensityColor(intensity: number): string {
  if (intensity >= 8) return INTENSITY_COLORS.critical;
  if (intensity >= 6) return INTENSITY_COLORS.elevated;
  if (intensity >= 4) return INTENSITY_COLORS.high;
  return INTENSITY_COLORS.normal;
}

/**
 * Get marker size based on intensity and zoom
 */
export function getIntensitySize(intensity: number, zoom: number): number {
  const baseSize = 2 + intensity * 0.8;
  return baseSize / Math.sqrt(zoom);
}

/**
 * Get cluster marker size based on count and zoom
 */
export function getClusterSize(count: number, zoom: number): number {
  const baseSize = 3 + Math.min(count * 1.5, 6);
  return baseSize / Math.sqrt(zoom);
}

/**
 * State name to abbreviation mapping
 */
export const STATE_NAME_TO_ABBR: Record<string, string> = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  'District of Columbia': 'DC',
  'Puerto Rico': 'PR',
};

/**
 * Abbreviation to state name mapping (reverse lookup)
 */
export const STATE_ABBR_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_ABBR).map(([name, abbr]) => [abbr, name])
);
