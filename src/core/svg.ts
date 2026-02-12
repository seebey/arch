import { Point } from './types.js';

export interface StyleProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fontSize?: number;
  fontFamily?: string;
  textAnchor?: 'start' | 'middle' | 'end';
}

function styleAttrs(props: StyleProps): string {
  const attrs: string[] = [];
  if (props.fill) attrs.push(`fill="${props.fill}"`);
  if (props.stroke) attrs.push(`stroke="${props.stroke}"`);
  if (props.strokeWidth) attrs.push(`stroke-width="${props.strokeWidth}"`);
  if (props.strokeDasharray) attrs.push(`stroke-dasharray="${props.strokeDasharray}"`);
  if (props.fontSize) attrs.push(`font-size="${props.fontSize}"`);
  if (props.fontFamily) attrs.push(`font-family="${props.fontFamily}"`);
  if (props.textAnchor) attrs.push(`text-anchor="${props.textAnchor}"`);
  return attrs.join(' ');
}

export function rect(x: number, y: number, width: number, height: number, props: StyleProps = {}): string {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" ${styleAttrs(props)}/>`;
}

export function line(x1: number, y1: number, x2: number, y2: number, props: StyleProps = {}): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${styleAttrs(props)}/>`;
}

export function text(x: number, y: number, content: string, props: StyleProps = {}): string {
  return `<text x="${x}" y="${y}" ${styleAttrs(props)}>${content}</text>`;
}

export function path(d: string, props: StyleProps = {}): string {
  return `<path d="${d}" ${styleAttrs(props)}/>`;
}

export function polyline(points: Point[], props: StyleProps = {}): string {
  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
  return `<polyline points="${pointsStr}" ${styleAttrs(props)}/>`;
}

export function group(content: string, transform?: string): string {
  const transformAttr = transform ? ` transform="${transform}"` : '';
  return `<g${transformAttr}>${content}</g>`;
}

export function svgDoc(width: number, height: number, content: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<style>
  text { font-family: 'Helvetica Neue', Arial, sans-serif; }
</style>
${content}
</svg>`;
}
