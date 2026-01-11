'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { geoAlbersUsa, geoContains, GeoProjection } from 'd3-geo';
import type {
  MapPosition,
  UseMapInteractionOptions,
  UseMapInteractionReturn,
  HoveredItem,
  StateFeature,
  DispersedHotspot,
  ClusteredReport,
  PinchState,
} from './mapTypes';
import {
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_FACTOR,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MAP_BOUNDS,
  STATE_NAME_TO_ABBR,
  getIntensitySize,
  getClusterSize,
} from './mapConstants';

/**
 * Calculate distance between two touch points
 */
function getTouchDistance(touches: TouchList): number {
  if (touches.length < 2) return 0;
  const dx = touches[1].clientX - touches[0].clientX;
  const dy = touches[1].clientY - touches[0].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate center point between two touches
 */
function getTouchCenter(touches: TouchList): [number, number] {
  if (touches.length < 2) {
    return [touches[0].clientX, touches[0].clientY];
  }
  return [
    (touches[0].clientX + touches[1].clientX) / 2,
    (touches[0].clientY + touches[1].clientY) / 2,
  ];
}

/**
 * Clamp map center to keep map within visible bounds
 */
function clampCenter(
  center: [number, number],
  zoom: number
): [number, number] {
  const zoomFactor = Math.max(1, zoom);
  const lngRange = (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng) / zoomFactor;
  const latRange = (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) / zoomFactor;

  const centerLng = (MAP_BOUNDS.minLng + MAP_BOUNDS.maxLng) / 2;
  const centerLat = (MAP_BOUNDS.minLat + MAP_BOUNDS.maxLat) / 2;

  return [
    Math.max(centerLng - lngRange, Math.min(centerLng + lngRange, center[0])),
    Math.max(centerLat - latRange, Math.min(centerLat + latRange, center[1])),
  ];
}

/**
 * Hook for handling map interactions: zoom, pan, click, and hover
 */
export function useMapInteraction({
  containerRef,
  canvasRef,
  width,
  height,
  geographies,
  dispersedHotspots,
  clusteredReports,
  selectedState,
  onStateClick,
  onClusterClick,
}: UseMapInteractionOptions): UseMapInteractionReturn {
  // Map position state
  const [position, setPosition] = useState<MapPosition>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  // Interaction state
  const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cursor, setCursor] = useState('grab');

  // Refs for drag tracking
  const dragStartRef = useRef<[number, number] | null>(null);
  const lastPositionRef = useRef<[number, number] | null>(null);
  const pinchStateRef = useRef<PinchState | null>(null);

  // Create projection based on current dimensions
  const projection = useCallback((): GeoProjection | null => {
    if (width === 0 || height === 0) return null;
    return geoAlbersUsa()
      .scale(width * 1.3)
      .translate([width / 2, height / 2]);
  }, [width, height]);

  /**
   * Convert screen coordinates to geo coordinates
   */
  const screenToGeo = useCallback(
    (screenPoint: [number, number]): [number, number] | null => {
      const proj = projection();
      if (!proj) return null;

      // Adjust for zoom and pan
      const adjustedX = (screenPoint[0] - width / 2) / position.zoom + width / 2;
      const adjustedY = (screenPoint[1] - height / 2) / position.zoom + height / 2;

      // Account for center offset
      const centerOffset = proj(position.center);
      if (!centerOffset) return null;

      const offsetX = adjustedX + (centerOffset[0] - width / 2);
      const offsetY = adjustedY + (centerOffset[1] - height / 2);

      return proj.invert?.([offsetX, offsetY]) || null;
    },
    [projection, position.center, position.zoom, width, height]
  );

  /**
   * Convert geo coordinates to screen coordinates
   */
  const geoToScreen = useCallback(
    (geoPoint: [number, number]): [number, number] | null => {
      const proj = projection();
      if (!proj) return null;

      const projected = proj(geoPoint);
      if (!projected) return null;

      const centerOffset = proj(position.center);
      if (!centerOffset) return null;

      // Apply zoom and pan
      const screenX =
        (projected[0] - centerOffset[0]) * position.zoom + width / 2;
      const screenY =
        (projected[1] - centerOffset[1]) * position.zoom + height / 2;

      return [screenX, screenY];
    },
    [projection, position.center, position.zoom, width, height]
  );

  /**
   * Find state at screen point using geo containment
   */
  const getStateAtPoint = useCallback(
    (screenPoint: [number, number]): StateFeature | null => {
      const geoPoint = screenToGeo(screenPoint);
      if (!geoPoint) return null;

      for (const feature of geographies) {
        if (geoContains(feature, geoPoint)) {
          return feature;
        }
      }
      return null;
    },
    [screenToGeo, geographies]
  );

  /**
   * Find hotspot at screen point using distance check
   */
  const getHotspotAtPoint = useCallback(
    (screenPoint: [number, number]): DispersedHotspot | null => {
      for (let i = dispersedHotspots.length - 1; i >= 0; i--) {
        const hotspot = dispersedHotspots[i];
        const projected = geoToScreen(hotspot.dispersedCoords);
        if (!projected) continue;

        const size = getIntensitySize(hotspot.intensity, position.zoom) * position.zoom;
        const dx = screenPoint[0] - projected[0];
        const dy = screenPoint[1] - projected[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= size + 4) {
          return hotspot;
        }
      }
      return null;
    },
    [geoToScreen, dispersedHotspots, position.zoom]
  );

  /**
   * Find cluster at screen point using distance check
   */
  const getClusterAtPoint = useCallback(
    (screenPoint: [number, number]): ClusteredReport | null => {
      for (let i = clusteredReports.length - 1; i >= 0; i--) {
        const cluster = clusteredReports[i];
        const projected = geoToScreen(cluster.coordinates);
        if (!projected) continue;

        const size = getClusterSize(cluster.count, position.zoom) * position.zoom;
        const dx = screenPoint[0] - projected[0];
        const dy = screenPoint[1] - projected[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= size + 4) {
          return cluster;
        }
      }
      return null;
    },
    [geoToScreen, clusteredReports, position.zoom]
  );

  /**
   * Handle mouse move for hover detection
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const point: [number, number] = [
        e.clientX - rect.left,
        e.clientY - rect.top,
      ];

      // Handle dragging
      if (isDragging && lastPositionRef.current) {
        const dx = e.clientX - lastPositionRef.current[0];
        const dy = e.clientY - lastPositionRef.current[1];
        lastPositionRef.current = [e.clientX, e.clientY];

        // Convert pixel delta to geo delta
        const proj = projection();
        if (proj) {
          const scale = proj.scale() * position.zoom;
          const geoOffset: [number, number] = [
            -dx / scale * 100,
            dy / scale * 100,
          ];

          setPosition((prev) => ({
            ...prev,
            center: clampCenter(
              [prev.center[0] + geoOffset[0], prev.center[1] + geoOffset[1]],
              prev.zoom
            ),
          }));
        }
        return;
      }

      // Priority: clusters > hotspots > states
      const cluster = getClusterAtPoint(point);
      if (cluster) {
        setHoveredItem({ type: 'cluster', data: cluster });
        setCursor('pointer');
        return;
      }

      const hotspot = getHotspotAtPoint(point);
      if (hotspot) {
        setHoveredItem({ type: 'hotspot', data: hotspot });
        setCursor('pointer');
        return;
      }

      const state = getStateAtPoint(point);
      if (state) {
        const stateName = state.properties.name;
        const stateAbbr = STATE_NAME_TO_ABBR[stateName] || '';
        setHoveredItem({ type: 'state', stateName, stateAbbr });
        setCursor('pointer');
        return;
      }

      setHoveredItem(null);
      setCursor(isDragging ? 'grabbing' : 'grab');
    },
    [
      canvasRef,
      isDragging,
      projection,
      position.zoom,
      getClusterAtPoint,
      getHotspotAtPoint,
      getStateAtPoint,
    ]
  );

  /**
   * Handle mouse down for drag start
   */
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      dragStartRef.current = [e.clientX, e.clientY];
      lastPositionRef.current = [e.clientX, e.clientY];
      setCursor('grabbing');
    },
    []
  );

  /**
   * Handle mouse up for drag end and click detection
   */
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      const wasDragging = isDragging;
      const dragStart = dragStartRef.current;

      setIsDragging(false);
      dragStartRef.current = null;
      lastPositionRef.current = null;
      setCursor('grab');

      // Check if this was a click (minimal drag distance)
      if (wasDragging && dragStart) {
        const dx = e.clientX - dragStart[0];
        const dy = e.clientY - dragStart[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          // This was a click
          const canvas = canvasRef.current;
          if (!canvas) return;

          const rect = canvas.getBoundingClientRect();
          const point: [number, number] = [
            e.clientX - rect.left,
            e.clientY - rect.top,
          ];

          // Check clusters first
          const cluster = getClusterAtPoint(point);
          if (cluster) {
            onClusterClick(cluster);
            return;
          }

          // Check states
          const state = getStateAtPoint(point);
          if (state) {
            const stateName = state.properties.name;
            const stateAbbr = STATE_NAME_TO_ABBR[stateName];
            if (stateAbbr) {
              onStateClick(selectedState === stateAbbr ? null : stateAbbr);
            }
          }
        }
      }
    },
    [
      isDragging,
      canvasRef,
      getClusterAtPoint,
      getStateAtPoint,
      onClusterClick,
      onStateClick,
      selectedState,
    ]
  );

  /**
   * Handle mouse wheel for zoom
   */
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Determine zoom direction
      const delta = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, position.zoom * delta));

      if (newZoom === position.zoom) return;

      // Zoom toward mouse position
      const proj = projection();
      if (!proj) return;

      const geoPoint = screenToGeo([mouseX, mouseY]);
      if (!geoPoint) return;

      // Calculate new center to keep mouse point stationary
      const scale = newZoom / position.zoom;
      const newCenter: [number, number] = [
        position.center[0] + (geoPoint[0] - position.center[0]) * (1 - 1 / scale),
        position.center[1] + (geoPoint[1] - position.center[1]) * (1 - 1 / scale),
      ];

      setPosition({
        zoom: newZoom,
        center: clampCenter(newCenter, newZoom),
      });
    },
    [canvasRef, position, projection, screenToGeo]
  );

  /**
   * Handle touch start for pan/pinch
   */
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1) {
        // Single touch - start pan
        setIsDragging(true);
        lastPositionRef.current = [e.touches[0].clientX, e.touches[0].clientY];
        pinchStateRef.current = null;
      } else if (e.touches.length === 2) {
        // Two touches - start pinch zoom
        const distance = getTouchDistance(e.touches);
        const center = getTouchCenter(e.touches);
        pinchStateRef.current = {
          distance,
          zoom: position.zoom,
          center: [center[0], center[1]],
        };
        setIsDragging(false);
      }
    },
    [position.zoom]
  );

  /**
   * Handle touch move for pan/pinch
   */
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1 && isDragging && lastPositionRef.current) {
        // Single touch pan
        const dx = e.touches[0].clientX - lastPositionRef.current[0];
        const dy = e.touches[0].clientY - lastPositionRef.current[1];
        lastPositionRef.current = [e.touches[0].clientX, e.touches[0].clientY];

        const proj = projection();
        if (proj) {
          const scale = proj.scale() * position.zoom;
          const geoOffset: [number, number] = [
            -dx / scale * 100,
            dy / scale * 100,
          ];

          setPosition((prev) => ({
            ...prev,
            center: clampCenter(
              [prev.center[0] + geoOffset[0], prev.center[1] + geoOffset[1]],
              prev.zoom
            ),
          }));
        }
      } else if (e.touches.length === 2 && pinchStateRef.current) {
        // Pinch zoom
        const newDistance = getTouchDistance(e.touches);
        const scale = newDistance / pinchStateRef.current.distance;
        const newZoom = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, pinchStateRef.current.zoom * scale)
        );

        setPosition((prev) => ({
          ...prev,
          zoom: newZoom,
          center: clampCenter(prev.center, newZoom),
        }));
      }
    },
    [isDragging, projection, position.zoom]
  );

  /**
   * Handle touch end
   */
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    lastPositionRef.current = null;
    pinchStateRef.current = null;
  }, []);

  /**
   * Handle mouse leave
   */
  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      lastPositionRef.current = null;
    }
    setCursor('grab');
  }, [isDragging]);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    containerRef,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, prev.zoom * ZOOM_FACTOR),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.max(MIN_ZOOM, prev.zoom / ZOOM_FACTOR),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setPosition({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });
  }, []);

  return {
    position,
    setPosition,
    hoveredItem,
    cursor,
    isDragging,
    handleZoomIn,
    handleZoomOut,
    handleReset,
  };
}
