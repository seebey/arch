import { StyleProps } from '../core/svg.js';

export const SCALE = {
  pixelsPerFoot: 12,
  quarterInchScale: true
} as const;

export const STYLES: Record<string, StyleProps> = {
  exteriorWall: {
    fill: 'black',
    stroke: 'black',
    strokeWidth: 3
  },
  interiorWall: {
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2
  },
  door: {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 1
  },
  doorSwing: {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 1,
    strokeDasharray: '4,2'
  },
  window: {
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1
  },
  dimension: {
    fill: 'none',
    stroke: 'black',
    strokeWidth: 0.5
  },
  dimensionText: {
    fontSize: 8,
    textAnchor: 'middle'
  },
  roomLabel: {
    fontSize: 10,
    textAnchor: 'middle'
  },
  roomDimension: {
    fontSize: 7,
    textAnchor: 'middle'
  },
  titleBlock: {
    fontSize: 14,
    textAnchor: 'start'
  },
  hidden: {
    fill: 'none',
    stroke: 'gray',
    strokeWidth: 1,
    strokeDasharray: '2,2'
  }
} as const;

export function feetToPixels(feet: number): number {
  return feet * SCALE.pixelsPerFoot;
}

export function pixelsToFeet(pixels: number): number {
  return pixels / SCALE.pixelsPerFoot;
}
