/**
 * CRT visual effects for canvas rendering
 */

import { COLORS, getIntensityColor, getIntensitySize, getClusterSize } from './mapConstants';

/**
 * Render scanline overlay effect
 * Creates horizontal lines every 2px with subtle opacity
 */
export function renderScanlines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  for (let y = 0; y < height; y += 2) {
    ctx.fillRect(0, y, width, 1);
  }
}

/**
 * Render vignette effect
 * Darkens the edges of the canvas for CRT monitor look
 */
export function renderVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.max(width, height) * 0.7;

  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, radius
  );
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(0.6, 'transparent');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Get screen flicker opacity based on timestamp
 * Subtle opacity variation on a 4-second cycle
 */
export function getFlickerOpacity(timestamp: number): number {
  const cycle = (timestamp % 4000) / 4000;

  // Very subtle flicker at specific points in the cycle
  if (cycle > 0.97 && cycle < 0.98) return 0.97;
  if (cycle > 0.98 && cycle < 0.99) return 0.99;
  return 1;
}

/**
 * Render a state border with phosphor glow effect
 * Uses two-pass rendering: outer glow + sharp inner line
 */
export function renderGlowBorder(
  ctx: CanvasRenderingContext2D,
  path: Path2D,
  isSelected: boolean,
  isHovered: boolean,
  zoom: number
): void {
  const glowColor = isSelected ? COLORS.stateSelectedBorder : COLORS.stateBorder;

  ctx.save();

  // Pass 1: Outer glow (wider, with shadow blur)
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = (isSelected ? 4 : isHovered ? 3 : 2) / zoom;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = (isSelected ? 12 : isHovered ? 10 : 8) / Math.sqrt(zoom);
  ctx.stroke(path);

  // Pass 2: Sharp core line (no shadow)
  ctx.shadowBlur = 0;
  ctx.lineWidth = (isSelected ? 1 : 0.5) / zoom;
  ctx.stroke(path);

  ctx.restore();
}

/**
 * Render a state polygon with fill
 */
export function renderStateFill(
  ctx: CanvasRenderingContext2D,
  path: Path2D,
  isSelected: boolean,
  isHovered: boolean
): void {
  ctx.fillStyle = isSelected || isHovered
    ? COLORS.stateSelectedFill
    : COLORS.stateFill;
  ctx.fill(path);
}

/**
 * Render a hotspot marker with bloom effect
 * Higher intensity markers get more bloom layers
 */
export function renderHotspotWithBloom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  intensity: number,
  zoom: number,
  isHovered: boolean
): void {
  const size = getIntensitySize(intensity, zoom);
  const color = getIntensityColor(intensity);

  // Determine bloom level based on intensity
  const bloomLevels = intensity >= 8 ? 3 : intensity >= 6 ? 2 : 1;

  ctx.save();

  // Render bloom layers (outer to inner)
  for (let i = bloomLevels; i >= 0; i--) {
    const bloomSize = size * (1 + i * 0.5);
    const alpha = i === 0 ? 1 : 0.15 / i;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, bloomSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer pulse ring (animated via CSS on overlay)
  if (isHovered) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Main dot with dark stroke
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 0.3 / zoom;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Center highlight
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Render a cluster marker for grouped reports
 */
export function renderClusterMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  count: number,
  primaryType: string,
  zoom: number,
  isHovered: boolean
): void {
  const size = getClusterSize(count, zoom);
  const color = primaryType === 'RAID' ? COLORS.danger : COLORS.warning;

  ctx.save();

  // Soft outer glow
  ctx.globalAlpha = isHovered ? 0.35 : 0.2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Main ping dot
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.3 / zoom;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner bright core
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Count indicator for clusters with multiple reports
  if (count > 1) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.max(8, size * 0.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(count), x, y);
  }

  ctx.restore();
}

/**
 * Render the grid overlay effect
 */
export function renderGridOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number = 50
): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Clear canvas with optional background color
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor?: string
): void {
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }
}
