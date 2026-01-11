declare module 'react-simple-maps' {
  import { ComponentType, ReactNode } from 'react';

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: object;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: Geography[] }) => ReactNode;
  }

  export interface Geography {
    rsmKey: string;
    properties: Record<string, unknown>;
    geometry: object;
  }

  export interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties & { outline?: string };
      hover?: React.CSSProperties & { outline?: string };
      pressed?: React.CSSProperties & { outline?: string };
    };
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
}
