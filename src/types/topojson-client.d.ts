declare module 'topojson-client' {
  import type { Topology, Objects, GeometryObject } from 'topojson-specification';
  import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

  export function feature<T extends GeometryObject, P extends GeoJsonProperties = GeoJsonProperties>(
    topology: Topology,
    object: T | string
  ): Feature<Geometry, P> | FeatureCollection<Geometry, P>;

  export function mesh<T extends GeometryObject>(
    topology: Topology,
    object?: T,
    filter?: (a: T, b: T) => boolean
  ): import('geojson').MultiLineString;

  export function meshArcs<T extends GeometryObject>(
    topology: Topology,
    object?: T,
    filter?: (a: T, b: T) => boolean
  ): number[][];

  export function merge<T extends GeometryObject>(
    topology: Topology,
    objects: T[]
  ): import('geojson').MultiPolygon;

  export function mergeArcs<T extends GeometryObject>(
    topology: Topology,
    objects: T[]
  ): import('geojson').MultiPolygon;

  export function neighbors<T extends GeometryObject>(objects: T[]): number[][];

  export function bbox(topology: Topology): [number, number, number, number];

  export function quantize<T extends Topology>(topology: T, transform: number): T;

  export function transform(topology: Topology): (point: number[], index?: number) => number[];

  export function untransform(topology: Topology): (point: number[], index?: number) => number[];
}
