'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { geoAlbersUsa, geoPath, GeoPath, GeoProjection } from 'd3-geo';
import type { UseMapRendererOptions, StateFeature } from './mapTypes';
import {
  COLORS,
  STATE_NAME_TO_ABBR,
  getIntensitySize,
  getClusterSize,
} from './mapConstants';
import {
  renderGlowBorder,
  renderStateFill,
  renderHotspotWithBloom,
  renderClusterMarker,
  renderScanlines,
  renderVignette,
  getFlickerOpacity,
  clearCanvas,
} from './mapEffects';

/**
 * Hook for rendering the map to canvas layers
 */
export function useMapRenderer({
  baseCanvasRef,
  markersCanvasRef,
  effectsCanvasRef,
  width,
  height,
  geographies,
  position,
  selectedState,
  hoveredItem,
  dispersedHotspots,
  clusteredReports,
}: UseMapRendererOptions): void {
  // Animation frame reference
  const animationRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(0);

  // Create projection
  const projection = useMemo((): GeoProjection | null => {
    if (width === 0 || height === 0) return null;
    return geoAlbersUsa()
      .scale(width * 1.3)
      .translate([width / 2, height / 2]);
  }, [width, height]);

  // Cache Path2D objects for each state
  const pathCache = useMemo(() => {
    if (!projection || geographies.length === 0) return new Map<string, Path2D>();

    const cache = new Map<string, Path2D>();
    const pathGenerator = geoPath(projection);

    for (const geo of geographies) {
      const pathString = pathGenerator(geo);
      if (pathString) {
        const path = new Path2D(pathString);
        cache.set(geo.properties.name, path);
      }
    }

    return cache;
  }, [projection, geographies]);

  /**
   * Apply zoom and pan transform to canvas context
   */
  const applyTransform = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!projection) return;

      const centerProjected = projection(position.center);
      if (!centerProjected) return;

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Apply zoom centered on map center, then pan
      ctx.translate(width / 2, height / 2);
      ctx.scale(position.zoom, position.zoom);
      ctx.translate(-centerProjected[0], -centerProjected[1]);
    },
    [projection, position.center, position.zoom, width, height]
  );

  /**
   * Render base map layer (state polygons with glow borders)
   */
  const renderBaseLayer = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!projection || pathCache.size === 0) return;

      // Clear canvas
      clearCanvas(ctx, width, height, 'transparent');

      // Apply transform
      applyTransform(ctx);

      // Get hovered state name
      const hoveredStateName =
        hoveredItem?.type === 'state' ? hoveredItem.stateName : null;

      // First pass: render all fills
      for (const geo of geographies) {
        const path = pathCache.get(geo.properties.name);
        if (!path) continue;

        const stateName = geo.properties.name;
        const stateAbbr = STATE_NAME_TO_ABBR[stateName];
        const isSelected = selectedState === stateAbbr;
        const isHovered = hoveredStateName === stateName;

        renderStateFill(ctx, path, isSelected, isHovered);
      }

      // Second pass: render all borders with glow
      for (const geo of geographies) {
        const path = pathCache.get(geo.properties.name);
        if (!path) continue;

        const stateName = geo.properties.name;
        const stateAbbr = STATE_NAME_TO_ABBR[stateName];
        const isSelected = selectedState === stateAbbr;
        const isHovered = hoveredStateName === stateName;

        renderGlowBorder(ctx, path, isSelected, isHovered, position.zoom);
      }

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    [
      projection,
      pathCache,
      width,
      height,
      applyTransform,
      geographies,
      selectedState,
      hoveredItem,
      position.zoom,
    ]
  );

  /**
   * Render markers layer (hotspots and clusters)
   */
  const renderMarkersLayer = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!projection) return;

      // Clear canvas
      clearCanvas(ctx, width, height);

      // Apply transform
      applyTransform(ctx);

      // Get hovered marker for highlight
      const hoveredHotspotCoords =
        hoveredItem?.type === 'hotspot'
          ? hoveredItem.data.dispersedCoords
          : null;
      const hoveredClusterId =
        hoveredItem?.type === 'cluster' ? hoveredItem.data.id : null;

      // Render hotspots
      for (const hotspot of dispersedHotspots) {
        const projected = projection(hotspot.dispersedCoords);
        if (!projected) continue;

        // Check if within visible bounds (with margin)
        // Skip this check for now - let canvas clip
        const isHovered =
          hoveredHotspotCoords &&
          hoveredHotspotCoords[0] === hotspot.dispersedCoords[0] &&
          hoveredHotspotCoords[1] === hotspot.dispersedCoords[1];

        renderHotspotWithBloom(
          ctx,
          projected[0],
          projected[1],
          hotspot.intensity,
          position.zoom,
          isHovered || false
        );
      }

      // Render clusters
      for (const cluster of clusteredReports) {
        const projected = projection(cluster.coordinates);
        if (!projected) continue;

        const isHovered = hoveredClusterId === cluster.id;

        renderClusterMarker(
          ctx,
          projected[0],
          projected[1],
          cluster.count,
          cluster.primaryType,
          position.zoom,
          isHovered
        );
      }

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    [
      projection,
      width,
      height,
      applyTransform,
      dispersedHotspots,
      clusteredReports,
      hoveredItem,
      position.zoom,
    ]
  );

  /**
   * Render effects layer (scanlines, vignette)
   * Note: This layer is static except for flicker which is handled by CSS
   */
  const renderEffectsLayer = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Clear canvas
      clearCanvas(ctx, width, height);

      // Render scanlines
      renderScanlines(ctx, width, height);

      // Render vignette
      renderVignette(ctx, width, height);
    },
    [width, height]
  );

  /**
   * Main render function called on each animation frame
   */
  const render = useCallback(
    (timestamp: number) => {
      // Throttle to ~60fps
      const elapsed = timestamp - lastFrameTimeRef.current;
      if (elapsed < 16) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      // Get canvas contexts
      const baseCtx = baseCanvasRef.current?.getContext('2d');
      const markersCtx = markersCanvasRef.current?.getContext('2d');
      const effectsCtx = effectsCanvasRef.current?.getContext('2d');

      if (!baseCtx || !markersCtx || !effectsCtx) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      // Render layers
      renderBaseLayer(baseCtx);
      renderMarkersLayer(markersCtx);

      // Schedule next frame
      animationRef.current = requestAnimationFrame(render);
    },
    [baseCanvasRef, markersCanvasRef, effectsCanvasRef, renderBaseLayer, renderMarkersLayer]
  );

  // Set canvas dimensions and pixel ratio
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;

    const canvases = [
      baseCanvasRef.current,
      markersCanvasRef.current,
      effectsCanvasRef.current,
    ];

    for (const canvas of canvases) {
      if (!canvas) continue;

      // Set display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set actual size in memory (scaled for retina)
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Scale context to account for pixel ratio
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }

    // Render effects layer once (static)
    const effectsCtx = effectsCanvasRef.current?.getContext('2d');
    if (effectsCtx) {
      renderEffectsLayer(effectsCtx);
    }
  }, [width, height, baseCanvasRef, markersCanvasRef, effectsCanvasRef, renderEffectsLayer]);

  // Start/stop animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [render]);

  // Re-render effects when dimensions change
  useEffect(() => {
    const effectsCtx = effectsCanvasRef.current?.getContext('2d');
    if (effectsCtx && width > 0 && height > 0) {
      renderEffectsLayer(effectsCtx);
    }
  }, [effectsCanvasRef, width, height, renderEffectsLayer]);
}
