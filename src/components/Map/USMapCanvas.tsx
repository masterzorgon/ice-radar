'use client';

import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';
import type { HotspotData, Report } from '@/types';
import type {
  USMapCanvasProps,
  StateFeature,
  ClusteredReport,
  DispersedHotspot,
} from './mapTypes';
import { useMapInteraction } from './useMapInteraction';
import { useMapRenderer } from './useMapRenderer';
import {
  GEO_URL,
  STATE_NAME_TO_ABBR,
  getIntensityColor,
} from './mapConstants';

/**
 * Calculate distance between two coordinates
 */
function getDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  return Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
}

/**
 * Cluster reports based on zoom level
 */
function clusterReports(reports: Report[], zoom: number): ClusteredReport[] {
  const clusterRadius = Math.max(0.1, 5 / zoom);
  const activeReports = reports.filter(
    (r) => r.status === 'ACTIVE' || r.status === 'UNVERIFIED'
  );
  const clusters: ClusteredReport[] = [];
  const processed = new Set<string>();

  for (const report of activeReports) {
    if (processed.has(report.id)) continue;

    const nearby: Report[] = [report];
    processed.add(report.id);

    for (const other of activeReports) {
      if (processed.has(other.id)) continue;

      const distance = getDistance(
        report.location.coordinates,
        other.location.coordinates
      );
      if (distance <= clusterRadius) {
        nearby.push(other);
        processed.add(other.id);
      }
    }

    const centerLng =
      nearby.reduce((sum, r) => sum + r.location.coordinates[0], 0) /
      nearby.length;
    const centerLat =
      nearby.reduce((sum, r) => sum + r.location.coordinates[1], 0) /
      nearby.length;

    const typeCounts = nearby.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const primaryType = Object.entries(typeCounts).sort((a, b) => {
      if (a[0] === 'RAID') return -1;
      if (b[0] === 'RAID') return 1;
      return b[1] - a[1];
    })[0][0] as Report['type'];

    clusters.push({
      id: nearby.map((r) => r.id).join('-'),
      coordinates: [centerLng, centerLat],
      reports: nearby,
      count: nearby.length,
      primaryType,
    });
  }

  return clusters;
}

/**
 * Disperse hotspot coordinates based on zoom level
 */
function getDispersedHotspots(
  hotspots: HotspotData[],
  zoom: number
): DispersedHotspot[] {
  const dispersal = Math.min(1, (zoom - 1) / 4);

  return hotspots.map((hotspot, index) => {
    const angle = (index * 137.5) % 360;
    const maxOffset = dispersal * 0.5;
    const offsetLng =
      Math.cos((angle * Math.PI) / 180) * maxOffset * (hotspot.intensity / 10);
    const offsetLat =
      Math.sin((angle * Math.PI) / 180) * maxOffset * (hotspot.intensity / 10);

    return {
      ...hotspot,
      dispersedCoords: [
        hotspot.coordinates[0] + offsetLng,
        hotspot.coordinates[1] + offsetLat,
      ] as [number, number],
    };
  });
}

/**
 * US Map component with Canvas rendering and CRT effects
 */
function USMapCanvas({
  hotspots,
  reports,
  onSelectReport,
  selectedState,
  onSelectState,
}: USMapCanvasProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const mapAreaRef = useRef<HTMLDivElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement>(null);
  const markersCanvasRef = useRef<HTMLCanvasElement>(null);
  const effectsCanvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [geographies, setGeographies] = useState<StateFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load TopoJSON data
  useEffect(() => {
    fetch(GEO_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load map data');
        return res.json();
      })
      .then((topology: Topology<{ states: GeometryCollection }>) => {
        const states = feature(
          topology,
          topology.objects.states
        ) as FeatureCollection<Geometry>;
        setGeographies(states.features as StateFeature[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading map data:', err);
        setError('Failed to load map data');
        setLoading(false);
      });
  }, []);

  // Observe container dimensions
  useEffect(() => {
    const mapArea = mapAreaRef.current;
    if (!mapArea) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(mapArea);
    return () => observer.disconnect();
  }, []);

  // Process data based on current zoom
  const { position, hoveredItem, cursor, handleZoomIn, handleZoomOut, handleReset } =
    useMapInteraction({
      containerRef: mapAreaRef,
      canvasRef: baseCanvasRef,
      width: dimensions.width,
      height: dimensions.height,
      geographies,
      dispersedHotspots: useMemo(
        () => getDispersedHotspots(hotspots, 1), // Will be updated below
        [hotspots]
      ),
      clusteredReports: useMemo(
        () => clusterReports(reports, 1), // Will be updated below
        [reports]
      ),
      selectedState,
      onStateClick: onSelectState,
      onClusterClick: (cluster) => {
        if (cluster.count === 1) {
          onSelectReport?.(cluster.reports[0]);
        }
      },
    });

  // Memoize processed data with actual zoom
  const clusteredReports = useMemo(
    () => clusterReports(reports, position.zoom),
    [reports, position.zoom]
  );

  const dispersedHotspots = useMemo(
    () => getDispersedHotspots(hotspots, position.zoom),
    [hotspots, position.zoom]
  );

  // Render map
  useMapRenderer({
    baseCanvasRef,
    markersCanvasRef,
    effectsCanvasRef,
    width: dimensions.width,
    height: dimensions.height,
    geographies,
    position,
    selectedState,
    hoveredItem,
    dispersedHotspots,
    clusteredReports,
  });

  // Render tooltip content based on hovered item
  const renderTooltip = () => {
    if (!hoveredItem) return null;

    if (hoveredItem.type === 'hotspot') {
      const spot = hoveredItem.data;
      return (
        <div className="absolute top-14 left-4 z-20 bg-black/95 border border-accent-dim/50 p-3 text-xs">
          <div className="text-accent font-bold">
            {spot.city}, {spot.state}
          </div>
          <div className="text-foreground/70 mt-1">
            Reports (24h): <span className="text-warning">{spot.recentReports}</span>
          </div>
          <div className="text-foreground/70">
            Threat Level:{' '}
            <span style={{ color: getIntensityColor(spot.intensity) }}>
              {spot.intensity}/10
            </span>
          </div>
        </div>
      );
    }

    if (hoveredItem.type === 'cluster') {
      const cluster = hoveredItem.data;
      return (
        <div className="absolute top-14 left-4 z-20 bg-black/95 border border-accent-dim/50 p-3 text-xs">
          <div className="text-danger font-bold">
            {cluster.count} {cluster.count === 1 ? 'INCIDENT' : 'INCIDENTS'}
          </div>
          <div className="text-foreground/70 mt-1">
            Primary Type: <span className="text-warning">{cluster.primaryType}</span>
          </div>
          {cluster.count > 1 && position.zoom < 4 && (
            <div className="text-accent-muted mt-1">Zoom in for details</div>
          )}
          {cluster.reports.slice(0, 3).map((r) => (
            <div key={r.id} className="text-foreground/50 mt-1 truncate max-w-48">
              → {r.location.city}: {r.description.slice(0, 30)}...
            </div>
          ))}
        </div>
      );
    }

    if (hoveredItem.type === 'state') {
      return (
        <div className="absolute top-14 left-4 z-20 bg-black/95 border border-accent-dim/50 px-3 py-2 text-xs">
          <span className="text-foreground/70">Click to filter: </span>
          <span className="text-accent">{hoveredItem.stateName}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black/50 border border-accent-dim/30 rounded overflow-hidden crt-flicker"
    >
      {/* CRT Overlay Effects (covering entire component) */}
      <div className="scanlines absolute inset-0 pointer-events-none z-50" />
      <div className="crt-vignette absolute inset-0 pointer-events-none z-40" />

      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/80 border-b border-accent-dim/30 h-10">
        <div className="flex items-center gap-2">
          <span className="text-accent text-xs">[MAP]</span>
          <span className="text-accent-muted text-xs">U.S.A.</span>
          <span className="text-foreground/30 text-xs ml-2">
            ZOOM: {position.zoom.toFixed(1)}x
          </span>
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
            <span className="text-accent-muted">NORMAL</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-accent text-xs">
            {'>'} LOADING MAP DATA<span className="cursor-blink"></span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-danger text-xs">[ERROR] {error}</div>
        </div>
      )}

      {/* Map Area (canvases stack here) */}
      <div
        ref={mapAreaRef}
        className="absolute inset-0 top-10"
        style={{ cursor }}
      >
        <canvas
          ref={baseCanvasRef}
          className="absolute inset-0"
        />
        <canvas
          ref={markersCanvasRef}
          className="absolute inset-0"
        />
        <canvas
          ref={effectsCanvasRef}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Tooltip */}
      {renderTooltip()}

      {/* Zoom Controls */}
      <div className="absolute bottom-14 right-4 z-20 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-black/80 border border-accent-dim/50 text-accent text-sm hover:bg-accent/20 transition-colors flex items-center justify-center"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-black/80 border border-accent-dim/50 text-accent text-sm hover:bg-accent/20 transition-colors flex items-center justify-center"
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 bg-black/80 border border-accent-dim/50 text-accent text-xs hover:bg-accent/20 transition-colors flex items-center justify-center"
          title="Reset view"
        >
          ⌂
        </button>
      </div>

      {/* Grid Overlay Effect */}
      <div
        className="absolute inset-0 top-10 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Corner Decorations */}
      <div className="absolute top-12 left-2 w-4 h-4 border-l border-t border-accent-dim/50" />
      <div className="absolute top-12 right-2 w-4 h-4 border-r border-t border-accent-dim/50" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-accent-dim/50" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-accent-dim/50" />
    </div>
  );
}

export default memo(USMapCanvas);
