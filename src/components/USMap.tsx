'use client';

import { useState, memo, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { HotspotData, Report } from '@/types';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// State name to abbreviation mapping
const stateNameToAbbr: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC', 'Puerto Rico': 'PR',
};

interface USMapProps {
  hotspots: HotspotData[];
  reports: Report[];
  onSelectReport?: (report: Report) => void;
  selectedState: string | null;
  onSelectState: (state: string | null) => void;
}

// Calculate distance between two coordinates
function getDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  return Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
}

// Cluster reports based on zoom level
interface ClusteredReport {
  id: string;
  coordinates: [number, number];
  reports: Report[];
  count: number;
  primaryType: Report['type'];
}

function clusterReports(reports: Report[], zoom: number): ClusteredReport[] {
  // Higher zoom = smaller cluster radius = more individual markers
  // At zoom 1, cluster within ~5 degrees; at zoom 8, show individual reports
  const clusterRadius = Math.max(0.1, 5 / zoom);

  const activeReports = reports.filter(r => r.status === 'ACTIVE' || r.status === 'UNVERIFIED');
  const clusters: ClusteredReport[] = [];
  const processed = new Set<string>();

  for (const report of activeReports) {
    if (processed.has(report.id)) continue;

    const nearby: Report[] = [report];
    processed.add(report.id);

    // Find nearby reports to cluster together
    for (const other of activeReports) {
      if (processed.has(other.id)) continue;

      const distance = getDistance(report.location.coordinates, other.location.coordinates);
      if (distance <= clusterRadius) {
        nearby.push(other);
        processed.add(other.id);
      }
    }

    // Calculate cluster center (average of all coordinates)
    const centerLng = nearby.reduce((sum, r) => sum + r.location.coordinates[0], 0) / nearby.length;
    const centerLat = nearby.reduce((sum, r) => sum + r.location.coordinates[1], 0) / nearby.length;

    // Determine primary type (most common or most severe)
    const typeCounts = nearby.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const primaryType = Object.entries(typeCounts).sort((a, b) => {
      // Prioritize RAID over others
      if (a[0] === 'RAID') return -1;
      if (b[0] === 'RAID') return 1;
      return b[1] - a[1];
    })[0][0] as Report['type'];

    clusters.push({
      id: nearby.map(r => r.id).join('-'),
      coordinates: [centerLng, centerLat],
      reports: nearby,
      count: nearby.length,
      primaryType,
    });
  }

  return clusters;
}

// Disperse hotspot coordinates based on zoom level
function getDispersedHotspots(hotspots: HotspotData[], zoom: number): (HotspotData & { dispersedCoords: [number, number] })[] {
  // At low zoom, hotspots stay at city centers
  // At higher zoom, they spread out to show more precise locations
  const dispersal = Math.min(1, (zoom - 1) / 4); // 0 at zoom 1, max at zoom 5+

  return hotspots.map((hotspot, index) => {
    // Create deterministic but varied offsets for each hotspot
    const angle = (index * 137.5) % 360; // Golden angle for good distribution
    const maxOffset = dispersal * 0.5; // Max 0.5 degrees offset at full dispersal
    const offsetLng = Math.cos(angle * Math.PI / 180) * maxOffset * (hotspot.intensity / 10);
    const offsetLat = Math.sin(angle * Math.PI / 180) * maxOffset * (hotspot.intensity / 10);

    return {
      ...hotspot,
      dispersedCoords: [
        hotspot.coordinates[0] + offsetLng,
        hotspot.coordinates[1] + offsetLat,
      ] as [number, number],
    };
  });
}

function USMap({ hotspots, reports, onSelectReport, selectedState, onSelectState }: USMapProps) {
  const [hoveredSpot, setHoveredSpot] = useState<HotspotData | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<ClusteredReport | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [-96, 38] as [number, number], zoom: 1 });

  // Cluster reports based on current zoom level
  const clusteredReports = useMemo(
    () => clusterReports(reports, position.zoom),
    [reports, position.zoom]
  );

  // Disperse hotspots based on zoom level
  const dispersedHotspots = useMemo(
    () => getDispersedHotspots(hotspots, position.zoom),
    [hotspots, position.zoom]
  );

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return '#ff3333';
    if (intensity >= 6) return '#ff6633';
    if (intensity >= 4) return '#ffaa00';
    return '#00ff00';
  };

  const getIntensitySize = (intensity: number, zoom: number) => {
    // Scale down marker size as we zoom in - smaller base sizes
    const baseSize = 2 + intensity * 0.8;
    return baseSize / Math.sqrt(zoom);
  };

  const getClusterSize = (count: number, zoom: number) => {
    // Base size on count, scale with zoom - smaller for single incidents
    const baseSize = 3 + Math.min(count * 1.5, 6);
    return baseSize / Math.sqrt(zoom);
  };

  const handleStateClick = (geo: { properties: Record<string, unknown> }) => {
    const stateName = geo.properties.name as string;
    const stateAbbr = stateNameToAbbr[stateName];
    if (stateAbbr) {
      if (selectedState === stateAbbr) {
        onSelectState(null);
      } else {
        onSelectState(stateAbbr);
      }
    }
  };

  // Clamp position to keep map in view
  const handleMoveEnd = (pos: { coordinates: [number, number]; zoom: number }) => {
    // Define bounds for the continental US (approximate projected coordinates)
    const minLng = -130;
    const maxLng = -65;
    const minLat = 22;
    const maxLat = 50;

    // Calculate how much we can pan based on zoom level
    // At higher zoom, allow more panning; at low zoom, keep centered
    const zoomFactor = Math.max(1, pos.zoom);
    const lngRange = (maxLng - minLng) / zoomFactor;
    const latRange = (maxLat - minLat) / zoomFactor;

    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    const clampedCoords: [number, number] = [
      Math.max(centerLng - lngRange, Math.min(centerLng + lngRange, pos.coordinates[0])),
      Math.max(centerLat - latRange, Math.min(centerLat + latRange, pos.coordinates[1])),
    ];

    setPosition({
      coordinates: clampedCoords,
      zoom: pos.zoom,
    });
  };

  return (
    <div className="relative w-full h-full bg-black/50 border border-accent-dim/30 rounded">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/80 border-b border-accent-dim/30 h-10">
        <div className="flex items-center gap-2">
          <span className="text-accent text-xs">[MAP]</span>
          <span className="text-accent-dim text-xs">CONTINENTAL US // LIVE FEED</span>
          <span className="text-foreground/30 text-xs ml-2">ZOOM: {position.zoom.toFixed(1)}x</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {selectedState && (
            <button
              onClick={() => onSelectState(null)}
              className="px-2 py-0.5 bg-accent/20 text-accent border border-accent/30 text-xs hover:bg-accent/30 transition-colors"
            >
              {selectedState} ×
            </button>
          )}
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span className="text-danger-dim">CRITICAL</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-warning/70">ELEVATED</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-accent-dim">NORMAL</span>
          </div>
        </div>
      </div>

      {/* Hover tooltip for hotspots */}
      {hoveredSpot && (
        <div className="absolute top-14 left-4 z-20 bg-black/95 border border-accent-dim/50 p-3 text-xs">
          <div className="text-accent font-bold">
            {hoveredSpot.city}, {hoveredSpot.state}
          </div>
          <div className="text-foreground/70 mt-1">
            Reports (24h): <span className="text-warning">{hoveredSpot.recentReports}</span>
          </div>
          <div className="text-foreground/70">
            Threat Level: <span style={{ color: getIntensityColor(hoveredSpot.intensity) }}>
              {hoveredSpot.intensity}/10
            </span>
          </div>
        </div>
      )}

      {/* Hover tooltip for report clusters */}
      {hoveredCluster && !hoveredSpot && (
        <div className="absolute top-14 left-4 z-20 bg-black/95 border border-accent-dim/50 p-3 text-xs">
          <div className="text-danger font-bold">
            {hoveredCluster.count} {hoveredCluster.count === 1 ? 'INCIDENT' : 'INCIDENTS'}
          </div>
          <div className="text-foreground/70 mt-1">
            Primary Type: <span className="text-warning">{hoveredCluster.primaryType}</span>
          </div>
          {hoveredCluster.count > 1 && position.zoom < 4 && (
            <div className="text-accent-dim mt-1">
              Zoom in for details
            </div>
          )}
          {hoveredCluster.reports.slice(0, 3).map((r) => (
            <div key={r.id} className="text-foreground/50 mt-1 truncate max-w-48">
              → {r.location.city}: {r.description.slice(0, 30)}...
            </div>
          ))}
        </div>
      )}

      {/* State hover tooltip */}
      {hoveredState && !hoveredSpot && !hoveredCluster && (
        <div className="absolute top-14 left-4 z-20 bg-black/95 border border-accent-dim/50 px-3 py-2 text-xs">
          <span className="text-foreground/70">Click to filter: </span>
          <span className="text-accent">{hoveredState}</span>
        </div>
      )}

      {/* Map */}
      <ComposableMap
        projection="geoAlbersUsa"
        className="w-full h-full"
        style={{ backgroundColor: 'transparent' }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name as string;
                const stateAbbr = stateNameToAbbr[stateName];
                const isSelected = selectedState === stateAbbr;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? '#0a2a0a' : '#1a1a1a'}
                    stroke={isSelected ? '#00ff00' : '#00aa00'}
                    strokeWidth={(isSelected ? 1 : 0.5) / position.zoom}
                    onClick={() => handleStateClick(geo)}
                    onMouseEnter={() => setHoveredState(stateName)}
                    onMouseLeave={() => setHoveredState(null)}
                    style={{
                      default: { outline: 'none', cursor: 'pointer' },
                      hover: { fill: '#0a2a0a', outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Hotspot markers with subtle pulse effect */}
          {dispersedHotspots.map((hotspot, index) => {
            const size = getIntensitySize(hotspot.intensity, position.zoom);
            return (
              <Marker
                key={`hotspot-${index}`}
                coordinates={hotspot.dispersedCoords}
                onMouseEnter={() => setHoveredSpot(hotspot)}
                onMouseLeave={() => setHoveredSpot(null)}
              >
                {/* Subtle outer pulse ring - smaller radius */}
                <circle
                  r={size * 1.3}
                  fill={getIntensityColor(hotspot.intensity)}
                  opacity={0.15}
                  className="pulse-ring"
                />
                {/* Main dot */}
                <circle
                  r={size}
                  fill={getIntensityColor(hotspot.intensity)}
                  stroke="#000"
                  strokeWidth={0.3 / position.zoom}
                  style={{ cursor: 'pointer' }}
                />
                {/* Center glow - smaller */}
                <circle
                  r={size * 0.3}
                  fill="#fff"
                  opacity={0.5}
                />
              </Marker>
            );
          })}

          {/* Clustered report markers - soft glowing pings */}
          {clusteredReports.map((cluster) => {
            const size = getClusterSize(cluster.count, position.zoom);
            const isMultiple = cluster.count > 1;
            const color = cluster.primaryType === 'RAID' ? '#ff3333' : '#ffaa00';

            return (
              <Marker
                key={cluster.id}
                coordinates={cluster.coordinates}
                onClick={() => {
                  if (cluster.count === 1) {
                    onSelectReport?.(cluster.reports[0]);
                  }
                }}
                onMouseEnter={() => setHoveredCluster(cluster)}
                onMouseLeave={() => setHoveredCluster(null)}
              >
                <g style={{ cursor: 'pointer' }}>
                  {/* Soft outer glow */}
                  <circle
                    r={size * 1.5}
                    fill={color}
                    opacity={0.15}
                    className="incident-glow"
                  />
                  {/* Main ping dot */}
                  <circle
                    r={size}
                    fill={color}
                    stroke={color}
                    strokeWidth={0.3 / position.zoom}
                    opacity={0.85}
                    className="incident-ping"
                  />
                  {/* Inner bright core */}
                  <circle
                    r={size * 0.4}
                    fill="#fff"
                    opacity={0.6}
                  />
                  {/* Count indicator for clusters */}
                  {isMultiple && (
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#000"
                      fontSize={size * 0.7}
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {cluster.count}
                    </text>
                  )}
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div className="absolute bottom-14 right-4 z-10 flex flex-col gap-1">
        <button
          onClick={() => setPosition(p => ({ ...p, zoom: Math.min(8, p.zoom * 1.5) }))}
          className="w-8 h-8 bg-black/80 border border-accent-dim/50 text-accent text-sm hover:bg-accent/20 transition-colors flex items-center justify-center"
        >
          +
        </button>
        <button
          onClick={() => setPosition(p => ({ ...p, zoom: Math.max(1, p.zoom / 1.5) }))}
          className="w-8 h-8 bg-black/80 border border-accent-dim/50 text-accent text-sm hover:bg-accent/20 transition-colors flex items-center justify-center"
        >
          −
        </button>
        <button
          onClick={() => setPosition({ coordinates: [-96, 38], zoom: 1 })}
          className="w-8 h-8 bg-black/80 border border-accent-dim/50 text-accent text-xs hover:bg-accent/20 transition-colors flex items-center justify-center"
          title="Reset view"
        >
          ⌂
        </button>
      </div>

      {/* Grid overlay effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-12 left-2 w-4 h-4 border-l border-t border-accent-dim/50" />
      <div className="absolute top-12 right-2 w-4 h-4 border-r border-t border-accent-dim/50" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-accent-dim/50" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-accent-dim/50" />
    </div>
  );
}

export default memo(USMap);
