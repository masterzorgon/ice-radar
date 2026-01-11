import type { Feature, Geometry } from 'geojson';
import type { Report, HotspotData } from '@/types';

/**
 * Map position state for zoom and pan
 */
export interface MapPosition {
  center: [number, number]; // [longitude, latitude] - geo coordinates
  zoom: number;
}

/**
 * Canvas transform for rendering
 */
export interface Transform {
  k: number;  // Scale factor
  x: number;  // X translation
  y: number;  // Y translation
}

/**
 * Clustered reports for rendering at low zoom levels
 */
export interface ClusteredReport {
  id: string;
  coordinates: [number, number];
  reports: Report[];
  count: number;
  primaryType: Report['type'];
}

/**
 * Hotspot with dispersed coordinates for high zoom rendering
 */
export interface DispersedHotspot extends HotspotData {
  dispersedCoords: [number, number];
}

/**
 * Type of item being hovered
 */
export type HoveredItemType = 'state' | 'hotspot' | 'cluster';

/**
 * State hover data
 */
export interface HoveredState {
  type: 'state';
  stateName: string;
  stateAbbr: string;
}

/**
 * Hotspot hover data
 */
export interface HoveredHotspot {
  type: 'hotspot';
  data: DispersedHotspot;
}

/**
 * Cluster hover data
 */
export interface HoveredCluster {
  type: 'cluster';
  data: ClusteredReport;
}

/**
 * Union type for all hovered items
 */
export type HoveredItem = HoveredState | HoveredHotspot | HoveredCluster;

/**
 * State geometry feature with properties
 */
export interface StateFeature extends Feature<Geometry> {
  properties: {
    name: string;
    [key: string]: unknown;
  };
}

/**
 * Props for the USMapCanvas component
 */
export interface USMapCanvasProps {
  hotspots: HotspotData[];
  reports: Report[];
  onSelectReport?: (report: Report) => void;
  selectedState: string | null;
  onSelectState: (state: string | null) => void;
}

/**
 * Options for the map interaction hook
 */
export interface UseMapInteractionOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  geographies: StateFeature[];
  dispersedHotspots: DispersedHotspot[];
  clusteredReports: ClusteredReport[];
  selectedState: string | null;
  onStateClick: (stateAbbr: string | null) => void;
  onClusterClick: (cluster: ClusteredReport) => void;
}

/**
 * Return type for the map interaction hook
 */
export interface UseMapInteractionReturn {
  position: MapPosition;
  setPosition: React.Dispatch<React.SetStateAction<MapPosition>>;
  hoveredItem: HoveredItem | null;
  cursor: string;
  isDragging: boolean;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleReset: () => void;
}

/**
 * Options for the map renderer hook
 */
export interface UseMapRendererOptions {
  baseCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  markersCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  effectsCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  geographies: StateFeature[];
  position: MapPosition;
  selectedState: string | null;
  hoveredItem: HoveredItem | null;
  dispersedHotspots: DispersedHotspot[];
  clusteredReports: ClusteredReport[];
}

/**
 * Touch state for pinch zoom
 */
export interface PinchState {
  distance: number;
  zoom: number;
  center: [number, number];
}
